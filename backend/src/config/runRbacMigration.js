/**
 * Standalone RBAC Migration Script
 * Run this to apply RBAC tables to an existing database.
 * Safe for re-runs — checks before adding columns, uses CREATE TABLE IF NOT EXISTS.
 * 
 * Usage: node src/config/runRbacMigration.js
 */
import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

async function runMigration() {
  const config = {
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    port: parseInt(process.env.DB_PORT || '3306', 10),
    database: process.env.DB_NAME || 'spoowa_db',
    multipleStatements: true,
  };

  let conn;
  try {
    console.log('🔌 Connecting to MySQL...');
    conn = await mysql.createConnection(config);
    console.log('✅ Connected\n');

    // Helper: add column if it doesn't exist
    async function addColumnIfNotExists(table, column, definition) {
      const [rows] = await conn.execute(
        `SELECT COUNT(*) as cnt FROM information_schema.COLUMNS 
         WHERE TABLE_SCHEMA = ? AND TABLE_NAME = ? AND COLUMN_NAME = ?`,
        [config.database, table, column]
      );
      if (rows[0].cnt === 0) {
        await conn.execute(`ALTER TABLE \`${table}\` ADD COLUMN \`${column}\` ${definition}`);
        console.log(`   ✅ Added ${table}.${column}`);
      } else {
        console.log(`   ⏭️  ${table}.${column} already exists`);
      }
    }

    // ============================================================
    // 1. Extend Users Table
    // ============================================================
    console.log('📋 Step 1: Extending users table...');
    await addColumnIfNotExists('users', 'role', "ENUM('SUPER_ADMIN','CITY_DISTRIBUTOR','GYM_OR_AREA_DISTRIBUTOR','TRAINER_OR_RETAILER','CUSTOMER') NOT NULL DEFAULT 'CUSTOMER'");
    await addColumnIfNotExists('users', 'status', "ENUM('active','inactive','suspended','pending') NOT NULL DEFAULT 'active'");
    await addColumnIfNotExists('users', 'mobile', "VARCHAR(20) DEFAULT NULL");
    await addColumnIfNotExists('users', 'profile_image', "VARCHAR(500) DEFAULT NULL");

    // Backfill
    await conn.execute("UPDATE users SET role = 'CUSTOMER' WHERE role = 'CUSTOMER' OR role IS NULL");
    console.log('');

    // ============================================================
    // 2-7. Create new tables
    // ============================================================
    console.log('📋 Step 2: Creating RBAC tables...');

    await conn.execute(`
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
      ) ENGINE=InnoDB
    `);
    console.log('   ✅ city_distributors');

    await conn.execute(`
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
      ) ENGINE=InnoDB
    `);
    console.log('   ✅ gym_distributors');

    await conn.execute(`
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
      ) ENGINE=InnoDB
    `);
    console.log('   ✅ trainers');

    await conn.execute(`
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
      ) ENGINE=InnoDB
    `);
    console.log('   ✅ customers');

    await conn.execute(`
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
      ) ENGINE=InnoDB
    `);
    console.log('   ✅ referral_mappings');

    await conn.execute(`
      CREATE TABLE IF NOT EXISTS applications (
        id                  INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
        application_type    ENUM('trainer','gym') NOT NULL,
        status              ENUM('PENDING','APPROVED','REJECTED') NOT NULL DEFAULT 'PENDING',
        name                VARCHAR(150) NOT NULL,
        email               VARCHAR(255) NOT NULL,
        mobile              VARCHAR(20)  NOT NULL,
        address             TEXT,
        bank_details        TEXT,
        certification_name  VARCHAR(200) DEFAULT NULL,
        certificate_number  VARCHAR(100) DEFAULT NULL,
        certificate_document VARCHAR(500) DEFAULT NULL,
        facility_name       VARCHAR(200) DEFAULT NULL,
        contact_person      VARCHAR(150) DEFAULT NULL,
        is_certified        BOOLEAN DEFAULT FALSE,
        referral_code       VARCHAR(30) DEFAULT NULL,
        reviewed_by         INT UNSIGNED DEFAULT NULL,
        reviewed_at         TIMESTAMP NULL DEFAULT NULL,
        review_notes        TEXT,
        created_user_id     INT UNSIGNED DEFAULT NULL,
        created_at          TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at          TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (reviewed_by) REFERENCES users(id) ON DELETE SET NULL,
        FOREIGN KEY (created_user_id) REFERENCES users(id) ON DELETE SET NULL,
        INDEX idx_app_status (status),
        INDEX idx_app_type (application_type),
        INDEX idx_app_email (email)
      ) ENGINE=InnoDB
    `);
    console.log('   ✅ applications');

    await conn.execute(`
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
      ) ENGINE=InnoDB
    `);
    console.log('   ✅ commissions');
    console.log('');

    // ============================================================
    // 8. Extend Orders Table
    // ============================================================
    console.log('📋 Step 3: Extending orders table...');
    await addColumnIfNotExists('orders', 'customer_id', 'INT UNSIGNED DEFAULT NULL');
    await addColumnIfNotExists('orders', 'trainer_id', 'INT UNSIGNED DEFAULT NULL');
    await addColumnIfNotExists('orders', 'gym_distributor_id', 'INT UNSIGNED DEFAULT NULL');
    await addColumnIfNotExists('orders', 'city_distributor_id', 'INT UNSIGNED DEFAULT NULL');
    await addColumnIfNotExists('orders', 'grand_total', 'DECIMAL(10,2) DEFAULT 0.00');
    await addColumnIfNotExists('orders', 'payment_status', "VARCHAR(30) DEFAULT 'pending'");
    await addColumnIfNotExists('orders', 'order_status', "VARCHAR(30) DEFAULT 'pending'");
    console.log('');

    // ============================================================
    // 9. Network Hierarchy (Referral Chain Tracking)
    // ============================================================
    console.log('📋 Step 4: Creating network_hierarchy table...');
    await conn.execute(`
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
      ) ENGINE=InnoDB
    `);
    console.log('   ✅ network_hierarchy');
    console.log('');

    // ============================================================
    // 10. Commission Rules (Dynamic Commission Percentages)
    // ============================================================
    console.log('📋 Step 5: Creating commission_rules table...');
    await conn.execute(`
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
      ) ENGINE=InnoDB
    `);
    console.log('   ✅ commission_rules');

    // Seed default rules
    await conn.execute(`
      INSERT IGNORE INTO commission_rules (role, commission_percent, product_category, active) VALUES
        ('TRAINER_OR_RETAILER', 10.00, '*', TRUE),
        ('GYM_OR_AREA_DISTRIBUTOR', 5.00, '*', TRUE),
        ('CITY_DISTRIBUTOR', 3.00, '*', TRUE)
    `);
    console.log('   ✅ Default commission rules seeded');
    console.log('');

    // ============================================================
    // Verify
    // ============================================================
    const [tables] = await conn.execute(
      `SELECT TABLE_NAME FROM information_schema.tables WHERE table_schema = ? ORDER BY TABLE_NAME`,
      [config.database]
    );
    console.log('📊 Tables in spoowa_db:');
    tables.forEach(t => console.log(`   • ${t.TABLE_NAME}`));
    console.log(`\n   Total: ${tables.length} tables`);
    console.log('\n🎉 RBAC Migration complete!');

  } catch (error) {
    console.error('\n❌ Migration failed:', error.message);
    process.exit(1);
  } finally {
    if (conn) await conn.end();
  }
}

runMigration();
