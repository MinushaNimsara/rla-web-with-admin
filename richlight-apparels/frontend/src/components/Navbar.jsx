import { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const links = [
  { to: '/', label: 'Home' },
  { to: '/about', label: 'About Us' },
  { to: '/products', label: 'Products' },
  { to: '/csr', label: 'CSR' },
  { to: '/newsline', label: 'Newsline' },
  { to: '/factory', label: 'Factory' },
  { to: '/contact', label: 'Contact Us' },
];

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const navRef = useRef(null);
  const location = useLocation();

  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    if (!navRef.current) return;
    const nav = navRef.current;
    ScrollTrigger.create({
      trigger: document.body,
      start: '50px top',
      end: 'max',
      onUpdate: (self) => {
        const y = self.scroll();
        const isScrolled = y > 30;
        gsap.to(nav, {
          backgroundColor: isScrolled ? 'rgba(12, 12, 12, 0.92)' : 'rgba(12, 12, 12, 0.6)',
          backdropFilter: isScrolled ? 'blur(12px)' : 'blur(8px)',
          duration: 0.3,
          ease: 'power2.out',
        });
      },
    });
    return () => ScrollTrigger.getAll().forEach((t) => t.kill());
  }, []);

  return (
    <nav ref={navRef} className="navbar" style={styles.nav}>
      <div className="section-inner" style={styles.container}>
        <Link to="/" style={styles.logo}>
          <span style={styles.logoText}>Rich Light</span>
          <span style={styles.logoSub}>Apparels</span>
        </Link>

        <ul style={styles.menu} className="nav-menu">
          {links.map(({ to, label }) => (
            <li key={to}>
              <Link
                to={to}
                style={{
                  ...styles.link,
                  ...(location.pathname === to ? styles.linkActive : {}),
                }}
              >
                {label}
              </Link>
            </li>
          ))}
        </ul>

        <button
          type="button"
          className="nav-toggle"
          aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={mobileOpen}
          onClick={() => setMobileOpen((o) => !o)}
          style={styles.toggle}
        >
          <span style={{ ...styles.bar, ...(mobileOpen ? styles.barOpen1 : {}) }} />
          <span style={{ ...styles.bar, ...(mobileOpen ? styles.barOpen2 : {}) }} />
          <span style={{ ...styles.bar, ...(mobileOpen ? styles.barOpen3 : {}) }} />
        </button>
      </div>

      <div
        className="nav-mobile"
        style={{
          ...styles.mobile,
          ...(mobileOpen ? styles.mobileOpen : {}),
        }}
        aria-hidden={!mobileOpen}
      >
        <ul style={styles.mobileMenu}>
          {links.map(({ to, label }) => (
            <li key={to}>
              <Link to={to} style={styles.mobileLink}>
                {label}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
}

const styles = {
  nav: {
    position: 'sticky',
    top: 0,
    zIndex: 1000,
    borderBottom: '1px solid var(--border)',
    transition: 'background-color 0.3s, backdrop-filter 0.3s',
  },
  container: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: '0.875rem',
    paddingBottom: '0.875rem',
  },
  logo: {
    display: 'flex',
    flexDirection: 'column',
    lineHeight: 1.15,
    textDecoration: 'none',
    color: 'var(--text)',
  },
  logoText: {
    fontSize: 'var(--heading-3)',
    fontWeight: 700,
    letterSpacing: '-0.02em',
  },
  logoSub: {
    fontSize: 'var(--text-sm)',
    color: 'var(--accent)',
    fontWeight: 500,
    letterSpacing: '0.08em',
  },
  menu: {
    display: 'flex',
    listStyle: 'none',
    gap: 'clamp(1.25rem, 2.5vw, 2rem)',
    margin: 0,
    padding: 0,
  },
  link: {
    color: 'var(--text-muted)',
    textDecoration: 'none',
    fontSize: 'var(--text-base)',
    fontWeight: 500,
    padding: '0.35em 0',
    transition: 'color 0.2s',
  },
  linkActive: {
    color: 'var(--accent)',
  },
  toggle: {
    display: 'none',
    flexDirection: 'column',
    justifyContent: 'center',
    gap: 6,
    width: 40,
    height: 40,
    padding: 0,
    background: 'transparent',
    border: 'none',
  },
  bar: {
    display: 'block',
    width: 22,
    height: 2,
    backgroundColor: 'var(--text)',
    borderRadius: 1,
    transition: 'transform 0.3s, opacity 0.3s',
  },
  barOpen1: { transform: 'translateY(8px) rotate(45deg)' },
  barOpen2: { opacity: 0 },
  barOpen3: { transform: 'translateY(-8px) rotate(-45deg)' },
  mobile: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'var(--bg)',
    paddingTop: 5,
    paddingBottom: 2,
    zIndex: 999,
    opacity: 0,
    visibility: 'hidden',
    transition: 'opacity 0.3s, visibility 0.3s',
    overflow: 'auto',
  },
  mobileOpen: {
    opacity: 1,
    visibility: 'visible',
  },
  mobileMenu: {
    listStyle: 'none',
    margin: 0,
    padding: '4rem var(--content-gutter) 2rem',
    display: 'flex',
    flexDirection: 'column',
    gap: '0.5rem',
  },
  mobileLink: {
    display: 'block',
    padding: '0.75rem 0',
    fontSize: 'var(--text-lg)',
    fontWeight: 500,
    color: 'var(--text)',
    textDecoration: 'none',
    borderBottom: '1px solid var(--border)',
  },
};
