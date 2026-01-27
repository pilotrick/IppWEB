
export interface Product {
  id: string;
  name: string;
  category: string;
  description: string;
  price: number;
  image: string;
  minOrder: number;
  sku: string;
  stock: number; // Total stock
  inventory?: {
    santoDomingo: number;
    puntaCana: number;
  };
  udm: string; // Unidad de Medida (e.g., 'Caja', 'Paquete', 'Unidad')
  badge?: string;
  bulkPrice?: number;
}

export interface CartItem extends Product {
  quantity: number;
}

export enum MessageRole {
  USER = 'user',
  MODEL = 'model',
  SYSTEM = 'system'
}

export interface ChatMessage {
  id: string;
  role: MessageRole;
  text: string;
  image?: string; // Base64 or URL
  isThinking?: boolean;
}
