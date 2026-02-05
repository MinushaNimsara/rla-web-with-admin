import { useState, useRef, useEffect } from 'react';
import { useSiteSettings } from '../context/SiteSettingsContext';
import { gsap } from '../utils/gsapConfig';

const FORMSPREE_ENDPOINT = import.meta.env.VITE_FORMSPREE_FORM_ID
  ? `https://formspree.io/f/${import.meta.env.VITE_FORMSPREE_FORM_ID}`
  : '';

const defaultHeading = "Let's build your next collection.";
const defaultDescription =
  "Share your tech packs, moodboards or ideas – our team will get back with development options and timelines.";

export default function ContactUs() {
  const {
    contactPageHeading,
    contactPageDescription,
    contactAddress,
    contactPhone,
    contactEmail,
    contactWeb,
    contactPageBgUrl,
  } = useSiteSettings();

  const [formData, setFormData] = useState({ name: '', email: '', company: '', country: '', message: '' });
  const [submitting, setSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null); // 'success' | 'error' | null
  const leftRef = useRef(null);
  const formRef = useRef(null);

  useEffect(() => {
    if (!leftRef.current) return;
    const el = leftRef.current;
    const heading = el.querySelector('.contact-page-heading');
    const desc = el.querySelector('.contact-page-desc');
    const list = el.querySelector('.contact-page-details');
    if (heading) gsap.fromTo(heading, { y: 24, opacity: 0 }, { y: 0, opacity: 1, duration: 0.6, ease: 'power3.out' });
    if (desc) gsap.fromTo(desc, { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.5, delay: 0.1, ease: 'power3.out' });
    if (list) gsap.fromTo(list, { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.5, delay: 0.2, ease: 'power3.out' });
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setSubmitStatus(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!FORMSPREE_ENDPOINT) {
      setSubmitStatus('error');
      return;
    }
    setSubmitting(true);
    setSubmitStatus(null);
    try {
      const data = new FormData();
      data.append('name', formData.name);
      data.append('email', formData.email);
      data.append('company', formData.company);
      data.append('country', formData.country);
      data.append('message', formData.message);
      data.append('_subject', `Contact: ${formData.name || 'Inquiry'}`);

      const res = await fetch(FORMSPREE_ENDPOINT, {
        method: 'POST',
        body: data,
        headers: { Accept: 'application/json' },
      });
      if (res.ok) {
        setSubmitStatus('success');
        setFormData({ name: '', email: '', company: '', country: '', message: '' });
      } else {
        setSubmitStatus('error');
      }
    } catch {
      setSubmitStatus('error');
    } finally {
      setSubmitting(false);
    }
  };

  const heading = contactPageHeading || defaultHeading;
  const description = contactPageDescription || defaultDescription;
  const hasContactInfo = contactAddress || contactPhone || contactEmail || contactWeb;

  return (
    <main
      className="contact-page"
      style={contactPageBgUrl ? { '--contact-bg-image': `url(${contactPageBgUrl})` } : undefined}
    >
      <div className="contact-page-inner">
        <div ref={leftRef} className="contact-page-left">
          <p className="contact-page-label">CONTACT</p>
          <h1 className="contact-page-heading">{heading}</h1>
          <p className="contact-page-desc">{description}</p>
          {hasContactInfo && (
            <div className="contact-page-details">
              {contactAddress && (
                <div className="contact-page-detail">
                  <strong>Address:</strong>
                  <span>{contactAddress}</span>
                </div>
              )}
              {contactPhone && (
                <div className="contact-page-detail">
                  <strong>Phone:</strong>
                  <a href={`tel:${contactPhone}`}>{contactPhone}</a>
                </div>
              )}
              {contactEmail && (
                <div className="contact-page-detail">
                  <strong>Email:</strong>
                  <a href={`mailto:${contactEmail}`}>{contactEmail}</a>
                </div>
              )}
              {contactWeb && (
                <div className="contact-page-detail">
                  <strong>Web:</strong>
                  <a href={contactWeb.startsWith('http') ? contactWeb : `https://${contactWeb}`} target="_blank" rel="noopener noreferrer">
                    {contactWeb.replace(/^https?:\/\//, '')}
                  </a>
                </div>
              )}
            </div>
          )}
        </div>

        <div className="contact-page-right">
          <div className="contact-page-form-card" ref={formRef}>
            <form onSubmit={handleSubmit} className="contact-form" noValidate>
              <label className="contact-form-label">
                Name <span className="contact-form-required">*</span>
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="contact-form-input"
                required
                placeholder="Your name"
              />

              <label className="contact-form-label">
                Email <span className="contact-form-required">*</span>
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="contact-form-input"
                required
                placeholder="your@email.com"
              />

              <label className="contact-form-label">Company</label>
              <input
                type="text"
                name="company"
                value={formData.company}
                onChange={handleChange}
                className="contact-form-input"
                placeholder="Company name"
              />

              <label className="contact-form-label">Country</label>
              <input
                type="text"
                name="country"
                value={formData.country}
                onChange={handleChange}
                className="contact-form-input"
                placeholder="Country"
              />

              <label className="contact-form-label">
                Project details <span className="contact-form-required">*</span>
              </label>
              <textarea
                name="message"
                value={formData.message}
                onChange={handleChange}
                className="contact-form-input contact-form-textarea"
                required
                placeholder="Tell us about your project..."
                rows={5}
              />

              {submitStatus === 'success' && (
                <p className="contact-form-message contact-form-message--success">Thank you. We&apos;ll get back to you soon.</p>
              )}
              {submitStatus === 'error' && (
                <p className="contact-form-message contact-form-message--error">Something went wrong. Please try again or email us directly.</p>
              )}

              <button type="submit" className="contact-form-submit" disabled={submitting}>
                {submitting ? 'Sending...' : 'SEND INQUIRY'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </main>
  );
}
