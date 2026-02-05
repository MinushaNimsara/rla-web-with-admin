import { useRef, useEffect } from 'react';
import { revealSection } from '../utils/gsapConfig';

/**
 * Renders "Apparel solutions for every segment" with 4 category cards.
 * Data: { segmentsHeading, segmentsSub, segmentCards: [{ title, imageUrl, badge, description }] }
 */
function highlightText(text) {
  if (!text) return null;
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return parts.map((p, i) => {
    if (p.startsWith('**') && p.endsWith('**')) {
      return <span key={i} className="segment-highlight">{p.slice(2, -2)}</span>;
    }
    return p;
  });
}

export default function ApparelSegmentsSection({ data }) {
  const sectionRef = useRef(null);
  const heading = data?.segmentsHeading || "Apparel solutions for **every** segment.";
  const sub = data?.segmentsSub || "We cater to essentials, casualwear, kids and sportswear segments, with flexible MOQs and custom development.";
  const cards = Array.isArray(data?.segmentCards) && data.segmentCards.length > 0
    ? data.segmentCards
    : [
        { title: 'Knitted T-Shirts', badge: 'BEST SELLER', badgeColor: 'blue', description: 'Soft-touch cotton and blends, ideal for premium basics and promotional ranges. Fabric: 100% cotton / blends, GSM: 140-220, Prints, embroidery & trims.', imageUrl: '' },
        { title: 'Kidswear', badge: 'NEW', badgeColor: 'orange', description: 'Comfort-first garments engineered for durability, safety and easy care. OEKO-TEX compliant fabrics, Snap-safe trims, Custom prints & characters.', imageUrl: '' },
        { title: 'Sports & Activewear', badge: 'PERFORMANCE', badgeColor: 'blue', description: 'Moisture-wicking, breathable fabrics for athletes and lifestyle brands. Quick-dry polyester blends, Mesh panels & laser cuts, Reflective trims & branding.', imageUrl: '' },
        { title: 'Loungewear & Sleepwear', badge: 'COMFORT', badgeColor: 'orange', description: 'Relaxed silhouettes crafted for everyday comfort and long-lasting softness. Brushed & ribbed knits, Custom dye & washes, All-over prints.', imageUrl: '' },
      ];

  useEffect(() => {
    const cleanup = revealSection(sectionRef.current, { stagger: 0.12, scale: true });
    return () => cleanup?.();
  }, []);

  return (
    <section ref={sectionRef} className="home-segments home-section" aria-label="Apparel segments">
      <div className="home-segments-inner">
        <p className="home-segments-label">APPAREL SEGMENTS</p>
        <h2 className="home-segments-heading">{highlightText(heading)}</h2>
        <p className="home-segments-sub">{sub}</p>
        <div className="home-segments-grid">
          {cards.slice(0, 4).map((card, i) => (
            <div key={i} className="home-segment-card animate-card">
              <div className="home-segment-card-image-wrap">
                {card.imageUrl ? (
                  <img src={card.imageUrl} alt="" className="home-segment-card-image" />
                ) : (
                  <div className="home-segment-card-placeholder" />
                )}
                {card.badge && (
                  <span className={`home-segment-badge home-segment-badge--${card.badgeColor || 'blue'}`}>
                    {card.badge}
                  </span>
                )}
              </div>
              <h3 className="home-segment-card-title">{card.title}</h3>
              <p className="home-segment-card-desc">{card.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
