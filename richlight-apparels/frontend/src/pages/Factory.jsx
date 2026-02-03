import { useState, useEffect, useRef } from 'react';
import { getFactoryItems } from '../services/firestore';
import { gsap } from 'gsap';

const pageStyle = {
  minHeight: '70vh',
  paddingTop: 'var(--section-padding-y)',
  paddingBottom: 'var(--section-padding-y)',
  paddingLeft: 'var(--section-padding-x)',
  paddingRight: 'var(--section-padding-x)',
};
const innerStyle = { maxWidth: 'var(--content-max)', margin: '0 auto' };
const gridStyle = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fill, minmax(min(280px, 100%), 1fr))',
  gap: 'clamp(1rem, 2vw, 1.5rem)',
};

export default function Factory() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const titleRef = useRef(null);
  const gridRef = useRef(null);

  useEffect(() => {
    getFactoryItems().then(setItems).catch(console.error).finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (loading) return;
    const el = titleRef.current;
    const grid = gridRef.current;
    if (!el) return;
    gsap.fromTo(el, { y: 24, opacity: 0 }, { y: 0, opacity: 1, duration: 0.6, ease: 'power3.out' });
    if (grid) {
      const imgs = grid.querySelectorAll('.factory-item');
      if (imgs.length) {
        gsap.fromTo(imgs, { y: 36, opacity: 0 }, { y: 0, opacity: 1, duration: 0.5, stagger: 0.06, ease: 'power3.out', delay: 0.15 });
      }
    }
  }, [loading]);

  return (
    <div style={pageStyle}>
      <div style={innerStyle}>
        <h1 ref={titleRef} className="section-heading" style={{ marginBottom: '1rem' }}>
          Our Factory
        </h1>
        {loading ? (
          <p style={{ textAlign: 'center', color: 'var(--text-muted)' }}>Loading...</p>
        ) : items.length === 0 ? (
          <p style={{ textAlign: 'center', color: 'var(--text-muted)' }}>No factory images yet.</p>
        ) : (
          <div ref={gridRef} style={gridStyle}>
            {items.map((item) => (
              <div key={item.id} className="factory-item" style={cardStyle}>
                <img src={item.imageUrl} alt="" style={imgStyle} />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

const cardStyle = {
  borderRadius: 12,
  overflow: 'hidden',
  backgroundColor: 'var(--bg-card)',
  border: '1px solid var(--border)',
};
const imgStyle = { width: '100%', aspectRatio: '4/3', objectFit: 'cover' };
