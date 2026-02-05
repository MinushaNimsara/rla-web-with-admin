import { useRef } from 'react';
import { gsap } from 'gsap';

function formatDate(dateStr) {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return dateStr;
  return d.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
}

function CSRCard({ title, description, imageUrl, date, className = '' }) {
  const cardRef = useRef(null);
  const imgRef = useRef(null);

  const handleMouseEnter = () => {
    if (!cardRef.current || !imgRef.current) return;
    gsap.to(cardRef.current, {
      y: -6,
      duration: 0.35,
      ease: 'power2.out',
      boxShadow: '0 12px 40px rgba(13, 148, 136, 0.18)',
    });
    gsap.to(imgRef.current, { scale: 1.05, duration: 0.5, ease: 'power2.out' });
  };

  const handleMouseLeave = () => {
    if (!cardRef.current || !imgRef.current) return;
    gsap.to(cardRef.current, {
      y: 0,
      duration: 0.35,
      ease: 'power2.out',
      boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
    });
    gsap.to(imgRef.current, { scale: 1, duration: 0.4, ease: 'power2.out' });
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
          <img ref={imgRef} src={imageUrl} alt={title || ''} style={styles.img} />
        </div>
      )}
      <div style={styles.body}>
        {title && <h3 style={styles.title}>{title}</h3>}
        {date && <p style={styles.date}>{formatDate(date)}</p>}
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
    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
    border: '1px solid var(--border)',
  },
  imgWrap: { width: '100%', aspectRatio: '16/10', backgroundColor: 'var(--bg-cream)', overflow: 'hidden' },
  img: { width: '100%', height: '100%', objectFit: 'cover', willChange: 'transform' },
  body: { padding: '1.25rem' },
  title: { margin: '0 0 0.25rem', fontSize: 'var(--heading-3)', fontWeight: 600, color: 'var(--text)' },
  date: { margin: '0 0 0.5rem', fontSize: 'var(--text-sm)', color: 'var(--accent)', fontWeight: 500 },
  desc: { margin: 0, fontSize: 'var(--text-sm)', color: 'var(--text-muted)', lineHeight: 1.5 },
};

export default CSRCard;
