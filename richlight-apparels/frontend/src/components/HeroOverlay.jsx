import { useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { heroEntrance } from '../utils/gsapConfig';

export default function HeroOverlay() {
  const containerRef = useRef(null);

  useEffect(() => {
    const cleanup = heroEntrance(containerRef.current, { delay: 0.4, stagger: 0.2 });
    return () => cleanup?.();
  }, []);

  return (
    <div ref={containerRef} className="hero-overlay" aria-hidden="true">
      <h1 className="hero-headline">
        Dedicated to Perfection, Driven by Innovation.
      </h1>
      <p className="hero-subline">
        Export-focused garment manufacturer from Sri Lanka, delivering quality to global markets.
      </p>
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
