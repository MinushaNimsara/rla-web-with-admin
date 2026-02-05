import { useState, useEffect, useRef } from 'react';
import { getAboutPage } from '../services/firestore';
import { revealSection, gsap } from '../utils/gsapConfig';

const sectionPadding = {
  paddingTop: 'var(--section-padding-y)',
  paddingBottom: 'var(--section-padding-y)',
  paddingLeft: 'var(--section-padding-x)',
  paddingRight: 'var(--section-padding-x)',
};
const innerStyle = { maxWidth: 'var(--content-max)', margin: '0 auto' };

const defaultData = {
  introTitle: 'Introduction',
  introParagraphs: [
    'A premier clothing manufacturer, Rich Light Apparels has been in operation growing from a humble beginning to its current stature.',
    'A specialist forerunner in fashion across a number of categories, we are committed to superlative quality in all dimensions of the apparel business.',
  ],
  visionTitle: 'Our Vision',
  visionQuote: 'To be a preferred partner for discerning, quality-conscious customers who demand the best from their attire.',
  missionTitle: 'Our Mission',
  missionQuote: 'To be an exemplary presence in the industry, engaging our stakeholders ethically with respect, integrity and care.',
  valuesTitle: 'Our Values',
  valuesList: ['Focus on Stakeholders', 'Achievement of Total Satisfaction', 'Uncompromising Quality', 'Continuous Growth'],
  historyTitle: 'Our History',
  historyParagraphs: [
    'With a strong tenure in the business, Rich Light Apparels has transformed to occupy a leading position in the industry. Drawing from a proud legacy while maintaining a steady focus on the future, we continue to scale new heights of success.',
  ],
  directorsTitle: 'Board of Directors',
  directors: [],
  managementTitle: 'Management Team',
  management: [],
  introImageUrl: '',
  aboutImages: [],
};

function SectionBlock({ id, title, children, className = '', sectionRef, headingCentered }) {
  return (
    <section id={id} ref={sectionRef} className={`about-section ${className}`.trim()} style={{ ...sectionPadding, scrollMarginTop: '5rem' }}>
      <div style={innerStyle} className="about-section-inner">
        {title && (
          <div className={headingCentered ? 'about-section-heading-centered' : 'about-section-heading'} style={headingCentered ? { textAlign: 'center', marginBottom: '1.5rem' } : { marginBottom: '1.5rem' }}>
            <h2 className="section-heading about-section-title">
              {title}
            </h2>
            <div className="about-section-heading-line" aria-hidden="true" />
          </div>
        )}
        {children}
      </div>
    </section>
  );
}

function PersonCard({ name, title, bio, imageUrl }) {
  const cardRef = useRef(null);
  const imgRef = useRef(null);

  const handleMouseEnter = () => {
    if (!cardRef.current) return;
    gsap.to(cardRef.current, {
      y: -8,
      duration: 0.35,
      ease: 'power2.out',
      boxShadow: '0 16px 40px rgba(13, 148, 136, 0.15)',
    });
    if (imageUrl && imgRef.current) gsap.to(imgRef.current, { scale: 1.06, duration: 0.4, ease: 'power2.out' });
  };
  const handleMouseLeave = () => {
    if (!cardRef.current) return;
    gsap.to(cardRef.current, { y: 0, duration: 0.35, ease: 'power2.out', boxShadow: '0 4px 20px rgba(0,0,0,0.08)' });
    if (imageUrl && imgRef.current) gsap.to(imgRef.current, { scale: 1, duration: 0.35, ease: 'power2.out' });
  };

  return (
    <div
      ref={cardRef}
      className="about-person-card animate-card"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {imageUrl && (
        <div className="about-person-card-img-wrap" ref={imgRef}>
          <img src={imageUrl} alt="" />
        </div>
      )}
      {name && <h3 className="about-person-card-name">{name}</h3>}
      {title && <p className="about-person-card-title">– {title} –</p>}
      {bio && <p className="about-person-card-bio">{bio}</p>}
    </div>
  );
}

const navLinks = [
  { id: 'about-intro', label: 'Introduction' },
  { id: 'about-vision', label: 'Vision' },
  { id: 'about-mission', label: 'Mission' },
  { id: 'about-values', label: 'Values' },
  { id: 'about-history', label: 'History' },
  { id: 'about-gallery', label: 'Gallery' },
  { id: 'about-directors', label: 'Directors' },
];

export default function AboutUs() {
  const [data, setData] = useState(defaultData);
  const [loading, setLoading] = useState(true);
  const refs = useRef({});
  const heroRef = useRef(null);

  useEffect(() => {
    getAboutPage()
      .then((d) => setData({ ...defaultData, ...d }))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (loading) return () => {};
    const cleanups = navLinks.map(({ id }) => revealSection(refs.current[id], { stagger: 0.08 })).filter(Boolean);
    return () => cleanups.forEach((c) => c?.());
  }, [loading]);

  useEffect(() => {
    if (loading || !heroRef.current) return () => {};
    const ctx = gsap.context(() => {
      const title = heroRef.current?.querySelector('.about-hero-title');
      const line = heroRef.current?.querySelector('.about-hero-line');
      if (title) gsap.fromTo(title, { y: 32, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8, ease: 'power3.out' });
      if (line) gsap.fromTo(line, { scaleX: 0 }, { scaleX: 1, duration: 0.6, delay: 0.3, ease: 'power2.out', transformOrigin: 'left' });
    }, heroRef.current);
    return () => ctx.revert();
  }, [loading]);

  const introParagraphs = Array.isArray(data.introParagraphs) ? data.introParagraphs : (data.introText ? data.introText.split('\n\n').filter(Boolean) : defaultData.introParagraphs);
  const historyParagraphs = Array.isArray(data.historyParagraphs) ? data.historyParagraphs : (data.historyText ? data.historyText.split('\n\n').filter(Boolean) : defaultData.historyParagraphs);
  const valuesList = Array.isArray(data.valuesList) ? data.valuesList : defaultData.valuesList;
  const directors = Array.isArray(data.directors) ? data.directors : [];
  const introImageUrl = data.introImageUrl || '';
  const aboutImages = Array.isArray(data.aboutImages) ? data.aboutImages : [];

  if (loading) {
    return (
      <div style={{ ...sectionPadding, textAlign: 'center', color: 'var(--text-muted)' }}>
        <p>Loading...</p>
      </div>
    );
  }

  const visibleNavLinks = navLinks.filter(({ id }) => id !== 'about-gallery' || aboutImages.length > 0);

  return (
    <main className="about-page">
      <header ref={heroRef} className="about-hero" aria-label="About us">
        <div style={innerStyle} className="about-hero-inner">
          <h1 className="about-hero-title">About Us</h1>
          <p className="about-hero-sub">Our story, vision, and the people behind Rich Light Apparels.</p>
          <div className="about-hero-line" aria-hidden="true" />
        </div>
      </header>

      <nav aria-label="About page sections" className="about-nav about-nav-bar about-nav-sticky">
        <div style={innerStyle}>
          <ul className="about-nav-list">
            {visibleNavLinks.map(({ id, label }) => (
              <li key={id}>
                <a href={`#${id}`} className="about-nav-link">
                  {label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </nav>

      <SectionBlock id="about-intro" title="Introduction" sectionRef={(el) => (refs.current['about-intro'] = el)} className="section-cream">
        <div className={`about-intro-inner ${introImageUrl ? 'about-intro-has-image' : ''}`}>
          {introImageUrl && (
            <div className="about-intro-image-wrap animate-card">
              <img src={introImageUrl} alt="" />
            </div>
          )}
          <div className="about-intro-content">
            {introParagraphs.map((p, i) => (
              <p key={i} className="about-reveal-item about-intro-p">
                {p}
              </p>
            ))}
          </div>
        </div>
      </SectionBlock>

      <SectionBlock id="about-vision" title={data.visionTitle || defaultData.visionTitle} sectionRef={(el) => (refs.current['about-vision'] = el)} className="section-white">
        <div className="about-quote-wrap animate-card">
          <blockquote className="about-quote">
            {data.visionQuote || defaultData.visionQuote}
          </blockquote>
        </div>
      </SectionBlock>

      <SectionBlock id="about-mission" title={data.missionTitle || defaultData.missionTitle} sectionRef={(el) => (refs.current['about-mission'] = el)} className="section-blue">
        <div className="about-quote-wrap animate-card">
          <blockquote className="about-quote">
            {data.missionQuote || defaultData.missionQuote}
          </blockquote>
        </div>
      </SectionBlock>

      <SectionBlock id="about-values" title={data.valuesTitle || defaultData.valuesTitle} sectionRef={(el) => (refs.current['about-values'] = el)} className="section-white">
        <ul className="about-values-grid" role="list">
          {valuesList.map((item, i) => (
            <li key={i} className="about-value-item about-reveal-item">
              <span className="about-value-text">{item}</span>
            </li>
          ))}
        </ul>
      </SectionBlock>

      <SectionBlock id="about-history" title={data.historyTitle || defaultData.historyTitle} sectionRef={(el) => (refs.current['about-history'] = el)} className="section-cream">
        <div className="about-history-content">
          {historyParagraphs.map((p, i) => (
            <p key={i} className="about-reveal-item about-history-p">
              {p}
            </p>
          ))}
        </div>
      </SectionBlock>

      {aboutImages.length > 0 && (
        <SectionBlock id="about-gallery" title="Gallery" sectionRef={(el) => (refs.current['about-gallery'] = el)} className="section-white">
          <div className="about-gallery-grid">
            {aboutImages.map((url, i) => (
              <div key={i} className="about-gallery-item gallery-item">
                <img src={url} alt="" />
              </div>
            ))}
          </div>
        </SectionBlock>
      )}

      {directors.length > 0 && (
        <SectionBlock id="about-directors" title={data.directorsTitle || defaultData.directorsTitle} sectionRef={(el) => (refs.current['about-directors'] = el)} className="section-cream" headingCentered>
          <div className="about-directors-grid">
            {directors.map((person, i) => (
              <PersonCard key={i} name={person.name} title={person.title} bio={person.bio} imageUrl={person.imageUrl} />
            ))}
          </div>
        </SectionBlock>
      )}

    </main>
  );
}
