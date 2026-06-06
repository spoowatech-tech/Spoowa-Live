-- ============================================================
-- SPOOWA RBAC Migration
-- Run this AFTER the base schema has been applied.
-- Safe for re-runs (uses procedures for ALTER TABLE).
-- ============================================================

USE spoowa_db;

-- ============================================================
-- Helper: Safely add a column (skip if exists)
-- ============================================================
DROP PROCEDURE IF EXISTS safe_add_column;
DELIMITER //
CREATE PROCEDURE safe_add_column(
  IN tbl VARCHAR(64),
  IN col VARCHAR(64),
  IN col_def VARCHAR(500)
)
BEGIN
  SET @col_exists = 0;
  SELECT COUNT(*) INTO @col_exists
    FROM information_schema.COLUMNS
    WHERE TABLE_SCHEMA = 'spoowa_db'
      AND TABLE_NAME = tbl
      AND COLUMN_NAME = col;
  IF @col_exists = 0 THEN
    SET @sql = CONCAT('ALTER TABLE `', tbl, '` ADD COLUMN `', col, '` ', col_def);
    PREPARE stmt FROM @sql;
    EXECUTE stmt;
    DEALLOCATE PREPARE stmt;
  END IF;
END //
DELIMITER ;

-- ============================================================
-- 1. Extend Users Table
-- ============================================================
CALL safe_add_column('users', 'role', "ENUM('SUPER_ADMIN','CITY_DISTRIBUTOR','GYM_OR_AREA_DISTRIBUTOR','TRAINER_OR_RETAILER','CUSTOMER') NOT NULL DEFAULT 'CUSTOMER'");
CALL safe_add_column('users', 'status', "ENUM('active','inactive','suspended','pending') NOT NULL DEFAULT 'active'");
CALL safe_add_column('users', 'mobile', "VARCHAR(20) DEFAULT NULL");
CALL safe_add_column('users', 'profile_image', "VARCHAR(500) DEFAULT NULL");

-- Backfill existing users
UPDATE users SET role = 'CUSTOMER' WHERE role = 'CUSTOMER' OR role IS NULL;

-- ============================================================
-- 2. City Distributors
-- ============================================================
CREATE TABLE IF NOT EXISTS city_distributors (
  id                INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  user_id           INT UNSIGNED NOT NULL UNIQUE,
  city_name         VARCHAR(150) NOT NULL,
  address           TEXT,
  bank_account      VARCHAR(50)  DEFAULT NULL,
  ifsc_code         VARCHAR(20)  DEFAULT NULL,
  pan_number        VARCHAR(20)  DEFAULT NULL,
  referral_code     VARCHAR(30)  NOT NULL UNIQUE,
  sales_total       DECIMAL(12,2) DEFAULT 0.00,
  created_at        TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at        TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_cd_city (city_name),
  INDEX idx_cd_referral (referral_code)
) ENGINE=InnoDB;

-- ============================================================
-- 3. Gym / Area Distributors
-- ============================================================
CREATE TABLE IF NOT EXISTS gym_distributors (
  id                      INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  user_id                 INT UNSIGNED NOT NULL UNIQUE,
  city_distributor_id     INT UNSIGNED DEFAULT NULL,
  facility_name           VARCHAR(200) NOT NULL,
  contact_person          VARCHAR(150) DEFAULT NULL,
  address                 TEXT,
  bank_details            TEXT,
  is_certified            BOOLEAN DEFAULT FALSE,
  certification_document  VARCHAR(500) DEFAULT NULL,
  referral_code           VARCHAR(30) NOT NULL UNIQUE,
  sales_total             DECIMAL(12,2) DEFAULT 0.00,
  created_at              TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at              TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (city_distributor_id) REFERENCES city_distributors(id) ON DELETE SET NULL,
  INDEX idx_gd_city_dist (city_distributor_id),
  INDEX idx_gd_referral (referral_code)
) ENGINE=InnoDB;

-- ============================================================
-- 4. Trainers
-- ============================================================
CREATE TABLE IF NOT EXISTS trainers (
  id                      INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  user_id                 INT UNSIGNED NOT NULL UNIQUE,
  gym_distributor_id      INT UNSIGNED DEFAULT NULL,
  trainer_type            ENUM('gym_trainer','sports_academy_trainer','society_trainer','independent_trainer')
                          NOT NULL DEFAULT 'gym_trainer',
  certification_name      VARCHAR(200) DEFAULT NULL,
  certificate_number      VARCHAR(100) DEFAULT NULL,
  certificate_document    VARCHAR(500) DEFAULT NULL,
  is_verified             BOOLEAN DEFAULT FALSE,
  bank_details            TEXT,
  referral_code           VARCHAR(30) NOT NULL UNIQUE,
  sales_total             DECIMAL(12,2) DEFAULT 0.00,
  created_at              TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at              TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (gym_distributor_id) REFERENCES gym_distributors(id) ON DELETE SET NULL,
  INDEX idx_tr_gym_dist (gym_distributor_id),
  INDEX idx_tr_referral (referral_code),
  INDEX idx_tr_type (trainer_type)
) ENGINE=InnoDB;

-- ============================================================
-- 5. Customers (extended profile)
-- ============================================================
CREATE TABLE IF NOT EXISTS customers (
  id              INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  user_id         INT UNSIGNED NOT NULL UNIQUE,
  trainer_id      INT UNSIGNED DEFAULT NULL,
  address         TEXT,
  sales_total     DECIMAL(12,2) DEFAULT 0.00,
  total_orders    INT UNSIGNED DEFAULT 0,
  created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (trainer_id) REFERENCES trainers(id) ON DELETE SET NULL,
  INDEX idx_cust_trainer (trainer_id)
) ENGINE=InnoDB;

-- ============================================================
-- 6. Referral Mappings
-- ============================================================
CREATE TABLE IF NOT EXISTS referral_mappings (
  id                INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  user_id           INT UNSIGNED NOT NULL,
  referrer_id       INT UNSIGNED NOT NULL,
  referrer_role     ENUM('CITY_DISTRIBUTOR','GYM_OR_AREA_DISTRIBUTOR','TRAINER_OR_RETAILER') NOT NULL,
  referral_code_used VARCHAR(30) NOT NULL,
  created_at        TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id)    REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (referrer_id) REFERENCES users(id) ON DELETE CASCADE,
  UNIQUE KEY uq_referral_user (user_id),
  INDEX idx_ref_referrer (referrer_id)
) ENGINE=InnoDB;

-- ============================================================
-- 7. Applications (Trainer & Gym)
-- ============================================================
CREATE TABLE IF NOT EXISTS applications (
  id                  INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  application_type    ENUM('trainer','gym') NOT NULL,
  status              ENUM('PENDING','APPROVED','REJECTED') NOT NULL DEFAULT 'PENDING',

  -- Common fields
  name                VARCHAR(150) NOT NULL,
  email               VARCHAR(255) NOT NULL,
  mobile              VARCHAR(20)  NOT NULL,
  address             TEXT,
  bank_details        TEXT,

  -- Trainer-specific
  certification_name  VARCHAR(200) DEFAULT NULL,
  certificate_number  VARCHAR(100) DEFAULT NULL,
  certificate_document VARCHAR(500) DEFAULT NULL,

  -- Gym-specific
  facility_name       VARCHAR(200) DEFAULT NULL,
  contact_person      VARCHAR(150) DEFAULT NULL,
  is_certified        BOOLEAN DEFAULT FALSE,

  -- Referral code used during application
  referral_code       VARCHAR(30) DEFAULT NULL,

  -- Review
  reviewed_by         INT UNSIGNED DEFAULT NULL,
  reviewed_at         TIMESTAMP NULL DEFAULT NULL,
  review_notes        TEXT,

  -- Result
  created_user_id     INT UNSIGNED DEFAULT NULL,

  created_at          TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at          TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

  FOREIGN KEY (reviewed_by) REFERENCES users(id) ON DELETE SET NULL,
  FOREIGN KEY (created_user_id) REFERENCES users(id) ON DELETE SET NULL,
  INDEX idx_app_status (status),
  INDEX idx_app_type (application_type),
  INDEX idx_app_email (email)
) ENGINE=InnoDB;

-- ============================================================
-- 8. Commissions
-- ============================================================
CREATE TABLE IF NOT EXISTS commissions (
  id              INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  order_id        INT UNSIGNED NOT NULL,
  user_id         INT UNSIGNED NOT NULL,
  role            ENUM('CITY_DISTRIBUTOR','GYM_OR_AREA_DISTRIBUTOR','TRAINER_OR_RETAILER') NOT NULL,
  amount          DECIMAL(10,2) NOT NULL DEFAULT 0.00,
  percentage      DECIMAL(5,2)  NOT NULL DEFAULT 0.00,
  status          ENUM('pending','paid','cancelled') NOT NULL DEFAULT 'pending',
  paid_at         TIMESTAMP NULL DEFAULT NULL,
  created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
  FOREIGN KEY (user_id)  REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_comm_order (order_id),
  INDEX idx_comm_user (user_id),
  INDEX idx_comm_status (status)
) ENGINE=InnoDB;

-- ============================================================
-- 9. Extend Orders Table for hierarchy tracking
-- ============================================================
CALL safe_add_column('orders', 'customer_id', 'INT UNSIGNED DEFAULT NULL');
CALL safe_add_column('orders', 'trainer_id', 'INT UNSIGNED DEFAULT NULL');
CALL safe_add_column('orders', 'gym_distributor_id', 'INT UNSIGNED DEFAULT NULL');
CALL safe_add_column('orders', 'city_distributor_id', 'INT UNSIGNED DEFAULT NULL');
CALL safe_add_column('orders', 'grand_total', 'DECIMAL(10,2) DEFAULT 0.00');
CALL safe_add_column('orders', 'payment_status', "VARCHAR(30) DEFAULT 'pending'");
CALL safe_add_column('orders', 'order_status', "VARCHAR(30) DEFAULT 'pending'");

-- ============================================================
-- 10. Network Hierarchy (Referral Chain Tracking)
-- ============================================================
CREATE TABLE IF NOT EXISTS network_hierarchy (
  id                  INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  city_distributor_id INT UNSIGNED DEFAULT NULL,
  area_distributor_id INT UNSIGNED DEFAULT NULL,
  gym_id              INT UNSIGNED DEFAULT NULL,
  trainer_id          INT UNSIGNED DEFAULT NULL,
  customer_id         INT UNSIGNED NOT NULL,
  created_at          TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (city_distributor_id) REFERENCES city_distributors(id) ON DELETE SET NULL,
  FOREIGN KEY (area_distributor_id) REFERENCES gym_distributors(id) ON DELETE SET NULL,
  FOREIGN KEY (trainer_id)          REFERENCES trainers(id) ON DELETE SET NULL,
  FOREIGN KEY (customer_id)         REFERENCES customers(id) ON DELETE CASCADE,
  UNIQUE KEY uq_hierarchy_customer (customer_id),
  INDEX idx_nh_city (city_distributor_id),
  INDEX idx_nh_area (area_distributor_id),
  INDEX idx_nh_trainer (trainer_id)
) ENGINE=InnoDB;

-- ============================================================
-- 11. Commission Rules (Dynamic Commission Percentages)
-- ============================================================
CREATE TABLE IF NOT EXISTS commission_rules (
  id                  INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  role                ENUM('CITY_DISTRIBUTOR','GYM_OR_AREA_DISTRIBUTOR','TRAINER_OR_RETAILER') NOT NULL,
  commission_percent  DECIMAL(5,2) NOT NULL,
  product_category    VARCHAR(100) NOT NULL DEFAULT '*',
  active              BOOLEAN DEFAULT TRUE,
  created_at          TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY uq_rule_role_category (role, product_category),
  INDEX idx_cr_role (role),
  INDEX idx_cr_active (active)
) ENGINE=InnoDB;

-- Seed default commission rules (matching previous hardcoded values)
INSERT IGNORE INTO commission_rules (role, commission_percent, product_category, active) VALUES
  ('TRAINER_OR_RETAILER', 10.00, '*', TRUE),
  ('GYM_OR_AREA_DISTRIBUTOR', 5.00, '*', TRUE),
  ('CITY_DISTRIBUTOR', 3.00, '*', TRUE);

-- Cleanup helper
DROP PROCEDURE IF EXISTS safe_add_column;
