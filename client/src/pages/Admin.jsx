import { useState } from 'react';
import { Plus, Edit2, Trash2, X, Smartphone, Laptop, Cable, Watch, Headphones, Package } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { categories } from '../data/products';

const categoryIcons = { phone: Smartphone, computer: Laptop, accessory: Cable, wearable: Watch, audio: Headphones };
const categoryNames = { phone: 'Phone', computer: 'Computer', accessory: 'Accessory', wearable: 'Wearable', audio: 'Audio' };

const initialForm = {
  name: '',
  category: 'phone',
  price: '',
  stock: '',
  image: '',
  description: ''
};

export default function Admin() {
  const { state, addProduct, updateProduct, deleteProduct } = useStore();
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState({});

  const openAddModal = () => {
    setForm(initialForm);
    setEditingProduct(null);
    setErrors({});
    setShowModal(true);
  };

  const openEditModal = (product) => {
    setForm({
      name: product.name,
      category: product.category,
      price: product.price.toString(),
      stock: product.stock.toString(),
      image: product.image,
      description: product.description
    });
    setEditingProduct(product);
    setErrors({});
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingProduct(null);
    setForm(initialForm);
    setErrors({});
  };

  const validateForm = () => {
    const newErrors = {};
    if (!form.name.trim() || form.name.length < 2 || form.name.length > 50) {
      newErrors.name = 'Product name must be 2-50 characters';
    }
    if (!form.price || parseFloat(form.price) <= 0) {
      newErrors.price = 'Please enter a valid price';
    }
    if (!form.stock || parseInt(form.stock) < 0) {
      newErrors.stock = 'Stock must be a non-negative integer';
    }
    if (!form.image.trim()) {
      newErrors.image = 'Please enter an image URL';
    }
    if (!form.description.trim()) {
      newErrors.description = 'Please enter a product description';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    const productData = {
      name: form.name.trim(),
      category: form.category,
      price: parseFloat(form.price),
      stock: parseInt(form.stock),
      image: form.image.trim(),
      description: form.description.trim()
    };

    try {
      if (editingProduct) {
        await updateProduct(editingProduct.id, productData);
      } else {
        await addProduct(productData);
      }
      closeModal();
    } catch (err) {
      alert('Operation failed: ' + (err.message || 'Unknown error'));
    }
  };

  const handleDelete = async (productId) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await deleteProduct(productId);
      } catch (err) {
        alert('Delete failed');
      }
    }
  };

  const categoryStats = categories
    .filter(c => c.id !== 'all')
    .map(c => ({
      ...c,
      count: state.products.filter(p => p.category === c.id).length
    }));

  return (
    <div className="min-h-screen pt-20 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="font-heading text-3xl font-bold text-dark-900">Product Management</h1>
            <p className="text-dark-500 mt-1">Manage your product inventory and listings</p>
          </div>
          <button
            onClick={openAddModal}
            className="flex items-center gap-2 px-5 py-3 bg-primary text-white rounded-xl font-medium hover:bg-primary/90 transition-colors shadow-lg shadow-primary/20 btn-glow"
          >
            <Plus size={20} />
            Add Product
          </button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
          <div className="bg-white rounded-2xl p-4 border border-dark-200 shadow-sm">
            <div className="flex items-center gap-3 mb-2">
              <Package size={20} className="text-primary" />
              <span className="text-dark-500 text-sm">All Products</span>
            </div>
            <div className="text-2xl font-heading font-bold text-dark-900">{state.products.length}</div>
          </div>
          {categoryStats.map(cat => {
            const Icon = categoryIcons[cat.id] || Package;
            return (
              <div key={cat.id} className="bg-white rounded-2xl p-4 border border-dark-200 shadow-sm">
                <div className="flex items-center gap-3 mb-2">
                  <Icon size={20} className="text-secondary" />
                  <span className="text-dark-500 text-sm">{cat.name}</span>
                </div>
                <div className="text-2xl font-heading font-bold text-dark-900">{cat.count}</div>
              </div>
            );
          })}
        </div>

        {/* Products Table */}
        <div className="bg-white rounded-2xl border border-dark-200 overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-dark-100 bg-dark-50">
                  <th className="text-left p-4 font-heading font-medium text-dark-600">Product</th>
                  <th className="text-left p-4 font-heading font-medium text-dark-600 hidden md:table-cell">Category</th>
                  <th className="text-right p-4 font-heading font-medium text-dark-600">Price</th>
                  <th className="text-right p-4 font-heading font-medium text-dark-600">Stock</th>
                  <th className="text-right p-4 font-heading font-medium text-dark-600">Actions</th>
                </tr>
              </thead>
              <tbody>
                {state.products.map((product, index) => {
                  const Icon = categoryIcons[product.category] || Package;
                  return (
                    <tr
                      key={product.id}
                      className="border-b border-dark-100 hover:bg-blue-50/50 transition-colors animate-slide-up"
                      style={{ animationDelay: `${index * 30}ms` }}
                    >
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={product.image}
                            alt={product.name}
                            className="w-12 h-12 rounded-lg object-cover"
                            onError={(e) => {
                              e.target.src = 'https://via.placeholder.com/48/f1f5f9/94a3b8?text=No';
                            }}
                          />
                          <div className="min-w-0">
                            <div className="font-medium truncate max-w-[200px] text-dark-900">{product.name}</div>
                            <div className="text-sm text-dark-400 truncate max-w-[200px] hidden sm:block">
                              {product.description}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="p-4 hidden md:table-cell">
                        <div className="flex items-center gap-2">
                          <Icon size={14} className="text-dark-400" />
                          <span className="text-dark-600">{categoryNames[product.category]}</span>
                        </div>
                      </td>
                      <td className="p-4 text-right">
                        <span className="font-mono text-primary font-semibold">${product.price.toLocaleString()}</span>
                      </td>
                      <td className="p-4 text-right">
                        <span className={`font-mono ${product.stock < 20 ? 'text-orange-500' : 'text-dark-600'}`}>
                          {product.stock}
                        </span>
                      </td>
                      <td className="p-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => openEditModal(product)}
                            className="p-2 text-dark-400 hover:text-primary hover:bg-primary/5 rounded-lg transition-colors"
                          >
                            <Edit2 size={18} />
                          </button>
                          <button
                            onClick={() => handleDelete(product.id)}
                            className="p-2 text-dark-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {state.products.length === 0 && (
            <div className="text-center py-16">
              <Package size={48} className="mx-auto mb-4 text-dark-300" />
              <h3 className="font-heading text-xl font-medium mb-2 text-dark-900">No products yet</h3>
              <p className="text-dark-500 mb-4">Click the button above to add your first product</p>
            </div>
          )}
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 animate-fade-in">
          <div className="bg-white rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto shadow-2xl animate-bounce-in">
            <div className="flex items-center justify-between p-6 border-b border-dark-200">
              <h2 className="font-heading text-xl font-bold text-dark-900">
                {editingProduct ? 'Edit Product' : 'Add Product'}
              </h2>
              <button
                onClick={closeModal}
                className="p-2 hover:bg-dark-100 rounded-lg transition-colors text-dark-500"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2 text-dark-700">Product Name</label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="e.g. iPhone 15 Pro Max"
                  className={`w-full px-4 py-3 rounded-xl bg-white border ${errors.name ? 'border-red-500' : 'border-dark-200'} focus:border-primary focus:ring-2 focus:ring-primary/10`}
                />
                {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium mb-2 text-dark-700">Category</label>
                <select
                  value={form.category}
                  onChange={(e) => setForm({ ...form, category: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl bg-white border border-dark-200 focus:border-primary focus:ring-2 focus:ring-primary/10 cursor-pointer"
                >
                  {categories.filter(c => c.id !== 'all').map(cat => (
                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2 text-dark-700">Price ($)</label>
                  <input
                    type="number"
                    value={form.price}
                    onChange={(e) => setForm({ ...form, price: e.target.value })}
                    placeholder="0.00"
                    step="0.01"
                    min="0"
                    className={`w-full px-4 py-3 rounded-xl bg-white border ${errors.price ? 'border-red-500' : 'border-dark-200'} focus:border-primary focus:ring-2 focus:ring-primary/10`}
                  />
                  {errors.price && <p className="text-red-500 text-sm mt-1">{errors.price}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2 text-dark-700">Stock</label>
                  <input
                    type="number"
                    value={form.stock}
                    onChange={(e) => setForm({ ...form, stock: e.target.value })}
                    placeholder="0"
                    min="0"
                    className={`w-full px-4 py-3 rounded-xl bg-white border ${errors.stock ? 'border-red-500' : 'border-dark-200'} focus:border-primary focus:ring-2 focus:ring-primary/10`}
                  />
                  {errors.stock && <p className="text-red-500 text-sm mt-1">{errors.stock}</p>}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2 text-dark-700">Image URL</label>
                <input
                  type="url"
                  value={form.image}
                  onChange={(e) => setForm({ ...form, image: e.target.value })}
                  placeholder="https://example.com/image.jpg"
                  className={`w-full px-4 py-3 rounded-xl bg-white border ${errors.image ? 'border-red-500' : 'border-dark-200'} focus:border-primary focus:ring-2 focus:ring-primary/10`}
                />
                {errors.image && <p className="text-red-500 text-sm mt-1">{errors.image}</p>}
                {form.image && (
                  <img
                    src={form.image}
                    alt="Preview"
                    className="mt-2 w-full h-32 object-cover rounded-lg"
                    onError={(e) => {
                      e.target.style.display = 'none';
                    }}
                  />
                )}
              </div>

              <div>
                <label className="block text-sm font-medium mb-2 text-dark-700">Description</label>
                <textarea
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  placeholder="Describe the product..."
                  rows={3}
                  className={`w-full px-4 py-3 rounded-xl bg-white border ${errors.description ? 'border-red-500' : 'border-dark-200'} focus:border-primary focus:ring-2 focus:ring-primary/10 resize-none`}
                />
                {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description}</p>}
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={closeModal}
                  className="flex-1 px-4 py-3 rounded-xl border border-dark-200 text-dark-600 hover:bg-dark-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-3 rounded-xl bg-primary text-white font-medium hover:bg-primary/90 transition-colors shadow-lg shadow-primary/20 btn-glow"
                >
                  {editingProduct ? 'Save Changes' : 'Add Product'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
