
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Hero from './Hero';
import { ArrowRight, Box, BarChart3, Clock, Shield, Zap, Lightbulb, CheckCircle, Heart, Users, MapPin, ChevronRight, Sparkles, Building2, Layers, TrendingUp, Mail } from 'lucide-react';
import { Product } from '../types';

interface HomeProps {
  onAddToCart: (product: Product, quantity?: number) => void;
}

const Home: React.FC<HomeProps> = ({ onAddToCart }) => {
  const navigate = useNavigate();
  const [activeLocation, setActiveLocation] = useState<'sd' | 'pc'>('sd');

  const maps = {
    sd: "https://maps.google.com/maps?q=18.4968555,-69.8070159&z=15&output=embed",
    pc: "https://maps.google.com/maps?q=18.6044776,-68.4185074&z=15&output=embed"
  };

  return (
    <div className="font-sans bg-white">
      <Hero />
      
      {/* Infinite Marquee - Corporate Style */}
      <div className="bg-ipp-navy overflow-hidden py-4 whitespace-nowrap relative z-20 border-b border-white/10">
        <div className="inline-block animate-marquee">
          {[...Array(10)].map((_, i) => (
             <span key={i} className="mx-12 text-white/80 font-bold tracking-[0.3em] text-[10px] uppercase flex items-center inline-flex">
               <Shield size={12} className="mr-2 text-ipp-cyan" /> Integridad 
               <span className="mx-8 text-white/10">/</span> 
               <Zap size={12} className="mr-2 text-ipp-cyan" /> Eficiencia 
               <span className="mx-8 text-white/10">/</span> 
               <Lightbulb size={12} className="mr-2 text-ipp-cyan" /> Innovación
             </span>
          ))}
        </div>
      </div>

      <style>{`
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-marquee {
          display: inline-block;
          animation: marquee 60s linear infinite;
        }
        .text-glow-cyan { text-shadow: 0 0 20px rgba(41, 182, 216, 0.4); }
        .bg-glass { background: rgba(255, 255, 255, 0.7); backdrop-filter: blur(20px); }
      `}</style>

      {/* External Purchasing Department Section - REDESIGNED */}
      <section className="py-32 bg-white relative overflow-hidden">
         {/* Decorative Background Elements */}
         <div className="absolute -top-24 -left-24 w-96 h-96 bg-ipp-cyan/5 rounded-full blur-[120px]"></div>
         <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[30vw] font-black text-gray-50 opacity-[0.03] select-none pointer-events-none font-display">
           IPP
         </div>

         <div className="container mx-auto px-4 relative z-10">
            <div className="flex flex-col lg:flex-row items-center justify-between mb-24 max-w-7xl mx-auto">
               <div className="lg:w-1/2 animate-fade-in-up">
                 <div className="flex items-center space-x-3 mb-6">
                    <div className="h-1 w-12 bg-ipp-green rounded-full"></div>
                    <span className="text-ipp-cyan font-black uppercase tracking-[0.4em] text-[11px]">B2B Business Model</span>
                 </div>
                 <h2 className="text-5xl lg:text-7xl font-black text-ipp-navy font-display leading-[0.9] tracking-tighter mb-8 italic">
                   SU DEPARTAMENTO <br/>
                   <span className="text-transparent bg-clip-text bg-gradient-to-r from-ipp-navy to-ipp-cyan">DE COMPRAS</span> <br/>
                   EXTERNO
                 </h2>
                 <p className="text-gray-400 text-lg leading-relaxed max-w-xl font-medium border-l-4 border-ipp-green pl-6">
                    Transformamos el costo fijo de su departamento de compras en un servicio variable de alta eficiencia, gestionando el ciclo completo de suministro.
                 </p>
               </div>
               
               <div className="lg:w-1/3 mt-12 lg:mt-0 flex flex-col items-center lg:items-end">
                  <div className="bg-ipp-navy p-8 rounded-[2.5rem] shadow-2xl relative group overflow-hidden max-w-xs transition-transform hover:-rotate-2">
                     <div className="absolute inset-0 bg-gradient-to-br from-ipp-cyan/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                     <TrendingUp className="text-ipp-cyan mb-4" size={32} />
                     <h4 className="text-white font-black text-xl mb-2 font-display">KPI Driven</h4>
                     <p className="text-gray-400 text-sm leading-relaxed">
                        Nuestra gestión se mide por su ahorro operativo y la continuidad de su stock.
                     </p>
                  </div>
               </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-7xl mx-auto">
               {/* Card 1: Storage */}
               <div className="relative group perspective-1000">
                  <div className="bg-white p-10 rounded-[3rem] border border-gray-100 shadow-xl transition-all duration-500 hover:shadow-[0_40px_80px_-20px_rgba(0,59,92,0.15)] hover:-translate-y-4 flex flex-col h-full bg-glass">
                    <div className="absolute top-0 right-0 p-8 text-gray-50 font-black text-6xl group-hover:text-ipp-navy/5 transition-colors">01</div>
                    <div className="w-16 h-16 bg-ipp-navy text-white rounded-2xl flex items-center justify-center mb-8 shadow-lg shadow-ipp-navy/20 transform -rotate-3 group-hover:rotate-0 transition-transform">
                       <Box size={32} />
                    </div>
                    <h3 className="text-2xl font-black text-ipp-navy mb-4 font-display uppercase tracking-tight">Almacenaje<br/>Dedicado</h3>
                    <p className="text-gray-500 leading-relaxed font-medium">
                      Elimine el costo de metro cuadrado. Mantenemos su stock garantizado en nuestros almacenes estratégicos, listo para despacho inmediato.
                    </p>
                    <div className="mt-8 pt-6 border-t border-gray-100 flex items-center text-ipp-cyan font-black text-[10px] uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity">
                      Optimización de Espacio <ArrowRight size={14} className="ml-2"/>
                    </div>
                  </div>
               </div>
               
               {/* Card 2: Logistics */}
               <div className="relative group lg:-translate-y-12">
                  <div className="bg-ipp-navy p-10 rounded-[3rem] shadow-2xl transition-all duration-500 hover:shadow-[0_40px_80px_-20px_rgba(41,182,216,0.3)] hover:-translate-y-4 flex flex-col h-full relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-ipp-cyan/10 to-transparent"></div>
                    <div className="absolute top-0 right-0 p-8 text-white/5 font-black text-6xl">02</div>
                    <div className="w-16 h-16 bg-ipp-green text-white rounded-2xl flex items-center justify-center mb-8 shadow-lg shadow-ipp-green/20 transform rotate-3 group-hover:rotate-0 transition-transform relative z-10">
                       <Clock size={32} />
                    </div>
                    <h3 className="text-2xl font-black text-white mb-4 font-display uppercase tracking-tight relative z-10">Logística<br/>Just-In-Time</h3>
                    <p className="text-gray-400 leading-relaxed font-medium relative z-10">
                      Entregas programadas basadas en su data de consumo real. Su operación nunca se detiene gracias a nuestra flota propia de alta disponibilidad.
                    </p>
                    <div className="mt-8 pt-6 border-t border-white/10 flex items-center text-ipp-green font-black text-[10px] uppercase tracking-widest relative z-10">
                      Continuidad Operativa <ArrowRight size={14} className="ml-2"/>
                    </div>
                  </div>
               </div>

               {/* Card 3: Cost Intelligence */}
               <div className="relative group">
                  <div className="bg-white p-10 rounded-[3rem] border border-gray-100 shadow-xl transition-all duration-500 hover:shadow-[0_40px_80px_-20px_rgba(140,198,63,0.15)] hover:-translate-y-4 flex flex-col h-full bg-glass">
                    <div className="absolute top-0 right-0 p-8 text-gray-50 font-black text-6xl group-hover:text-ipp-green/5 transition-colors">03</div>
                    <div className="w-16 h-16 bg-ipp-cyan text-white rounded-2xl flex items-center justify-center mb-8 shadow-lg shadow-ipp-cyan/20 transform -rotate-2 group-hover:rotate-0 transition-transform">
                       <BarChart3 size={32} />
                    </div>
                    <h3 className="text-2xl font-black text-ipp-navy mb-4 font-display uppercase tracking-tight">Inteligencia<br/>De Costos</h3>
                    <p className="text-gray-500 leading-relaxed font-medium">
                      Analizamos sus patrones de compra para proponer eficiencias que maximicen su rentabilidad y reduzcan el desperdicio operativo.
                    </p>
                    <div className="mt-8 pt-6 border-t border-gray-100 flex items-center text-ipp-navy font-black text-[10px] uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity">
                      Maximización de ROI <ArrowRight size={14} className="ml-2"/>
                    </div>
                  </div>
               </div>
            </div>
         </div>
      </section>

      {/* Network Visualization - REDESIGNED TO COMMAND CENTER STYLE */}
      <section className="py-32 bg-gray-50 overflow-hidden relative border-y border-gray-100">
         <div className="absolute inset-0 opacity-[0.02] pointer-events-none" style={{ backgroundImage: 'radial-gradient(#003B5C 1px, transparent 1px)', backgroundSize: '40px 40px' }}></div>
         
         <div className="container mx-auto px-4 relative z-10">
            <div className="flex flex-col lg:flex-row items-center gap-20">
               <div className="lg:w-1/2">
                  <div className="inline-flex items-center bg-ipp-navy/5 text-ipp-navy px-4 py-2 rounded-xl mb-6 font-black text-[10px] uppercase tracking-[0.3em] border border-ipp-navy/10">
                     <MapPin size={14} className="mr-2 text-ipp-cyan" />
                     Network Coverage
                  </div>
                  <h2 className="text-5xl lg:text-7xl font-black mb-8 font-display leading-[0.9] text-ipp-navy italic">
                    DOMINIO <br/>
                    <span className="text-ipp-green">LOGÍSTICO</span>
                  </h2>
                  <p className="text-gray-500 text-lg leading-relaxed mb-12 max-w-lg font-medium">
                    Nuestra infraestructura no es solo almacenes, es una red interconectada diseñada para la velocidad. Cobertura total desde el centro metropolitano hasta el epicentro turístico del Este.
                  </p>
                  
                  <div className="space-y-4">
                    {[
                      { id: 'sd', name: 'Santo Domingo', type: 'HUB Central & Admin', color: 'ipp-cyan', glow: 'rgba(41, 182, 216, 0.4)' },
                      { id: 'pc', name: 'Punta Cana', type: 'Hub Logístico Este', color: 'ipp-green', glow: 'rgba(140, 198, 63, 0.4)' }
                    ].map(loc => (
                      <div 
                        key={loc.id}
                        onClick={() => setActiveLocation(loc.id as any)}
                        className={`group relative p-6 rounded-[2rem] border-2 cursor-pointer transition-all duration-500 ${activeLocation === loc.id ? `bg-white border-${loc.color} shadow-[0_20px_40px_-10px_${loc.glow}]` : 'bg-transparent border-transparent grayscale hover:grayscale-0 hover:bg-white/50 hover:border-gray-200'}`}
                      >
                         <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-5">
                               <div className={`w-14 h-14 rounded-2xl bg-${loc.color} text-white flex items-center justify-center shadow-lg transition-transform group-hover:scale-110`}>
                                  <Building2 size={24} />
                               </div>
                               <div>
                                  <h4 className={`text-xl font-black font-display uppercase tracking-tight ${activeLocation === loc.id ? 'text-ipp-navy' : 'text-gray-400'}`}>{loc.name}</h4>
                                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-1">{loc.type}</p>
                               </div>
                            </div>
                            <ChevronRight className={`${activeLocation === loc.id ? `text-${loc.color}` : 'text-gray-300'} group-hover:translate-x-1 transition-transform`} />
                         </div>
                      </div>
                    ))}
                  </div>

                  <div className="mt-12 flex items-center space-x-10">
                     <div>
                        <span className="block text-4xl font-black text-ipp-navy font-display leading-none mb-1">24h</span>
                        <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">SLA de Entrega</span>
                     </div>
                     <div className="h-10 w-[2px] bg-gray-200"></div>
                     <div>
                        <span className="block text-4xl font-black text-ipp-navy font-display leading-none mb-1">100%</span>
                        <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Trazabilidad</span>
                     </div>
                  </div>
               </div>
               
               {/* Command Center Visualization */}
               <div className="lg:w-1/2 w-full relative group">
                  <div className="absolute -inset-10 bg-gradient-to-tr from-ipp-navy/5 to-ipp-cyan/5 rounded-full blur-[100px] pointer-events-none"></div>
                  
                  <div className="relative bg-white p-6 rounded-[4rem] shadow-2xl border-8 border-gray-100/50 overflow-hidden transform group-hover:scale-[1.02] transition-transform duration-700">
                     <div className="h-[600px] w-full rounded-[3rem] overflow-hidden relative bg-gray-900">
                        <iframe 
                          key={activeLocation}
                          src={activeLocation === 'sd' ? maps.sd : maps.pc}
                          width="100%" 
                          height="100%" 
                          style={{ border: 0 }} 
                          allowFullScreen={true} 
                          loading="lazy" 
                          referrerPolicy="no-referrer-when-downgrade"
                          className="w-full h-full opacity-80 mix-blend-screen transition-all duration-1000 grayscale hover:grayscale-0"
                          title="Cobertura Nacional IPP"
                        ></iframe>
                        
                        {/* HUD Overlay */}
                        <div className="absolute inset-0 pointer-events-none border-[20px] border-black/20"></div>
                        <div className="absolute top-8 left-8 right-8 flex justify-between items-start pointer-events-none">
                           <div className="bg-black/60 backdrop-blur-md px-4 py-2 rounded-lg border border-white/10 flex items-center space-x-3">
                              <div className={`w-2 h-2 rounded-full animate-pulse ${activeLocation === 'sd' ? 'bg-ipp-cyan' : 'bg-ipp-green'}`}></div>
                              <span className="text-[10px] font-black text-white uppercase tracking-widest">
                                Signal Active: {activeLocation === 'sd' ? 'SD Central' : 'PC Hub'}
                              </span>
                           </div>
                           <div className="bg-ipp-navy/90 backdrop-blur-md px-4 py-2 rounded-lg border border-white/10">
                              <span className="text-[10px] font-black text-ipp-cyan uppercase tracking-widest">Live Inventory Sync</span>
                           </div>
                        </div>

                        {/* Scanline Effect */}
                        <div className="absolute inset-0 bg-scanline pointer-events-none opacity-20"></div>
                     </div>
                  </div>

                  {/* Floating Metric Badge */}
                  <div className="absolute -bottom-10 -right-10 bg-white p-8 rounded-[3rem] shadow-2xl border border-gray-100 flex items-center space-x-4 animate-float-medium">
                     <div className="p-4 bg-ipp-navy text-white rounded-2xl shadow-lg">
                        <Layers size={24} />
                     </div>
                     <div>
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Efficiency Rating</p>
                        <p className="text-3xl font-black text-ipp-navy font-display italic">Tier-1</p>
                     </div>
                  </div>
               </div>
            </div>
         </div>
      </section>

      {/* CORPORATE IDENTITY SECTION - DARK THEME REDESIGN */}
      <section className="py-32 bg-ipp-navy text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-white/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-ipp-cyan/10 rounded-full blur-[100px] translate-y-1/3 -translate-x-1/4 pointer-events-none"></div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="flex flex-col lg:flex-row gap-20">
            {/* "Who We Are" Column */}
            <div className="lg:w-2/5">
              <div className="sticky top-32">
                <div className="flex items-center space-x-3 mb-8">
                  <div className="h-1 w-12 bg-ipp-green rounded-full"></div>
                  <span className="text-ipp-green font-black uppercase tracking-[0.4em] text-[10px]">Corporate Values</span>
                </div>
                <h2 className="text-6xl lg:text-8xl font-black font-display leading-[0.8] mb-10 tracking-tighter">
                  ADN <br/> 
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-ipp-cyan to-white">CORPORATIVO</span>
                </h2>
                <p className="text-gray-300 text-xl leading-relaxed mb-12 border-l-4 border-ipp-cyan pl-8 max-w-md italic font-medium">
                  No somos solo suministros; somos el socio estratégico que garantiza la operación silenciosa y perfecta de su negocio.
                </p>
                <button 
                  onClick={() => navigate('/contact')} 
                  className="group relative bg-white text-ipp-navy px-10 py-5 rounded-2xl font-black text-sm uppercase tracking-widest shadow-2xl transition-all hover:scale-105 active:scale-95"
                >
                  Conoce nuestra historia
                  <ArrowRight className="ml-3 inline-block group-hover:translate-x-2 transition-transform" />
                </button>
              </div>
            </div>

            {/* Values Grid Column */}
            <div className="lg:w-3/5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[
                  { title: "Integridad", desc: "Transparencia radical en cada acuerdo comercial.", icon: Shield, color: "text-ipp-cyan" },
                  { title: "Innovación", desc: "Soluciones disruptivas para la cadena de suministro.", icon: Lightbulb, color: "text-ipp-green" },
                  { title: "Agilidad", desc: "Tiempos de respuesta líderes en el mercado caribeño.", icon: Zap, color: "text-amber-400" }, 
                  { title: "Excelencia", desc: "Calidad innegociable en cada SKU entregado.", icon: CheckCircle, color: "text-ipp-cyan" }, 
                  { title: "Compromiso", desc: "Su crecimiento es el indicador de nuestro éxito.", icon: Users, color: "text-ipp-green" },
                  { title: "Pasión", desc: "Servir a la industria HORECA es nuestra vocación.", icon: Heart, color: "text-red-400" }
                ].map((val, idx) => (
                  <div key={idx} className="bg-white/5 backdrop-blur-xl border border-white/10 p-10 rounded-[2.5rem] hover:bg-white/10 transition-all duration-500 group hover:-translate-y-2 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-white/5 to-transparent rounded-bl-[4rem]"></div>
                    <val.icon className={`w-12 h-12 ${val.color} mb-8 transition-transform group-hover:scale-110`} strokeWidth={1.5} />
                    <h3 className="text-2xl font-black mb-4 font-display uppercase tracking-tight">{val.title}</h3>
                    <p className="text-gray-400 leading-relaxed font-medium group-hover:text-gray-200 transition-colors">{val.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* IMMERSIVE ABOUT US SECTION */}
      <section className="py-32 bg-white">
        <div className="container mx-auto px-4">
          <div className="relative rounded-[4rem] overflow-hidden bg-gray-900 shadow-[0_50px_100px_-20px_rgba(0,0,0,0.4)]">
            <div className="absolute inset-0">
               <img 
                 src="https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=2301&auto=format&fit=crop" 
                 alt="Corporate Office" 
                 className="w-full h-full object-cover opacity-30 mix-blend-overlay"
               />
               <div className="absolute inset-0 bg-gradient-to-r from-ipp-navy via-ipp-navy/90 to-transparent"></div>
            </div>
            
            <div className="relative z-10 p-16 md:p-24 lg:p-32 flex flex-col md:flex-row items-center gap-20">
               <div className="md:w-1/2">
                  <span className="text-ipp-green font-black uppercase tracking-[0.4em] text-[10px] mb-6 block">Visionary Quote</span>
                  <h2 className="text-4xl md:text-6xl font-black text-white font-display mb-10 leading-[0.9] tracking-tighter italic">
                    "EMPIEZA DONDE ESTÁS, <br/>
                    USA LO QUE TIENES, <br/>
                    <span className="text-ipp-cyan">HAZ LO MEJOR</span> <br/>
                    QUE PUEDAS."
                  </h2>
                  <div className="flex items-center space-x-4">
                     <div className="h-px w-12 bg-gray-600"></div>
                     <p className="text-ipp-cyan font-black uppercase tracking-widest text-xs">- Arthur Ashe</p>
                  </div>
               </div>
               <div className="md:w-1/2 text-gray-300 text-xl leading-relaxed space-y-8 font-medium">
                  <p>
                    Desde 1990, hemos trazado un camino de liderazgo en la República Dominicana. Lo que comenzó como una visión familiar, hoy es una potencia logística que conecta marcas de clase mundial con los negocios locales.
                  </p>
                  <p>
                    Nuestra fórmula es simple pero poderosa: combinamos la <strong className="text-white">calidez del servicio personalizado</strong> con la <strong className="text-white">precisión quirúrgica de la logística moderna</strong>.
                  </p>
                  
                  <div className="flex gap-16 pt-12 border-t border-white/10">
                     <div className="group">
                        <span className="block text-6xl font-black text-white font-display mb-2 group-hover:text-ipp-green transition-colors">25+</span>
                        <span className="text-[10px] text-gray-400 font-black uppercase tracking-widest">Años de Liderazgo</span>
                     </div>
                     <div className="group">
                        <span className="block text-6xl font-black text-white font-display mb-2 group-hover:text-ipp-cyan transition-colors">100%</span>
                        <span className="text-[10px] text-gray-400 font-black uppercase tracking-widest">Capital Dominicano</span>
                     </div>
                  </div>
               </div>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action - Contact */}
      <section className="py-32 bg-ipp-navy relative overflow-hidden text-center">
         <div className="absolute top-0 left-0 w-full h-full bg-ipp-cyan opacity-5 skew-y-6 transform origin-top-left"></div>
         <div className="container mx-auto px-4 relative z-10">
            <span className="text-ipp-green font-black uppercase tracking-[0.4em] text-[11px] mb-8 block">Start Your Optimization</span>
            <h2 className="text-5xl lg:text-7xl font-black text-white mb-10 font-display tracking-tighter leading-none">
               ¿LISTO PARA ESCALAR <br/> SU OPERACIÓN?
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto mb-16 text-xl font-medium leading-relaxed">
               Converse con nuestros especialistas en logística y descubra cómo podemos convertir su cadena de suministro en una ventaja competitiva real.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
              <button 
                onClick={() => navigate('/contact')}
                className="bg-ipp-green text-white font-black py-6 px-12 rounded-2xl shadow-2xl shadow-ipp-green/40 hover:bg-[#7ab332] transition-all transform hover:scale-105 active:scale-95 text-lg uppercase tracking-widest"
              >
                Habla con un Asesor
              </button>
              <button 
                onClick={() => navigate('/catalog')}
                className="bg-white/10 backdrop-blur-md text-white border border-white/20 font-black py-6 px-12 rounded-2xl hover:bg-white/20 transition-all text-lg uppercase tracking-widest"
              >
                Explorar Catálogo
              </button>
            </div>
            <div className="mt-16 flex items-center justify-center space-x-3 text-sm text-gray-500 font-bold uppercase tracking-widest">
               <Mail size={16} className="text-ipp-cyan" />
               <span>Escríbanos: <a href="mailto:info@ippdr.com" className="text-white hover:text-ipp-cyan transition-colors">info@ippdr.com</a></span>
            </div>
         </div>
      </section>

    </div>
  );
};

export default Home;
