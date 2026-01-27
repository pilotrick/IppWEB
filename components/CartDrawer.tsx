
import React from 'react';
import { X, Minus, Plus, ShoppingBag, Trash2, ArrowRight, Package } from 'lucide-react';
import { CartItem } from '../types';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onRemove: (id: string) => void;
  onUpdateQuantity: (id: string, delta: number) => void;
  onCheckout: () => void;
}

const CartDrawer: React.FC<CartDrawerProps> = ({ isOpen, onClose, items, onRemove, onUpdateQuantity, onCheckout }) => {
  const total = items.reduce((acc, item) => acc + (item.price * item.quantity), 0);

  return (
    <>
      {/* Backdrop */}
      <div 
        className={`fixed inset-0 bg-ipp-navy/60 backdrop-blur-sm z-[60] transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={onClose}
      />

      {/* Drawer */}
      <div className={`fixed top-0 right-0 h-full w-full max-w-md bg-white z-[70] shadow-2xl transform transition-transform duration-300 flex flex-col ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        
        {/* Header */}
        <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-white">
          <div className="flex items-center space-x-2">
            <ShoppingBag className="text-ipp-navy" size={24} />
            <h2 className="text-xl font-black text-ipp-navy font-display">Tu Carrito ({items.length})</h2>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
            <X size={24} className="text-gray-500" />
          </button>
        </div>

        {/* Items */}
        <div className="flex-grow overflow-y-auto p-6 space-y-6">
          {items.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center space-y-4 opacity-50">
              <ShoppingBag size={64} className="text-gray-300" />
              <p className="text-lg font-medium text-gray-500">Tu carrito está vacío</p>
              <button onClick={onClose} className="text-ipp-cyan font-bold hover:underline">Continuar comprando</button>
            </div>
          ) : (
            items.map(item => (
              <div key={item.id} className="flex space-x-4 animate-fade-in-up">
                <div className="w-20 h-20 bg-gray-50 rounded-lg overflow-hidden flex-shrink-0 border border-gray-100">
                  <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                </div>
                <div className="flex-grow flex flex-col justify-between">
                  <div>
                    <h3 className="font-bold text-ipp-navy line-clamp-1">{item.name}</h3>
                    <div className="flex items-center text-xs text-gray-500 space-x-2 mt-1">
                       <span>{item.sku}</span>
                       <span className="text-gray-300">|</span>
                       <span className="flex items-center"><Package size={10} className="mr-1"/> {item.udm}</span>
                    </div>
                  </div>
                  <div className="flex justify-between items-end mt-2">
                    <div className="flex items-center space-x-3 bg-gray-50 rounded-lg p-1">
                      <button onClick={() => onUpdateQuantity(item.id, -1)} className="p-1 hover:bg-white rounded shadow-sm transition-all"><Minus size={14} /></button>
                      <span className="text-sm font-bold w-12 text-center">{item.quantity.toLocaleString()}</span>
                      <button onClick={() => onUpdateQuantity(item.id, 1)} className="p-1 hover:bg-white rounded shadow-sm transition-all"><Plus size={14} /></button>
                    </div>
                    <div className="text-right">
                       <p className="font-bold text-ipp-navy">${(item.price * item.quantity).toFixed(2)}</p>
                       <button onClick={() => onRemove(item.id)} className="text-[10px] text-red-500 font-bold hover:underline flex items-center justify-end mt-1">
                         <Trash2 size={10} className="mr-1" /> Eliminar
                       </button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="p-6 border-t border-gray-100 bg-gray-50">
            <div className="flex justify-between mb-4 text-lg font-bold text-ipp-navy">
              <span>Total Estimado</span>
              <span>${total.toFixed(2)}</span>
            </div>
            <p className="text-xs text-gray-500 mb-4 text-center">Precios sujetos a volumen y cotización final.</p>
            <button 
              onClick={onCheckout}
              className="w-full bg-ipp-green hover:bg-[#7ab332] text-white font-bold py-4 rounded-xl shadow-lg shadow-ipp-green/20 transition-all active:scale-95 flex items-center justify-center space-x-2"
            >
              <span>Solicitar Cotización</span>
              <ArrowRight size={20} />
            </button>
          </div>
        )}
      </div>
    </>
  );
};

export default CartDrawer;
