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

export function revealSection(container, opts = {}) {
  if (!container) return () => {};
  const {
    heading = '.section-heading',
    sub = '.section-sub',
    cards = '.animate-card',
    y = 48,
    opacity = 0,
    duration = 0.7,
    ease = 'power3.out',
    stagger = 0.12,
  } = opts;

  const ctx = gsap.context(() => {
    const els = {
      heading: container.querySelector(heading),
      sub: container.querySelector(sub),
      cards: container.querySelectorAll(cards),
    };
    gsap.fromTo(
      [els.heading, els.sub].filter(Boolean),
      { y, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration,
        ease,
        stagger: 0.1,
        scrollTrigger: {
          trigger: container,
          start: 'top 82%',
          toggleActions: 'play none none none',
        },
      }
    );
    if (els.cards.length) {
      gsap.fromTo(
        els.cards,
        { y: 40, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.6,
          ease: 'power3.out',
          stagger,
          scrollTrigger: {
            trigger: container,
            start: 'top 80%',
            toggleActions: 'play none none none',
          },
        }
      );
    }
  }, container);
  return () => ctx.revert();
}
