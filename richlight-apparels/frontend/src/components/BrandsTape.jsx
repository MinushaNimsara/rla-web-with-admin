function BrandsTape({ brands = [] }) {
  const getUrl = (b) => {
    if (typeof b === 'string') return b;
    return b?.imageUrl || b?.imageURL || b?.image || null;
  };
  const validBrands = (brands || []).filter((b) => getUrl(b));

  if (!validBrands.length) {
    return (
      <div style={styles.placeholder}>
        <p>Brand logos will appear here. Add in Admin → Edit Home.</p>
      </div>
    );
  }

  const list = [...validBrands, ...validBrands];

  return (
    <div style={styles.wrap}>
      <div className="brands-tape-track" style={styles.track}>
        {list.map((b, i) => {
          const url = getUrl(b);
          if (!url) return null;
          return (
            <div key={`${i}-${url}`} style={styles.item}>
              <img
                src={url}
                alt=""
                style={styles.logo}
                loading="lazy"
                onError={(e) => {
                  e.target.style.opacity = '0';
                  e.target.style.minWidth = 0;
                  e.target.style.minHeight = 0;
                }}
              />
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
    backgroundColor: 'var(--bg-white)',
    borderTop: '1px solid var(--border)',
    borderBottom: '1px solid var(--border)',
  },
  track: {
    display: 'flex',
    alignItems: 'center',
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
    display: 'block',
    maxWidth: '100%',
    maxHeight: '100%',
    width: 'auto',
    height: 'auto',
    objectFit: 'contain',
    opacity: 0.95,
  },
  placeholder: {
    padding: '2rem',
    textAlign: 'center',
    color: 'var(--text-muted)',
    fontSize: 'var(--text-base)',
  },
};

export default BrandsTape;
