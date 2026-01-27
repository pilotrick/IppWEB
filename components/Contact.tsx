
import React, { useState, useEffect, useRef } from 'react';
import { MapPin, CheckCircle, ShoppingBag, Mail, Phone, Map, X, User, Building, Smartphone, Briefcase, FileText, Navigation, ArrowUpRight, ExternalLink, Database, RefreshCw, Bot, Send, Loader2, MessageSquare } from 'lucide-react';
import { useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { sendChatMessage } from '../services/geminiService';
import { ChatMessage, MessageRole } from '../types';

const Contact: React.FC = () => {
  const location = useLocation();
  const mapSectionRef = useRef<HTMLElement>(null);
  const { userProfile, isAuthenticated } = useAuth();

  const [formData, setFormData] = useState({
    contactName: '',
    jobTitle: '',
    phone: '',
    email: '',
    companyName: '',
    rnc: '',
    businessType: '',
    city: '',
    address: '',
    message: ''
  });

  const [errors, setErrors] = useState({
    contactName: '',
    jobTitle: '',
    phone: '',
    email: '',
    companyName: '',
    rnc: '',
    businessType: '',
    city: '',
    address: '',
    message: ''
  });

  const [touched, setTouched] = useState({
    contactName: false,
    jobTitle: false,
    phone: false,
    email: false,
    companyName: false,
    rnc: false,
    businessType: false,
    city: false,
    address: false,
    message: false
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [isOrderContext, setIsOrderContext] = useState(false);
  const [activeLocation, setActiveLocation] = useState<'sd' | 'pc'>('sd');

  // Mini Chat State
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [chatInput, setChatInput] = useState('');
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [isChatLoading, setIsChatLoading] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Google Maps Embed URLs with specific coordinates
  const maps = {
    sd: "https://maps.google.com/maps?q=18.4968555,-69.8070159&z=15&output=embed",
    pc: "https://maps.google.com/maps?q=18.6044776,-68.4185074&z=15&output=embed"
  };

  const directionsLinks = {
    sd: "https://www.google.com/maps/dir/?api=1&destination=18.4968555,-69.8070159",
    pc: "https://www.google.com/maps/dir/?api=1&destination=18.6044776,-68.4185074"
  };

  // Effect for Order Context (from Cart)
  useEffect(() => {
    if (location.state && location.state.prefilledMessage) {
      setFormData(prev => ({
        ...prev,
        message: location.state.prefilledMessage
      }));
      setIsOrderContext(true);
    }
  }, [location.state]);

  // Effect for Auto-filling User Data
  useEffect(() => {
    if (isAuthenticated && userProfile) {
      setFormData(prev => ({
        ...prev,
        contactName: userProfile.contactName || '',
        jobTitle: userProfile.jobTitle || '',
        phone: userProfile.phone || '',
        email: userProfile.email || '',
        companyName: userProfile.companyName || '',
        rnc: userProfile.rnc || '',
        businessType: userProfile.businessType || '',
        city: userProfile.city || '',
        address: userProfile.address || ''
      }));
    }
  }, [isAuthenticated, userProfile]);

  useEffect(() => {
    if (isChatOpen && chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [chatMessages, isChatOpen]);

  const handleScrollToMap = () => {
    mapSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  };

  const handleChatSend = async () => {
    if (!chatInput.trim() || isChatLoading) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: MessageRole.USER,
      text: chatInput
    };

    setChatMessages(prev => [...prev, userMsg]);
    setChatInput('');
    setIsChatLoading(true);

    // Build simple history for context
    const history = chatMessages.map(m => ({
      role: m.role === MessageRole.USER ? 'user' : 'model',
      parts: [{ text: m.text }]
    }));

    try {
      const responseText = await sendChatMessage(history, userMsg.text);
      const aiMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: MessageRole.MODEL,
        text: responseText
      };
      setChatMessages(prev => [...prev, aiMsg]);
    } catch (error) {
      console.error(error);
    } finally {
      setIsChatLoading(false);
    }
  };

  const validateField = (name: string, value: string) => {
    let error = '';
    switch (name) {
      case 'contactName':
        if (!value.trim()) error = 'El nombre es obligatorio.';
        break;
      case 'phone':
        if (!value.trim()) error = 'El teléfono es obligatorio.';
        else if (value.replace(/\D/g, '').length < 10) error = 'Mínimo 10 dígitos.';
        break;
      case 'email':
        if (!value.trim()) {
          error = 'El email es obligatorio.';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
          error = 'Email inválido.';
        }
        break;
      case 'companyName':
        if (!value.trim()) error = 'El nombre de la empresa es obligatorio.';
        break;
      case 'rnc':
        if (value.trim() && value.replace(/\D/g, '').length < 9) error = 'RNC inválido (mínimo 9 dígitos).';
        break;
      case 'businessType':
        if (!value.trim()) error = 'Seleccione un tipo.';
        break;
      case 'city':
        if (!value.trim()) error = 'La ciudad es obligatoria.';
        break;
      case 'address':
        if (!value.trim()) error = 'La dirección es obligatoria.';
        break;
      case 'message':
        if (!value.trim()) {
          error = 'El mensaje es obligatorio.';
        } else if (value.trim().length < 10) {
          error = 'Mínimo 10 caracteres.';
        }
        break;
    }
    return error;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (touched[name as keyof typeof touched]) {
      setErrors(prev => ({ ...prev, [name]: validateField(name, value) }));
    }
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setTouched(prev => ({ ...prev, [name]: true }));
    setErrors(prev => ({ ...prev, [name]: validateField(name, value) }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors = {
      contactName: validateField('contactName', formData.contactName),
      jobTitle: validateField('jobTitle', formData.jobTitle),
      phone: validateField('phone', formData.phone),
      email: validateField('email', formData.email),
      companyName: validateField('companyName', formData.companyName),
      rnc: validateField('rnc', formData.rnc),
      businessType: validateField('businessType', formData.businessType),
      city: validateField('city', formData.city),
      address: validateField('address', formData.address),
      message: validateField('message', formData.message)
    };
    
    const hasErrors = Object.values(newErrors).some(err => err !== '');

    setErrors(newErrors);
    setTouched({ 
        contactName: true, jobTitle: true, phone: true, email: true,
        companyName: true, rnc: true, businessType: true, 
        city: true, address: true, message: true 
    });

    if (!hasErrors) {
      setIsSubmitting(true);
      await new Promise(resolve => setTimeout(resolve, 1500));
      setIsSubmitting(false);
      setShowSuccessModal(true);
    }
  };

  const handleCloseModal = () => {
    setShowSuccessModal(false);
    // Don't clear form if authenticated, keep the profile data
    if (!isAuthenticated) {
        setFormData({ 
            contactName: '', jobTitle: '', phone: '', email: '',
            companyName: '', rnc: '', businessType: '', 
            city: '', address: '', message: '' 
        });
    } else {
        // Only clear message
        setFormData(prev => ({ ...prev, message: '' }));
    }
    
    setIsOrderContext(false);
    setTouched({ 
        contactName: false, jobTitle: false, phone: false, email: false,
        companyName: false, rnc: false, businessType: false, 
        city: false, address: false, message: false 
    });
  };

  return (
    <div className="bg-white min-h-screen relative">
      
      {/* Success Modal */}
      {showSuccessModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-ipp-navy/80 backdrop-blur-sm transition-opacity duration-300" onClick={handleCloseModal}></div>
          <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full relative z-10 overflow-hidden animate-fade-in-up">
            <div className="bg-ipp-green/10 p-8 flex justify-center relative">
               <div className="w-20 h-20 bg-ipp-green text-white rounded-full flex items-center justify-center shadow-lg shadow-ipp-green/30 animate-pulse">
                  <CheckCircle size={40} className="stroke-[3]" />
               </div>
               <button onClick={handleCloseModal} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 bg-white/50 hover:bg-white rounded-full p-1"><X size={20} /></button>
            </div>
            <div className="p-8 text-center">
              <h3 className="text-2xl font-black text-ipp-navy font-display mb-2 animate-fade-in-up" style={{ animationDelay: '100ms' }}>{isOrderContext ? '¡Cotización Enviada!' : '¡Mensaje Recibido!'}</h3>
              <p className="text-gray-500 mb-8 leading-relaxed animate-fade-in-up" style={{ animationDelay: '200ms' }}>
                  {isOrderContext 
                    ? `Gracias por su pedido. Se ha generado la orden de venta en nuestro sistema y un asesor confirmará el despacho a ${formData.city} en breve.`
                    : 'Gracias por contactar a International Pack & Paper. Hemos recibido su solicitud y nuestro equipo comercial le responderá en breve.'
                  }
              </p>
              <button 
                onClick={handleCloseModal} 
                className="w-full bg-ipp-navy text-white font-bold py-4 rounded-xl shadow-lg hover:bg-ipp-dark transition-all animate-fade-in-up"
                style={{ animationDelay: '300ms' }}
              >
                Entendido, gracias
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Map Section */}
      <section ref={mapSectionRef} className="bg-gray-50 py-16 border-b border-gray-200 scroll-mt-24">
        <div className="container mx-auto px-4">
          <div className="text-center mb-10">
             <span className="text-ipp-green font-bold uppercase tracking-widest text-xs mb-2 block">Nuestra Red</span>
             <h2 className="text-3xl md:text-4xl font-black text-ipp-navy font-display">Ubicaciones Estratégicas</h2>
          </div>
          
          <div className="flex flex-col lg:flex-row gap-8 max-w-6xl mx-auto items-stretch">
             {/* Map Container */}
             <div className="w-full lg:w-3/5 min-h-[450px] bg-white rounded-3xl relative overflow-hidden shadow-xl border border-gray-200 group">
                <iframe 
                  key={activeLocation}
                  src={activeLocation === 'sd' ? maps.sd : maps.pc}
                  width="100%" 
                  height="100%" 
                  style={{ border: 0 }} 
                  allowFullScreen={true} 
                  loading="lazy" 
                  referrerPolicy="no-referrer-when-downgrade"
                  className="w-full h-full"
                  title="IPP Location Map"
                ></iframe>

                {/* Map Controls */}
                <div className="absolute top-4 left-4 right-4 flex justify-between items-start pointer-events-none">
                   <div className="flex space-x-2 pointer-events-auto">
                      <button 
                        onClick={() => setActiveLocation('sd')}
                        className={`px-5 py-2.5 rounded-full text-xs font-bold shadow-lg transition-all border ${activeLocation === 'sd' ? 'bg-ipp-navy text-white border-ipp-navy' : 'bg-white text-gray-600 border-gray-100 hover:bg-gray-50'}`}
                      >
                        Santo Domingo
                      </button>
                      <button 
                        onClick={() => setActiveLocation('pc')}
                        className={`px-5 py-2.5 rounded-full text-xs font-bold shadow-lg transition-all border ${activeLocation === 'pc' ? 'bg-ipp-green text-white border-ipp-green' : 'bg-white text-gray-600 border-gray-100 hover:bg-gray-50'}`}
                      >
                        Punta Cana
                      </button>
                   </div>
                   
                   <a 
                     href={activeLocation === 'sd' ? directionsLinks.sd : directionsLinks.pc}
                     target="_blank"
                     rel="noopener noreferrer"
                     className="bg-white text-blue-600 px-4 py-2.5 rounded-full text-xs font-bold shadow-lg flex items-center hover:bg-blue-50 transition-colors pointer-events-auto"
                   >
                     <Navigation size={14} className="mr-2" />
                     Cómo llegar
                   </a>
                </div>
             </div>

             {/* Details Panel */}
             <div className="w-full lg:w-2/5">
                <div className="bg-white p-8 rounded-3xl shadow-lg border border-gray-100 transition-all duration-300 h-full flex flex-col justify-center relative overflow-hidden">
                   {/* Background decoration */}
                   <div className={`absolute top-0 right-0 w-32 h-32 opacity-10 rounded-full blur-2xl transform translate-x-10 -translate-y-10 transition-colors duration-500 ${activeLocation === 'sd' ? 'bg-ipp-cyan' : 'bg-ipp-green'}`}></div>

                   {activeLocation === 'sd' ? (
                      <div key="sd" className="animate-fade-in-up relative z-10">
                         <div className="flex items-center space-x-3 mb-6">
                            <div className="w-14 h-14 bg-ipp-cyan rounded-2xl flex items-center justify-center text-white shadow-lg shadow-ipp-cyan/30 transform rotate-3">
                               <MapPin size={28} />
                            </div>
                            <div>
                              <h3 className="text-3xl font-black text-ipp-navy font-display leading-none">Santo Domingo</h3>
                              <span className="text-xs text-ipp-cyan font-bold uppercase tracking-wider">Sede Central</span>
                            </div>
                         </div>
                         <p className="text-gray-500 mb-8 leading-relaxed">Centro de operaciones principal y almacén central. Desde aquí coordinamos la logística nacional y el área administrativa.</p>
                         <ul className="space-y-4">
                            <li className="flex items-start text-gray-700 bg-gray-50 p-4 rounded-xl border border-gray-100">
                               <Map size={20} className="mr-3 text-ipp-cyan flex-shrink-0 mt-0.5" />
                               <span className="font-medium text-sm">Calle Profesora Elisa Bodden #2, Santo Domingo.</span>
                            </li>
                            <li className="flex items-center text-gray-700 bg-gray-50 p-4 rounded-xl border border-gray-100">
                               <Phone size={20} className="mr-3 text-ipp-cyan flex-shrink-0" />
                               <span className="font-medium text-sm">+1 (809) 748-2200</span>
                            </li>
                            <li className="flex items-center text-gray-700 bg-gray-50 p-4 rounded-xl border border-gray-100">
                               <Mail size={20} className="mr-3 text-ipp-cyan flex-shrink-0" />
                               <span className="font-medium text-sm">info@ippdr.com</span>
                            </li>
                         </ul>
                      </div>
                   ) : (
                      <div key="pc" className="animate-fade-in-up relative z-10">
                         <div className="flex items-center space-x-3 mb-6">
                            <div className="w-14 h-14 bg-ipp-green rounded-2xl flex items-center justify-center text-white shadow-lg shadow-ipp-green/30 transform -rotate-3">
                               <MapPin size={28} />
                            </div>
                            <div>
                              <h3 className="text-3xl font-black text-ipp-navy font-display leading-none">Punta Cana</h3>
                              <span className="text-xs text-ipp-green font-bold uppercase tracking-wider">Hub Logístico Este</span>
                            </div>
                         </div>
                         <p className="text-gray-500 mb-8 leading-relaxed">Hub logístico estratégico para la zona este. Garantizamos entregas express a la zona hotelera y turística.</p>
                         <ul className="space-y-4">
                            <li className="flex items-start text-gray-700 bg-gray-50 p-4 rounded-xl border border-gray-100">
                               <Map size={20} className="mr-3 text-ipp-green flex-shrink-0 mt-0.5" />
                               <span className="font-medium text-sm">Plaza Cana Town Local 6.</span>
                            </li>
                            <li className="flex items-center text-gray-700 bg-gray-50 p-4 rounded-xl border border-gray-100">
                               <Phone size={20} className="mr-3 text-ipp-green flex-shrink-0" />
                               <span className="font-medium text-sm">+1 (809) 748-2200</span>
                            </li>
                            <li className="flex items-center text-gray-700 bg-gray-50 p-4 rounded-xl border border-gray-100">
                               <Mail size={20} className="mr-3 text-ipp-green flex-shrink-0" />
                               <span className="font-medium text-sm">info@ippdr.com</span>
                            </li>
                         </ul>
                      </div>
                   )}
                </div>
             </div>
          </div>
        </div>
      </section>

      {/* Form Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="max-w-6xl mx-auto bg-white rounded-3xl shadow-2xl overflow-hidden border border-gray-100 flex flex-col md:flex-row">
          
          <div className="md:w-4/12 bg-ipp-navy text-white p-10 flex flex-col justify-between relative overflow-hidden">
             <div className="absolute top-0 right-0 w-40 h-40 bg-ipp-cyan opacity-10 rounded-full blur-3xl transform translate-x-10 -translate-y-10"></div>
             <div className="absolute bottom-0 left-0 w-40 h-40 bg-ipp-green opacity-10 rounded-full blur-3xl transform -translate-x-10 translate-y-10"></div>
             
             <div className="relative z-10">
                <span className="text-ipp-green font-bold uppercase tracking-widest text-xs mb-3 block">
                    {isOrderContext ? 'Checkout B2B' : 'Contacto Directo'}
                </span>
                <h2 className="text-4xl font-black font-display mb-6">
                    {isOrderContext ? 'Finalice su Pedido' : 'Habla con Nosotros'}
                </h2>
                <p className="text-gray-300 leading-relaxed mb-6">
                    {isOrderContext 
                      ? 'Está a un paso de optimizar su inventario. Complete sus datos para validar disponibilidad y condiciones comerciales.'
                      : '¿Tiene preguntas sobre nuestra logística o productos? Complete el formulario y nuestro equipo le responderá en menos de 24 horas.'
                    }
                </p>

                <button 
                  onClick={handleScrollToMap}
                  className="mb-8 inline-flex items-center text-xs font-bold text-ipp-cyan hover:text-white border border-ipp-cyan/30 hover:border-ipp-cyan hover:bg-white/10 rounded-lg px-4 py-2.5 transition-all group"
                >
                  <MapPin size={16} className="mr-2 group-hover:scale-110 transition-transform" />
                  Ver Almacenes en Mapa
                  <ArrowUpRight size={14} className="ml-1 opacity-50" />
                </button>
             </div>

             {/* AI Chat Widget Integrated */}
             <div className="relative z-10 flex-grow flex flex-col justify-end mt-4">
               {isChatOpen ? (
                 <div className="bg-white/10 backdrop-blur-md border border-white/10 rounded-2xl overflow-hidden flex flex-col h-[300px] animate-fade-in-up">
                   <div className="p-3 bg-ipp-dark/50 flex justify-between items-center">
                     <div className="flex items-center text-xs font-bold text-white">
                        <Bot size={14} className="mr-2 text-ipp-cyan" />
                        Asistente Virtual IPP
                     </div>
                     <button onClick={() => setIsChatOpen(false)} className="text-gray-400 hover:text-white"><X size={14}/></button>
                   </div>
                   <div className="flex-grow overflow-y-auto p-3 space-y-3 custom-scrollbar">
                      {chatMessages.length === 0 && (
                        <p className="text-xs text-gray-300 italic">¿Dudas inmediatas? Pregunte sobre cobertura, stock o procesos.</p>
                      )}
                      {chatMessages.map(msg => (
                        <div key={msg.id} className={`flex ${msg.role === MessageRole.USER ? 'justify-end' : 'justify-start'}`}>
                          <div className={`text-xs p-2 rounded-lg max-w-[85%] ${msg.role === MessageRole.USER ? 'bg-ipp-cyan text-white' : 'bg-white/20 text-gray-100'}`}>
                             {msg.text}
                          </div>
                        </div>
                      ))}
                      {isChatLoading && (
                        <div className="flex justify-start">
                          <div className="bg-white/20 p-2 rounded-lg">
                            <Loader2 size={12} className="animate-spin text-gray-300" />
                          </div>
                        </div>
                      )}
                      <div ref={chatEndRef}></div>
                   </div>
                   <div className="p-3 border-t border-white/10 flex gap-2">
                      <input 
                        value={chatInput}
                        onChange={(e) => setChatInput(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleChatSend()}
                        className="flex-grow bg-black/20 text-white text-xs rounded-lg px-3 py-2 border-none focus:ring-1 focus:ring-ipp-cyan placeholder-gray-500"
                        placeholder="Escriba su consulta..."
                      />
                      <button 
                        onClick={handleChatSend}
                        disabled={isChatLoading || !chatInput}
                        className="bg-ipp-cyan p-2 rounded-lg text-white hover:bg-white hover:text-ipp-cyan transition-colors disabled:opacity-50"
                      >
                         <Send size={14} />
                      </button>
                   </div>
                 </div>
               ) : (
                 <div 
                   onClick={() => setIsChatOpen(true)}
                   className="bg-white/10 hover:bg-white/20 border border-white/10 rounded-2xl p-4 cursor-pointer transition-all group flex items-center justify-between"
                 >
                    <div className="flex items-center">
                       <div className="w-10 h-10 rounded-full bg-ipp-cyan/20 flex items-center justify-center mr-3 group-hover:scale-110 transition-transform">
                          <MessageSquare size={18} className="text-ipp-cyan" />
                       </div>
                       <div>
                          <p className="text-sm font-bold text-white">Consultas Rápidas</p>
                          <p className="text-xs text-gray-400 group-hover:text-gray-200">Asistencia IA en tiempo real</p>
                       </div>
                    </div>
                    <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center">
                       <ArrowUpRight size={14} className="text-white" />
                    </div>
                 </div>
               )}
             </div>

             <div className="relative z-10 space-y-4 mt-8 pt-6 border-t border-white/10">
                <div className="flex items-center text-sm text-gray-300">
                   <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center mr-3">
                      <Mail size={14} />
                   </div>
                   info@ippdr.com
                </div>
                <div className="flex items-center text-sm text-gray-300">
                   <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center mr-3">
                      <Phone size={14} />
                   </div>
                   +1 (809) 748-2200
                </div>
             </div>
          </div>

          <div className="md:w-8/12 p-8 lg:p-12 bg-white">
             {/* Dynamic Alerts */}
             <div className="space-y-3 mb-8">
                 {isOrderContext && (
                    <div className="bg-blue-50 border border-blue-100 text-blue-800 px-4 py-3 rounded-xl flex items-center text-sm font-medium animate-fade-in-up">
                       <ShoppingBag size={16} className="mr-2" />
                       Solicitud de cotización desde carrito
                    </div>
                 )}
                 {isAuthenticated && userProfile && (
                     <div className="bg-emerald-50 border border-emerald-100 text-emerald-800 px-4 py-3 rounded-xl flex items-center justify-between text-sm font-medium animate-fade-in-up">
                       <div className="flex items-center">
                           <Database size={16} className="mr-2" />
                           <span>Datos de facturación sincronizados</span>
                       </div>
                       <div className="flex items-center text-xs font-bold text-emerald-600">
                           <RefreshCw size={12} className="mr-1"/> Verificado
                       </div>
                    </div>
                 )}
             </div>

             <form onSubmit={handleSubmit} className="space-y-6" noValidate>
               
               {/* Inputs */}
               <div>
                  <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4 border-b border-gray-100 pb-2">Datos del Solicitante</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="contactName" className="block text-sm font-bold text-gray-700 mb-2 flex items-center"><User size={14} className="mr-1.5 text-ipp-cyan"/> Nombre de Contacto</label>
                      <input 
                        type="text" id="contactName" name="contactName" 
                        value={formData.contactName} onChange={handleChange} onBlur={handleBlur} 
                        readOnly={isAuthenticated}
                        className={`block w-full rounded-xl p-3 border ${errors.contactName ? 'border-red-500 bg-red-50' : 'border-gray-200 bg-gray-50'} ${isAuthenticated ? 'opacity-70 cursor-not-allowed bg-gray-100' : 'focus:ring-2 focus:ring-ipp-cyan/20 focus:border-ipp-cyan focus:bg-white'} transition-all outline-none`} 
                        placeholder="Juan Pérez" 
                      />
                      {errors.contactName && <p className="mt-1 text-xs text-red-500 font-bold">{errors.contactName}</p>}
                    </div>
                    <div>
                      <label htmlFor="jobTitle" className="block text-sm font-bold text-gray-700 mb-2 flex items-center"><Briefcase size={14} className="mr-1.5 text-ipp-cyan"/> Cargo / Puesto</label>
                      <input type="text" id="jobTitle" name="jobTitle" value={formData.jobTitle} onChange={handleChange} onBlur={handleBlur} readOnly={isAuthenticated} className={`block w-full rounded-xl p-3 border border-gray-200 bg-gray-50 ${isAuthenticated ? 'opacity-70 cursor-not-allowed bg-gray-100' : 'focus:ring-2 focus:ring-ipp-cyan/20 focus:border-ipp-cyan focus:bg-white'} transition-all outline-none`} placeholder="Ej: Gerente de Compras" />
                    </div>
                    <div>
                      <label htmlFor="phone" className="block text-sm font-bold text-gray-700 mb-2 flex items-center"><Smartphone size={14} className="mr-1.5 text-ipp-cyan"/> Teléfono</label>
                      <input type="tel" id="phone" name="phone" value={formData.phone} onChange={handleChange} onBlur={handleBlur} readOnly={isAuthenticated} className={`block w-full rounded-xl p-3 border ${errors.phone ? 'border-red-500 bg-red-50' : 'border-gray-200 bg-gray-50'} ${isAuthenticated ? 'opacity-70 cursor-not-allowed bg-gray-100' : 'focus:ring-2 focus:ring-ipp-cyan/20 focus:border-ipp-cyan focus:bg-white'} transition-all outline-none`} placeholder="(809) 555-5555" />
                      {errors.phone && <p className="mt-1 text-xs text-red-500 font-bold">{errors.phone}</p>}
                    </div>
                     <div>
                      <label htmlFor="email" className="block text-sm font-bold text-gray-700 mb-2 flex items-center"><Mail size={14} className="mr-1.5 text-ipp-cyan"/> Email</label>
                      <input type="email" id="email" name="email" value={formData.email} onChange={handleChange} onBlur={handleBlur} readOnly={isAuthenticated} className={`block w-full rounded-xl p-3 border ${errors.email ? 'border-red-500 bg-red-50' : 'border-gray-200 bg-gray-50'} ${isAuthenticated ? 'opacity-70 cursor-not-allowed bg-gray-100' : 'focus:ring-2 focus:ring-ipp-cyan/20 focus:border-ipp-cyan focus:bg-white'} transition-all outline-none`} placeholder="compras@empresa.com" />
                      {errors.email && <p className="mt-1 text-xs text-red-500 font-bold">{errors.email}</p>}
                    </div>
                  </div>
               </div>

               <div>
                  <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4 border-b border-gray-100 pb-2 mt-2">Información de la Empresa</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="companyName" className="block text-sm font-bold text-gray-700 mb-2 flex items-center"><Building size={14} className="mr-1.5 text-ipp-cyan"/> Empresa</label>
                      <input type="text" id="companyName" name="companyName" value={formData.companyName} onChange={handleChange} onBlur={handleBlur} readOnly={isAuthenticated} className={`block w-full rounded-xl p-3 border ${errors.companyName ? 'border-red-500 bg-red-50' : 'border-gray-200 bg-gray-50'} ${isAuthenticated ? 'opacity-70 cursor-not-allowed bg-gray-100' : 'focus:ring-2 focus:ring-ipp-cyan/20 focus:border-ipp-cyan focus:bg-white'} transition-all outline-none`} placeholder="Empresa S.A." />
                      {errors.companyName && <p className="mt-1 text-xs text-red-500 font-bold">{errors.companyName}</p>}
                    </div>
                    
                    <div>
                      <label htmlFor="rnc" className="block text-sm font-bold text-gray-700 mb-2 flex items-center"><FileText size={14} className="mr-1.5 text-ipp-cyan"/> RNC</label>
                      <input type="text" id="rnc" name="rnc" value={formData.rnc} onChange={handleChange} onBlur={handleBlur} readOnly={isAuthenticated} className={`block w-full rounded-xl p-3 border ${errors.rnc ? 'border-red-500 bg-red-50' : 'border-gray-200 bg-gray-50'} ${isAuthenticated ? 'opacity-70 cursor-not-allowed bg-gray-100' : 'focus:ring-2 focus:ring-ipp-cyan/20 focus:border-ipp-cyan focus:bg-white'} transition-all outline-none`} placeholder="000-000000-0" />
                      {errors.rnc && <p className="mt-1 text-xs text-red-500 font-bold">{errors.rnc}</p>}
                    </div>

                     <div>
                      <label htmlFor="businessType" className="block text-sm font-bold text-gray-700 mb-2 flex items-center"><Briefcase size={14} className="mr-1.5 text-ipp-cyan"/> Tipo de Negocio</label>
                      {isAuthenticated ? (
                          <input type="text" value={formData.businessType} readOnly className="block w-full rounded-xl p-3 border border-gray-200 bg-gray-100 opacity-70 cursor-not-allowed transition-all outline-none" />
                      ) : (
                        <select id="businessType" name="businessType" value={formData.businessType} onChange={handleChange} onBlur={handleBlur} className={`block w-full rounded-xl p-3 border ${errors.businessType ? 'border-red-500 bg-red-50' : 'border-gray-200 bg-gray-50'} focus:ring-2 focus:ring-ipp-cyan/20 focus:border-ipp-cyan focus:bg-white transition-all outline-none`}>
                            <option value="">Seleccionar...</option>
                            <option value="Hotel / Resort">Hotel / Resort</option>
                            <option value="Restaurante / Bar">Restaurante / Bar</option>
                            <option value="Clínica / Hospital">Clínica / Hospital</option>
                            <option value="Supermercado / Retail">Supermercado / Retail</option>
                            <option value="Catering / Eventos">Catering / Eventos</option>
                            <option value="Otro">Otro</option>
                        </select>
                      )}
                      {errors.businessType && <p className="mt-1 text-xs text-red-500 font-bold">{errors.businessType}</p>}
                    </div>

                     <div>
                      <label htmlFor="city" className="block text-sm font-bold text-gray-700 mb-2 flex items-center"><MapPin size={14} className="mr-1.5 text-ipp-cyan"/> Ciudad</label>
                      <input type="text" id="city" name="city" value={formData.city} onChange={handleChange} onBlur={handleBlur} readOnly={isAuthenticated} className={`block w-full rounded-xl p-3 border ${errors.city ? 'border-red-500 bg-red-50' : 'border-gray-200 bg-gray-50'} ${isAuthenticated ? 'opacity-70 cursor-not-allowed bg-gray-100' : 'focus:ring-2 focus:ring-ipp-cyan/20 focus:border-ipp-cyan focus:bg-white'} transition-all outline-none`} placeholder="Ej: Punta Cana" />
                      {errors.city && <p className="mt-1 text-xs text-red-500 font-bold">{errors.city}</p>}
                    </div>

                    <div className="md:col-span-2">
                      <label htmlFor="address" className="block text-sm font-bold text-gray-700 mb-2 flex items-center"><Navigation size={14} className="mr-1.5 text-ipp-cyan"/> Dirección Física</label>
                      <input type="text" id="address" name="address" value={formData.address} onChange={handleChange} onBlur={handleBlur} readOnly={isAuthenticated} className={`block w-full rounded-xl p-3 border ${errors.address ? 'border-red-500 bg-red-50' : 'border-gray-200 bg-gray-50'} ${isAuthenticated ? 'opacity-70 cursor-not-allowed bg-gray-100' : 'focus:ring-2 focus:ring-ipp-cyan/20 focus:border-ipp-cyan focus:bg-white'} transition-all outline-none`} placeholder="Av. Principal #123, Edificio Corporativo..." />
                      {errors.address && <p className="mt-1 text-xs text-red-500 font-bold">{errors.address}</p>}
                    </div>
                  </div>
               </div>

               <div>
                 <label htmlFor="message" className="block text-sm font-bold text-gray-700 mb-2">{isOrderContext ? 'Notas' : 'Mensaje'}</label>
                 <textarea id="message" name="message" rows={4} value={formData.message} onChange={handleChange} onBlur={handleBlur} className={`block w-full rounded-xl p-3 border ${errors.message ? 'border-red-500 bg-red-50' : 'border-gray-200 bg-gray-50'} focus:ring-2 focus:ring-ipp-cyan/20 focus:border-ipp-cyan focus:bg-white transition-all outline-none font-mono text-sm`} placeholder={isOrderContext ? "" : "¿Cómo podemos ayudarle?"}></textarea>
                 {errors.message && <p className="mt-1 text-xs text-red-500 font-bold">{errors.message}</p>}
               </div>

               <button type="submit" disabled={isSubmitting} className={`w-full text-white font-bold py-4 px-6 rounded-xl flex items-center justify-center space-x-2 transition-all shadow-lg transform hover:-translate-y-1 ${isSubmitting ? 'bg-gray-400 cursor-not-allowed' : 'bg-ipp-green hover:bg-[#7ab332] shadow-ipp-green/30'}`}>
                 {isSubmitting ? (<><div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div><span>Procesando solicitud...</span></>) : (<span>{isOrderContext ? 'Confirmar Pedido' : 'Enviar Consulta'}</span>)}
               </button>
             </form>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Contact;
