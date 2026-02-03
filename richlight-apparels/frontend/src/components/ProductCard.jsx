import { useRef } from 'react';
import { gsap } from 'gsap';

function ProductCard({ title, description, imageUrl, className = '' }) {
  const cardRef = useRef(null);
  const imgRef = useRef(null);

  const handleMouseEnter = () => {
    if (!cardRef.current || !imgRef.current) return;
    gsap.to(cardRef.current, {
      y: -6,
      duration: 0.35,
      ease: 'power2.out',
      boxShadow: '0 16px 48px rgba(0, 0, 0, 0.4)',
    });
    gsap.to(imgRef.current, {
      scale: 1.06,
      duration: 0.5,
      ease: 'power2.out',
    });
  };

  const handleMouseLeave = () => {
    if (!cardRef.current || !imgRef.current) return;
    gsap.to(cardRef.current, {
      y: 0,
      duration: 0.35,
      ease: 'power2.out',
      boxShadow: '0 4px 20px rgba(0, 0, 0, 0.2)',
    });
    gsap.to(imgRef.current, {
      scale: 1,
      duration: 0.4,
      ease: 'power2.out',
    });
  };

  return (
    <article
      ref={cardRef}
      className={`animate-card ${className}`.trim()}
      style={styles.card}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {imageUrl && (
        <div style={styles.imgWrap}>
          <img ref={imgRef} src={imageUrl} alt={title || 'Product'} style={styles.img} />
        </div>
      )}
      <div style={styles.body}>
        {title && <h3 style={styles.title}>{title}</h3>}
        {description && <p style={styles.desc}>{description}</p>}
      </div>
    </article>
  );
}

const styles = {
  card: {
    backgroundColor: 'var(--bg-card)',
    borderRadius: '12px',
    overflow: 'hidden',
    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.2)',
    border: '1px solid var(--border)',
    transition: 'box-shadow 0.3s',
  },
  imgWrap: {
    width: '100%',
    aspectRatio: '4/3',
    backgroundColor: 'var(--bg-elevated)',
    overflow: 'hidden',
  },
  img: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    willChange: 'transform',
  },
  body: {
    padding: '1.25rem',
  },
  title: {
    margin: '0 0 0.5rem',
    fontSize: 'var(--heading-3)',
    fontWeight: 600,
    color: 'var(--text)',
  },
  desc: {
    margin: 0,
    fontSize: 'var(--text-sm)',
    color: 'var(--text-muted)',
    lineHeight: 1.5,
  },
};

export default ProductCard;
