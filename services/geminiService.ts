import { GoogleGenAI, GenerateContentResponse } from "@google/genai";
import { Product } from '../types';
import { PRODUCTS } from '../constants';

const apiKey = process.env.API_KEY;
// Initialize with safety check, though implementation assumes key is present in env
const ai = new GoogleGenAI({ apiKey: apiKey || 'dummy-key' });

/**
 * Chat with the AI Assistant using Gemini 3 Pro for reasoning.
 */
export const sendChatMessage = async (
  history: { role: string; parts: { text: string }[] }[],
  newMessage: string,
  imageData?: string
): Promise<string> => {
  if (!apiKey) return "Error: API Key faltante.";

  try {
    const modelId = "gemini-3-pro-preview";
    
    // Construct the context about the company
    const systemInstruction = `
      Eres el 'Consultor de Experiencias' de International Pack & Paper (IPP). No eres un simple vendedor, eres un experto en elevar la experiencia del cliente a través del empaque y la higiene.
      
      Tono de voz: Creativo, sofisticado, persuasivo y experto. Usa lenguaje sensorial.
      
      Misión: Ayudar a hoteles, restaurantes y clínicas del Caribe a transformar insumos básicos en ventajas competitivas.
      
      Catálogo actual (referencia):
      ${JSON.stringify(PRODUCTS.map(p => `${p.name} (SKU: ${p.sku}) - Precio: $${p.price} por ${p.udm} - Stock: ${p.stock}`))}
      
      Si te preguntan por productos, no solo des características, vende el beneficio emocional y la experiencia.
      Ejemplo: En lugar de "Vaso de plástico", di "La transparencia cristalina que tus cócteles merecen".
      
      Si te envían una foto, analiza el estilo y sugiere cómo los productos de IPP pueden mejorar esa presentación.
    `;

    const contents = [];
    
    // Add history (simplified for single-turn or simple context management in this demo)
    // In a real app, we'd map the full ChatMessage history to the API format properly.
    
    const userParts: any[] = [{ text: newMessage }];
    
    if (imageData) {
      userParts.push({
        inlineData: {
          mimeType: "image/jpeg", // Assuming jpeg for simplicity, strictly should detect
          data: imageData
        }
      });
    }

    const response = await ai.models.generateContent({
      model: modelId,
      contents: [
        { role: 'user', parts: userParts }
      ],
      config: {
        systemInstruction: systemInstruction,
        thinkingConfig: { thinkingBudget: 32768 } // Max budget for Gemini 3 Pro
      }
    });

    return response.text || "Lo siento, mi creatividad se ha pausado momentáneamente. ¿Podrías repetir eso?";

  } catch (error) {
    console.error("Error calling Gemini:", error);
    return "Hubo un error de conexión con el consultor inteligente.";
  }
};

/**
 * Edit an image using Gemini 2.5 Flash Image (Nano Banana) to visualize branding.
 * Example: "Add the IPP logo to this cup"
 */
export const visualizeBranding = async (
  base64Image: string,
  prompt: string
): Promise<string | null> => {
  if (!apiKey) return null;

  try {
    // Nano Banana / Flash Image for editing
    const modelId = "gemini-2.5-flash-image"; 
    
    const response = await ai.models.generateContent({
      model: modelId,
      contents: {
        parts: [
          {
            text: `Actúa como un diseñador gráfico senior. Edita esta imagen para integrar branding corporativo de forma fotorrealista y artística: ${prompt}. La iluminación y las texturas deben ser perfectas.`,
          },
          {
            inlineData: {
              mimeType: "image/jpeg",
              data: base64Image
            }
          }
        ]
      }
    });

    // Extract image from response
    // Iterate through parts to find the inline data
    if (response.candidates && response.candidates[0].content.parts) {
      for (const part of response.candidates[0].content.parts) {
        if (part.inlineData && part.inlineData.data) {
          return `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
        }
      }
    }
    
    return null;

  } catch (error) {
    console.error("Error generating branding:", error);
    throw error;
  }
};

/**
 * Generates a hero image for the landing page showing products in a Caribbean setting.
 */
export const generateHeroImage = async (): Promise<string | null> => {
  if (!apiKey) return null;

  try {
    // Use gemini-2.5-flash-image for generation (Nano Banana)
    const modelId = "gemini-2.5-flash-image";
    // Improved prompt for a high-end commercial look matching the user's "Golden Hour / Caribbean" request
    const prompt = "A high-end commercial product photography shot of eco-friendly disposable food containers and paper cups stacked elegantly on a rustic wooden table. In the background, out of focus, is a stunning Caribbean beach during golden hour with warm sunlight and palm trees. The lighting is cinematic, highlighting the texture of the packaging. 8k resolution, photorealistic, advertising quality.";

    const response = await ai.models.generateContent({
      model: modelId,
      contents: {
        parts: [{ text: prompt }]
      }
    });

    if (response.candidates && response.candidates[0].content.parts) {
      for (const part of response.candidates[0].content.parts) {
        if (part.inlineData && part.inlineData.data) {
          return `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
        }
      }
    }
    
    return null;

  } catch (error) {
    console.error("Error generating hero image:", error);
    return null;
  }
};