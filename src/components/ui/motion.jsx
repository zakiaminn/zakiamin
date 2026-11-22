import React, { useEffect, useRef } from 'react';
import { m as Motion, useMotionValue, useReducedMotion, useSpring } from 'framer-motion';
import { EASE, EASE_EXPO, useFinePointer } from '@/lib/motion';

const VIEWPORT = { once: true, margin: '0px 0px -12% 0px' };

/**
 * Each line rises out of its own mask. A line may wrap on a phone and still
 * moves as one block. The mask watches the viewport, not the text: the text
 * starts outside its mask, where the browser counts it as clipped.
 */
export function MaskLines({ lines, delay = 0, stagger = 0.08, duration = 0.85, inView = false, lineClassName = '' }) {
  const reduce = useReducedMotion();
  // Above the fold the entrance is CSS, so it plays from the prerendered HTML
  // without waiting for the script.
  if (!inView) {
    return lines.map((line, i) => (
      <span key={i} className={`block overflow-hidden pb-[0.12em] -mb-[0.12em] ${lineClassName}`}>
        <span className="block mask-rise" style={{ animationDelay: `${Math.round((delay + i * stagger) * 1000)}ms` }}>
          {line}
        </span>
      </span>
    ));
  }
  const variants = {
    hidden: reduce ? { opacity: 0 } : { y: '110%' },
    shown: (i) => ({
      ...(reduce ? { opacity: 1 } : { y: '0%' }),
      transition: { duration: reduce ? 0.3 : duration, ease: EASE_EXPO, delay: delay + i * stagger },
    }),
  };
  return lines.map((line, i) => (
    <Motion.span
      key={i}
      className={`block overflow-hidden pb-[0.12em] -mb-[0.12em] ${lineClassName}`}
      initial="hidden"
      {...(inView ? { whileInView: 'shown', viewport: VIEWPORT } : { animate: 'shown' })}
    >
      <Motion.span className="block" variants={variants} custom={i}>
        {line}
      </Motion.span>
    </Motion.span>
  ));
}

/** A hairline that rules itself in. */
export function Rule({ axis = 'x', origin, delay = 0, inView = true, tone = 'bg-rule', className = '' }) {
  const reduce = useReducedMotion();
  if (!inView) {
    return (
      <span
        aria-hidden="true"
        className={`block ${tone} ${className} ${axis === 'x' ? 'rule-in-x' : 'rule-in-y'}`}
        style={{ transformOrigin: origin ?? (axis === 'x' ? 'left' : 'top'), animationDelay: `${Math.round(delay * 1000)}ms` }}
      />
    );
  }
  const prop = axis === 'x' ? 'scaleX' : 'scaleY';
  const hidden = reduce ? { opacity: 0 } : { [prop]: 0 };
  const shown = reduce ? { opacity: 1 } : { [prop]: 1 };
  return (
    <Motion.span
      aria-hidden="true"
      className={`block ${tone} ${className}`}
      style={{ transformOrigin: origin ?? (axis === 'x' ? 'left' : 'top') }}
      initial={hidden}
      {...(inView ? { whileInView: shown, viewport: VIEWPORT } : { animate: shown })}
      transition={{ duration: reduce ? 0.3 : 0.9, ease: EASE, delay }}
    />
  );
}

/** The masthead's thin-gap-thick rules, set like a newspaper nameplate. `flip` puts the thick rule first. */
export function MastRules({ flip = false, inView = true, delay = 0 }) {
  const thin = <Rule inView={inView} origin="center" tone="bg-brand-ink" className="h-[3px]" delay={delay} />;
  const thick = <Rule inView={inView} origin="center" tone="bg-ink" className="h-[7px]" delay={delay + 0.07} />;
  return (
    <>
      {flip ? thick : thin}
      <span aria-hidden="true" className="block h-[3px]" />
      {flip ? thin : thick}
    </>
  );
}

/** For the few blocks that arrive as a unit. */
export function Reveal({ children, delay = 0, y = 10, className = '', inView = true }) {
  const reduce = useReducedMotion();
  if (!inView) {
    return (
      <div className={`reveal-in ${className}`} style={{ animationDelay: `${Math.round(delay * 1000)}ms` }}>
        {children}
      </div>
    );
  }
  const shown = { opacity: 1, y: 0 };
  return (
    <Motion.div
      className={className}
      initial={{ opacity: 0, y: reduce ? 0 : y }}
      {...(inView ? { whileInView: shown, viewport: VIEWPORT } : { animate: shown })}
      transition={{ duration: 0.7, ease: EASE, delay }}
    >
      {children}
    </Motion.div>
  );
}

/**
 * A preview that trails the cursor over a list. Real pointers only; touch
 * devices get the image inline instead (each list handles that itself).
 */
export function CursorPreview({ items, activeId, width = 340 }) {
  const fine = useFinePointer();
  const reduce = useReducedMotion();
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 260, damping: 26, mass: 0.6 });
  const sy = useSpring(y, { stiffness: 260, damping: 26, mass: 0.6 });
  const placed = useRef(false);
  const height = Math.round(width * 0.625);

  useEffect(() => {
    if (!fine) return;
    let frame = null;
    let last = null;
    const apply = () => {
      frame = null;
      const nx = Math.min(last.clientX + 28, window.innerWidth - width - 16);
      const ny = Math.min(Math.max(last.clientY - height / 2, 16), window.innerHeight - height - 16);
      x.set(nx);
      y.set(ny);
      if (!placed.current) {
        sx.jump(nx);
        sy.jump(ny);
        placed.current = true;
      }
    };
    const move = (e) => {
      last = e;
      if (frame == null) frame = requestAnimationFrame(apply);
    };
    window.addEventListener('pointermove', move, { passive: true });
    return () => {
      window.removeEventListener('pointermove', move);
      if (frame != null) cancelAnimationFrame(frame);
    };
  }, [fine, width, height, x, y, sx, sy]);

  if (!fine) return null;
  const visible = activeId != null;

  return (
    <Motion.div
      aria-hidden="true"
      className="pointer-events-none fixed left-0 top-0 z-30"
      style={{ x: reduce ? x : sx, y: reduce ? y : sy, width }}
    >
      <Motion.div
        className="relative overflow-hidden border border-rule bg-surface"
        style={{ height }}
        initial={false}
        animate={
          reduce
            ? { opacity: visible ? 1 : 0 }
            : { clipPath: visible ? 'inset(0% 0% 0% 0%)' : 'inset(0% 0% 100% 0%)' }
        }
        transition={{ duration: visible ? 0.42 : 0.22, ease: EASE }}
      >
        {items.map((it) => (
          <img
            key={it.id}
            src={it.src}
            alt=""
            loading="lazy"
            decoding="async"
            className="absolute inset-0 h-full w-full object-cover object-top transition-opacity duration-200"
            style={{ opacity: it.id === activeId ? 1 : 0 }}
          />
        ))}
      </Motion.div>
    </Motion.div>
  );
}
