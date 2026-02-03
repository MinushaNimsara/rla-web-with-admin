import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { uploadImage } from '../services/cloudinary';
import { getNewslineItems, addNewslineItem, updateNewslineItem, deleteNewslineItem } from '../services/firestore';

const formStyles = {
  container: { padding: '2rem', maxWidth: '900px', margin: '0 auto' },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' },
  backLink: { color: '#1d72a3', textDecoration: 'none', fontWeight: 500 },
  form: { backgroundColor: '#2a2a2a', padding: '2rem', borderRadius: '8px', marginBottom: '2rem' },
  input: { width: '100%', padding: '0.75rem', fontSize: '1rem', border: '1px solid #444', borderRadius: '4px', marginBottom: '1rem', boxSizing: 'border-box', backgroundColor: '#1a1a1a', color: '#eee' },
  textarea: { width: '100%', minHeight: '80px', padding: '0.75rem', fontSize: '1rem', border: '1px solid #444', borderRadius: '4px', marginBottom: '1rem', boxSizing: 'border-box', resize: 'vertical', backgroundColor: '#1a1a1a', color: '#eee' },
  previewBox: { marginBottom: '1rem', padding: '1rem', border: '1px dashed #555', borderRadius: '8px', textAlign: 'center', minHeight: '100px' },
  previewImg: { maxWidth: '180px', maxHeight: '180px', borderRadius: '4px' },
  button: { padding: '0.75rem 1.5rem', fontSize: '1rem', backgroundColor: '#1d72a3', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', marginRight: '0.5rem', marginBottom: '0.5rem' },
  buttonSecondary: { padding: '0.75rem 1.5rem', fontSize: '1rem', backgroundColor: '#444', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' },
  buttonDanger: { backgroundColor: '#c0392b' },
  message: { padding: '0.75rem', borderRadius: '4px', marginBottom: '1rem' },
  success: { backgroundColor: '#27ae60', color: 'white' },
  error: { backgroundColor: '#c0392b', color: 'white' },
  card: { display: 'flex', gap: '1rem', alignItems: 'center', padding: '1rem', backgroundColor: '#2a2a2a', borderRadius: '8px', marginBottom: '1rem', flexWrap: 'wrap' },
  cardImg: { width: '70px', height: '70px', objectFit: 'cover', borderRadius: '4px' },
  cardContent: { flex: 1, minWidth: '180px' },
};

export default function ManageNewsline() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState(null);
  const [form, setForm] = useState({ title: '', description: '', imageUrl: '' });
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');
  const [editingId, setEditingId] = useState(null);

  const load = async () => {
    setLoading(true);
    try {
      const data = await getNewslineItems();
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
        setForm((prev) => ({ ...prev, imageUrl: result.url }));
        setMessage({ type: 'success', text: 'Image uploaded!' });
        setSelectedFile(null);
        setPreviewUrl('');
      } else setMessage({ type: 'error', text: 'Upload failed. No URL returned.' });
    } catch (err) {
      setMessage({ type: 'error', text: err?.message || 'Upload failed. Check Cloudinary preset is Unsigned.' });
    } finally {
      setUploading(false);
    }
  };

  const resetForm = () => {
    setForm({ title: '', description: '', imageUrl: '' });
    setSelectedFile(null);
    setPreviewUrl('');
    setEditingId(null);
    setMessage(null);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!form.title.trim()) { setMessage({ type: 'error', text: 'Title required' }); return; }
    if (!form.imageUrl) { setMessage({ type: 'error', text: 'Please upload an image before saving.' }); return; }
    setSaving(true);
    setMessage(null);
    try {
      if (editingId) {
        await updateNewslineItem(editingId, { title: form.title.trim(), description: form.description.trim() || '', imageUrl: form.imageUrl || '' });
        setMessage({ type: 'success', text: 'Updated!' });
      } else {
        await addNewslineItem({ title: form.title.trim(), description: form.description.trim() || '', imageUrl: form.imageUrl || '' });
        setMessage({ type: 'success', text: 'Saved!' });
      }
      resetForm();
      load();
    } catch (err) {
      setMessage({ type: 'error', text: 'Save failed' });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this item?')) return;
    try {
      await deleteNewslineItem(id);
      setMessage({ type: 'success', text: 'Deleted' });
      load();
      if (editingId === id) resetForm();
    } catch (err) {
      setMessage({ type: 'error', text: 'Delete failed' });
    }
  };

  return (
    <div style={formStyles.container}>
      <div style={formStyles.header}>
        <h1>Manage Newsline</h1>
        <Link to="/admin/dashboard" style={formStyles.backLink}>← Back to Dashboard</Link>
      </div>
      <form style={formStyles.form} onSubmit={handleSave}>
        <h3>{editingId ? 'Edit Item' : 'Add News Item'}</h3>
        {message && <div style={{ ...formStyles.message, ...(message.type === 'success' ? formStyles.success : formStyles.error) }}>{message.text}</div>}
        <input type="text" placeholder="Title" value={form.title} onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))} style={formStyles.input} required />
        <textarea placeholder="Description" value={form.description} onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))} style={formStyles.textarea} />
        <div style={formStyles.previewBox}>
          {previewUrl ? (
            <div>
              <img src={previewUrl} alt="Preview" style={formStyles.previewImg} />
              {selectedFile && !uploading && <button type="button" style={formStyles.button} onClick={handleUpload}>Upload Image</button>}
            </div>
          ) : form.imageUrl ? (
            <div>
              <img src={form.imageUrl} alt="Uploaded" style={formStyles.previewImg} />
              <p style={{ margin: '0.5rem 0 0', color: '#27ae60' }}>Uploaded ✓</p>
              <div style={{ marginTop: '0.75rem' }}>
                <input type="file" accept="image/*" onChange={handleFileChange} />
              </div>
            </div>
          ) : (
            <input type="file" accept="image/*" onChange={handleFileChange} />
          )}
        </div>
        <button type="submit" style={formStyles.button} disabled={saving || uploading}>{saving ? 'Saving...' : editingId ? 'Update' : 'Save'}</button>
        {editingId && <button type="button" style={formStyles.buttonSecondary} onClick={resetForm}>Cancel</button>}
      </form>
      <h3>Existing items</h3>
      {loading ? <p>Loading...</p> : items.length === 0 ? <p>No items yet.</p> : items.map((p) => (
        <div key={p.id} style={formStyles.card}>
          {p.imageUrl && <img src={p.imageUrl} alt="" style={formStyles.cardImg} />}
          <div style={formStyles.cardContent}><strong>{p.title}</strong></div>
          <button type="button" style={formStyles.buttonSecondary} onClick={() => { setForm({ title: p.title, description: p.description || '', imageUrl: p.imageUrl || '' }); setEditingId(p.id); setPreviewUrl(p.imageUrl || ''); }}>Edit</button>
          <button type="button" style={{ ...formStyles.button, ...formStyles.buttonDanger }} onClick={() => handleDelete(p.id)}>Delete</button>
        </div>
      ))}
    </div>
  );
}
