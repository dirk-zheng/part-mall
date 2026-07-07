import { useState, useMemo } from 'react';
import { Search, Grid3X3, Smartphone, Laptop, Cable, Watch, Headphones, ArrowUpDown } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { categories } from '../data/products';
import ProductCard from '../components/ProductCard';

const categoryIcons = {
  all: Grid3X3,
  phone: Smartphone,
  computer: Laptop,
  accessory: Cable,
  wearable: Watch,
  audio: Headphones,
};

export default function Products() {
  const { state } = useStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortOrder, setSortOrder] = useState('default');

  const filteredProducts = useMemo(() => {
    let result = [...state.products];

    if (selectedCategory !== 'all') {
      result = result.filter(p => p.category === selectedCategory);
    }

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(p =>
        p.name.toLowerCase().includes(query) ||
        p.description.toLowerCase().includes(query)
      );
    }

    if (sortOrder === 'price-asc') {
      result.sort((a, b) => a.price - b.price);
    } else if (sortOrder === 'price-desc') {
      result.sort((a, b) => b.price - a.price);
    }

    return result;
  }, [state.products, selectedCategory, searchQuery, sortOrder]);

  return (
    <div className="min-h-screen pt-20 pb-12">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-br from-white to-blue-50">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(0,102,255,0.08),transparent_50%),radial-gradient(circle_at_70%_50%,rgba(99,102,241,0.08),transparent_50%)]" />
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
          <h1 className="font-heading text-4xl md:text-5xl font-bold mb-4 text-dark-900">
            Our <span className="text-primary">Products</span>
          </h1>
          <p className="text-dark-500 text-lg max-w-2xl mx-auto">
            Browse our full product catalog and find the best solutions for your business
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search & Filter Bar */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-dark-400" size={20} />
            <input
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 rounded-xl bg-white border border-dark-200 focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all"
            />
          </div>

          <div className="flex items-center gap-2">
            <ArrowUpDown size={18} className="text-dark-400" />
            <select
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value)}
              className="px-4 py-3 rounded-xl bg-white border border-dark-200 focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all cursor-pointer"
            >
              <option value="default">Default</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
            </select>
          </div>
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap gap-2 mb-8">
          {categories.map(({ id, name, icon }) => {
            const Icon = categoryIcons[id] || Grid3X3;
            return (
              <button
                key={id}
                onClick={() => setSelectedCategory(id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all duration-200 ${
                  selectedCategory === id
                    ? 'bg-primary text-white shadow-lg shadow-primary/20'
                    : 'bg-white text-dark-600 hover:bg-primary/5 hover:text-primary border border-dark-200'
                }`}
              >
                <Icon size={16} />
                <span>{name}</span>
              </button>
            );
          })}
        </div>

        {/* Products Grid */}
        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProducts.map((product, index) => (
              <div
                key={product.id}
                className="animate-slide-up"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <ProductCard product={product} />
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-dark-100 flex items-center justify-center">
              <Search size={32} className="text-dark-400" />
            </div>
            <h3 className="text-xl font-heading font-medium mb-2 text-dark-900">No products found</h3>
            <p className="text-dark-500">Try adjusting your search or browse other categories</p>
          </div>
        )}

        {/* Stats */}
        <div className="mt-12 flex justify-center gap-8 text-center">
          <div className="bg-white rounded-2xl p-6 border border-dark-200 min-w-[120px]">
              <div className="text-2xl font-heading font-bold text-primary">{state.products.length}</div>
              <div className="text-sm text-dark-500">Total Products</div>
          </div>
          <div className="bg-white rounded-2xl p-6 border border-dark-200 min-w-[120px]">
              <div className="text-2xl font-heading font-bold text-secondary">{filteredProducts.length}</div>
              <div className="text-sm text-dark-500">Showing</div>
          </div>
          <div className="bg-white rounded-2xl p-6 border border-dark-200 min-w-[120px]">
              <div className="text-2xl font-heading font-bold text-accent">{categories.length - 1}</div>
              <div className="text-sm text-dark-500">Categories</div>
          </div>
        </div>
      </div>
    </div>
  );
}
