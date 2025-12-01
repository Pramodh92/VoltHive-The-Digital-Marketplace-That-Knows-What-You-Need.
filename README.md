# Electronics E-Commerce Store

A full-stack e-commerce website built with vanilla JavaScript, Node.js, Express, and Supabase (PostgreSQL) database.

## Features

### Customer Features
- Browse products by category
- Search and filter products
- View detailed product information
- Add products to shopping cart
- Update cart quantities
- Checkout with customer information
- User authentication (signup/login)
- View order history

### Admin Features
- Product management (Create, Read, Update, Delete)
- Manage product inventory
- View all products in admin panel

## Tech Stack

### Frontend
- HTML5
- CSS3 (Custom styling, no frameworks)
- Vanilla JavaScript (No frameworks)

### Backend
- Node.js
- Express.js
- JWT for authentication
- Bcrypt for password hashing

### Database
- Supabase (PostgreSQL)
  - Products table
  - Users table  
  - Orders table
  - Authentication with Supabase Auth

## Project Structure

```
ecommerce-project/
├── backend/
│   ├── server.js           # Main Express server
│   ├── routes/
│   │   ├── products.js     # Product routes
│   │   ├── auth.js         # Authentication routes
│   │   ├── cart.js         # Cart routes
│   │   ├── orders.js       # Order routes
│   │   └── admin.js        # Admin routes
│   └── data/
│       ├── products.json   # Product database
│       ├── users.json      # User database
│       └── orders.json     # Order database
├── frontend/
│   ├── index.html          # Home page
│   ├── products.html       # Products listing
│   ├── product.html        # Product details
│   ├── cart.html           # Shopping cart
│   ├── checkout.html       # Checkout page
│   ├── login.html          # Login page
│   ├── signup.html         # Signup page
│   ├── orders.html         # User orders
│   ├── admin.html          # Admin panel
│   ├── css/
│   │   └── styles.css      # All CSS styles
│   └── js/
│       ├── api.js          # API helper functions
│       ├── auth.js         # Authentication helpers
│       ├── cart.js         # Cart management
│       ├── app.js          # Home page logic
│       └── admin.js        # Admin panel logic
└── package.json            # Dependencies
```

## Installation & Setup

### Prerequisites
- Node.js (v14 or higher)
- npm (comes with Node.js)

### Step 1: Install Dependencies

Navigate to the project directory and run:

```bash
npm install
```

This will install the following packages:
- express
- cors
- jsonwebtoken
- bcrypt

### Step 2: Start the Server

```bash
npm start
```

Or directly:

```bash
node backend/server.js
```

The server will start on `http://localhost:3000`

### Step 3: Access the Application

Open your web browser and navigate to:

```
http://localhost:3000
```

The frontend will be served automatically by Express.

## Usage

### For Customers

1. **Browse Products**
   - Visit the home page to see featured products and categories
   - Click on categories to filter products
   - Use the search bar to find specific products

2. **Shopping**
   - Click "Add to Cart" on any product
   - View cart by clicking the cart icon (🛒)
   - Update quantities or remove items in cart
   - Proceed to checkout

3. **Account**
   - Sign up for a new account
   - Login to track orders
   - View order history in "My Orders"

### For Admin

1. **Create Admin User**
   - First, create a regular account through signup
   - Manually edit `backend/data/users.json`
   - Change the user's `role` from `"user"` to `"admin"`

2. **Access Admin Panel**
   - Login with admin account
   - Click "Admin" link in navigation
   - Manage products (Add/Edit/Delete)

## API Endpoints

### Products
- `GET /api/products` - Get all products (with optional search/filter)
- `GET /api/products/:id` - Get single product

### Authentication
- `POST /api/auth/signup` - Create new user account
- `POST /api/auth/login` - Login user

### Cart
- `POST /api/cart/add` - Add item to cart
- `GET /api/cart` - Get cart items
- `PUT /api/cart/update` - Update item quantity
- `DELETE /api/cart/remove` - Remove item from cart
- `DELETE /api/cart/clear` - Clear entire cart

### Orders
- `POST /api/orders/checkout` - Place order
- `GET /api/orders/user/:userId` - Get user's orders
- `GET /api/orders/:id` - Get single order

### Admin
- `GET /api/admin/products` - Get all products (admin)
- `POST /api/admin/products` - Create new product
- `PUT /api/admin/products/:id` - Update product
- `DELETE /api/admin/products/:id` - Delete product

## Configuration

### Change API Base URL

If you need to change the backend URL, edit `frontend/js/api.js`:

```javascript
const API_BASE_URL = 'http://localhost:3000/api';
```

### Change Server Port

Edit `backend/server.js`:

```javascript
const PORT = process.env.PORT || 3000;
```

Or set environment variable:

```bash
PORT=8080 node backend/server.js
```

## Deployment

### Deploy to Vercel

This application is ready to deploy to Vercel with Supabase as the backend.

**Quick Start**: See [QUICKSTART_DEPLOY.md](QUICKSTART_DEPLOY.md) for a 5-minute deployment guide.

**Detailed Guide**: See [DEPLOYMENT.md](DEPLOYMENT.md) for comprehensive deployment instructions.

#### Quick Deploy Steps:

1. Install Vercel CLI: `npm install -g vercel`
2. Login: `vercel login`
3. Deploy: `vercel`
4. Set environment variables in Vercel Dashboard
5. Deploy to production: `vercel --prod`

#### Required Environment Variables:

- `JWT_SECRET` - Secure random string for JWT token generation
- `NODE_ENV` - Set to `production`

See `.env.example` for more details.


## Security Notes

⚠️ **Important**: Security best practices for production deployment:

1. Set `JWT_SECRET` environment variable to a secure random string
2. Use HTTPS - Vercel provides this automatically
3. Consider adding rate limiting middleware
4. Add input validation and sanitization libraries
5. Passwords are hashed with bcrypt ✓
6. Configure Supabase Row Level Security (RLS) policies

## Default Data

The application comes with 10 sample products in different categories:
- Mobiles (iPhone, Samsung)
- Laptops (MacBook, Dell)
- Tablets (iPad)
- Accessories (Headphones, Mouse, Keyboard)
- Monitors (Gaming Monitor)

## Troubleshooting

### Server won't start
- Make sure port 3000 is not already in use
- Check if all dependencies are installed (`npm install`)

### Can't add to cart
- Make sure the server is running
- Check browser console for errors
- Verify API_BASE_URL in `frontend/js/api.js`

### Products not loading
- Check if `backend/data/products.json` exists
- Verify the server is running on correct port
- Check network tab in browser developer tools

## License

This project is for educational purposes.

## Author

Created as a demonstration of full-stack web development with vanilla JavaScript.
