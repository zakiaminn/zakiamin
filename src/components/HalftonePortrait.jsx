import React, { useEffect, useRef } from 'react';

const COLS = 52;
const ROWS = 69; // matches the 3:4 plate
const FLOOR = 0.16; // every opaque pixel keeps a small dot, so the silhouette stays unbroken
const CAP = 0.86; // the heaviest ink stops short of solid, so dark cloth keeps its texture
const INFLUENCE = 95; // px radius of the cursor's pull
const MIN_WEIGHT = 0.04; // below this a cell prints no dot

// The print-in: the plate inks itself top to bottom, once, like a pass
// under a print head. Each dot grows from a visible nub rather than from
// nothing, and eases out so the motion lands softly.
const INTRO_DELAY = 180;
const INTRO_SWEEP = 760; // ms from the first row starting to the last
const INTRO_DOT = 420; // ms for one dot to reach full size

// A click or tap sends a ring of ink outward through the plate.
const RIPPLE_SPEED = 0.95; // px per ms
const RIPPLE_WIDTH = 46; // px, the thickness of the ring

// Fallbacks if a CSS variable can't be read: light-theme ink, paper, accent.
const INK_FALLBACK = [22, 22, 14];
const PAPER_FALLBACK = [250, 250, 249];
const ACCENT_FALLBACK = [111, 122, 0];

const luma = ([r, g, b]) => 0.299 * r + 0.587 * g + 0.114 * b;

function hexToRgb(hex) {
  const m = hex.trim().replace('#', '');
  if (m.length === 6) {
    return [parseInt(m.slice(0, 2), 16), parseInt(m.slice(2, 4), 16), parseInt(m.slice(4, 6), 16)];
  }
  if (m.length === 3) {
    return [parseInt(m[0] + m[0], 16), parseInt(m[1] + m[1], 16), parseInt(m[2] + m[2], 16)];
  }
  return null;
}

// Deterministic per-cell jitter so the print pass has some grain to it.
function jitter(i) {
  const x = Math.sin(i * 12.9898) * 43758.5453;
  return x - Math.floor(x);
}

const easeOut = (t) => 1 - Math.pow(1 - t, 3);

/**
 * Renders a photo as a grid of dots printed in the theme's ink, like a
 * newspaper halftone. Dot size is the amount of ink a cell needs to match the
 * photo against the page: dark ink on chalk prints the shadows, cream ink on
 * near-black prints the highlights. (Tying size to brightness alone prints a
 * photographic negative on the light theme.) Dots near the cursor swell and
 * shift toward the accent, like ink lifting; a click or tap sends a ripple
 * through the plate.
 *
 * `crop` frames the source as [x, y, width, height] fractions, so a small
 * face in a big frame still gets enough dots to read.
 *
 * Dot colours come from the live palette (`--ink` for the plate, `--brand-ink`
 * for the pull), so the plate re-inks itself when the theme flips.
 *
 * The render loop is demand-driven: frames are only scheduled while
 * something is moving (the print-in, a ripple, the cursor over the plate)
 * and the plate is on screen. At rest it costs nothing. Under
 * `prefers-reduced-motion` the plate fades in once and stays still.
 */
export default function HalftonePortrait({
  src,
  crop = [0, 0, 1, 1],
  className = '',
  label = 'Portrait',
  onDotCount,
}) {
  const containerRef = useRef(null);
  const canvasRef = useRef(null);
  const onDotCountRef = useRef(onDotCount);
  // The effect keys on the crop's values, so an inline array literal doesn't
  // re-sample the photo on every render.
  const cropKey = crop.join(',');
  useEffect(() => {
    onDotCountRef.current = onDotCount;
  }, [onDotCount]);

  useEffect(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    if (!container || !canvas) return;

    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const schemeQuery = window.matchMedia('(prefers-color-scheme: dark)');
    let reduced = motionQuery.matches;
    let onScreen = true;
    let frame = null;
    let tone = null; // Float32Array of normalized ink weight, COLS*ROWS
    let firstRow = 0; // the print pass spans only the rows that carry ink
    let rowSpan = ROWS;
    let introStart = null; // set when the plate first renders
    let ripples = [];
    const mouse = { x: -9999, y: -9999, active: false };
    const smoothed = { x: -9999, y: -9999 };
    let ink = INK_FALLBACK;
    let accent = ACCENT_FALLBACK;
    let inkIsDark = true; // dark ink on light paper prints shadows, not highlights
    let sample = null; // { lum, alpha, min, range } read once from the photo

    // Pull the current plate, paper and accent ink from the cascade.
    const readPalette = () => {
      const styles = getComputedStyle(container);
      ink = hexToRgb(styles.getPropertyValue('--ink')) || INK_FALLBACK;
      accent = hexToRgb(styles.getPropertyValue('--brand-ink')) || ACCENT_FALLBACK;
      const paper = hexToRgb(styles.getPropertyValue('--bg')) || PAPER_FALLBACK;
      inkIsDark = luma(ink) < luma(paper);
    };
    readPalette();

    // Ink weight per cell for the current polarity. Re-run when the theme
    // flips, since the light and dark plates ink opposite ends of the photo.
    const buildTone = () => {
      if (!sample) return;
      const { lum, alpha, min, range } = sample;
      const next = new Float32Array(COLS * ROWS);
      let count = 0;
      let top = ROWS, bottom = 0;
      for (let i = 0; i < COLS * ROWS; i++) {
        let norm = Math.max((lum[i] - min) / range, 0);
        if (inkIsDark) norm = 1 - norm;
        norm = CAP * Math.pow(norm, 0.85);
        next[i] = alpha[i] > 0.05 ? (FLOOR + (1 - FLOOR) * norm) * alpha[i] : 0;
        if (next[i] >= MIN_WEIGHT) {
          count++;
          const row = Math.floor(i / COLS);
          if (row < top) top = row;
          if (row > bottom) bottom = row;
        }
      }
      tone = next;
      firstRow = top;
      rowSpan = Math.max(bottom - top, 1);
      onDotCountRef.current?.(count);
    };

    const img = new Image();
    img.src = src;
    img.onload = () => {
      const grid = document.createElement('canvas');
      grid.width = COLS;
      grid.height = ROWS;
      const gctx = grid.getContext('2d');

      // Frame the crop, then cover-fit it into the COLS x ROWS grid.
      const [cx, cy, cw, ch] = cropKey.split(',').map(Number);
      const fx = cx * img.width, fy = cy * img.height;
      const fw = cw * img.width, fh = ch * img.height;
      const dstAspect = COLS / ROWS;
      let sx, sy, sw, sh;
      if (fw / fh > dstAspect) {
        sh = fh;
        sw = sh * dstAspect;
        sx = fx + (fw - sw) / 2;
        sy = fy;
      } else {
        sw = fw;
        sh = sw / dstAspect;
        sx = fx;
        sy = fy + (fh - sh) / 2;
      }
      gctx.drawImage(img, sx, sy, sw, sh, 0, 0, COLS, ROWS);

      const { data } = gctx.getImageData(0, 0, COLS, ROWS);
      const lum = new Float32Array(COLS * ROWS);
      const alpha = new Float32Array(COLS * ROWS);
      let min = 1, max = 0;
      for (let i = 0; i < COLS * ROWS; i++) {
        const r = data[i * 4], g = data[i * 4 + 1], b = data[i * 4 + 2], a = data[i * 4 + 3];
        const l = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
        lum[i] = l;
        alpha[i] = a / 255;
        // Only opaque pixels inform the contrast stretch, so transparent
        // cutout regions don't skew the tone range of the subject.
        if (a > 16) {
          if (l < min) min = l;
          if (l > max) max = l;
        }
      }
      sample = { lum, alpha, min, range: Math.max(max - min, 0.05) };
      buildTone();
      if (reduced) container.dataset.ready = 'true';
      request();
    };

    const draw = (now) => {
      if (!tone) return false;

      const rect = container.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;
      const w = Math.round(rect.width * dpr);
      const h = Math.round(rect.height * dpr);
      if (canvas.width !== w || canvas.height !== h) {
        canvas.width = w;
        canvas.height = h;
      }
      const ctx = canvas.getContext('2d');
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, rect.width, rect.height);

      const cellW = rect.width / COLS;
      const cellH = rect.height / ROWS;
      const maxRadius = Math.min(cellW, cellH) * 0.58;

      // Intro progress. Under reduced motion the plate is simply there.
      if (introStart == null) introStart = now + INTRO_DELAY;
      const introElapsed = reduced ? Infinity : now - introStart;
      const introRunning = introElapsed < INTRO_SWEEP + INTRO_DOT + 120;

      const interactive = mouse.active && !reduced;
      if (interactive) {
        smoothed.x += (mouse.x - smoothed.x) * 0.18;
        smoothed.y += (mouse.y - smoothed.y) * 0.18;
      }

      // Retire ripples once their ring has left the plate.
      const reach = Math.hypot(rect.width, rect.height) + RIPPLE_WIDTH;
      ripples = ripples.filter((rp) => (now - rp.t0) * RIPPLE_SPEED < reach);

      for (let row = 0; row < ROWS; row++) {
        for (let col = 0; col < COLS; col++) {
          const idx = row * COLS + col;
          const weight = tone[idx];
          if (weight < MIN_WEIGHT) continue;

          const cx = col * cellW + cellW / 2;
          const cy = row * cellH + cellH / 2;

          // Print-in: rows start in order, with a little per-dot grain.
          let grow = 1;
          let alpha = 1;
          if (introRunning) {
            const delay = ((row - firstRow) / rowSpan) * INTRO_SWEEP + jitter(idx) * 110;
            const t = Math.min(Math.max((introElapsed - delay) / INTRO_DOT, 0), 1);
            if (t <= 0) continue;
            const e = easeOut(t);
            grow = 0.35 + 0.65 * e;
            alpha = e;
          }

          let boost = 0;
          let liftX = 0, liftY = 0;

          if (interactive) {
            const dx = cx - smoothed.x;
            const dy = cy - smoothed.y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist < INFLUENCE) {
              const t = 1 - dist / INFLUENCE;
              boost = t * t;
              if (dist > 0.001) {
                liftX = (dx / dist) * boost * 4;
                liftY = (dy / dist) * boost * 4;
              }
            }
          }

          for (const rp of ripples) {
            const radius = (now - rp.t0) * RIPPLE_SPEED;
            const dx = cx - rp.x;
            const dy = cy - rp.y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            const band = 1 - Math.abs(dist - radius) / RIPPLE_WIDTH;
            if (band > 0) {
              // The ring loses energy as it travels outward.
              const energy = Math.max(0, 1 - radius / reach);
              const k = band * band * energy;
              if (k > boost) boost = k;
              if (dist > 0.001) {
                liftX += (dx / dist) * k * 5;
                liftY += (dy / dist) * k * 5;
              }
            }
          }

          const radius = Math.min(maxRadius, maxRadius * (weight * 0.92 + 0.08) * (1 + boost * 0.65)) * grow;
          const r = Math.round(ink[0] + (accent[0] - ink[0]) * boost);
          const g = Math.round(ink[1] + (accent[1] - ink[1]) * boost);
          const b = Math.round(ink[2] + (accent[2] - ink[2]) * boost);

          ctx.beginPath();
          ctx.arc(cx + liftX, cy + liftY, radius, 0, Math.PI * 2);
          ctx.fillStyle = alpha < 1 ? `rgba(${r}, ${g}, ${b}, ${alpha})` : `rgb(${r}, ${g}, ${b})`;
          ctx.fill();
        }
      }

      // Keep going only while something is still moving.
      return introRunning || ripples.length > 0 || interactive;
    };

    const loop = (now) => {
      frame = null;
      const moving = draw(now);
      if (moving && onScreen) frame = requestAnimationFrame(loop);
    };
    const request = () => {
      if (frame == null) frame = requestAnimationFrame(loop);
    };

    const local = (e) => {
      const rect = container.getBoundingClientRect();
      return { x: e.clientX - rect.left, y: e.clientY - rect.top };
    };
    // The lift follows a real cursor only; a finger gets the ripple instead.
    const handleMove = (e) => {
      if (reduced || e.pointerType !== 'mouse') return;
      const p = local(e);
      if (!mouse.active) {
        smoothed.x = p.x;
        smoothed.y = p.y;
      }
      mouse.x = p.x;
      mouse.y = p.y;
      mouse.active = true;
      request();
    };
    const handleLeave = () => {
      mouse.active = false;
      request(); // one final frame settles the dots back to rest
    };
    const handleDown = (e) => {
      if (reduced) return;
      const p = local(e);
      ripples.push({ x: p.x, y: p.y, t0: performance.now() });
      if (ripples.length > 4) ripples.shift();
      request();
    };
    const handleResize = () => request();
    const handleMotionChange = () => {
      reduced = motionQuery.matches;
      if (reduced) {
        mouse.active = false;
        ripples = [];
        container.dataset.ready = 'true';
      }
      request();
    };
    const handleSchemeChange = () => {
      readPalette();
      buildTone();
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

    container.addEventListener('pointermove', handleMove);
    container.addEventListener('pointerleave', handleLeave);
    container.addEventListener('pointerdown', handleDown);
    window.addEventListener('resize', handleResize);
    schemeQuery.addEventListener('change', handleSchemeChange);
    motionQuery.addEventListener('change', handleMotionChange);

    return () => {
      if (frame != null) cancelAnimationFrame(frame);
      img.onload = null;
      observer?.disconnect();
      container.removeEventListener('pointermove', handleMove);
      container.removeEventListener('pointerleave', handleLeave);
      container.removeEventListener('pointerdown', handleDown);
      window.removeEventListener('resize', handleResize);
      schemeQuery.removeEventListener('change', handleSchemeChange);
      motionQuery.removeEventListener('change', handleMotionChange);
    };
  }, [src, cropKey]);

  return (
    <div
      ref={containerRef}
      role="img"
      aria-label={label}
      className={`relative aspect-[3/4] w-full select-none motion-reduce:opacity-0 motion-reduce:transition-opacity motion-reduce:duration-300 motion-reduce:data-[ready=true]:opacity-100 ${className}`}
    >
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />
    </div>
  );
}
