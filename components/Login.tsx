
import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Lock, Mail, ArrowRight, ShieldCheck, Database } from 'lucide-react';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;

    setIsLoading(true);
    
    // Simulate API call to Backend
    setTimeout(() => {
      // Mock Data representing a client profile
      const mockUserProfile = {
        contactName: "Roberto Gómez",
        jobTitle: "Gerente de Compras",
        phone: "(809) 555-0199",
        email: email, // Use the input email
        companyName: "Grand Paradise Hotels & Resorts",
        rnc: "1-01-99999-9",
        businessType: "Hotel / Resort",
        city: "Punta Cana",
        address: "Bvld. Turístico del Este, Km 28"
      };

      login(email, mockUserProfile);
      setIsLoading(false);
      
      // Redirect to dashboard immediately after login
      navigate('/dashboard', { replace: true });
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-ipp-navy/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-ipp-cyan/5 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2 pointer-events-none"></div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md relative z-10">
        <div className="flex justify-center mb-6">
           <div className="flex items-end h-16">
                 <div className="w-5 h-[85%] bg-ipp-green transform -skew-x-12 rounded-[2px] mr-1.5 shadow-sm"></div>
                 <div className="w-6 h-[95%] bg-ipp-cyan transform -skew-x-12 rounded-[2px] mr-1.5 mb-1.5 shadow-sm"></div>
                 <div className="w-7 h-full bg-ipp-navy transform -skew-x-12 rounded-[2px] shadow-sm"></div>
                 <div className="w-7 h-full bg-ipp-navy transform -skew-x-12 rounded-[2px] ml-1.5 shadow-sm"></div>
           </div>
        </div>
        <h2 className="text-center text-3xl font-black text-ipp-navy font-display">
          Portal Clientes
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Acceso exclusivo para socios comerciales
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md relative z-10">
        <div className="bg-white py-10 px-6 shadow-2xl shadow-ipp-navy/10 sm:rounded-3xl border border-white/50 backdrop-blur-sm">
          <form className="space-y-6" onSubmit={handleLogin}>
            <div>
              <label htmlFor="email" className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
                Correo Electrónico
              </label>
              <div className="relative rounded-xl shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400" aria-hidden="true" />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="focus:ring-ipp-cyan focus:border-ipp-cyan block w-full pl-10 sm:text-sm border-gray-300 rounded-xl p-3 bg-gray-50 focus:bg-white transition-colors outline-none border"
                  placeholder="usuario@empresa.com"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
                Contraseña
              </label>
              <div className="relative rounded-xl shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" aria-hidden="true" />
                </div>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="focus:ring-ipp-cyan focus:border-ipp-cyan block w-full pl-10 sm:text-sm border-gray-300 rounded-xl p-3 bg-gray-50 focus:bg-white transition-colors outline-none border"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-4 w-4 text-ipp-navy focus:ring-ipp-cyan border-gray-300 rounded"
                />
                <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900">
                  Recordarme
                </label>
              </div>

              <div className="text-sm">
                <a href="#" className="font-medium text-ipp-cyan hover:text-ipp-navy transition-colors">
                  ¿Olvidó su contraseña?
                </a>
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex justify-center items-center py-4 px-4 border border-transparent rounded-xl shadow-lg shadow-ipp-navy/20 text-sm font-bold text-white bg-ipp-navy hover:bg-ipp-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-ipp-navy transition-all transform hover:-translate-y-0.5 disabled:opacity-70 disabled:cursor-not-allowed group"
              >
                {isLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                    <span>Iniciando sesión segura...</span>
                  </>
                ) : (
                  <>
                    <span className="mr-2">Ingresar a la Plataforma</span>
                    <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </button>
            </div>
          </form>

          <div className="mt-8 pt-6 border-t border-gray-100 flex flex-col items-center space-y-2">
            <div className="flex items-center space-x-2 text-xs text-gray-400">
               <ShieldCheck size={14} className="text-ipp-green" />
               <span>Acceso seguro encriptado SSL</span>
            </div>
          </div>
        </div>
      </div>
      
      {/* Demo helper */}
      <div className="text-center mt-6 text-xs text-gray-400">
        <p>Demo: Ingrese para cargar datos de cliente de prueba.</p>
      </div>
    </div>
  );
};

export default Login;
