
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Hero from './Hero';
import { ArrowRight, Box, BarChart3, Clock, Shield, Zap, Lightbulb, CheckCircle, Heart, Users, MapPin, ChevronRight } from 'lucide-react';
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
      <div className="bg-ipp-navy overflow-hidden py-3 whitespace-nowrap relative z-20 border-b border-white/10">
        <div className="inline-block animate-marquee">
          {[...Array(10)].map((_, i) => (
             <span key={i} className="mx-12 text-white/80 font-medium tracking-widest text-xs uppercase flex items-center inline-flex">
               <Shield size={12} className="mr-2 text-ipp-cyan" /> Integridad 
               <span className="mx-6 text-white/20">|</span> 
               <Zap size={12} className="mr-2 text-ipp-cyan" /> Eficiencia 
               <span className="mx-6 text-white/20">|</span> 
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
      `}</style>

      {/* External Purchasing Department Section */}
      <section className="py-24 bg-white relative">
         <div className="container mx-auto px-4">
            <div className="flex flex-col md:flex-row items-end justify-between mb-16 max-w-6xl mx-auto border-b border-gray-100 pb-8">
               <div className="md:w-2/3">
                 <span className="text-ipp-cyan font-bold uppercase tracking-widest text-xs mb-3 block">Modelo de Negocio</span>
                 <h2 className="text-3xl md:text-5xl font-black text-ipp-navy font-display leading-tight">
                   Somos su Departamento <br/>de Compras Externo
                 </h2>
               </div>
               <div className="md:w-1/3 mt-6 md:mt-0">
                 <p className="text-gray-500 text-sm leading-relaxed text-right md:pl-8">
                    Optimizamos su cadena de suministro gestionando inventario, logística y entregas. Enfóquese en su operación, nosotros nos encargamos de los insumos.
                 </p>
               </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
               {/* Card 1 */}
               <div className="bg-white p-8 border-l-4 border-ipp-navy shadow-sm hover:shadow-xl transition-all duration-300 group">
                  <div className="w-12 h-12 bg-ipp-navy/5 rounded-lg flex items-center justify-center text-ipp-navy mb-6 group-hover:bg-ipp-navy group-hover:text-white transition-colors">
                     <Box size={24} />
                  </div>
                  <h3 className="text-lg font-bold text-ipp-navy mb-3 uppercase tracking-wide">Almacenaje Dedicado</h3>
                  <p className="text-gray-500 text-sm leading-relaxed">Stock garantizado en nuestras bodegas de Santo Domingo y Punta Cana, liberando su capital de trabajo.</p>
               </div>
               
               {/* Card 2 */}
               <div className="bg-white p-8 border-l-4 border-ipp-green shadow-sm hover:shadow-xl transition-all duration-300 group">
                  <div className="w-12 h-12 bg-ipp-green/10 rounded-lg flex items-center justify-center text-ipp-green mb-6 group-hover:bg-ipp-green group-hover:text-white transition-colors">
                     <Clock size={24} />
                  </div>
                  <h3 className="text-lg font-bold text-ipp-navy mb-3 uppercase tracking-wide">Logística Just-in-Time</h3>
                  <p className="text-gray-500 text-sm leading-relaxed">Entregas programadas según su consumo real. Flota propia para garantizar tiempos de respuesta inmediatos.</p>
               </div>

               {/* Card 3 */}
               <div className="bg-white p-8 border-l-4 border-ipp-cyan shadow-sm hover:shadow-xl transition-all duration-300 group">
                  <div className="w-12 h-12 bg-ipp-cyan/10 rounded-lg flex items-center justify-center text-ipp-cyan mb-6 group-hover:bg-ipp-cyan group-hover:text-white transition-colors">
                     <BarChart3 size={24} />
                  </div>
                  <h3 className="text-lg font-bold text-ipp-navy mb-3 uppercase tracking-wide">Inteligencia de Costos</h3>
                  <p className="text-gray-500 text-sm leading-relaxed">Análisis de consumo y propuestas de eficiencia para maximizar la rentabilidad de su presupuesto operativo.</p>
               </div>
            </div>
         </div>
      </section>

      {/* Network Visualization (Real Map) */}
      <section className="py-24 bg-gray-50 overflow-hidden relative">
         <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-5"></div>
         <div className="container mx-auto px-4 relative z-10 flex flex-col md:flex-row items-center justify-between">
            <div className="md:w-1/2 mb-12 md:mb-0 z-20">
               <span className="text-ipp-green font-bold uppercase tracking-widest text-xs mb-3 block">Infraestructura</span>
               <h2 className="text-4xl md:text-5xl font-black mb-6 font-display leading-tight text-ipp-navy">Red Logística <br/> <span className="text-ipp-cyan">Nacional</span></h2>
               <p className="text-gray-600 text-lg leading-relaxed mb-8 max-w-lg font-light">
                  Conectamos los principales polos turísticos y comerciales del país a través de una red de distribución robusta y eficiente. Haga clic para ver ubicación.
               </p>
               <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div 
                    onClick={() => setActiveLocation('sd')}
                    className={`bg-white p-5 border transition-all duration-300 shadow-sm rounded-xl cursor-pointer ${activeLocation === 'sd' ? 'border-ipp-cyan ring-1 ring-ipp-cyan/50 shadow-lg' : 'border-gray-200 hover:border-ipp-cyan hover:bg-gray-50'}`}
                  >
                     <div className="flex items-center space-x-3 mb-2">
                        <div className={`w-3 h-3 rounded-full shadow-[0_0_10px_#29B6D8] transition-colors ${activeLocation === 'sd' ? 'bg-ipp-cyan animate-pulse' : 'bg-gray-300'}`}></div>
                        <strong className="block text-sm uppercase tracking-wider text-ipp-navy">Santo Domingo</strong>
                     </div>
                     <span className="text-gray-500 text-xs block">Sede Central & HUB Metropolitano</span>
                  </div>
                  <div 
                    onClick={() => setActiveLocation('pc')}
                    className={`bg-white p-5 border transition-all duration-300 shadow-sm rounded-xl cursor-pointer ${activeLocation === 'pc' ? 'border-ipp-green ring-1 ring-ipp-green/50 shadow-lg' : 'border-gray-200 hover:border-ipp-green hover:bg-gray-50'}`}
                  >
                     <div className="flex items-center space-x-3 mb-2">
                        <div className={`w-3 h-3 rounded-full shadow-[0_0_10px_#8CC63F] transition-colors ${activeLocation === 'pc' ? 'bg-ipp-green animate-pulse' : 'bg-gray-300'}`}></div>
                        <strong className="block text-sm uppercase tracking-wider text-ipp-navy">Punta Cana</strong>
                     </div>
                     <span className="text-gray-500 text-xs block">Centro de Distribución Zona Este</span>
                  </div>
               </div>
            </div>
            
            {/* Real Map Embed */}
            <div className="md:w-1/2 relative h-[500px] w-full flex items-center justify-center">
               <div className="absolute w-[400px] h-[400px] bg-ipp-navy/5 rounded-full blur-[100px]"></div>
               
               <div className="relative w-full max-w-xl h-full shadow-2xl border-4 border-white rounded-3xl overflow-hidden bg-gray-100">
                  <iframe 
                    key={activeLocation}
                    src={activeLocation === 'sd' ? maps.sd : maps.pc}
                    width="100%" 
                    height="100%" 
                    style={{ border: 0 }} 
                    allowFullScreen={true} 
                    loading="lazy" 
                    referrerPolicy="no-referrer-when-downgrade"
                    className="w-full h-full filter grayscale-[20%] hover:grayscale-0 transition-all duration-700 opacity-90 hover:opacity-100"
                    title="Cobertura Nacional IPP"
                  ></iframe>
                  
                  {/* Overlay Banner */}
                  <div className="absolute bottom-4 right-4 bg-white/90 backdrop-blur-md px-4 py-2 rounded-lg border border-gray-100 shadow-xl z-10 pointer-events-none">
                    <span className="text-xs font-bold text-ipp-navy flex items-center uppercase tracking-wider">
                      <MapPin size={12} className="mr-2 text-ipp-green" />
                      Visualización Satelital: {activeLocation === 'sd' ? 'Santo Domingo' : 'Punta Cana'}
                    </span>
                  </div>
               </div>
            </div>
         </div>
      </section>

      {/* CORPORATE IDENTITY SECTION - DARK THEME REDESIGN */}
      <section className="py-24 bg-ipp-navy text-white relative overflow-hidden">
        {/* Abstract Background Shapes */}
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-white/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-ipp-cyan/10 rounded-full blur-[100px] translate-y-1/3 -translate-x-1/4 pointer-events-none"></div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="flex flex-col lg:flex-row gap-16">
            {/* "Who We Are" Column */}
            <div className="lg:w-1/3">
              <div className="sticky top-32">
                <span className="text-ipp-green font-bold uppercase tracking-[0.3em] text-xs mb-6 block">Nuestra Identidad</span>
                <h2 className="text-5xl md:text-6xl font-black font-display leading-tight mb-8">
                  SOMOS <br/> <span className="text-transparent bg-clip-text bg-gradient-to-r from-ipp-cyan to-white">EXCELENCIA</span> <br/> LOGÍSTICA
                </h2>
                <p className="text-gray-300 text-lg leading-relaxed mb-8 border-l-2 border-ipp-cyan pl-6">
                  International Pack & Paper no es solo una empresa de suministros; somos el engranaje invisible que garantiza la operación impecable de los hoteles, clínicas y comercios más exigentes del Caribe.
                </p>
                <button onClick={() => navigate('/contact')} className="group flex items-center text-sm font-bold tracking-widest uppercase hover:text-ipp-cyan transition-colors">
                  Conoce nuestra historia <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-2 transition-transform" />
                </button>
              </div>
            </div>

            {/* Values Grid Column */}
            <div className="lg:w-2/3">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  { title: "Integridad", desc: "Transparencia radical en cada acuerdo.", icon: Shield },
                  { title: "Innovación", desc: "Soluciones que redefinen el estándar del mercado.", icon: Lightbulb },
                  { title: "Agilidad", desc: "Respuesta inmediata ante lo inesperado.", icon: Zap }, 
                  { title: "Excelencia", desc: "Calidad innegociable en productos y servicio.", icon: CheckCircle }, 
                  { title: "Compromiso", desc: "Su crecimiento es el motor de nuestro negocio.", icon: Users },
                  { title: "Pasión", desc: "Servir es nuestro privilegio diario.", icon: Heart }
                ].map((val, idx) => (
                  <div key={idx} className="bg-white/5 backdrop-blur-sm border border-white/10 p-8 hover:bg-white/10 transition-all duration-300 group hover:-translate-y-1 rounded-sm">
                    <val.icon className="w-10 h-10 text-ipp-cyan mb-6 group-hover:text-white transition-colors" strokeWidth={1.5} />
                    <h3 className="text-xl font-bold mb-3 font-display">{val.title}</h3>
                    <p className="text-gray-400 text-sm leading-relaxed group-hover:text-gray-200 transition-colors">{val.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* IMMERSIVE ABOUT US SECTION */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-4">
          <div className="relative rounded-[3rem] overflow-hidden bg-gray-900 shadow-2xl">
            <div className="absolute inset-0">
               {/* Corporate / High-end Logistics Image */}
               <img 
                 src="https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=2301&auto=format&fit=crop" 
                 alt="Corporate Office" 
                 className="w-full h-full object-cover opacity-40"
               />
               <div className="absolute inset-0 bg-gradient-to-r from-ipp-navy/95 to-ipp-navy/50"></div>
            </div>
            
            <div className="relative z-10 p-12 md:p-20 flex flex-col md:flex-row items-center gap-16">
               <div className="md:w-1/2">
                  <h2 className="text-3xl md:text-5xl font-black text-white font-display mb-8 leading-tight">
                    "Empieza donde estás, usa lo que tienes, haz lo mejor que puedas."
                  </h2>
                  <p className="text-ipp-cyan font-bold uppercase tracking-widest mb-2">- Arthur Ashe</p>
               </div>
               <div className="md:w-1/2 text-gray-200 text-lg leading-relaxed space-y-6 font-medium">
                  <p>
                    Desde 1990, hemos trazado un camino de liderazgo en la República Dominicana. Lo que comenzó como una visión familiar, hoy es una potencia logística que conecta marcas de clase mundial con los negocios locales.
                  </p>
                  <p>
                    Nuestra fórmula es simple pero poderosa: combinamos la <strong className="text-white">calidez del servicio personalizado</strong> con la <strong className="text-white">precisión de la logística moderna</strong>.
                  </p>
                  
                  <div className="flex gap-12 pt-8 border-t border-white/20">
                     <div>
                        <span className="block text-5xl font-black text-white">25+</span>
                        <span className="text-xs text-ipp-green font-bold uppercase tracking-wider">Años de Liderazgo</span>
                     </div>
                     <div>
                        <span className="block text-5xl font-black text-white">100%</span>
                        <span className="text-xs text-ipp-green font-bold uppercase tracking-wider">Capital Dominicano</span>
                     </div>
                  </div>
               </div>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action - Contact */}
      <section className="py-20 bg-ipp-navy relative overflow-hidden text-center">
         <div className="absolute top-0 left-0 w-full h-full bg-ipp-cyan opacity-5 skew-y-12 transform origin-top-left"></div>
         <div className="container mx-auto px-4 relative z-10">
            <h2 className="text-4xl font-black text-white mb-6 font-display">¿Listo para optimizar su cadena de suministro?</h2>
            <p className="text-gray-300 max-w-2xl mx-auto mb-10 text-lg">
               Converse con nuestros especialistas en logística y descubra cómo podemos mejorar sus costos y tiempos de entrega.
            </p>
            <button 
               onClick={() => navigate('/contact')}
               className="bg-ipp-green text-white font-bold py-4 px-10 rounded-full shadow-lg shadow-ipp-green/30 hover:bg-[#7ab332] transition-all transform hover:-translate-y-1"
            >
               Habla con Nosotros
            </button>
            <p className="mt-6 text-sm text-gray-400">
               Escríbanos directamente a <a href="mailto:info@ippdr.com" className="text-white underline hover:text-ipp-cyan">info@ippdr.com</a>
            </p>
         </div>
      </section>

    </div>
  );
};

export default Home;
