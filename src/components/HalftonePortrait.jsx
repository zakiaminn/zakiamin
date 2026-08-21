import React, { useEffect, useRef } from 'react';

const COLS = 44;
const ROWS = 59; // matches the 3:4 portrait crop
const INK = [245, 240, 228];  // warm cream — the base dot ink
const FLAME = [255, 90, 51];  // vivid flame — cursor-proximity color
const INFLUENCE = 95;         // px radius of mouse influence

/**
 * Renders a photo as a grid of glowing dots on dark ground, poster-style:
 * highlights print as large dots, shadows fall away to bare black. Dots
 * near the cursor swell and shift toward the accent color, like ink lifting.
 *
 * The render loop is demand-driven: frames are only scheduled while the
 * cursor is actually over the plate and the plate is on screen. At rest it
 * costs nothing. Under `prefers-reduced-motion` the plate renders once and
 * stays still.
 */
export default function HalftonePortrait({ src, className = '', label = 'Portrait' }) {
  const containerRef = useRef(null);
  const canvasRef = useRef(null);
  const toneRef = useRef(null); // Float32Array of normalized darkness, COLS*ROWS
  const mouseRef = useRef({ x: -9999, y: -9999, active: false });
  const smoothedRef = useRef({ x: -9999, y: -9999 });
  const frameRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    let reduced = motionQuery.matches;
    let onScreen = true;

    const img = new Image();
    img.src = src;
    img.onload = () => {
      const sample = document.createElement('canvas');
      sample.width = COLS;
      sample.height = ROWS;
      const sctx = sample.getContext('2d');

      // Cover-fit the source image into the COLS x ROWS sample grid.
      const srcAspect = img.width / img.height;
      const dstAspect = COLS / ROWS;
      let sx, sy, sw, sh;
      if (srcAspect > dstAspect) {
        sh = img.height;
        sw = sh * dstAspect;
        sx = (img.width - sw) / 2;
        sy = 0;
      } else {
        sw = img.width;
        sh = sw / dstAspect;
        sx = 0;
        sy = (img.height - sh) / 2;
      }
      sctx.drawImage(img, sx, sy, sw, sh, 0, 0, COLS, ROWS);

      const { data } = sctx.getImageData(0, 0, COLS, ROWS);
      const lum = new Float32Array(COLS * ROWS);
      const alpha = new Float32Array(COLS * ROWS);
      let min = 1, max = 0;
      for (let i = 0; i < COLS * ROWS; i++) {
        const r = data[i * 4], g = data[i * 4 + 1], b = data[i * 4 + 2], a = data[i * 4 + 3];
        const l = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
        lum[i] = l;
        alpha[i] = a / 255;
        // Only opaque pixels inform the contrast stretch — transparent cutout
        // regions shouldn't skew the tone range of the actual subject.
        if (a > 16) {
          if (l < min) min = l;
          if (l > max) max = l;
        }
      }
      const range = Math.max(max - min, 0.05);
      const tone = new Float32Array(COLS * ROWS);
      const FLOOR = 0.16; // every opaque pixel keeps a small dot, so the silhouette stays unbroken
      for (let i = 0; i < COLS * ROWS; i++) {
        const norm = Math.pow(Math.max((lum[i] - min) / range, 0), 0.85);
        tone[i] = alpha[i] > 0.05 ? (FLOOR + (1 - FLOOR) * norm) * alpha[i] : 0;
      }
      toneRef.current = tone;
      request();
    };

    const draw = () => {
      const canvas = canvasRef.current;
      const tone = toneRef.current;
      if (!canvas || !container || !tone) return;

      const rect = container.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;
      if (canvas.width !== rect.width * dpr || canvas.height !== rect.height * dpr) {
        canvas.width = rect.width * dpr;
        canvas.height = rect.height * dpr;
      }
      const ctx = canvas.getContext('2d');
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, rect.width, rect.height);

      const cellW = rect.width / COLS;
      const cellH = rect.height / ROWS;
      const maxRadius = Math.min(cellW, cellH) * 0.58;

      const mouse = mouseRef.current;
      const sm = smoothedRef.current;
      const interactive = mouse.active && !reduced;
      if (interactive) {
        sm.x += (mouse.x - sm.x) * 0.18;
        sm.y += (mouse.y - sm.y) * 0.18;
      }

      for (let row = 0; row < ROWS; row++) {
        for (let col = 0; col < COLS; col++) {
          const idx = row * COLS + col;
          const weight = tone[idx];
          if (weight < 0.04) continue;

          const cx = col * cellW + cellW / 2;
          const cy = row * cellH + cellH / 2;

          let boost = 0;
          let colorT = 0;
          let liftX = 0, liftY = 0;
          if (interactive) {
            const dx = cx - sm.x;
            const dy = cy - sm.y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist < INFLUENCE) {
              const t = 1 - dist / INFLUENCE;
              boost = t * t;
              colorT = boost;
              if (dist > 0.001) {
                liftX = (dx / dist) * boost * 4;
                liftY = (dy / dist) * boost * 4;
              }
            }
          }

          const radius = Math.min(maxRadius, maxRadius * (weight * 0.92 + 0.08) * (1 + boost * 0.65));
          const r = Math.round(INK[0] + (FLAME[0] - INK[0]) * colorT);
          const g = Math.round(INK[1] + (FLAME[1] - INK[1]) * colorT);
          const b = Math.round(INK[2] + (FLAME[2] - INK[2]) * colorT);

          ctx.beginPath();
          ctx.arc(cx + liftX, cy + liftY, radius, 0, Math.PI * 2);
          ctx.fillStyle = `rgb(${r}, ${g}, ${b})`;
          ctx.fill();
        }
      }
    };

    // Self-sustaining only while the cursor is engaged and the plate is
    // visible; otherwise each call renders exactly one frame and stops.
    const loop = () => {
      frameRef.current = null;
      draw();
      if (mouseRef.current.active && onScreen && !reduced) {
        frameRef.current = requestAnimationFrame(loop);
      }
    };
    const request = () => {
      if (frameRef.current == null) frameRef.current = requestAnimationFrame(loop);
    };

    const handleMove = (e) => {
      if (reduced) return;
      const rect = container.getBoundingClientRect();
      mouseRef.current = { x: e.clientX - rect.left, y: e.clientY - rect.top, active: true };
      request();
    };
    const handleLeave = () => {
      mouseRef.current.active = false;
      smoothedRef.current = { x: -9999, y: -9999 };
      request(); // one final frame settles the dots back to rest
    };
    const handleResize = () => request();
    const handleMotionChange = () => {
      reduced = motionQuery.matches;
      if (reduced) mouseRef.current.active = false;
      request();
    };

    // Stop rendering entirely once the plate scrolls out of view.
    let observer;
    if (typeof IntersectionObserver !== 'undefined') {
      observer = new IntersectionObserver(
        ([entry]) => {
          onScreen = entry.isIntersecting;
          if (onScreen) request();
        },
        { threshold: 0 }
      );
      observer.observe(container);
    }

    container.addEventListener('mousemove', handleMove);
    container.addEventListener('mouseleave', handleLeave);
    window.addEventListener('resize', handleResize);
    motionQuery.addEventListener('change', handleMotionChange);
    request();

    return () => {
      if (frameRef.current != null) cancelAnimationFrame(frameRef.current);
      frameRef.current = null;
      img.onload = null;
      observer?.disconnect();
      container.removeEventListener('mousemove', handleMove);
      container.removeEventListener('mouseleave', handleLeave);
      window.removeEventListener('resize', handleResize);
      motionQuery.removeEventListener('change', handleMotionChange);
    };
  }, [src]);

  return (
    <div
      ref={containerRef}
      role="img"
      aria-label={label}
      className={`relative aspect-[3/4] w-full ${className}`}
    >
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />
    </div>
  );
}
