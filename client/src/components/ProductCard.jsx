import { useState } from 'react';
import { ClipboardList, Check, CircleDot, Disc3, Circle, Package, Wrench } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { categoryNames } from '../data/products';

const categoryIcons = {
  'forged-wheel': Disc3,
  'cast-wheel': CircleDot,
  tire: Circle,
  'wheel-set': Package,
  accessory: Wrench,
};

const categoryColors = {
  'forged-wheel': 'bg-orange-100 text-orange-700 border-orange-200',
  'cast-wheel': 'bg-slate-100 text-slate-700 border-slate-200',
  tire: 'bg-zinc-900 text-white border-zinc-700',
  'wheel-set': 'bg-amber-100 text-amber-700 border-amber-200',
  accessory: 'bg-emerald-100 text-emerald-700 border-emerald-200',
};

export default function ProductCard({ product }) {
  const { addToMixedLoad } = useStore();
  const [isAdded, setIsAdded] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const handleRequestQuote = async (e) => {
    e.preventDefault();
    try {
      await addToMixedLoad(product);
      setIsAdded(true);
      setTimeout(() => setIsAdded(false), 2000);
    } catch (err) {
      alert(err.message || 'Sign in to add this program to your mixed-load request');
    }
  };

  const CategoryIcon = categoryIcons[product.category] || CircleDot;

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
            e.target.src = '/no-image.png';
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
        
        <div className={`absolute top-3 left-3 flex items-center gap-1.5 px-2.5 py-1 rounded-full border ${categoryColors[product.category]}`}>
          <CategoryIcon size={12} />
          <span className="text-xs font-medium">{categoryNames[product.category]}</span>
        </div>

        <div className="absolute top-3 right-3 px-2.5 py-1 rounded-full bg-slate-950/80 text-xs font-medium text-white backdrop-blur-sm">
          Fitment confirmed before quote
        </div>
      </div>

      <div className="p-4">
        <h3 className="font-heading font-medium text-lg mb-2 line-clamp-1 text-dark-900 group-hover:text-primary transition-colors">
          {product.name}
        </h3>
        
        <p className="text-dark-500 text-sm mb-3 line-clamp-2 h-10">
          {product.description}
        </p>

        <div className="flex items-center justify-between">
          <div className="flex flex-col pr-3">
            <span className="text-sm font-semibold text-dark-800">Volume-based quotation</span>
            <span className="text-xs text-dark-400">Fitment · finish · packing · quantity</span>
          </div>

          <button
            onClick={handleRequestQuote}
            className={`relative flex items-center gap-2 px-4 py-2.5 rounded-xl font-medium transition-all duration-200 ${
              isAdded
                ? 'bg-green-100 text-green-600 border border-green-200'
                : 'bg-primary text-white shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30 btn-glow'
            }`}
          >
            {isAdded ? (
              <>
                <Check size={18} />
                Added to Mix
              </>
            ) : (
              <>
                <ClipboardList size={18} />
                Request Quote
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
