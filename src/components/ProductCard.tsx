import React from 'react';
import { Product } from '../types';
import { Plus, ShoppingCart } from 'lucide-react';
import { motion } from 'motion/react';

interface ProductCardProps {
  product: Product;
  onAddToCart: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, onAddToCart }) => {
  return (
    <motion.div
      whileHover={{ y: -10 }}
      className="group bg-white rounded-3xl p-6 border border-zinc-100 hover:shadow-2xl hover:shadow-zinc-200/50 transition-all duration-500"
    >
      <div className="relative aspect-square mb-6 overflow-hidden rounded-2xl bg-zinc-50">
        <img 
          src={product.image} 
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
          referrerPolicy="no-referrer"
        />
        <button 
          onClick={() => onAddToCart(product)}
          className="absolute bottom-4 right-4 w-12 h-12 bg-white rounded-full shadow-lg flex items-center justify-center text-zinc-900 hover:bg-brand hover:text-white transition-all duration-300 opacity-0 group-hover:opacity-100 translate-y-4 group-hover:translate-y-0"
        >
          <Plus size={24} />
        </button>
      </div>
      
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-brand uppercase tracking-wider">
            {product.category}
          </span>
          <span className="text-lg font-bold text-zinc-900">
            ${product.price}
          </span>
        </div>
        <h3 className="text-xl font-bold text-zinc-900 group-hover:text-brand transition-colors">
          {product.name}
        </h3>
        <p className="text-sm text-zinc-500 line-clamp-2 leading-relaxed">
          {product.description}
        </p>
      </div>
    </motion.div>
  );
};
