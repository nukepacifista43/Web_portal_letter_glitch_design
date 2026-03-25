import React, { useEffect, useMemo, useRef, useState } from "react";
import styles from "./OpeningScreen.module.css";
import LetterGlitch from "../components/LetterGlitch";
import Waves from "../components/Waves";

export default function OpeningScreen({ onFinish }) {
  const [phase, setPhase] = useState("idle"); // idle -> entering
  const rootRef = useRef(null);

  // Shared state so LetterGlitch wave/ripple stays in-sync with Waves.
  // { t, x, y, v, vs, a, width, height }
  const waveShareRef = useRef({
    t: 0,
    x: -9999,
    y: -9999,
    v: 0,
    vs: 0,
    a: 0,
    width: 0,
    height: 0,
  });

  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [burst, setBurst] = useState(0);

  const characters = useMemo(
    () =>
      // Rusia + Greek + simbol (matrix vibe)
      "АБВГДЕЖЗИЙКЛМНОПРСТУФХЦЧШЩЪЫЬЭЮЯ" +
      "αβγδεζηθικλμνξοπρστυφχψω" +
      "ΔΛΩΣΠΦΨ" +
      "†‡∑√∞≈≠≤≥÷×±∂∇µπλΩ" +
      "[]{}()<>/\\|~=;:,.!?*@#$%^&-+_",
    []
  );

  const enter = () => {
    if (phase !== "idle") return;
    setPhase("entering");
    window.setTimeout(() => onFinish?.(), 1550);
  };

  useEffect(() => {
    const onKeyDown = (e) => {
      if (e.key === "Enter") enter();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase]);

  const onMouseMove = (e) => {
    const el = rootRef.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width;
    const py = (e.clientY - r.top) / r.height;

    setTilt({
      x: (py - 0.5) * -9,
      y: (px - 0.5) * 12,
    });
  };

  // click burst -> quick glitch kick
  const onPointerDown = () => {
    setBurst((b) => b + 1);
  };

  return (
    <div
      ref={rootRef}
      className={[styles.wrap, phase === "entering" ? styles.entering : ""].join(" ")}
      onMouseMove={onMouseMove}
      onPointerDown={onPointerDown}
    >
      {/* FULLSCREEN MATRIX BACKGROUND */}
      <div className={styles.bgLayer}>
        <LetterGlitch
          className={styles.letterBg}
          characters={characters}
          glitchColors={["#1bff9b", "#29d6ff", "#9a7bff"]}
          glitchSpeed={Math.max(22, 55 - (burst % 6) * 6)}
          smooth
          outerVignette
          centerVignette
          // ✅ sync with Waves
          shareRef={waveShareRef}
          waveStrength={1.0}
          waveAmpX={10}
          waveAmpY={7}
          rippleStrength={1.0}
          rippleAmp={22}
          rippleFalloff={320}
        />
      </div>

      {/* INTERACTIVE WAVES */}
      <div className={styles.wavesLayer} aria-hidden="true">
        <Waves
          className={styles.wavesBlend}
          backgroundColor="transparent"
          // ✅ sync with LetterGlitch
          shareRef={waveShareRef}
          lineColor="rgba(140, 255, 210, 0.28)"
          lineWidth={1.35}
          lineAlpha={0.85}
          waveAmpX={52}
          waveAmpY={22}
          waveSpeedX={0.014}
          waveSpeedY={0.006}
          xGap={14}
          yGap={40}
          tension={0.008}
          friction={0.93}
        />
      </div>

      {/* CINEMATIC OVERLAYS */}
      <div className={styles.scanlines} aria-hidden="true" />
      <div className={styles.vignette} aria-hidden="true" />
      <div className={styles.filmGrain} aria-hidden="true" />

      {/* CONTENT */}
      <div className={styles.center}>
        <div className={styles.logo3d} style={{ transform: `rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)` }}>
          <DOLLogo onPortal={enter} />
        </div>

        <div className={styles.sub}>FUTURISTIC WEB EXPERIENCES • DIGITAL PRODUCT • IT SOLUTIONS</div>

        <button className={styles.hint} onClick={enter}>
          <span className={styles.key}>Enter</span>
          <span>untuk masuk ke dunia DOL</span>
        </button>

        <div className={styles.mini}>Gerakkan mouse untuk mainin logo • Klik O untuk portal</div>
      </div>

      <div className={styles.flash} />
    </div>
  );
}

function DOLLogo({ onPortal }) {
  return (
    <div className={styles.logoWrap}>
      <svg className={styles.logoSvg} viewBox="0 0 920 240" fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="6" result="blur" />
            <feColorMatrix
              in="blur"
              type="matrix"
              values="
                1 0 0 0 0.10
                0 1 0 0 0.95
                0 0 1 0 0.55
                0 0 0 1 0"
              result="colored"
            />
            <feMerge>
              <feMergeNode in="colored" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          <linearGradient id="strokeGrad" x1="0" y1="0" x2="920" y2="0" gradientUnits="userSpaceOnUse">
            <stop offset="0" stopColor="rgba(200,255,240,0.92)" />
            <stop offset="0.45" stopColor="rgba(120,255,210,0.92)" />
            <stop offset="1" stopColor="rgba(160,160,255,0.92)" />
          </linearGradient>

          <radialGradient id="portalFill" cx="50%" cy="45%" r="60%">
            <stop offset="0%" stopColor="rgba(255,255,255,0.95)" />
            <stop offset="35%" stopColor="rgba(140,255,210,0.55)" />
            <stop offset="70%" stopColor="rgba(60,255,170,0.18)" />
            <stop offset="100%" stopColor="rgba(0,0,0,0)" />
          </radialGradient>
        </defs>

        {/* D */}
        <path
          className={styles.strokeDraw}
          d="M90 50 H190 C255 50 295 90 295 120 C295 150 255 190 190 190 H90 Z
             M140 88 H186 C216 88 238 105 238 120 C238 135 216 152 186 152 H140 Z"
          stroke="url(#strokeGrad)"
          strokeWidth="10"
          strokeLinejoin="round"
          filter="url(#glow)"
        />

        {/* O ring */}
        <path
          className={styles.strokeDraw}
          d="M460 50 C540 50 600 90 600 120 C600 150 540 190 460 190
             C380 190 320 150 320 120 C320 90 380 50 460 50 Z"
          stroke="url(#strokeGrad)"
          strokeWidth="10"
          strokeLinejoin="round"
          filter="url(#glow)"
        />

        {/* inner O */}
        <path
          className={styles.strokeDrawSoft}
          d="M460 82 C505 82 540 103 540 120 C540 137 505 158 460 158
             C415 158 380 137 380 120 C380 103 415 82 460 82 Z"
          stroke="rgba(160,255,220,0.55)"
          strokeWidth="8"
          strokeLinejoin="round"
          opacity="0.9"
        />

        {/* L */}
        <path
          className={styles.strokeDraw}
          d="M690 50 V190 H840"
          stroke="url(#strokeGrad)"
          strokeWidth="10"
          strokeLinecap="round"
          strokeLinejoin="round"
          filter="url(#glow)"
        />

        {/* portal glow */}
        <circle className={styles.portalGlow} cx="460" cy="120" r="56" fill="url(#portalFill)" />
        <circle className={styles.portalRing} cx="460" cy="120" r="66" />
      </svg>

      {/* clickable portal target */}
      <button className={styles.portalBtn} onClick={(e) => (e.stopPropagation(), onPortal())} aria-label="Enter portal">
        <span className={styles.portalCore} />
      </button>
    </div>
  );
}