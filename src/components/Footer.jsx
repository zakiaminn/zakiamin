import React, { useEffect, useRef, useState } from 'react';
import { m as Motion, useReducedMotion } from 'framer-motion';
import { profile } from '@/data/profile';
import { facts } from '@/data/skim';
import { PAGE } from '@/components/Nav';
import { MaskLines, MastRules } from '@/components/ui/motion';
import { EASE_EXPO, useFitWidth } from '@/lib/motion';
import posthog from '@/lib/posthog';

const external = (type) => () => posthog.capture('contact_link_clicked', { link_type: type });

function CopyEmail() {
  const [copied, setCopied] = useState(false);
  const timer = useRef(null);

  useEffect(() => () => window.clearTimeout(timer.current), []);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(profile.email);
    } catch {
      return;
    }
    posthog.capture('contact_link_clicked', { link_type: 'copy-email' });
    setCopied(true);
    window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => setCopied(false), 1800);
  };

  const face = 'col-start-1 row-start-1 transition-[opacity,filter] duration-200 ease-[var(--ease)]';

  return (
    <button type="button" onClick={copy} className="btn">
      <span className="grid" aria-hidden="true">
        <span className={face} style={{ opacity: copied ? 0 : 1, filter: copied ? 'blur(2px)' : 'none' }}>
          Copy the address
        </span>
        <span className={`${face} text-center`} style={{ opacity: copied ? 1 : 0, filter: copied ? 'none' : 'blur(2px)' }}>
          Copied
        </span>
      </span>
      <span className="sr-only">Copy the email address {profile.email}</span>
      <span className="sr-only" aria-live="polite">{copied ? 'Email address copied' : ''}</span>
    </button>
  );
}

/**
 * The bookend: the page closes on its own masthead, and the nameplate is the
 * email address. One unmistakable action, set at the page's biggest size.
 */
export default function Footer() {
  const emailRef = useRef(null);
  const reduce = useReducedMotion();
  useFitWidth(emailRef);
  const link = 'sig font-medium text-ink inline-flex min-h-[44px] items-center';

  return (
    <footer id="contact" aria-labelledby="contact-heading" className="pt-10 md:pt-16">
      <div className={PAGE}>
        <div className="grid lg:grid-cols-12 gap-x-10 gap-y-4 items-end pb-8">
          <h2 id="contact-heading" className="lg:col-span-9 font-bold text-[clamp(2.25rem,4.4vw,3.6rem)] leading-[1] tracking-[-0.035em] text-ink">
            <MaskLines inView lines={[`Hiring for a ${profile.seeking}?`, 'Write in.']} />
          </h2>
          <p className="lg:col-span-3 text-lg text-ink-2 pretty lg:pb-1.5">
            Always open to arguments about database schema design, too.
          </p>
        </div>

        <MastRules />
        <div data-fit-box className="py-3 sm:py-4">
          <Motion.a
            href={`mailto:${profile.email}`}
            onClick={external('email')}
            className="block overflow-hidden text-ink"
            initial="hidden"
            whileInView="shown"
            viewport={{ once: true, margin: '0px 0px -10% 0px' }}
          >
            <Motion.span
              ref={emailRef}
              className="nameplate inline-block whitespace-nowrap"
              variants={{
                hidden: reduce ? { opacity: 0 } : { y: '105%' },
                shown: { opacity: 1, y: '0%', transition: { duration: reduce ? 0.3 : 1, ease: EASE_EXPO } },
              }}
            >
              <span className="email-swipe">{profile.email}</span>
            </Motion.span>
          </Motion.a>
        </div>
        <MastRules flip />

        <div className="flex flex-wrap items-center justify-between gap-x-8 gap-y-4 py-5">
          <div className="flex flex-wrap items-center gap-3">
            <a href={`mailto:${profile.email}`} onClick={external('email')} className="btn btn-primary">Email me</a>
            <CopyEmail />
          </div>
          <ul className="flex flex-wrap gap-x-7 gap-y-1 text-sm">
            <li>
              <a href="#resume" onClick={() => posthog.capture('resume_link_clicked', { source: 'footer' })} className={link}>
                Résumé
              </a>
            </li>
            <li>
              <a href={profile.github} target="_blank" rel="me noreferrer" onClick={external('github')} className={link}>
                GitHub<span className="sr-only"> profile (opens in a new tab)</span>
              </a>
            </li>
            <li>
              <a href={profile.linkedin} target="_blank" rel="me noreferrer" onClick={external('linkedin')} className={link}>
                LinkedIn<span className="sr-only"> profile (opens in a new tab)</span>
              </a>
            </li>
          </ul>
          <span className="text-sm text-ink-3">{facts.city}, open to remote</span>
        </div>
      </div>

      <div className="border-t border-rule">
        <div className={`${PAGE} py-6 flex flex-col sm:flex-row justify-between gap-2 text-sm text-ink-3`}>
          <span>© <span className="num" suppressHydrationWarning>{new Date().getFullYear()}</span> Zaki Amin Ahmad, {facts.city}</span>
          <span>Set in Bricolage Grotesque and Spline Sans Mono</span>
        </div>
      </div>
    </footer>
  );
}
