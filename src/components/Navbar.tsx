import React, { useState, useEffect } from 'react';
import { ShoppingBag, Menu, X, Search, User } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface NavbarProps {
  cartCount: number;
  onCartClick: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ cartCount, onCartClick }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? 'apple-blur border-b border-zinc-100 py-3' : 'bg-transparent py-5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-brand rounded-lg flex items-center justify-center">
            <div className="w-4 h-4 bg-white rounded-sm rotate-45" />
          </div>
          <span className="text-xl font-bold tracking-tight">Techtopia<span className="text-brand">PK</span></span>
        </div>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center gap-8 text-sm font-medium text-zinc-600">
          <a href="#" className="hover:text-brand transition-colors">Store</a>
          <a href="#" className="hover:text-brand transition-colors">Mac</a>
          <a href="#" className="hover:text-brand transition-colors">iPad</a>
          <a href="#" className="hover:text-brand transition-colors">iPhone</a>
          <a href="#" className="hover:text-brand transition-colors">Support</a>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-5">
          <button className="text-zinc-600 hover:text-brand transition-colors">
            <Search size={20} />
          </button>
          <button className="text-zinc-600 hover:text-brand transition-colors hidden sm:block">
            <User size={20} />
          </button>
          <button 
            onClick={onCartClick}
            className="relative text-zinc-600 hover:text-brand transition-colors"
          >
            <ShoppingBag size={20} />
            {cartCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-brand text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                {cartCount}
              </span>
            )}
          </button>
          <button 
            className="md:hidden text-zinc-600"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute top-full left-0 right-0 bg-white border-b border-zinc-100 p-6 md:hidden flex flex-col gap-4 shadow-xl"
          >
            <a href="#" className="text-lg font-medium">Store</a>
            <a href="#" className="text-lg font-medium">Mac</a>
            <a href="#" className="text-lg font-medium">iPad</a>
            <a href="#" className="text-lg font-medium">iPhone</a>
            <a href="#" className="text-lg font-medium">Support</a>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};
