
// API Helper Object using Supabase
const API = {
  // Products
  async getProducts(search = '', category = '') {
    try {
      let query = supabaseClient.from('products').select('*');

      if (search) {
        query = query.ilike('name', `%${search}%`);
      }

      if (category) {
        query = query.eq('category', category);
      }

      const { data, error } = await query;

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  },

  async getProduct(id) {
    try {
      const { data, error } = await supabaseClient
        .from('products')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  },

  // Authentication (Handled in auth.js mostly, but keeping wrappers if needed)
  async signup(username, email, password) {
    // Supabase Auth handles this directly
    const { data, error } = await supabaseClient.auth.signUp({
      email,
      password,
      options: {
        data: { username }
      }
    });

    if (error) throw error;
    return data;
  },

  async login(email, password) {
    const { data, error } = await supabaseClient.auth.signInWithPassword({
      email,
      password
    });

    if (error) throw error;
    return data;
  },

  // Cart - Using LocalStorage for simplicity in this serverless version
  // or we can use the 'cart_items' table if we want persistence across devices.
  // For this migration, let's stick to LocalStorage for guest/user cart to minimize complexity
  // unless the user specifically requested persistent cart.
  // The original implementation used a backend cart. 
  // Let's implement a simple LocalStorage cart for now to get it working quickly without RLS issues.

  // Actually, the original code had API calls for cart. 
  // Let's try to implement a simple database cart if the user is logged in, 
  // but fallback to local storage if not?
  // To keep it simple and robust:
  // We will use LocalStorage for the cart in this "Serverless" version.
  // This avoids RLS complexity for 'guest' users.

  async addToCart(productId, quantity, userId = 'guest') {
    // Local implementation
    let cart = JSON.parse(localStorage.getItem('cart') || '[]');
    const existingItem = cart.find(item => item.productId === productId);

    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      cart.push({ productId, quantity });
    }

    localStorage.setItem('cart', JSON.stringify(cart));
    return { message: 'Added to cart', cart };
  },

  async getCart(userId = 'guest') {
    // Local implementation
    // We need to fetch product details for items in cart
    let cart = JSON.parse(localStorage.getItem('cart') || '[]');

    // Fetch details for all products in cart
    if (cart.length === 0) return [];

    const productIds = cart.map(item => item.productId);
    const { data: products, error } = await supabaseClient
      .from('products')
      .select('*')
      .in('id', productIds);

    if (error) throw error;

    // Merge details
    return cart.map(item => {
      const product = products.find(p => p.id == item.productId);
      return {
        ...item,
        product
      };
    });
  },

  async updateCartItem(productId, quantity, userId = 'guest') {
    let cart = JSON.parse(localStorage.getItem('cart') || '[]');
    const item = cart.find(i => i.productId == productId);
    if (item) {
      item.quantity = parseInt(quantity);
      localStorage.setItem('cart', JSON.stringify(cart));
    }
    return { message: 'Updated cart', cart };
  },

  async removeFromCart(productId, userId = 'guest') {
    let cart = JSON.parse(localStorage.getItem('cart') || '[]');
    cart = cart.filter(i => i.productId != productId);
    localStorage.setItem('cart', JSON.stringify(cart));
    return { message: 'Removed from cart', cart };
  },

  async clearCart(userId = 'guest') {
    localStorage.removeItem('cart');
    return { message: 'Cart cleared' };
  },

  // Orders
  async checkout(orderData) {
    try {
      const user = supabaseClient.auth.getUser();
      if (!user) throw new Error('User not logged in');

      // 1. Create Order
      const { data: order, error: orderError } = await supabaseClient
        .from('orders')
        .insert({
          user_id: (await supabaseClient.auth.getUser()).data.user.id,
          total_amount: orderData.totalAmount,
          shipping_address: orderData.shippingAddress,
          status: 'pending'
        })
        .select()
        .single();

      if (orderError) throw orderError;

      // 2. Create Order Items
      const orderItems = orderData.items.map(item => ({
        order_id: order.id,
        product_id: item.product.id,
        quantity: item.quantity,
        price_at_purchase: item.product.price
      }));

      const { error: itemsError } = await supabaseClient
        .from('order_items')
        .insert(orderItems);

      if (itemsError) throw itemsError;

      // Clear local cart
      localStorage.removeItem('cart');

      return order;
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  },

  async getUserOrders(userId) {
    try {
      const { data, error } = await supabaseClient
        .from('orders')
        .select('*, order_items(*, products(*))')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  },

  // Admin
  async createProduct(productData) {
    // Note: This requires RLS policy to allow insert
    const { data, error } = await supabaseClient
      .from('products')
      .insert(productData)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async updateProduct(id, productData) {
    const { data, error } = await supabaseClient
      .from('products')
      .update(productData)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async deleteProduct(id) {
    const { error } = await supabaseClient
      .from('products')
      .delete()
      .eq('id', id);

    if (error) throw error;
    return { message: 'Product deleted' };
  },
};
