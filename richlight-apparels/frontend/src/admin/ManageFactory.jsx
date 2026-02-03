import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { uploadImage } from '../services/cloudinary';
import { getFactoryItems, addFactoryItem, deleteFactoryItem } from '../services/firestore';

const formStyles = {
  container: { padding: '2rem', maxWidth: '900px', margin: '0 auto' },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' },
  backLink: { color: '#1d72a3', textDecoration: 'none', fontWeight: 500 },
  form: { backgroundColor: '#2a2a2a', padding: '2rem', borderRadius: '8px', marginBottom: '2rem' },
  input: { width: '100%', padding: '0.75rem', fontSize: '1rem', border: '1px solid #444', borderRadius: '4px', marginBottom: '1rem', boxSizing: 'border-box', backgroundColor: '#1a1a1a', color: '#eee' },
  previewBox: { marginBottom: '1rem', padding: '1rem', border: '1px dashed #555', borderRadius: '8px', textAlign: 'center', minHeight: '100px' },
  previewImg: { maxWidth: '200px', maxHeight: '200px', borderRadius: '4px' },
  button: { padding: '0.75rem 1.5rem', fontSize: '1rem', backgroundColor: '#1d72a3', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', marginRight: '0.5rem', marginBottom: '0.5rem' },
  buttonDanger: { backgroundColor: '#c0392b' },
  message: { padding: '0.75rem', borderRadius: '4px', marginBottom: '1rem' },
  success: { backgroundColor: '#27ae60', color: 'white' },
  error: { backgroundColor: '#c0392b', color: 'white' },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '1rem' },
  card: { backgroundColor: '#2a2a2a', borderRadius: '8px', overflow: 'hidden' },
  cardImg: { width: '100%', height: '140px', objectFit: 'cover' },
  cardBody: { padding: '0.75rem' },
};

export default function ManageFactory() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState(null);
  const [imageUrl, setImageUrl] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');

  const load = async () => {
    setLoading(true);
    try {
      const data = await getFactoryItems();
      setItems(data);
    } catch (err) {
      console.error(err);
      setMessage({ type: 'error', text: 'Failed to load' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setSelectedFile(file);
    setPreviewUrl(URL.createObjectURL(file));
    setMessage(null);
  };

  const handleUpload = async () => {
    if (!selectedFile) { setMessage({ type: 'error', text: 'Select an image first' }); return; }
    setUploading(true);
    setMessage(null);
    try {
      const result = await uploadImage(selectedFile);
      if (result?.url) {
        setImageUrl(result.url);
        setMessage({ type: 'success', text: 'Image uploaded! Click Add to save.' });
        setSelectedFile(null);
        setPreviewUrl('');
      } else setMessage({ type: 'error', text: 'Upload failed. No URL returned.' });
    } catch (err) {
      setMessage({ type: 'error', text: err?.message || 'Upload failed. Check Cloudinary preset is Unsigned.' });
    } finally {
      setUploading(false);
    }
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!imageUrl) { setMessage({ type: 'error', text: 'Upload an image first' }); return; }
    setSaving(true);
    setMessage(null);
    try {
      await addFactoryItem({ imageUrl, order: items.length });
      setMessage({ type: 'success', text: 'Added!' });
      setImageUrl('');
      load();
    } catch (err) {
      setMessage({ type: 'error', text: 'Failed' });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Remove this image?')) return;
    try {
      await deleteFactoryItem(id);
      setMessage({ type: 'success', text: 'Removed' });
      load();
    } catch (err) {
      setMessage({ type: 'error', text: 'Failed' });
    }
  };

  return (
    <div style={formStyles.container}>
      <div style={formStyles.header}>
        <h1>Manage Factory</h1>
        <Link to="/admin/dashboard" style={formStyles.backLink}>← Back to Dashboard</Link>
      </div>
      <form style={formStyles.form} onSubmit={handleAdd}>
        <h3>Add Factory Image</h3>
        {message && <div style={{ ...formStyles.message, ...(message.type === 'success' ? formStyles.success : formStyles.error) }}>{message.text}</div>}
        <div style={formStyles.previewBox}>
          {previewUrl ? (
            <div>
              <img src={previewUrl} alt="Preview" style={formStyles.previewImg} />
              {selectedFile && !uploading && <button type="button" style={formStyles.button} onClick={handleUpload}>Upload Image</button>}
            </div>
          ) : <input type="file" accept="image/*" onChange={handleFileChange} />}
        </div>
        {imageUrl && <p style={{ color: '#27ae60', marginBottom: '1rem' }}>Image ready. Click Add below.</p>}
        <button type="submit" style={formStyles.button} disabled={saving || !imageUrl}>{saving ? 'Adding...' : 'Add Image'}</button>
      </form>
      <h3>Factory images</h3>
      {loading ? <p>Loading...</p> : items.length === 0 ? <p>No images yet.</p> : (
        <div style={formStyles.grid}>
          {items.map((p) => (
            <div key={p.id} style={formStyles.card}>
              <img src={p.imageUrl} alt="" style={formStyles.cardImg} />
              <div style={formStyles.cardBody}>
                <button type="button" style={{ ...formStyles.button, ...formStyles.buttonDanger }} onClick={() => handleDelete(p.id)}>Remove</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
