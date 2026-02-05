import { useState, useEffect, useRef } from 'react';
import { gsap } from 'gsap';

const HERO_INTERVAL = 5500;
const TRANSITION_DURATION = 1;

export default function ImageCarousel({ slides = [], intervalMs = HERO_INTERVAL }) {
  const [current, setCurrent] = useState(0);
  const containerRef = useRef(null);
  const prevRef = useRef(0);

  useEffect(() => {
    if (slides.length <= 1) return;
    const id = setInterval(() => {
      setCurrent((c) => (c + 1) % slides.length);
    }, intervalMs);
    return () => clearInterval(id);
  }, [slides.length, intervalMs]);

  // GSAP crossfade when current changes
  useEffect(() => {
    if (!containerRef.current || !slides.length) return;
    const slidesEl = containerRef.current.querySelectorAll('.hero-slide');
    if (slidesEl.length === 0) return;
    const prev = prevRef.current;
    const next = current;
    if (prev === next) return;

    const nextEl = slidesEl[next];
    const prevEl = slidesEl[prev];
    if (!nextEl || !prevEl) return;

    gsap.set(nextEl, { opacity: 0, zIndex: 2 });
    gsap.to(prevEl, {
      opacity: 0,
      duration: TRANSITION_DURATION * 0.5,
      ease: 'power2.inOut',
    });
    gsap.to(nextEl, {
      opacity: 1,
      duration: TRANSITION_DURATION,
      ease: 'power2.out',
      delay: 0.15,
    });
    prevRef.current = next;
  }, [current, slides.length]);

  if (!slides.length) {
    return (
      <div className="hero-viewport" style={styles.placeholder}>
        
      </div>
    );
  }

  return (
    <div ref={containerRef} className="hero-viewport" style={styles.wrap}>
      {slides.map((slide, i) => {
        const imageUrl = typeof slide === 'string' ? slide : slide?.imageUrl;
        const isActive = i === current;
        return (
          <div
            key={i}
            className={`hero-slide ${isActive ? 'active' : ''}`}
            style={{ ...styles.slide, opacity: i === 0 && current === 0 ? 1 : undefined }}
            aria-hidden={!isActive}
          >
            <img src={imageUrl} alt="" draggable={false} />
          </div>
        );
      })}
      {slides.length > 1 && (
        <>
          <button
            type="button"
            className="hero-nav hero-prev"
            onClick={() => setCurrent((c) => (c - 1 + slides.length) % slides.length)}
            aria-label="Previous slide"
          >
            ‹
          </button>
          <button
            type="button"
            className="hero-nav hero-next"
            onClick={() => setCurrent((c) => (c + 1) % slides.length)}
            aria-label="Next slide"
          >
            ›
          </button>
        </>
      )}
    </div>
  );
}

const styles = {
  wrap: {
    position: 'relative',
  },
  slide: {
    transition: 'none',
  },
  placeholder: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: 'var(--text-muted)',
    fontSize: 'var(--text-lg)',
  },
};
