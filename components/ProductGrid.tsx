
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Product } from '../types';
import { PRODUCTS, CATEGORIES } from '../constants';
import { Plus, Minus, Search, Eye, X, Package, Box, AlertTriangle, CheckCircle2, Filter, SlidersHorizontal, Trash2, Tag, TrendingDown, ShoppingCart, MapPin, Building2, ChevronLeft, ChevronRight, ChevronDown, ChevronUp, ArrowRight, Truck, Loader2, RefreshCw, ArrowUp } from 'lucide-react';

interface ProductGridProps {
  onAddToCart: (product: Product, quantity: number) => void;
}

const ProductGrid: React.FC<ProductGridProps> = ({ onAddToCart }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);
  
  // Local quantity state per product for the grid
  const [quantities, setQuantities] = useState<{[key: string]: number}>({});

  // Advanced Filters State
  const [showFilters, setShowFilters] = useState(false);
  const [stockFilter, setStockFilter] = useState<'all' | 'available' | 'low' | 'out'>('all');
  const [warehouseFilter, setWarehouseFilter] = useState<'all' | 'santoDomingo' | 'puntaCana'>('all');

  // Infinite Scroll State
  const [visibleItemsCount, setVisibleItemsCount] = useState(8); 
  const [isMoreLoading, setIsMoreLoading] = useState(false);
  const [showBackToTop, setShowBackToTop] = useState(false);
  const sentinelRef = useRef<HTMLDivElement>(null);

  const clearAllFilters = () => {
    setSelectedCategory('all');
    setSearchQuery('');
    setStockFilter('all');
    setWarehouseFilter('all');
    setVisibleItemsCount(8);
  };

  const getProductStock = (product: Product) => {
    if (warehouseFilter === 'santoDomingo') return product.inventory?.santoDomingo ?? 0;
    if (warehouseFilter === 'puntaCana') return product.inventory?.puntaCana ?? 0;
    return product.stock;
  };

  const updateQuantity = (productId: string, delta: number, minOrder: number) => {
    setQuantities(prev => {
      const current = prev[productId] || minOrder;
      const next = Math.max(minOrder, current + delta);
      return { ...prev, [productId]: next };
    });
  };

  const filteredProducts = PRODUCTS.filter(p => {
    const matchesCategory = selectedCategory === 'all' || p.category === selectedCategory;
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          p.sku.toLowerCase().includes(searchQuery.toLowerCase());

    const currentStock = getProductStock(p);
    let matchesStock = true;
    if (stockFilter === 'available') matchesStock = currentStock > 100;
    else if (stockFilter === 'low') matchesStock = currentStock > 0 && currentStock <= 100;
    else if (stockFilter === 'out') matchesStock = currentStock === 0;

    return matchesCategory && matchesSearch && matchesStock;
  });

  const visibleProducts = filteredProducts.slice(0, visibleItemsCount);
  const hasMore = visibleItemsCount < filteredProducts.length;

  const loadMore = useCallback(() => {
    if (!hasMore || isMoreLoading) return;
    setIsMoreLoading(true);
    // Simulate a brief network delay for professional feel
    setTimeout(() => {
      setVisibleItemsCount(prev => prev + 4);
      setIsMoreLoading(false);
    }, 600);
  }, [hasMore, isMoreLoading]);

  // Observer for Infinite Scroll - Optimized for seamless loading with pre-fetching
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore) {
          loadMore();
        }
      },
      { threshold: 0.1, rootMargin: '600px' } // Pre-load even earlier (600px before reaching bottom)
    );

    const currentSentinel = sentinelRef.current;
    if (currentSentinel) {
      observer.observe(currentSentinel);
    }

    return () => {
      if (currentSentinel) observer.unobserve(currentSentinel);
      observer.disconnect();
    };
  }, [loadMore, hasMore]);

  // Back to top visibility listener
  useEffect(() => {
    const handleScroll = () => {
      setShowBackToTop(window.scrollY > 1000);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Reset count on filter change
  useEffect(() => {
    setVisibleItemsCount(8);
  }, [selectedCategory, searchQuery, stockFilter, warehouseFilter]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - left) / width) * 100;
    const y = ((e.clientY - top) / height) * 100;
    e.currentTarget.style.setProperty('--x', `${x}%`);
    e.currentTarget.style.setProperty('--y', `${y}%`);
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="container mx-auto px-4 py-16 bg-gray-50/30 min-h-screen">
      
      {/* Premium Quick View Modal */}
      {quickViewProduct && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-8">
            <div 
                className="absolute inset-0 bg-ipp-navy/80 backdrop-blur-md transition-opacity duration-500"
                onClick={() => setQuickViewProduct(null)}
            ></div>
            <div className="bg-white rounded-[2.5rem] shadow-[0_35px_60px_-15px_rgba(0,0,0,0.3)] max-w-6xl w-full relative z-10 overflow-hidden flex flex-col md:flex-row animate-fade-in-up border border-white/20">
                <button 
                    onClick={() => setQuickViewProduct(null)}
                    className="absolute top-6 right-6 z-20 bg-white/90 hover:bg-white p-3 rounded-full transition-all text-gray-500 hover:text-red-500 shadow-xl"
                >
                    <X size={24} />
                </button>
                
                <div 
                    className="md:w-1/2 bg-gray-50 relative h-80 md:h-auto overflow-hidden cursor-zoom-in group"
                    onMouseMove={handleMouseMove}
                    style={{ '--x': '50%', '--y': '50%' } as React.CSSProperties}
                >
                    <img 
                        src={quickViewProduct.image} 
                        alt={quickViewProduct.name} 
                        className="w-full h-full object-cover transition-transform duration-300 ease-out group-hover:scale-[2.5] origin-[var(--x)_var(--y)]" 
                    />
                </div>

                <div className="md:w-1/2 p-10 md:p-16 flex flex-col justify-center bg-white">
                    <div className="mb-8">
                        <div className="flex items-center space-x-3 mb-4">
                          <span className="px-3 py-1 rounded-full bg-ipp-cyan/10 text-ipp-cyan font-bold uppercase tracking-widest text-[10px]">
                              {quickViewProduct.category}
                          </span>
                          <span className="text-gray-300">|</span>
                          <span className="font-mono text-xs font-bold text-gray-400">SKU: {quickViewProduct.sku}</span>
                        </div>
                        <h2 className="text-3xl md:text-5xl font-black text-ipp-navy mb-4 font-display leading-[1.1]">{quickViewProduct.name}</h2>
                        <p className="text-gray-500 text-lg leading-relaxed mb-8">{quickViewProduct.description}</p>
                    </div>
                    
                    <div className="flex flex-col items-center justify-center py-6 mb-8 border-y-2 border-dashed border-gray-100 bg-gray-50/50 rounded-2xl">
                         <span className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-2">Precio por Unidad</span>
                         <div className="flex items-baseline space-x-1">
                             <span className="text-lg font-bold text-ipp-navy">$</span>
                             <span className="text-6xl font-black text-ipp-navy tracking-tighter">{quickViewProduct.price.toFixed(2)}</span>
                         </div>
                         <span className="text-xs font-bold text-ipp-cyan mt-2 bg-ipp-cyan/10 px-3 py-1 rounded-full">{quickViewProduct.udm}</span>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-4 mt-auto">
                        <div className="flex items-center border-2 border-gray-100 rounded-2xl h-16 px-4 bg-gray-50/50">
                            <button 
                                onClick={() => updateQuantity(quickViewProduct.id, -1, quickViewProduct.minOrder)}
                                className="w-10 h-10 flex items-center justify-center text-gray-400 hover:text-ipp-navy transition-colors"
                            >
                                <Minus size={20} />
                            </button>
                            <input 
                                type="number" 
                                value={quantities[quickViewProduct.id] || quickViewProduct.minOrder}
                                readOnly
                                className="w-16 bg-transparent text-center font-black text-ipp-navy text-lg"
                            />
                            <button 
                                onClick={() => updateQuantity(quickViewProduct.id, 1, quickViewProduct.minOrder)}
                                className="w-10 h-10 flex items-center justify-center text-gray-400 hover:text-ipp-navy transition-colors"
                            >
                                <Plus size={20} />
                            </button>
                        </div>
                        <button 
                            onClick={() => { onAddToCart(quickViewProduct, quantities[quickViewProduct.id] || quickViewProduct.minOrder); setQuickViewProduct(null); }}
                            className="flex-1 bg-ipp-navy text-white font-bold h-16 rounded-2xl shadow-2xl hover:bg-ipp-dark transition-all flex items-center justify-center space-x-3 transform active:scale-95"
                        >
                            <ShoppingCart size={20} />
                            <span>Añadir a Cotización</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
      )}

      {/* Page Header & Filters */}
      <div className="flex flex-col xl:flex-row justify-between items-end mb-12 gap-8 pt-10">
        <div>
          <div className="flex items-center space-x-3 mb-4">
             <div className="w-12 h-1.5 bg-ipp-green rounded-full shadow-[0_0_10px_rgba(140,198,63,0.5)]"></div>
             <span className="text-xs font-black text-ipp-navy uppercase tracking-[0.4em]">Integrated Supply Solutions</span>
          </div>
          <h2 className="text-5xl md:text-7xl font-black text-ipp-navy font-display tracking-tighter">Catálogo Corporativo</h2>
        </div>
        
        <div className="flex flex-col md:flex-row items-center w-full xl:w-auto gap-4">
          <div className="relative w-full md:w-[450px] group">
            <input
                type="text"
                placeholder="Busque materiales, SKUs o categorías..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-16 pr-6 py-6 rounded-[2rem] border-2 border-gray-100 focus:ring-8 focus:ring-ipp-cyan/5 focus:border-ipp-cyan bg-white transition-all shadow-xl font-bold text-ipp-navy placeholder-gray-400"
            />
            <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-ipp-cyan transition-colors" size={28} />
          </div>
          <button 
            onClick={() => setShowFilters(!showFilters)}
            className={`flex items-center space-x-3 px-10 py-6 rounded-[2rem] font-black text-sm transition-all shadow-2xl ${showFilters ? 'bg-ipp-navy text-white shadow-ipp-navy/40' : 'bg-white text-ipp-navy hover:bg-ipp-navy hover:text-white border-2 border-gray-50'}`}
          >
            <Filter size={20} />
            <span>Filtros Estratégicos</span>
          </button>
        </div>
      </div>

      {/* Collapsible Filter Panel */}
      <div className={`overflow-hidden transition-all duration-700 mb-16 ${showFilters ? 'max-h-[800px] opacity-100' : 'max-h-0 opacity-0'}`}>
         <div className="bg-white p-10 rounded-[3rem] border-4 border-gray-50 shadow-2xl grid grid-cols-1 md:grid-cols-3 gap-12">
            <div>
               <label className="block text-[11px] font-black text-gray-400 uppercase tracking-[0.3em] mb-6">Categorías de Producto</label>
               <div className="flex flex-wrap gap-2.5">
                  <button onClick={() => setSelectedCategory('all')} className={`px-5 py-3 rounded-2xl text-[11px] font-black transition-all uppercase tracking-widest ${selectedCategory === 'all' ? 'bg-ipp-navy text-white shadow-lg' : 'bg-gray-50 text-gray-500 hover:bg-gray-100'}`}>Todos</button>
                  {CATEGORIES.map(cat => (
                    <button key={cat.id} onClick={() => setSelectedCategory(cat.name)} className={`px-5 py-3 rounded-2xl text-[11px] font-black transition-all uppercase tracking-widest ${selectedCategory === cat.name ? 'bg-ipp-navy text-white shadow-lg' : 'bg-gray-50 text-gray-500 hover:bg-gray-100'}`}>{cat.name}</button>
                  ))}
               </div>
            </div>
            <div>
               <label className="block text-[11px] font-black text-gray-400 uppercase tracking-[0.3em] mb-6">Punto de Despacho</label>
               <div className="grid grid-cols-1 gap-3">
                  {['all', 'santoDomingo', 'puntaCana'].map(w => (
                    <button key={w} onClick={() => setWarehouseFilter(w as any)} className={`w-full text-left px-6 py-4 rounded-2xl text-[11px] font-black flex items-center justify-between transition-all uppercase tracking-widest ${warehouseFilter === w ? 'bg-ipp-cyan/10 text-ipp-cyan border-2 border-ipp-cyan/30' : 'bg-gray-50 text-gray-500 hover:bg-gray-100 border-2 border-transparent'}`}>
                      <span>{w === 'all' ? 'Inventario Consolidado' : w === 'santoDomingo' ? 'Santo Domingo (Central)' : 'Punta Cana (HUB)'}</span>
                      {warehouseFilter === w && <CheckCircle2 size={18} className="animate-pulse" />}
                    </button>
                  ))}
               </div>
            </div>
            <div>
               <label className="block text-[11px] font-black text-gray-400 uppercase tracking-[0.3em] mb-6">Métricas de Stock</label>
               <div className="grid grid-cols-1 gap-3">
                  {['all', 'available', 'low'].map(s => (
                    <button key={s} onClick={() => setStockFilter(s as any)} className={`w-full text-left px-6 py-4 rounded-2xl text-[11px] font-black flex items-center justify-between transition-all uppercase tracking-widest ${stockFilter === s ? 'bg-ipp-green/10 text-ipp-green border-2 border-ipp-green/30' : 'bg-gray-50 text-gray-500 hover:bg-gray-100 border-2 border-transparent'}`}>
                      <span>{s === 'all' ? 'Ver Todo el Inventario' : s === 'available' ? 'Disponibilidad Alta' : 'Alertas de Stock'}</span>
                      {stockFilter === s && <CheckCircle2 size={18} className="animate-pulse" />}
                    </button>
                  ))}
               </div>
               <button onClick={clearAllFilters} className="mt-8 text-[11px] font-black text-red-400 hover:text-red-500 uppercase tracking-widest flex items-center justify-center w-full bg-red-50 py-3 rounded-xl transition-colors">
                  <RefreshCw size={14} className="mr-2" /> Resetear Todos los Parámetros
               </button>
            </div>
         </div>
      </div>

      {/* Products Grid */}
      {visibleProducts.length > 0 ? (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {visibleProducts.map((product) => {
              const currentQty = quantities[product.id] || product.minOrder;

              return (
                <div key={product.id} className="group bg-white rounded-3xl border border-gray-100 hover:border-ipp-cyan/50 shadow-sm hover:shadow-[0_20px_50px_-12px_rgba(0,59,92,0.15)] transition-all duration-300 flex flex-col h-full overflow-hidden relative animate-fade-in-up">
                  
                  {/* Image Section */}
                  <div className="relative aspect-[4/5] bg-gray-50 overflow-hidden cursor-pointer p-4" onClick={() => setQuickViewProduct(product)}>
                     <img 
                       src={product.image} 
                       alt={product.name} 
                       className="w-full h-full object-contain mix-blend-multiply transition-transform duration-700 group-hover:scale-110" 
                     />
                     <div className="absolute inset-0 bg-ipp-navy/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center backdrop-blur-[1px]">
                        <button className="bg-white text-ipp-navy px-4 py-2 rounded-full font-bold text-xs shadow-xl hover:bg-ipp-cyan hover:text-white transition-all transform hover:scale-105 active:scale-95 flex items-center space-x-2">
                           <Eye size={14} />
                           <span>Vista Rápida</span>
                        </button>
                     </div>
                     {product.badge && (
                        <div className="absolute top-4 left-4 z-10">
                           <span className="bg-ipp-navy/90 text-white text-[9px] font-black px-2 py-1 rounded-md shadow-lg uppercase tracking-wider border border-white/10">
                             {product.badge}
                           </span>
                        </div>
                     )}
                  </div>

                  {/* Card Body */}
                  <div className="p-6 flex flex-col flex-grow">
                     
                     {/* Top Meta Info */}
                     <div className="flex justify-between items-center mb-2">
                        <span className="text-[10px] font-bold text-gray-300 uppercase tracking-widest font-mono bg-gray-50 px-2 py-0.5 rounded">{product.sku}</span>
                        <span className="text-[9px] font-bold text-ipp-cyan uppercase tracking-wider">{product.category}</span>
                     </div>

                     {/* Product Name */}
                     <h3 className="text-lg font-bold text-ipp-navy leading-[1.3] mb-4 min-h-[3rem] line-clamp-2 group-hover:text-ipp-cyan transition-colors font-display">
                        {product.name}
                     </h3>

                     {/* Price Center - Highlighted */}
                     <div className="flex flex-col items-center justify-center py-4 my-2 bg-gray-50/50 rounded-xl border border-dashed border-gray-200 group-hover:border-ipp-cyan/30 transition-colors">
                        <div className="flex items-baseline text-ipp-navy">
                            <span className="text-base font-bold mr-0.5">$</span>
                            <span className="text-4xl font-black tracking-tighter">{product.price.toFixed(2)}</span>
                        </div>
                        <div className="flex items-center text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-1">
                             <Package size={10} className="mr-1 text-ipp-cyan" />
                             Por {product.udm}
                        </div>
                     </div>

                     {/* Warehouse Availability List */}
                     <div className="mt-4 mb-6 space-y-2.5">
                        <div className="flex items-center justify-between text-xs">
                             <div className="flex items-center text-gray-500 font-medium">
                                <Building2 size={14} className="mr-2 text-ipp-navy" />
                                Santo Domingo
                             </div>
                             <div className={`font-bold px-2 py-0.5 rounded text-[10px] ${product.inventory?.santoDomingo ? 'bg-blue-50 text-ipp-navy' : 'bg-gray-100 text-gray-400'}`}>
                                {product.inventory?.santoDomingo?.toLocaleString() || 0} u.
                             </div>
                        </div>
                        <div className="flex items-center justify-between text-xs">
                             <div className="flex items-center text-gray-500 font-medium">
                                <Building2 size={14} className="mr-2 text-ipp-green" />
                                Punta Cana
                             </div>
                             <div className={`font-bold px-2 py-0.5 rounded text-[10px] ${product.inventory?.puntaCana ? 'bg-green-50 text-ipp-green' : 'bg-gray-100 text-gray-400'}`}>
                                {product.inventory?.puntaCana?.toLocaleString() || 0} u.
                             </div>
                        </div>
                     </div>

                     {/* Actions Footer */}
                     <div className="mt-auto flex items-center gap-3">
                        <div className="flex items-center border border-gray-200 rounded-xl h-12 w-28 bg-white shadow-sm hover:border-ipp-cyan/50 transition-colors">
                            <button onClick={() => updateQuantity(product.id, -1, product.minOrder)} className="w-9 h-full flex items-center justify-center text-gray-400 hover:text-ipp-navy transition-colors font-bold text-lg">-</button>
                            <div className="flex-1 text-center text-sm font-black text-ipp-navy">{currentQty}</div>
                            <button onClick={() => updateQuantity(product.id, 1, product.minOrder)} className="w-9 h-full flex items-center justify-center text-gray-400 hover:text-ipp-navy transition-colors font-bold text-lg">+</button>
                        </div>
                        <button 
                           onClick={() => onAddToCart(product, currentQty)}
                           className="flex-1 bg-ipp-navy hover:bg-ipp-green text-white h-12 rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-2 shadow-lg shadow-ipp-navy/10 transform active:scale-95 uppercase tracking-wide"
                        >
                           <ShoppingCart size={18} />
                           <span>Añadir</span>
                        </button>
                     </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Sentinel for Infinite Scroll */}
          <div ref={sentinelRef} className="h-40 w-full flex items-center justify-center mt-12">
             {isMoreLoading && (
                <div className="flex flex-col items-center space-y-4 animate-fade-in-up">
                   <div className="relative">
                      <Loader2 className="animate-spin text-ipp-cyan" size={48} />
                      <div className="absolute inset-0 flex items-center justify-center">
                         <div className="w-2 h-2 bg-ipp-green rounded-full animate-pulse"></div>
                      </div>
                   </div>
                   <span className="text-[11px] font-black text-ipp-navy uppercase tracking-[0.4em] animate-pulse">Cargando inventario...</span>
                </div>
             )}
             {!hasMore && !isMoreLoading && visibleProducts.length > 0 && (
                <div className="flex flex-col items-center space-y-4 text-gray-300">
                   <div className="w-24 h-1 bg-gray-200 rounded-full"></div>
                   <span className="text-[10px] font-black uppercase tracking-[0.2em]">Fin del Catálogo</span>
                </div>
             )}
          </div>
        </>
      ) : (
        <div className="bg-white rounded-[3rem] p-24 text-center border-2 border-gray-100 shadow-xl animate-fade-in-up">
           <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6">
              <Search size={40} className="text-gray-300" />
           </div>
           <h3 className="text-2xl font-black text-ipp-navy font-display mb-2">No se encontraron productos</h3>
           <p className="text-gray-500 max-w-md mx-auto mb-8">Intente ajustar los filtros o su término de búsqueda.</p>
           <button onClick={clearAllFilters} className="bg-ipp-navy text-white px-8 py-4 rounded-xl font-bold text-sm hover:bg-ipp-dark shadow-lg transition-all">Limpiar Filtros</button>
        </div>
      )}

      {/* Floating Back to Top Button */}
      <button 
        onClick={scrollToTop}
        className={`fixed bottom-10 right-10 z-[50] p-4 bg-ipp-navy text-white rounded-2xl shadow-2xl transition-all duration-500 transform hover:scale-110 active:scale-90 border border-white/10 ${showBackToTop ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'}`}
        title="Volver Arriba"
      >
        <ArrowUp size={24} />
      </button>
      
    </div>
  );
};

export default ProductGrid;
