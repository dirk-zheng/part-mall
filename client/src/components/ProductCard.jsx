import { useState } from 'react';
import { ShoppingCart, Check, Smartphone, Laptop, Cable, Watch, Headphones } from 'lucide-react';
import { useStore } from '../context/StoreContext';

const categoryIcons = {
  phone: Smartphone,
  computer: Laptop,
  accessory: Cable,
  wearable: Watch,
  audio: Headphones,
};

const categoryColors = {
  phone: 'bg-blue-100 text-blue-600 border-blue-200',
  computer: 'bg-purple-100 text-purple-600 border-purple-200',
  accessory: 'bg-green-100 text-green-600 border-green-200',
  wearable: 'bg-orange-100 text-orange-600 border-orange-200',
  audio: 'bg-pink-100 text-pink-600 border-pink-200',
};

const categoryNames = {
  phone: 'Phone',
  computer: 'Computer',
  accessory: 'Accessory',
  wearable: 'Wearable',
  audio: 'Audio',
};

export default function ProductCard({ product }) {
  const { addToCart } = useStore();
  const [isAdded, setIsAdded] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const handleAddToCart = async (e) => {
    e.preventDefault();
    try {
      await addToCart(product);
      setIsAdded(true);
      setTimeout(() => setIsAdded(false), 2000);
    } catch (err) {
      alert(err.message || 'Failed to add item. Please sign in first');
    }
  };

  const CategoryIcon = categoryIcons[product.category] || Smartphone;

  return (
    <div
      className={`group relative bg-white rounded-2xl overflow-hidden border border-dark-200 transition-all duration-300 card-hover ${
        isHovered ? 'border-primary/30' : ''
      }`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative aspect-[4/3] overflow-hidden">
        <img
          src={product.image}
          alt={product.name}
          className={`w-full h-full object-cover transition-transform duration-500 ${
            isHovered ? 'scale-110' : ''
          }`}
          onError={(e) => {
            e.target.src = 'https://via.placeholder.com/400x300/f1f5f9/94a3b8?text=No+Image';
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
        
        <div className={`absolute top-3 left-3 flex items-center gap-1.5 px-2.5 py-1 rounded-full border ${categoryColors[product.category]}`}>
          <CategoryIcon size={12} />
          <span className="text-xs font-medium">{categoryNames[product.category]}</span>
        </div>

        {product.stock < 20 && (
          <div className="absolute top-3 right-3 px-2 py-1 rounded-full bg-orange-500 text-xs font-medium text-white">
            Only {product.stock} left
          </div>
        )}
      </div>

      <div className="p-4">
        <h3 className="font-heading font-medium text-lg mb-2 line-clamp-1 text-dark-900 group-hover:text-primary transition-colors">
          {product.name}
        </h3>
        
        <p className="text-dark-500 text-sm mb-3 line-clamp-2 h-10">
          {product.description}
        </p>

        <div className="flex items-center justify-between">
          <div className="flex flex-col">
            <span className="font-mono text-xl font-bold text-primary">
              ¥{product.price.toLocaleString()}
            </span>
            {product.stock > 0 ? (
              <span className="text-xs text-dark-400">Stock {product.stock}</span>
            ) : (
              <span className="text-xs text-red-500">Out of stock</span>
            )}
          </div>

          <button
            onClick={handleAddToCart}
            disabled={product.stock === 0}
            className={`relative flex items-center gap-2 px-4 py-2.5 rounded-xl font-medium transition-all duration-200 ${
              isAdded
                ? 'bg-green-100 text-green-600 border border-green-200'
                : product.stock === 0
                ? 'bg-dark-100 text-dark-400 cursor-not-allowed'
                : 'bg-primary text-white shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30 btn-glow'
            }`}
          >
            {isAdded ? (
              <>
                <Check size={18} />
                Added
              </>
            ) : (
              <>
                <ShoppingCart size={18} />
                Add
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
