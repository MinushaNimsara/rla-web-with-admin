import { Link } from 'react-router-dom';
import { useSiteSettings } from '../context/SiteSettingsContext';

function SocialIcon({ type }) {
  const size = 18;
  const common = { width: size, height: size, fill: 'currentColor' };
  switch (type) {
    case 'facebook':
      return (
        <svg {...common} viewBox="0 0 24 24" aria-hidden="true">
          <path d="M22 12a10 10 0 1 0-11.5 9.9v-7h-2v-3h2v-2.3c0-2 1.2-3.1 3-3.1.9 0 1.8.1 1.8.1v2h-1c-1 0-1.3.6-1.3 1.2V12h2.3l-.4 3h-1.9v7A10 10 0 0 0 22 12" />
        </svg>
      );
    case 'instagram':
      return (
        <svg {...common} viewBox="0 0 24 24" aria-hidden="true">
          <path d="M7 3h10a4 4 0 0 1 4 4v10a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4V7a4 4 0 0 1 4-4Zm0 2a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2H7Zm5 3.5A3.5 3.5 0 1 1 8.5 12 3.5 3.5 0 0 1 12 8.5Zm0 2A1.5 1.5 0 1 0 13.5 12 1.5 1.5 0 0 0 12 10.5Zm4.25-3.75a.75.75 0 1 1-.75.75.75.75 0 0 1 .75-.75Z" />
        </svg>
      );
    case 'linkedin':
      return (
        <svg {...common} viewBox="0 0 24 24" aria-hidden="true">
          <path d="M20.45 20.45h-3.56v-5.01c0-1.2-.02-2.75-1.68-2.75-1.69 0-1.95 1.31-1.95 2.66v5.1H9.7V9h3.42v1.56h.05c.48-.91 1.64-1.87 3.37-1.87 3.6 0 4.26 2.37 4.26 5.45v6.31ZM6.34 7.43a2.07 2.07 0 1 1 0-4.14 2.07 2.07 0 0 1 0 4.14Zm-1.79 13h3.58V9H4.55v11.43ZM22.22 0H1.78A1.78 1.78 0 0 0 0 1.78v20.44A1.78 1.78 0 0 0 1.78 24h20.44A1.78 1.78 0 0 0 24 22.22V1.78A1.78 1.78 0 0 0 22.22 0Z" />
        </svg>
      );
    default:
      return null;
  }
}

export default function Footer() {
  const {
    logoUrl,
    footerBrandName,
    contactEmail,
    contactPhone,
    contactAddress,
    socialFacebook,
    socialInstagram,
    socialLinkedIn,
  } = useSiteSettings();

  const socials = [
    { type: 'facebook', href: socialFacebook },
    { type: 'instagram', href: socialInstagram },
    { type: 'linkedin', href: socialLinkedIn },
  ];

  const currentYear = new Date().getFullYear();

  const quickLinks = [
    { to: '/', label: 'Home' },
    { to: '/about', label: 'About' },
    { to: '/products', label: 'Products' },
    { to: '/contact', label: 'Contact' },
  ];

  const exploreLinks = [
    { to: '/csr', label: 'CSR' },
    { to: '/newsline', label: 'Newsline' },
    { to: '/factory', label: 'Factory' },
  ];

  return (
    <footer className="site-footer site-footer-simple">
      <div className="site-footer-inner">
        <div className="site-footer-col site-footer-brand-block">
          <div className="site-footer-brand">
            {logoUrl ? (
              <Link to="/" className="site-footer-logo-link">
                <img src={logoUrl} alt="Rich Light Apparels" className="site-footer-logo" />
              </Link>
            ) : (
              <Link to="/" className="site-footer-logo-text">
                RICHLIGHT APPARELS
              </Link>
            )}
          </div>
          <p className="site-footer-brand-name">{footerBrandName || 'Rich Light Apparels'}</p>
          <div className="site-footer-social" aria-label="Social links">
            {socials.map(({ type, href }) =>
              href ? (
                <a
                  key={type}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="site-footer-social-link"
                  aria-label={type}
                >
                  <SocialIcon type={type} />
                </a>
              ) : (
                <span key={type} className="site-footer-social-link site-footer-social-link--disabled" aria-label={type}>
                  <SocialIcon type={type} />
                </span>
              )
            )}
          </div>
        </div>

        <div className="site-footer-col site-footer-contact-col">
          <h4 className="site-footer-col-title">Contact</h4>
          <div className="site-footer-contact">
            {contactPhone && <a href={`tel:${contactPhone}`} className="site-footer-contact-line">{contactPhone}</a>}
            {contactEmail && <a href={`mailto:${contactEmail}`} className="site-footer-contact-line">{contactEmail}</a>}
            {contactAddress && <span className="site-footer-contact-line site-footer-contact-address">{contactAddress}</span>}
            {!contactPhone && !contactEmail && !contactAddress && <span className="site-footer-contact-empty">Add contact details in Admin → Home → Edit Footer</span>}
          </div>
        </div>

        <div className="site-footer-col">
          <h4 className="site-footer-col-title">Quick Links</h4>
          <nav aria-label="Quick links" className="site-footer-col-links">
            {quickLinks.map(({ to, label }) => (
              <Link key={to} to={to} className="site-footer-link">{label}</Link>
            ))}
          </nav>
        </div>

        <div className="site-footer-col">
          <h4 className="site-footer-col-title">Explore</h4>
          <nav aria-label="Explore" className="site-footer-col-links">
            {exploreLinks.map(({ to, label }) => (
              <Link key={to} to={to} className="site-footer-link">{label}</Link>
            ))}
          </nav>
        </div>
      </div>

      <div className="site-footer-bottom">
        <p className="site-footer-copy">
          © {currentYear} Rich Light Apparels. All rights reserved. Powered by Minusha Nimsara
        </p>
      </div>
    </footer>
  );
}

