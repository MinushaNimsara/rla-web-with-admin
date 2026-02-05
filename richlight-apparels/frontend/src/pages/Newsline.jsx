import { useState, useEffect, useRef } from 'react';
import { getNewslineItems } from '../services/firestore';
import NewsCard from '../components/NewsCard';
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

export default function Newsline() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const titleRef = useRef(null);
  const gridRef = useRef(null);

  useEffect(() => {
    getNewslineItems().then(setItems).catch(console.error).finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (loading) return;
    const el = titleRef.current;
    const grid = gridRef.current;
    if (!el) return;
    gsap.fromTo(el, { y: 24, opacity: 0 }, { y: 0, opacity: 1, duration: 0.6, ease: 'power3.out' });
    if (grid) {
      const cards = grid.querySelectorAll('.animate-card');
      if (cards.length) {
        gsap.fromTo(cards, { y: 40, opacity: 0 }, { y: 0, opacity: 1, duration: 0.5, stagger: 0.08, ease: 'power3.out', delay: 0.15 });
      }
    }
  }, [loading]);

  return (
    <div style={pageStyle}>
      <div style={innerStyle}>
        <h1 ref={titleRef} className="section-heading" style={{ marginBottom: '1rem' }}>
          Newsline
        </h1>
        {loading ? (
          <p style={{ textAlign: 'center', color: 'var(--text-muted)' }}>Loading...</p>
        ) : items.length === 0 ? (
          <p style={{ textAlign: 'center', color: 'var(--text-muted)' }}>No news yet.</p>
        ) : (
          <div ref={gridRef} style={gridStyle}>
            {items.map((n) => (
              <NewsCard
                key={n.id}
                title={n.title}
                description={n.description}
                imageUrl={n.imageUrl || n.imageURL || n.image || n.imgUrl}
                date={n.date}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
