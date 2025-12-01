const express = require('express');
const router = express.Router();
const fs = require('fs').promises;
const path = require('path');
const { verifyToken } = require('./auth');

const PRODUCTS_FILE = path.join(__dirname, '../data/products.json');

// Helper functions
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

// Middleware to check admin role
function isAdmin(req, res, next) {
  // For simplicity, check if user role is 'admin'
  // In a real app, you'd verify the token and check role from database
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    res.status(403).json({ error: 'Admin access required' });
  }
}

// Note: For demo purposes, we'll allow some routes without strict auth
// In production, all admin routes should be protected with verifyToken and isAdmin

// GET all products (for admin panel)
router.get('/products', async (req, res) => {
  try {
    const products = await readProducts();
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch products' });
  }
});

// POST create new product
router.post('/products', async (req, res) => {
  try {
    const { name, description, category, price, stock, image } = req.body;
    
    // Validate input
    if (!name || !price || !category) {
      return res.status(400).json({ error: 'Name, price, and category are required' });
    }
    
    const products = await readProducts();
    
    // Create new product
    const newProduct = {
      id: products.length > 0 ? Math.max(...products.map(p => p.id)) + 1 : 1,
      name,
      description: description || '',
      category,
      price: parseFloat(price),
      stock: parseInt(stock) || 0,
      image: image || 'https://via.placeholder.com/500?text=No+Image'
    };
    
    products.push(newProduct);
    await writeProducts(products);
    
    res.status(201).json({
      message: 'Product created successfully',
      product: newProduct
    });
  } catch (error) {
    console.error('Create product error:', error);
    res.status(500).json({ error: 'Failed to create product' });
  }
});

// PUT update product
router.put('/products/:id', async (req, res) => {
  try {
    const productId = parseInt(req.params.id);
    const { name, description, category, price, stock, image } = req.body;
    
    const products = await readProducts();
    const productIndex = products.findIndex(p => p.id === productId);
    
    if (productIndex === -1) {
      return res.status(404).json({ error: 'Product not found' });
    }
    
    // Update product
    products[productIndex] = {
      ...products[productIndex],
      name: name || products[productIndex].name,
      description: description !== undefined ? description : products[productIndex].description,
      category: category || products[productIndex].category,
      price: price !== undefined ? parseFloat(price) : products[productIndex].price,
      stock: stock !== undefined ? parseInt(stock) : products[productIndex].stock,
      image: image || products[productIndex].image
    };
    
    await writeProducts(products);
    
    res.json({
      message: 'Product updated successfully',
      product: products[productIndex]
    });
  } catch (error) {
    console.error('Update product error:', error);
    res.status(500).json({ error: 'Failed to update product' });
  }
});

// DELETE product
router.delete('/products/:id', async (req, res) => {
  try {
    const productId = parseInt(req.params.id);
    
    const products = await readProducts();
    const productIndex = products.findIndex(p => p.id === productId);
    
    if (productIndex === -1) {
      return res.status(404).json({ error: 'Product not found' });
    }
    
    // Remove product
    const deletedProduct = products.splice(productIndex, 1)[0];
    await writeProducts(products);
    
    res.json({
      message: 'Product deleted successfully',
      product: deletedProduct
    });
  } catch (error) {
    console.error('Delete product error:', error);
    res.status(500).json({ error: 'Failed to delete product' });
  }
});

module.exports = router;
