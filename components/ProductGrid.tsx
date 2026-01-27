
import React, { useState, useEffect } from 'react';
import { Product } from '../types';
import { PRODUCTS, CATEGORIES } from '../constants';
import { Plus, Minus, Search, Eye, X, Package, Box, AlertTriangle, CheckCircle2, ArrowRight, Filter, SlidersHorizontal, Trash2, Tag, TrendingDown, ShoppingCart, MapPin, Building2, ChevronLeft, ChevronRight, ChevronDown, ChevronUp } from 'lucide-react';

interface ProductGridProps {
  onAddToCart: (product: Product, quantity: number) => void;
}

const ProductGrid: React.FC<ProductGridProps> = ({ onAddToCart }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);
  
  // Local quantity state per product
  const [quantities, setQuantities] = useState<{[key: string]: number}>({});

  // Advanced Filters State
  const [showFilters, setShowFilters] = useState(false);
  const [stockFilter, setStockFilter] = useState<'all' | 'available' | 'low' | 'out'>('all');
  const [minOrderFilter, setMinOrderFilter] = useState<'all' | 'retail' | 'wholesale' | 'bulk'>('all');
  const [warehouseFilter, setWarehouseFilter] = useState<'all' | 'santoDomingo' | 'puntaCana'>('all');

  // Collapsible Filter Sections State
  const [collapsedSections, setCollapsedSections] = useState({
    category: false,
    warehouse: false,
    stock: false,
    minOrder: false
  });

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20;

  const getStockStatus = (stock: number) => {
    if (stock > 200) return { label: 'Disponible', color: 'text-emerald-600', dot: 'bg-emerald-500', bg: 'bg-emerald-50', icon: CheckCircle2 };
    if (stock > 0) return { label: 'Bajo Stock', color: 'text-amber-600', dot: 'bg-amber-500', bg: 'bg-amber-50', icon: AlertTriangle };
    return { label: 'Agotado', color: 'text-red-600', dot: 'bg-red-500', bg: 'bg-red-50', icon: X };
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

  const toggleSection = (section: keyof typeof collapsedSections) => {
    setCollapsedSections(prev => ({ ...prev, [section]: !prev[section] }));
  };

  // Reset page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [selectedCategory, searchQuery, stockFilter, minOrderFilter, warehouseFilter]);

  const filteredProducts = PRODUCTS.filter(p => {
    const matchesCategory = selectedCategory === 'all' || p.category === selectedCategory;
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          p.sku.toLowerCase().includes(searchQuery.toLowerCase());

    const currentStock = getProductStock(p);

    let matchesStock = true;
    if (stockFilter === 'available') matchesStock = currentStock > 200;
    else if (stockFilter === 'low') matchesStock = currentStock > 0 && currentStock <= 200;
    else if (stockFilter === 'out') matchesStock = currentStock === 0;

    let matchesMOQ = true;
    if (minOrderFilter === 'retail') matchesMOQ = p.minOrder < 10; 
    else if (minOrderFilter === 'wholesale') matchesMOQ = p.minOrder >= 10 && p.minOrder <= 100;
    else if (minOrderFilter === 'bulk') matchesMOQ = p.minOrder > 100;

    return matchesCategory && matchesSearch && matchesStock && matchesMOQ;
  });

  const activeFiltersCount = (stockFilter !== 'all' ? 1 : 0) + 
                             (minOrderFilter !== 'all' ? 1 : 0) + 
                             (selectedCategory !== 'all' ? 1 : 0) +
                             (warehouseFilter !== 'all' ? 1 : 0);

  const clearAllFilters = () => {
    setSelectedCategory('all');
    setStockFilter('all');
    setMinOrderFilter('all');
    setWarehouseFilter('all');
    setSearchQuery('');
  };

  // Pagination Logic
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedProducts = filteredProducts.slice(startIndex, startIndex + itemsPerPage);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    const grid = document.getElementById('product-grid-container');
    if (grid) {
      grid.scrollIntoView({ behavior: 'smooth' });
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // Zoom Interaction Handler
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - left) / width) * 100;
    const y = ((e.clientY - top) / height) * 100;
    e.currentTarget.style.setProperty('--x', `${x}%`);
    e.currentTarget.style.setProperty('--y', `${y}%`);
  };

  return (
    <div id="product-grid-container" className="container mx-auto px-4 py-12 bg-gray-50/50 min-h-screen">
      
      {/* Quick View Modal */}
      {quickViewProduct && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <div 
                className="absolute inset-0 bg-ipp-navy/60 backdrop-blur-md transition-opacity"
                onClick={() => setQuickViewProduct(null)}
            ></div>
            <div className="bg-white rounded-[2rem] shadow-2xl max-w-5xl w-full relative z-10 overflow-hidden flex flex-col md:flex-row animate-fade-in-up border border-white/20">
                <button 
                    onClick={() => setQuickViewProduct(null)}
                    className="absolute top-4 right-4 z-20 bg-white/80 hover:bg-white p-2 rounded-full transition-all text-gray-600 hover:text-red-500 backdrop-blur-sm"
                >
                    <X size={24} />
                </button>
                
                {/* Interactive Image Side */}
                <div 
                    className="md:w-1/2 bg-gray-50 relative h-72 md:h-auto overflow-hidden cursor-zoom-in group"
                    onMouseMove={handleMouseMove}
                    style={{ '--x': '50%', '--y': '50%' } as React.CSSProperties}
                >
                    <img 
                        src={quickViewProduct.image} 
                        alt={quickViewProduct.name} 
                        className="w-full h-full object-cover transition-transform duration-200 ease-out group-hover:scale-150 origin-[var(--x)_var(--y)]" 
                    />
                    {quickViewProduct.badge && (
                       <span className="absolute top-6 left-6 bg-ipp-green text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg uppercase tracking-wider z-10">
                         {quickViewProduct.badge}
                       </span>
                    )}
                    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/50 text-white text-[10px] px-3 py-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none backdrop-blur-sm">
                        Mover para zoom
                    </div>
                </div>

                <div className="md:w-1/2 p-8 md:p-14 flex flex-col justify-center bg-white">
                    <div className="mb-6">
                        <div className="flex justify-between items-start mb-2">
                          <span className="inline-flex items-center px-3 py-1 rounded-full bg-blue-50 text-blue-700 font-bold uppercase tracking-wider text-[10px]">
                              {quickViewProduct.category}
                          </span>
                          <span className="font-mono text-sm font-bold text-gray-500 bg-gray-100 px-2 py-1 rounded">SKU: {quickViewProduct.sku}</span>
                        </div>
                        <h2 className="text-4xl font-black text-ipp-navy mb-3 font-display leading-[1.1]">{quickViewProduct.name}</h2>
                        <div className="flex items-center space-x-2 text-sm text-gray-600 mb-6 bg-gray-50 p-2 rounded-lg inline-block">
                           <Package size={16} className="text-ipp-cyan" />
                           <span>Presentación: <strong className="text-ipp-navy">{quickViewProduct.udm}</strong></span>
                        </div>
                    </div>
                    
                    <p className="text-gray-500 mb-8 leading-relaxed text-lg font-medium">{quickViewProduct.description}</p>
                    
                    <div className="grid grid-cols-2 gap-4 mb-10">
                        <div className="p-5 bg-ipp-navy/5 rounded-2xl border border-ipp-navy/10 relative">
                            {quickViewProduct.bulkPrice && (
                                <span className="absolute -top-3 right-4 bg-ipp-cyan text-white text-[10px] font-bold px-2 py-0.5 rounded shadow-sm">
                                  Mayorista
                                </span>
                            )}
                            <span className="block font-bold text-gray-500 text-xs uppercase tracking-wide mb-1">Precio por {quickViewProduct.udm.split(' ')[0]}</span>
                            <div className="flex items-baseline space-x-2">
                              <span className="text-4xl font-black text-ipp-navy tracking-tight">${quickViewProduct.price.toFixed(2)}</span>
                              {quickViewProduct.bulkPrice && (
                                <span className="text-sm font-bold text-green-600 flex items-center">
                                  <TrendingDown size={14} className="mr-1"/> 
                                  ${quickViewProduct.bulkPrice} (+100u)
                                </span>
                              )}
                            </div>
                        </div>
                        <div className="p-5 bg-white rounded-2xl border border-gray-200">
                             <span className="block font-bold text-gray-500 text-xs uppercase tracking-wide mb-1">
                                {warehouseFilter === 'all' ? 'Stock Total' : `Stock en ${warehouseFilter === 'santoDomingo' ? 'SD' : 'PC'}`}
                             </span>
                             <div className="flex items-center space-x-2 mt-2">
                                <span className={`flex items-center text-lg font-bold ${getStockStatus(getProductStock(quickViewProduct)).color}`}>
                                    <div className={`w-3 h-3 rounded-full mr-2 ${getStockStatus(getProductStock(quickViewProduct)).dot}`}></div>
                                    {getProductStock(quickViewProduct).toLocaleString()} uds
                                </span>
                             </div>
                        </div>
                    </div>

                    <div className="flex space-x-4 mt-auto">
                        <button 
                            onClick={() => { onAddToCart(quickViewProduct, quantities[quickViewProduct.id] || quickViewProduct.minOrder); setQuickViewProduct(null); }}
                            className="w-full bg-gradient-to-r from-ipp-navy to-ipp-dark text-white font-bold py-5 rounded-xl shadow-xl shadow-ipp-navy/30 hover:shadow-ipp-navy/50 transition-all flex items-center justify-center space-x-3 transform hover:-translate-y-1 relative overflow-hidden group/btn"
                        >
                            <span className="absolute inset-0 w-full h-full bg-white/20 -translate-x-full group-hover/btn:translate-x-full transition-transform duration-700 ease-in-out skew-x-12"></span>
                            <Plus size={20} className="relative z-10" />
                            <span className="relative z-10">Añadir a Cotización</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
      )}

      {/* Header Section */}
      <div className="flex flex-col xl:flex-row justify-between items-end mb-8 space-y-8 xl:space-y-0">
        <div className="w-full xl:w-auto">
          <span className="text-xs font-bold text-ipp-cyan uppercase tracking-[0.2em] mb-3 block">Portal B2B</span>
          <h2 className="text-4xl md:text-5xl font-black text-ipp-navy font-display tracking-tight">Catálogo de Suministros</h2>
        </div>
        
        <div className="flex flex-col md:flex-row items-center w-full xl:w-auto gap-4">
          {/* Search Bar */}
          <div className="relative w-full md:w-80 group">
            <input
                type="text"
                placeholder="Buscar por nombre o SKU..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-4 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-ipp-cyan/20 focus:border-ipp-cyan bg-white group-hover:shadow-md text-sm font-medium transition-all shadow-sm"
            />
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-hover:text-ipp-cyan transition-colors" size={20} />
          </div>

          {/* Filter Toggle Button */}
          <button 
            onClick={() => setShowFilters(!showFilters)}
            className={`flex items-center space-x-2 px-6 py-4 rounded-xl font-bold text-sm transition-all border ${
              showFilters || activeFiltersCount > 0
               ? 'bg-ipp-navy text-white border-ipp-navy shadow-lg shadow-ipp-navy/20' 
               : 'bg-white text-gray-500 border-gray-200 hover:border-ipp-navy hover:text-ipp-navy'
            }`}
          >
            <SlidersHorizontal size={18} />
            <span>Filtros</span>
            {activeFiltersCount > 0 && (
               <span className="ml-2 bg-ipp-green text-white text-[10px] w-5 h-5 flex items-center justify-center rounded-full">
                 {activeFiltersCount}
               </span>
            )}
          </button>
        </div>
      </div>

      {/* Advanced Filter Panel */}
      {showFilters && (
        <div className="mb-12 bg-white rounded-2xl p-6 shadow-xl border border-gray-100 animate-fade-in-up overflow-hidden">
           <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
              <h3 className="font-bold text-ipp-navy flex items-center"><Filter size={18} className="mr-2"/> Filtros Avanzados</h3>
              <button onClick={clearAllFilters} className="text-xs font-bold text-red-500 hover:underline flex items-center">
                 <Trash2 size={12} className="mr-1"/> Limpiar Todo
              </button>
           </div>
           
           <div className="grid grid-cols-1 md:grid-cols-4 divide-y md:divide-y-0 md:divide-x divide-gray-100">
              {/* Category Filter */}
              <div className="p-6">
                 <button onClick={() => toggleSection('category')} className="w-full flex justify-between items-center mb-4 group">
                    <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest flex items-center group-hover:text-ipp-navy transition-colors">
                       <Tag size={14} className="mr-2"/> Categoría
                       {selectedCategory !== 'all' && <span className="ml-2 w-2 h-2 bg-ipp-cyan rounded-full"></span>}
                    </h4>
                    {collapsedSections.category ? <ChevronDown size={16} className="text-gray-400"/> : <ChevronUp size={16} className="text-gray-400"/>}
                 </button>
                 
                 {!collapsedSections.category && (
                    <div className="space-y-2 animate-fade-in-up">
                       <button 
                          onClick={() => setSelectedCategory('all')}
                          className={`block w-full text-left px-4 py-2 rounded-lg text-sm font-medium transition-colors ${selectedCategory === 'all' ? 'bg-ipp-navy/5 text-ipp-navy font-bold' : 'text-gray-600 hover:bg-gray-50'}`}
                       >
                          Todas las categorías
                       </button>
                       {CATEGORIES.map(cat => (
                          <button 
                             key={cat.id}
                             onClick={() => setSelectedCategory(cat.name)}
                             className={`block w-full text-left px-4 py-2 rounded-lg text-sm font-medium transition-colors ${selectedCategory === cat.name ? 'bg-ipp-navy/5 text-ipp-navy font-bold' : 'text-gray-600 hover:bg-gray-50'}`}
                          >
                             {cat.name}
                          </button>
                       ))}
                    </div>
                 )}
              </div>

              {/* Warehouse Filter */}
              <div className="p-6">
                 <button onClick={() => toggleSection('warehouse')} className="w-full flex justify-between items-center mb-4 group">
                    <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest flex items-center group-hover:text-ipp-navy transition-colors">
                       <MapPin size={14} className="mr-2"/> Almacén
                       {warehouseFilter !== 'all' && <span className="ml-2 w-2 h-2 bg-ipp-cyan rounded-full"></span>}
                    </h4>
                    {collapsedSections.warehouse ? <ChevronDown size={16} className="text-gray-400"/> : <ChevronUp size={16} className="text-gray-400"/>}
                 </button>
                 
                 {!collapsedSections.warehouse && (
                    <div className="space-y-2 animate-fade-in-up">
                       <button 
                          onClick={() => setWarehouseFilter('all')}
                          className={`block w-full text-left px-4 py-2 rounded-lg text-sm font-medium transition-colors ${warehouseFilter === 'all' ? 'bg-ipp-navy/5 text-ipp-navy font-bold' : 'text-gray-600 hover:bg-gray-50'}`}
                       >
                          Todo el Inventario
                       </button>
                       <button 
                          onClick={() => setWarehouseFilter('santoDomingo')}
                          className={`block w-full text-left px-4 py-2 rounded-lg text-sm font-medium transition-colors ${warehouseFilter === 'santoDomingo' ? 'bg-ipp-navy/5 text-ipp-navy font-bold' : 'text-gray-600 hover:bg-gray-50'}`}
                       >
                          Santo Domingo
                       </button>
                       <button 
                          onClick={() => setWarehouseFilter('puntaCana')}
                          className={`block w-full text-left px-4 py-2 rounded-lg text-sm font-medium transition-colors ${warehouseFilter === 'puntaCana' ? 'bg-ipp-navy/5 text-ipp-navy font-bold' : 'text-gray-600 hover:bg-gray-50'}`}
                       >
                          Punta Cana
                       </button>
                    </div>
                 )}
              </div>

              {/* Stock Status Filter */}
              <div className="p-6">
                 <button onClick={() => toggleSection('stock')} className="w-full flex justify-between items-center mb-4 group">
                    <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest flex items-center group-hover:text-ipp-navy transition-colors">
                       <Box size={14} className="mr-2"/> Estado de Stock
                       {stockFilter !== 'all' && <span className="ml-2 w-2 h-2 bg-ipp-cyan rounded-full"></span>}
                    </h4>
                    {collapsedSections.stock ? <ChevronDown size={16} className="text-gray-400"/> : <ChevronUp size={16} className="text-gray-400"/>}
                 </button>
                 
                 {!collapsedSections.stock && (
                    <div className="flex flex-col gap-2 animate-fade-in-up">
                       {['all', 'available', 'low', 'out'].map((status) => (
                           <button 
                              key={status}
                              onClick={() => setStockFilter(status as any)}
                              className={`w-full text-left px-4 py-2 rounded-lg text-sm border transition-all ${stockFilter === status ? 'bg-ipp-navy text-white border-ipp-navy' : 'bg-white text-gray-500 border-gray-200 hover:border-gray-400'}`}
                           >
                              {status === 'all' ? 'Todos' : status === 'available' ? 'Disponible' : status === 'low' ? 'Bajo Stock' : 'Agotado'}
                           </button>
                       ))}
                    </div>
                 )}
              </div>

              {/* Min Order Filter */}
              <div className="p-6">
                 <button onClick={() => toggleSection('minOrder')} className="w-full flex justify-between items-center mb-4 group">
                    <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest flex items-center group-hover:text-ipp-navy transition-colors">
                       <Building2 size={14} className="mr-2"/> Volumen de Orden
                       {minOrderFilter !== 'all' && <span className="ml-2 w-2 h-2 bg-ipp-cyan rounded-full"></span>}
                    </h4>
                    {collapsedSections.minOrder ? <ChevronDown size={16} className="text-gray-400"/> : <ChevronUp size={16} className="text-gray-400"/>}
                 </button>
                 
                 {!collapsedSections.minOrder && (
                    <div className="flex flex-col gap-2 animate-fade-in-up">
                       <button onClick={() => setMinOrderFilter('all')} className={`w-full text-left px-4 py-2 rounded-lg text-sm border ${minOrderFilter === 'all' ? 'bg-ipp-navy text-white' : 'bg-white text-gray-500'}`}>Cualquiera</button>
                       <button onClick={() => setMinOrderFilter('retail')} className={`w-full text-left px-4 py-2 rounded-lg text-sm border ${minOrderFilter === 'retail' ? 'bg-ipp-cyan text-white border-ipp-cyan' : 'bg-white text-gray-500'}`}>Pequeño (&lt; 10)</button>
                       <button onClick={() => setMinOrderFilter('wholesale')} className={`w-full text-left px-4 py-2 rounded-lg text-sm border ${minOrderFilter === 'wholesale' ? 'bg-ipp-navy text-white' : 'bg-white text-gray-500'}`}>Mayorista (10-100)</button>
                       <button onClick={() => setMinOrderFilter('bulk')} className={`w-full text-left px-4 py-2 rounded-lg text-sm border ${minOrderFilter === 'bulk' ? 'bg-ipp-green text-white border-ipp-green' : 'bg-white text-gray-500'}`}>Volumen Alto (&gt; 100)</button>
                    </div>
                 )}
              </div>
           </div>
        </div>
      )}

      {/* Active Filters Bar */}
      {activeFiltersCount > 0 && (
         <div className="flex flex-wrap items-center gap-3 mb-8 animate-fade-in-up">
            <span className="text-xs font-bold text-gray-400 uppercase mr-2">Filtros Activos:</span>
            
            {selectedCategory !== 'all' && (
               <div className="flex items-center bg-white border border-gray-200 text-ipp-navy text-xs font-bold px-3 py-1.5 rounded-full shadow-sm">
                  <span>Cat: {selectedCategory}</span>
                  <button onClick={() => setSelectedCategory('all')} className="ml-2 text-gray-400 hover:text-red-500"><X size={12}/></button>
               </div>
            )}

            {warehouseFilter !== 'all' && (
               <div className="flex items-center bg-white border border-gray-200 text-ipp-navy text-xs font-bold px-3 py-1.5 rounded-full shadow-sm">
                  <span>Almacén: {warehouseFilter === 'santoDomingo' ? 'Santo Domingo' : 'Punta Cana'}</span>
                  <button onClick={() => setWarehouseFilter('all')} className="ml-2 text-gray-400 hover:text-red-500"><X size={12}/></button>
               </div>
            )}
            
            {stockFilter !== 'all' && (
               <div className="flex items-center bg-white border border-gray-200 text-ipp-navy text-xs font-bold px-3 py-1.5 rounded-full shadow-sm">
                  <span>Stock: {stockFilter === 'available' ? 'Disponible' : stockFilter === 'low' ? 'Bajo' : 'Agotado'}</span>
                  <button onClick={() => setStockFilter('all')} className="ml-2 text-gray-400 hover:text-red-500"><X size={12}/></button>
               </div>
            )}

            {minOrderFilter !== 'all' && (
               <div className="flex items-center bg-white border border-gray-200 text-ipp-navy text-xs font-bold px-3 py-1.5 rounded-full shadow-sm">
                  <span>Volumen: {minOrderFilter === 'retail' ? 'Menor' : minOrderFilter === 'wholesale' ? 'Mayorista' : 'Alto'}</span>
                  <button onClick={() => setMinOrderFilter('all')} className="ml-2 text-gray-400 hover:text-red-500"><X size={12}/></button>
               </div>
            )}

            <button onClick={clearAllFilters} className="text-xs font-bold text-red-500 hover:underline ml-2 flex items-center">
               <Trash2 size={12} className="mr-1"/> Limpiar Todo
            </button>
         </div>
      )}

      {/* Products Grid - Vertical Premium Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        {paginatedProducts.map((product) => {
          const currentStock = getProductStock(product);
          const stockStatus = getStockStatus(currentStock);
          const currentQty = quantities[product.id] || product.minOrder;

          return (
            <div key={product.id} className="group bg-white rounded-2xl border border-gray-100 hover:border-ipp-cyan/30 hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 flex flex-col h-full overflow-hidden relative">
              
              {/* Image Section */}
              <div className="relative aspect-[4/5] bg-gray-50 overflow-hidden">
                 <img 
                   src={product.image} 
                   alt={product.name} 
                   className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
                 />
                 
                 {/* Badges */}
                 <div className="absolute top-3 left-3 flex flex-col gap-2">
                    {product.badge && (
                       <span className="bg-ipp-navy text-white text-[10px] font-bold px-2 py-1 rounded shadow-md uppercase tracking-wider">
                         {product.badge}
                       </span>
                    )}
                    {product.bulkPrice && (
                       <span className="bg-ipp-green text-white text-[10px] font-bold px-2 py-1 rounded shadow-md uppercase tracking-wider flex items-center">
                         <TrendingDown size={10} className="mr-1"/> Mayorista
                       </span>
                    )}
                 </div>

                 {/* Quick View Overlay */}
                 <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                    <button 
                      onClick={(e) => { e.stopPropagation(); setQuickViewProduct(product); }}
                      className="bg-white/90 backdrop-blur text-ipp-navy p-3 rounded-full shadow-lg hover:bg-ipp-cyan hover:text-white transition-all transform hover:scale-110"
                      title="Vista Rápida"
                    >
                       <Eye size={22} />
                    </button>
                 </div>
              </div>

              {/* Content Section */}
              <div className="p-5 flex flex-col flex-grow relative bg-white">
                 <div className="mb-1 flex justify-between items-start">
                    <span className="text-[10px] font-mono text-gray-400 uppercase tracking-wider">{product.sku}</span>
                    <span className={`w-2 h-2 rounded-full ${stockStatus.dot} animate-pulse`}></span>
                 </div>
                 
                 <h3 className="text-lg font-bold text-ipp-navy leading-tight mb-2 line-clamp-2 min-h-[3.2rem] group-hover:text-ipp-cyan transition-colors">
                    {product.name}
                 </h3>
                 
                 <div className="flex items-center text-xs text-gray-500 mb-4 bg-gray-50 p-1.5 rounded w-fit">
                    <Package size={12} className="mr-1.5 text-ipp-cyan" />
                    <span>{product.udm}</span>
                 </div>

                 {/* Pricing & Stock */}
                 <div className="mt-auto border-t border-gray-50 pt-4 flex items-end justify-between mb-4">
                    <div>
                        <span className="block text-[10px] text-gray-400 font-bold uppercase mb-0.5">Precio</span>
                        <span className="text-2xl font-black text-ipp-navy tracking-tight">${product.price.toFixed(2)}</span>
                    </div>
                    <div className="text-right">
                        <span className={`text-[10px] font-bold uppercase ${stockStatus.color}`}>{stockStatus.label}</span>
                        <div className="flex items-center justify-end text-xs font-bold text-gray-600">
                           {warehouseFilter !== 'all' && <MapPin size={10} className="mr-1" />}
                           {currentStock.toLocaleString()} disp.
                        </div>
                    </div>
                 </div>

                 {/* Action Bar */}
                 <div className="flex items-center gap-2">
                    <div className="flex items-center border border-gray-200 rounded-lg h-10 w-24 bg-gray-50">
                        <button 
                           onClick={(e) => { e.stopPropagation(); updateQuantity(product.id, -1, product.minOrder); }}
                           className="w-8 h-full flex items-center justify-center text-gray-400 hover:text-ipp-navy hover:bg-white rounded-l-lg transition-colors"
                        >
                           <Minus size={14} />
                        </button>
                        <div className="flex-1 text-center text-sm font-bold text-gray-700 select-none">
                           {currentQty}
                        </div>
                        <button 
                           onClick={(e) => { e.stopPropagation(); updateQuantity(product.id, 1, product.minOrder); }}
                           className="w-8 h-full flex items-center justify-center text-gray-400 hover:text-ipp-navy hover:bg-white rounded-r-lg transition-colors"
                        >
                           <Plus size={14} />
                        </button>
                    </div>
                    
                    <button 
                       onClick={(e) => { e.stopPropagation(); onAddToCart(product, currentQty); }}
                       className="flex-1 bg-ipp-navy hover:bg-ipp-green text-white h-10 rounded-lg font-bold text-sm shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 group/btn"
                    >
                       <ShoppingCart size={16} />
                       <span>Agregar</span>
                    </button>
                 </div>
              </div>
            </div>
          );
        })}
      </div>
      
      {filteredProducts.length === 0 ? (
        <div className="text-center py-32 bg-white rounded-3xl border border-dashed border-gray-200 flex flex-col items-center shadow-sm">
          <div className="bg-gray-50 p-6 rounded-full mb-4">
            <Search size={48} className="text-gray-300" />
          </div>
          <h3 className="text-2xl font-bold text-ipp-navy mb-2">No se encontraron productos</h3>
          <p className="text-gray-500 max-w-md mx-auto">
            Verifique los filtros seleccionados o intente con una búsqueda diferente.
          </p>
          <button 
            onClick={clearAllFilters}
            className="mt-6 text-ipp-cyan font-bold hover:underline"
          >
            Limpiar todos los filtros
          </button>
        </div>
      ) : (
        /* Pagination Controls */
        totalPages > 1 && (
          <div className="flex justify-center items-center space-x-2 mt-16 animate-fade-in-up">
            <button
              onClick={() => handlePageChange(Math.max(currentPage - 1, 1))}
              disabled={currentPage === 1}
              className="p-3 rounded-xl border border-gray-200 hover:bg-white hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed text-ipp-navy transition-all bg-gray-50"
            >
              <ChevronLeft size={20} />
            </button>
            
            <div className="flex space-x-2">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                <button
                  key={page}
                  onClick={() => handlePageChange(page)}
                  className={`w-10 h-10 rounded-xl text-sm font-bold transition-all ${
                    currentPage === page
                      ? 'bg-ipp-navy text-white shadow-lg shadow-ipp-navy/20 transform scale-110'
                      : 'text-gray-600 hover:bg-white hover:shadow-md bg-gray-50 border border-transparent hover:border-gray-100'
                  }`}
                >
                  {page}
                </button>
              ))}
            </div>

            <button
              onClick={() => handlePageChange(Math.min(currentPage + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="p-3 rounded-xl border border-gray-200 hover:bg-white hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed text-ipp-navy transition-all bg-gray-50"
            >
              <ChevronRight size={20} />
            </button>
          </div>
        )
      )}
    </div>
  );
};

export default ProductGrid;
