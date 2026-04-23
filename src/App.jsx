import { BrowserRouter as Router, Navigate, Route, Routes } from 'react-router-dom';
import { useEffect, useState } from 'react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import About from './pages/About';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import Collections from './pages/Collections';
import Commission from './pages/Commission';
import Consult from './pages/Consult';
import Contact from './pages/Contact';
import Heritage from './pages/Heritage';
import Shop from './pages/Shop';
import SignIn from './pages/SignIn';
import SignUp from './pages/SignUp';
import AdminAddProduct from './pages/AdminAddProduct';
import AdminEditProduct from './pages/AdminEditProduct';
import AdminOrders from './pages/AdminOrders';
import AdminDashboard from './pages/AdminDashboard';
import { apiFetch, getToken, setToken } from './lib/api';
import './App.css';

function App() {
  const [hasStoredToken, setHasStoredToken] = useState(() => Boolean(getToken()));
  const [currentUser, setCurrentUser] = useState(null);
  const [isAuthLoading, setIsAuthLoading] = useState(() => Boolean(getToken()));

  useEffect(() => {
    if (!hasStoredToken) {
      return;
    }

    apiFetch('/api/auth/me', { auth: true })
      .then((data) => setCurrentUser(data.user))
      .catch(() => {
        setToken('');
        setHasStoredToken(false);
      })
      .finally(() => setIsAuthLoading(false));
  }, [hasStoredToken]);

  const signUp = async ({ name, email, password }) => {
    const data = await apiFetch('/api/auth/signup', {
      method: 'POST',
      body: { name, email, password }
    });
    setToken(data.token);
    setHasStoredToken(true);
    setCurrentUser(data.user);
    return { ok: true };
  };

  const signIn = async ({ email, password }) => {
    const data = await apiFetch('/api/auth/signin', {
      method: 'POST',
      body: { email, password }
    });
    setToken(data.token);
    setHasStoredToken(true);
    setCurrentUser(data.user);
    return { ok: true };
  };

  const signOut = async () => {
    try {
      await apiFetch('/api/auth/signout', { method: 'POST', auth: true });
    } catch {
      // ignore
    }
    setToken('');
    setHasStoredToken(false);
    setCurrentUser(null);
  };

  return (
    <Router>
      <div className="app">
        <Navbar currentUser={currentUser} onSignOut={signOut} />
        <Routes>
          <Route path="/" element={<Home currentUser={currentUser} />} />
          <Route path="/about" element={<About />} />
          <Route path="/cart" element={<Cart />} />
          <Route
            path="/checkout"
            element={
              <Checkout
                currentUser={currentUser}
                isAuthLoading={isAuthLoading}
              />
            }
          />
          <Route path="/collections" element={<Collections />} />
          <Route path="/commission" element={<Commission />} />
          <Route path="/consult" element={<Consult />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/heritage" element={<Heritage />} />
          <Route path="/shop" element={<Shop currentUser={currentUser} />} />
          <Route path="/admin" element={<AdminDashboard currentUser={currentUser} />} />
          <Route path="/admin/products/new" element={<AdminAddProduct currentUser={currentUser} />} />
          <Route path="/admin/products/:id/edit" element={<AdminEditProduct currentUser={currentUser} />} />
          <Route path="/admin/orders" element={<AdminOrders currentUser={currentUser} />} />
          <Route
            path="/signin"
            element={
              currentUser ? <Navigate to="/" replace /> : <SignIn signIn={signIn} />
            }
          />
          <Route
            path="/signup"
            element={
              currentUser ? <Navigate to="/" replace /> : <SignUp signUp={signUp} />
            }
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
