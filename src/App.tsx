import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { ProductCard } from './components/ProductCard';
import { Cart } from './components/Cart';
import { Product, CartItem } from './types';
import { motion } from 'motion/react';
import { Instagram, Twitter, Facebook, Youtube } from 'lucide-react';
import { AdminDashboard } from './components/AdminDashboard';

function StoreFront() {
  const [products, setProducts] = useState<Product[]>([]);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetch('/api/products')
      .then(res => res.json())
      .then(data => {
        setProducts(data);
        setIsLoading(false);
      })
      .catch(err => {
        console.error('Failed to fetch products', err);
        setIsLoading(false);
      });
  }, []);

  const addToCart = (product: Product) => {
    setCartItems(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item => 
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, { ...product, quantity: 1 }];
    });
    setIsCartOpen(true);
  };

  const updateQuantity = (id: string, delta: number) => {
    setCartItems(prev => prev.map(item => {
      if (item.id === id) {
        const newQty = Math.max(1, item.quantity + delta);
        return { ...item, quantity: newQty };
      }
      return item;
    }));
  };

  const removeFromCart = (id: string) => {
    setCartItems(prev => prev.filter(item => item.id !== id));
  };

  const handleCheckout = async () => {
    if (cartItems.length === 0) return;
    
    try {
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customer_name: 'Guest User',
          customer_email: 'guest@example.com',
          items: cartItems
        })
      });
      
      if (response.ok) {
        alert('Order placed successfully!');
        setCartItems([]);
        setIsCartOpen(false);
      }
    } catch (error) {
      console.error('Checkout failed', error);
      alert('Failed to place order');
    }
  };

  return (
    <div className="min-h-screen bg-white selection:bg-brand/30">
      <Navbar 
        cartCount={cartItems.reduce((sum, item) => sum + item.quantity, 0)} 
        onCartClick={() => setIsCartOpen(true)} 
      />
      
      <main>
        <Hero />

        {/* Featured Section */}
        <section className="py-24 px-6 max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
            <div className="space-y-4">
              <h2 className="text-4xl md:text-5xl font-bold tracking-tight">
                Featured <span className="text-zinc-400">Innovations.</span>
              </h2>
              <p className="text-zinc-500 max-w-md text-lg">
                Explore our curated selection of the finest tech gadgets designed to elevate your lifestyle.
              </p>
            </div>
            <div className="flex gap-4">
              {['All', 'Audio', 'Wearables', 'Tablets'].map((cat) => (
                <button 
                  key={cat}
                  className="px-5 py-2 rounded-full text-sm font-medium border border-zinc-200 hover:border-brand hover:text-brand transition-all"
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {isLoading ? (
            <div className="flex justify-center py-20">
              <div className="w-10 h-10 border-4 border-zinc-200 border-t-brand rounded-full animate-spin"></div>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {products.map((product, index) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                >
                  <ProductCard 
                    product={product} 
                    onAddToCart={addToCart} 
                  />
                </motion.div>
              ))}
            </div>
          )}
        </section>

        {/* Brand Values Section */}
        <section className="bg-zinc-900 py-32 px-6 text-white overflow-hidden relative">
          <div className="absolute top-0 right-0 w-1/2 h-full bg-brand/10 blur-[120px] rounded-full translate-x-1/2" />
          
          <div className="max-w-7xl mx-auto relative z-10">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-20 items-center">
              <div className="space-y-8">
                <h2 className="text-5xl md:text-6xl font-bold leading-tight">
                  Crafted for the <br />
                  <span className="text-brand">Modern World.</span>
                </h2>
                <p className="text-zinc-400 text-xl leading-relaxed">
                  At TechtopiaPK, we believe technology should be seamless. 
                  Our products are designed with a focus on minimalism, 
                  functionality, and unparalleled quality.
                </p>
                <div className="grid grid-cols-2 gap-8 pt-8">
                  <div>
                    <h4 className="text-brand font-bold text-3xl mb-2">99%</h4>
                    <p className="text-zinc-500 text-sm uppercase tracking-widest">Customer Satisfaction</p>
                  </div>
                  <div>
                    <h4 className="text-brand font-bold text-3xl mb-2">24/7</h4>
                    <p className="text-zinc-500 text-sm uppercase tracking-widest">Premium Support</p>
                  </div>
                </div>
              </div>
              <div className="relative">
                <motion.div
                  initial={{ rotate: 5, scale: 0.9 }}
                  whileInView={{ rotate: 0, scale: 1 }}
                  transition={{ duration: 1 }}
                  className="rounded-3xl overflow-hidden shadow-2xl shadow-brand/20"
                >
                  <img 
                    src="https://images.unsplash.com/photo-1491933382434-50028619b54b?auto=format&fit=crop&q=80&w=1000" 
                    alt="Tech Lifestyle"
                    className="w-full aspect-[4/5] object-cover"
                    referrerPolicy="no-referrer"
                  />
                </motion.div>
              </div>
            </div>
          </div>
        </section>

        {/* Newsletter */}
        <section className="py-24 px-6 max-w-3xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Stay in the Loop.</h2>
          <p className="text-zinc-500 mb-10 text-lg">
            Subscribe to receive updates on new arrivals, exclusive offers, and tech insights.
          </p>
          <form className="flex flex-col sm:flex-row gap-4">
            <input 
              type="email" 
              placeholder="Enter your email" 
              className="flex-1 px-6 py-4 rounded-full bg-zinc-100 border-none focus:ring-2 focus:ring-brand outline-none transition-all"
            />
            <button type="submit" className="btn-primary whitespace-nowrap">
              Join Techtopia
            </button>
          </form>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-zinc-50 pt-24 pb-12 px-6 border-t border-zinc-100">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-12 mb-20">
            <div className="col-span-2 lg:col-span-2 space-y-6">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-brand rounded-lg flex items-center justify-center">
                  <div className="w-4 h-4 bg-white rounded-sm rotate-45" />
                </div>
                <span className="text-xl font-bold tracking-tight">Techtopia<span className="text-brand">PK</span></span>
              </div>
              <p className="text-zinc-500 max-w-xs leading-relaxed">
                Your destination for premium tech gadgets. Redefining the way you interact with technology.
              </p>
              <div className="flex gap-4">
                <a href="#" className="w-10 h-10 rounded-full bg-white border border-zinc-200 flex items-center justify-center text-zinc-600 hover:bg-brand hover:text-white hover:border-brand transition-all">
                  <Instagram size={18} />
                </a>
                <a href="#" className="w-10 h-10 rounded-full bg-white border border-zinc-200 flex items-center justify-center text-zinc-600 hover:bg-brand hover:text-white hover:border-brand transition-all">
                  <Twitter size={18} />
                </a>
                <a href="#" className="w-10 h-10 rounded-full bg-white border border-zinc-200 flex items-center justify-center text-zinc-600 hover:bg-brand hover:text-white hover:border-brand transition-all">
                  <Facebook size={18} />
                </a>
                <a href="#" className="w-10 h-10 rounded-full bg-white border border-zinc-200 flex items-center justify-center text-zinc-600 hover:bg-brand hover:text-white hover:border-brand transition-all">
                  <Youtube size={18} />
                </a>
              </div>
            </div>
            
            <div className="space-y-6">
              <h4 className="font-bold uppercase text-xs tracking-widest text-zinc-400">Shop</h4>
              <ul className="space-y-4 text-sm font-medium text-zinc-600">
                <li><a href="#" className="hover:text-brand transition-colors">All Products</a></li>
                <li><a href="#" className="hover:text-brand transition-colors">New Arrivals</a></li>
                <li><a href="#" className="hover:text-brand transition-colors">Best Sellers</a></li>
                <li><a href="#" className="hover:text-brand transition-colors">Sale</a></li>
              </ul>
            </div>

            <div className="space-y-6">
              <h4 className="font-bold uppercase text-xs tracking-widest text-zinc-400">Support</h4>
              <ul className="space-y-4 text-sm font-medium text-zinc-600">
                <li><a href="#" className="hover:text-brand transition-colors">Help Center</a></li>
                <li><a href="#" className="hover:text-brand transition-colors">Shipping Info</a></li>
                <li><a href="#" className="hover:text-brand transition-colors">Returns</a></li>
                <li><a href="#" className="hover:text-brand transition-colors">Contact Us</a></li>
              </ul>
            </div>

            <div className="space-y-6">
              <h4 className="font-bold uppercase text-xs tracking-widest text-zinc-400">Company</h4>
              <ul className="space-y-4 text-sm font-medium text-zinc-600">
                <li><a href="#" className="hover:text-brand transition-colors">About Us</a></li>
                <li><a href="#" className="hover:text-brand transition-colors">Careers</a></li>
                <li><a href="#" className="hover:text-brand transition-colors">Sustainability</a></li>
                <li><a href="#" className="hover:text-brand transition-colors">Privacy Policy</a></li>
              </ul>
            </div>
          </div>
          
          <div className="pt-12 border-t border-zinc-200 flex flex-col md:flex-row justify-between items-center gap-6 text-sm text-zinc-400">
            <p>© 2024 TechtopiaPK. All rights reserved.</p>
            <div className="flex gap-8">
              <a href="#" className="hover:text-zinc-600 transition-colors">Terms of Service</a>
              <a href="#" className="hover:text-zinc-600 transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-zinc-600 transition-colors">Cookie Settings</a>
            </div>
            <Link to="/admin" className="text-zinc-400 hover:text-brand transition-colors">Admin Dashboard</Link>
          </div>
        </div>
      </footer>

      <Cart 
        isOpen={isCartOpen} 
        onClose={() => setIsCartOpen(false)} 
        items={cartItems}
        onUpdateQuantity={updateQuantity}
        onRemove={removeFromCart}
        onCheckout={handleCheckout}
      />
    </div>
  );
}

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<StoreFront />} />
        <Route path="/admin" element={<AdminDashboard />} />
      </Routes>
    </Router>
  );
}
