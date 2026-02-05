import { useRef, useEffect, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const DEFAULT_STATS = [
  { value: '15+', label: 'Years Experience' },
  { value: '100K+', label: 'pcs / month Capacity' },
  { value: 'US • UK • EU', label: 'Markets' },
];

/**
 * Parse stat value for count-up: "15+" -> { end: 15, suffix: "+" }, "100K+" -> { end: 100, suffix: "K+" }.
 * Returns null if not numeric (e.g. "US • UK • EU").
 */
function parseNumericValue(str) {
  if (!str || typeof str !== 'string') return null;
  const trimmed = str.trim();
  const match = trimmed.match(/^(\d+(?:\.\d+)?)\s*([KkMm]?\+?)?$/);
  if (!match) return null;
  const end = parseFloat(match[1], 10);
  const suffix = (match[2] || '').trim();
  return { end, suffix };
}

export default function HeroStats({ stats: statsProp }) {
  const stats = Array.isArray(statsProp) && statsProp.length > 0 ? statsProp : DEFAULT_STATS;
  const wrapRef = useRef(null);
  const valueRefs = useRef([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const countObjsRef = useRef([]);
  const hasAnimatedRef = useRef(false);

  useEffect(() => {
    if (!wrapRef.current || !mounted) return;
    const els = wrapRef.current.querySelectorAll('.hero-stat');
    valueRefs.current = [];
    els.forEach((el) => valueRefs.current.push(el.querySelector('.hero-stat-value')));
    countObjsRef.current = [];

    function startCountUps() {
      if (hasAnimatedRef.current) return;
      hasAnimatedRef.current = true;
      stats.forEach((s, i) => {
        const parsed = parseNumericValue(s.value);
        const valueEl = valueRefs.current[i];
        if (!valueEl || !parsed) return;

        const obj = { n: 0 };
        countObjsRef.current[i] = obj;
        gsap.to(obj, {
          n: parsed.end,
          duration: 1.8,
          ease: 'power2.out',
          delay: i * 0.2,
          snap: { n: 1 },
          onUpdate: () => {
            const display = Math.round(obj.n);
            valueEl.textContent = display + parsed.suffix;
          },
        });
      });
    }

    gsap.set(els, { opacity: 0, y: 20 });
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: wrapRef.current,
        start: 'top 88%',
        once: true,
      },
    });
    tl.to(els, {
      opacity: 1,
      y: 0,
      duration: 0.7,
      stagger: 0.12,
      ease: 'power3.out',
    });
    tl.add(startCountUps, 0.35);

    return () => {
      tl.scrollTrigger?.kill();
      tl.kill();
      gsap.killTweensOf(countObjsRef.current);
    };
  }, [mounted, stats]);

  return (
    <div ref={wrapRef} className="hero-stats">
      {stats.map((s, i) => {
        const parsed = parseNumericValue(s.value);
        const isNumeric = parsed !== null;
        return (
          <div key={i} className="hero-stat">
            <span className="hero-stat-value">
              {isNumeric ? '0' + (parsed?.suffix || '') : s.value}
            </span>
            <span className="hero-stat-label">{s.label}</span>
          </div>
        );
      })}
    </div>
  );
}
