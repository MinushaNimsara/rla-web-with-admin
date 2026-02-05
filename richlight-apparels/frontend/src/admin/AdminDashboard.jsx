import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { auth } from '../services/firebase';
import { signOut } from 'firebase/auth';

function AdminDashboard() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      if (currentUser) {
        setUser(currentUser);
      } else {
        navigate('/admin');
      }
    });

    return () => unsubscribe();
  }, [navigate]);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate('/admin');
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1>Admin Dashboard</h1>
        <button onClick={handleLogout} style={styles.logoutBtn}>
          Logout
        </button>
      </div>

      {user && (
        <div style={styles.welcome}>
          <p>Welcome: {user.email}</p>
        </div>
      )}

      <div style={styles.grid}>
        <Link to="/admin/dashboard/home" style={styles.cardLink}>
          <div style={styles.card}>
            <h3 style={styles.cardHeading}>Edit Home Page</h3>
            <p style={styles.cardDesc}>Hero carousel, brands tape, factory video</p>
          </div>
        </Link>

        <Link to="/admin/dashboard/home#footer-contact" style={styles.cardLink}>
          <div style={styles.card}>
            <h3 style={styles.cardHeading}>Edit Contact Page</h3>
            <p style={styles.cardDesc}>Heading, description, address, phone, email, website, background image</p>
          </div>
        </Link>

        <Link to="/admin/dashboard/about" style={styles.cardLink}>
          <div style={styles.card}>
            <h3 style={styles.cardHeading}>Edit About Us</h3>
            <p style={styles.cardDesc}>Intro, vision, mission, values, history, directors, management</p>
          </div>
        </Link>

        <Link to="/admin/dashboard/products" style={styles.cardLink}>
          <div style={styles.card}>
            <h3 style={styles.cardHeading}>Manage Products</h3>
            <p style={styles.cardDesc}>Add, edit, delete product cards</p>
          </div>
        </Link>

        <Link to="/admin/dashboard/csr" style={styles.cardLink}>
          <div style={styles.card}>
            <h3 style={styles.cardHeading}>Manage CSR</h3>
            <p style={styles.cardDesc}>Add, edit, delete CSR cards</p>
          </div>
        </Link>

        <Link to="/admin/dashboard/newsline" style={styles.cardLink}>
          <div style={styles.card}>
            <h3 style={styles.cardHeading}>Manage Newsline</h3>
            <p style={styles.cardDesc}>Add, edit, delete news cards</p>
          </div>
        </Link>

        <Link to="/admin/dashboard/factory" style={styles.cardLink}>
          <div style={styles.card}>
            <h3 style={styles.cardHeading}>Manage Factory</h3>
            <p style={styles.cardDesc}>Add, remove factory images</p>
          </div>
        </Link>
      </div>
    </div>
  );
}

const styles = {
  container: {
    padding: '2rem',
    minHeight: '80vh',
    maxWidth: '1000px',
    margin: '0 auto',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '2rem'
  },
  logoutBtn: {
    padding: '0.5rem 1.5rem',
    backgroundColor: '#dc3545',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer'
  },
  welcome: {
    backgroundColor: '#1d72a3',
    color: 'white',
    padding: '1rem',
    borderRadius: '4px',
    marginBottom: '2rem',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
    gap: '1.5rem',
  },
  cardLink: {
    textDecoration: 'none',
    color: 'inherit',
  },
  card: {
    backgroundColor: '#2a2a2a',
    color: '#f2f2f2',
    padding: '1.5rem',
    borderRadius: '8px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
    cursor: 'pointer',
  },
  cardHeading: { color: '#fff', marginTop: 0, marginBottom: '0.35rem', fontSize: '1.15rem' },
  cardDesc: { color: '#d8d8d8', margin: 0, fontSize: '0.9rem' },
};

export default AdminDashboard;
