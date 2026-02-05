import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { gsap } from '../utils/gsapConfig';

const DESKTOP_BREAKPOINT = 1024;

/**
 * Soft blob cursor: only on desktop (min-width 1024px). Disabled on mobile and tablet.
 * Rendered via portal to document.body so it is never clipped by parent overflow/transform.
 */
export default function CursorDot() {
  const blobRef = useRef(null);
  const xRef = useRef(0);
  const yRef = useRef(0);
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia(`(min-width: ${DESKTOP_BREAKPOINT}px)`);
    const update = () => setIsDesktop(mq.matches);
    update();
    mq.addEventListener('change', update);
    return () => mq.removeEventListener('change', update);
  }, []);

  useEffect(() => {
    if (!isDesktop) return;

    const blob = blobRef.current;
    if (!blob) return;

    document.body.classList.add('cursor-dot-active');

    const handleMove = (e) => {
      xRef.current = e.clientX;
      yRef.current = e.clientY;
    };

    const hoverSelector = 'a, button, [role="button"], input, textarea, [data-cursor-hover]';
    const handleOver = (e) => {
      if (e.target?.closest?.(hoverSelector)) {
        gsap.to(blob, { scale: 1.8, opacity: 0.7, duration: 0.35, ease: 'power2.out', overwrite: true });
      }
    };
    const handleOut = (e) => {
      if (e.target?.closest?.(hoverSelector) && !e.relatedTarget?.closest?.(hoverSelector)) {
        gsap.to(blob, { scale: 1, opacity: 1, duration: 0.35, ease: 'power2.out', overwrite: true });
      }
    };

    const snapToMouse = (e) => {
      const x = e.clientX;
      const y = e.clientY;
      xRef.current = x;
      yRef.current = y;
      gsap.set(blob, { x, y });
    };

    const syncCursorOnReturn = () => {
      if (document.visibilityState !== 'visible') return;
      const oneTimeMove = (e) => {
        snapToMouse(e);
        window.removeEventListener('mousemove', oneTimeMove);
      };
      window.addEventListener('mousemove', oneTimeMove, { passive: true, once: true });
    };

    window.addEventListener('mousemove', handleMove, { passive: true });
    document.addEventListener('visibilitychange', syncCursorOnReturn);
    window.addEventListener('focus', syncCursorOnReturn);
    document.body.addEventListener('mouseover', handleOver);
    document.body.addEventListener('mouseout', handleOut);

    gsap.set(blob, { xPercent: -50, yPercent: -50 });
    const quickX = gsap.quickTo(blob, 'x', { duration: 0.22, ease: 'power2.out' });
    const quickY = gsap.quickTo(blob, 'y', { duration: 0.22, ease: 'power2.out' });

    let rafId;
    const tick = () => {
      quickX(xRef.current);
      quickY(yRef.current);
      rafId = requestAnimationFrame(tick);
    };
    rafId = requestAnimationFrame(tick);
    gsap.set(blob, { x: xRef.current, y: yRef.current });

    return () => {
      document.body.classList.remove('cursor-dot-active');
      window.removeEventListener('mousemove', handleMove);
      document.removeEventListener('visibilitychange', syncCursorOnReturn);
      window.removeEventListener('focus', syncCursorOnReturn);
      document.body.removeEventListener('mouseover', handleOver);
      document.body.removeEventListener('mouseout', handleOut);
      cancelAnimationFrame(rafId);
    };
  }, [isDesktop]);

  if (!isDesktop) return null;

  const cursorEl = <div ref={blobRef} className="cursor-blob" aria-hidden />;
  return createPortal(cursorEl, document.body);
}
