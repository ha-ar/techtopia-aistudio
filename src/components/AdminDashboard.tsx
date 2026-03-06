import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Package, ShoppingCart, Plus, Trash2, ArrowLeft } from 'lucide-react';
import { Product } from '../types';

export const AdminDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'products' | 'orders'>('products');
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // New product form state
  const [newProduct, setNewProduct] = useState({
    name: '',
    description: '',
    price: '',
    image: '',
    category: '',
    featured: false
  });

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const [productsRes, ordersRes] = await Promise.all([
        fetch('/api/products'),
        fetch('/api/orders')
      ]);
      
      const productsData = await productsRes.json();
      const ordersData = await ordersRes.json();
      
      setProducts(productsData);
      setOrders(ordersData);
    } catch (error) {
      console.error('Failed to fetch admin data', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...newProduct,
          price: parseFloat(newProduct.price)
        })
      });
      
      if (response.ok) {
        setNewProduct({ name: '', description: '', price: '', image: '', category: '', featured: false });
        fetchData();
      }
    } catch (error) {
      console.error('Failed to add product', error);
    }
  };

  const handleDeleteProduct = async (id: string) => {
    if (!confirm('Are you sure you want to delete this product?')) return;
    
    try {
      const response = await fetch(`/api/products/${id}`, { method: 'DELETE' });
      if (response.ok) {
        fetchData();
      }
    } catch (error) {
      console.error('Failed to delete product', error);
    }
  };

  const handleUpdateOrderStatus = async (id: string, status: string) => {
    try {
      const response = await fetch(`/api/orders/${id}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      });
      
      if (response.ok) {
        fetchData();
      }
    } catch (error) {
      console.error('Failed to update order status', error);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-zinc-50 flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-zinc-200 border-t-brand rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-50">
      {/* Admin Header */}
      <header className="bg-white border-b border-zinc-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link to="/" className="text-zinc-400 hover:text-zinc-900 transition-colors">
              <ArrowLeft size={20} />
            </Link>
            <h1 className="text-xl font-bold">TechtopiaPK Admin</h1>
          </div>
          <div className="flex gap-2">
            <button 
              onClick={() => setActiveTab('products')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 ${
                activeTab === 'products' ? 'bg-zinc-900 text-white' : 'text-zinc-600 hover:bg-zinc-100'
              }`}
            >
              <Package size={16} /> Products
            </button>
            <button 
              onClick={() => setActiveTab('orders')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 ${
                activeTab === 'orders' ? 'bg-zinc-900 text-white' : 'text-zinc-600 hover:bg-zinc-100'
              }`}
            >
              <ShoppingCart size={16} /> Orders
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8">
        {activeTab === 'products' ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Add Product Form */}
            <div className="lg:col-span-1">
              <div className="bg-white p-6 rounded-2xl border border-zinc-200 shadow-sm">
                <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
                  <Plus size={20} className="text-brand" /> Add New Product
                </h2>
                <form onSubmit={handleAddProduct} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-zinc-700 mb-1">Name</label>
                    <input 
                      required
                      type="text" 
                      value={newProduct.name}
                      onChange={e => setNewProduct({...newProduct, name: e.target.value})}
                      className="w-full px-3 py-2 rounded-lg border border-zinc-300 focus:ring-2 focus:ring-brand outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-zinc-700 mb-1">Price ($)</label>
                    <input 
                      required
                      type="number" 
                      step="0.01"
                      value={newProduct.price}
                      onChange={e => setNewProduct({...newProduct, price: e.target.value})}
                      className="w-full px-3 py-2 rounded-lg border border-zinc-300 focus:ring-2 focus:ring-brand outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-zinc-700 mb-1">Category</label>
                    <select 
                      required
                      value={newProduct.category}
                      onChange={e => setNewProduct({...newProduct, category: e.target.value})}
                      className="w-full px-3 py-2 rounded-lg border border-zinc-300 focus:ring-2 focus:ring-brand outline-none"
                    >
                      <option value="">Select a category</option>
                      <option value="Audio">Audio</option>
                      <option value="Wearables">Wearables</option>
                      <option value="Tablets">Tablets</option>
                      <option value="Accessories">Accessories</option>
                      <option value="Displays">Displays</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-zinc-700 mb-1">Image URL</label>
                    <input 
                      required
                      type="url" 
                      value={newProduct.image}
                      onChange={e => setNewProduct({...newProduct, image: e.target.value})}
                      className="w-full px-3 py-2 rounded-lg border border-zinc-300 focus:ring-2 focus:ring-brand outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-zinc-700 mb-1">Description</label>
                    <textarea 
                      required
                      rows={3}
                      value={newProduct.description}
                      onChange={e => setNewProduct({...newProduct, description: e.target.value})}
                      className="w-full px-3 py-2 rounded-lg border border-zinc-300 focus:ring-2 focus:ring-brand outline-none resize-none"
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <input 
                      type="checkbox" 
                      id="featured"
                      checked={newProduct.featured}
                      onChange={e => setNewProduct({...newProduct, featured: e.target.checked})}
                      className="rounded text-brand focus:ring-brand"
                    />
                    <label htmlFor="featured" className="text-sm font-medium text-zinc-700">Featured Product</label>
                  </div>
                  <button type="submit" className="w-full btn-primary py-2 rounded-lg">
                    Save Product
                  </button>
                </form>
              </div>
            </div>

            {/* Products List */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-2xl border border-zinc-200 shadow-sm overflow-hidden">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-zinc-50 border-b border-zinc-200">
                      <th className="p-4 text-sm font-semibold text-zinc-600">Product</th>
                      <th className="p-4 text-sm font-semibold text-zinc-600">Category</th>
                      <th className="p-4 text-sm font-semibold text-zinc-600">Price</th>
                      <th className="p-4 text-sm font-semibold text-zinc-600 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {products.map(product => (
                      <tr key={product.id} className="border-b border-zinc-100 last:border-0 hover:bg-zinc-50">
                        <td className="p-4">
                          <div className="flex items-center gap-3">
                            <img src={product.image} alt={product.name} className="w-10 h-10 rounded-md object-cover bg-zinc-100" />
                            <div>
                              <p className="font-medium text-zinc-900">{product.name}</p>
                              {product.featured && <span className="text-[10px] uppercase tracking-wider bg-brand/10 text-brand px-2 py-0.5 rounded-full font-bold">Featured</span>}
                            </div>
                          </div>
                        </td>
                        <td className="p-4 text-sm text-zinc-600">{product.category}</td>
                        <td className="p-4 text-sm font-medium">${product.price}</td>
                        <td className="p-4 text-right">
                          <button 
                            onClick={() => handleDeleteProduct(product.id)}
                            className="text-zinc-400 hover:text-red-500 transition-colors p-2"
                          >
                            <Trash2 size={18} />
                          </button>
                        </td>
                      </tr>
                    ))}
                    {products.length === 0 && (
                      <tr>
                        <td colSpan={4} className="p-8 text-center text-zinc-500">No products found.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        ) : (
          /* Orders List */
          <div className="bg-white rounded-2xl border border-zinc-200 shadow-sm overflow-hidden">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-zinc-50 border-b border-zinc-200">
                  <th className="p-4 text-sm font-semibold text-zinc-600">Order ID</th>
                  <th className="p-4 text-sm font-semibold text-zinc-600">Customer</th>
                  <th className="p-4 text-sm font-semibold text-zinc-600">Date</th>
                  <th className="p-4 text-sm font-semibold text-zinc-600">Total</th>
                  <th className="p-4 text-sm font-semibold text-zinc-600">Status</th>
                </tr>
              </thead>
              <tbody>
                {orders.map(order => (
                  <tr key={order.id} className="border-b border-zinc-100 last:border-0 hover:bg-zinc-50">
                    <td className="p-4 text-sm font-mono text-zinc-500">{order.id.slice(0, 8)}...</td>
                    <td className="p-4">
                      <p className="font-medium text-zinc-900">{order.customer_name}</p>
                      <p className="text-xs text-zinc-500">{order.customer_email}</p>
                    </td>
                    <td className="p-4 text-sm text-zinc-600">
                      {new Date(order.created_at).toLocaleDateString()}
                    </td>
                    <td className="p-4 text-sm font-medium">${order.total}</td>
                    <td className="p-4">
                      <select 
                        value={order.status}
                        onChange={(e) => handleUpdateOrderStatus(order.id, e.target.value)}
                        className={`text-sm font-medium px-3 py-1 rounded-full outline-none cursor-pointer ${
                          order.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                          order.status === 'processing' ? 'bg-blue-100 text-blue-800' :
                          order.status === 'shipped' ? 'bg-purple-100 text-purple-800' :
                          'bg-green-100 text-green-800'
                        }`}
                      >
                        <option value="pending">Pending</option>
                        <option value="processing">Processing</option>
                        <option value="shipped">Shipped</option>
                        <option value="delivered">Delivered</option>
                      </select>
                    </td>
                  </tr>
                ))}
                {orders.length === 0 && (
                  <tr>
                    <td colSpan={5} className="p-8 text-center text-zinc-500">No orders found.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </main>
    </div>
  );
};
