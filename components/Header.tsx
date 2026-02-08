
import React, { useState, useEffect } from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import { Menu, X, ShoppingCart, Search, MapPin, User, LogOut, Lock, MessageCircle, Sparkles, ChevronRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface HeaderProps {
  cartCount: number;
  onOpenCart: () => void;
}

const Header: React.FC<HeaderProps> = ({ cartCount, onOpenCart }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const { isAuthenticated, logout, userEmail } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => setIsMobileMenuOpen(false), [location]);

  const navItems = [
    { label: 'Inicio', path: '/' },
    { label: 'Contacto', path: '/contact' },
  ];

  if (isAuthenticated) {
    navItems.splice(1, 0, { label: 'Dashboard', path: '/dashboard' });
    navItems.splice(2, 0, { label: 'Catálogo', path: '/catalog' });
  }

  return (
    <>
      <div className="bg-ipp-navy text-white py-2.5 hidden lg:block border-b border-white/10 z-[60] relative">
        <div className="container mx-auto px-6 flex justify-between items-center text-[11px] font-bold tracking-wider uppercase">
          <div className="flex space-x-8">
            <div className="flex items-center text-gray-300"><MapPin size={12} className="mr-2 text-ipp-green" /><span>Santo Domingo & Punta Cana</span></div>
            <button onClick={() => navigate('/contact')} className="flex items-center text-gray-300 hover:text-ipp-cyan transition-colors"><MessageCircle size={12} className="mr-2 text-ipp-green" /><span>Mensajería Directa</span></button>
          </div>
          <div className="flex items-center space-x-6">
            {isAuthenticated ? <span className="flex items-center text-ipp-green"><User size={12} className="mr-2" />Bienvenido, {userEmail?.split('@')[0]}</span> : <span className="text-gray-400">Logística Integral en el Caribe</span>}
          </div>
        </div>
      </div>

      <header className={`fixed left-0 right-0 z-50 transition-all duration-500 ${isScrolled ? 'bg-white/95 backdrop-blur-xl shadow-lg py-3 top-0' : 'bg-white py-6 lg:top-[38px] border-b border-gray-100'}`}>
        <div className="container mx-auto px-4 lg:px-8">
          <div className="flex justify-between items-center">
            <div className="flex items-center cursor-pointer group" onClick={() => navigate('/')}>
              <div className="flex items-end mr-3 h-10 group-hover:scale-105 transition-transform">
                 <div className="w-3.5 h-[85%] bg-ipp-green transform -skew-x-12 rounded-[2px] mr-1"></div>
                 <div className="w-4 h-[95%] bg-ipp-cyan transform -skew-x-12 rounded-[2px] mr-1 mb-1"></div>
                 <div className="w-5 h-full bg-ipp-navy transform -skew-x-12 rounded-[2px]"></div>
              </div>
              <div className="flex flex-col">
                <h1 className="text-2xl lg:text-3xl font-black text-ipp-navy leading-none font-display">IPP</h1>
                <p className="text-[9px] uppercase tracking-widest text-gray-400 font-bold">Pack & Paper</p>
              </div>
            </div>

            <nav className="hidden lg:flex items-center p-1 rounded-full bg-gray-50/50 border border-gray-100">
              {navItems.map((item) => (
                <NavLink
                  key={item.path}
                  to={item.path}
                  className={({ isActive }) => `px-6 py-2.5 rounded-full text-xs font-bold transition-all relative ${isActive ? 'text-ipp-navy bg-white shadow-sm ring-1 ring-black/5' : 'text-gray-500 hover:text-ipp-navy'}`}
                >
                  <span className="relative z-10 flex items-center">
                    {item.label}
                  </span>
                </NavLink>
              ))}
            </nav>

            <div className="flex items-center space-x-2 lg:space-x-4">
              {isAuthenticated && (
                <button onClick={onOpenCart} className="relative p-3 text-gray-600 hover:bg-gray-100 rounded-full group">
                  <ShoppingCart size={22} className="group-hover:scale-110 transition-transform" />
                  {cartCount > 0 && <span className="absolute top-1 right-1 w-4 h-4 bg-ipp-green text-white text-[9px] font-bold flex items-center justify-center rounded-full shadow-sm ring-2 ring-white">{cartCount}</span>}
                </button>
              )}
              {isAuthenticated ? (
                <button onClick={() => { logout(); navigate('/'); }} className="hidden md:flex items-center text-gray-500 hover:text-red-500 font-bold text-xs px-4 py-2 rounded-full hover:bg-red-50 transition-all"><LogOut size={16} className="mr-2" />SALIR</button>
              ) : (
                <button onClick={() => navigate('/login')} className="hidden md:flex items-center bg-ipp-navy text-white pl-6 pr-5 py-3 rounded-full font-bold text-xs shadow-xl hover:bg-ipp-dark transition-all transform hover:-translate-y-1">
                  ACCESO CLIENTES <ChevronRight size={14} className="ml-2 text-ipp-cyan" />
                </button>
              )}
              <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="lg:hidden text-ipp-navy p-2 rounded-full hover:bg-gray-50"><Menu size={28} /></button>
            </div>
          </div>
        </div>
      </header>
      <div className={`${isScrolled ? 'h-[76px]' : 'h-[100px] lg:h-[130px]'}`}></div>
      {/* Mobile menu logic remains same */}
    </>
  );
};

export default Header;
