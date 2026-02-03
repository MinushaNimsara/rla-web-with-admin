import { useState, useEffect, useRef } from 'react';
import { getProducts } from '../services/firestore';
import ProductCard from '../components/ProductCard';
import { gsap } from 'gsap';

const pageStyle = {
  minHeight: '70vh',
  paddingTop: 'var(--section-padding-y)',
  paddingBottom: 'var(--section-padding-y)',
  paddingLeft: 'var(--section-padding-x)',
  paddingRight: 'var(--section-padding-x)',
};
const innerStyle = {
  maxWidth: 'var(--content-max)',
  margin: '0 auto',
};
const gridStyle = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fill, minmax(min(280px, 100%), 1fr))',
  gap: 'clamp(1.25rem, 3vw, 2rem)',
};

export default function Products() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const titleRef = useRef(null);
  const gridRef = useRef(null);

  useEffect(() => {
    getProducts()
      .then(setProducts)
      .catch(console.error)
      .finally(() => setLoading(false));
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
        gsap.fromTo(
          cards,
          { y: 40, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.5, stagger: 0.08, ease: 'power3.out', delay: 0.15 }
        );
      }
    }
  }, [loading]);

  return (
    <div style={pageStyle}>
      <div style={innerStyle}>
        <h1 ref={titleRef} className="section-heading" style={{ marginBottom: '1rem' }}>
          Our Products
        </h1>
        {loading ? (
          <p style={{ textAlign: 'center', color: 'var(--text-muted)' }}>Loading products...</p>
        ) : products.length === 0 ? (
          <p style={{ textAlign: 'center', color: 'var(--text-muted)' }}>No products yet. Check back soon.</p>
        ) : (
          <div ref={gridRef} style={gridStyle}>
            {products.map((p) => (
              <ProductCard
                key={p.id}
                title={p.title}
                description={p.description}
                imageUrl={p.imageUrl || p.imageURL || p.image || p.imgUrl}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
