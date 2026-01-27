
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Loader2, Sparkles, Star, Package, ShieldCheck, MapPin } from 'lucide-react';
import { generateHeroImage } from '../services/geminiService';

const Hero: React.FC = () => {
  const [heroImage, setHeroImage] = useState<string | null>(null);
  const [isLoadingImage, setIsLoadingImage] = useState(true);
  const [scrollY, setScrollY] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const loadHeroImage = async () => {
      setIsLoadingImage(true);
      try {
        // Attempt to get a fresh, high-end AI image
        const image = await generateHeroImage();
        if (image) {
          setHeroImage(image);
        }
      } catch (error) {
        console.error("Failed to load AI hero image", error);
      } finally {
        setIsLoadingImage(false);
      }
    };
    
    loadHeroImage();
  }, []);

  useEffect(() => {
    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          setScrollY(window.scrollY);
          ticking = false;
        });
        ticking = true;
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="relative bg-white overflow-hidden">
      {/* Background Elements - Parallax */}
      <div 
        className="absolute top-0 right-0 w-1/2 h-full bg-gray-50 -skew-x-12 translate-x-20 z-0 transition-transform duration-100 ease-linear will-change-transform"
        style={{ transform: `translateX(5rem) translateY(${scrollY * 0.1}px) skewX(-12deg)` }}
      ></div>
      <div 
        className="absolute top-1/2 left-0 w-64 h-64 bg-ipp-cyan opacity-5 rounded-full blur-3xl z-0 transition-transform duration-300 ease-out will-change-transform"
        style={{ transform: `translateY(${-scrollY * 0.2}px)` }}
      ></div>
      
      <div className="container mx-auto px-4 lg:px-6 relative z-10 pt-10 pb-20">
        <div className="flex flex-col lg:flex-row items-center">
          
          {/* Left: Typography Impact */}
          <div 
            className="lg:w-1/2 relative z-20 mb-12 lg:mb-0 transition-all duration-300 ease-out will-change-transform"
            style={{ 
              transform: `translateY(${scrollY * 0.15}px)`,
              opacity: Math.max(0, 1 - scrollY / 500) 
            }}
          >
            <div className="inline-flex items-center space-x-2 mb-6 bg-ipp-navy text-white px-4 py-1.5 rounded-full shadow-lg shadow-ipp-navy/20 animate-fade-in-up">
              <Sparkles size={14} className="text-ipp-green" />
              <span className="text-[10px] font-bold uppercase tracking-widest">Operador Logístico & Suministros</span>
            </div>
            
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black text-ipp-navy leading-[1.1] tracking-tighter mb-8 font-display">
              SU ALIADO<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-ipp-cyan to-ipp-green">ESTRATÉGICO</span><br />
              EN EL CARIBE
            </h1>
            
            <p className="text-lg text-gray-500 mb-8 max-w-md leading-relaxed font-medium pl-2 border-l-4 border-ipp-green">
              Desde <b>Santo Domingo</b> y <b>Punta Cana</b>, gestionamos el inventario crítico para su hotel, clínica o restaurante. Somos su departamento de compras externo.
            </p>
            
            <div className="flex flex-wrap gap-4 pl-2">
              <button 
                onClick={() => navigate('/contact')}
                className="bg-ipp-navy text-white hover:bg-ipp-dark px-10 py-5 rounded-full font-bold text-lg shadow-xl shadow-ipp-navy/30 transition-all transform hover:scale-105 flex items-center group"
              >
                Hable con Nosotros
                <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
              </button>
              <button 
                onClick={() => navigate('/catalog')}
                className="bg-gray-100 text-ipp-navy hover:bg-white px-10 py-5 rounded-full font-bold text-lg border border-gray-200 transition-all transform hover:scale-105 flex items-center"
              >
                Ver Productos
              </button>
            </div>
          </div>

          {/* Right: Immersive Visuals */}
          <div className="lg:w-1/2 relative w-full h-[500px] lg:h-[700px]">
            {/* Main Hero Image Frame */}
            <div 
                className="absolute inset-0 lg:left-10 lg:right-0 bg-gray-200 rounded-3xl overflow-hidden shadow-2xl transition-transform duration-100 ease-linear origin-center will-change-transform"
                style={{ 
                  transform: `translateY(${scrollY * 0.05}px) scale(${1 + scrollY * 0.0001}) rotate(${2 - scrollY * 0.001}deg)` 
                }}
            >
               {isLoadingImage ? (
                  <div className="w-full h-full flex flex-col items-center justify-center bg-gray-100 text-gray-400">
                    <Loader2 className="w-16 h-16 text-ipp-cyan animate-spin mb-4" />
                    <p className="font-bold tracking-widest text-sm">RENDERIZANDO VISIÓN IA...</p>
                    <p className="text-xs text-gray-400 mt-2">Simulando fotografía de producto (Hora Dorada)</p>
                  </div>
               ) : (
                  <img 
                    src={heroImage || "https://images.unsplash.com/photo-1584473457406-6240486418e9?q=80&w=2070&auto=format&fit=crop"} 
                    alt="IPP Logistics Visualization" 
                    className="w-full h-full object-cover animate-fade-in-up"
                  />
               )}
               <div className="absolute inset-0 bg-gradient-to-t from-ipp-navy/40 to-transparent mix-blend-multiply pointer-events-none"></div>
            </div>

            {/* Floating Glass Cards - Parallax Effect Layers */}
            <div 
              className="absolute bottom-10 -left-4 lg:left-0 bg-white/90 backdrop-blur-md p-5 rounded-2xl shadow-xl border border-white max-w-[240px] animate-fade-in-up transition-transform duration-200 ease-out will-change-transform" 
              style={{ animationDelay: '0.2s', transform: `translateY(${-scrollY * 0.25}px)` }}
            >
               <div className="flex items-center space-x-3 mb-2">
                 <div className="bg-green-100 p-2 rounded-full text-green-600">
                   <ShieldCheck size={20} />
                 </div>
                 <span className="font-bold text-ipp-navy leading-none">Aliado<br/>Certificado</span>
               </div>
               <p className="text-xs text-gray-500">Optimizamos su flujo de caja mediante gestión de stock.</p>
            </div>

            <div 
              className="absolute top-20 -right-4 lg:right-10 bg-ipp-navy/90 backdrop-blur-md p-5 rounded-2xl shadow-xl border border-white/10 text-white max-w-[200px] animate-fade-in-up transition-transform duration-200 ease-out will-change-transform" 
              style={{ animationDelay: '0.4s', transform: `translateY(${scrollY * 0.2}px)` }}
            >
               <div className="flex items-center justify-between mb-2">
                 <MapPin className="text-ipp-green" size={24} />
                 <span className="text-xs font-bold bg-white/10 px-2 py-1 rounded">DO</span>
               </div>
               <p className="text-xs text-gray-300 font-medium">Dos sedes estratégicas: Santo Domingo & Punta Cana.</p>
            </div>

             <div 
               className="absolute bottom-1/3 right-0 lg:-right-8 bg-white p-4 rounded-xl shadow-lg flex items-center space-x-3 animate-bounce-short transition-transform duration-200 ease-out will-change-transform"
               style={{ transform: `translateY(${-scrollY * 0.12}px)` }}
             >
                <div className="bg-ipp-cyan text-white p-2 rounded-lg">
                  <Package size={24} />
                </div>
                <div>
                  <p className="text-xs font-bold text-gray-400 uppercase">Logística</p>
                  <p className="text-ipp-navy font-bold">Just-in-Time</p>
                </div>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
