// Cart Helper Object
// Cart Helper Object
const Cart = {
  // Get user ID (from logged-in user or 'guest')
  async getUserId() {
    const user = await Auth.getUser();
    return user ? user.id : 'guest';
  },

  // Add item to cart
  async addItem(productId, quantity = 1) {
    try {
      const userId = await this.getUserId();
      await API.addToCart(productId, quantity, userId);
    } catch (error) {
      console.error('Cart error:', error);
      throw error;
    }
  },

  // Get cart items
  async getItems() {
    try {
      const userId = await this.getUserId();
      return await API.getCart(userId);
    } catch (error) {
      console.error('Cart error:', error);
      throw error;
    }
  },

  // Update item quantity
  async updateQuantity(productId, quantity) {
    try {
      const userId = await this.getUserId();
      await API.updateCartItem(productId, quantity, userId);
    } catch (error) {
      console.error('Cart error:', error);
      throw error;
    }
  },

  // Remove item from cart
  async removeItem(productId) {
    try {
      const userId = await this.getUserId();
      await API.removeFromCart(productId, userId);
    } catch (error) {
      console.error('Cart error:', error);
      throw error;
    }
  },

  // Clear cart
  async clearCart() {
    try {
      const userId = await this.getUserId();
      await API.clearCart(userId);
    } catch (error) {
      console.error('Cart error:', error);
      throw error;
    }
  },

  // Get cart count
  async getCount() {
    try {
      const items = await this.getItems();
      return items.reduce((total, item) => total + item.quantity, 0);
    } catch (error) {
      console.error('Cart error:', error);
      return 0;
    }
  },
};

// Update cart count in header
async function updateCartCount() {
  const cartCount = document.getElementById('cartCount');
  if (cartCount) {
    try {
      const count = await Cart.getCount();
      cartCount.textContent = count;
      cartCount.style.display = count > 0 ? 'flex' : 'none';
    } catch (error) {
      console.error('Error updating cart count:', error);
    }
  }
}
