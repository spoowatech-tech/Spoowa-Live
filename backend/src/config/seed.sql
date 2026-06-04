-- ============================================================
-- SPOOWA Seed Data
-- ============================================================

USE spoowa_db;

-- ============================================================
-- Products (24 honey products from Shop.jsx)
-- ============================================================
INSERT INTO products (id, name, description, price, original_price, badge, discount, image, gradient, type, benefit, category, rating, reviews, is_bestseller) VALUES
(1,  'Raw Forest Honey',        '100% Pure & Unfiltered',       499,  699,  'Bestseller', '-29%', 'product_honey.png', 'from-amber-200 to-yellow-50',  'Raw Honey',        'Immunity',          'best-selling',   4.9, 2156, TRUE),
(2,  'Turmeric Honey',          'With Curcumin Goodness',       399,  549,  'Immunity',   '-27%', 'product_honey.png', 'from-orange-200 to-yellow-50', 'Turmeric Honey',   'Immunity',          'best-selling',   4.8, 1843, FALSE),
(3,  'Acacia Honey',            'Naturally Sweet & Light',      449,  599,  'Premium',    '-25%', 'product_honey.png', 'from-yellow-100 to-white',     'Acacia Honey',     'Energy Boost',      'new-arrivals',   4.7, 1247, FALSE),
(4,  'Wild Forest Honey',       'Rare. Raw. Real.',             599,  849,  'Bestseller', '-29%', 'product_honey.png', 'from-amber-300 to-amber-100',  'Wild Forest Honey','Immunity',          'best-selling',   4.9, 3120, TRUE),
(5,  'Ginger Honey',            'Soothes & Strengthens',        349,  499,  'Popular',    '-30%', 'product_honey.png', 'from-lime-100 to-yellow-50',   'Ginger Honey',     'Digestion',         'new-arrivals',   4.6, 987,  FALSE),
(6,  'Honey Gift Pack',         'Perfect for Gifting',          999,  1299, 'Gift',       '-23%', 'product_honey.png', 'from-rose-100 to-yellow-50',   'Gift Packs',       'Immunity',          'highest-rated',  4.8, 654,  FALSE),
(7,  'Wellness Combo Pack',     'Immunity + Energy',            1499, 1999, 'Bestseller', '-25%', 'product_honey.png', 'from-emerald-100 to-yellow-50','Wellness Combos',  'Weight Management', 'best-selling',   4.9, 2891, TRUE),
(8,  'Kashmir Multiflora Honey','Natural Daily Booster',        549,  749,  'Premium',    '-27%', 'product_honey.png', 'from-blue-100 to-yellow-50',   'Raw Honey',        'Energy Boost',      'new-arrivals',   4.7, 1432, FALSE),
(9,  'Organic Honey',           'Certified Organic Pure',       649,  849,  'Organic',    '-24%', 'product_honey.png', 'from-green-100 to-white',      'Organic Honey',    'Skin Health',       'highest-rated',  4.8, 1105, FALSE),
(10, 'Manuka Style Honey',      'High MGO Active',              899,  1199, 'Premium',    '-25%', 'product_honey.png', 'from-amber-100 to-yellow-50',  'Raw Honey',        'Immunity',          'highest-rated',  4.9, 876,  FALSE),
(11, 'Sidr Honey',              'Rare Premium Honey',           1299, 1699, 'Luxury',     '-24%', 'product_honey.png', 'from-orange-100 to-amber-50',  'Wild Forest Honey','Energy Boost',      'price-high-low', 4.8, 543,  FALSE),
(12, 'Eucalyptus Honey',        'Strong & Distinct',            399,  549,  'Popular',    '-27%', 'product_honey.png', 'from-teal-100 to-white',       'Raw Honey',        'Digestion',         'price-low-high', 4.6, 432,  FALSE),
(13, 'Litchi Honey',            'Premium Floral Honey',         449,  599,  'Popular',    '-25%', 'product_honey.png', 'from-pink-100 to-yellow-50',   'Raw Honey',        'Skin Health',       'new-arrivals',   4.7, 765,  FALSE),
(14, 'Coffee Blended Honey',    'Energy & Focus',               449,  599,  'New',        '-25%', 'product_honey.png', 'from-stone-100 to-amber-50',   'Wellness Combos',  'Energy Boost',      'new-arrivals',   4.5, 321,  FALSE),
(15, 'Berry Infused Honey',     'Antioxidant Rich',             499,  649,  'Popular',    '-23%', 'product_honey.png', 'from-purple-100 to-yellow-50', 'Organic Honey',    'Skin Health',       'highest-rated',  4.7, 654,  FALSE),
(16, 'Propolis Honey Mix',      'Immunity Shield',              699,  899,  'Bestseller', '-22%', 'product_honey.png', 'from-red-100 to-amber-50',     'Wellness Combos',  'Immunity',          'best-selling',   4.8, 543,  TRUE),
(17, 'Cinnamon Honey Blend',    'Metabolism Booster',           379,  499,  'Popular',    '-24%', 'product_honey.png', 'from-rose-100 to-yellow-100',  'Ginger Honey',     'Weight Management', 'price-low-high', 4.6, 432,  FALSE),
(18, 'Royal Jelly Honey',       'Premium Wellness',             899,  1199, 'Luxury',     '-25%', 'product_honey.png', 'from-yellow-100 to-white',     'Gift Packs',       'Energy Boost',      'price-high-low', 4.9, 287,  FALSE),
(19, 'Honey & Lemon Combo',     'Daily Wellness Duo',           299,  399,  'Value',      '-25%', 'product_honey.png', 'from-lime-100 to-white',       'Wellness Combos',  'Digestion',         'price-low-high', 4.5, 876,  FALSE),
(20, 'Pure Forest Honey 1kg',   'Family Size Pack',             799,  1099, 'Value',      '-27%', 'product_honey.png', 'from-amber-200 to-yellow-100', 'Raw Honey',        'Immunity',          'best-selling',   4.8, 1543, TRUE),
(21, 'Honey & Almond Mix',      'Brain & Energy Boost',         599,  799,  'New',        '-25%', 'product_honey.png', 'from-stone-100 to-amber-50',   'Gift Packs',       'Energy Boost',      'new-arrivals',   4.7, 543,  FALSE),
(22, 'Tulsi Honey Blend',       'Ayurvedic Wellness',           449,  599,  'Immunity',   '-25%', 'product_honey.png', 'from-green-100 to-yellow-50',  'Turmeric Honey',   'Immunity',          'highest-rated',  4.8, 765,  FALSE),
(23, 'Pure Acacia Honey 500g',  'Light & Delicate',             399,  549,  'Premium',    '-27%', 'product_honey.png', 'from-yellow-50 to-white',      'Acacia Honey',     'Digestion',         'price-low-high', 4.7, 987,  FALSE),
(24, 'Honeycomb Gift Pack',     'Premium Gifting Hamper',       1999, 2499, 'Luxury',     '-20%', 'product_honey.png', 'from-amber-100 to-orange-50',  'Gift Packs',       'Immunity',          'price-high-low', 4.9, 234,  FALSE);

-- ============================================================
-- Product Sizes
-- ============================================================
INSERT INTO product_sizes (product_id, size_label) VALUES
-- Products with 3 sizes: 250g, 500g, 1kg
(1, '250g'), (1, '500g'), (1, '1kg'),
(2, '250g'), (2, '500g'), (2, '1kg'),
(3, '250g'), (3, '500g'), (3, '1kg'),
(4, '250g'), (4, '500g'), (4, '1kg'),
(5, '250g'), (5, '500g'), (5, '1kg'),
(7, '250g'), (7, '500g'), (7, '1kg'),
(8, '250g'), (8, '500g'), (8, '1kg'),
(9, '250g'), (9, '500g'), (9, '1kg'),
(12, '250g'), (12, '500g'), (12, '1kg'),
(13, '250g'), (13, '500g'), (13, '1kg'),
(15, '250g'), (15, '500g'), (15, '1kg'),
(17, '250g'), (17, '500g'), (17, '1kg'),
(22, '250g'), (22, '500g'), (22, '1kg'),
-- Products with 2 sizes: 500g, 1kg
(6, '500g'), (6, '1kg'),
(20, '500g'), (20, '1kg'),
(24, '500g'), (24, '1kg'),
-- Products with 2 sizes: 250g, 500g
(10, '250g'), (10, '500g'),
(11, '250g'), (11, '500g'),
(14, '250g'), (14, '500g'),
(18, '250g'), (18, '500g'),
(19, '250g'), (19, '500g'),
(21, '250g'), (21, '500g'),
(23, '250g'), (23, '500g');

-- ============================================================
-- Coupons
-- ============================================================
INSERT INTO coupons (code, discount_type, discount_value, min_order, max_discount, is_active) VALUES
('SPOOWA10',    'percentage', 10.00, 200.00, 100.00,  TRUE),
('WELCOME20',   'percentage', 20.00, 500.00, 200.00,  TRUE),
('FLAT50',      'flat',       50.00, 300.00, NULL,     TRUE),
('HONEY100',    'flat',      100.00, 800.00, NULL,     TRUE),
('MEGA25',      'percentage', 25.00, 1000.00, 500.00, TRUE);
