import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { SiteSettingsProvider } from './context/SiteSettingsContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import CursorDot from './components/CursorDot';
import ProtectedRoute from './components/ProtectedRoute';
import Home from './pages/Home';
import AboutUs from './pages/AboutUs';
import Products from './pages/Products';
import CSR from './pages/CSR';
import Newsline from './pages/Newsline';
import Factory from './pages/Factory';
import ContactUs from './pages/ContactUs';
import AdminLogin from './admin/AdminLogin';
import AdminDashboard from './admin/AdminDashboard';
import ManageProducts from './admin/ManageProducts';
import ManageCSR from './admin/ManageCSR';
import ManageNewsline from './admin/ManageNewsline';
import ManageFactory from './admin/ManageFactory';
import EditHome from './admin/EditHome';
import EditAbout from './admin/EditAbout';

function Layout({ children, showNavFooter }) {
  if (!showNavFooter) return children;
  return (
    <>
      <CursorDot />
      <Navbar />
      {children}
      <Footer />
    </>
  );
}

function AppRoutes() {
  const location = useLocation();
  const isAdmin = location.pathname.startsWith('/admin');

  return (
    <Layout showNavFooter={!isAdmin}>
      <Routes>
        {/* Public pages */}
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<AboutUs />} />
        <Route path="/products" element={<Products />} />
        <Route path="/csr" element={<CSR />} />
        <Route path="/newsline" element={<Newsline />} />
        <Route path="/factory" element={<Factory />} />
        <Route path="/contact" element={<ContactUs />} />

        {/* Admin: login (no protection) */}
        <Route path="/admin" element={<AdminLogin />} />

        {/* Admin: protected routes */}
        <Route
          path="/admin/dashboard"
          element={
            <ProtectedRoute>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/dashboard/products"
          element={
            <ProtectedRoute>
              <ManageProducts />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/dashboard/csr"
          element={
            <ProtectedRoute>
              <ManageCSR />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/dashboard/newsline"
          element={
            <ProtectedRoute>
              <ManageNewsline />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/dashboard/factory"
          element={
            <ProtectedRoute>
              <ManageFactory />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/dashboard/home"
          element={
            <ProtectedRoute>
              <EditHome />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/dashboard/about"
          element={
            <ProtectedRoute>
              <EditAbout />
            </ProtectedRoute>
          }
        />
      </Routes>
    </Layout>
  );
}

function App() {
  return (
    <Router>
      <SiteSettingsProvider>
        <div className="App">
          <AppRoutes />
        </div>
      </SiteSettingsProvider>
    </Router>
  );
}

export default App;
