const express = require('express');
const router = express.Router();
const fs = require('fs').promises;
const path = require('path');

const ORDERS_FILE = path.join(__dirname, '../data/orders.json');
const PRODUCTS_FILE = path.join(__dirname, '../data/products.json');

// Helper functions
async function readOrders() {
  try {
    const data = await fs.readFile(ORDERS_FILE, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading orders:', error);
    return [];
  }
}

async function writeOrders(orders) {
  try {
    await fs.writeFile(ORDERS_FILE, JSON.stringify(orders, null, 2));
  } catch (error) {
    console.error('Error writing orders:', error);
    throw error;
  }
}

async function readProducts() {
  try {
    const data = await fs.readFile(PRODUCTS_FILE, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading products:', error);
    return [];
  }
}

async function writeProducts(products) {
  try {
    await fs.writeFile(PRODUCTS_FILE, JSON.stringify(products, null, 2));
  } catch (error) {
    console.error('Error writing products:', error);
    throw error;
  }
}

// POST create order (checkout)
router.post('/checkout', async (req, res) => {
  try {
    const { 
      userId = 'guest', 
      items, 
      customerInfo,
      totalAmount 
    } = req.body;
    
    // Validate input
    if (!items || items.length === 0) {
      return res.status(400).json({ error: 'Cart is empty' });
    }
    
    if (!customerInfo || !customerInfo.name || !customerInfo.email || !customerInfo.address) {
      return res.status(400).json({ error: 'Customer information is required' });
    }
    
    // Verify stock availability and calculate total
    const products = await readProducts();
    let calculatedTotal = 0;
    
    for (const item of items) {
      const product = products.find(p => p.id === item.id);
      
      if (!product) {
        return res.status(404).json({ error: `Product ${item.name} not found` });
      }
      
      if (product.stock < item.quantity) {
        return res.status(400).json({ 
          error: `Insufficient stock for ${product.name}. Available: ${product.stock}` 
        });
      }
      
      calculatedTotal += product.price * item.quantity;
    }
    
    // Update product stock
    for (const item of items) {
      const product = products.find(p => p.id === item.id);
      product.stock -= item.quantity;
    }
    await writeProducts(products);
    
    // Create order
    const orders = await readOrders();
    const newOrder = {
      id: orders.length > 0 ? Math.max(...orders.map(o => o.id)) + 1 : 1,
      userId,
      items: items.map(item => ({
        productId: item.id,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
        total: item.price * item.quantity
      })),
      customerInfo,
      totalAmount: calculatedTotal,
      status: 'pending',
      createdAt: new Date().toISOString()
    };
    
    orders.push(newOrder);
    await writeOrders(orders);
    
    res.status(201).json({
      message: 'Order placed successfully',
      order: newOrder
    });
  } catch (error) {
    console.error('Checkout error:', error);
    res.status(500).json({ error: 'Failed to place order' });
  }
});

// GET user orders
router.get('/user/:userId', async (req, res) => {
  try {
    const userId = req.params.userId;
    const orders = await readOrders();
    
    // Filter orders by user ID
    const userOrders = orders.filter(order => order.userId === userId);
    
    // Sort by date (newest first)
    userOrders.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    
    res.json(userOrders);
  } catch (error) {
    console.error('Fetch orders error:', error);
    res.status(500).json({ error: 'Failed to fetch orders' });
  }
});

// GET single order by ID
router.get('/:id', async (req, res) => {
  try {
    const orderId = parseInt(req.params.id);
    const orders = await readOrders();
    
    const order = orders.find(o => o.id === orderId);
    
    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }
    
    res.json(order);
  } catch (error) {
    console.error('Fetch order error:', error);
    res.status(500).json({ error: 'Failed to fetch order' });
  }
});

// GET all orders (admin only)
router.get('/', async (req, res) => {
  try {
    const orders = await readOrders();
    
    // Sort by date (newest first)
    orders.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    
    res.json(orders);
  } catch (error) {
    console.error('Fetch orders error:', error);
    res.status(500).json({ error: 'Failed to fetch orders' });
  }
});

module.exports = router;
