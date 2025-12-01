// Main app initialization for home page
document.addEventListener('DOMContentLoaded', () => {
  updateAuthUI();
  updateCartCount();
  loadCategories();
  loadFeaturedProducts();
});

// Category icons mapping
const categoryIcons = {
  mobiles: '📱',
  laptops: '💻',
  tablets: '📱',
  accessories: '🎧',
  monitors: '🖥️',
};

// Load categories
async function loadCategories() {
  try {
    const products = await API.getProducts();
    const categories = [...new Set(products.map(p => p.category))];
    
    const categoriesGrid = document.getElementById('categoriesGrid');
    
    categoriesGrid.innerHTML = categories.map(category => `
      <a href="products.html?category=${category}" class="category-card">
        <div class="category-icon">${categoryIcons[category] || '📦'}</div>
        <h3>${category.charAt(0).toUpperCase() + category.slice(1)}</h3>
      </a>
    `).join('');
  } catch (error) {
    console.error('Error loading categories:', error);
  }
}

// Load featured products (first 6 products)
async function loadFeaturedProducts() {
  try {
    const products = await API.getProducts();
    const featured = products.slice(0, 6);
    
    const featuredProducts = document.getElementById('featuredProducts');
    
    featuredProducts.innerHTML = featured.map(product => `
      <div class="product-card">
        <img src="${product.image}" alt="${product.name}" class="product-image" onclick="window.location.href='product.html?id=${product.id}'">
        <div class="product-info">
          <div class="product-category">${product.category}</div>
          <h3 class="product-name">${product.name}</h3>
          <div class="product-price">$${product.price.toFixed(2)}</div>
          <div class="product-actions">
            <button class="btn btn-outline btn-small" onclick="window.location.href='product.html?id=${product.id}'">View Details</button>
            <button class="btn btn-primary btn-small" onclick="addToCartHome(${product.id})">Add to Cart</button>
          </div>
        </div>
      </div>
    `).join('');
  } catch (error) {
    console.error('Error loading featured products:', error);
  }
}

// Add to cart from home page
async function addToCartHome(productId) {
  try {
    await Cart.addItem(productId, 1);
    alert('Product added to cart!');
    updateCartCount();
  } catch (error) {
    console.error('Error adding to cart:', error);
    alert('Failed to add product to cart');
  }
}
