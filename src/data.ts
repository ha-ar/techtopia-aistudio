import { Product } from './types';

export const products: Product[] = [
  {
    id: '1',
    name: 'AeroStream Pro',
    description: 'Next-generation wireless earbuds with active noise cancellation and spatial audio.',
    price: 249,
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&q=80&w=1000',
    category: 'Audio',
    featured: true,
  },
  {
    id: '2',
    name: 'Horizon Watch Series X',
    description: 'The most advanced health and fitness tracker with a stunning OLED display.',
    price: 399,
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&q=80&w=1000',
    category: 'Wearables',
    featured: true,
  },
  {
    id: '3',
    name: 'Lumina Pad 12',
    description: 'A powerful tablet designed for creators, featuring the M3 chip and Liquid Retina display.',
    price: 799,
    image: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?auto=format&fit=crop&q=80&w=1000',
    category: 'Tablets',
    featured: true,
  },
  {
    id: '4',
    name: 'Zenith Keyboard',
    description: 'Mechanical precision meets minimalist design. The ultimate typing experience.',
    price: 159,
    image: 'https://images.unsplash.com/photo-1511467687858-23d96c32e4ae?auto=format&fit=crop&q=80&w=1000',
    category: 'Accessories',
  },
  {
    id: '5',
    name: 'Nova Mouse',
    description: 'Ergonomic wireless mouse with ultra-fast tracking and customizable buttons.',
    price: 89,
    image: 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?auto=format&fit=crop&q=80&w=1000',
    category: 'Accessories',
  },
  {
    id: '6',
    name: 'Prism Display 27',
    description: '5K resolution with true-to-life colors. The perfect companion for your workstation.',
    price: 1299,
    image: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&q=80&w=1000',
    category: 'Displays',
  }
];
