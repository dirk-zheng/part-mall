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
import SupportWidget from './components/SupportWidget';
import { RequireAuth, RequireAdmin } from './components/ProtectedRoute';

function App() {
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

            {/* Floating Support FAB + Chat Panel */}
            <SupportWidget />
          </div>
        </StoreProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
