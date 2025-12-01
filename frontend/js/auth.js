
// Authentication Helper Object using Supabase
const Auth = {
  // Check if user is logged in
  async isLoggedIn() {
    const { data } = await supabaseClient.auth.getSession();
    return !!data.session;
  },

  // Get stored token (Supabase handles this, but for compatibility)
  async getToken() {
    const { data } = await supabaseClient.auth.getSession();
    return data.session?.access_token;
  },

  // Get stored user info
  async getUser() {
    const { data } = await supabaseClient.auth.getUser();
    return data.user ? {
      ...data.user,
      username: data.user.user_metadata.username || data.user.email.split('@')[0],
      role: data.user.user_metadata.role || 'user' // Default to user
    } : null;
  },

  // Login - handled by API.login which calls supabase.auth.signInWithPassword
  // We just need to update UI listener

  // Logout
  async logout() {
    await supabaseClient.auth.signOut();
    window.location.href = 'index.html';
  },

  // Initialize Auth State Listener
  init() {
    supabaseClient.auth.onAuthStateChange((event, session) => {
      updateAuthUI();
    });
  }
};

// Update UI based on authentication status
async function updateAuthUI() {
  const userInfo = document.getElementById('userInfo');
  const authLinks = document.getElementById('authLinks');
  const userName = document.getElementById('userName');
  const ordersLink = document.getElementById('ordersLink');
  const adminLink = document.getElementById('adminLink');
  const logoutBtn = document.getElementById('logoutBtn');

  const { data: { session } } = await supabaseClient.auth.getSession();

  if (session) {
    const user = session.user;
    const username = user.user_metadata.username || user.email;
    const role = user.user_metadata.role || 'user';

    // Show user info, hide auth links
    if (userInfo) userInfo.style.display = 'flex';
    if (authLinks) authLinks.style.display = 'none';
    if (userName) userName.textContent = username;

    // Show orders link
    if (ordersLink) {
      ordersLink.style.display = 'block';
      ordersLink.href = 'orders.html';
    }

    // Show admin link if user is admin
    if (adminLink && role === 'admin') {
      adminLink.style.display = 'block';
      adminLink.href = 'admin.html';
    }

    // Setup logout button
    if (logoutBtn) {
      // Remove old listeners to avoid duplicates (simple way is to clone node or just ensure one listener)
      // For now, we'll just add it, assuming init is called once.
      logoutBtn.onclick = async (e) => {
        e.preventDefault();
        if (confirm('Are you sure you want to logout?')) {
          await Auth.logout();
        }
      };
    }
  } else {
    // Show auth links, hide user info
    if (userInfo) userInfo.style.display = 'none';
    if (authLinks) authLinks.style.display = 'flex';
    if (ordersLink) ordersLink.style.display = 'none';
    if (adminLink) adminLink.style.display = 'none';
  }
}

// Initialize on load
document.addEventListener('DOMContentLoaded', () => {
  Auth.init();
  updateAuthUI();
});
