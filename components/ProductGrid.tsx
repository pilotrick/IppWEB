
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Product } from '../types';
import { PRODUCTS, CATEGORIES } from '../constants';
import { Plus, Minus, Search, Eye, X, Package, Box, AlertTriangle, CheckCircle2, Filter, SlidersHorizontal, Trash2, Tag, TrendingDown, ShoppingCart, MapPin, Building2, ChevronLeft, ChevronRight, ChevronDown, ChevronUp, ArrowRight, Truck, Loader2, RefreshCw } from 'lucide-react';

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
  const sentinelRef = useRef<HTMLDivElement>(null);

  const clearAllFilters = () => {
    setSelectedCategory('all');
    setSearchQuery('');
    setStockFilter('all');
    setWarehouseFilter('all');
    setVisibleItemsCount(8);
  };

  const getStockStatus = (stock: number) => {
    if (stock > 100) return { label: 'En Stock', color: 'text-emerald-600', dot: 'bg-emerald-500', bg: 'bg-emerald-50' };
    if (stock > 0) return { label: 'Stock Limitado', color: 'text-amber-600', dot: 'bg-amber-500', bg: 'bg-amber-50' };
    return { label: 'Sin Stock', color: 'text-red-600', dot: 'bg-red-500', bg: 'bg-red-50' };
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
    // Simulate a brief network delay for UX feel
    setTimeout(() => {
      setVisibleItemsCount(prev => prev + 4);
      setIsMoreLoading(false);
    }, 600);
  }, [hasMore, isMoreLoading]);

  // Observer for Infinite Scroll
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore) {
          loadMore();
        }
      },
      { threshold: 0.1, rootMargin: '100px' }
    );

    if (sentinelRef.current) {
      observer.observe(sentinelRef.current);
    }

    return () => observer.disconnect();
  }, [loadMore, hasMore]);

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
                
                {/* Image Section with Magnification Effect */}
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
                    <div className="absolute bottom-6 left-6 flex space-x-2">
                       <span className="bg-ipp-navy text-white text-[10px] font-bold px-3 py-1.5 rounded-full uppercase tracking-widest shadow-lg">
                          Original Quality
                       </span>
                    </div>
                </div>

                {/* Content Section */}
                <div className="md:w-1/2 p-10 md:p-16 flex flex-col justify-center bg-white">
                    <div className="mb-8">
                        <div className="flex items-center space-x-3 mb-4">
                          <span className="px-3 py-1 rounded-full bg-ipp-cyan/10 text-ipp-cyan font-bold uppercase tracking-widest text-[10px]">
                              {quickViewProduct.category}
                          </span>
                          <span className="text-gray-300">|</span>
                          <span className="font-mono text-xs font-bold text-gray-400">SKU: {quickViewProduct.sku}</span>
                        </div>
                        <h2 className="text-4xl md:text-5xl font-black text-ipp-navy mb-4 font-display leading-[1.1]">{quickViewProduct.name}</h2>
                        <p className="text-gray-500 text-lg leading-relaxed mb-8">{quickViewProduct.description}</p>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-6 mb-10">
                        <div className="p-6 bg-ipp-navy/[0.03] rounded-3xl border border-ipp-navy/5">
                            <span className="block font-bold text-gray-400 text-[10px] uppercase tracking-[0.2em] mb-2">Precio Corporativo</span>
                            <div className="flex items-baseline space-x-1">
                                <span className="text-sm font-bold text-ipp-navy">$</span>
                                <span className="text-5xl font-black text-ipp-navy tracking-tighter">{quickViewProduct.price.toFixed(2)}</span>
                            </div>
                        </div>
                        <div className="p-6 bg-gray-50 rounded-3xl border border-gray-100">
                             <span className="block font-bold text-gray-400 text-[10px] uppercase tracking-[0.2em] mb-2">Disponibilidad</span>
                             <div className="flex items-center space-x-3 mt-1">
                                <div className={`w-3 h-3 rounded-full animate-pulse ${getStockStatus(getProductStock(quickViewProduct)).dot}`}></div>
                                <span className={`text-lg font-black ${getStockStatus(getProductStock(quickViewProduct)).color}`}>
                                    {getProductStock(quickViewProduct).toLocaleString()} uds
                                </span>
                             </div>
                             <p className="text-[10px] text-gray-400 font-bold mt-2 uppercase flex items-center">
                                <MapPin size={10} className="mr-1" />
                                {warehouseFilter === 'all' ? 'Red Nacional' : warehouseFilter === 'santoDomingo' ? 'SD Almacén' : 'PC Almacén'}
                             </p>
                        </div>
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

                    <div className="mt-8 pt-6 border-t border-gray-100 flex items-center space-x-6">
                        <div className="flex items-center text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                           <Truck size={14} className="mr-2 text-ipp-cyan" /> Entrega en 24h
                        </div>
                        <div className="flex items-center text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                           <Box size={14} className="mr-2 text-ipp-green" /> Almacenaje Externo
                        </div>
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
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-10">
            {visibleProducts.map((product) => {
              const currentStock = getProductStock(product);
              const stockStatus = getStockStatus(currentStock);
              const currentQty = quantities[product.id] || product.minOrder;

              return (
                <div key={product.id} className="group bg-white rounded-[2rem] border border-gray-100 hover:border-ipp-cyan/30 shadow-[0_10px_25px_-5px_rgba(0,0,0,0.02)] hover:shadow-[0_40px_80px_-15px_rgba(0,59,92,0.12)] transition-all duration-500 flex flex-col h-full overflow-hidden relative">
                  
                  {/* Part 1: Product Image (Top) */}
                  <div className="relative aspect-[4/5] bg-gray-50 overflow-hidden cursor-pointer" onClick={() => setQuickViewProduct(product)}>
                     <img 
                       src={product.image} 
                       alt={product.name} 
                       className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" 
                     />
                     
                     {/* Hover Overlay */}
                     <div className="absolute inset-0 bg-ipp-navy/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center backdrop-blur-[2px]">
                        <button className="bg-white text-ipp-navy px-6 py-3 rounded-xl font-bold text-xs shadow-xl hover:bg-ipp-cyan hover:text-white transition-all transform hover:scale-105 active:scale-95 flex items-center space-x-2">
                           <Eye size={16} />
                           <span>VISTA RÁPIDA</span>
                        </button>
                     </div>

                     {product.badge && (
                        <div className="absolute top-4 left-4 z-10">
                           <span className="bg-ipp-navy/90 backdrop-blur-md text-white text-[9px] font-black px-3 py-1.5 rounded-lg shadow-lg uppercase tracking-[0.1em] border border-white/10">
                             {product.badge}
                           </span>
                        </div>
                     )}
                  </div>

                  {/* Part 2: Product Info (Middle) */}
                  <div className="p-7 flex flex-col flex-grow">
                     {/* SKU and Stock Status */}
                     <div className="flex justify-between items-center mb-4">
                       <span className="text-[9px] font-bold text-gray-300 uppercase tracking-widest font-mono">{product.sku}</span>
                       <div className={`text-[9px] font-black uppercase ${stockStatus.color} flex items-center bg-gray-50 px-2 py-1 rounded-md border border-gray-100`}>
                          <div className={`w-1.5 h-1.5 rounded-full mr-1.5 shadow-sm ${stockStatus.dot}`}></div>
                          {stockStatus.label}
                       </div>
                     </div>

                     {/* Product Name */}
                     <h3 className="text-xl font-bold text-ipp-navy leading-[1.3] mb-4 line-clamp-2 min-h-[3.2rem] group-hover:text-ipp-cyan transition-colors font-display">
                        {product.name}
                     </h3>
                     
                     {/* Unit of Measure */}
                     <div className="flex items-center text-[10px] text-gray-400 font-bold mb-6 w-fit bg-gray-50/50 px-3 py-1.5 rounded-lg border border-gray-100 uppercase tracking-widest">
                        <Package size={12} className="mr-2 text-ipp-cyan" />
                        {product.udm}
                     </div>

                     {/* Part 3: Price and Stock metrics (Above Action) */}
                     <div className="mt-auto border-t border-gray-50 pt-6 flex items-end justify-between mb-8">
                        <div>
                            <span className="block text-[10px] text-gray-400 font-black uppercase tracking-[0.2em] mb-1">Precio Unit.</span>
                            <div className="flex items-baseline text-ipp-navy">
                               <span className="text-sm font-bold mr-0.5">$</span>
                               <span className="text-3xl font-black tracking-tight">{product.price.toFixed(2)}</span>
                            </div>
                        </div>
                        <div className="text-right">
                            <span className="text-[10px] font-bold uppercase text-gray-300 block mb-1 tracking-widest">
                                {warehouseFilter === 'all' ? 'Consolidado' : 'Distribución'}
                            </span>
                            {warehouseFilter === 'all' ? (
                                <div className="text-sm font-bold text-gray-600 flex items-baseline justify-end">
                                    {currentStock.toLocaleString()} <span className="text-[9px] text-gray-400 ml-1 font-bold">uds</span>
                                </div>
                            ) : (
                                <div className="flex flex-col items-end space-y-0.5">
                                    <div className={`text-[10px] font-bold flex items-center ${warehouseFilter === 'santoDomingo' ? 'text-ipp-navy' : 'text-gray-400'}`}>
                                        <span className="text-[8px] mr-1 uppercase opacity-50">SD:</span> 
                                        {product.inventory?.santoDomingo.toLocaleString() || 0}
                                    </div>
                                    <div className={`text-[10px] font-bold flex items-center ${warehouseFilter === 'puntaCana' ? 'text-ipp-navy' : 'text-gray-400'}`}>
                                        <span className="text-[8px] mr-1 uppercase opacity-50">PC:</span> 
                                        {product.inventory?.puntaCana.toLocaleString() || 0}
                                    </div>
                                </div>
                            )}
                        </div>
                     </div>

                     {/* Part 4: Actions (Bottom) */}
                     <div className="flex items-center gap-3">
                        <div className="flex items-center border border-gray-100 rounded-xl h-12 w-24 bg-gray-50/50 p-1">
                            <button onClick={() => updateQuantity(product.id, -1, product.minOrder)} className="w-8 h-full flex items-center justify-center text-gray-400 hover:text-ipp-navy transition-colors font-black text-lg">-</button>
                            <div className="flex-1 text-center text-xs font-black text-ipp-navy">{currentQty}</div>
                            <button onClick={() => updateQuantity(product.id, 1, product.minOrder)} className="w-8 h-full flex items-center justify-center text-gray-400 hover:text-ipp-navy transition-colors font-black text-lg">+</button>
                        </div>
                        <button 
                           onClick={() => onAddToCart(product, currentQty)}
                           className="flex-1 bg-ipp-navy hover:bg-ipp-green text-white h-12 rounded-xl font-bold text-[11px] transition-all flex items-center justify-center gap-2 shadow-lg shadow-ipp-navy/10 transform active:scale-95 uppercase tracking-[0.1em]"
                        >
                           <ShoppingCart size={16} />
                           <span>Añadir</span>
                        </button>
                     </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Sentinel for Infinite Scroll */}
          <div ref={sentinelRef} className="h-20 w-full flex items-center justify-center mt-20">
             {isMoreLoading && (
                <div className="flex flex-col items-center space-y-4 animate-fade-in-up">
                   <Loader2 className="animate-spin text-ipp-cyan" size={40} />
                   <span className="text-[11px] font-black text-gray-400 uppercase tracking-[0.3em] animate-pulse">Actualizando inventario...</span>
                </div>
             )}
             {!hasMore && (
                <div className="flex flex-col items-center space-y-4 text-gray-300">
                   <div className="w-16 h-1 bg-gray-200 rounded-full"></div>
                   <span className="text-[10px] font-black uppercase tracking-[0.4em]">Fin del Catálogo Activo</span>
                </div>
             )}
          </div>
        </>
      ) : (
        <div className="bg-white rounded-[4rem] p-32 text-center border-4 border-gray-50 shadow-2xl animate-fade-in-up">
           <div className="w-32 h-32 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-8 shadow-inner">
              <Search size={56} className="text-gray-200" />
           </div>
           <h3 className="text-4xl font-black text-ipp-navy font-display mb-4 tracking-tighter">Sin Resultados Estratégicos</h3>
           <p className="text-gray-500 max-w-lg mx-auto mb-12 text-lg font-medium leading-relaxed">No hemos encontrado productos que coincidan con sus parámetros de búsqueda. Intente con términos más amplios o contacte a un asesor.</p>
           <button onClick={clearAllFilters} className="bg-ipp-navy text-white px-10 py-5 rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-ipp-dark shadow-xl transition-all">Restaurar Búsqueda</button>
        </div>
      )}
      
    </div>
  );
};

export default ProductGrid;
