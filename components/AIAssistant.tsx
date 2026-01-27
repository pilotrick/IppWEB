
import React, { useState, useRef, useEffect } from 'react';
import { ChatMessage, MessageRole } from '../types';
import { sendChatMessage } from '../services/geminiService';
import { Send, Image as ImageIcon, Loader2, Sparkles, Mic, Bot } from 'lucide-react';

const AIAssistant: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      role: MessageRole.MODEL,
      text: 'Bienvenido a la conserjería digital de IPP. Soy tu Consultor de Experiencias. \n\n¿Deseas elevar la presentación de tus bebidas, optimizar tu logística de empaque o buscar soluciones eco-amigables? Estoy aquí para diseñar la solución perfecta.'
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImage(reader.result as string);
      };
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
    setInput('');
    const imageToSend = selectedImage ? selectedImage.split(',')[1] : undefined;
    setSelectedImage(null);
    setIsLoading(true);

    const history = messages.map(m => ({
      role: m.role === MessageRole.USER ? 'user' : 'model',
      parts: [{ text: m.text }]
    }));

    try {
      const responseText = await sendChatMessage(history, userMsg.text || (imageToSend ? "Describe esta imagen" : "Hola"), imageToSend);
      
      const aiMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: MessageRole.MODEL,
        text: responseText
      };
      setMessages(prev => [...prev, aiMsg]);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="h-[calc(100vh-80px)] container mx-auto px-4 py-6 flex flex-col">
      <div className="bg-white rounded-2xl shadow-xl flex-grow flex flex-col overflow-hidden border border-gray-200">
        
        {/* Chat Header */}
        <div className="bg-ipp-navy p-4 flex items-center justify-between border-b border-white/10">
          <div className="flex items-center space-x-4">
            <div className="bg-white/10 p-2.5 rounded-full border border-white/20">
              <Bot className="text-ipp-green" size={24} />
            </div>
            <div>
              <h3 className="text-white font-bold font-display tracking-wide">Consultor IPP</h3>
              <p className="text-gray-300 text-xs flex items-center">
                 <span className="w-2 h-2 bg-green-500 rounded-full mr-1.5 animate-pulse"></span>
                 En línea ahora
              </p>
            </div>
          </div>
        </div>

        {/* Messages Area */}
        <div className="flex-grow overflow-y-auto p-6 space-y-6 bg-gray-50">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex ${msg.role === MessageRole.USER ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[80%] rounded-2xl p-5 shadow-sm ${
                  msg.role === MessageRole.USER
                    ? 'bg-ipp-navy text-white rounded-br-none'
                    : 'bg-white text-gray-800 border border-gray-100 rounded-bl-none'
                }`}
              >
                {msg.image && (
                  <img src={msg.image} alt="Upload" className="max-w-xs rounded-lg mb-3 border border-white/20" />
                )}
                <div className="whitespace-pre-wrap text-sm leading-relaxed font-medium">{msg.text}</div>
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-white p-4 rounded-2xl rounded-bl-none border border-gray-100 shadow-sm flex items-center space-x-3">
                <Loader2 className="animate-spin text-ipp-cyan" size={20} />
                <span className="text-gray-500 text-sm font-medium">Analizando requerimientos...</span>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="p-5 bg-white border-t border-gray-100">
          {selectedImage && (
            <div className="mb-3 inline-flex items-center bg-blue-50 border border-blue-100 rounded-lg p-2 pr-4">
              <img src={selectedImage} alt="Selected" className="h-10 w-10 object-cover rounded mr-3" />
              <span className="text-xs text-blue-800 font-bold truncate max-w-[200px]">Imagen lista para análisis</span>
              <button onClick={() => setSelectedImage(null)} className="ml-3 text-gray-400 hover:text-red-500">
                &times;
              </button>
            </div>
          )}
          <div className="flex items-center space-x-3">
            <button 
              onClick={() => fileInputRef.current?.click()}
              className="p-3 text-gray-400 hover:text-ipp-navy hover:bg-gray-50 rounded-full transition-colors"
              title="Subir imagen"
            >
              <ImageIcon size={22} />
            </button>
            <input 
              type="file" 
              ref={fileInputRef} 
              className="hidden" 
              accept="image/*" 
              onChange={handleImageSelect}
            />
            
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Escribe tu consulta creativa aquí..."
              className="flex-grow bg-gray-50 text-gray-800 rounded-xl px-5 py-3.5 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-ipp-cyan/50 focus:border-ipp-cyan transition-all placeholder-gray-400 font-medium"
            />
            
            <button 
              onClick={handleSend}
              disabled={isLoading || (!input && !selectedImage)}
              className={`p-3.5 rounded-xl text-white shadow-md transition-all ${
                isLoading || (!input && !selectedImage)
                  ? 'bg-gray-200 cursor-not-allowed'
                  : 'bg-ipp-green hover:bg-[#7ab332] hover:shadow-lg'
              }`}
            >
              <Send size={20} />
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};

export default AIAssistant;
