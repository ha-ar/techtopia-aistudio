import express from 'express';
import { createServer as createViteServer } from 'vite';
import db from './server/db.js';
import crypto from 'crypto';

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API Routes

  // Products
  app.get('/api/products', (req, res) => {
    try {
      const products = db.prepare('SELECT * FROM products').all();
      // Convert featured from 0/1 to boolean
      const formattedProducts = products.map((p: any) => ({
        ...p,
        featured: p.featured === 1
      }));
      res.json(formattedProducts);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch products' });
    }
  });

  app.post('/api/products', (req, res) => {
    const { name, description, price, image, category, featured } = req.body;
    const id = crypto.randomUUID();
    
    try {
      const stmt = db.prepare(`
        INSERT INTO products (id, name, description, price, image, category, featured)
        VALUES (?, ?, ?, ?, ?, ?, ?)
      `);
      stmt.run(id, name, description, price, image, category, featured ? 1 : 0);
      res.status(201).json({ id, name, description, price, image, category, featured });
    } catch (error) {
      res.status(500).json({ error: 'Failed to create product' });
    }
  });

  app.delete('/api/products/:id', (req, res) => {
    try {
      db.prepare('DELETE FROM products WHERE id = ?').run(req.params.id);
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: 'Failed to delete product' });
    }
  });

  // Orders
  app.get('/api/orders', (req, res) => {
    try {
      const orders = db.prepare('SELECT * FROM orders ORDER BY created_at DESC').all();
      
      const ordersWithItems = orders.map((order: any) => {
        const items = db.prepare(`
          SELECT oi.*, p.name, p.image 
          FROM order_items oi
          JOIN products p ON oi.product_id = p.id
          WHERE oi.order_id = ?
        `).all(order.id);
        
        return { ...order, items };
      });
      
      res.json(ordersWithItems);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch orders' });
    }
  });

  app.post('/api/orders', (req, res) => {
    const { customer_name, customer_email, items } = req.body;
    const orderId = crypto.randomUUID();
    
    try {
      // Calculate total
      let total = 0;
      for (const item of items) {
        total += item.price * item.quantity;
      }

      const createOrder = db.transaction(() => {
        db.prepare(`
          INSERT INTO orders (id, customer_name, customer_email, total, status)
          VALUES (?, ?, ?, ?, ?)
        `).run(orderId, customer_name, customer_email, total, 'pending');

        const insertItem = db.prepare(`
          INSERT INTO order_items (id, order_id, product_id, quantity, price)
          VALUES (?, ?, ?, ?, ?)
        `);

        for (const item of items) {
          insertItem.run(crypto.randomUUID(), orderId, item.id, item.quantity, item.price);
        }
      });

      createOrder();
      res.status(201).json({ id: orderId, status: 'pending' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Failed to create order' });
    }
  });

  app.patch('/api/orders/:id/status', (req, res) => {
    const { status } = req.body;
    try {
      db.prepare('UPDATE orders SET status = ? WHERE id = ?').run(status, req.params.id);
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: 'Failed to update order status' });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    // In production, serve static files
    app.use(express.static('dist'));
    app.get('*', (req, res) => {
      res.sendFile('dist/index.html', { root: '.' });
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
