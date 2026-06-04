-- ============================================================
-- SPOOWA Database Schema
-- ============================================================

CREATE DATABASE IF NOT EXISTS spoowa_db
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE spoowa_db;

-- ============================================================
-- Users
-- ============================================================
CREATE TABLE IF NOT EXISTS users (
  id          INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  name        VARCHAR(100)  NOT NULL,
  email       VARCHAR(255)  NOT NULL UNIQUE,
  password    VARCHAR(255)  DEFAULT NULL,
  phone       VARCHAR(20)   UNIQUE DEFAULT NULL,
  phone_verified BOOLEAN    DEFAULT FALSE,
  provider    VARCHAR(50)   DEFAULT 'local',
  google_id   VARCHAR(255)  UNIQUE DEFAULT NULL,
  created_at  TIMESTAMP     DEFAULT CURRENT_TIMESTAMP,
  updated_at  TIMESTAMP     DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_users_email (email),
  INDEX idx_users_phone (phone)
) ENGINE=InnoDB;

-- ============================================================
-- Refresh Tokens
-- ============================================================
CREATE TABLE IF NOT EXISTS refresh_tokens (
  id          INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  user_id     INT UNSIGNED NOT NULL,
  token       VARCHAR(500) NOT NULL,
  expires_at  TIMESTAMP    NOT NULL,
  created_at  TIMESTAMP    DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_refresh_tokens_token (token)
) ENGINE=InnoDB;

-- ============================================================
-- OTP Codes
-- ============================================================
CREATE TABLE IF NOT EXISTS otp_codes (
  id          INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  identifier  VARCHAR(255) NOT NULL,
  code        VARCHAR(255) NOT NULL,
  expires_at  TIMESTAMP    NOT NULL,
  created_at  TIMESTAMP    DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_otp_codes_identifier (identifier)
) ENGINE=InnoDB;

-- ============================================================
-- Products
-- ============================================================
CREATE TABLE IF NOT EXISTS products (
  id              INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  name            VARCHAR(150)  NOT NULL,
  description     VARCHAR(500)  NOT NULL DEFAULT '',
  detail_text     TEXT,
  price           DECIMAL(10,2) NOT NULL,
  original_price  DECIMAL(10,2) NOT NULL,
  badge           VARCHAR(50)   DEFAULT NULL,
  discount        VARCHAR(10)   DEFAULT NULL,
  image           VARCHAR(500)  DEFAULT 'product_honey.png',
  gradient        VARCHAR(100)  DEFAULT 'from-amber-200 to-yellow-50',
  type            VARCHAR(100)  DEFAULT 'Raw Honey',
  benefit         VARCHAR(100)  DEFAULT 'Immunity',
  category        VARCHAR(100)  DEFAULT 'best-selling',
  rating          DECIMAL(2,1)  DEFAULT 0.0,
  reviews         INT UNSIGNED  DEFAULT 0,
  is_bestseller   BOOLEAN       DEFAULT FALSE,
  is_active       BOOLEAN       DEFAULT TRUE,
  created_at      TIMESTAMP     DEFAULT CURRENT_TIMESTAMP,
  updated_at      TIMESTAMP     DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_products_type (type),
  INDEX idx_products_benefit (benefit),
  INDEX idx_products_category (category),
  INDEX idx_products_price (price),
  INDEX idx_products_rating (rating)
) ENGINE=InnoDB;

-- ============================================================
-- Product Sizes (many-to-many style but simple)
-- ============================================================
CREATE TABLE IF NOT EXISTS product_sizes (
  id          INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  product_id  INT UNSIGNED NOT NULL,
  size_label  VARCHAR(20)  NOT NULL,
  FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
  UNIQUE KEY uq_product_size (product_id, size_label)
) ENGINE=InnoDB;

-- ============================================================
-- Cart Items
-- ============================================================
CREATE TABLE IF NOT EXISTS cart_items (
  id          INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  user_id     INT UNSIGNED NOT NULL,
  product_id  INT UNSIGNED NOT NULL,
  quantity    INT UNSIGNED NOT NULL DEFAULT 1,
  created_at  TIMESTAMP    DEFAULT CURRENT_TIMESTAMP,
  updated_at  TIMESTAMP    DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id)    REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
  UNIQUE KEY uq_cart_user_product (user_id, product_id)
) ENGINE=InnoDB;

-- ============================================================
-- Addresses
-- ============================================================
CREATE TABLE IF NOT EXISTS addresses (
  id            INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  user_id       INT UNSIGNED  NOT NULL,
  label         VARCHAR(50)   DEFAULT 'Home',
  full_name     VARCHAR(100)  NOT NULL,
  phone         VARCHAR(20)   DEFAULT NULL,
  address_line  VARCHAR(500)  NOT NULL,
  city          VARCHAR(100)  NOT NULL,
  state         VARCHAR(100)  NOT NULL,
  pin_code      VARCHAR(10)   NOT NULL,
  is_default    BOOLEAN       DEFAULT FALSE,
  created_at    TIMESTAMP     DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_addresses_user (user_id)
) ENGINE=InnoDB;

-- ============================================================
-- Coupons
-- ============================================================
CREATE TABLE IF NOT EXISTS coupons (
  id              INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  code            VARCHAR(50)   NOT NULL UNIQUE,
  discount_type   ENUM('percentage','flat') NOT NULL DEFAULT 'percentage',
  discount_value  DECIMAL(10,2) NOT NULL,
  min_order       DECIMAL(10,2) DEFAULT 0,
  max_discount    DECIMAL(10,2) DEFAULT NULL,
  is_active       BOOLEAN       DEFAULT TRUE,
  expires_at      TIMESTAMP     NULL DEFAULT NULL,
  created_at      TIMESTAMP     DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_coupons_code (code)
) ENGINE=InnoDB;

-- ============================================================
-- Orders
-- ============================================================
CREATE TABLE IF NOT EXISTS orders (
  id              INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  user_id         INT UNSIGNED   NOT NULL,
  address_id      INT UNSIGNED   DEFAULT NULL,
  coupon_code     VARCHAR(50)    DEFAULT NULL,
  subtotal        DECIMAL(10,2)  NOT NULL,
  discount_amount DECIMAL(10,2)  DEFAULT 0,
  shipping        DECIMAL(10,2)  DEFAULT 0,
  total           DECIMAL(10,2)  NOT NULL,
  status          ENUM('pending','confirmed','shipped','delivered','cancelled') DEFAULT 'pending',
  created_at      TIMESTAMP      DEFAULT CURRENT_TIMESTAMP,
  updated_at      TIMESTAMP      DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id)    REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (address_id) REFERENCES addresses(id) ON DELETE SET NULL,
  INDEX idx_orders_user (user_id),
  INDEX idx_orders_status (status)
) ENGINE=InnoDB;

-- ============================================================
-- Order Items
-- ============================================================
CREATE TABLE IF NOT EXISTS order_items (
  id          INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  order_id    INT UNSIGNED   NOT NULL,
  product_id  INT UNSIGNED   NOT NULL,
  quantity    INT UNSIGNED   NOT NULL DEFAULT 1,
  price       DECIMAL(10,2)  NOT NULL,
  FOREIGN KEY (order_id)   REFERENCES orders(id) ON DELETE CASCADE,
  FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
  INDEX idx_order_items_order (order_id)
) ENGINE=InnoDB;

-- ============================================================
-- Newsletter Subscribers
-- ============================================================
CREATE TABLE IF NOT EXISTS newsletter_subscribers (
  id          INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  email       VARCHAR(255)  NOT NULL UNIQUE,
  subscribed_at TIMESTAMP   DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_newsletter_email (email)
) ENGINE=InnoDB;

-- ============================================================
-- Wishlist Items
-- ============================================================
CREATE TABLE IF NOT EXISTS wishlist_items (
  id          INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  user_id     INT UNSIGNED NOT NULL,
  product_id  INT UNSIGNED NOT NULL,
  created_at  TIMESTAMP    DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id)    REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
  UNIQUE KEY uq_wishlist_user_product (user_id, product_id)
) ENGINE=InnoDB;
