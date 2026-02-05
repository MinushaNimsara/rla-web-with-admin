import { useRef, useEffect } from 'react';
import { revealSection } from '../utils/gsapConfig';

/**
 * "FROM YARN TO HANGER" – manufacturing process with 3 stages.
 * Data: { manufacturingTagline, manufacturingHeadline, manufacturingSub, manufacturingStages: [{ number, title, description, bullets }] }
 */
function highlightText(text) {
  if (!text) return null;
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return parts.map((p, i) => {
    if (p.startsWith('**') && p.endsWith('**')) {
      return <span key={i} className="manufacturing-highlight">{p.slice(2, -2)}</span>;
    }
    return p;
  });
}

export default function ManufacturingProcessSection({ data }) {
  const sectionRef = useRef(null);
  const tagline = data?.manufacturingTagline || 'FROM YARN TO HANGER.';
  const headline = data?.manufacturingHeadline || "A streamlined, transparent **manufacturing process.**";
  const sub = data?.manufacturingSub || 'Every stage is monitored with in-line quality checks, digital tracking and experienced supervision.';
  const stages = Array.isArray(data?.manufacturingStages) && data.manufacturingStages.length > 0
    ? data.manufacturingStages
    : [
        { number: '01', title: 'Stores', description: 'Fabric unloading, shade segregation and raw material inspection with lab testing and system recording.', bullets: 'Fabric inspection & test reports\nBarcode-based inventory\nClimate-controlled storage' },
        { number: '02', title: 'Cutting', description: 'Marker making, spreading and cutting with precision equipment to minimise waste and deviation.', bullets: 'CAD marker planning\nBundling & ticketing\nInline cut-panel checks' },
        { number: '03', title: 'Production', description: 'Modular sewing lines with in-line and end-line audits for consistent quality across every order.', bullets: 'Line balancing & SMV focus\nIn-line QCs & AQL audits\nFinishing, packing & dispatch' },
      ];

  useEffect(() => {
    const cleanup = revealSection(sectionRef.current, {
      heading: '.home-manufacturing-heading',
      sub: '.home-manufacturing-sub',
      cards: '.manufacturing-card',
      stagger: 0.15,
    });
    return () => cleanup?.();
  }, []);

  return (
    <section ref={sectionRef} className="home-manufacturing home-section" aria-label="Manufacturing process">
      <div className="home-manufacturing-inner">
        <p className="home-manufacturing-label">{tagline}</p>
        <h2 className="home-manufacturing-heading">{highlightText(headline)}</h2>
        <p className="home-manufacturing-sub">{sub}</p>
        <div className="home-manufacturing-grid">
          {stages.slice(0, 3).map((stage, i) => (
            <div key={i} className="manufacturing-card">
              <span className="manufacturing-card-number">{stage.number || String(i + 1).padStart(2, '0')}</span>
              <h3 className="manufacturing-card-title">{stage.title}</h3>
              <p className="manufacturing-card-desc">{stage.description}</p>
              {stage.bullets && (
                <ul className="manufacturing-card-bullets">
                  {String(stage.bullets)
                    .split('\n')
                    .filter(Boolean)
                    .map((b, j) => (
                      <li key={j}>{b.trim()}</li>
                    ))}
                </ul>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
