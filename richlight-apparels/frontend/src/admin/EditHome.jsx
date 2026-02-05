import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useSiteSettings } from '../context/SiteSettingsContext';
import { uploadImage, uploadVideo } from '../services/cloudinary';
import {
  getHeroSlides,
  addHeroSlide,
  deleteHeroSlide,
  getBrands,
  addBrand,
  deleteBrand,
  getHomeSettings,
  setHomeSettings,
} from '../services/firestore';

const formStyles = {
  container: { padding: '2rem', maxWidth: '900px', margin: '0 auto' },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' },
  backLink: { color: '#1d72a3', textDecoration: 'none', fontWeight: 500 },
  section: { backgroundColor: '#2a2a2a', color: '#f2f2f2', padding: '2rem', borderRadius: '8px', marginBottom: '2rem' },
  sectionHeading: { color: '#fff', marginTop: 0, marginBottom: '0.5rem', fontSize: '1.25rem' },
  sectionDesc: { color: '#d8d8d8', marginBottom: '1.25rem', fontSize: '0.95rem', lineHeight: 1.5 },
  input: { width: '100%', padding: '0.75rem', fontSize: '1rem', border: '1px solid #555', borderRadius: '4px', marginBottom: '1rem', boxSizing: 'border-box', backgroundColor: '#1a1a1a', color: '#f0f0f0' },
  previewBox: { marginBottom: '1rem', padding: '1rem', border: '1px dashed #666', borderRadius: '8px', textAlign: 'center', minHeight: '80px' },
  previewImg: { maxWidth: '200px', maxHeight: '120px', borderRadius: '4px' },
  button: { padding: '0.75rem 1.5rem', fontSize: '1rem', backgroundColor: '#1d72a3', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', marginRight: '0.5rem', marginBottom: '0.5rem' },
  buttonDanger: { backgroundColor: '#c0392b' },
  message: { padding: '0.75rem', borderRadius: '4px', marginBottom: '1rem' },
  success: { backgroundColor: '#27ae60', color: 'white' },
  error: { backgroundColor: '#c0392b', color: 'white' },
  card: { display: 'flex', alignItems: 'center', gap: '1rem', padding: '0.75rem', backgroundColor: '#1a1a1a', borderRadius: '4px', marginBottom: '0.5rem', color: '#f0f0f0' },
  cardImg: { width: '60px', height: '40px', objectFit: 'contain' },
  label: { display: 'block', color: '#d8d8d8', fontSize: '0.9rem', marginBottom: '0.35rem' },
  textarea: { width: '100%', padding: '0.75rem', fontSize: '1rem', border: '1px solid #555', borderRadius: '4px', marginBottom: '1rem', boxSizing: 'border-box', backgroundColor: '#1a1a1a', color: '#f0f0f0', minHeight: '80px', resize: 'vertical' },
};

export default function EditHome() {
  const { refreshSettings } = useSiteSettings();
  const [heroSlides, setHeroSlides] = useState([]);
  const [brands, setBrands] = useState([]);
  const [homeSettings, setHomeSettingsState] = useState({ factoryVideoUrl: '', logoUrl: '' });
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState(null);
  const [uploading, setUploading] = useState(false);

  const load = async () => {
    setLoading(true);
    try {
      const [slides, brandsData, settings] = await Promise.all([
        getHeroSlides(),
        getBrands(),
        getHomeSettings(),
      ]);
      setHeroSlides(slides);
      setBrands(brandsData);
      setHomeSettingsState(settings);
    } catch (err) {
      console.error(err);
      setMessage({ type: 'error', text: 'Failed to load' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const handleAddHero = async (e) => {
    e.preventDefault();
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    setMessage(null);
    try {
      const result = await uploadImage(file);
      if (result?.url) {
        await addHeroSlide({ imageUrl: result.url, order: heroSlides.length });
        setMessage({ type: 'success', text: 'Hero slide added!' });
        load();
      } else setMessage({ type: 'error', text: 'Upload failed. No URL returned.' });
    } catch (err) {
      setMessage({ type: 'error', text: err?.message || 'Upload failed. Check Cloudinary preset is Unsigned.' });
    } finally {
      setUploading(false);
    }
  };

  const handleDeleteHero = async (id) => {
    if (!window.confirm('Remove this slide?')) return;
    try {
      await deleteHeroSlide(id);
      setMessage({ type: 'success', text: 'Removed' });
      load();
    } catch (err) {
      setMessage({ type: 'error', text: 'Failed' });
    }
  };

  const handleAddBrand = async (e) => {
    e.preventDefault();
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    setMessage(null);
    try {
      const result = await uploadImage(file);
      if (result?.url) {
        await addBrand({ imageUrl: result.url, order: brands.length });
        setMessage({ type: 'success', text: 'Brand logo added!' });
        load();
      } else setMessage({ type: 'error', text: 'Upload failed. No URL returned.' });
    } catch (err) {
      setMessage({ type: 'error', text: err?.message || 'Upload failed. Check Cloudinary preset is Unsigned.' });
    } finally {
      setUploading(false);
    }
  };

  const handleDeleteBrand = async (id) => {
    if (!window.confirm('Remove this logo?')) return;
    try {
      await deleteBrand(id);
      setMessage({ type: 'success', text: 'Removed' });
      load();
    } catch (err) {
      setMessage({ type: 'error', text: 'Failed' });
    }
  };

  const handleSaveFactoryVideo = async (e) => {
    e.preventDefault();
    setMessage(null);
    try {
      await setHomeSettings({ factoryVideoUrl: homeSettings.factoryVideoUrl || '' });
      setMessage({ type: 'success', text: 'Factory video URL saved!' });
    } catch (err) {
      setMessage({ type: 'error', text: 'Failed to save' });
    }
  };

  const handleLogoUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    setMessage(null);
    try {
      const result = await uploadImage(file);
      if (result?.url) {
        await setHomeSettings({ logoUrl: result.url });
        setHomeSettingsState((s) => ({ ...s, logoUrl: result.url }));
        refreshSettings?.();
        setMessage({ type: 'success', text: 'Site logo updated! It will show in navbar and footer.' });
        load();
      } else setMessage({ type: 'error', text: 'Upload failed.' });
    } catch (err) {
      setMessage({ type: 'error', text: err?.message || 'Upload failed.' });
    } finally {
      setUploading(false);
    }
  };

  const handleRemoveLogo = async () => {
    if (!window.confirm('Remove site logo?')) return;
    setMessage(null);
    try {
      await setHomeSettings({ logoUrl: '' });
      setHomeSettingsState((s) => ({ ...s, logoUrl: '' }));
      refreshSettings?.();
      setMessage({ type: 'success', text: 'Logo removed.' });
      load();
    } catch (err) {
      setMessage({ type: 'error', text: 'Failed' });
    }
  };

  const defaultHeroStats = [
    { value: '15+', label: 'Years Experience' },
    { value: '100K+', label: 'pcs / month Capacity' },
    { value: 'US • UK • EU', label: 'Markets' },
  ];
  const heroStats = Array.isArray(homeSettings.heroStats) && homeSettings.heroStats.length > 0
    ? homeSettings.heroStats
    : defaultHeroStats;

  const setHeroStat = (index, field, value) => {
    setHomeSettingsState((s) => {
      const list = [...(s.heroStats || defaultHeroStats)];
      while (list.length <= index) list.push({ value: '', label: '' });
      list[index] = { ...list[index], [field]: value };
      return { ...s, heroStats: list };
    });
  };

  const handleSaveHeroStats = async (e) => {
    e.preventDefault();
    setMessage(null);
    try {
      const list = heroStats.slice(0, 3).map((s) => ({
        value: (s?.value ?? '').trim(),
        label: (s?.label ?? '').trim(),
      }));
      await setHomeSettings({ heroStats: list });
      setMessage({ type: 'success', text: 'Hero stats saved! Numbers will count up on the home page.' });
      load();
    } catch (err) {
      setMessage({ type: 'error', text: 'Failed to save' });
    }
  };

  const handleSaveAbout = async (e) => {
    e.preventDefault();
    setMessage(null);
    try {
      await setHomeSettings({
        aboutImageUrl: homeSettings.aboutImageUrl || '',
        aboutLocationText: homeSettings.aboutLocationText || '',
        aboutSubtitle: homeSettings.aboutSubtitle || '',
        aboutHeading: homeSettings.aboutHeading || '',
        aboutParagraph1: homeSettings.aboutParagraph1 || '',
        aboutParagraph2: homeSettings.aboutParagraph2 || '',
        aboutStat1Value: homeSettings.aboutStat1Value || '',
        aboutStat1Label: homeSettings.aboutStat1Label || '',
        aboutStat2Value: homeSettings.aboutStat2Value || '',
        aboutStat2Label: homeSettings.aboutStat2Label || '',
        aboutStat3Value: homeSettings.aboutStat3Value || '',
        aboutStat3Label: homeSettings.aboutStat3Label || '',
      });
      setMessage({ type: 'success', text: 'Who We Are section saved!' });
      load();
    } catch (err) {
      setMessage({ type: 'error', text: 'Failed to save' });
    }
  };

  const defaultSegmentCards = [
    { title: 'Knitted T-Shirts', badge: 'BEST SELLER', badgeColor: 'blue', description: '', imageUrl: '' },
    { title: 'Kidswear', badge: 'NEW', badgeColor: 'orange', description: '', imageUrl: '' },
    { title: 'Sports & Activewear', badge: 'PERFORMANCE', badgeColor: 'blue', description: '', imageUrl: '' },
    { title: 'Loungewear & Sleepwear', badge: 'COMFORT', badgeColor: 'orange', description: '', imageUrl: '' },
  ];
  const segmentCards = Array.isArray(homeSettings.segmentCards) && homeSettings.segmentCards.length >= 4
    ? homeSettings.segmentCards.slice(0, 4)
    : [...defaultSegmentCards].slice(0, 4);
  const setSegmentCard = (index, field, value) => {
    setHomeSettingsState((s) => {
      const list = [...(s.segmentCards || defaultSegmentCards)];
      while (list.length <= index) list.push({ ...defaultSegmentCards[index] || {} });
      list[index] = { ...list[index], [field]: value };
      return { ...s, segmentCards: list };
    });
  };

  const handleSaveSegments = async (e) => {
    e.preventDefault();
    setMessage(null);
    try {
      await setHomeSettings({
        segmentsHeading: homeSettings.segmentsHeading || '',
        segmentsSub: homeSettings.segmentsSub || '',
        segmentCards: segmentCards.map((c) => ({ title: c.title || '', badge: c.badge || '', badgeColor: c.badgeColor || 'blue', description: c.description || '', imageUrl: c.imageUrl || '' })),
      });
      setMessage({ type: 'success', text: 'Apparel Segments section saved!' });
      load();
    } catch (err) {
      setMessage({ type: 'error', text: 'Failed to save' });
    }
  };

  const defaultManufacturingStages = [
    { number: '01', title: 'Stores', description: '', bullets: '' },
    { number: '02', title: 'Cutting', description: '', bullets: '' },
    { number: '03', title: 'Production', description: '', bullets: '' },
  ];
  const manufacturingStages = Array.isArray(homeSettings.manufacturingStages) && homeSettings.manufacturingStages.length >= 3
    ? homeSettings.manufacturingStages.slice(0, 3)
    : [...defaultManufacturingStages].slice(0, 3);
  const setManufacturingStage = (index, field, value) => {
    setHomeSettingsState((s) => {
      const list = [...(s.manufacturingStages || defaultManufacturingStages)];
      while (list.length <= index) list.push({ ...defaultManufacturingStages[index] || {} });
      list[index] = { ...list[index], [field]: value };
      return { ...s, manufacturingStages: list };
    });
  };

  const handleSaveManufacturing = async (e) => {
    e.preventDefault();
    setMessage(null);
    try {
      await setHomeSettings({
        manufacturingTagline: homeSettings.manufacturingTagline || '',
        manufacturingHeadline: homeSettings.manufacturingHeadline || '',
        manufacturingSub: homeSettings.manufacturingSub || '',
        manufacturingStages: manufacturingStages.map((s) => ({ number: s.number || '', title: s.title || '', description: s.description || '', bullets: s.bullets || '' })),
      });
      setMessage({ type: 'success', text: 'Manufacturing Process section saved!' });
      load();
    } catch (err) {
      setMessage({ type: 'error', text: 'Failed to save' });
    }
  };

  const handleSegmentImageUpload = async (index, e) => {
    const file = e.target?.files?.[0];
    if (!file) return;
    setUploading(true);
    setMessage(null);
    try {
      const result = await uploadImage(file);
      if (result?.url) {
        setSegmentCard(index, 'imageUrl', result.url);
        setMessage({ type: 'success', text: `Card ${index + 1} image updated. Click Save to persist.` });
      } else setMessage({ type: 'error', text: 'Upload failed.' });
    } catch (err) {
      setMessage({ type: 'error', text: err?.message || 'Upload failed.' });
    } finally {
      setUploading(false);
    }
  };

  const handleSaveContacts = async (e) => {
    e.preventDefault();
    setMessage(null);
    try {
      await setHomeSettings({
        footerBrandName: homeSettings.footerBrandName || '',
        contactPhone: homeSettings.contactPhone || '',
        contactEmail: homeSettings.contactEmail || '',
        contactAddress: homeSettings.contactAddress || '',
        contactPageBgUrl: homeSettings.contactPageBgUrl || '',
        contactWeb: homeSettings.contactWeb || '',
        contactPageHeading: homeSettings.contactPageHeading || '',
        contactPageDescription: homeSettings.contactPageDescription || '',
        socialFacebook: homeSettings.socialFacebook || '',
        socialInstagram: homeSettings.socialInstagram || '',
        socialLinkedIn: homeSettings.socialLinkedIn || '',
      });
      refreshSettings?.();
      setMessage({ type: 'success', text: 'Footer saved!' });
      load();
    } catch (err) {
      setMessage({ type: 'error', text: 'Failed to save footer' });
    }
  };

  const handleAboutImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    setMessage(null);
    try {
      const result = await uploadImage(file);
      if (result?.url) {
        await setHomeSettings({ aboutImageUrl: result.url });
        setHomeSettingsState((s) => ({ ...s, aboutImageUrl: result.url }));
        setMessage({ type: 'success', text: 'About image updated!' });
        load();
      } else setMessage({ type: 'error', text: 'Upload failed.' });
    } catch (err) {
      setMessage({ type: 'error', text: err?.message || 'Upload failed.' });
    } finally {
      setUploading(false);
    }
  };

  if (loading) return <div style={formStyles.container}><p>Loading...</p></div>;

  return (
    <div style={formStyles.container}>
      <div style={formStyles.header}>
        <h1>Edit Home Page</h1>
        <Link to="/admin/dashboard" style={formStyles.backLink}>← Back to Dashboard</Link>
      </div>
      {message && <div style={{ ...formStyles.message, ...(message.type === 'success' ? formStyles.success : formStyles.error) }}>{message.text}</div>}

      <section style={formStyles.section}>
        <h3 style={formStyles.sectionHeading}>Site Logo</h3>
        <p style={formStyles.sectionDesc}>Upload your logo. It appears in the navbar and footer.</p>
        {homeSettings.logoUrl ? (
          <div style={{ marginBottom: '1rem' }}>
            <img src={homeSettings.logoUrl} alt="Current logo" style={{ ...formStyles.previewImg, maxHeight: '80px' }} />
            <div style={{ marginTop: '0.5rem' }}>
              <button type="button" style={formStyles.button} onClick={() => document.getElementById('logo-input').click()} disabled={uploading}>Replace logo</button>
              <button type="button" style={{ ...formStyles.button, ...formStyles.buttonDanger }} onClick={handleRemoveLogo}>Remove logo</button>
            </div>
            <input id="logo-input" type="file" accept="image/*" style={{ display: 'none' }} onChange={handleLogoUpload} />
          </div>
        ) : (
          <div>
            <input type="file" accept="image/*" onChange={handleLogoUpload} disabled={uploading} />
            {uploading && <p>Uploading...</p>}
          </div>
        )}
      </section>

      <section id="footer-contact" style={formStyles.section}>
        <h3 style={formStyles.sectionHeading}>Edit Footer & Contact Page</h3>
        <p style={formStyles.sectionDesc}>These fields appear in the site footer and on the Contact page. Contact page also shows a heading and description (below). Form submissions use Formspree – set VITE_FORMSPREE_FORM_ID in .env.</p>
        <form onSubmit={handleSaveContacts}>
          <label style={formStyles.label}>Footer brand name (under logo)</label>
          <input type="text" value={homeSettings.footerBrandName || ''} onChange={(e) => setHomeSettingsState((s) => ({ ...s, footerBrandName: e.target.value }))} style={formStyles.input} placeholder="Rich Light Apparels" />
          <label style={formStyles.label}>Phone</label>
          <input type="text" value={homeSettings.contactPhone || ''} onChange={(e) => setHomeSettingsState((s) => ({ ...s, contactPhone: e.target.value }))} style={formStyles.input} placeholder="+94 45 227 9306" />
          <label style={formStyles.label}>Email</label>
          <input type="email" value={homeSettings.contactEmail || ''} onChange={(e) => setHomeSettingsState((s) => ({ ...s, contactEmail: e.target.value }))} style={formStyles.input} placeholder="info@richlightapparels.lk" />
          <label style={formStyles.label}>Address</label>
          <textarea value={homeSettings.contactAddress || ''} onChange={(e) => setHomeSettingsState((s) => ({ ...s, contactAddress: e.target.value }))} style={{ ...formStyles.textarea, minHeight: '70px' }} placeholder="Kiribathgala Estate, Nivithigala Road..." />
          <label style={formStyles.label}>Website (shown on Contact page as &quot;Web&quot;)</label>
          <input type="text" value={homeSettings.contactWeb || ''} onChange={(e) => setHomeSettingsState((s) => ({ ...s, contactWeb: e.target.value }))} style={formStyles.input} placeholder="www.richlightapparels.lk" />

          <p style={{ ...formStyles.label, marginTop: '1.25rem', marginBottom: '0.35rem' }}>Contact page – heading & description</p>
          <label style={formStyles.label}>Contact page heading</label>
          <input type="text" value={homeSettings.contactPageHeading || ''} onChange={(e) => setHomeSettingsState((s) => ({ ...s, contactPageHeading: e.target.value }))} style={formStyles.input} placeholder="Let's build your next collection." />
          <label style={formStyles.label}>Contact page description</label>
          <textarea value={homeSettings.contactPageDescription || ''} onChange={(e) => setHomeSettingsState((s) => ({ ...s, contactPageDescription: e.target.value }))} style={{ ...formStyles.textarea, minHeight: '60px' }} placeholder="Share your tech packs, moodboards or ideas..." />
          <label style={formStyles.label}>Contact page background image URL (optional)</label>
          <input
            type="url"
            value={homeSettings.contactPageBgUrl || ''}
            onChange={(e) => setHomeSettingsState((s) => ({ ...s, contactPageBgUrl: e.target.value }))}
            style={formStyles.input}
            placeholder="https://... (wide background for contact section)"
          />

          <p style={{ ...formStyles.label, marginTop: '1rem', marginBottom: '0.35rem' }}>Social links</p>
          <label style={formStyles.label}>Facebook URL</label>
          <input type="url" value={homeSettings.socialFacebook || ''} onChange={(e) => setHomeSettingsState((s) => ({ ...s, socialFacebook: e.target.value }))} style={formStyles.input} placeholder="https://facebook.com/..." />
          <label style={formStyles.label}>Instagram URL</label>
          <input type="url" value={homeSettings.socialInstagram || ''} onChange={(e) => setHomeSettingsState((s) => ({ ...s, socialInstagram: e.target.value }))} style={formStyles.input} placeholder="https://instagram.com/..." />
          <label style={formStyles.label}>LinkedIn URL</label>
          <input type="url" value={homeSettings.socialLinkedIn || ''} onChange={(e) => setHomeSettingsState((s) => ({ ...s, socialLinkedIn: e.target.value }))} style={formStyles.input} placeholder="https://linkedin.com/..." />

          <button type="submit" style={formStyles.button} disabled={uploading}>Save Footer</button>
        </form>
      </section>

      <section style={formStyles.section}>
        <h3 style={formStyles.sectionHeading}>Hero Stats (blue bar under hero)</h3>
        <p style={formStyles.sectionDesc}>Three stats shown in the teal bar below the hero. Use numbers like 15+, 100K+ for a count-up animation; text like &quot;US • UK • EU&quot; is shown as-is.</p>
        <form onSubmit={handleSaveHeroStats}>
          {[0, 1, 2].map((i) => (
            <div key={i} style={{ marginBottom: '1rem' }}>
              <label style={formStyles.label}>Stat {i + 1}</label>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem 1rem' }}>
                <input
                  type="text"
                  placeholder={defaultHeroStats[i]?.value}
                value={heroStats[i]?.value ?? ''}
                onChange={(e) => setHeroStat(i, 'value', e.target.value)}
                style={formStyles.input}
              />
              <input
                type="text"
                placeholder={defaultHeroStats[i]?.label}
                value={heroStats[i]?.label ?? ''}
                onChange={(e) => setHeroStat(i, 'label', e.target.value)}
                style={formStyles.input}
              />
              </div>
            </div>
          ))}
          <button type="submit" style={formStyles.button}>Save Hero Stats</button>
        </form>
      </section>

      <section style={formStyles.section}>
        <h3 style={formStyles.sectionHeading}>Who We Are / About (home page, above Products)</h3>
        <p style={formStyles.sectionDesc}>This section appears on the home page above &quot;Our Products&quot;. Image shows on the left with location overlay; text and stats on the right.</p>
        <form onSubmit={handleSaveAbout}>
          <label style={formStyles.label}>About section image (left column)</label>
          {homeSettings.aboutImageUrl ? (
            <div style={{ marginBottom: '1rem' }}>
              <img src={homeSettings.aboutImageUrl} alt="About" style={{ ...formStyles.previewImg, maxHeight: '120px' }} />
              <div style={{ marginTop: '0.5rem' }}>
                <button type="button" style={formStyles.button} onClick={() => document.getElementById('about-image-input').click()} disabled={uploading}>Replace image</button>
              </div>
              <input id="about-image-input" type="file" accept="image/*" style={{ display: 'none' }} onChange={handleAboutImageUpload} />
            </div>
          ) : (
            <div style={{ marginBottom: '1rem' }}>
              <input type="file" accept="image/*" onChange={handleAboutImageUpload} disabled={uploading} />
              {uploading && <span style={{ marginLeft: '0.5rem' }}>Uploading…</span>}
            </div>
          )}

          <label style={formStyles.label}>Location overlay (e.g. Based in Rathnapura, Sri Lanka)</label>
          <input
            type="text"
            placeholder="Based in Rathnapura, Sri Lanka"
            value={homeSettings.aboutLocationText || ''}
            onChange={(e) => setHomeSettingsState((s) => ({ ...s, aboutLocationText: e.target.value }))}
            style={formStyles.input}
          />

          <label style={formStyles.label}>Subtitle (e.g. ABOUT RICHLIGHT)</label>
          <input
            type="text"
            placeholder="ABOUT RICHLIGHT"
            value={homeSettings.aboutSubtitle || ''}
            onChange={(e) => setHomeSettingsState((s) => ({ ...s, aboutSubtitle: e.target.value }))}
            style={formStyles.input}
          />

          <label style={formStyles.label}>Main heading (use **text** to highlight in teal)</label>
          <input
            type="text"
            placeholder="Where ideas blend with global **fashion trends.**"
            value={homeSettings.aboutHeading || ''}
            onChange={(e) => setHomeSettingsState((s) => ({ ...s, aboutHeading: e.target.value }))}
            style={formStyles.input}
          />

          <label style={formStyles.label}>Paragraph 1</label>
          <textarea
            rows={3}
            placeholder="First paragraph..."
            value={homeSettings.aboutParagraph1 || ''}
            onChange={(e) => setHomeSettingsState((s) => ({ ...s, aboutParagraph1: e.target.value }))}
            style={{ ...formStyles.input, marginBottom: '1rem' }}
          />
          <label style={formStyles.label}>Paragraph 2</label>
          <textarea
            rows={3}
            placeholder="Second paragraph..."
            value={homeSettings.aboutParagraph2 || ''}
            onChange={(e) => setHomeSettingsState((s) => ({ ...s, aboutParagraph2: e.target.value }))}
            style={{ ...formStyles.input, marginBottom: '1rem' }}
          />

          <p style={{ ...formStyles.label, marginBottom: '0.75rem' }}>Key statistics (value + label)</p>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem 1rem', marginBottom: '1rem' }}>
            <input type="text" placeholder="5" value={homeSettings.aboutStat1Value || ''} onChange={(e) => setHomeSettingsState((s) => ({ ...s, aboutStat1Value: e.target.value }))} style={formStyles.input} />
            <input type="text" placeholder="Acre Facility" value={homeSettings.aboutStat1Label || ''} onChange={(e) => setHomeSettingsState((s) => ({ ...s, aboutStat1Label: e.target.value }))} style={formStyles.input} />
            <input type="text" placeholder="250+" value={homeSettings.aboutStat2Value || ''} onChange={(e) => setHomeSettingsState((s) => ({ ...s, aboutStat2Value: e.target.value }))} style={formStyles.input} />
            <input type="text" placeholder="Skilled Staff" value={homeSettings.aboutStat2Label || ''} onChange={(e) => setHomeSettingsState((s) => ({ ...s, aboutStat2Label: e.target.value }))} style={formStyles.input} />
            <input type="text" placeholder="40+" value={homeSettings.aboutStat3Value || ''} onChange={(e) => setHomeSettingsState((s) => ({ ...s, aboutStat3Value: e.target.value }))} style={formStyles.input} />
            <input type="text" placeholder="Global Clients" value={homeSettings.aboutStat3Label || ''} onChange={(e) => setHomeSettingsState((s) => ({ ...s, aboutStat3Label: e.target.value }))} style={formStyles.input} />
          </div>

          <button type="submit" style={formStyles.button}>Save Who We Are</button>
        </form>
      </section>

      <section style={formStyles.section}>
        <h3 style={formStyles.sectionHeading}>Apparel Segments (home, before Products)</h3>
        <p style={formStyles.sectionDesc}>Shown on the home page before &quot;Our Products&quot;. Use **word** in the heading to highlight in light blue. Four cards: image, title, badge (e.g. BEST SELLER), description. Badge color: blue or orange.</p>
        <form onSubmit={handleSaveSegments}>
          <label style={formStyles.label}>Section heading</label>
          <input type="text" value={homeSettings.segmentsHeading || ''} onChange={(e) => setHomeSettingsState((s) => ({ ...s, segmentsHeading: e.target.value }))} style={formStyles.input} placeholder="Apparel solutions for **every** segment." />
          <label style={formStyles.label}>Section description</label>
          <textarea value={homeSettings.segmentsSub || ''} onChange={(e) => setHomeSettingsState((s) => ({ ...s, segmentsSub: e.target.value }))} style={formStyles.textarea} placeholder="We cater to essentials, casualwear..." rows={2} />
          {[0, 1, 2, 3].map((i) => (
            <div key={i} style={{ border: '1px solid #444', borderRadius: '6px', padding: '1rem', marginBottom: '1rem' }}>
              <strong style={{ color: '#fff' }}>Card {i + 1}</strong>
              <label style={formStyles.label}>Image</label>
              {segmentCards[i]?.imageUrl ? (
                <div style={{ marginBottom: '0.5rem' }}>
                  <img src={segmentCards[i].imageUrl} alt="" style={{ ...formStyles.previewImg, maxHeight: '80px' }} />
                  <button type="button" style={formStyles.button} onClick={() => document.getElementById(`segment-img-${i}`).click()} disabled={uploading}>Replace</button>
                  <input id={`segment-img-${i}`} type="file" accept="image/*" style={{ display: 'none' }} onChange={(e) => handleSegmentImageUpload(i, e)} />
                </div>
              ) : (
                <div><input type="file" accept="image/*" onChange={(e) => handleSegmentImageUpload(i, e)} disabled={uploading} /></div>
              )}
              <label style={formStyles.label}>Title</label>
              <input type="text" value={segmentCards[i]?.title || ''} onChange={(e) => setSegmentCard(i, 'title', e.target.value)} style={formStyles.input} placeholder="e.g. Knitted T-Shirts" />
              <label style={formStyles.label}>Badge text</label>
              <input type="text" value={segmentCards[i]?.badge || ''} onChange={(e) => setSegmentCard(i, 'badge', e.target.value)} style={formStyles.input} placeholder="BEST SELLER / NEW / PERFORMANCE / COMFORT" />
              <label style={formStyles.label}>Badge color</label>
              <select value={segmentCards[i]?.badgeColor || 'blue'} onChange={(e) => setSegmentCard(i, 'badgeColor', e.target.value)} style={formStyles.input}>
                <option value="blue">Blue</option>
                <option value="orange">Orange</option>
              </select>
              <label style={formStyles.label}>Description</label>
              <textarea value={segmentCards[i]?.description || ''} onChange={(e) => setSegmentCard(i, 'description', e.target.value)} style={formStyles.textarea} rows={3} placeholder="Soft-touch cotton and blends..." />
            </div>
          ))}
          <button type="submit" style={formStyles.button}>Save Apparel Segments</button>
        </form>
      </section>

      <section style={formStyles.section}>
        <h3 style={formStyles.sectionHeading}>Manufacturing Process (home, before Products)</h3>
        <p style={formStyles.sectionDesc}>&quot;From yarn to hanger&quot; section with three stages. Use **text** in headline to highlight in light blue. Bullets: one per line.</p>
        <form onSubmit={handleSaveManufacturing}>
          <label style={formStyles.label}>Tagline (uppercase)</label>
          <input type="text" value={homeSettings.manufacturingTagline || ''} onChange={(e) => setHomeSettingsState((s) => ({ ...s, manufacturingTagline: e.target.value }))} style={formStyles.input} placeholder="FROM YARN TO HANGER." />
          <label style={formStyles.label}>Headline (use **text** to highlight)</label>
          <input type="text" value={homeSettings.manufacturingHeadline || ''} onChange={(e) => setHomeSettingsState((s) => ({ ...s, manufacturingHeadline: e.target.value }))} style={formStyles.input} placeholder="A streamlined, transparent **manufacturing process.**" />
          <label style={formStyles.label}>Description</label>
          <textarea value={homeSettings.manufacturingSub || ''} onChange={(e) => setHomeSettingsState((s) => ({ ...s, manufacturingSub: e.target.value }))} style={formStyles.textarea} rows={2} placeholder="Every stage is monitored..." />
          {[0, 1, 2].map((i) => (
            <div key={i} style={{ border: '1px solid #444', borderRadius: '6px', padding: '1rem', marginBottom: '1rem' }}>
              <strong style={{ color: '#fff' }}>Stage {i + 1}</strong>
              <label style={formStyles.label}>Number</label>
              <input type="text" value={manufacturingStages[i]?.number || ''} onChange={(e) => setManufacturingStage(i, 'number', e.target.value)} style={formStyles.input} placeholder="01" />
              <label style={formStyles.label}>Title</label>
              <input type="text" value={manufacturingStages[i]?.title || ''} onChange={(e) => setManufacturingStage(i, 'title', e.target.value)} style={formStyles.input} placeholder="Stores / Cutting / Production" />
              <label style={formStyles.label}>Description</label>
              <textarea value={manufacturingStages[i]?.description || ''} onChange={(e) => setManufacturingStage(i, 'description', e.target.value)} style={formStyles.textarea} rows={2} />
              <label style={formStyles.label}>Bullets (one per line)</label>
              <textarea value={manufacturingStages[i]?.bullets || ''} onChange={(e) => setManufacturingStage(i, 'bullets', e.target.value)} style={formStyles.textarea} rows={4} placeholder="Fabric inspection (one per line)&#10;Barcode-based inventory" />
            </div>
          ))}
          <button type="submit" style={formStyles.button}>Save Manufacturing Process</button>
        </form>
      </section>

      <section style={formStyles.section}>
        <h3 style={formStyles.sectionHeading}>Hero Carousel</h3>
        <p style={formStyles.sectionDesc}>Add image to carousel (shown on home).</p>
        <input type="file" accept="image/*" onChange={handleAddHero} disabled={uploading} />
        {uploading && <p>Uploading...</p>}
        <div style={{ marginTop: '1rem' }}>
          {heroSlides.map((s) => (
            <div key={s.id} style={formStyles.card}>
              <img src={s.imageUrl} alt="" style={formStyles.previewImg} />
              <button type="button" style={{ ...formStyles.button, ...formStyles.buttonDanger }} onClick={() => handleDeleteHero(s.id)}>Remove</button>
            </div>
          ))}
        </div>
      </section>

      <section style={formStyles.section}>
        <h3 style={formStyles.sectionHeading}>Brands Tape (logos)</h3>
        <p style={formStyles.sectionDesc}>Add brand logo image.</p>
        <input type="file" accept="image/*" onChange={handleAddBrand} disabled={uploading} />
        <div style={{ marginTop: '1rem' }}>
          {brands.map((b) => (
            <div key={b.id} style={formStyles.card}>
              <img src={b.imageUrl} alt="" style={formStyles.cardImg} />
              <button type="button" style={{ ...formStyles.button, ...formStyles.buttonDanger }} onClick={() => handleDeleteBrand(b.id)}>Remove</button>
            </div>
          ))}
        </div>
      </section>

      <section style={formStyles.section}>
        <h3 style={formStyles.sectionHeading}>Factory Video URL</h3>
        <p style={formStyles.sectionDesc}>Paste video URL (e.g. Cloudinary or YouTube embed URL).</p>
        <form onSubmit={handleSaveFactoryVideo}>
          <input
            type="url"
            placeholder="https://..."
            value={homeSettings.factoryVideoUrl || ''}
            onChange={(e) => setHomeSettingsState((s) => ({ ...s, factoryVideoUrl: e.target.value }))}
            style={formStyles.input}
          />
          <button type="submit" style={formStyles.button}>Save Video URL</button>
        </form>
      </section>
    </div>
  );
}
