
import React, { useState, useRef } from 'react';
import { visualizeBranding } from '../services/geminiService';
import { Loader2, Wand2, Upload, AlertCircle, Sparkles, Download, Layers } from 'lucide-react';

const BrandingStudio: React.FC = () => {
  const [sourceImage, setSourceImage] = useState<string | null>(null);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [prompt, setPrompt] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSourceImage(reader.result as string);
        setGeneratedImage(null);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleGenerate = async () => {
    if (!sourceImage || !prompt || isProcessing) return;

    setIsProcessing(true);
    try {
      const base64Data = sourceImage.split(',')[1];
      const result = await visualizeBranding(base64Data, prompt);
      if (result) {
        setGeneratedImage(result);
      } else {
        alert("No se pudo generar la imagen. Intenta con un prompt diferente.");
      }
    } catch (error) {
      console.error(error);
      alert("Error al procesar la imagen.");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-12 bg-white min-h-screen">
      <div className="text-center mb-16 relative">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-ipp-cyan/5 rounded-full blur-3xl -z-10"></div>
        <span className="text-ipp-green font-bold uppercase tracking-widest text-xs mb-3 block flex justify-center items-center">
          <Sparkles size={14} className="mr-2" />
          Powered by Gemini AI
        </span>
        <h2 className="text-5xl font-black text-ipp-navy mb-4 font-display tracking-tight">Identity Lab</h2>
        <p className="text-gray-500 max-w-2xl mx-auto text-xl font-medium">
          Transforme lo ordinario en icónico. Visualice su marca en nuestros productos premium antes de imprimir una sola unidad.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start max-w-6xl mx-auto">
        {/* Control Panel */}
        <div className="bg-white p-8 rounded-3xl shadow-xl border border-gray-100 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-ipp-navy via-ipp-cyan to-ipp-green"></div>
          
          <div className="mb-8">
            <label className="flex items-center text-sm font-bold text-ipp-navy mb-4">
              <span className="bg-ipp-navy text-white w-6 h-6 rounded-full flex items-center justify-center mr-2 text-xs">1</span>
              El Lienzo (Subir Imagen)
            </label>
            <div 
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-gray-200 rounded-2xl p-10 text-center cursor-pointer hover:border-ipp-cyan hover:bg-gray-50 transition-all group relative overflow-hidden"
            >
              {sourceImage ? (
                <div className="relative h-56 w-full">
                   <img src={sourceImage} alt="Source" className="w-full h-full object-contain" />
                   <button 
                    onClick={(e) => { e.stopPropagation(); setSourceImage(null); }}
                    className="absolute top-0 right-0 bg-white text-gray-500 rounded-full p-2 m-2 hover:text-red-500 shadow-sm"
                   >
                     &times;
                   </button>
                </div>
              ) : (
                <div className="flex flex-col items-center text-gray-400 group-hover:text-ipp-navy transition-colors">
                  <div className="bg-gray-100 p-5 rounded-full mb-4 group-hover:bg-white group-hover:shadow-md transition-all">
                    <Upload size={28} />
                  </div>
                  <span className="font-bold text-lg">Arrastra o selecciona tu producto</span>
                  <span className="text-xs mt-1">Soporta JPG y PNG de alta resolución</span>
                </div>
              )}
              <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleImageSelect} />
            </div>
          </div>

          <div className="mb-8">
            <label className="flex items-center text-sm font-bold text-ipp-navy mb-4">
              <span className="bg-ipp-navy text-white w-6 h-6 rounded-full flex items-center justify-center mr-2 text-xs">2</span>
              La Visión (Prompt)
            </label>
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Ej: Aplica un diseño minimalista con el logo de 'Grand Hotel' en dorado metálico. Añade una textura de papel kraft premium de fondo..."
              className="w-full bg-gray-50 border-0 rounded-2xl p-5 h-36 focus:ring-2 focus:ring-ipp-cyan transition-all text-gray-700 placeholder-gray-400 resize-none font-medium"
            />
          </div>

          <button
            onClick={handleGenerate}
            disabled={!sourceImage || !prompt || isProcessing}
            className={`w-full py-5 rounded-2xl font-black text-lg flex items-center justify-center space-x-3 transition-all shadow-xl ${
              !sourceImage || !prompt || isProcessing
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed shadow-none'
                : 'bg-ipp-navy text-white hover:bg-ipp-dark hover:scale-[1.01]'
            }`}
          >
            {isProcessing ? (
              <>
                <Loader2 className="animate-spin" />
                <span>Renderizando Concepto...</span>
              </>
            ) : (
              <>
                <Layers size={20} />
                <span>Materializar Diseño</span>
              </>
            )}
          </button>
        </div>

        {/* Result Area */}
        <div className="bg-gray-900 rounded-3xl shadow-2xl p-10 min-h-[600px] flex items-center justify-center relative overflow-hidden border border-gray-800 group">
          {/* Ambient lighting */}
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-ipp-cyan/10 rounded-full blur-[100px] pointer-events-none"></div>
          <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-ipp-green/10 rounded-full blur-[80px] pointer-events-none"></div>
          
          {generatedImage ? (
            <div className="w-full relative z-10 animate-fade-in-up">
              <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                    <span className="text-gray-400 text-xs font-bold uppercase tracking-widest">Render Finalizado</span>
                  </div>
              </div>
              <img src={generatedImage} alt="Branded Result" className="w-full h-auto rounded-xl shadow-2xl border border-white/5 mb-8 transform transition-transform hover:scale-[1.02] duration-500" />
              <button 
                className="w-full bg-white text-ipp-navy font-bold py-4 rounded-xl hover:bg-gray-100 transition-colors flex items-center justify-center space-x-2 shadow-lg"
                onClick={() => {
                   const link = document.createElement('a');
                   link.href = generatedImage;
                   link.download = 'ipp-identity-lab.png';
                   link.click();
                }}
              >
                <Download size={20} />
                <span>Exportar en Alta Resolución</span>
              </button>
            </div>
          ) : (
            <div className="text-center text-gray-600 relative z-10">
              <div className="bg-white/5 p-8 rounded-full inline-block mb-6 border border-white/5 backdrop-blur-sm">
                 <Wand2 size={48} className="text-ipp-cyan opacity-50" />
              </div>
              <h3 className="text-2xl font-bold text-gray-400 mb-2 font-display">Esperando Input</h3>
              <p className="text-gray-600 font-medium">La IA está lista para visualizar su marca.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BrandingStudio;
