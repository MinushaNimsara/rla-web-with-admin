import { useState, useEffect, useRef } from 'react';
import { getCSRCards } from '../services/firestore';
import CSRCard from '../components/CSRCard';
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
  gap: 'clamp(1.25rem, 3vw, 2rem)',
};

export default function CSR() {
  const [cards, setCards] = useState([]);
  const [loading, setLoading] = useState(true);
  const titleRef = useRef(null);
  const gridRef = useRef(null);

  useEffect(() => {
    getCSRCards().then(setCards).catch(console.error).finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (loading) return;
    const el = titleRef.current;
    const grid = gridRef.current;
    if (!el) return;
    gsap.fromTo(el, { y: 24, opacity: 0 }, { y: 0, opacity: 1, duration: 0.6, ease: 'power3.out' });
    if (grid) {
      const items = grid.querySelectorAll('.animate-card');
      if (items.length) {
        gsap.fromTo(items, { y: 40, opacity: 0 }, { y: 0, opacity: 1, duration: 0.5, stagger: 0.08, ease: 'power3.out', delay: 0.15 });
      }
    }
  }, [loading]);

  return (
    <div style={pageStyle}>
      <div style={innerStyle}>
        <h1 ref={titleRef} className="section-heading" style={{ marginBottom: '1rem' }}>
          Corporate Social Responsibility
        </h1>
        {loading ? (
          <p style={{ textAlign: 'center', color: 'var(--text-muted)' }}>Loading...</p>
        ) : cards.length === 0 ? (
          <p style={{ textAlign: 'center', color: 'var(--text-muted)' }}>No CSR content yet.</p>
        ) : (
          <div ref={gridRef} style={gridStyle}>
            {cards.map((c) => (
              <CSRCard
                key={c.id}
                title={c.title}
                description={c.description}
                imageUrl={c.imageUrl || c.imageURL || c.image || c.imgUrl}
                date={c.date}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
