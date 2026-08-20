import { Link } from 'react-router-dom';
import { Mail, Phone } from 'lucide-react';

//渲染:渲染Footer组件或页面内容
export default function Footer() {
  return (
    <footer className="bg-white/80 border-t border-dark-200 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
                <span className="text-white font-heading font-bold">D</span>
              </div>
              <span className="font-heading font-semibold text-dark-900">Driveline Wheels</span>
            </div>
            <p className="text-dark-500 text-sm leading-relaxed">
              A practical wheel trading team rooted in Guangzhou Yongning. We help with local-market fitments, random-carton on-site QC, flexible orders and export documents.
            </p>
          </div>

          <div>
            <h4 className="font-heading font-medium mb-4 text-dark-900">Quick Links</h4>
            <div className="flex flex-col gap-2">
              <Link to="/" className="text-dark-500 hover:text-primary transition-colors text-sm">
                Home
              </Link>
              <Link to="/products" className="text-dark-500 hover:text-primary transition-colors text-sm">
                Wheels & Tires
              </Link>
              <Link to="/about" className="text-dark-500 hover:text-primary transition-colors text-sm">
                About Us
              </Link>
              <Link to="/news-blog/" className="text-dark-500 hover:text-primary transition-colors text-sm">
                Technical & Buying Insights
              </Link>
              <Link to="/faq" className="text-dark-500 hover:text-primary transition-colors text-sm">
                Buyer FAQ
              </Link>
              <Link to="/services/quality-control" className="text-dark-500 hover:text-primary transition-colors text-sm">
                Pre-shipment QC
              </Link>
              <Link to="/contact" className="text-dark-500 hover:text-primary transition-colors text-sm">
                Request a Quote
              </Link>
            </div>
          </div>

          <div>
            <h4 className="font-heading font-medium mb-4 text-dark-900">Contact Us</h4>
            <div className="flex flex-col gap-3">
              <a href="tel:+86-20-8888-6688" className="flex items-center gap-2 text-dark-500 hover:text-primary transition-colors text-sm">
                <Phone size={16} />
                +86-20-8888-6688
              </a>
              <a href="mailto:info@driveline-global.com" className="flex items-center gap-2 text-dark-500 hover:text-primary transition-colors text-sm">
                <Mail size={16} />
                info@driveline-global.com
              </a>
              <Link to="/services/mixed-container-orders" className="text-dark-500 hover:text-primary transition-colors text-sm">Mixed-container orders</Link>
              <Link to="/services/export-documents" className="text-dark-500 hover:text-primary transition-colors text-sm">Export documents</Link>
            </div>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-dark-200 text-center">
          <p className="text-dark-400 text-sm">
            &copy; 2026 Driveline Wheels. Yongning, Guangzhou, China. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
