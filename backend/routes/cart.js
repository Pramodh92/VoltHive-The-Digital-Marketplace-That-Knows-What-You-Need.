const express = require('express');
const router = express.Router();
const fs = require('fs').promises;
const path = require('path');

const PRODUCTS_FILE = path.join(__dirname, '../data/products.json');

// Helper function to read products
async function readProducts() {
  try {
    const data = await fs.readFile(PRODUCTS_FILE, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading products:', error);
    return [];
  }
}

// In-memory cart storage (in production, this would be in a database or session)
// Structure: { userId: [{ productId, quantity }] }
const carts = {};

// POST add item to cart
router.post('/add', async (req, res) => {
  try {
    const { productId, quantity = 1, userId = 'guest' } = req.body;
    
    if (!productId) {
      return res.status(400).json({ error: 'Product ID is required' });
    }
    
    // Verify product exists
    const products = await readProducts();
    const product = products.find(p => p.id === parseInt(productId));
    
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }
    
    // Check stock
    if (product.stock < quantity) {
      return res.status(400).json({ error: 'Insufficient stock' });
    }
    
    // Initialize cart if doesn't exist
    if (!carts[userId]) {
      carts[userId] = [];
    }
    
    // Check if product already in cart
    const existingItem = carts[userId].find(item => item.productId === parseInt(productId));
    
    if (existingItem) {
      // Update quantity
      const newQuantity = existingItem.quantity + quantity;
      if (product.stock < newQuantity) {
        return res.status(400).json({ error: 'Insufficient stock' });
      }
      existingItem.quantity = newQuantity;
    } else {
      // Add new item
      carts[userId].push({
        productId: parseInt(productId),
        quantity: quantity
      });
    }
    
    res.json({ 
      message: 'Item added to cart',
      cart: carts[userId]
    });
  } catch (error) {
    console.error('Cart add error:', error);
    res.status(500).json({ error: 'Failed to add item to cart' });
  }
});

// GET cart items
router.get('/', async (req, res) => {
  try {
    const userId = req.query.userId || 'guest';
    
    if (!carts[userId] || carts[userId].length === 0) {
      return res.json([]);
    }
    
    const products = await readProducts();
    
    // Populate cart items with product details
    const cartItems = carts[userId].map(item => {
      const product = products.find(p => p.id === item.productId);
      return {
        ...product,
        quantity: item.quantity,
        total: product.price * item.quantity
      };
    }).filter(item => item.id); // Filter out items where product was not found
    
    res.json(cartItems);
  } catch (error) {
    console.error('Cart fetch error:', error);
    res.status(500).json({ error: 'Failed to fetch cart' });
  }
});

// PUT update item quantity
router.put('/update', (req, res) => {
  try {
    const { productId, quantity, userId = 'guest' } = req.body;
    
    if (!productId || quantity === undefined) {
      return res.status(400).json({ error: 'Product ID and quantity are required' });
    }
    
    if (!carts[userId]) {
      return res.status(404).json({ error: 'Cart not found' });
    }
    
    const item = carts[userId].find(item => item.productId === parseInt(productId));
    
    if (!item) {
      return res.status(404).json({ error: 'Item not found in cart' });
    }
    
    if (quantity <= 0) {
      // Remove item if quantity is 0 or negative
      carts[userId] = carts[userId].filter(item => item.productId !== parseInt(productId));
    } else {
      item.quantity = quantity;
    }
    
    res.json({ 
      message: 'Cart updated',
      cart: carts[userId]
    });
  } catch (error) {
    console.error('Cart update error:', error);
    res.status(500).json({ error: 'Failed to update cart' });
  }
});

// DELETE remove item from cart
router.delete('/remove', (req, res) => {
  try {
    const { productId, userId = 'guest' } = req.body;
    
    if (!productId) {
      return res.status(400).json({ error: 'Product ID is required' });
    }
    
    if (!carts[userId]) {
      return res.status(404).json({ error: 'Cart not found' });
    }
    
    carts[userId] = carts[userId].filter(item => item.productId !== parseInt(productId));
    
    res.json({ 
      message: 'Item removed from cart',
      cart: carts[userId]
    });
  } catch (error) {
    console.error('Cart remove error:', error);
    res.status(500).json({ error: 'Failed to remove item from cart' });
  }
});

// DELETE clear entire cart
router.delete('/clear', (req, res) => {
  try {
    const userId = req.body.userId || 'guest';
    carts[userId] = [];
    
    res.json({ message: 'Cart cleared' });
  } catch (error) {
    console.error('Cart clear error:', error);
    res.status(500).json({ error: 'Failed to clear cart' });
  }
});

module.exports = router;
