
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { PRODUCTS } from '../constants';
import { Product } from '../types';
import { 
  CreditCard, 
  Package, 
  Clock, 
  TrendingUp, 
  FileText, 
  CheckCircle, 
  AlertCircle, 
  ArrowRight, 
  ShoppingBag, 
  Calendar,
  DollarSign,
  PieChart,
  Plus,
  ChevronRight,
  X,
  Eye,
  Download,
  Receipt,
  BarChart3,
  History,
  AlertTriangle,
  Sparkles,
  RefreshCcw,
  ShoppingCart,
  Lightbulb,
  ArrowUpRight
} from 'lucide-react';

interface DashboardProps {
  onAddToCart: (product: Product, quantity: number) => void;
}

// Mock Types for internal use
interface Invoice {
  id: string;
  date: string;
  dueDate: string;
  amount: number;
  status: 'Vencida' | 'Pendiente';
  ref: string;
}

interface InvoiceDetail extends Invoice {
  items: {
    name: string;
    sku: string;
    quantity: number;
    price: number;
    image: string;
  }[];
}

interface Payment {
  id: string;
  date: string;
  amount: number;
  method: string;
  ref: string;
}

interface OrderDetail {
  id: string;
  date: string;
  status: string;
  total: number;
  items: {
    name: string;
    sku: string;
    quantity: number;
    price: number;
    image: string;
  }[];
}

const Dashboard: React.FC<DashboardProps> = ({ onAddToCart }) => {
  const { userProfile } = useAuth();
  const navigate = useNavigate();

  // State for Modals
  const [selectedOrder, setSelectedOrder] = useState<OrderDetail | null>(null);
  const [selectedInvoice, setSelectedInvoice] = useState<InvoiceDetail | null>(null);
  const [showInvoices, setShowInvoices] = useState(false);
  const [showPayments, setShowPayments] = useState(false);
  
  // State for Chart Interactivity
  const [hoveredCategory, setHoveredCategory] = useState<{ name: string; percentage: number; amount: number; color: string } | null>(null);
  const [animateChart, setAnimateChart] = useState(false);

  useEffect(() => {
    // Trigger animation shortly after mount
    const timer = setTimeout(() => {
      setAnimateChart(true);
    }, 300);
    return () => clearTimeout(timer);
  }, []);

  // Mock Financial Data
  const financialData = {
    creditLimit: 500000,
    currentBalance: 125450,
    availableCredit: 374550,
    lastPayment: { date: '15/10/2023', amount: 45000 },
    invoicesDue: 2
  };

  // Mock Sales Data for Chart
  const salesData = [
    { month: 'Nov', value: 85000 },
    { month: 'Dic', value: 120000 },
    { month: 'Ene', value: 95000 },
    { month: 'Feb', value: 110000 },
    { month: 'Mar', value: 105000 },
    { month: 'Abr', value: 135000 },
    { month: 'May', value: 115000 },
    { month: 'Jun', value: 90000 },
    { month: 'Jul', value: 125000 },
    { month: 'Ago', value: 145000 },
    { month: 'Sep', value: 130000 },
    { month: 'Oct', value: 156000 },
  ];

  const maxSaleValue = Math.max(...salesData.map(d => d.value));

  // Mock Category Data for Trends
  const categoryStats = [
    { name: 'Vasos y Bebidas', percentage: 45, amount: 630000, color: 'bg-ipp-cyan' },
    { name: 'Empaques & Bolsas', percentage: 30, amount: 420000, color: 'bg-ipp-green' },
    { name: 'Limpieza Inst.', percentage: 15, amount: 210000, color: 'bg-blue-400' },
    { name: 'Food Service', percentage: 10, amount: 140000, color: 'bg-orange-400' },
  ];

  // Mock Invoices Data (matches Balance)
  const invoices: Invoice[] = [
    { id: 'FAC-001-998', date: '01/09/2023', dueDate: '01/10/2023', amount: 45200.00, status: 'Vencida', ref: 'ORD-2023-860' },
    { id: 'FAC-001-999', date: '15/09/2023', dueDate: '15/10/2023', amount: 80250.00, status: 'Pendiente', ref: 'ORD-2023-875' },
  ];

  // Mock Payments Data
  const payments: Payment[] = [
    { id: 'PAY-8821', date: '15/10/2023', amount: 45000.00, method: 'Transferencia Bancaria', ref: 'Banco Popular' },
    { id: 'PAY-8750', date: '30/09/2023', amount: 22500.00, method: 'Cheque', ref: 'CK-0021' },
    { id: 'PAY-8600', date: '15/09/2023', amount: 15000.00, method: 'Transferencia Bancaria', ref: 'Banco BHD' },
  ];

  // Mock Order History
  const recentOrders = [
    { id: 'ORD-2023-889', date: '24/10/2023', items: 12, total: 24500.00, status: 'En Proceso' },
    { id: 'ORD-2023-882', date: '10/10/2023', items: 5, total: 8200.50, status: 'Entregado' },
    { id: 'ORD-2023-875', date: '01/10/2023', items: 25, total: 156000.00, status: 'Entregado' },
    { id: 'ORD-2023-860', date: '28/09/2023', items: 8, total: 12400.00, status: 'Entregado' },
  ];

  // Mock Product Lists
  const lastPurchased = PRODUCTS.slice(0, 4);
  const churnedProducts = PRODUCTS.slice(3, 6); 
  const recommendedProducts = [PRODUCTS[5], PRODUCTS[2], PRODUCTS[0], PRODUCTS[3]];

  // Helper to generate mock details when an order is clicked
  const handleOrderClick = (orderSummary: any) => {
    const mockDetails: OrderDetail = {
      ...orderSummary,
      items: [
        { name: 'Vaso de Papel Térmico 12oz', sku: 'IPP-V12-001', quantity: 5, price: 45.00, image: PRODUCTS[0].image },
        { name: 'Bolsa Plástica "Camiseta" Bio', sku: 'IPP-BOL-005', quantity: 10, price: 22.50, image: PRODUCTS[1].image },
        { name: 'Limpiador Multiusos Conc.', sku: 'IPP-DET-GL', quantity: 2, price: 8.50, image: PRODUCTS[3].image },
      ]
    };
    setSelectedOrder(mockDetails);
  };

  const handleInvoiceClick = (invoice: Invoice) => {
    let items = [];
    if (invoice.id === 'FAC-001-998') {
        items = [
            { name: 'Vaso de Papel Térmico 12oz', sku: 'IPP-V12-001', quantity: 500, price: 45.00, image: PRODUCTS[0].image },
            { name: 'Bolsa Plástica "Camiseta" Bio', sku: 'IPP-BOL-005', quantity: 1000, price: 22.50, image: PRODUCTS[1].image },
             { name: 'Envase Foam 8x8', sku: 'IPP-FOAM-88', quantity: 10, price: 20.00, image: PRODUCTS[4].image }, 
        ];
    } else {
        items = [
             { name: 'Limpiador Multiusos Conc.', sku: 'IPP-DET-GL', quantity: 200, price: 8.50, image: PRODUCTS[3].image },
             { name: 'Papel Film Industrial 18"', sku: 'IPP-PVC-18', quantity: 100, price: 15.00, image: PRODUCTS[2].image },
             { name: 'Vaso Plástico PET 16oz', sku: 'IPP-PET-16', quantity: 1000, price: 55.00, image: PRODUCTS[5].image },
             { name: 'Servicio Logístico Exp', sku: 'LOG-EXP', quantity: 1, price: 10150.00, image: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?q=80&w=2070&auto=format&fit=crop' }
        ];
    }

    setSelectedInvoice({
      ...invoice,
      items: items
    });
  };

  const getStatusStyle = (status: string) => {
    switch(status) {
      case 'En Proceso': return 'bg-amber-100 text-amber-700 border-amber-200';
      case 'Entregado': return 'bg-emerald-100 text-emerald-700 border-emerald-200';
      case 'Cancelado': return 'bg-red-100 text-red-700 border-red-200';
      case 'Vencida': return 'bg-red-100 text-red-700 border-red-200';
      case 'Pendiente': return 'bg-blue-100 text-blue-700 border-blue-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  // Reusable Product Section Renderer
  const renderProductSection = (title: string, subtitle: string, products: Product[], type: 'recent' | 'churn' | 'recommended', icon: React.ReactNode, bgColor: string = "bg-white") => (
    <div className={`rounded-2xl shadow-sm border border-gray-100 p-8 animate-fade-in-up mb-10 ${bgColor}`}>
        <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-bold text-ipp-navy flex items-center">
                  <div className={`p-2 rounded-lg mr-3 ${type === 'churn' ? 'bg-red-100 text-red-600' : type === 'recommended' ? 'bg-ipp-green/10 text-ipp-green' : 'bg-gray-100 text-gray-600'}`}>
                    {icon}
                  </div>
                  {title}
              </h2>
              <p className="text-sm text-gray-500 mt-1 ml-12">{subtitle}</p>
            </div>
            {type === 'recent' && (
               <button onClick={() => navigate('/catalog')} className="text-ipp-cyan font-bold text-sm flex items-center hover:underline">
                  Ver Todo <ArrowRight size={14} className="ml-1"/>
               </button>
            )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {products.map((product) => (
            <div key={product.id} className="bg-white rounded-xl border border-gray-200 hover:border-ipp-cyan/50 hover:shadow-xl transition-all duration-300 flex flex-col group relative overflow-hidden">
                {/* Visual Header */}
                <div className="relative h-48 bg-gray-50 p-6 flex items-center justify-center overflow-hidden">
                    <img 
                      src={product.image} 
                      alt={product.name} 
                      className="h-full w-auto object-contain transition-transform duration-500 group-hover:scale-110" 
                    />
                    
                    {/* Corner Badge */}
                    <div className="absolute top-0 right-0">
                       {type === 'churn' && (
                         <div className="bg-red-500 text-white text-[10px] font-bold px-3 py-1 rounded-bl-xl shadow-sm uppercase tracking-wider">
                           Stock Bajo
                         </div>
                       )}
                       {type === 'recommended' && (
                         <div className="bg-ipp-green text-white text-[10px] font-bold px-3 py-1 rounded-bl-xl shadow-sm uppercase tracking-wider">
                           Top Venta
                         </div>
                       )}
                    </div>
                </div>

                {/* Content */}
                <div className="p-5 flex flex-col flex-grow">
                  <div className="mb-2">
                    <p className="text-[10px] text-gray-400 font-mono mb-1">{product.sku}</p>
                    <h4 className="text-base font-bold text-ipp-navy leading-tight line-clamp-2 group-hover:text-ipp-cyan transition-colors">{product.name}</h4>
                  </div>
                  
                  {type === 'recent' && (
                      <p className="text-xs text-gray-500 mb-3 flex items-center">
                         <Clock size={12} className="mr-1"/> Comprado hace 2 semanas
                      </p>
                  )}

                  <div className="mt-auto flex items-end justify-between mb-4 border-t border-gray-100 pt-3">
                      <div>
                        <span className="text-[10px] text-gray-400 font-bold uppercase block">Precio Unit.</span>
                        <span className="text-xl font-black text-ipp-navy tracking-tight">${product.price.toFixed(2)}</span>
                      </div>
                      <div className="text-right">
                         <span className="text-[10px] text-gray-400 font-bold uppercase block">Presentación</span>
                         <span className="text-xs font-bold text-gray-600">{product.udm}</span>
                      </div>
                  </div>

                  <button 
                    onClick={() => onAddToCart(product, product.minOrder || 1)}
                    className={`w-full py-3 rounded-lg font-bold text-sm shadow-md transition-all flex items-center justify-center space-x-2 transform active:scale-95
                        ${type === 'churn' 
                          ? 'bg-red-50 text-red-600 border border-red-100 hover:bg-red-600 hover:text-white' 
                          : type === 'recommended'
                          ? 'bg-ipp-green text-white hover:bg-[#7ab332]'
                          : 'bg-ipp-navy text-white hover:bg-ipp-dark'
                        }
                    `}
                  >
                      <ShoppingCart size={16} />
                      <span>{type === 'churn' ? 'Reactivar Compra' : 'Agregar'}</span>
                  </button>
                </div>
            </div>
          ))}
          
          {type === 'recent' && (
            <div 
                onClick={() => navigate('/catalog')}
                className="bg-gray-50 rounded-xl border-2 border-dashed border-gray-200 hover:border-ipp-cyan hover:bg-white transition-all cursor-pointer flex flex-col items-center justify-center p-6 min-h-[300px] group"
            >
                <div className="w-14 h-14 bg-white rounded-full flex items-center justify-center shadow-sm mb-4 group-hover:scale-110 transition-transform text-gray-300 group-hover:text-ipp-cyan">
                  <ArrowRight size={24} />
                </div>
                <h4 className="text-sm font-bold text-gray-500 group-hover:text-ipp-navy transition-colors text-center">Explorar Catálogo Completo</h4>
            </div>
          )}
        </div>
    </div>
  );

  return (
    <div className="bg-gray-50/50 min-h-screen py-8">
      <div className="container mx-auto px-4">
        
        {/* Welcome Section */}
        <div className="mb-10 flex flex-col md:flex-row md:items-center justify-between animate-fade-in-up">
          <div>
            <h1 className="text-3xl font-black text-ipp-navy font-display mb-1">
              Hola, {userProfile?.contactName?.split(' ')[0] || 'Cliente'}
            </h1>
            <p className="text-gray-500 text-sm flex items-center">
              <span className="font-bold mr-2">{userProfile?.companyName}</span>
              <span className="text-gray-300">|</span>
              <span className="ml-2">{userProfile?.businessType}</span>
            </p>
          </div>
          <div className="mt-4 md:mt-0 flex gap-3">
            <button 
              onClick={() => navigate('/catalog')}
              className="bg-ipp-navy text-white px-6 py-3 rounded-xl font-bold text-sm shadow-lg shadow-ipp-navy/20 hover:bg-ipp-dark transition-all flex items-center"
            >
              <ShoppingBag size={18} className="mr-2" />
              Nuevo Pedido
            </button>
          </div>
        </div>

        {/* Financial Overview Cards - SEPARATED & ENHANCED */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12 animate-fade-in-up">
          {/* Card 1: Balance */}
          <div 
            onClick={() => setShowInvoices(true)}
            className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 border-t-4 border-t-ipp-cyan relative overflow-hidden group hover:shadow-2xl transition-all cursor-pointer"
          >
            <div className="flex justify-between items-start mb-6">
               <div className="p-3 bg-blue-50 text-ipp-navy rounded-xl group-hover:bg-ipp-cyan group-hover:text-white transition-colors">
                 <DollarSign size={28} />
               </div>
               <span className="text-xs font-bold uppercase text-gray-400 bg-gray-50 px-3 py-1 rounded flex items-center">
                 <ArrowUpRight size={14} className="mr-1 text-ipp-cyan"/>
                 Línea de Crédito
               </span>
            </div>
            <div className="mb-4">
              <span className="text-sm text-gray-500 block mb-1 font-bold">Balance Pendiente</span>
              <h3 className="text-4xl font-black text-ipp-navy tracking-tight">${financialData.currentBalance.toLocaleString()}</h3>
            </div>
            <div className="w-full bg-gray-100 rounded-full h-3 mb-3">
               <div className="bg-ipp-cyan h-3 rounded-full" style={{ width: '25%' }}></div>
            </div>
            <p className="text-xs text-gray-500 flex justify-between items-center">
              <span><span className="text-ipp-navy font-bold">25%</span> del límite utilizado</span>
              <span className="text-ipp-cyan font-bold hover:underline bg-blue-50 px-2 py-1 rounded">Ver Detalle</span>
            </p>
          </div>

          {/* Card 2: Available */}
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 border-t-4 border-t-ipp-green relative overflow-hidden group hover:shadow-2xl transition-all">
            <div className="flex justify-between items-start mb-6">
               <div className="p-3 bg-green-50 text-green-700 rounded-xl group-hover:bg-ipp-green group-hover:text-white transition-colors">
                 <PieChart size={28} />
               </div>
               <span className="text-xs font-bold uppercase text-green-600 bg-green-50 px-3 py-1 rounded flex items-center">
                 <CheckCircle size={14} className="mr-1"/>
                 Disponible
               </span>
            </div>
            <div className="mb-4">
              <span className="text-sm text-gray-500 block mb-1 font-bold">Capacidad de Compra</span>
              <h3 className="text-4xl font-black text-ipp-navy tracking-tight">${financialData.availableCredit.toLocaleString()}</h3>
            </div>
             <p className="text-sm text-gray-500 mt-6 pt-4 border-t border-gray-100">
               Su línea de crédito está saludable. <br/>
               <span className="text-ipp-green font-bold">Sin restricciones de despacho.</span>
            </p>
          </div>

          {/* Card 3: Invoices/Payments */}
          <div 
            onClick={() => setShowPayments(true)}
            className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 border-t-4 border-t-orange-400 relative overflow-hidden group hover:shadow-2xl transition-all cursor-pointer"
          >
            <div className="flex justify-between items-start mb-6">
               <div className="p-3 bg-orange-50 text-orange-600 rounded-xl group-hover:bg-orange-500 group-hover:text-white transition-colors">
                 <FileText size={28} />
               </div>
               {financialData.invoicesDue > 0 && (
                 <span className="text-xs font-bold uppercase text-orange-600 bg-orange-50 px-3 py-1 rounded flex items-center animate-pulse">
                   <AlertCircle size={14} className="mr-1" />
                   {financialData.invoicesDue} Facturas
                 </span>
               )}
            </div>
            <div className="mb-4">
              <span className="text-sm text-gray-500 block mb-1 font-bold">Próximo Vencimiento</span>
              <h3 className="text-4xl font-black text-ipp-navy tracking-tight">30 Oct</h3>
            </div>
            <p className="text-xs text-gray-500 mt-6 pt-4 border-t border-gray-50 flex justify-between items-center">
              <span>Último pago: <span className="font-bold text-gray-700">${financialData.lastPayment.amount.toLocaleString()}</span></span>
              <span className="text-orange-500 font-bold hover:underline bg-orange-50 px-2 py-1 rounded">Historial</span>
            </p>
          </div>
        </div>

        {/* Analytics Section - Split Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12 animate-fade-in-up">
           
           {/* Monthly Volume Chart (Takes 2/3) */}
           <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
              <div className="flex justify-between items-center mb-8">
                  <div>
                    <h2 className="text-xl font-bold text-ipp-navy flex items-center">
                      <BarChart3 size={24} className="mr-3 text-ipp-cyan" />
                      Tendencias de Compra
                    </h2>
                    <p className="text-sm text-gray-500 mt-1">Análisis de los últimos 12 meses</p>
                  </div>
                  <div className="text-right">
                    <span className="inline-flex items-center px-3 py-1 rounded-full bg-emerald-50 text-emerald-600 text-xs font-bold mb-2 border border-emerald-100">
                        <TrendingUp size={12} className="mr-1" /> +12.5% vs año anterior
                    </span>
                    <div className="bg-gray-50 px-4 py-2 rounded-xl">
                       <span className="text-xs text-gray-500 block">Total Acumulado</span>
                       <span className="text-2xl font-black text-ipp-navy block">$1.4M</span>
                    </div>
                  </div>
              </div>
              
              {/* Custom SVG Bar Chart */}
              <div className="h-64 w-full flex items-end justify-between gap-3">
                  {salesData.map((data, index) => {
                    const heightPercentage = (data.value / maxSaleValue) * 100;
                    return (
                        <div key={index} className="flex flex-col items-center flex-1 h-full justify-end group cursor-pointer relative">
                          <div className="relative w-full flex justify-end flex-col h-full items-center">
                              {/* Tooltip */}
                              <div className="opacity-0 group-hover:opacity-100 absolute -top-16 transition-all duration-300 transform group-hover:-translate-y-0 scale-90 group-hover:scale-100 bg-ipp-navy text-white px-4 py-3 rounded-xl shadow-2xl z-30 min-w-[100px] pointer-events-none border border-white/10">
                                <span className="block text-[10px] text-gray-400 uppercase font-bold tracking-wider mb-0.5 flex items-center justify-between">
                                    {data.month}
                                    <span className="w-1.5 h-1.5 rounded-full bg-ipp-cyan"></span>
                                </span>
                                <span className="text-xl font-black tracking-tight block">${data.value.toLocaleString()}</span>
                                {/* Arrow */}
                                <div className="absolute top-full left-1/2 -translate-x-1/2 w-3 h-3 bg-ipp-navy transform rotate-45 -translate-y-1.5 border-r border-b border-white/10"></div>
                              </div>
                              
                              {/* Bar */}
                              <div 
                                className="w-full bg-gray-100 rounded-t-md group-hover:bg-ipp-cyan transition-all duration-[1500ms] ease-out relative overflow-hidden shadow-sm group-hover:shadow-md"
                                style={{ height: animateChart ? `${heightPercentage}%` : '0%', transitionDelay: `${index * 50}ms` }}
                              >
                                <div className="absolute bottom-0 left-0 w-full h-1/2 bg-gradient-to-t from-white/30 to-transparent"></div>
                              </div>
                          </div>
                          <span className="text-[10px] text-gray-400 font-bold mt-3 uppercase group-hover:text-ipp-navy transition-colors">{data.month}</span>
                        </div>
                    );
                  })}
              </div>
           </div>

           {/* Category Trends (Takes 1/3) */}
           <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 flex flex-col">
              <h2 className="text-xl font-bold text-ipp-navy mb-8 flex items-center">
                  <PieChart size={24} className="mr-3 text-ipp-green" />
                  Distribución
              </h2>
              
              <div className="flex flex-col items-center flex-grow justify-center">
                  {/* Donut Chart */}
                  <div className="relative w-56 h-56 mb-8 group">
                      <svg viewBox="0 0 100 100" className="transform -rotate-90 w-full h-full cursor-pointer">
                          {categoryStats.map((cat, index) => {
                              const radius = 40;
                              const circumference = 2 * Math.PI * radius;
                              const strokeDasharray = `${(cat.percentage / 100) * circumference} ${circumference}`;
                              const previousPercentage = categoryStats.slice(0, index).reduce((acc, curr) => acc + curr.percentage, 0);
                              const strokeDashoffset = -((previousPercentage / 100) * circumference);
                              const isHovered = hoveredCategory?.name === cat.name;

                              return (
                                  <circle
                                      key={index}
                                      cx="50"
                                      cy="50"
                                      r={radius}
                                      fill="transparent"
                                      stroke="currentColor"
                                      strokeWidth={isHovered ? "12" : "10"}
                                      strokeDasharray={strokeDasharray}
                                      strokeDashoffset={strokeDashoffset}
                                      strokeLinecap="round"
                                      className={`${cat.color.replace('bg-', 'text-')} transition-all duration-300 ${isHovered ? 'opacity-100 drop-shadow-md' : 'opacity-90 hover:opacity-100'}`}
                                      onMouseEnter={() => setHoveredCategory(cat)}
                                      onMouseLeave={() => setHoveredCategory(null)}
                                  />
                              );
                          })}
                      </svg>
                      
                      {/* Interactive Center Text */}
                      <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none transition-all duration-300">
                          <span className={`text-4xl font-black text-ipp-navy tracking-tighter transition-all ${hoveredCategory ? 'scale-110' : ''}`}>
                             {hoveredCategory ? `${hoveredCategory.percentage}%` : '100%'}
                          </span>
                          <span className="text-[10px] text-gray-400 uppercase font-bold tracking-widest mt-1 text-center px-4">
                             {hoveredCategory ? hoveredCategory.name : 'Mix Compra'}
                          </span>
                          {hoveredCategory && (
                              <span className="text-xs font-bold text-ipp-cyan mt-1 bg-blue-50 px-2 py-0.5 rounded animate-fade-in-up">
                                  ${(hoveredCategory.amount / 1000).toFixed(0)}k
                              </span>
                          )}
                      </div>
                  </div>

                  {/* Legend */}
                  <div className="w-full space-y-3">
                      {categoryStats.map((cat, idx) => (
                          <div 
                             key={idx} 
                             className={`flex items-center justify-between text-xs border-b border-gray-50 pb-2 last:border-0 transition-colors ${hoveredCategory?.name === cat.name ? 'bg-gray-50 rounded px-2 -mx-2' : ''}`}
                             onMouseEnter={() => setHoveredCategory(cat)}
                             onMouseLeave={() => setHoveredCategory(null)}
                          >
                              <div className="flex items-center">
                                  <div className={`w-3 h-3 rounded-full mr-3 ${cat.color}`}></div>
                                  <span className={`font-bold ${hoveredCategory?.name === cat.name ? 'text-ipp-navy' : 'text-gray-600'}`}>{cat.name}</span>
                              </div>
                              <div className="text-right">
                                  <span className="font-black text-ipp-navy text-sm">{cat.percentage}%</span>
                              </div>
                          </div>
                      ))}
                  </div>
              </div>
           </div>
        </div>

        {/* --- PRODUCT SECTIONS (SEPARATED) --- */}
        
        {renderProductSection(
          "Reabastecimiento Rápido", 
          "Basado en sus últimas órdenes", 
          lastPurchased, 
          'recent', 
          <History size={20} />
        )}

        {renderProductSection(
          "Oportunidades de Reactivación", 
          "Artículos que no ha ordenado recientemente (Riesgo de Stock)", 
          churnedProducts, 
          'churn', 
          <AlertTriangle size={20} />,
          "bg-red-50/30 border-red-100"
        )}

        {renderProductSection(
          "Sugerencias Inteligentes", 
          "Novedades recomendadas para su tipo de negocio", 
          recommendedProducts, 
          'recommended', 
          <Sparkles size={20} />,
          "bg-ipp-green/5 border-ipp-green/10"
        )}

        {/* Recent Orders Table (Moved to bottom) */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 animate-fade-in-up mb-8">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-ipp-navy flex items-center">
                <FileText size={24} className="mr-3 text-ipp-cyan" />
                Historial de Pedidos
              </h2>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="bg-gray-50 text-gray-500 font-bold uppercase text-xs">
                  <tr>
                    <th className="px-6 py-4 rounded-l-xl">Pedido #</th>
                    <th className="px-6 py-4">Fecha</th>
                    <th className="px-6 py-4">Estado</th>
                    <th className="px-6 py-4">Items</th>
                    <th className="px-6 py-4 text-right rounded-r-xl">Total</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {recentOrders.map((order) => (
                    <tr 
                    key={order.id} 
                    onClick={() => handleOrderClick(order)}
                    className="hover:bg-blue-50 transition-colors group cursor-pointer"
                    title="Click para ver detalle"
                    >
                      <td className="px-6 py-5 font-mono font-medium text-ipp-navy group-hover:text-ipp-cyan transition-colors flex items-center">
                        <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center mr-3 group-hover:bg-white group-hover:text-ipp-cyan transition-colors">
                           <Eye size={14} />
                        </div>
                        {order.id}
                      </td>
                      <td className="px-6 py-5 text-gray-500">
                        {order.date}
                      </td>
                      <td className="px-6 py-5">
                        <span className={`px-3 py-1.5 rounded-full text-[10px] font-bold uppercase border ${getStatusStyle(order.status)}`}>
                          {order.status}
                        </span>
                      </td>
                      <td className="px-6 py-5 text-gray-500">{order.items} items</td>
                      <td className="px-6 py-5 text-right font-bold text-gray-700">${order.total.toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
        </div>

      </div>

      {/* --- MODALS --- */}

      {/* Order Details Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-ipp-navy/60 backdrop-blur-sm transition-opacity" onClick={() => setSelectedOrder(null)}></div>
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full relative z-10 overflow-hidden animate-fade-in-up flex flex-col max-h-[90vh]">
             <div className="bg-gray-50 px-6 py-4 border-b border-gray-100 flex justify-between items-center">
                <div>
                   <h3 className="text-xl font-black text-ipp-navy font-display">Pedido #{selectedOrder.id}</h3>
                   <span className="text-xs text-gray-500 flex items-center mt-1">
                     <Calendar size={12} className="mr-1"/> {selectedOrder.date}
                     <span className="mx-2">|</span>
                     <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase border ${getStatusStyle(selectedOrder.status)}`}>
                        {selectedOrder.status}
                     </span>
                   </span>
                </div>
                <button onClick={() => setSelectedOrder(null)} className="text-gray-400 hover:text-red-500 bg-white p-2 rounded-full shadow-sm"><X size={20}/></button>
             </div>
             
             <div className="p-6 overflow-y-auto">
                <table className="w-full text-sm">
                   <thead className="text-gray-500 font-bold uppercase text-xs border-b border-gray-100">
                      <tr>
                         <th className="pb-3 text-left">Producto</th>
                         <th className="pb-3 text-center">Cant.</th>
                         <th className="pb-3 text-right">Precio</th>
                         <th className="pb-3 text-right">Total</th>
                      </tr>
                   </thead>
                   <tbody className="divide-y divide-gray-50">
                      {selectedOrder.items.map((item, idx) => (
                         <tr key={idx}>
                            <td className="py-3 flex items-center">
                               <div className="w-10 h-10 bg-gray-100 rounded mr-3 overflow-hidden">
                                  <img src={item.image} className="w-full h-full object-cover" alt="" />
                               </div>
                               <div>
                                  <p className="font-bold text-ipp-navy text-xs">{item.name}</p>
                                  <p className="text-[10px] text-gray-400">{item.sku}</p>
                                </div>
                            </td>
                            <td className="py-3 text-center font-bold text-gray-600">{item.quantity}</td>
                            <td className="py-3 text-right text-gray-500">${item.price.toFixed(2)}</td>
                            <td className="py-3 text-right font-bold text-ipp-navy">${(item.quantity * item.price).toFixed(2)}</td>
                         </tr>
                      ))}
                   </tbody>
                </table>
             </div>

             <div className="bg-gray-50 px-6 py-4 border-t border-gray-100 flex justify-between items-center">
                <button className="text-ipp-cyan font-bold text-sm flex items-center hover:underline">
                   <Download size={16} className="mr-2"/> Descargar Factura
                </button>
                <div className="text-right">
                   <span className="block text-xs text-gray-500 font-bold uppercase">Total Orden</span>
                   <span className="text-2xl font-black text-ipp-navy">${selectedOrder.total.toLocaleString()}</span>
                </div>
             </div>
          </div>
        </div>
      )}

      {/* Unpaid Invoices List Modal */}
      {showInvoices && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-ipp-navy/60 backdrop-blur-sm transition-opacity" onClick={() => setShowInvoices(false)}></div>
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full relative z-10 overflow-hidden animate-fade-in-up flex flex-col max-h-[90vh]">
             <div className="bg-red-50 px-6 py-4 border-b border-red-100 flex justify-between items-center">
                <div>
                   <h3 className="text-xl font-black text-red-800 font-display flex items-center">
                      <AlertCircle size={20} className="mr-2"/> Facturas Pendientes
                   </h3>
                   <p className="text-xs text-red-600 font-bold mt-1">Balance Total: ${financialData.currentBalance.toLocaleString()}</p>
                </div>
                <button onClick={() => setShowInvoices(false)} className="text-red-300 hover:text-red-500 bg-white p-2 rounded-full shadow-sm"><X size={20}/></button>
             </div>
             
             <div className="p-6 overflow-y-auto">
                {invoices.length > 0 ? (
                  <table className="w-full text-sm">
                     <thead className="text-gray-500 font-bold uppercase text-xs border-b border-gray-100">
                        <tr>
                           <th className="pb-3 text-left">Factura #</th>
                           <th className="pb-3 text-left">Vencimiento</th>
                           <th className="pb-3 text-center">Estado</th>
                           <th className="pb-3 text-right">Monto</th>
                        </tr>
                     </thead>
                     <tbody className="divide-y divide-gray-50">
                        {invoices.map((inv) => (
                           <tr key={inv.id} className="group hover:bg-gray-50">
                              <td className="py-3">
                                 <button 
                                    onClick={() => handleInvoiceClick(inv)}
                                    className="font-bold text-ipp-navy hover:text-ipp-cyan hover:underline text-left block"
                                    title="Ver Detalle de Factura"
                                 >
                                    {inv.id}
                                 </button>
                                 <p className="text-[10px] text-gray-400">Ref: {inv.ref}</p>
                              </td>
                              <td className="py-3 text-gray-600">{inv.dueDate}</td>
                              <td className="py-3 text-center">
                                 <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase border ${getStatusStyle(inv.status)}`}>
                                    {inv.status}
                                 </span>
                              </td>
                              <td className="py-3 text-right font-bold text-ipp-navy">${inv.amount.toLocaleString()}</td>
                           </tr>
                        ))}
                     </tbody>
                  </table>
                ) : (
                   <p className="text-center text-gray-500 py-8">No tiene facturas pendientes.</p>
                )}
             </div>
          </div>
        </div>
      )}

      {/* Invoice Detail Modal (Drill Down) */}
      {selectedInvoice && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-ipp-navy/60 backdrop-blur-sm transition-opacity" onClick={() => setSelectedInvoice(null)}></div>
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full relative z-10 overflow-hidden animate-fade-in-up flex flex-col max-h-[90vh]">
             <div className="bg-gray-50 px-6 py-4 border-b border-gray-100 flex justify-between items-center">
                <div>
                   <h3 className="text-xl font-black text-ipp-navy font-display">Detalle de Factura</h3>
                   <div className="flex items-center gap-2 mt-1">
                      <span className="text-sm font-bold text-gray-700">{selectedInvoice.id}</span>
                      <span className="text-gray-300">|</span>
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase border ${getStatusStyle(selectedInvoice.status)}`}>
                        {selectedInvoice.status}
                     </span>
                   </div>
                </div>
                <button onClick={() => setSelectedInvoice(null)} className="text-gray-400 hover:text-red-500 bg-white p-2 rounded-full shadow-sm"><X size={20}/></button>
             </div>
             
             <div className="p-6 overflow-y-auto">
                <div className="grid grid-cols-2 gap-4 mb-6 text-sm">
                   <div className="p-3 bg-gray-50 rounded-lg">
                      <span className="block text-[10px] text-gray-400 uppercase font-bold">Fecha Emisión</span>
                      <span className="font-bold text-ipp-navy">{selectedInvoice.date}</span>
                   </div>
                   <div className="p-3 bg-gray-50 rounded-lg">
                      <span className="block text-[10px] text-gray-400 uppercase font-bold">Fecha Vencimiento</span>
                      <span className="font-bold text-red-600">{selectedInvoice.dueDate}</span>
                   </div>
                </div>

                <table className="w-full text-sm">
                   <thead className="text-gray-500 font-bold uppercase text-xs border-b border-gray-100">
                      <tr>
                         <th className="pb-3 text-left">Concepto</th>
                         <th className="pb-3 text-center">Cant.</th>
                         <th className="pb-3 text-right">Precio</th>
                         <th className="pb-3 text-right">Subtotal</th>
                      </tr>
                   </thead>
                   <tbody className="divide-y divide-gray-50">
                      {selectedInvoice.items.map((item, idx) => (
                         <tr key={idx}>
                            <td className="py-3 flex items-center">
                               <div className="w-8 h-8 bg-gray-100 rounded mr-3 overflow-hidden flex-shrink-0">
                                  <img src={item.image} className="w-full h-full object-cover" alt="" />
                               </div>
                               <div>
                                  <p className="font-bold text-ipp-navy text-xs">{item.name}</p>
                                  <p className="text-[10px] text-gray-400">{item.sku}</p>
                               </div>
                            </td>
                            <td className="py-3 text-center font-bold text-gray-600">{item.quantity}</td>
                            <td className="py-3 text-right text-gray-500">${item.price.toFixed(2)}</td>
                            <td className="py-3 text-right font-bold text-ipp-navy">${(item.quantity * item.price).toFixed(2)}</td>
                         </tr>
                      ))}
                   </tbody>
                </table>
             </div>

             <div className="bg-gray-50 px-6 py-4 border-t border-gray-100 flex justify-between items-center">
                <button className="text-ipp-cyan font-bold text-sm flex items-center hover:underline">
                   <Download size={16} className="mr-2"/> Descargar PDF
                </button>
                <div className="text-right">
                   <span className="block text-xs text-gray-500 font-bold uppercase">Total Factura</span>
                   <span className="text-2xl font-black text-ipp-navy">${selectedInvoice.amount.toLocaleString()}</span>
                </div>
             </div>
          </div>
        </div>
      )}

      {/* Payment History Modal */}
      {showPayments && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-ipp-navy/60 backdrop-blur-sm transition-opacity" onClick={() => setShowPayments(false)}></div>
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full relative z-10 overflow-hidden animate-fade-in-up flex flex-col max-h-[90vh]">
             <div className="bg-gray-50 px-6 py-4 border-b border-gray-100 flex justify-between items-center">
                <div>
                   <h3 className="text-xl font-black text-ipp-navy font-display flex items-center">
                      <Receipt size={20} className="mr-2 text-ipp-green"/> Historial de Pagos
                   </h3>
                   <p className="text-xs text-gray-500 font-bold mt-1">Últimos movimientos registrados</p>
                </div>
                <button onClick={() => setShowPayments(false)} className="text-gray-400 hover:text-red-500 bg-white p-2 rounded-full shadow-sm"><X size={20}/></button>
             </div>
             
             <div className="p-6 overflow-y-auto">
                <table className="w-full text-sm">
                   <thead className="text-gray-500 font-bold uppercase text-xs border-b border-gray-100">
                      <tr>
                         <th className="pb-3 text-left">Recibo #</th>
                         <th className="pb-3 text-left">Fecha</th>
                         <th className="pb-3 text-left">Método</th>
                         <th className="pb-3 text-right">Monto</th>
                      </tr>
                   </thead>
                   <tbody className="divide-y divide-gray-50">
                      {payments.map((pay) => (
                         <tr key={pay.id} className="group hover:bg-gray-50">
                            <td className="py-3">
                               <p className="font-bold text-ipp-navy">{pay.id}</p>
                               <p className="text-[10px] text-gray-400">{pay.ref}</p>
                            </td>
                            <td className="py-3 text-gray-600">{pay.date}</td>
                            <td className="py-3 text-gray-600">{pay.method}</td>
                            <td className="py-3 text-right font-bold text-ipp-green">+${pay.amount.toLocaleString()}</td>
                         </tr>
                      ))}
                   </tbody>
                </table>
             </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default Dashboard;
