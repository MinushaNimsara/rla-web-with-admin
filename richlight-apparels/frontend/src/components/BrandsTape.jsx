function BrandsTape({ brands = [] }) {
  if (!brands.length) {
    return (
      <div style={styles.placeholder}>
        <p>Brand logos will appear here. Add in Admin → Edit Home.</p>
      </div>
    );
  }

  return (
    <div style={styles.wrap}>
      <div className="brands-tape-track" style={styles.track}>
        {[...brands, ...brands].map((b, i) => {
          const url = typeof b === 'string' ? b : b?.imageUrl;
          return (
            <div key={i} style={styles.item}>
              <img src={url} alt="" style={styles.logo} />
            </div>
          );
        })}
      </div>
    </div>
  );
}

const styles = {
  wrap: {
    overflow: 'hidden',
    padding: 'clamp(1.25rem, 3vw, 2rem) 0',
    backgroundColor: 'var(--bg-elevated)',
    borderTop: '1px solid var(--border)',
    borderBottom: '1px solid var(--border)',
  },
  track: {
    display: 'flex',
    gap: 'clamp(2rem, 4vw, 3.5rem)',
    width: 'max-content',
  },
  item: {
    flexShrink: 0,
    width: 'clamp(90px, 12vw, 130px)',
    height: 'clamp(44px, 6vw, 64px)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo: {
    maxWidth: '100%',
    maxHeight: '100%',
    objectFit: 'contain',
    filter: 'brightness(0) invert(0.75)',
    opacity: 0.9,
  },
  placeholder: {
    padding: '2rem',
    textAlign: 'center',
    color: 'var(--text-muted)',
    fontSize: 'var(--text-base)',
  },
};

export default BrandsTape;
