import { useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { heroEntrance, gsap } from '../utils/gsapConfig';

export default function HeroOverlay() {
  const containerRef = useRef(null);

  useEffect(() => {
    const cleanup = heroEntrance(containerRef.current, { delay: 0.5, stagger: 0.18 });
    const el = containerRef.current;
    if (el) {
      const label = el.querySelector('.hero-label');
      const line = el.querySelector('.hero-overlay-line');
      if (label) gsap.fromTo(label, { opacity: 0, y: 16 }, { opacity: 1, y: 0, duration: 0.55, delay: 0.25, ease: 'power2.out' });
      if (line) gsap.fromTo(line, { scaleX: 0 }, { scaleX: 1, duration: 0.5, delay: 0.85, ease: 'power2.out', transformOrigin: 'center' });
    }
    return () => cleanup?.();
  }, []);

  return (
    <div ref={containerRef} className="hero-overlay" aria-hidden="true">
      <p className="hero-label">Sri Lanka&apos;s Premier Garment Manufacturer</p>
      <h1 className="hero-headline">
        Dedicated to Perfection, Driven by Innovation.
      </h1>
      <p className="hero-subline">
        Export-focused garment manufacturer delivering quality to global markets.
      </p>
      <div className="hero-overlay-line" aria-hidden="true" />
      <div className="hero-ctas">
        <Link to="/products" className="hero-cta hero-cta-primary">
          Explore Products
        </Link>
        <Link to="/contact" className="hero-cta hero-cta-secondary">
          Talk to Us
        </Link>
      </div>
    </div>
  );
}
