import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { uploadImage } from '../services/cloudinary';
import {
  getProducts,
  addProduct,
  updateProduct,
  deleteProduct,
} from '../services/firestore';

const styles = {
  container: { padding: '2rem', maxWidth: '900px', margin: '0 auto' },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '2rem',
    flexWrap: 'wrap',
    gap: '1rem',
  },
  backLink: { color: '#1d72a3', textDecoration: 'none', fontWeight: 500 },
  form: {
    backgroundColor: '#2a2a2a',
    padding: '2rem',
    borderRadius: '8px',
    marginBottom: '2rem',
  },
  input: {
    width: '100%',
    padding: '0.75rem',
    fontSize: '1rem',
    border: '1px solid #444',
    borderRadius: '4px',
    marginBottom: '1rem',
    boxSizing: 'border-box',
    backgroundColor: '#1a1a1a',
    color: '#eee',
  },
  textarea: {
    width: '100%',
    minHeight: '100px',
    padding: '0.75rem',
    fontSize: '1rem',
    border: '1px solid #444',
    borderRadius: '4px',
    marginBottom: '1rem',
    boxSizing: 'border-box',
    resize: 'vertical',
    backgroundColor: '#1a1a1a',
    color: '#eee',
  },
  previewBox: {
    marginBottom: '1rem',
    padding: '1rem',
    border: '1px dashed #555',
    borderRadius: '8px',
    textAlign: 'center',
    minHeight: '120px',
  },
  previewImg: { maxWidth: '200px', maxHeight: '200px', borderRadius: '4px' },
  button: {
    padding: '0.75rem 1.5rem',
    fontSize: '1rem',
    backgroundColor: '#1d72a3',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    marginRight: '0.5rem',
    marginBottom: '0.5rem',
  },
  buttonSecondary: {
    padding: '0.75rem 1.5rem',
    fontSize: '1rem',
    backgroundColor: '#444',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    marginRight: '0.5rem',
  },
  buttonDanger: { backgroundColor: '#c0392b' },
  message: { padding: '0.75rem', borderRadius: '4px', marginBottom: '1rem' },
  success: { backgroundColor: '#27ae60', color: 'white' },
  error: { backgroundColor: '#c0392b', color: 'white' },
  loading: { color: '#1d72a3', marginTop: '0.5rem' },
  list: { marginTop: '2rem' },
  card: {
    display: 'flex',
    gap: '1rem',
    alignItems: 'center',
    padding: '1rem',
    backgroundColor: '#2a2a2a',
    borderRadius: '8px',
    marginBottom: '1rem',
    flexWrap: 'wrap',
  },
  cardImg: { width: '80px', height: '80px', objectFit: 'cover', borderRadius: '4px' },
  cardContent: { flex: 1, minWidth: '200px' },
  cardActions: { display: 'flex', gap: '0.5rem' },
};

export default function ManageProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState(null);
  const [form, setForm] = useState({
    title: '',
    description: '',
    imageUrl: '',
  });
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');
  const [editingId, setEditingId] = useState(null);

  const loadProducts = async () => {
    setLoading(true);
    try {
      const data = await getProducts();
      setProducts(data);
    } catch (err) {
      console.error(err);
      setMessage({ type: 'error', text: 'Failed to load products' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProducts();
  }, []);

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setSelectedFile(file);
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
    setMessage(null);
  };

  const handleUploadImage = async () => {
    if (!selectedFile) {
      setMessage({ type: 'error', text: 'Please select an image first' });
      return;
    }
    setUploading(true);
    setMessage(null);
    try {
      const result = await uploadImage(selectedFile);
      if (result?.url) {
        setForm((prev) => ({ ...prev, imageUrl: result.url }));
        setMessage({ type: 'success', text: 'Image uploaded! You can now save the product.' });
        setSelectedFile(null);
        setPreviewUrl('');
      } else {
        setMessage({ type: 'error', text: 'Upload failed. No URL returned.' });
      }
    } catch (err) {
      const text = err?.message || 'Upload failed. Ensure Cloudinary preset is Unsigned.';
      setMessage({ type: 'error', text });
      console.error('Upload error:', err);
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
    if (!form.title.trim()) {
      setMessage({ type: 'error', text: 'Title is required' });
      return;
    }
    if (!form.imageUrl) {
      setMessage({ type: 'error', text: 'Please upload an image before saving.' });
      return;
    }
    setSaving(true);
    setMessage(null);
    try {
      if (editingId) {
        await updateProduct(editingId, {
          title: form.title.trim(),
          description: form.description.trim() || '',
          imageUrl: form.imageUrl || '',
        });
        setMessage({ type: 'success', text: 'Product updated!' });
      } else {
        await addProduct({
          title: form.title.trim(),
          description: form.description.trim() || '',
          imageUrl: form.imageUrl || '',
        });
        setMessage({ type: 'success', text: 'Product saved!' });
      }
      resetForm();
      loadProducts();
    } catch (err) {
      console.error(err);
      setMessage({ type: 'error', text: 'Failed to save' });
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (p) => {
    setForm({
      title: p.title || '',
      description: p.description || '',
      imageUrl: p.imageUrl || '',
    });
    setEditingId(p.id);
    setPreviewUrl(p.imageUrl || '');
    setSelectedFile(null);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this product?')) return;
    try {
      await deleteProduct(id);
      setMessage({ type: 'success', text: 'Product deleted' });
      loadProducts();
      if (editingId === id) resetForm();
    } catch (err) {
      console.error(err);
      setMessage({ type: 'error', text: 'Failed to delete' });
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1>Manage Products</h1>
        <Link to="/admin/dashboard" style={styles.backLink}>← Back to Dashboard</Link>
      </div>

      <form style={styles.form} onSubmit={handleSave}>
        <h3>{editingId ? 'Edit Product' : 'Add New Product'}</h3>

        {message && (
          <div style={{ ...styles.message, ...(message.type === 'success' ? styles.success : styles.error) }}>
            {message.text}
          </div>
        )}

        <input
          type="text"
          placeholder="Title"
          value={form.title}
          onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
          style={styles.input}
          required
        />
        <textarea
          placeholder="Description"
          value={form.description}
          onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
          style={styles.textarea}
        />

        <div style={styles.previewBox}>
          {previewUrl ? (
            <div>
              <img src={previewUrl} alt="Preview" style={styles.previewImg} />
              <div style={styles.loading}>
                {uploading ? 'Uploading...' : null}
              </div>
              {selectedFile && !uploading && (
                <button type="button" style={styles.button} onClick={handleUploadImage}>
                  Upload Image
                </button>
              )}
            </div>
          ) : form.imageUrl ? (
            <div>
              <img src={form.imageUrl} alt="Uploaded" style={styles.previewImg} />
              <p style={{ marginTop: '0.5rem', color: '#27ae60' }}>Uploaded ✓</p>
              <div style={{ marginTop: '0.75rem' }}>
                <input
                  type="file"
                  accept="image/jpeg,image/jpg,image/png,image/webp,image/gif"
                  onChange={handleFileChange}
                />
              </div>
            </div>
          ) : (
            <div>
              <input
                type="file"
                accept="image/jpeg,image/jpg,image/png,image/webp,image/gif"
                onChange={handleFileChange}
              />
            </div>
          )}
        </div>

        {form.imageUrl && !selectedFile && (
          <p style={{ color: '#27ae60', marginBottom: '1rem' }}>Image uploaded. You can save the product.</p>
        )}

        <div>
          <button type="submit" style={styles.button} disabled={saving || uploading}>
            {saving ? 'Saving...' : editingId ? 'Update Product' : 'Save Product'}
          </button>
          {editingId && (
            <button type="button" style={styles.buttonSecondary} onClick={resetForm}>
              Cancel
            </button>
          )}
        </div>
      </form>

      <div style={styles.list}>
        <h3>Existing Products</h3>
        {loading ? (
          <p>Loading...</p>
        ) : products.length === 0 ? (
          <p>No products yet. Add one above.</p>
        ) : (
          products.map((p) => (
            <div key={p.id} style={styles.card}>
              {p.imageUrl && (
                <img src={p.imageUrl} alt={p.title} style={styles.cardImg} />
              )}
              <div style={styles.cardContent}>
                <strong>{p.title}</strong>
                {p.description && <p style={{ margin: '0.25rem 0 0', fontSize: '0.9rem', color: '#aaa' }}>{p.description.slice(0, 80)}...</p>}
              </div>
              <div style={styles.cardActions}>
                <button type="button" style={styles.buttonSecondary} onClick={() => handleEdit(p)}>Edit</button>
                <button type="button" style={{ ...styles.button, ...styles.buttonDanger }} onClick={() => handleDelete(p.id)}>Delete</button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
