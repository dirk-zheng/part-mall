import { useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { StoreProvider } from './context/StoreContext';
import Header from './components/Header';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import Products from './pages/Products';
import About from './pages/About';
import Cart from './pages/Cart';
import Admin from './pages/Admin';
import Login from './pages/Login';
import FloatingSupport from './components/FloatingSupport';
import { RequireAuth, RequireAdmin } from './components/ProtectedRoute';
import { MessageCircle } from 'lucide-react';

function App() {
  const [isSupportOpen, setIsSupportOpen] = useState(false);

  return (
    <BrowserRouter>
      <AuthProvider>
        <StoreProvider>
          <div className="min-h-screen flex flex-col">
            <Header />
            <main className="flex-1">
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/products" element={<Products />} />
                <Route path="/about" element={<About />} />
                <Route path="/login" element={<Login />} />
                <Route 
                  path="/cart" 
                  element={
                    <RequireAuth>
                      <Cart />
                    </RequireAuth>
                  } 
                />
                <Route 
                  path="/admin" 
                  element={
                    <RequireAdmin>
                      <Admin />
                    </RequireAdmin>
                  } 
                />
              </Routes>
            </main>
            <Footer />
            
            {/* Floating Support Button */}
            <button
              onClick={() => setIsSupportOpen(!isSupportOpen)}
              className={`fixed bottom-6 right-6 w-14 h-14 rounded-full bg-gradient-to-br from-primary to-secondary shadow-lg shadow-primary/30 flex items-center justify-center z-50 transition-all hover:scale-110 hover:shadow-xl hover:shadow-primary/40 ${
                isSupportOpen ? 'rotate-90' : ''
              }`}
            >
              {isSupportOpen ? (
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <MessageCircle size={26} className="text-white" />
              )}
            </button>

            {/* Floating Support Panel */}
            <FloatingSupport 
              isOpen={isSupportOpen} 
              onClose={() => setIsSupportOpen(false)} 
            />
          </div>
        </StoreProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
