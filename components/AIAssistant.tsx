
import React, { useState, useRef, useEffect } from 'react';
import { ChatMessage, MessageRole } from '../types';
import { sendChatMessage } from '../services/geminiService';
import { Send, Image as ImageIcon, Loader2, Sparkles, Bot, BrainCircuit, X } from 'lucide-react';

const AIAssistant: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      role: MessageRole.MODEL,
      text: 'Bienvenido a la Inteligencia Logística de IPP. Estoy utilizando razonamiento avanzado para optimizar su cadena de suministro.\n\n¿Desea analizar su mix de productos, solicitar una cotización compleja o verificar rutas de entrega?'
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  useEffect(() => scrollToBottom(), [messages]);

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setSelectedImage(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleSend = async () => {
    if ((!input.trim() && !selectedImage) || isLoading) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: MessageRole.USER,
      text: input,
      image: selectedImage || undefined
    };

    setMessages(prev => [...prev, userMsg]);
    const currentInput = input;
    const currentImage = selectedImage;
    setInput('');
    setSelectedImage(null);
    setIsLoading(true);

    const history = messages.map(m => ({
      role: m.role === MessageRole.USER ? 'user' : 'model',
      parts: [{ text: m.text }]
    }));

    try {
      const imageToSend = currentImage ? currentImage.split(',')[1] : undefined;
      const responseText = await sendChatMessage(history, currentInput || "Analizar requerimiento", imageToSend);
      
      setMessages(prev => [...prev, {
        id: (Date.now() + 1).toString(),
        role: MessageRole.MODEL,
        text: responseText
      }]);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="h-[calc(100vh-120px)] container mx-auto px-4 py-8">
      <div className="bg-white rounded-[2.5rem] shadow-2xl flex flex-col h-full overflow-hidden border border-gray-100">
        
        {/* Modern Header */}
        <div className="bg-ipp-navy p-6 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="bg-ipp-cyan/20 p-3 rounded-2xl border border-ipp-cyan/30">
              <BrainCircuit className="text-ipp-cyan animate-pulse" size={24} />
            </div>
            <div>
              <h3 className="text-white font-black font-display tracking-tight text-lg">Consultor Estratégico AI</h3>
              <div className="flex items-center text-ipp-green text-[10px] font-black uppercase tracking-widest mt-0.5">
                 <div className="w-1.5 h-1.5 bg-ipp-green rounded-full mr-2 animate-pulse shadow-[0_0_8px_#8CC63F]"></div>
                 Thinking Mode: Active (Gemini 3 Pro)
              </div>
            </div>
          </div>
        </div>

        {/* Chat Messages */}
        <div className="flex-grow overflow-y-auto p-8 space-y-8 bg-gray-50/50">
          {messages.map((msg) => (
            <div key={msg.id} className={`flex ${msg.role === MessageRole.USER ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[75%] group ${msg.role === MessageRole.USER ? 'flex flex-col items-end' : 'flex flex-col items-start'}`}>
                <div className={`p-6 rounded-3xl shadow-sm relative ${
                  msg.role === MessageRole.USER
                    ? 'bg-ipp-navy text-white rounded-tr-none'
                    : 'bg-white text-gray-800 border border-gray-100 rounded-tl-none'
                }`}>
                  {msg.image && <img src={msg.image} alt="Upload" className="max-w-xs rounded-xl mb-4 border border-white/20 shadow-lg" />}
                  <p className="text-sm font-medium leading-relaxed whitespace-pre-wrap">{msg.text}</p>
                </div>
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-white p-6 rounded-3xl rounded-tl-none border border-gray-100 shadow-xl flex flex-col space-y-4 max-w-sm animate-fade-in-up">
                <div className="flex items-center space-x-3">
                  <Loader2 className="animate-spin text-ipp-cyan" size={20} />
                  <span className="text-xs font-black text-ipp-navy uppercase tracking-widest">Razonando Solución...</span>
                </div>
                <div className="space-y-2">
                   <div className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
                      <div className="h-full bg-ipp-cyan animate-[progress_2s_infinite] w-1/3"></div>
                   </div>
                   <p className="text-[10px] text-gray-400 font-bold italic">Analizando inventario en Santo Domingo y Punta Cana...</p>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Controls */}
        <div className="p-6 bg-white border-t border-gray-100">
          {selectedImage && (
            <div className="mb-4 inline-flex items-center bg-ipp-cyan/10 border border-ipp-cyan/20 rounded-2xl p-2 pr-4 animate-fade-in-up">
              <img src={selectedImage} alt="Selected" className="h-12 w-12 object-cover rounded-xl mr-3" />
              <span className="text-[10px] text-ipp-navy font-black uppercase tracking-widest">Imagen Cargada</span>
              <button onClick={() => setSelectedImage(null)} className="ml-3 text-gray-400 hover:text-red-500 transition-colors">
                <X size={16} />
              </button>
            </div>
          )}
          <div className="flex items-center gap-4">
            <button 
              onClick={() => fileInputRef.current?.click()}
              className="p-4 text-gray-400 hover:text-ipp-navy hover:bg-gray-100 rounded-2xl transition-all"
              title="Adjuntar imagen logística"
            >
              <ImageIcon size={24} />
            </button>
            <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleImageSelect} />
            
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Describa su requerimiento o problema logístico..."
              className="flex-grow bg-gray-50 text-ipp-navy rounded-2xl px-6 py-4 border-2 border-transparent focus:border-ipp-cyan focus:bg-white outline-none transition-all font-medium placeholder-gray-400"
            />
            
            <button 
              onClick={handleSend}
              disabled={isLoading || (!input.trim() && !selectedImage)}
              className={`p-4 rounded-2xl text-white shadow-xl transition-all transform active:scale-95 ${
                isLoading || (!input.trim() && !selectedImage)
                  ? 'bg-gray-200 cursor-not-allowed'
                  : 'bg-ipp-green hover:bg-[#7ab332]'
              }`}
            >
              <Send size={24} />
            </button>
          </div>
        </div>
      </div>
      <style>{`
        @keyframes progress {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(300%); }
        }
      `}</style>
    </div>
  );
};

export default AIAssistant;
