import { useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { revealSection } from '../utils/gsapConfig';

gsap.registerPlugin(ScrollTrigger);

const defaultAbout = {
  aboutImageUrl: '',
  aboutLocationText: 'Based in Rathnapura, Sri Lanka',
  aboutSubtitle: 'ABOUT RICHLIGHT',
  aboutHeading: 'Where ideas blend with global fashion trends.',
  aboutParagraph1: 'Richlight Apparels is committed to quality, ethical sourcing, and sustainable practices. We work with global brands to bring their vision to life through craftsmanship and attention to detail.',
  aboutParagraph2: 'Our fully-integrated facility combines modern technology with skilled hands, ensuring every garment meets the highest standards. From design to delivery, we are your trusted partner in apparel manufacturing.',
  aboutStat1Value: '5',
  aboutStat1Label: 'Acre Facility',
  aboutStat2Value: '250+',
  aboutStat2Label: 'Skilled Staff',
  aboutStat3Value: '40+',
  aboutStat3Label: 'Global Clients',
};

export default function WhoWeAreSection({ about = {} }) {
  const sectionRef = useRef(null);
  const statsRef = useRef(null);
  const valueRefs = useRef([]);
  const countObjsRef = useRef([]);
  const hasAnimatedRef = useRef(false);
  const data = { ...defaultAbout, ...about };

  useEffect(() => {
    if (!sectionRef.current) return () => {};
    const cleanup = revealSection(sectionRef.current, { stagger: 0.08 });
    return () => cleanup?.();
  }, []);

  useEffect(() => {
    if (!statsRef.current) return () => {};
    const els = statsRef.current.querySelectorAll('.who-we-are-stat-value');
    valueRefs.current = Array.from(els);
    countObjsRef.current = [];

    const parseNumeric = (str) => {
      if (!str) return null;
      const match = String(str).trim().match(/^(\d+(?:\.\d+)?)(.*)$/);
      if (!match) return null;
      const end = parseFloat(match[1], 10);
      const suffix = match[2] ? match[2].trim() : '';
      return { end, suffix };
    };

    const startCount = () => {
      if (hasAnimatedRef.current) return;
      hasAnimatedRef.current = true;
      valueRefs.current.forEach((el, i) => {
        if (!el) return;
        const parsed = parseNumeric(el.dataset.value);
        if (!parsed) return;
        const obj = { n: 0 };
        countObjsRef.current[i] = obj;
        gsap.to(obj, {
          n: parsed.end,
          duration: 1.6,
          ease: 'power2.out',
          delay: i * 0.1,
          snap: { n: 1 },
          onUpdate: () => {
            const val = Math.round(obj.n);
            el.textContent = `${val}${parsed.suffix}`;
          },
        });
      });
    };

    gsap.set(statsRef.current.querySelectorAll('.who-we-are-stat'), { opacity: 0, y: 16 });
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: statsRef.current,
        start: 'top 85%',
        once: true,
      },
    });
    tl.to(statsRef.current.querySelectorAll('.who-we-are-stat'), {
      opacity: 1,
      y: 0,
      duration: 0.6,
      stagger: 0.08,
      ease: 'power3.out',
    });
    tl.add(startCount, 0.25);

    return () => {
      tl.scrollTrigger?.kill();
      tl.kill();
      gsap.killTweensOf(countObjsRef.current);
    };
  }, [data.aboutStat1Value, data.aboutStat2Value, data.aboutStat3Value]);

  const hasImage = !!data.aboutImageUrl;
  const hasContent =
    data.aboutSubtitle ||
    data.aboutHeading ||
    data.aboutParagraph1 ||
    data.aboutParagraph2 ||
    data.aboutStat1Value ||
    data.aboutStat2Value ||
    data.aboutStat3Value;

  if (!hasContent && !hasImage) return null;

  return (
    <section
      ref={sectionRef}
      className="home-section section-cream who-we-are-section"
      aria-label="Who we are"
      style={{
        paddingTop: 'var(--section-padding-y)',
        paddingBottom: 'var(--section-padding-y)',
        paddingLeft: 'var(--section-padding-x)',
        paddingRight: 'var(--section-padding-x)',
      }}
    >
      <div
        style={{
          maxWidth: 'var(--content-max)',
          margin: '0 auto',
          display: 'grid',
          gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 1fr)',
          gap: 'clamp(2rem, 5vw, 3.5rem)',
          alignItems: 'center',
        }}
        className="who-we-are-inner"
      >
        {/* Left: image with location overlay */}
        <div
          className="who-we-are-image-wrap"
          style={{
            position: 'relative',
            borderRadius: 12,
            overflow: 'hidden',
            aspectRatio: '4/5',
            maxHeight: 520,
            backgroundColor: 'var(--surface)',
          }}
        >
          {hasImage ? (
            <img
              src={data.aboutImageUrl}
              alt=""
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
              }}
            />
          ) : (
            <div
              style={{
                width: '100%',
                height: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--text-muted)',
                fontSize: 'var(--text-sm)',
              }}
            >
              Add an image in Admin → Edit Home → Who We Are
            </div>
          )}
          {data.aboutLocationText && (
            <div
              className="who-we-are-location"
              style={{
                position: 'absolute',
                bottom: 0,
                left: 0,
                right: 0,
                padding: '0.75rem 1rem',
                background: 'linear-gradient(180deg, transparent 0%, rgba(0,0,0,0.75) 100%)',
                color: '#fff',
                fontSize: 'var(--text-sm)',
                fontWeight: 500,
              }}
            >
              {data.aboutLocationText}
            </div>
          )}
        </div>

        {/* Right: text + stats */}
        <div className="who-we-are-content" style={{ minWidth: 0 }}>
          {data.aboutSubtitle && (
            <p
              className="who-we-are-subtitle"
              style={{
                margin: 0,
                fontSize: 'var(--text-sm)',
                fontWeight: 600,
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
                color: 'var(--text-muted)',
                marginBottom: '0.5rem',
              }}
            >
              {data.aboutSubtitle}
            </p>
          )}
          {data.aboutHeading && (
            <h2
              className="who-we-are-heading"
              style={{
                margin: '0 0 1rem',
                fontSize: 'var(--heading-2)',
                fontWeight: 700,
                lineHeight: 'var(--line-tight)',
                color: 'var(--text)',
              }}
            >
              {data.aboutHeading.split('**').map((part, i) =>
                i % 2 === 1 ? (
                  <span key={i} style={{ color: 'var(--accent)' }}>
                    {part}
                  </span>
                ) : (
                  part
                )
              )}
            </h2>
          )}
          {data.aboutParagraph1 && (
            <p
              style={{
                margin: '0 0 0.75rem',
                fontSize: 'var(--text-base)',
                lineHeight: 'var(--line-normal)',
                color: 'var(--text)',
              }}
            >
              {data.aboutParagraph1}
            </p>
          )}
          {data.aboutParagraph2 && (
            <p
              style={{
                margin: 0,
                fontSize: 'var(--text-base)',
                lineHeight: 'var(--line-normal)',
                color: 'var(--text)',
              }}
            >
              {data.aboutParagraph2}
            </p>
          )}
          <div
            ref={statsRef}
            className="who-we-are-stats"
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: '1.5rem 2rem',
              marginTop: '1.5rem',
            }}
          >
            {data.aboutStat1Value && (
              <div className="who-we-are-stat" style={{ display: 'flex', flexDirection: 'column', gap: '0.15rem' }}>
                <span className="who-we-are-stat-value" data-value={data.aboutStat1Value} style={{ fontSize: 'var(--heading-2)', fontWeight: 700, color: 'var(--accent-orange)' }}>
                  {data.aboutStat1Value}
                </span>
                <span style={{ fontSize: 'var(--text-sm)', color: 'var(--text-muted)' }}>
                  {data.aboutStat1Label}
                </span>
              </div>
            )}
            {data.aboutStat2Value && (
              <div className="who-we-are-stat" style={{ display: 'flex', flexDirection: 'column', gap: '0.15rem' }}>
                <span className="who-we-are-stat-value" data-value={data.aboutStat2Value} style={{ fontSize: 'var(--heading-2)', fontWeight: 700, color: 'var(--accent-orange)' }}>
                  {data.aboutStat2Value}
                </span>
                <span style={{ fontSize: 'var(--text-sm)', color: 'var(--text-muted)' }}>
                  {data.aboutStat2Label}
                </span>
              </div>
            )}
            {data.aboutStat3Value && (
              <div className="who-we-are-stat" style={{ display: 'flex', flexDirection: 'column', gap: '0.15rem' }}>
                <span className="who-we-are-stat-value" data-value={data.aboutStat3Value} style={{ fontSize: 'var(--heading-2)', fontWeight: 700, color: 'var(--accent-orange)' }}>
                  {data.aboutStat3Value}
                </span>
                <span style={{ fontSize: 'var(--text-sm)', color: 'var(--text-muted)' }}>
                  {data.aboutStat3Label}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
