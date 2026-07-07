import { useState, useRef, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { ShoppingCart, User, Menu, X, Package, LogOut, Settings, ChevronDown, Home, Grid3X3, Info } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { useAuth } from '../context/AuthContext';

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const userMenuRef = useRef(null);
  const location = useLocation();
  const navigate = useNavigate();
  const { state } = useStore();
  const { user, logout, isAdmin } = useAuth();
  
  const cartCount = state.cart.reduce((sum, item) => sum + item.quantity, 0);

  useEffect(() => {
    function handleClickOutside(event) {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setUserMenuOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const navItems = [
    { path: '/', label: 'Home', icon: Home },
    { path: '/products', label: 'Products', icon: Grid3X3 },
    { path: '/about', label: 'About Us', icon: Info },
  ];

  const isActive = (path) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  const handleLogout = () => {
    logout();
    setUserMenuOpen(false);
    navigate('/');
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 glass border-b border-primary/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center group-hover:scale-105 transition-transform shadow-lg shadow-primary/20">
              <span className="text-white font-heading font-bold text-lg">A</span>
            </div>
            <span className="font-heading font-semibold text-lg hidden sm:block text-dark-900">
              Atlas Bridge
            </span>
          </Link>

          <nav className="hidden md:flex items-center gap-1">
            {navItems.map(({ path, label, icon: Icon }) => (
              <Link
                key={path}
                to={path}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-200 ${
                  isActive(path)
                    ? 'bg-primary/10 text-primary font-medium'
                    : 'text-dark-600 hover:bg-primary/5 hover:text-primary'
                }`}
              >
                <Icon size={18} />
                <span>{label}</span>
              </Link>
            ))}
            {user && (
              <>
                <Link
                  to="/cart"
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-200 ${
                    isActive('/cart')
                      ? 'bg-primary/10 text-primary font-medium'
                      : 'text-dark-600 hover:bg-primary/5 hover:text-primary'
                  }`}
                >
                  <ShoppingCart size={18} />
                  <span>Cart</span>
                </Link>
                {isAdmin() && (
                  <Link
                    to="/admin"
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-200 ${
                      isActive('/admin')
                        ? 'bg-primary/10 text-primary font-medium'
                        : 'text-dark-600 hover:bg-primary/5 hover:text-primary'
                    }`}
                  >
                    <Package size={18} />
                    <span>Admin</span>
                  </Link>
                )}
              </>
            )}
          </nav>

          <div className="flex items-center gap-4">
            {user && (
              <Link
                to="/cart"
                className="relative p-2 rounded-lg hover:bg-primary/5 transition-colors group"
              >
                <ShoppingCart size={22} className="text-dark-600 group-hover:text-primary transition-colors" />
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-primary text-white rounded-full text-xs flex items-center justify-center font-medium animate-bounce-in">
                    {cartCount}
                  </span>
                )}
              </Link>
            )}

            <div className="relative" ref={userMenuRef}>
              {user ? (
                <>
                  <button
                    onClick={() => setUserMenuOpen(!userMenuOpen)}
                    className="flex items-center gap-2 p-1.5 rounded-lg hover:bg-primary/5 transition-colors"
                  >
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
                      <User size={16} className="text-white" />
                    </div>
                    <span className="hidden sm:block text-sm font-medium text-dark-700">
                      {user.name}
                    </span>
                    <ChevronDown size={16} className={`text-dark-400 transition-transform ${userMenuOpen ? 'rotate-180' : ''}`} />
                  </button>

                  {userMenuOpen && (
                    <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-dark-100 overflow-hidden animate-fade-in">
                      <div className="px-4 py-3 bg-gradient-to-r from-primary/5 to-secondary/5 border-b border-dark-100">
                        <p className="font-medium text-dark-900">{user.name}</p>
                        <p className="text-sm text-dark-500">@{user.username}</p>
                        <span className={`inline-block mt-1 px-2 py-0.5 rounded text-xs font-medium ${
                          user.role === 'admin' 
                            ? 'bg-purple-100 text-purple-700' 
                            : 'bg-blue-100 text-blue-700'
                        }`}>
                          {user.role === 'admin' ? 'Admin' : 'User'}
                        </span>
                      </div>

                      <div className="py-2">
                        {isAdmin() && (
                          <Link
                            to="/admin"
                            onClick={() => setUserMenuOpen(false)}
                            className="flex items-center gap-3 px-4 py-2 text-dark-600 hover:bg-primary/5 hover:text-primary transition-colors"
                          >
                            <Settings size={18} />
                            <span>Product Admin</span>
                          </Link>
                        )}
                        <button
                          onClick={handleLogout}
                          className="w-full flex items-center gap-3 px-4 py-2 text-dark-600 hover:bg-red-50 hover:text-red-600 transition-colors"
                        >
                          <LogOut size={18} />
                          <span>Sign Out</span>
                        </button>
                      </div>
                    </div>
                  )}
                </>
              ) : (
                <Link
                  to="/login"
                  className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-primary to-secondary text-white rounded-lg font-medium hover:opacity-90 transition-opacity shadow-lg shadow-primary/20"
                >
                  <User size={18} />
                  <span>Sign In</span>
                </Link>
              )}
            </div>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-lg hover:bg-primary/5 transition-colors text-dark-600"
            >
              {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <nav className="md:hidden py-4 border-t border-primary/10 animate-fade-in">
            {navItems.map(({ path, label, icon: Icon }) => (
              <Link
                key={path}
                to={path}
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                  isActive(path)
                    ? 'bg-primary/10 text-primary font-medium'
                    : 'text-dark-600 hover:bg-primary/5'
                }`}
              >
                <Icon size={20} />
                <span>{label}</span>
              </Link>
            ))}
            {user ? (
              <>
                <Link
                  to="/cart"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-3 px-4 py-3 rounded-lg text-dark-600 hover:bg-primary/5"
                >
                  <ShoppingCart size={20} />
                  <span>Cart</span>
                  {cartCount > 0 && (
                    <span className="ml-auto px-2 py-0.5 bg-primary text-white rounded-full text-xs">
                      {cartCount}
                    </span>
                  )}
                </Link>
                {isAdmin() && (
                  <Link
                    to="/admin"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-3 px-4 py-3 rounded-lg text-dark-600 hover:bg-primary/5"
                  >
                    <Package size={20} />
                    <span>Admin</span>
                  </Link>
                )}
                <button
                  onClick={() => { handleLogout(); setMobileMenuOpen(false); }}
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-red-600 hover:bg-red-50"
                >
                  <LogOut size={20} />
                  <span>Sign Out</span>
                </button>
              </>
            ) : (
              <Link
                to="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-3 px-4 py-3 rounded-lg bg-gradient-to-r from-primary to-secondary text-white font-medium"
              >
                <User size={20} />
                <span>Sign In / Register</span>
              </Link>
            )}
          </nav>
        )}
      </div>
    </header>
  );
}
