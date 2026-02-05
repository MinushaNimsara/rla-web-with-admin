import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export { gsap, ScrollTrigger };

export const defaultReveal = {
  y: 48,
  opacity: 0,
  duration: 0.7,
  ease: 'power3.out',
  stagger: 0.1,
  overwrite: true,
};

/**
 * Hero entrance: run once on mount. Animates headline, subline, and optional CTAs.
 */
export function heroEntrance(container, opts = {}) {
  if (!container) return () => {};
  const {
    headline = '.hero-headline',
    subline = '.hero-subline',
    cta = '.hero-cta',
    duration = 0.8,
    stagger = 0.15,
    delay = 0.2,
  } = opts;

  const ctx = gsap.context(() => {
    const head = container.querySelector(headline);
    const sub = container.querySelector(subline);
    const ctas = container.querySelectorAll(cta);

    gsap.set([head, sub, ...ctas], { opacity: 0, y: 32 });

    const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });
    if (head) tl.to(head, { opacity: 1, y: 0, duration, ease: 'back.out(1.1)' }, delay);
    if (sub) tl.to(sub, { opacity: 1, y: 0, duration, ease: 'power3.out' }, delay + stagger);
    ctas.forEach((el, i) => {
      tl.to(el, { opacity: 1, y: 0, duration: 0.6, ease: 'back.out(1.05)' }, delay + stagger * 2 + i * 0.1);
    });
  }, container);
  return () => ctx.revert();
}

/**
 * Scroll-triggered section reveal: heading, sub, and cards (optional scale).
 */
export function revealSection(container, opts = {}) {
  if (!container) return () => {};
  const {
    heading = '.section-heading',
    sub = '.section-sub',
    cards = '.animate-card',
    galleryItems = '.gallery-item',
    staggerItems = '.about-reveal-item',
    y = 48,
    opacity = 0,
    duration = 0.7,
    ease = 'power3.out',
    stagger = 0.12,
    scale = false,
    start = 'top 82%',
  } = opts;

  const ctx = gsap.context(() => {
    const headingEl = container.querySelector(heading);
    const subEl = container.querySelector(sub);
    const cardEls = container.querySelectorAll(cards);
    const galleryEls = container.querySelectorAll(galleryItems);
    const staggerEls = container.querySelectorAll(staggerItems);

    const fromProps = scale ? { y, opacity: 0, scale: 0.96 } : { y, opacity: 0 };
    const toProps = scale ? { y: 0, opacity: 1, scale: 1 } : { y: 0, opacity: 1 };

    gsap.fromTo(
      [headingEl, subEl].filter(Boolean),
      fromProps,
      {
        ...toProps,
        duration,
        ease,
        stagger: 0.1,
        scrollTrigger: {
          trigger: container,
          start,
          toggleActions: 'play none none none',
        },
      }
    );

    if (cardEls.length) {
      gsap.fromTo(
        cardEls,
        { y: 50, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.75,
          ease: 'back.out(1.02)',
          stagger,
          scrollTrigger: {
            trigger: container,
            start: 'top 80%',
            toggleActions: 'play none none none',
          },
        }
      );
    }

    if (galleryEls.length) {
      gsap.fromTo(
        galleryEls,
        { opacity: 0, scale: 0.92 },
        {
          opacity: 1,
          scale: 1,
          duration: 0.5,
          ease: 'power2.out',
          stagger: 0.05,
          scrollTrigger: {
            trigger: container,
            start: 'top 85%',
            toggleActions: 'play none none none',
          },
        }
      );
    }

    if (staggerEls.length) {
      gsap.fromTo(
        staggerEls,
        { y: 28, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.6,
          ease: 'power3.out',
          stagger: 0.08,
          scrollTrigger: {
            trigger: container,
            start: 'top 85%',
            toggleActions: 'play none none none',
          },
        }
      );
    }
  }, container);
  return () => ctx.revert();
}

/**
 * Fade/slide in when element enters viewport (e.g. brands strip).
 */
export function revealOnScroll(container, opts = {}) {
  if (!container) return () => {};
  const { y = 24, opacity = 0, duration = 0.8, ease = 'power3.out', start = 'top 90%' } = opts;
  const ctx = gsap.context(() => {
    gsap.fromTo(
      container,
      { y, opacity },
      {
        y: 0,
        opacity: 1,
        duration,
        ease,
        scrollTrigger: {
          trigger: container,
          start,
          toggleActions: 'play none none none',
        },
      }
    );
  }, container);
  return () => ctx.revert();
}
