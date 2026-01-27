
import React from 'react';
import { MapPin, Mail, Phone, Facebook, Instagram, Linkedin } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-ipp-navy text-white pt-16 pb-8 border-t border-white/5">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          
          {/* Company Info */}
          <div>
            <div className="flex items-center mb-6">
                 {/* Mini Logo Construction */}
                 <div className="w-3 h-6 bg-ipp-green transform -skew-x-12 rounded-sm mr-1"></div>
                 <div className="w-3 h-6 bg-ipp-cyan transform -skew-x-12 rounded-sm mr-1 mt-1"></div>
                 <h3 className="text-2xl font-black font-display tracking-tight ml-2">IPP</h3>
            </div>
            <p className="text-sm text-gray-300 leading-relaxed mb-6">
              International Pack and Paper. Su operador logístico estratégico en soluciones de empaque, limpieza y suministros institucionales para todo el Caribe.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-white transition-colors"><Facebook size={20} /></a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors"><Instagram size={20} /></a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors"><Linkedin size={20} /></a>
            </div>
          </div>

          {/* Locations */}
          <div>
            <h4 className="font-bold mb-6 text-ipp-cyan">Centros de Distribución</h4>
            <div className="space-y-6">
              <div className="flex items-start space-x-3">
                <MapPin className="text-ipp-green mt-1 flex-shrink-0" size={18} />
                <div>
                  <strong className="block text-white">Santo Domingo</strong>
                  <span className="text-sm text-gray-400">Calle Profesora Elisa Bodden #2, Santo Domingo.</span>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <MapPin className="text-ipp-green mt-1 flex-shrink-0" size={18} />
                <div>
                  <strong className="block text-white">Punta Cana</strong>
                  <span className="text-sm text-gray-400">Plaza Cana Town Local 6.</span>
                </div>
              </div>
            </div>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-bold mb-6 text-ipp-cyan">Contacto Corporativo</h4>
            <ul className="space-y-4">
              <li className="flex items-center space-x-3">
                <Phone size={18} className="text-gray-400" />
                <span className="text-gray-300">+1 (809) 748-2200</span>
              </li>
              <li className="flex items-center space-x-3">
                <Mail size={18} className="text-gray-400" />
                <a href="mailto:info@ippdr.com" className="text-gray-300 hover:text-white transition-colors">info@ippdr.com</a>
              </li>
              <li className="flex items-center space-x-3">
                <span className="w-2 h-2 bg-ipp-green rounded-full shadow-[0_0_10px_rgba(140,198,63,0.5)]"></span>
                <span className="text-sm text-gray-300">Lun-Vie 8AM - 6PM</span>
              </li>
            </ul>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-bold mb-6 text-ipp-cyan">Enlaces</h4>
            <ul className="space-y-3 text-sm text-gray-300">
              <li><a href="#" className="hover:text-ipp-green transition-colors">Sobre Nosotros</a></li>
              <li><a href="#" className="hover:text-ipp-green transition-colors">Catálogo Digital</a></li>
              <li><a href="#" className="hover:text-ipp-green transition-colors">Logística</a></li>
              <li><a href="#" className="hover:text-ipp-green transition-colors">Términos y Condiciones</a></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/10 pt-8 text-center text-sm text-gray-500">
          <p>&copy; {new Date().getFullYear()} International Pack and Paper. Todos los derechos reservados.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
