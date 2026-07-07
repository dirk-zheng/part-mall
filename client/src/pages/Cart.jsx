import { Link } from 'react-router-dom';
import { Minus, Plus, Trash2, ShoppingBag, ArrowLeft, CreditCard, Truck } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { useState } from 'react';

export default function Cart() {
  const { state, removeFromCart, updateQuantity, clearCart } = useStore();
  const [showSuccess, setShowSuccess] = useState(false);

  const totalPrice = state.cart.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );

  const shippingFee = totalPrice > 500 ? 0 : 20;
  const finalPrice = totalPrice + shippingFee;

  const handleQuantityChange = async (productId, newQuantity) => {
    if (newQuantity < 1) return;
    try {
      await updateQuantity(productId, newQuantity);
    } catch (err) {
      alert('Failed to update quantity');
    }
  };

  const handleRemove = async (productId) => {
    try {
      await removeFromCart(productId);
    } catch (err) {
      alert('Failed to remove item');
    }
  };

  const handleClearCart = async () => {
    if (window.confirm('Are you sure you want to clear your cart?')) {
      try {
        await clearCart();
      } catch (err) {
        alert('Failed to clear cart');
      }
    }
  };

  const handleCheckout = () => {
    setShowSuccess(true);
    setTimeout(async () => {
      setShowSuccess(false);
      try {
        await clearCart();
      } catch (err) {}
    }, 3000);
  };

  if (state.cart.length === 0) {
    return (
      <div className="min-h-screen pt-20 pb-12 flex items-center justify-center bg-gradient-to-b from-white to-blue-50">
        <div className="text-center animate-fade-in">
          <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-white border border-dark-200 flex items-center justify-center shadow-lg">
            <ShoppingBag size={48} className="text-dark-300" />
          </div>
          <h2 className="text-2xl font-heading font-bold mb-3 text-dark-900">Your cart is empty</h2>
          <p className="text-dark-500 mb-6">Explore our product catalog and find what you need!</p>
          <Link
            to="/products"
            className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-xl font-medium hover:bg-primary/90 transition-colors shadow-lg shadow-primary/20 btn-glow"
          >
            <ArrowLeft size={18} />
            Browse Products
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-20 pb-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="font-heading text-3xl font-bold text-dark-900">My Cart</h1>
            <p className="text-dark-500 mt-1">{state.cart.length} item{state.cart.length > 1 ? 's' : ''}</p>
          </div>
          <button
            onClick={handleClearCart}
            className="flex items-center gap-2 px-4 py-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
          >
            <Trash2 size={18} />
            Clear All
          </button>
        </div>

        {/* Cart Items */}
        <div className="space-y-4 mb-8">
          {state.cart.map((item, index) => (
            <div
              key={item.product.id}
              className="flex gap-4 p-4 bg-white rounded-2xl border border-dark-200 animate-slide-up shadow-sm"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <img
                src={item.product.image}
                alt={item.product.name}
                className="w-24 h-24 rounded-xl object-cover"
                onError={(e) => {
                  e.target.src = 'https://via.placeholder.com/96/f1f5f9/94a3b8?text=No';
                }}
              />

              <div className="flex-1 min-w-0">
                <h3 className="font-heading font-medium text-lg mb-1 truncate text-dark-900">
                  {item.product.name}
                </h3>
                <p className="text-dark-500 text-sm mb-2">
                  {item.product.description}
                </p>
                <div className="font-mono text-primary text-lg font-semibold">
                  ${item.product.price.toLocaleString()}
                </div>
              </div>

              <div className="flex flex-col items-end justify-between">
                <button
                  onClick={() => handleRemove(item.product.id)}
                  className="p-2 text-dark-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                >
                  <Trash2 size={18} />
                </button>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleQuantityChange(item.product.id, item.quantity - 1)}
                    disabled={item.quantity <= 1}
                    className="w-8 h-8 rounded-lg bg-dark-100 flex items-center justify-center hover:bg-dark-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-dark-600"
                  >
                    <Minus size={16} />
                  </button>
                  <span className="w-8 text-center font-mono text-dark-900">{item.quantity}</span>
                  <button
                    onClick={() => handleQuantityChange(item.product.id, item.quantity + 1)}
                    className="w-8 h-8 rounded-lg bg-dark-100 flex items-center justify-center hover:bg-dark-200 transition-colors text-dark-600"
                  >
                    <Plus size={16} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Order Summary */}
        <div className="bg-white rounded-2xl border border-dark-200 p-6 animate-slide-up shadow-sm">
          <h3 className="font-heading font-semibold text-lg mb-4 text-dark-900">Order Summary</h3>

          <div className="space-y-3 mb-6">
            <div className="flex justify-between text-dark-600">
              <span>Subtotal</span>
              <span className="font-mono">${totalPrice.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-dark-600">
              <span className="flex items-center gap-2">
                <Truck size={16} />
                Shipping
              </span>
              <span className="font-mono">
                {shippingFee === 0 ? 'Free' : `$${shippingFee}`}
              </span>
            </div>
            {shippingFee > 0 && (
              <p className="text-xs text-dark-400">Free shipping on orders over $500</p>
            )}
            <div className="pt-3 border-t border-dark-200 flex justify-between">
              <span className="font-heading font-semibold text-dark-900">Total</span>
              <span className="font-mono text-2xl font-bold text-primary">
                ${finalPrice.toLocaleString()}
              </span>
            </div>
          </div>

          <button
            onClick={handleCheckout}
            className="w-full flex items-center justify-center gap-2 py-4 bg-gradient-to-r from-primary to-secondary text-white rounded-xl font-semibold text-lg hover:opacity-90 transition-opacity shadow-lg shadow-primary/20 btn-glow"
          >
            <CreditCard size={20} />
            Checkout
          </button>
        </div>
      </div>

      {/* Success Modal */}
      {showSuccess && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-2xl p-8 text-center max-w-sm mx-4 animate-bounce-in shadow-2xl">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-green-100 flex items-center justify-center">
              <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h3 className="font-heading text-xl font-bold mb-2 text-dark-900">Order Placed!</h3>
            <p className="text-dark-500">Thank you for your order. We'll ship your items shortly.</p>
          </div>
        </div>
      )}
    </div>
  );
}
