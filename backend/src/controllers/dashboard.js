import { getPool } from '../config/db.js';
import { countAllUsers, countUsersByRole } from '../models/User.js';
import { countCityDistributors } from '../models/CityDistributor.js';
import { countGymDistributors } from '../models/GymDistributor.js';
import { countTrainers } from '../models/Trainer.js';
import { countCustomers } from '../models/Customer.js';
import { findCityDistributorByUserId, getCityDistributorDashboardStats, getCityDistributorNetwork } from '../models/CityDistributor.js';
import { findGymDistributorByUserId, getGymDistributorDashboardStats } from '../models/GymDistributor.js';
import { findTrainerByUserId, getTrainerDashboardStats, findTrainersByGymDistributor } from '../models/Trainer.js';
import { getCustomerAccountData } from '../models/Customer.js';
import { countApplicationsByStatus } from '../models/Application.js';

/**
 * GET /api/dashboard/super-admin
 * Full analytics dashboard for Super Admin.
 */
export async function getSuperAdminDashboard(req, res) {
  const pool = getPool();

  // Counts
  const totalCustomers = await countCustomers();
  const totalTrainers = await countTrainers();
  const totalGyms = await countGymDistributors();
  const totalCityDistributors = await countCityDistributors();
  const totalUsers = await countAllUsers();
  const pendingApplications = await countApplicationsByStatus('PENDING');

  // Revenue & orders
  const [revenueStats] = await pool.execute(
    `SELECT COUNT(*) as total_orders, 
            COALESCE(SUM(total), 0) as total_revenue,
            COALESCE(AVG(total), 0) as avg_order_value
     FROM orders`
  );

  // Repeat purchase rate
  const [repeatStats] = await pool.execute(
    `SELECT COUNT(*) as repeat_customers FROM (
       SELECT user_id FROM orders GROUP BY user_id HAVING COUNT(*) > 1
     ) as repeat_buyers`
  );
  const repeatRate = totalCustomers > 0 ? ((repeatStats[0].repeat_customers / totalCustomers) * 100).toFixed(1) : 0;

  // Customer Retention Rate (ordered in last 30 days vs total)
  const [retentionStats] = await pool.execute(
    `SELECT COUNT(DISTINCT user_id) as active_last_30 FROM orders WHERE created_at >= DATE_SUB(NOW(), INTERVAL 30 DAY)`
  );
  const retentionRate = totalCustomers > 0 ? ((retentionStats[0].active_last_30 / totalCustomers) * 100).toFixed(1) : 0;

  // Top selling products
  const [topProducts] = await pool.execute(
    `SELECT p.id, p.name, p.image, SUM(oi.quantity) as total_sold, SUM(oi.price * oi.quantity) as total_revenue
     FROM order_items oi
     JOIN products p ON oi.product_id = p.id
     GROUP BY p.id ORDER BY total_sold DESC LIMIT 5`
  );

  // Recent orders
  const [recentOrders] = await pool.execute(
    `SELECT o.id, o.total, o.status, o.created_at, u.name as customer_name, u.email
     FROM orders o JOIN users u ON o.user_id = u.id
     ORDER BY o.created_at DESC LIMIT 10`
  );

  // Recent registrations
  const [recentRegistrations] = await pool.execute(
    `SELECT id, name, email, role, created_at FROM users ORDER BY created_at DESC LIMIT 10`
  );

  // Product-wise sales
  const [productWiseSales] = await pool.execute(
    `SELECT p.name, SUM(oi.quantity) as quantity, SUM(oi.price * oi.quantity) as revenue
     FROM order_items oi JOIN products p ON oi.product_id = p.id
     GROUP BY p.id ORDER BY revenue DESC LIMIT 10`
  );

  // Trainer-wise sales
  const [trainerWiseSales] = await pool.execute(
    `SELECT u.name as trainer_name, t.referral_code, COUNT(o.id) as order_count, COALESCE(SUM(o.total), 0) as revenue
     FROM orders o 
     JOIN trainers t ON o.trainer_id = t.id
     JOIN users u ON t.user_id = u.id
     GROUP BY t.id ORDER BY revenue DESC LIMIT 10`
  );

  // Gym-wise sales
  const [gymWiseSales] = await pool.execute(
    `SELECT u.name as gym_name, gd.facility_name, COUNT(o.id) as order_count, COALESCE(SUM(o.total), 0) as revenue
     FROM orders o 
     JOIN gym_distributors gd ON o.gym_distributor_id = gd.id
     JOIN users u ON gd.user_id = u.id
     GROUP BY gd.id ORDER BY revenue DESC LIMIT 10`
  );

  // City distributor-wise sales
  const [cityWiseSales] = await pool.execute(
    `SELECT u.name as distributor_name, cd.city_name, COUNT(o.id) as order_count, COALESCE(SUM(o.total), 0) as revenue
     FROM orders o 
     JOIN city_distributors cd ON o.city_distributor_id = cd.id
     JOIN users u ON cd.user_id = u.id
     GROUP BY cd.id ORDER BY revenue DESC LIMIT 10`
  );

  // --- NEW ANALYTICS ---

  // Top Customers (by total spent)
  const [topCustomers] = await pool.execute(
    `SELECT u.id, u.name, u.email, COUNT(o.id) as order_count, COALESCE(SUM(o.total), 0) as total_spent,
            MAX(o.created_at) as last_order_date
     FROM orders o
     JOIN users u ON o.user_id = u.id
     GROUP BY u.id ORDER BY total_spent DESC LIMIT 10`
  );

  // Inactive Customers (no order in 90+ days)
  const [inactiveCustomers] = await pool.execute(
    `SELECT u.id, u.name, u.email, MAX(o.created_at) as last_order_date,
            DATEDIFF(NOW(), MAX(o.created_at)) as days_since_last_order
     FROM users u
     LEFT JOIN orders o ON u.id = o.user_id
     WHERE u.role = 'CUSTOMER'
     GROUP BY u.id
     HAVING last_order_date IS NULL OR DATEDIFF(NOW(), MAX(o.created_at)) >= 90
     ORDER BY days_since_last_order DESC
     LIMIT 20`
  );

  // Revenue by Category
  const [revenueByCategory] = await pool.execute(
    `SELECT p.category, SUM(oi.quantity) as units_sold, SUM(oi.price * oi.quantity) as revenue
     FROM order_items oi
     JOIN products p ON oi.product_id = p.id
     GROUP BY p.category ORDER BY revenue DESC`
  );

  // Revenue by City (from order addresses)
  const [revenueByCity] = await pool.execute(
    `SELECT a.city, COUNT(o.id) as order_count, COALESCE(SUM(o.total), 0) as revenue
     FROM orders o
     JOIN addresses a ON o.address_id = a.id
     WHERE a.city IS NOT NULL AND a.city != ''
     GROUP BY a.city ORDER BY revenue DESC LIMIT 15`
  );

  // Monthly Revenue Trends (last 12 months)
  const [monthlyRevenue] = await pool.execute(
    `SELECT DATE_FORMAT(created_at, '%Y-%m') as month, 
            COUNT(*) as orders, 
            COALESCE(SUM(total), 0) as revenue
     FROM orders 
     WHERE created_at >= DATE_SUB(NOW(), INTERVAL 12 MONTH)
     GROUP BY month ORDER BY month ASC`
  );

  // Subscription Growth (placeholder — return empty until subscriptions are implemented)
  const subscriptionGrowth = [];

  // Commission Rules summary
  const [commissionRules] = await pool.execute(
    `SELECT * FROM commission_rules WHERE active = TRUE ORDER BY role`
  );

  res.json({
    stats: {
      total_revenue: Number(revenueStats[0].total_revenue),
      total_orders: revenueStats[0].total_orders,
      total_customers: totalCustomers,
      total_trainers: totalTrainers,
      total_gyms: totalGyms,
      total_city_distributors: totalCityDistributors,
      total_users: totalUsers,
      avg_order_value: Number(revenueStats[0].avg_order_value),
      repeat_purchase_rate: Number(repeatRate),
      customer_retention_rate: Number(retentionRate),
      pending_applications: pendingApplications,
    },
    top_products: topProducts,
    recent_orders: recentOrders,
    recent_registrations: recentRegistrations,
    product_wise_sales: productWiseSales,
    trainer_wise_sales: trainerWiseSales,
    gym_wise_sales: gymWiseSales,
    city_wise_sales: cityWiseSales,
    // New analytics
    top_customers: topCustomers,
    inactive_customers: inactiveCustomers,
    revenue_by_category: revenueByCategory,
    revenue_by_city: revenueByCity,
    monthly_revenue: monthlyRevenue,
    subscription_growth: subscriptionGrowth,
    commission_rules: commissionRules,
  });
}

/**
 * GET /api/dashboard/city-distributor
 * Dashboard for a specific city distributor (sees only own network).
 */
export async function getCityDistributorDashboard(req, res) {
  const userId = req.user.id;
  
  const profile = await findCityDistributorByUserId(userId);
  if (!profile) {
    return res.status(404).json({ error: 'City distributor profile not found.' });
  }

  const stats = await getCityDistributorDashboardStats(profile.id, userId);
  const network = await getCityDistributorNetwork(profile.id);

  const pool = getPool();

  // Product-wise sales within this distributor's network
  const [productSales] = await pool.execute(
    `SELECT p.name, SUM(oi.quantity) as quantity, SUM(oi.price * oi.quantity) as revenue
     FROM order_items oi 
     JOIN orders o ON oi.order_id = o.id
     JOIN products p ON oi.product_id = p.id
     WHERE o.city_distributor_id = ?
     GROUP BY p.id ORDER BY revenue DESC LIMIT 10`,
    [profile.id]
  );

  // Recent orders
  const [recentOrders] = await pool.execute(
    `SELECT o.id, o.total, o.status, o.created_at, u.name as customer_name
     FROM orders o JOIN users u ON o.user_id = u.id
     WHERE o.city_distributor_id = ?
     ORDER BY o.created_at DESC LIMIT 10`,
    [profile.id]
  );

  res.json({
    profile,
    stats,
    network,
    product_sales: productSales,
    recent_orders: recentOrders,
  });
}

/**
 * GET /api/dashboard/gym-distributor
 * Dashboard for a specific gym distributor.
 */
export async function getGymDistributorDashboard(req, res) {
  const userId = req.user.id;
  
  const profile = await findGymDistributorByUserId(userId);
  if (!profile) {
    return res.status(404).json({ error: 'Gym distributor profile not found.' });
  }

  const stats = await getGymDistributorDashboardStats(profile.id, userId);
  const trainers = await findTrainersByGymDistributor(profile.id);

  const pool = getPool();

  // Trainer performance
  const [trainerPerformance] = await pool.execute(
    `SELECT u.name as trainer_name, t.referral_code, t.sales_total,
            COUNT(o.id) as order_count, COALESCE(SUM(o.total), 0) as revenue
     FROM trainers t
     JOIN users u ON t.user_id = u.id
     LEFT JOIN orders o ON o.trainer_id = t.id
     WHERE t.gym_distributor_id = ?
     GROUP BY t.id ORDER BY revenue DESC`,
    [profile.id]
  );

  // Product-wise sales
  const [productSales] = await pool.execute(
    `SELECT p.name, SUM(oi.quantity) as quantity, SUM(oi.price * oi.quantity) as revenue
     FROM order_items oi 
     JOIN orders o ON oi.order_id = o.id
     JOIN products p ON oi.product_id = p.id
     WHERE o.gym_distributor_id = ?
     GROUP BY p.id ORDER BY revenue DESC LIMIT 10`,
    [profile.id]
  );

  // Recent orders
  const [recentOrders] = await pool.execute(
    `SELECT o.id, o.total, o.status, o.created_at, u.name as customer_name
     FROM orders o JOIN users u ON o.user_id = u.id
     WHERE o.gym_distributor_id = ?
     ORDER BY o.created_at DESC LIMIT 10`,
    [profile.id]
  );

  res.json({
    profile,
    stats,
    trainers,
    trainer_performance: trainerPerformance,
    product_sales: productSales,
    recent_orders: recentOrders,
  });
}

/**
 * GET /api/dashboard/trainer
 * Dashboard for a specific trainer.
 */
export async function getTrainerDashboard(req, res) {
  const userId = req.user.id;
  
  const profile = await findTrainerByUserId(userId);
  if (!profile) {
    return res.status(404).json({ error: 'Trainer profile not found.' });
  }

  const stats = await getTrainerDashboardStats(profile.id, userId);

  const pool = getPool();

  // Recent orders
  const [recentOrders] = await pool.execute(
    `SELECT o.id, o.total, o.status, o.created_at, u.name as customer_name
     FROM orders o JOIN users u ON o.user_id = u.id
     WHERE o.trainer_id = ?
     ORDER BY o.created_at DESC LIMIT 10`,
    [profile.id]
  );

  // Purchase frequency (orders per month, last 6 months)
  const [purchaseFrequency] = await pool.execute(
    `SELECT DATE_FORMAT(created_at, '%Y-%m') as month, COUNT(*) as orders, COALESCE(SUM(total), 0) as revenue
     FROM orders WHERE trainer_id = ? AND created_at >= DATE_SUB(NOW(), INTERVAL 6 MONTH)
     GROUP BY month ORDER BY month DESC`,
    [profile.id]
  );

  res.json({
    profile,
    stats,
    recent_orders: recentOrders,
    purchase_frequency: purchaseFrequency,
  });
}

/**
 * GET /api/dashboard/customer
 * Account data — works for ALL roles (profile page).
 */
export async function getCustomerDashboard(req, res) {
  const userId = req.user.id;
  const pool = getPool();

  // Recent orders (all users have orders)
  const [orders] = await pool.execute(
    `SELECT id, subtotal, total, status, created_at 
     FROM orders WHERE user_id = ? 
     ORDER BY created_at DESC LIMIT 10`,
    [userId]
  );

  // Order totals
  const [orderTotals] = await pool.execute(
    `SELECT COUNT(*) as total_orders, COALESCE(SUM(total), 0) as total_spent FROM orders WHERE user_id = ?`,
    [userId]
  );

  // Saved addresses
  const [addresses] = await pool.execute(
    `SELECT * FROM addresses WHERE user_id = ? ORDER BY is_default DESC, created_at DESC`,
    [userId]
  );

  // Referral info
  const [referral] = await pool.execute(
    `SELECT rm.*, u.name as referrer_name 
     FROM referral_mappings rm 
     LEFT JOIN users u ON rm.referrer_id = u.id 
     WHERE rm.user_id = ?`,
    [userId]
  );

  res.json({
    orders,
    addresses,
    referral: referral[0] || null,
    total_orders: orderTotals[0].total_orders,
    total_spent: Number(orderTotals[0].total_spent),
  });
}

