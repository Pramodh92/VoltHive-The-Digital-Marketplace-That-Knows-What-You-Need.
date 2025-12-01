
-- Insert Products
INSERT INTO public.products (id, name, description, category, price, stock, image)
VALUES
  (1, 'iPhone 15 Pro', 'Latest iPhone with A17 Pro chip, titanium design, and advanced camera system. Features a 6.1-inch Super Retina XDR display.', 'mobiles', 999, 50, 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=500'),
  (2, 'Samsung Galaxy S24 Ultra', 'Premium Android flagship with S Pen, 200MP camera, and powerful performance. 6.8-inch Dynamic AMOLED display.', 'mobiles', 1199, 35, 'https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=500'),
  (3, 'MacBook Pro 16', 'Professional laptop with M3 Pro chip, 16GB RAM, 512GB SSD. Perfect for creators and developers.', 'laptops', 2499, 20, 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=500'),
  (4, 'Dell XPS 15', 'Powerful Windows laptop with Intel i7, 16GB RAM, 1TB SSD, and stunning 4K display.', 'laptops', 1899, 25, 'https://images.unsplash.com/photo-1593642632823-8f785ba67e45?w=500'),
  (5, 'iPad Pro 12.9', 'Ultimate tablet experience with M2 chip, Liquid Retina XDR display, and Apple Pencil support.', 'tablets', 1099, 30, 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=500'),
  (6, 'Sony WH-1000XM5', 'Industry-leading noise cancelling wireless headphones with exceptional sound quality and 30-hour battery life.', 'accessories', 399, 100, 'https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=500'),
  (7, 'Apple AirPods Pro', 'Premium wireless earbuds with active noise cancellation, transparency mode, and spatial audio.', 'accessories', 249, 150, 'https://images.unsplash.com/photo-1606841837239-c5a1a4a07af7?w=500'),
  (8, 'Samsung 49" Odyssey G9', 'Ultra-wide gaming monitor with 240Hz refresh rate, 1ms response time, and stunning QLED display.', 'monitors', 1399, 15, 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=500'),
  (9, 'Logitech MX Master 3S', 'Advanced wireless mouse with precision tracking, customizable buttons, and ergonomic design.', 'accessories', 99, 200, 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=500'),
  (10, 'Mechanical Gaming Keyboard', 'RGB backlit mechanical keyboard with Cherry MX switches, perfect for gaming and typing.', 'accessories', 149, 80, 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=500')
ON CONFLICT (id) DO NOTHING;

-- Reset sequence to avoid id conflicts for future inserts
SELECT setval('public.products_id_seq', (SELECT MAX(id) FROM public.products));
