import { useEffect, useRef } from "react";

const clamp = (n, a, b) => Math.max(a, Math.min(b, n));

const LetterGlitch = ({
  glitchColors = ["#2b4539", "#61dca3", "#61b3dc"],
  className = "",
  glitchSpeed = 50,
  centerVignette = false,
  outerVignette = true,
  smooth = true,
  characters = "АБВГДЕЖЗИЙКЛМНОПРСТУФХЦЧШЩЪЫЬЭЮЯ!@#$&*()-_+=/[]{};:<>.,0123456789",

  // ✅ MUST: same ref passed to Waves
  shareRef = null,

  // layout
  fontSize = 16,
  charWidth = 10,
  charHeight = 20,

  // fps throttle
  frameMs = 16,
}) => {
  const canvasRef = useRef(null);
  const ctxRef = useRef(null);
  const rafRef = useRef(null);

  const letters = useRef([]);
  const grid = useRef({ columns: 0, rows: 0 });
  const lastGlitchTime = useRef(Date.now());
  const lastDrawAt = useRef(0);

  const lettersAndSymbols = useRef(Array.from(characters));

  const getRandomChar = () => {
    const arr = lettersAndSymbols.current;
    return arr[Math.floor(Math.random() * arr.length)];
  };
  const getRandomColor = () => glitchColors[Math.floor(Math.random() * glitchColors.length)];

  const hexToRgb = (hex) => {
    const shorthand = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
    hex = hex.replace(shorthand, (m, r, g, b) => r + r + g + g + b + b);
    const res = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return res
      ? { r: parseInt(res[1], 16), g: parseInt(res[2], 16), b: parseInt(res[3], 16) }
      : null;
  };

  const interpolateColor = (start, end, factor) => {
    const r = Math.round(start.r + (end.r - start.r) * factor);
    const g = Math.round(start.g + (end.g - start.g) * factor);
    const b = Math.round(start.b + (end.b - start.b) * factor);
    return `rgb(${r}, ${g}, ${b})`;
  };

  const calculateGrid = (width, height) => ({
    columns: Math.ceil(width / charWidth),
    rows: Math.ceil(height / charHeight),
  });

  const initLetters = (columns, rows) => {
    grid.current = { columns, rows };
    const total = columns * rows;

    letters.current = Array.from({ length: total }, () => ({
      char: getRandomChar(),
      color: getRandomColor(),
      targetColor: getRandomColor(),
      colorProgress: 1,

      // ✅ store physics like Waves per point
      cursor: { x: 0, y: 0, vx: 0, vy: 0 },
      wave: { x: 0, y: 0 },
    }));
  };

  const resizeCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const parent = canvas.parentElement;
    if (!parent) return;

    const dpr = window.devicePixelRatio || 1;
    const rect = parent.getBoundingClientRect();

    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    canvas.style.width = `${rect.width}px`;
    canvas.style.height = `${rect.height}px`;

    const ctx = canvas.getContext("2d");
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctxRef.current = ctx;

    const { columns, rows } = calculateGrid(rect.width, rect.height);
    initLetters(columns, rows);

    drawFrame(performance.now());
  };

  // ✅ 1:1 wave formula from Waves.jsx
  const computeWaveForCell = (noise, x, y, t, waveSpeedX, waveSpeedY, waveAmpX, waveAmpY) => {
    const move = noise.perlin2((x + t * waveSpeedX) * 0.002, (y + t * waveSpeedY) * 0.0015) * 12;
    return { wx: Math.cos(move) * waveAmpX, wy: Math.sin(move) * waveAmpY };
  };

  // ✅ 1:1 cursor physics from Waves.jsx
  const stepCursorForCell = (cell, baseX, baseY, mouse, cfg) => {
    const { friction, tension, maxCursorMove } = cfg;

    const dx = baseX - mouse.x;
    const dy = baseY - mouse.y;
    const dist = Math.hypot(dx, dy);
    const l = Math.max(175, mouse.vs);

    if (dist < l) {
      const s = 1 - dist / l;
      const f = Math.cos(dist * 0.001) * s;
      cell.cursor.vx += Math.cos(mouse.a) * f * l * mouse.vs * 0.00065;
      cell.cursor.vy += Math.sin(mouse.a) * f * l * mouse.vs * 0.00065;
    }

    cell.cursor.vx += (0 - cell.cursor.x) * tension;
    cell.cursor.vy += (0 - cell.cursor.y) * tension;

    cell.cursor.vx *= friction;
    cell.cursor.vy *= friction;

    cell.cursor.x += cell.cursor.vx * 2;
    cell.cursor.y += cell.cursor.vy * 2;

    cell.cursor.x = clamp(cell.cursor.x, -maxCursorMove, maxCursorMove);
    cell.cursor.y = clamp(cell.cursor.y, -maxCursorMove, maxCursorMove);
  };

  const drawFrame = (fallbackT) => {
    const ctx = ctxRef.current;
    if (!ctx || letters.current.length === 0) return;

    const rect = canvasRef.current.getBoundingClientRect();
    const W = rect.width;
    const H = rect.height;

    const s = shareRef?.current;

    const noise = s?.noise; // ✅ comes from Waves.jsx patch
    const t = s?.t ?? fallbackT;

    const waveSpeedX = s?.waveSpeedX ?? 0;
    const waveSpeedY = s?.waveSpeedY ?? 0;
    const waveAmpX = s?.waveAmpX ?? 0;
    const waveAmpY = s?.waveAmpY ?? 0;

    const mouse = {
      x: s?.x ?? -9999,
      y: s?.y ?? -9999,
      vs: s?.vs ?? 0,
      a: s?.a ?? 0,
    };

    const cfg = {
      friction: s?.friction ?? 0.925,
      tension: s?.tension ?? 0.005,
      maxCursorMove: s?.maxCursorMove ?? 100,
    };

    ctx.clearRect(0, 0, W, H);
    ctx.font = `${fontSize}px monospace`;
    ctx.textBaseline = "top";

    letters.current.forEach((cell, idx) => {
      const baseX = (idx % grid.current.columns) * charWidth;
      const baseY = Math.floor(idx / grid.current.columns) * charHeight;

      if (noise) {
        const { wx, wy } = computeWaveForCell(noise, baseX, baseY, t, waveSpeedX, waveSpeedY, waveAmpX, waveAmpY);
        cell.wave.x = wx;
        cell.wave.y = wy;

        stepCursorForCell(cell, baseX, baseY, mouse, cfg);
      } else {
        cell.wave.x = 0;
        cell.wave.y = 0;
        cell.cursor.x *= 0.9;
        cell.cursor.y *= 0.9;
      }

      const x = baseX + cell.wave.x + cell.cursor.x;
      const y = baseY + cell.wave.y + cell.cursor.y;

      ctx.fillStyle = cell.color;
      ctx.fillText(cell.char, x, y);
    });
  };

  const updateCharsAndColors = () => {
    const total = letters.current.length;
    if (!total) return;

    const updateCount = Math.max(1, Math.floor(total * 0.05));
    for (let i = 0; i < updateCount; i++) {
      const idx = Math.floor(Math.random() * total);
      const cell = letters.current[idx];
      if (!cell) continue;

      cell.char = getRandomChar();
      cell.targetColor = getRandomColor();

      if (!smooth) {
        cell.color = cell.targetColor;
        cell.colorProgress = 1;
      } else {
        cell.colorProgress = 0;
      }
    }
  };

  const stepColorTransitions = () => {
    if (!smooth) return false;

    let changed = false;
    for (const cell of letters.current) {
      if (cell.colorProgress < 1) {
        cell.colorProgress += 0.05;
        if (cell.colorProgress > 1) cell.colorProgress = 1;

        const start = hexToRgb(cell.color);
        const end = hexToRgb(cell.targetColor);
        if (start && end) {
          cell.color = interpolateColor(start, end, cell.colorProgress);
          changed = true;
        }
      }
    }
    return changed;
  };

  const loop = () => {
    const now = Date.now();
    const t = performance.now();

    if (now - lastGlitchTime.current >= glitchSpeed) {
      updateCharsAndColors();
      lastGlitchTime.current = now;
    }

    const colorChanged = stepColorTransitions();

    if (t - lastDrawAt.current >= frameMs || colorChanged) {
      drawFrame(t);
      lastDrawAt.current = t;
    }

    rafRef.current = requestAnimationFrame(loop);
  };

  useEffect(() => {
    lettersAndSymbols.current = Array.from(characters);
  }, [characters]);

  useEffect(() => {
    resizeCanvas();
    loop();

    let resizeTimer;
    const onResize = () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        cancelAnimationFrame(rafRef.current);
        resizeCanvas();
        loop();
      }, 100);
    };

    window.addEventListener("resize", onResize);
    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener("resize", onResize);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [glitchSpeed, smooth, frameMs]);

  const containerStyle = {
    position: "relative",
    width: "100%",
    height: "100%",
    backgroundColor: "#000",
    overflow: "hidden",
  };

  const canvasStyle = {
    display: "block",
    width: "100%",
    height: "100%",
  };

  const outerVignetteStyle = {
    position: "absolute",
    inset: 0,
    pointerEvents: "none",
    background: "radial-gradient(circle, rgba(0,0,0,0) 60%, rgba(0,0,0,1) 100%)",
  };

  const centerVignetteStyle = {
    position: "absolute",
    inset: 0,
    pointerEvents: "none",
    background: "radial-gradient(circle, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0) 60%)",
  };

  return (
    <div style={containerStyle} className={className}>
      <canvas ref={canvasRef} style={canvasStyle} />
      {outerVignette && <div style={outerVignetteStyle} />}
      {centerVignette && <div style={centerVignetteStyle} />}
    </div>
  );
};

export default LetterGlitch;