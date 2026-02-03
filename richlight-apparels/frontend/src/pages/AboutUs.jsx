import { useRef, useEffect } from 'react';
import { gsap } from 'gsap';

const pageStyle = {
  minHeight: '70vh',
  paddingTop: 'var(--section-padding-y)',
  paddingBottom: 'var(--section-padding-y)',
  paddingLeft: 'var(--section-padding-x)',
  paddingRight: 'var(--section-padding-x)',
};
const innerStyle = { maxWidth: 'var(--content-max)', margin: '0 auto' };

export default function AboutUs() {
  const titleRef = useRef(null);
  const textRef = useRef(null);

  useEffect(() => {
    const t = titleRef.current;
    const p = textRef.current;
    if (!t) return;
    gsap.fromTo(t, { y: 24, opacity: 0 }, { y: 0, opacity: 1, duration: 0.6, ease: 'power3.out' });
    if (p) gsap.fromTo(p, { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.5, ease: 'power3.out', delay: 0.1 });
  }, []);

  return (
    <div style={pageStyle}>
      <div style={innerStyle}>
        <h1 ref={titleRef} className="section-heading" style={{ marginBottom: '1rem' }}>
          About Us
        </h1>
        <p ref={textRef} style={{ color: 'var(--text-muted)', maxWidth: '60ch', lineHeight: 1.6 }}>
          Intro, Vision, Mission, Values, History, Directors and Management.
        </p>
      </div>
    </div>
  );
}
