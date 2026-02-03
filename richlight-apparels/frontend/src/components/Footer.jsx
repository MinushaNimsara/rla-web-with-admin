import { Link } from 'react-router-dom';

function Footer() {
  return (
    <footer className="site-footer">
      <div className="section-inner">
        <p>&copy; 2026 Rich Light Apparels. All rights reserved.</p>
        <Link to="/admin" style={styles.hiddenLink} aria-hidden="true">.</Link>
      </div>
    </footer>
  );
}

const styles = {
  hiddenLink: {
    color: '#1a1a1a',
    textDecoration: 'none',
    fontSize: '1px',
    opacity: 0.01
  }
};

export default Footer;
