
import { Product } from './types';

export const COMPANY_NAME = "International Pack & Paper";
export const TAGLINE = "Su Aliado Estratégico en Suministros";

export const CATEGORIES = [
  { id: 'cups', name: 'Vasos y Bebidas', image: 'https://images.unsplash.com/photo-1596627883253-b46325510006?q=80&w=2070&auto=format&fit=crop' },
  { id: 'bags', name: 'Fundas y Empaques', image: 'https://images.unsplash.com/photo-1627894220790-a33504856f43?q=80&w=1974&auto=format&fit=crop' },
  { id: 'cleaning', name: 'Limpieza Institucional', image: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?q=80&w=2070&auto=format&fit=crop' },
  { id: 'foodservice', name: 'Food Service', image: 'https://images.unsplash.com/photo-1589133867087-b9522204555b?q=80&w=2070&auto=format&fit=crop' },
];

export const PRODUCTS: Product[] = [
  {
    id: '1',
    sku: 'IPP-V12-001',
    name: 'Vaso de Papel Térmico 12oz',
    category: 'Vasos y Bebidas',
    description: 'Vaso de papel blanco premium con recubrimiento para bebidas calientes. Ideal para cafeterías y servicio de desayuno en hoteles.',
    price: 45.00,
    bulkPrice: 42.00,
    udm: 'Caja 1,000u',
    stock: 150,
    inventory: { santoDomingo: 100, puntaCana: 50 },
    image: 'https://images.unsplash.com/photo-1577937927133-66ef06acdf18?q=80&w=1974&auto=format&fit=crop',
    minOrder: 1,
    badge: 'Más Vendido'
  },
  {
    id: '2',
    sku: 'IPP-BOL-005',
    name: 'Bolsa Plástica "Camiseta" Bio',
    category: 'Fundas y Empaques',
    description: 'Bolsa tipo camiseta resistente para supermercados y retail. Material con aditivo biodegradable.',
    price: 22.50,
    bulkPrice: 20.00,
    udm: 'Millar (1,000u)',
    stock: 500,
    inventory: { santoDomingo: 300, puntaCana: 200 },
    image: 'https://images.unsplash.com/photo-1598460613867-2780e04770ce?q=80&w=1974&auto=format&fit=crop',
    minOrder: 5,
    badge: 'Eco Friendly'
  },
  {
    id: '3',
    sku: 'IPP-PVC-18',
    name: 'Papel Film Industrial 18"',
    category: 'Food Service',
    description: 'Rollo de papel film PVC grado alimenticio de alta adherencia para protección de alimentos en cocinas industriales.',
    price: 15.00,
    udm: 'Rollo 1,500ft',
    stock: 85,
    inventory: { santoDomingo: 80, puntaCana: 5 },
    image: 'https://images.unsplash.com/photo-1628155930542-4c74092d5c4a?q=80&w=2070&auto=format&fit=crop',
    minOrder: 1
  },
  {
    id: '4',
    sku: 'IPP-DET-GL',
    name: 'Limpiador Multiusos Conc.',
    category: 'Limpieza Institucional',
    description: 'Detergente líquido concentrado para pisos y superficies. Alta eficiencia para limpieza profunda en hoteles y clínicas.',
    price: 8.50,
    bulkPrice: 7.95,
    udm: 'Galón',
    stock: 200,
    inventory: { santoDomingo: 100, puntaCana: 100 },
    image: 'https://images.unsplash.com/photo-1585751119414-ef2636f8aede?q=80&w=2070&auto=format&fit=crop',
    minOrder: 4,
    badge: 'Alta Eficiencia'
  },
  {
    id: '5',
    sku: 'IPP-FOAM-88',
    name: 'Envase Foam 8x8 con Tapa',
    category: 'Food Service',
    description: 'Contenedor térmico de poliestireno (Foam) de 3 divisiones o liso. Estándar para servicio de comida para llevar.',
    price: 18.00,
    udm: 'Paquete 200u',
    stock: 320,
    inventory: { santoDomingo: 120, puntaCana: 200 },
    image: 'https://images.unsplash.com/photo-1533755497276-80252115592c?q=80&w=2070&auto=format&fit=crop',
    minOrder: 1
  },
   {
    id: '6',
    sku: 'IPP-PET-16',
    name: 'Vaso Plástico PET 16oz',
    category: 'Vasos y Bebidas',
    description: 'Vaso liso transparente de alta rigidez para jugos, batidos y bebidas frías. Excelente presentación visual.',
    price: 55.00,
    udm: 'Caja 1,000u',
    stock: 45,
    inventory: { santoDomingo: 0, puntaCana: 45 },
    image: 'https://images.unsplash.com/photo-1623945032549-3435c249339e?q=80&w=1974&auto=format&fit=crop',
    minOrder: 1,
    badge: 'Premium'
  },
];
