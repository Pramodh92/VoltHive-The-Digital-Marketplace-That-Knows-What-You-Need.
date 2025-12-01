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

// GET all products with optional search and category filter
router.get('/', async (req, res) => {
  try {
    let products = await readProducts();
    
    // Filter by search query
    const search = req.query.search;
    if (search) {
      products = products.filter(product => 
        product.name.toLowerCase().includes(search.toLowerCase()) ||
        product.description.toLowerCase().includes(search.toLowerCase())
      );
    }
    
    // Filter by category
    const category = req.query.category;
    if (category && category !== 'all') {
      products = products.filter(product => 
        product.category.toLowerCase() === category.toLowerCase()
      );
    }
    
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch products' });
  }
});

// GET single product by ID
router.get('/:id', async (req, res) => {
  try {
    const products = await readProducts();
    const productId = parseInt(req.params.id);
    const product = products.find(p => p.id === productId);
    
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }
    
    res.json(product);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch product' });
  }
});

// GET all categories
router.get('/meta/categories', async (req, res) => {
  try {
    const products = await readProducts();
    const categories = [...new Set(products.map(p => p.category))];
    res.json(categories);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch categories' });
  }
});

module.exports = router;
