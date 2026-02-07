
import { GoogleGenAI, GenerateContentResponse } from "@google/genai";
import { Product } from '../types';
import { PRODUCTS } from '../constants';

const MODEL_PRO = "gemini-3-pro-preview";
const MODEL_IMAGE = "gemini-2.5-flash-image";
const THINKING_BUDGET = 32768;

/**
 * Chat with the IPP Logistics Strategy Consultant
 * Now using Thinking Mode for complex supply chain reasoning
 */
export const sendChatMessage = async (
  history: { role: string; parts: { text: string }[] }[],
  newMessage: string,
  imageData?: string
): Promise<string> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  try {
    const systemInstruction = `
      Eres el 'Consultor Senior de Estrategia Logística' de International Pack & Paper (IPP).
      
      TU MISIÓN: Resolver problemas complejos de suministro para HORECA (Hoteles, Restaurantes, Cafeterías) en República Dominicana.
      
      CONTEXTO ESTRATÉGICO:
      - Operaciones: Santo Domingo (Central) y Punta Cana (HUB).
      - Ventaja Competitiva: Almacenaje externo, Logística Just-in-Time, Sostenibilidad (Bio-empaques).
      
      CATÁLOGO DISPONIBLE: ${JSON.stringify(PRODUCTS.map(p => `${p.name} (SKU: ${p.sku}) - $${p.price}`))}.
      
      TONO: Ejecutivo, analítico, experto y dominicano-corporativo. 
      Usa tu presupuesto de pensamiento para analizar la mejor ruta logística o mix de productos antes de responder. Analiza profundamente las implicaciones de costos y tiempos de entrega en el Caribe.
    `;

    const userParts: any[] = [{ text: newMessage }];
    if (imageData) {
      userParts.push({
        inlineData: {
          mimeType: "image/jpeg",
          data: imageData
        }
      });
    }

    const contents = [...history, { role: 'user', parts: userParts }];

    const response = await ai.models.generateContent({
      model: MODEL_PRO,
      contents: contents,
      config: {
        systemInstruction: systemInstruction,
        thinkingConfig: { thinkingBudget: THINKING_BUDGET }
      }
    });

    return response.text || "No pude procesar la consulta logística en este momento.";
  } catch (error) {
    console.error("Chat error:", error);
    return "Error de conexión con el motor de inteligencia de IPP.";
  }
};

/**
 * IPP Content Engine: Generates marketing copy with deep strategic reasoning
 */
export const generateIppMarketingContent = async (
  section: string,
  specifics: string
): Promise<string> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  try {
    const prompt = `
      Genera contenido B2B de alta conversión para IPP República Dominicana.
      Sección: ${section}
      Detalles: ${specifics}
      
      REQUISITOS ESTRATÉGICOS:
      - Enfoque en beneficios operativos (ahorro de espacio, reducción de merma).
      - Tono premium institucional.
      - Salida en HTML estructurado para Odoo/Web.
    `;

    const response = await ai.models.generateContent({
      model: MODEL_PRO,
      contents: [{ role: 'user', parts: [{ text: prompt }] }],
      config: {
        thinkingConfig: { thinkingBudget: THINKING_BUDGET }
      }
    });

    return response.text || "No se pudo generar el contenido estratégico.";
  } catch (error) {
    console.error("Content generation error:", error);
    return "Error en el motor de generación de contenido.";
  }
};

/**
 * Generate high-quality Hero image using gemini-2.5-flash-image
 * Updated with a more specific B2B e-commerce prompt including glassmorphic elements.
 */
export const generateHighQualityHero = async (): Promise<string | null> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  try {
    const response = await ai.models.generateContent({
      model: MODEL_IMAGE,
      contents: {
        parts: [
          {
            text: 'Ultra-luxury B2B e-commerce product staging. Crisp focus on high-end eco-friendly packaging: premium heavy-duty kraft bags and plant-based biodegradable cups with minimalist branding, arranged on a pristine, reflective white marble surface. The backdrop features a breathtaking, cinematic Caribbean sunrise casting golden and soft cyan hues over a state-of-the-art, clean-lined logistics port in the Dominican Republic. Seamlessly integrated into the air are subtle, elegant glassmorphic UI elements: a frosted, semi-transparent search bar with the hint "Search Products...", a delicate glowing badge for "24/7 Logistics", and a soft green LED-style stock availability indicator. Soft morning tropical light, corporate navy blue accents, photorealistic, 8k resolution, professional commercial photography, high-end corporate aesthetic.',
          },
        ],
      },
    });

    if (response.candidates?.[0]?.content?.parts) {
      for (const part of response.candidates[0].content.parts) {
        if (part.inlineData) {
          return `data:image/png;base64,${part.inlineData.data}`;
        }
      }
    }
    throw new Error("No image data returned from model");
  } catch (error: any) {
    console.warn("AI Image generation failed (Quota/429), using premium fallback:", error.message);
    return "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?q=80&w=2070&auto=format&fit=crop";
  }
};

/**
 * Visualize branding on products
 */
export const visualizeBranding = async (base64Image: string, prompt: string): Promise<string | null> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash-image",
    contents: {
      parts: [
        { text: `Integra este branding de forma realista en el producto: ${prompt}` },
        { inlineData: { mimeType: "image/jpeg", data: base64Image } }
      ]
    }
  });
  
  if (response.candidates?.[0]?.content?.parts) {
    for (const part of response.candidates[0].content.parts) {
      if (part.inlineData) return `data:image/png;base64,${part.inlineData.data}`;
    }
  }
  return null;
};
