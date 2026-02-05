import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getAboutPage, setAboutPage } from '../services/firestore';
import { uploadImage } from '../services/cloudinary';

const formStyles = {
  container: { padding: '2rem', maxWidth: '900px', margin: '0 auto' },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' },
  backLink: { color: '#1d72a3', textDecoration: 'none', fontWeight: 500 },
  section: { backgroundColor: '#2a2a2a', color: '#f2f2f2', padding: '2rem', borderRadius: '8px', marginBottom: '2rem' },
  sectionHeading: { color: '#fff', marginTop: 0, marginBottom: '0.5rem', fontSize: '1.25rem' },
  sectionDesc: { color: '#d8d8d8', marginBottom: '1rem', fontSize: '0.95rem' },
  input: { width: '100%', padding: '0.75rem', fontSize: '1rem', border: '1px solid #555', borderRadius: '4px', marginBottom: '1rem', boxSizing: 'border-box', backgroundColor: '#1a1a1a', color: '#f0f0f0' },
  textarea: { width: '100%', minHeight: '100px', padding: '0.75rem', fontSize: '1rem', border: '1px solid #555', borderRadius: '4px', marginBottom: '1rem', boxSizing: 'border-box', resize: 'vertical', backgroundColor: '#1a1a1a', color: '#f0f0f0' },
  label: { display: 'block', color: '#d8d8d8', fontSize: '0.9rem', marginBottom: '0.35rem' },
  button: { padding: '0.75rem 1.5rem', fontSize: '1rem', backgroundColor: '#1d72a3', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', marginRight: '0.5rem', marginBottom: '0.5rem' },
  buttonDanger: { backgroundColor: '#c0392b' },
  message: { padding: '0.75rem', borderRadius: '4px', marginBottom: '1rem' },
  success: { backgroundColor: '#27ae60', color: 'white' },
  error: { backgroundColor: '#c0392b', color: 'white' },
  card: { padding: '1rem', backgroundColor: '#1a1a1a', borderRadius: '8px', marginBottom: '1rem', color: '#f0f0f0' },
  previewImg: { maxWidth: '80px', maxHeight: '80px', borderRadius: '4px', objectFit: 'cover' },
};

const defaultData = {
  introTitle: 'About Us',
  introParagraphs: [],
  introImageUrl: '',
  aboutImages: [],
  visionTitle: 'Our Vision',
  visionQuote: '',
  missionTitle: 'Our Mission',
  missionQuote: '',
  valuesTitle: 'Our Values',
  valuesList: [],
  historyTitle: 'Our History',
  historyParagraphs: [],
  directorsTitle: 'Board of Directors',
  directors: [],
  managementTitle: 'Management Team',
  management: [],
};

export default function EditAbout() {
  const [data, setData] = useState(defaultData);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState(null);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    getAboutPage()
      .then((d) => setData({ ...defaultData, ...d }))
      .catch(() => setMessage({ type: 'error', text: 'Failed to load' }))
      .finally(() => setLoading(false));
  }, []);

  const update = (key, value) => setData((prev) => ({ ...prev, [key]: value }));

  const handleSave = async (e) => {
    e.preventDefault();
    setMessage(null);
    setSaving(true);
    try {
      await setAboutPage({
        introTitle: data.introTitle,
        introParagraphs: Array.isArray(data.introParagraphs) ? data.introParagraphs : (data.introParagraphs || '').split('\n\n').filter(Boolean),
        introImageUrl: data.introImageUrl || '',
        aboutImages: data.aboutImages || [],
        visionTitle: data.visionTitle,
        visionQuote: data.visionQuote,
        missionTitle: data.missionTitle,
        missionQuote: data.missionQuote,
        valuesTitle: data.valuesTitle,
        valuesList: Array.isArray(data.valuesList) ? data.valuesList : (data.valuesList || '').split('\n').map((s) => s.trim()).filter(Boolean),
        historyTitle: data.historyTitle,
        historyParagraphs: Array.isArray(data.historyParagraphs) ? data.historyParagraphs : (data.historyParagraphs || '').split('\n\n').filter(Boolean),
        directorsTitle: data.directorsTitle,
        directors: data.directors || [],
        managementTitle: data.managementTitle,
        management: data.management || [],
      });
      setMessage({ type: 'success', text: 'About page saved!' });
    } catch (err) {
      setMessage({ type: 'error', text: err?.message || 'Failed to save' });
    } finally {
      setSaving(false);
    }
  };

  const addPerson = (type) => {
    const list = type === 'directors' ? data.directors : data.management;
    update(type, [...(list || []), { name: '', title: '', bio: '', imageUrl: '' }]);
  };

  const updatePerson = (type, index, field, value) => {
    const list = [...(type === 'directors' ? data.directors : data.management)];
    list[index] = { ...list[index], [field]: value };
    update(type, list);
  };

  const removePerson = (type, index) => {
    const list = type === 'directors' ? data.directors : data.management;
    update(type, list.filter((_, i) => i !== index));
  };

  const handlePersonImageUpload = async (type, index, file) => {
    if (!file) return;
    setUploading(true);
    setMessage(null);
    try {
      const result = await uploadImage(file);
      if (result?.url) updatePerson(type, index, 'imageUrl', result.url);
    } catch (err) {
      setMessage({ type: 'error', text: err?.message || 'Upload failed' });
    } finally {
      setUploading(false);
    }
  };

  const handleIntroImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    setMessage(null);
    try {
      const result = await uploadImage(file);
      if (result?.url) update('introImageUrl', result.url);
    } catch (err) {
      setMessage({ type: 'error', text: err?.message || 'Upload failed' });
    } finally {
      setUploading(false);
    }
  };

  const handleAddGalleryImage = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    setMessage(null);
    try {
      const result = await uploadImage(file);
      if (result?.url) update('aboutImages', [...(data.aboutImages || []), result.url]);
    } catch (err) {
      setMessage({ type: 'error', text: err?.message || 'Upload failed' });
    } finally {
      setUploading(false);
    }
  };

  const removeGalleryImage = (index) => {
    update('aboutImages', (data.aboutImages || []).filter((_, i) => i !== index));
  };

  if (loading) return <div style={formStyles.container}><p>Loading...</p></div>;

  const introText = Array.isArray(data.introParagraphs) ? data.introParagraphs.join('\n\n') : (data.introParagraphs || '');
  const historyText = Array.isArray(data.historyParagraphs) ? data.historyParagraphs.join('\n\n') : (data.historyParagraphs || '');
  const valuesText = Array.isArray(data.valuesList) ? data.valuesList.join('\n') : (data.valuesList || '');

  return (
    <div style={formStyles.container}>
      <div style={formStyles.header}>
        <h1>Edit About Us Page</h1>
        <Link to="/admin/dashboard" style={formStyles.backLink}>← Back to Dashboard</Link>
      </div>
      {message && <div style={{ ...formStyles.message, ...(message.type === 'success' ? formStyles.success : formStyles.error) }}>{message.text}</div>}

      <form onSubmit={handleSave}>
        <section style={formStyles.section}>
          <h3 style={formStyles.sectionHeading}>Introduction (About Us)</h3>
          <p style={formStyles.sectionDesc}>Main intro section. Add an image to show beside the text (like Ebony Holdings). Use a blank line between paragraphs.</p>
          <label style={formStyles.label}>Introduction image (optional, shown left of text)</label>
          {data.introImageUrl ? (
            <div style={{ marginBottom: '1rem' }}>
              <img src={data.introImageUrl} alt="Intro" style={{ ...formStyles.previewImg, maxHeight: '120px', marginBottom: '0.5rem' }} />
              <div>
                <button type="button" style={formStyles.button} onClick={() => document.getElementById('intro-image-input').click()} disabled={uploading}>Replace</button>
                <button type="button" style={{ ...formStyles.button, ...formStyles.buttonDanger }} onClick={() => update('introImageUrl', '')}>Remove</button>
              </div>
              <input id="intro-image-input" type="file" accept="image/*" style={{ display: 'none' }} onChange={handleIntroImageUpload} />
            </div>
          ) : (
            <div style={{ marginBottom: '1rem' }}>
              <input type="file" accept="image/*" onChange={handleIntroImageUpload} disabled={uploading} />
              {uploading && <span style={{ marginLeft: '0.5rem' }}>Uploading…</span>}
            </div>
          )}
          <label style={formStyles.label}>Section title</label>
          <input type="text" value={data.introTitle || ''} onChange={(e) => update('introTitle', e.target.value)} style={formStyles.input} placeholder="About Us" />
          <label style={formStyles.label}>Paragraphs (one per block, separate with blank line)</label>
          <textarea value={introText} onChange={(e) => update('introParagraphs', e.target.value)} style={formStyles.textarea} placeholder="First paragraph...\n\nSecond paragraph..." rows={5} />
        </section>

        <section style={formStyles.section}>
          <h3 style={formStyles.sectionHeading}>About page gallery</h3>
          <p style={formStyles.sectionDesc}>Add images to show in a gallery section on the About Us page (after History).</p>
          <input type="file" accept="image/*" onChange={handleAddGalleryImage} disabled={uploading} style={{ marginBottom: '1rem' }} />
          {uploading && <span>Uploading…</span>}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
            {(data.aboutImages || []).map((url, i) => (
              <div key={i} style={{ position: 'relative' }}>
                <img src={url} alt="" style={{ width: 80, height: 80, objectFit: 'cover', borderRadius: 4, border: '1px solid #555' }} />
                <button type="button" style={{ position: 'absolute', top: 2, right: 2, width: 22, height: 22, padding: 0, fontSize: 14, lineHeight: 1, ...formStyles.buttonDanger }} onClick={() => removeGalleryImage(i)} aria-label="Remove">×</button>
              </div>
            ))}
          </div>
        </section>

        <section style={formStyles.section}>
          <h3 style={formStyles.sectionHeading}>Vision</h3>
          <label style={formStyles.label}>Section title</label>
          <input type="text" value={data.visionTitle || ''} onChange={(e) => update('visionTitle', e.target.value)} style={formStyles.input} placeholder="Our Vision" />
          <label style={formStyles.label}>Quote</label>
          <textarea value={data.visionQuote || ''} onChange={(e) => update('visionQuote', e.target.value)} style={formStyles.textarea} placeholder="To be a preferred..." rows={2} />
        </section>

        <section style={formStyles.section}>
          <h3 style={formStyles.sectionHeading}>Mission</h3>
          <label style={formStyles.label}>Section title</label>
          <input type="text" value={data.missionTitle || ''} onChange={(e) => update('missionTitle', e.target.value)} style={formStyles.input} placeholder="Our Mission" />
          <label style={formStyles.label}>Quote</label>
          <textarea value={data.missionQuote || ''} onChange={(e) => update('missionQuote', e.target.value)} style={formStyles.textarea} placeholder="To be an exemplary..." rows={2} />
        </section>

        <section style={formStyles.section}>
          <h3 style={formStyles.sectionHeading}>Values</h3>
          <label style={formStyles.label}>Section title</label>
          <input type="text" value={data.valuesTitle || ''} onChange={(e) => update('valuesTitle', e.target.value)} style={formStyles.input} placeholder="Our Values" />
          <label style={formStyles.label}>One value per line</label>
          <textarea value={valuesText} onChange={(e) => update('valuesList', e.target.value)} style={formStyles.textarea} placeholder="Focus on Stakeholders\nUncompromising Quality" rows={5} />
        </section>

        <section style={formStyles.section}>
          <h3 style={formStyles.sectionHeading}>History</h3>
          <label style={formStyles.label}>Section title</label>
          <input type="text" value={data.historyTitle || ''} onChange={(e) => update('historyTitle', e.target.value)} style={formStyles.input} placeholder="Our History" />
          <label style={formStyles.label}>Paragraphs (separate with blank line)</label>
          <textarea value={historyText} onChange={(e) => update('historyParagraphs', e.target.value)} style={formStyles.textarea} rows={5} />
        </section>

        <section style={formStyles.section}>
          <h3 style={formStyles.sectionHeading}>Board of Directors</h3>
          <p style={formStyles.sectionDesc}>Add name, title (e.g. Chairman), and short bio. Optional photo.</p>
          <label style={formStyles.label}>Section title</label>
          <input type="text" value={data.directorsTitle || ''} onChange={(e) => update('directorsTitle', e.target.value)} style={formStyles.input} placeholder="Board of Directors" />
          {(data.directors || []).map((person, i) => (
            <div key={i} style={formStyles.card}>
              <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'flex-start' }}>
                {person.imageUrl && <img src={person.imageUrl} alt="" style={formStyles.previewImg} />}
                <div style={{ flex: 1, minWidth: 200 }}>
                  <input type="text" placeholder="Full name" value={person.name || ''} onChange={(e) => updatePerson('directors', i, 'name', e.target.value)} style={formStyles.input} />
                  <input type="text" placeholder="Title (e.g. Chairman)" value={person.title || ''} onChange={(e) => updatePerson('directors', i, 'title', e.target.value)} style={formStyles.input} />
                  <textarea placeholder="Short bio" value={person.bio || ''} onChange={(e) => updatePerson('directors', i, 'bio', e.target.value)} style={{ ...formStyles.textarea, minHeight: '60px' }} rows={2} />
                  <input type="file" accept="image/*" onChange={(e) => handlePersonImageUpload('directors', i, e.target.files?.[0])} disabled={uploading} style={{ marginBottom: '0.5rem' }} />
                  <button type="button" style={{ ...formStyles.button, ...formStyles.buttonDanger }} onClick={() => removePerson('directors', i)}>Remove</button>
                </div>
              </div>
            </div>
          ))}
          <button type="button" style={formStyles.button} onClick={() => addPerson('directors')}>+ Add Director</button>
        </section>

        <section style={formStyles.section}>
          <h3 style={formStyles.sectionHeading}>Management Team</h3>
          <p style={formStyles.sectionDesc}>Add name, title, and short bio. Optional photo.</p>
          <label style={formStyles.label}>Section title</label>
          <input type="text" value={data.managementTitle || ''} onChange={(e) => update('managementTitle', e.target.value)} style={formStyles.input} placeholder="Management Team" />
          {(data.management || []).map((person, i) => (
            <div key={i} style={formStyles.card}>
              <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'flex-start' }}>
                {person.imageUrl && <img src={person.imageUrl} alt="" style={formStyles.previewImg} />}
                <div style={{ flex: 1, minWidth: 200 }}>
                  <input type="text" placeholder="Full name" value={person.name || ''} onChange={(e) => updatePerson('management', i, 'name', e.target.value)} style={formStyles.input} />
                  <input type="text" placeholder="Title (e.g. Managing Director)" value={person.title || ''} onChange={(e) => updatePerson('management', i, 'title', e.target.value)} style={formStyles.input} />
                  <textarea placeholder="Short bio" value={person.bio || ''} onChange={(e) => updatePerson('management', i, 'bio', e.target.value)} style={{ ...formStyles.textarea, minHeight: '60px' }} rows={2} />
                  <input type="file" accept="image/*" onChange={(e) => handlePersonImageUpload('management', i, e.target.files?.[0])} disabled={uploading} style={{ marginBottom: '0.5rem' }} />
                  <button type="button" style={{ ...formStyles.button, ...formStyles.buttonDanger }} onClick={() => removePerson('management', i)}>Remove</button>
                </div>
              </div>
            </div>
          ))}
          <button type="button" style={formStyles.button} onClick={() => addPerson('management')}>+ Add Management</button>
        </section>

        <button type="submit" style={formStyles.button} disabled={saving}>{saving ? 'Saving...' : 'Save About Page'}</button>
      </form>
    </div>
  );
}
