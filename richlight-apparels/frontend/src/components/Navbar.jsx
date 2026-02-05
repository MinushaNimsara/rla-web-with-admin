import { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useSiteSettings } from '../context/SiteSettingsContext';

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
  const { logoUrl } = useSiteSettings();
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
      start: '60px top',
      end: 'max',
      onUpdate: (self) => {
        const y = self.scroll();
        const isScrolled = y > 40;
        gsap.to(nav, {
          backgroundColor: isScrolled ? 'rgba(255, 255, 255, 0.98)' : 'rgba(255, 255, 255, 0.9)',
          boxShadow: isScrolled ? '0 2px 20px rgba(0,0,0,0.06)' : 'none',
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
        <Link to="/" style={{ ...styles.logo, ...(logoUrl ? styles.logoWithImage : {}) }}>
          {logoUrl && <img src={logoUrl} alt="" style={styles.logoImg} />}
          <span style={styles.logoTextWrap}>
            <span style={styles.logoText}>Rich Light</span>
            <span style={styles.logoSub}>Apparels</span>
          </span>
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
              <Link
                to={to}
                style={{
                  ...styles.mobileLink,
                  ...(location.pathname === to ? styles.mobileLinkActive : {}),
                }}
              >
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
    transition: 'background-color 0.3s, box-shadow 0.3s',
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
    alignItems: 'flex-start',
    lineHeight: 1.15,
    textDecoration: 'none',
    color: 'var(--text)',
  },
  logoWithImage: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: '0.5rem',
  },
  logoImg: {
    display: 'block',
    height: 36,
    width: 'auto',
    maxWidth: 120,
    objectFit: 'contain',
    flexShrink: 0,
  },
  logoTextWrap: {
    display: 'flex',
    flexDirection: 'column',
    lineHeight: 1.15,
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
    color: 'var(--text)',
    textDecoration: 'none',
    fontSize: 'var(--text-base)',
    fontWeight: 500,
    padding: '0.35em 0',
    transition: 'color 0.2s',
  },
  linkActive: {
    color: 'var(--accent-sun)',
    fontWeight: 600,
    borderBottom: '2px solid var(--accent-sun)',
    paddingBottom: '0.2rem',
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
    backgroundColor: 'var(--accent)',
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
    backgroundColor: 'var(--bg-white)',
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
  mobileLinkActive: {
    color: 'var(--accent-sun)',
    fontWeight: 600,
    borderBottom: '2px solid var(--accent-sun)',
  },
};
