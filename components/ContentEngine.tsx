
import React, { useState } from 'react';
import { generateIppMarketingContent } from '../services/geminiService';
import { Layout, FileText, Search, Sparkles, Copy, CheckCircle, Loader2, Globe, ArrowRight, BrainCircuit } from 'lucide-react';

const ContentEngine: React.FC = () => {
  const [section, setSection] = useState('Home');
  const [specifics, setSpecifics] = useState('');
  const [result, setResult] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleGenerate = async () => {
    if (!specifics || isLoading) return;
    setIsLoading(true);
    setResult('');
    try {
      const content = await generateIppMarketingContent(section, specifics);
      setResult(content);
    } catch (e) {
      console.error(e);
      setResult("Error en la generación profunda de contenido. Intente de nuevo.");
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(result);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const sections = [
    { id: 'Home', label: 'Página de Inicio', icon: Globe },
    { id: 'Services', label: 'Servicios/Catálogo', icon: Layout },
    { id: 'Blog', label: 'Artículo de Blog', icon: FileText },
    { id: 'SEO', label: 'SEO & Metadatos', icon: Search }
  ];

  return (
    <div className="container mx-auto px-4 py-12 bg-gray-50 min-h-screen">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center space-x-4 mb-8">
          <div className="p-3 bg-ipp-navy text-white rounded-2xl shadow-lg relative group">
            <Sparkles size={32} />
            <div className="absolute -top-1 -right-1 w-4 h-4 bg-ipp-green rounded-full animate-ping"></div>
          </div>
          <div>
            <h1 className="text-4xl font-black text-ipp-navy font-display">IPP Content Engine</h1>
            <p className="text-gray-500 font-medium">Generador de contenido estratégico con razonamiento avanzado (32k Thinking Budget).</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Controls */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
              <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">Seleccionar Área</label>
              <div className="space-y-2">
                {sections.map(s => (
                  <button
                    key={s.id}
                    onClick={() => setSection(s.id)}
                    className={`w-full flex items-center space-x-3 p-4 rounded-xl font-bold text-sm transition-all border ${
                      section === s.id ? 'bg-ipp-navy text-white border-ipp-navy shadow-lg' : 'bg-gray-50 text-gray-600 border-transparent hover:bg-gray-100'
                    }`}
                  >
                    <s.icon size={18} />
                    <span>{s.label}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
              <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">Instrucciones Específicas</label>
              <textarea
                value={specifics}
                onChange={(e) => setSpecifics(e.target.value)}
                placeholder="Ej: Describe los vasos de 12oz para un hotel en Punta Cana enfocándote en sostenibilidad..."
                className="w-full bg-gray-50 rounded-xl p-4 h-40 text-sm focus:ring-2 focus:ring-ipp-cyan outline-none border-none resize-none font-medium"
              />
              <button
                onClick={handleGenerate}
                disabled={isLoading || !specifics}
                className="w-full mt-6 bg-ipp-green text-white font-bold py-4 rounded-xl flex items-center justify-center space-x-2 shadow-lg shadow-ipp-green/20 hover:bg-[#7ab332] transition-all disabled:opacity-50 group"
              >
                {isLoading ? <Loader2 className="animate-spin" /> : <Sparkles size={18} className="group-hover:rotate-12 transition-transform" />}
                <span>{isLoading ? 'Razonando...' : 'Generar Contenido'}</span>
              </button>
            </div>
          </div>

          {/* Result Output */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden min-h-[500px] flex flex-col relative">
              <div className="bg-gray-50 p-4 border-b border-gray-100 flex justify-between items-center">
                <span className="text-xs font-bold text-ipp-navy uppercase tracking-widest flex items-center">
                  <FileText size={14} className="mr-2" /> Resultado del Motor IA
                </span>
                {result && (
                  <button
                    onClick={copyToClipboard}
                    className="flex items-center space-x-2 text-xs font-bold text-ipp-cyan hover:bg-white px-3 py-1.5 rounded-lg border border-transparent hover:border-ipp-cyan transition-all"
                  >
                    {copied ? <CheckCircle size={14} /> : <Copy size={14} />}
                    <span>{copied ? 'Copiado' : 'Copiar HTML'}</span>
                  </button>
                )}
              </div>
              <div className="flex-grow p-8 bg-white overflow-y-auto relative">
                {isLoading ? (
                  <div className="h-full flex flex-col items-center justify-center text-gray-400 space-y-6">
                    <div className="relative">
                      <Loader2 className="animate-spin w-16 h-16 text-ipp-cyan" strokeWidth={1.5} />
                      <BrainCircuit size={24} className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-ipp-navy animate-pulse" />
                    </div>
                    <div className="text-center space-y-2">
                       <p className="font-black text-ipp-navy text-sm uppercase tracking-[0.2em] animate-pulse">Deep Reasoning active</p>
                       <p className="text-xs text-gray-400 font-bold italic">Elaborando estrategia de marketing con presupuesto de 32k tokens...</p>
                    </div>
                  </div>
                ) : result ? (
                  <div className="prose prose-sm max-w-none font-mono text-gray-700 bg-gray-50 p-6 rounded-2xl border border-gray-100 whitespace-pre-wrap animate-fade-in-up">
                    {result}
                  </div>
                ) : (
                  <div className="h-full flex flex-col items-center justify-center text-gray-300">
                    <Sparkles size={64} className="mb-4 opacity-10" />
                    <p className="font-bold text-lg">Esperando Instrucciones</p>
                    <p className="text-sm">Configure su solicitud a la izquierda para comenzar.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContentEngine;
