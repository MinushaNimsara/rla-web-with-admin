import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
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
  section: { backgroundColor: '#2a2a2a', padding: '2rem', borderRadius: '8px', marginBottom: '2rem' },
  input: { width: '100%', padding: '0.75rem', fontSize: '1rem', border: '1px solid #444', borderRadius: '4px', marginBottom: '1rem', boxSizing: 'border-box', backgroundColor: '#1a1a1a', color: '#eee' },
  previewBox: { marginBottom: '1rem', padding: '1rem', border: '1px dashed #555', borderRadius: '8px', textAlign: 'center', minHeight: '80px' },
  previewImg: { maxWidth: '200px', maxHeight: '120px', borderRadius: '4px' },
  button: { padding: '0.75rem 1.5rem', fontSize: '1rem', backgroundColor: '#1d72a3', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', marginRight: '0.5rem', marginBottom: '0.5rem' },
  buttonDanger: { backgroundColor: '#c0392b' },
  message: { padding: '0.75rem', borderRadius: '4px', marginBottom: '1rem' },
  success: { backgroundColor: '#27ae60', color: 'white' },
  error: { backgroundColor: '#c0392b', color: 'white' },
  card: { display: 'flex', alignItems: 'center', gap: '1rem', padding: '0.75rem', backgroundColor: '#1a1a1a', borderRadius: '4px', marginBottom: '0.5rem' },
  cardImg: { width: '60px', height: '40px', objectFit: 'contain' },
};

export default function EditHome() {
  const [heroSlides, setHeroSlides] = useState([]);
  const [brands, setBrands] = useState([]);
  const [homeSettings, setHomeSettingsState] = useState({ factoryVideoUrl: '' });
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

  if (loading) return <div style={formStyles.container}><p>Loading...</p></div>;

  return (
    <div style={formStyles.container}>
      <div style={formStyles.header}>
        <h1>Edit Home Page</h1>
        <Link to="/admin/dashboard" style={formStyles.backLink}>← Back to Dashboard</Link>
      </div>
      {message && <div style={{ ...formStyles.message, ...(message.type === 'success' ? formStyles.success : formStyles.error) }}>{message.text}</div>}

      <section style={formStyles.section}>
        <h3>Hero Carousel</h3>
        <p>Add image to carousel (shown on home).</p>
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
        <h3>Brands Tape (logos)</h3>
        <p>Add brand logo image.</p>
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
        <h3>Factory Video URL</h3>
        <p>Paste video URL (e.g. Cloudinary or YouTube embed URL).</p>
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
