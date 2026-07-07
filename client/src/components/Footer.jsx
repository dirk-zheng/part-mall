import { Link } from 'react-router-dom';
import { Github, Mail, Phone } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-white/80 border-t border-dark-200 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
                <span className="text-white font-heading font-bold">A</span>
              </div>
              <span className="font-heading font-semibold text-dark-900">Atlas Bridge</span>
            </div>
            <p className="text-dark-500 text-sm leading-relaxed">
              Your trusted partner in global trade. We source, ship, and deliver quality products across borders with unmatched reliability.
            </p>
          </div>

          <div>
            <h4 className="font-heading font-medium mb-4 text-dark-900">Quick Links</h4>
            <div className="flex flex-col gap-2">
              <Link to="/" className="text-dark-500 hover:text-primary transition-colors text-sm">
                Home
              </Link>
              <Link to="/products" className="text-dark-500 hover:text-primary transition-colors text-sm">
                Products
              </Link>
              <Link to="/about" className="text-dark-500 hover:text-primary transition-colors text-sm">
                About Us
              </Link>
              <Link to="/cart" className="text-dark-500 hover:text-primary transition-colors text-sm">
                Cart
              </Link>
            </div>
          </div>

          <div>
            <h4 className="font-heading font-medium mb-4 text-dark-900">Contact Us</h4>
            <div className="flex flex-col gap-3">
              <a href="tel:+86-755-8888-6688" className="flex items-center gap-2 text-dark-500 hover:text-primary transition-colors text-sm">
                <Phone size={16} />
                +86-755-8888-6688
              </a>
              <a href="mailto:info@atlasbridge.com" className="flex items-center gap-2 text-dark-500 hover:text-primary transition-colors text-sm">
                <Mail size={16} />
                info@atlasbridge.com
              </a>
              <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-dark-500 hover:text-primary transition-colors text-sm">
                <Github size={16} />
                GitHub
              </a>
            </div>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-dark-200 text-center">
          <p className="text-dark-400 text-sm">
            &copy; 2026 Atlas Bridge International. All rights reserved. Powered by CodeBuddy SDK
          </p>
        </div>
      </div>
    </footer>
  );
}
