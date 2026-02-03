import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import ImageCarousel from '../components/ImageCarousel';
import BrandsTape from '../components/BrandsTape';
import ProductCard from '../components/ProductCard';
import CSRCard from '../components/CSRCard';
import NewsCard from '../components/NewsCard';
import { revealSection } from '../utils/gsapConfig';
import {
  getHeroSlides,
  getBrands,
  getProducts,
  getCSRCards,
  getNewslineItems,
  getHomeSettings,
  getGalleryImages,
} from '../services/firestore';

const sectionClass = 'home-section';
const sectionPadding = {
  paddingTop: 'var(--section-padding-y)',
  paddingBottom: 'var(--section-padding-y)',
  paddingLeft: 'var(--section-padding-x)',
  paddingRight: 'var(--section-padding-x)',
};
const sectionInner = {
  maxWidth: 'var(--content-max)',
  margin: '0 auto',
};
const gridStyle = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fill, minmax(min(280px, 100%), 1fr))',
  gap: 'clamp(1.25rem, 3vw, 2rem)',
};
const linkStyle = {
  display: 'inline-block',
  marginTop: '1.5rem',
  color: 'var(--accent)',
  fontWeight: 600,
  fontSize: 'var(--text-base)',
  transition: 'transform 0.2s',
};

export default function Home() {
  const [heroSlides, setHeroSlides] = useState([]);
  const [brands, setBrands] = useState([]);
  const [products, setProducts] = useState([]);
  const [csrCards, setCSRCards] = useState([]);
  const [newsItems, setNewsItems] = useState([]);
  const [homeSettings, setHomeSettings] = useState({});
  const [gallery, setGallery] = useState([]);
  const [loading, setLoading] = useState(true);

  const sectionProducts = useRef(null);
  const sectionCSR = useRef(null);
  const sectionNews = useRef(null);
  const sectionFactory = useRef(null);
  const sectionGallery = useRef(null);

  useEffect(() => {
    async function load() {
      try {
        const [slides, brandsData, productsData, csrData, newsData, settings, galleryData] = await Promise.all([
          getHeroSlides(),
          getBrands(),
          getProducts(8),
          getCSRCards(6),
          getNewslineItems(6),
          getHomeSettings(),
          getGalleryImages(12),
        ]);
        setHeroSlides(slides);
        setBrands(brandsData);
        setProducts(productsData);
        setCSRCards(csrData);
        setNewsItems(newsData);
        setHomeSettings(settings);
        setGallery(galleryData);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  useEffect(() => {
    const cleanups = [];
    if (!loading) {
      [sectionProducts, sectionCSR, sectionNews, sectionFactory, sectionGallery].forEach((ref) => {
        const cleanup = revealSection(ref.current, { stagger: 0.1 });
        if (cleanup) cleanups.push(cleanup);
      });
    }
    return () => cleanups.forEach((c) => c());
  }, [loading]);

  const factoryVideoUrl = homeSettings.factoryVideoUrl || '';

  return (
    <main>
      <section aria-label="Hero">
        <ImageCarousel slides={heroSlides.length ? heroSlides : []} />
      </section>

      <section aria-label="Brands" style={{ padding: 0 }}>
        <BrandsTape brands={brands} />
      </section>

      <section
        ref={sectionProducts}
        className={sectionClass}
        style={{ ...sectionPadding, background: 'var(--bg)' }}
      >
        <div style={sectionInner}>
          <h2 className="section-heading" style={{ marginBottom: '0.25em' }}>
            Our Products
          </h2>
          <p className="section-sub">
            Quality apparel crafted for comfort and style.
          </p>
          {loading ? (
            <p style={{ textAlign: 'center', color: 'var(--text-muted)' }}>Loading...</p>
          ) : products.length === 0 ? (
            <p style={{ textAlign: 'center', color: 'var(--text-muted)' }}>No products yet.</p>
          ) : (
            <div style={gridStyle}>
              {products.slice(0, 8).map((p) => (
                <ProductCard
                  key={p.id}
                  title={p.title}
                  description={p.description}
                  imageUrl={p.imageUrl || p.imageURL || p.image || p.imgUrl}
                />
              ))}
            </div>
          )}
          <div style={{ textAlign: 'center' }}>
            <Link to="/products" style={linkStyle}>View all products →</Link>
          </div>
        </div>
      </section>

      <section
        ref={sectionCSR}
        className={sectionClass}
        style={{ ...sectionPadding, background: 'var(--bg-elevated)' }}
      >
        <div style={sectionInner}>
          <h2 className="section-heading" style={{ marginBottom: '0.25em' }}>
            Corporate Social Responsibility
          </h2>
          <p className="section-sub">
            Our commitment to people, culture, and the environment.
          </p>
          {loading ? (
            <p style={{ textAlign: 'center', color: 'var(--text-muted)' }}>Loading...</p>
          ) : csrCards.length === 0 ? (
            <p style={{ textAlign: 'center', color: 'var(--text-muted)' }}>No CSR content yet.</p>
          ) : (
            <div style={gridStyle}>
              {csrCards.slice(0, 6).map((c) => (
                <CSRCard
                  key={c.id}
                  title={c.title}
                  description={c.description}
                  imageUrl={c.imageUrl || c.imageURL || c.image || c.imgUrl}
                />
              ))}
            </div>
          )}
          <div style={{ textAlign: 'center' }}>
            <Link to="/csr" style={linkStyle}>View all →</Link>
          </div>
        </div>
      </section>

      <section
        ref={sectionNews}
        className={sectionClass}
        style={{ ...sectionPadding, background: 'var(--bg)' }}
      >
        <div style={sectionInner}>
          <h2 className="section-heading" style={{ marginBottom: '0.25em' }}>
            Newsline
          </h2>
          <p className="section-sub">
            Tournaments, celebrations, and company updates.
          </p>
          {loading ? (
            <p style={{ textAlign: 'center', color: 'var(--text-muted)' }}>Loading...</p>
          ) : newsItems.length === 0 ? (
            <p style={{ textAlign: 'center', color: 'var(--text-muted)' }}>No news yet.</p>
          ) : (
            <div style={gridStyle}>
              {newsItems.slice(0, 6).map((n) => (
                <NewsCard
                  key={n.id}
                  title={n.title}
                  description={n.description}
                  imageUrl={n.imageUrl || n.imageURL || n.image || n.imgUrl}
                />
              ))}
            </div>
          )}
          <div style={{ textAlign: 'center' }}>
            <Link to="/newsline" style={linkStyle}>View all →</Link>
          </div>
        </div>
      </section>

      {factoryVideoUrl && (
        <section
          ref={sectionFactory}
          className={sectionClass}
          style={{ ...sectionPadding, background: 'var(--bg-elevated)' }}
        >
          <div style={sectionInner}>
            <h2 className="section-heading" style={{ marginBottom: '1rem' }}>
              Our Factory
            </h2>
            <div
              style={{
                position: 'relative',
                width: '100%',
                maxWidth: 800,
                margin: '0 auto',
                aspectRatio: '16/9',
                backgroundColor: 'var(--bg-card)',
                borderRadius: 12,
                overflow: 'hidden',
                border: '1px solid var(--border)',
              }}
            >
              {factoryVideoUrl.includes('youtube') || factoryVideoUrl.includes('youtu.be') ? (
                <iframe
                  title="Factory video"
                  src={factoryVideoUrl.replace('watch?v=', 'embed/').replace('youtu.be/', 'youtube.com/embed/')}
                  style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', border: 0 }}
                  allowFullScreen
                />
              ) : (
                <video
                  src={factoryVideoUrl}
                  controls
                  style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                />
              )}
            </div>
          </div>
        </section>
      )}

      {gallery.length > 0 && (
        <section
          ref={sectionGallery}
          className={sectionClass}
          style={{ ...sectionPadding, background: 'var(--bg)' }}
        >
          <div style={sectionInner}>
            <h2 className="section-heading" style={{ marginBottom: '1.5rem' }}>
              Gallery
            </h2>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
                gap: '0.75rem',
              }}
            >
              {gallery.map((g) => (
                <div
                  key={g.id}
                  style={{
                    aspectRatio: '1',
                    borderRadius: 8,
                    overflow: 'hidden',
                    border: '1px solid var(--border)',
                  }}
                >
                  <img
                    src={g.imageUrl}
                    alt=""
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                </div>
              ))}
            </div>
          </div>
        </section>
      )}
    </main>
  );
}
