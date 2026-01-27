
import React, { useState, useEffect } from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import { Menu, X, ShoppingCart, Search, MapPin, Mail, ChevronRight, User, LogOut, Lock, MessageCircle, LayoutDashboard } from 'lucide-react';
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
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location]);

  // Base navigation items always visible
  const navItems = [
    { label: 'Inicio', path: '/' },
    { label: 'Contacto', path: '/contact' },
  ];

  // Items only for logged in users
  if (isAuthenticated) {
    navItems.splice(1, 0, { label: 'Dashboard', path: '/dashboard' });
    navItems.splice(2, 0, { label: 'Catálogo', path: '/catalog' });
  }

  return (
    <>
      {/* Top Bar - Refined */}
      <div className="bg-ipp-navy text-white py-2.5 hidden lg:block border-b border-white/10 z-[60] relative">
        <div className="container mx-auto px-6 flex justify-between items-center text-[11px] font-bold tracking-wider uppercase">
          <div className="flex space-x-8">
            <div className="flex items-center text-gray-300 hover:text-ipp-cyan transition-colors cursor-default">
              <MapPin size={12} className="mr-2 text-ipp-green" />
              <span>Santo Domingo & Punta Cana</span>
            </div>
            <button 
              onClick={() => navigate('/contact')}
              className="flex items-center text-gray-300 hover:text-ipp-cyan transition-colors focus:outline-none group"
            >
              <MessageCircle size={12} className="mr-2 text-ipp-green group-hover:scale-110 transition-transform" />
              <span>Mensajería Directa</span>
            </button>
          </div>
          <div className="flex items-center space-x-6">
            {isAuthenticated ? (
               <span className="flex items-center text-ipp-green">
                 <User size={12} className="mr-2" />
                 Bienvenido, {userEmail?.split('@')[0]}
               </span>
            ) : (
               <span className="text-gray-400">Logística Integral en el Caribe</span>
            )}
            <span className="text-ipp-cyan opacity-50">|</span>
            <span className="text-white">Operador Logístico & Suministros</span>
          </div>
        </div>
      </div>

      <header 
        className={`fixed left-0 right-0 z-50 transition-all duration-500 ease-in-out ${
          isScrolled 
            ? 'bg-white/90 backdrop-blur-xl shadow-lg shadow-ipp-navy/5 py-3 top-0' 
            : 'bg-white py-6 lg:top-[38px] border-b border-gray-100'
        }`}
      >
        <div className="container mx-auto px-4 lg:px-8">
          <div className="flex justify-between items-center">
            
            {/* Logo Section */}
            <div 
              className={`flex items-center cursor-pointer group select-none transition-all duration-500 origin-left ${isScrolled ? 'scale-90 opacity-90' : 'scale-100 opacity-100'}`} 
              onClick={() => navigate('/')}
            >
              <div className="flex items-end mr-3 h-10 transition-transform duration-300 group-hover:scale-105">
                 <div className="w-3.5 h-[85%] bg-ipp-green transform -skew-x-12 rounded-[2px] mr-1 shadow-sm"></div>
                 <div className="w-4 h-[95%] bg-ipp-cyan transform -skew-x-12 rounded-[2px] mr-1 mb-1 shadow-sm"></div>
                 <div className="w-5 h-full bg-ipp-navy transform -skew-x-12 rounded-[2px] shadow-sm"></div>
                 <div className="w-5 h-full bg-ipp-navy transform -skew-x-12 rounded-[2px] ml-1 shadow-sm"></div>
              </div>
              <div className="flex flex-col justify-center">
                <h1 className="text-2xl lg:text-3xl font-black text-ipp-navy leading-none tracking-tighter font-display">IPP</h1>
                <p className="text-[9px] uppercase tracking-[0.2em] text-gray-400 font-bold mt-0.5 group-hover:text-ipp-cyan transition-colors">Pack & Paper</p>
              </div>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center p-1 rounded-full bg-gray-50/50 border border-gray-100 shadow-inner">
              {navItems.map((item) => (
                <NavLink
                  key={item.path}
                  to={item.path}
                  className={({ isActive }) => 
                    `px-6 py-2.5 rounded-full text-xs font-bold transition-all duration-300 relative overflow-hidden group ${
                      isActive 
                        ? 'text-ipp-navy bg-white shadow-md shadow-gray-200 ring-1 ring-black/5' 
                        : 'text-gray-500 hover:text-ipp-navy hover:bg-ipp-cyan/5'
                    }`
                  }
                >
                  {({ isActive }) => (
                    <span className="relative z-10 flex items-center">
                      {isActive && <span className="w-1.5 h-1.5 rounded-full bg-ipp-green mr-2 animate-pulse"></span>}
                      {item.label}
                    </span>
                  )}
                </NavLink>
              ))}
            </nav>

            {/* Actions Area */}
            <div className="flex items-center space-x-2 lg:space-x-4">
              
              <button className="hidden xl:flex p-3 text-gray-400 hover:text-ipp-navy hover:bg-ipp-cyan/5 transition-all rounded-full">
                <Search size={20} />
              </button>

              {/* Cart Trigger (Only if Authenticated) */}
              {isAuthenticated && (
                <button 
                  onClick={onOpenCart}
                  className="relative p-3 text-gray-600 hover:text-ipp-navy transition-all hover:bg-ipp-cyan/5 rounded-full group"
                >
                  <ShoppingCart size={22} className="group-hover:scale-110 transition-transform duration-300" />
                  {cartCount > 0 && (
                    <span className="absolute top-1 right-1 w-4 h-4 bg-ipp-green text-white text-[9px] font-bold flex items-center justify-center rounded-full shadow-sm ring-2 ring-white animate-bounce-short">
                      {cartCount}
                    </span>
                  )}
                </button>
              )}

              {/* Login / Logout Button */}
              {isAuthenticated ? (
                <button 
                  onClick={() => { logout(); navigate('/'); }}
                  className="hidden md:flex items-center text-gray-500 hover:text-red-500 font-bold text-xs tracking-wide px-4 py-2 rounded-full hover:bg-red-50 transition-all border border-transparent hover:border-red-100"
                  title="Cerrar Sesión"
                >
                  <LogOut size={16} className="mr-2" />
                  <span className="hidden xl:inline">SALIR</span>
                </button>
              ) : (
                <button 
                  onClick={() => navigate('/login')}
                  className="hidden md:flex items-center bg-ipp-navy text-white pl-6 pr-5 py-3 rounded-full font-bold text-xs tracking-wide shadow-xl shadow-ipp-navy/30 transition-all duration-300 transform hover:-translate-y-1 hover:shadow-2xl hover:shadow-ipp-navy/40 hover:bg-ipp-dark group overflow-hidden relative"
                >
                  <span className="relative z-10 flex items-center">
                    <Lock size={14} className="mr-2 text-ipp-cyan" />
                    ACCESO CLIENTES
                  </span>
                  <div className="ml-2 w-6 h-6 bg-white/10 rounded-full flex items-center justify-center group-hover:bg-ipp-green group-hover:text-white transition-all duration-300 relative z-10">
                    <ChevronRight size={14} className="" />
                  </div>
                </button>
              )}

              {/* Mobile Menu Toggle */}
              <button 
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} 
                className="lg:hidden text-ipp-navy p-2 hover:bg-gray-50 rounded-full transition-colors focus:outline-none"
              >
                {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
              </button>
            </div>
          </div>
        </div>
      </header>
      
      {/* Spacer */}
      <div className={`transition-all duration-500 ${isScrolled ? 'h-[76px]' : 'h-[100px] lg:h-[130px]'}`}></div>

      {/* Mobile Menu Overlay */}
      <div 
        className={`fixed inset-0 bg-ipp-navy/60 backdrop-blur-sm z-40 lg:hidden transition-opacity duration-300 ${
          isMobileMenuOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={() => setIsMobileMenuOpen(false)}
      />

      {/* Mobile Menu Drawer */}
      <div 
        className={`fixed top-0 right-0 w-[85%] max-w-[320px] h-full bg-white z-50 shadow-2xl transform transition-transform duration-300 lg:hidden flex flex-col ${
          isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
          <div className="flex flex-col">
            <span className="font-black text-2xl text-ipp-navy font-display leading-none">IPP</span>
            <span className="text-[10px] uppercase tracking-widest text-gray-400">Pack & Paper</span>
          </div>
          <button onClick={() => setIsMobileMenuOpen(false)} className="text-gray-400 hover:text-ipp-navy bg-white p-2 rounded-full shadow-sm border border-gray-100">
            <X size={20} />
          </button>
        </div>
        
        <div className="flex-grow overflow-y-auto py-8 px-5 space-y-3">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              onClick={() => setIsMobileMenuOpen(false)}
              className={({ isActive }) => 
                `block px-5 py-4 rounded-xl font-bold text-base transition-all ${
                  isActive 
                    ? 'bg-ipp-navy text-white shadow-lg shadow-ipp-navy/20 translate-x-1' 
                    : 'text-gray-600 hover:bg-ipp-cyan/5 hover:text-ipp-navy'
                }`
              }
            >
              <div className="flex justify-between items-center">
                {item.label}
                <ChevronRight size={16} className="opacity-50" />
              </div>
            </NavLink>
          ))}
        </div>

        <div className="p-6 bg-gray-50 border-t border-gray-100">
            {isAuthenticated ? (
              <button
                onClick={() => { logout(); setIsMobileMenuOpen(false); navigate('/'); }}
                className="w-full bg-red-50 text-red-600 border border-red-100 font-bold py-4 rounded-xl flex items-center justify-center space-x-2 active:scale-95 transition-transform"
              >
                <LogOut size={18} />
                <span>Cerrar Sesión</span>
              </button>
            ) : (
              <button
                onClick={() => { setIsMobileMenuOpen(false); navigate('/login'); }}
                className="w-full bg-ipp-navy text-white font-bold py-4 rounded-xl shadow-lg shadow-ipp-navy/20 flex items-center justify-center space-x-2 active:scale-95 transition-transform"
              >
                <Lock size={18} className="text-ipp-cyan" />
                <span>Acceso Clientes</span>
              </button>
            )}
        </div>
      </div>
    </>
  );
};

export default Header;
