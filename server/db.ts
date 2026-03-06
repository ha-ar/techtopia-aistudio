import Database from 'better-sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dbPath = path.join(__dirname, '../database.sqlite');

const db = new Database(dbPath);

// Initialize database tables
db.exec(`
  CREATE TABLE IF NOT EXISTS products (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    price REAL NOT NULL,
    image TEXT,
    category TEXT,
    featured INTEGER DEFAULT 0
  );

  CREATE TABLE IF NOT EXISTS orders (
    id TEXT PRIMARY KEY,
    customer_name TEXT NOT NULL,
    customer_email TEXT NOT NULL,
    total REAL NOT NULL,
    status TEXT DEFAULT 'pending',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS order_items (
    id TEXT PRIMARY KEY,
    order_id TEXT NOT NULL,
    product_id TEXT NOT NULL,
    quantity INTEGER NOT NULL,
    price REAL NOT NULL,
    FOREIGN KEY (order_id) REFERENCES orders(id),
    FOREIGN KEY (product_id) REFERENCES products(id)
  );
`);

// Seed initial data if products table is empty
const count = db.prepare('SELECT COUNT(*) as count FROM products').get() as { count: number };
if (count.count === 0) {
  const insertProduct = db.prepare(`
    INSERT INTO products (id, name, description, price, image, category, featured)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `);

  const initialProducts = [
    {
      id: '1',
      name: 'AeroStream Pro',
      description: 'Next-generation wireless earbuds with active noise cancellation and spatial audio.',
      price: 249,
      image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&q=80&w=1000',
      category: 'Audio',
      featured: 1,
    },
    {
      id: '2',
      name: 'Horizon Watch Series X',
      description: 'The most advanced health and fitness tracker with a stunning OLED display.',
      price: 399,
      image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&q=80&w=1000',
      category: 'Wearables',
      featured: 1,
    },
    {
      id: '3',
      name: 'Lumina Pad 12',
      description: 'A powerful tablet designed for creators, featuring the M3 chip and Liquid Retina display.',
      price: 799,
      image: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?auto=format&fit=crop&q=80&w=1000',
      category: 'Tablets',
      featured: 1,
    },
    {
      id: '4',
      name: 'Zenith Keyboard',
      description: 'Mechanical precision meets minimalist design. The ultimate typing experience.',
      price: 159,
      image: 'https://images.unsplash.com/photo-1511467687858-23d96c32e4ae?auto=format&fit=crop&q=80&w=1000',
      category: 'Accessories',
      featured: 0,
    },
    {
      id: '5',
      name: 'Nova Mouse',
      description: 'Ergonomic wireless mouse with ultra-fast tracking and customizable buttons.',
      price: 89,
      image: 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?auto=format&fit=crop&q=80&w=1000',
      category: 'Accessories',
      featured: 0,
    },
    {
      id: '6',
      name: 'Prism Display 27',
      description: '5K resolution with true-to-life colors. The perfect companion for your workstation.',
      price: 1299,
      image: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&q=80&w=1000',
      category: 'Displays',
      featured: 0,
    }
  ];

  const insertMany = db.transaction((products) => {
    for (const p of products) {
      insertProduct.run(p.id, p.name, p.description, p.price, p.image, p.category, p.featured);
    }
  });

  insertMany(initialProducts);
}

export default db;
