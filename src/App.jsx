import React, { useEffect, useMemo, useState } from "react";
import OpeningScreen from "./components/OpeningScreen";
import Home from "./pages/Home";

export default function App() {
  // phases: intro -> glitch -> home
  const [phase, setPhase] = useState("intro");

  const prefersReducedMotion = useMemo(() => {
    if (typeof window === "undefined" || !window.matchMedia) return false;
    return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  }, []);

  // When opening finishes, do a short glitch-break transition into home
  const handleFinish = () => {
    if (prefersReducedMotion) {
      setPhase("home");
      return;
    }
    setPhase("glitch");
  };

  useEffect(() => {
    if (phase !== "glitch") return;
    const t = window.setTimeout(() => setPhase("home"), 950);
    return () => window.clearTimeout(t);
  }, [phase]);

  return (
    <>
      {/* Tiny CSS injector so you don't need extra files */}
      <style>{`
        .dol-glitchWrap{position:fixed;inset:0;z-index:9999;pointer-events:none;}
        .dol-glitchBg{position:absolute;inset:0;background:radial-gradient(1200px 800px at 50% 40%, rgba(255,255,255,.06), rgba(0,0,0,.65));opacity:0;}
        .dol-scan{position:absolute;inset:-20%;background:repeating-linear-gradient(0deg, rgba(255,255,255,.0) 0px, rgba(255,255,255,.0) 2px, rgba(255,255,255,.06) 3px);mix-blend-mode:overlay;opacity:0;transform:translateY(-8%);}
        .dol-rgb{position:absolute;inset:0;opacity:0;filter:blur(.2px) contrast(130%) saturate(140%);
          background:
            radial-gradient(800px 500px at 30% 40%, rgba(255,0,90,.12), transparent 60%),
            radial-gradient(800px 500px at 70% 60%, rgba(0,180,255,.12), transparent 60%);
          mix-blend-mode:screen;
        }
        .dol-slice{position:absolute;left:0;right:0;height:14px;background:rgba(255,255,255,.08);mix-blend-mode:overlay;opacity:0;}

        @keyframes dolGlitchIn{
          0%{opacity:0;transform:scale(1) translateZ(0)}
          10%{opacity:1}
          30%{transform:scale(1.01) translateX(-1px)}
          45%{transform:scale(1.01) translateX(2px)}
          60%{transform:scale(1.0) translateX(0)}
          100%{opacity:0}
        }
        @keyframes dolScan{
          0%{opacity:0;transform:translateY(-12%)}
          20%{opacity:.75}
          50%{opacity:.35}
          100%{opacity:0;transform:translateY(12%)}
        }
        @keyframes dolRgb{
          0%{opacity:0;transform:translateX(0)}
          18%{opacity:.85}
          40%{transform:translateX(-2px)}
          55%{transform:translateX(2px)}
          100%{opacity:0;transform:translateX(0)}
        }
        @keyframes dolSlice{
          0%{opacity:0;transform:translateX(0)}
          10%{opacity:.8}
          40%{transform:translateX(-10px)}
          70%{opacity:.4;transform:translateX(12px)}
          100%{opacity:0;transform:translateX(0)}
        }
      `}</style>

      {(phase === "intro" || phase === "glitch") && (
        <OpeningScreen onFinish={handleFinish} />
      )}

      {(phase === "glitch" || phase === "home") && (
        <div
          style={{
            opacity: phase === "home" ? 1 : 0.0,
            transition: "opacity 320ms ease",
          }}
        >
          <Home />
        </div>
      )}

      {phase === "glitch" && (
        <div className="dol-glitchWrap" aria-hidden>
          <div
            className="dol-glitchBg"
            style={{ animation: "dolGlitchIn 950ms ease both" }}
          />
          <div
            className="dol-scan"
            style={{ animation: "dolScan 950ms ease both" }}
          />
          <div className="dol-rgb" style={{ animation: "dolRgb 950ms ease both" }} />
          {[18, 32, 48, 61, 72].map((top, i) => (
            <div
              key={i}
              className="dol-slice"
              style={{
                top: `${top}%`,
                animation: `dolSlice 650ms ease ${i * 60}ms both`,
              }}
            />
          ))}
        </div>
      )}
    </>
  );
}
