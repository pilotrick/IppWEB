
import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom';
import Header from './components/Header';
import Home from './components/Home';
import ProductGrid from './components/ProductGrid';
import Contact from './components/Contact';
import Footer from './components/Footer';
import CartDrawer from './components/CartDrawer';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Product, CartItem } from './types';

// Protected Route Component
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
};

// Main App Layout Logic
const AppContent = () => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated } = useAuth();

  // Hide Header/Footer on Login page
  const isLoginPage = location.pathname === '/login';

  // Load cart from local storage
  useEffect(() => {
    const savedCart = localStorage.getItem('ipp-cart');
    if (savedCart) {
      try {
        setCartItems(JSON.parse(savedCart));
      } catch (e) {
        console.error("Failed to parse cart", e);
      }
    }
  }, []);

  // Save cart to local storage
  useEffect(() => {
    localStorage.setItem('ipp-cart', JSON.stringify(cartItems));
  }, [cartItems]);

  const addToCart = (product: Product, quantity?: number) => {
    const qtyToAdd = quantity || product.minOrder || 1;
    setCartItems(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item => 
          item.id === product.id ? { ...item, quantity: item.quantity + qtyToAdd } : item
        );
      }
      return [...prev, { ...product, quantity: qtyToAdd }];
    });
    setIsCartOpen(true);
  };

  const removeFromCart = (id: string) => {
    setCartItems(prev => prev.filter(item => item.id !== id));
  };

  const updateQuantity = (id: string, delta: number) => {
    setCartItems(prev => prev.map(item => {
      if (item.id === id) {
        const newQty = item.quantity + delta;
        return newQty > 0 ? { ...item, quantity: newQty } : item;
      }
      return item;
    }));
  };

  const handleCheckout = () => {
    if (cartItems.length === 0) return;

    const total = cartItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);
    
    const orderSummary = `SOLICITUD DE COTIZACIÓN (WEB ORDER):\n\n` + 
      cartItems.map(item => `- ${item.quantity.toLocaleString()}x ${item.name} (Ref: ${item.id})`).join('\n') +
      `\n\nTotal Estimado: $${total.toFixed(2)}`;

    setIsCartOpen(false);
    navigate('/contact', { state: { prefilledMessage: orderSummary, isOrder: true } });
  };

  return (
    <div className="min-h-screen bg-white flex flex-col font-sans text-slate-900">
      {!isLoginPage && (
        <Header 
          cartCount={cartItems.reduce((acc, item) => acc + item.quantity, 0)} 
          onOpenCart={() => setIsCartOpen(true)}
        />
      )}
      
      {isAuthenticated && (
        <CartDrawer 
          isOpen={isCartOpen} 
          onClose={() => setIsCartOpen(false)} 
          items={cartItems} 
          onRemove={removeFromCart}
          onUpdateQuantity={updateQuantity}
          onCheckout={handleCheckout}
        />
      )}

      <main className="flex-grow">
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<Home onAddToCart={addToCart} />} />
          
          <Route path="/dashboard" element={
            <ProtectedRoute>
              <Dashboard onAddToCart={addToCart} />
            </ProtectedRoute>
          } />

          <Route path="/catalog" element={
            <ProtectedRoute>
              <ProductGrid onAddToCart={addToCart} />
            </ProtectedRoute>
          } />
          
          <Route path="/contact" element={<Contact />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
      
      {!isLoginPage && <Footer />}
    </div>
  );
};

const App = () => {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
};

export default App;
