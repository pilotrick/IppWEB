
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Loader2, Sparkles, ShieldCheck, MapPin, Package, Building2, ChevronRight, CheckCircle2, Key } from 'lucide-react';
import { generateHighQualityHero } from '../services/geminiService';

declare global {
  // Extending the existing AIStudio interface to avoid conflicts with global declarations
  // and satisfy the requirement that aistudio property on Window must be of type AIStudio.
  interface AIStudio {
    hasSelectedApiKey: () => Promise<boolean>;
    openSelectKey: () => Promise<void>;
  }
}

const Hero: React.FC = () => {
  const [heroImage, setHeroImage] = useState<string | null>(null);
  const [isLoadingImage, setIsLoadingImage] = useState(true);
  const [scrollY, setScrollY] = useState(0);
  const [hasUserKey, setHasUserKey] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const checkKey = async () => {
      // Use type casting to ensure the compiler doesn't complain about the global property
      // while we rely on the environment-provided aistudio object.
      const aistudio = (window as any).aistudio;
      if (aistudio) {
        const selected = await aistudio.hasSelectedApiKey();
        setHasUserKey(selected);
      }
    };
    checkKey();
  }, []);

  const handleSelectKey = async () => {
    const aistudio = (window as any).aistudio;
    if (aistudio) {
      await aistudio.openSelectKey();
      // Assume success as per Gemini API guidelines for Veo key selection
      setHasUserKey(true);
      loadHeroImage(); // Retry loading with new key
    }
  };

  const loadHeroImage = async () => {
    setIsLoadingImage(true);
    try {
      const image = await generateHighQualityHero();
      if (image) setHeroImage(image);
    } catch (error) {
      console.error("Failed to load hero image", error);
    } finally {
      setIsLoadingImage(false);
    }
  };

  useEffect(() => {
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

  const scrollToCatalog = () => {
    const el = document.getElementById('catalog-anchor');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
    else navigate('/catalog');
  };

  return (
    <div className="relative min-h-[90vh] lg:min-h-screen flex items-center bg-white overflow-hidden">
      {/* Background Tech Mesh */}
      <div className="absolute inset-0 z-0">
        <div 
          className="absolute top-0 right-0 w-2/3 h-full bg-gray-50/50 -skew-x-12 translate-x-1/4 transition-transform duration-300 ease-out will-change-transform"
          style={{ transform: `translateX(25%) translateY(${scrollY * 0.05}px) skewX(-12deg)` }}
        ></div>
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'radial-gradient(#003B5C 0.5px, transparent 0.5px)', backgroundSize: '24px 24px' }}></div>
        <div className="absolute top-[20%] left-[10%] w-[500px] h-[500px] bg-ipp-cyan/5 rounded-full blur-[120px] animate-pulse"></div>
        <div className="absolute bottom-[10%] right-[10%] w-[400px] h-[400px] bg-ipp-green/5 rounded-full blur-[100px]"></div>
      </div>

      <div className="container mx-auto px-4 lg:px-8 relative z-10 py-20 lg:py-0">
        <div className="flex flex-col lg:flex-row items-center gap-16 lg:gap-24">
          
          {/* Left: Strategic Message */}
          <div 
            className="lg:w-3/5 text-center lg:text-left transition-all duration-300 ease-out will-change-transform"
            style={{ transform: `translateY(${scrollY * 0.08}px)`, opacity: Math.max(0, 1 - scrollY / 900) }}
          >
            <div className="inline-flex items-center space-x-2 mb-8 bg-ipp-navy text-white px-5 py-2.5 rounded-full shadow-2xl animate-fade-in-up">
              <Building2 size={16} className="text-ipp-green" />
              <span className="text-[10px] font-black uppercase tracking-[0.3em]">Dominican Supply Chain Leader</span>
            </div>
            
            <h1 className="text-6xl sm:text-7xl lg:text-[100px] font-black text-ipp-navy leading-[0.85] tracking-tighter mb-10 font-display italic">
              LOGÍSTICA<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-ipp-cyan to-ipp-green">INTEGRAL</span>
            </h1>
            
            <p className="text-xl text-gray-400 mb-12 max-w-2xl leading-relaxed font-medium mx-auto lg:mx-0 border-l-4 border-ipp-green pl-6">
              Simplificamos la operación de <span className="text-ipp-navy font-bold">Hoteles y Restaurantes</span> con soluciones de empaque eco-amigables y una red de distribución "Just-In-Time" de clase mundial.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-6">
              <button 
                onClick={scrollToCatalog}
                className="group relative bg-ipp-navy text-white px-12 py-6 rounded-2xl font-black text-lg shadow-[0_20px_40px_-10px_rgba(0,59,92,0.4)] transition-all hover:scale-105 active:scale-95 flex items-center"
              >
                Acceso al Catálogo
                <ArrowRight className="ml-3 group-hover:translate-x-2 transition-transform" />
                <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 rounded-2xl transition-opacity"></div>
              </button>
              
              {!hasUserKey && (
                <button 
                  onClick={handleSelectKey}
                  className="group flex items-center text-[10px] font-black uppercase tracking-widest text-ipp-cyan hover:text-ipp-navy transition-colors bg-ipp-cyan/10 px-4 py-3 rounded-xl border border-ipp-cyan/20"
                >
                  <Key size={14} className="mr-2" />
                  Usar mi Pro Key (Sin Límites)
                </button>
              )}

              <div className="flex items-center space-x-4 px-6 py-4 bg-gray-50 rounded-2xl border border-gray-100">
                <div className="flex -space-x-3">
                  {[1,2,3].map(i => (
                    <img key={i} src={`https://i.pravatar.cc/100?img=${i+10}`} className="w-10 h-10 rounded-full border-2 border-white shadow-sm" alt="Client" />
                  ))}
                </div>
                <div className="text-left">
                  <div className="flex text-ipp-green"><Sparkles size={10} className="fill-current"/><Sparkles size={10} className="fill-current"/><Sparkles size={10} className="fill-current"/></div>
                  <p className="text-[10px] font-black text-ipp-navy uppercase">500+ Socios Activos</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right: Immersive Visual with Fluid Scaling */}
          <div className="lg:w-2/5 relative w-full aspect-square md:aspect-[4/3] lg:aspect-square">
            <div 
              className={`w-full h-full rounded-[4rem] overflow-hidden shadow-[0_50px_100px_-20px_rgba(0,59,92,0.3)] transition-all duration-1000 ease-out will-change-transform ${isLoadingImage ? 'scale-90 opacity-40 blur-lg' : 'scale-100 opacity-100 blur-0'}`}
              style={{ transform: `translateY(${scrollY * 0.04}px) rotate(${scrollY * 0.003}deg)` }}
            >
              {isLoadingImage ? (
                <div className="w-full h-full bg-gray-100 flex flex-col items-center justify-center p-12 text-center">
                  <div className="relative mb-6">
                    <Loader2 className="animate-spin text-ipp-cyan" size={56} strokeWidth={1.5} />
                    <Sparkles className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-ipp-green animate-pulse" size={24} />
                  </div>
                  <p className="text-xs font-black uppercase tracking-[0.4em] text-ipp-navy animate-pulse">IA Generando Visión B2B...</p>
                  <div className="mt-4 w-32 h-1 bg-gray-200 rounded-full overflow-hidden mx-auto">
                    <div className="h-full bg-ipp-cyan animate-[progress_2s_infinite] w-1/3"></div>
                  </div>
                </div>
              ) : (
                <img 
                  src={heroImage!} 
                  className="w-full h-full object-cover transition-transform duration-1000 ease-out hover:scale-105" 
                  alt="IPP Commercial B2B Scene" 
                />
              )}
              {/* Subtle Overlay */}
              {!isLoadingImage && <div className="absolute inset-0 bg-gradient-to-tr from-ipp-navy/20 to-transparent pointer-events-none"></div>}
            </div>

            {/* Premium Floatables with Parallax Bouncing */}
            {!isLoadingImage && (
              <>
                <div 
                  className="absolute -top-10 -right-10 z-20 transition-transform duration-500 ease-out will-change-transform"
                  style={{ transform: `translateY(${-scrollY * 0.12}px)` }}
                >
                  <div className="animate-float-slow bg-white/90 backdrop-blur-xl p-6 rounded-3xl shadow-2xl border border-white flex items-center space-x-4 hover:scale-105 transition-transform cursor-pointer">
                    <div className="bg-ipp-green p-3 rounded-2xl text-white shadow-lg"><ShieldCheck size={24}/></div>
                    <div>
                      <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Garantía</p>
                      <p className="text-lg font-black text-ipp-navy leading-none">Certificado Bio</p>
                    </div>
                  </div>
                </div>
                
                <div 
                  className="absolute -bottom-6 -left-10 z-20 transition-transform duration-500 ease-out will-change-transform"
                  style={{ transform: `translateY(${-scrollY * 0.08}px)` }}
                >
                  <div className="animate-float-medium bg-ipp-navy/95 backdrop-blur-xl p-6 rounded-3xl shadow-2xl border border-white/10 flex items-center space-x-4 text-white hover:scale-105 transition-transform cursor-pointer">
                    <div className="bg-ipp-cyan p-3 rounded-2xl shadow-lg"><MapPin size={24}/></div>
                    <div>
                      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Presencia</p>
                      <p className="text-lg font-black italic leading-none">Todo el Caribe</p>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Bottom Glass Bar: Trust Indicators */}
        <div 
          className="mt-24 lg:mt-32 w-full bg-white/40 backdrop-blur-md border border-white/20 rounded-3xl p-8 lg:p-12 shadow-xl flex flex-col lg:flex-row items-center justify-between gap-12 transition-transform duration-500 ease-out will-change-transform"
          style={{ transform: `translateY(${scrollY * 0.02}px)` }}
        >
            {[
              { icon: CheckCircle2, label: "Tasa de Entrega", value: "99.8%", color: "text-ipp-green" },
              { icon: Package, label: "SKUs Activos", value: "2,500+", color: "text-ipp-cyan" },
              { icon: Building2, label: "Centros Distribución", value: "Santo Domingo / PC", color: "text-ipp-navy" }
            ].map((stat, i) => (
              <div key={i} className="flex items-center space-x-4 w-full lg:w-auto group">
                <div className={`${stat.color} p-4 bg-white/60 rounded-2xl shadow-sm group-hover:scale-110 transition-transform duration-500`}><stat.icon size={32}/></div>
                <div>
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{stat.label}</p>
                  <p className="text-2xl font-black text-ipp-navy font-display italic">{stat.value}</p>
                </div>
              </div>
            ))}
        </div>
      </div>

      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0) rotate(0); }
          50% { transform: translateY(-15px) rotate(1.5deg); }
        }
        @keyframes float-alt {
          0%, 100% { transform: translateY(0) rotate(0); }
          50% { transform: translateY(-25px) rotate(-1deg); }
        }
        @keyframes progress {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(300%); }
        }
        .animate-float-slow { animation: float 8s ease-in-out infinite; }
        .animate-float-medium { animation: float-alt 6s ease-in-out infinite; }
        .font-display { font-family: 'Montserrat', sans-serif; }
      `}</style>
      <div id="catalog-anchor" className="absolute bottom-0"></div>
    </div>
  );
};

export default Hero;
