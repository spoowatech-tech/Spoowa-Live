/**
 * SPOOWA Product Seeder
 * Creates all SPOOWA products via the Medusa Admin API.
 * 
 * Usage: node seed-products.mjs
 */

const BACKEND_URL = "http://localhost:9000";

// ── Admin Auth ──────────────────────────────────────────────
async function getAdminToken() {
  const res = await fetch(`${BACKEND_URL}/auth/user/emailpass`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email: "admin@medusa-test.com", password: "supersecret" }),
  });
  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Admin login failed: ${err}`);
  }
  const data = await res.json();
  return data.token;
}

async function adminRequest(token, url, options = {}) {
  const headers = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
    ...options.headers,
  };
  const res = await fetch(`${BACKEND_URL}${url}`, { ...options, headers });
  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Admin API error (${res.status}): ${err}`);
  }
  if (res.status === 204) return {};
  return res.json();
}

// ── Get existing region & sales channel ─────────────────────
async function getRegionId(token) {
  const data = await adminRequest(token, "/admin/regions");
  const region = data.regions?.[0];
  if (!region) throw new Error("No region found. Create one in admin first.");
  return region.id;
}

async function getSalesChannelId(token) {
  const data = await adminRequest(token, "/admin/sales-channels");
  const sc = data.sales_channels?.[0];
  if (!sc) throw new Error("No sales channel found.");
  return sc.id;
}

async function getStockLocationId(token) {
  const data = await adminRequest(token, "/admin/stock-locations");
  return data.stock_locations?.[0]?.id || null;
}

async function getPublishableApiKey(token) {
  const data = await adminRequest(token, "/admin/api-keys?type=publishable");
  return data.api_keys?.[0]?.id || null;
}

// ── Product Creation ────────────────────────────────────────
async function createProduct(token, productData) {
  console.log(`  Creating product: ${productData.title}...`);
  const data = await adminRequest(token, "/admin/products", {
    method: "POST",
    body: JSON.stringify(productData),
  });
  return data.product;
}

async function createPriceForVariant(token, product, priceData, regionId) {
  const variant = product.variants?.[0];
  if (!variant) {
    console.log(`    ⚠ No variant found for ${product.title}`);
    return;
  }

  // Create a price list or set prices on the variant
  // In Medusa v2, prices are set during product creation or via pricing module
  console.log(`    ✓ Variant ${variant.id} created`);
}

// ── Inventory ───────────────────────────────────────────────
async function setInventory(token, product, stockLocationId) {
  if (!stockLocationId) return;
  
  const variant = product.variants?.[0];
  if (!variant) return;

  try {
    // Get inventory items for the variant
    const invData = await adminRequest(token, `/admin/inventory-items?sku=${variant.sku || ""}`);
    // Inventory is auto-created with variants in Medusa v2
    console.log(`    ✓ Inventory ready`);
  } catch (e) {
    // Inventory setup is optional
  }
}

// ── Main Seed ───────────────────────────────────────────────
async function seed() {
  console.log("\n🌱 SPOOWA Product Seeder\n");
  console.log("━".repeat(50));

  // Step 1: Admin login
  console.log("\n1. Authenticating as admin...");
  let token;
  try {
    token = await getAdminToken();
    console.log("   ✓ Admin authenticated\n");
  } catch (e) {
    console.error("   ✗ " + e.message);
    console.log("\n   Try creating an admin user first:");
    console.log("   npx medusa user -e admin@medusa-test.com -p supersecret\n");
    process.exit(1);
  }

  // Step 2: Get region & sales channel
  console.log("2. Fetching region & sales channel...");
  const regionId = await getRegionId(token);
  const salesChannelId = await getSalesChannelId(token);
  const stockLocationId = await getStockLocationId(token);
  console.log(`   ✓ Region: ${regionId}`);
  console.log(`   ✓ Sales Channel: ${salesChannelId}`);
  console.log(`   ✓ Stock Location: ${stockLocationId || "none"}\n`);

  // Step 3: Define all SPOOWA products
  console.log("3. Creating SPOOWA products...\n");

  // Frontend images are served at localhost:5173/images/...
  const IMG = "http://localhost:5173/images";

  const products = [
    {
      title: "SPOOWA Hydration Mix – Lime & Mint",
      subtitle: "Electrolyte Recovery Formula",
      description: "Premium clean-label electrolyte hydration mix with real lime and fresh mint. Designed for fast absorption and rapid recovery. Contains essential electrolytes including sodium, potassium, magnesium, and calcium. No artificial colors, no artificial sweeteners. Lab tested and athlete approved. Perfect for runners, cyclists, gym-goers, and anyone who sweats.",
      handle: "spoowa-hydration-mix-lime-mint",
      material: "Electrolyte Powder Blend",
      weight: 250,
      origin_country: "IN",
      status: "published",
      thumbnail: `${IMG}/small_hydration.png`,
      images: [
        { url: `${IMG}/small_hydration.png` },
        { url: `${IMG}/banner_hydration.png` },
        { url: `${IMG}/collection_hydration.png` },
      ],
      options: [{ title: "Size", values: ["250g Pouch"] }],
      variants: [{
        title: "250g Pouch",
        sku: "SPOOWA-HYD-LIME-250",
        manage_inventory: false,
        prices: [{ amount: 49900, currency_code: "inr" }],
        options: { Size: "250g Pouch" },
      }],
      sales_channels: [{ id: salesChannelId }],
    },
    {
      title: "SPOOWA Energy Drink – Tropical Blast",
      subtitle: "Natural Caffeine Energy",
      description: "Clean energy drink powered by natural caffeine and honey. Zero crash formula with tropical mango, pineapple, and citrus flavors. Delivers sustained energy for intense workouts and long training sessions. Honey-powered with functional B-vitamins. No artificial sweeteners, no jitters, no crash. The premium energy drink for serious athletes.",
      handle: "spoowa-energy-drink-tropical",
      material: "Ready-to-Drink Beverage",
      weight: 330,
      origin_country: "IN",
      status: "published",
      thumbnail: `${IMG}/small_energy.png`,
      images: [
        { url: `${IMG}/small_energy.png` },
        { url: `${IMG}/banner_energy.png` },
        { url: `${IMG}/collection_energy.png` },
      ],
      options: [{ title: "Size", values: ["330ml Can", "Pack of 6"] }],
      variants: [
        {
          title: "330ml Can",
          sku: "SPOOWA-ENR-TROP-330",
          manage_inventory: false,
          prices: [{ amount: 14900, currency_code: "inr" }],
          options: { Size: "330ml Can" },
        },
        {
          title: "Pack of 6",
          sku: "SPOOWA-ENR-TROP-6PK",
          manage_inventory: false,
          prices: [{ amount: 79900, currency_code: "inr" }],
          options: { Size: "Pack of 6" },
        },
      ],
      sales_channels: [{ id: salesChannelId }],
    },
    {
      title: "SPOOWA Honey – Kesar Saffron",
      subtitle: "Premium Functional Honey",
      description: "Luxury saffron-infused raw honey sourced from pristine Himalayan apiaries. Rich in antioxidants and natural enzymes. Each jar contains premium Kashmiri saffron strands for enhanced immunity and wellness. Perfect as a daily wellness ritual, pre-workout energy boost, or natural sweetener. No additives, no preservatives, 100% pure.",
      handle: "spoowa-honey-kesar-saffron",
      material: "Raw Honey with Saffron",
      weight: 350,
      origin_country: "IN",
      status: "published",
      thumbnail: `${IMG}/small_honey.png`,
      images: [
        { url: `${IMG}/small_honey.png` },
        { url: `${IMG}/banner_honey.png` },
        { url: `${IMG}/collection_honey.png` },
      ],
      options: [{ title: "Size", values: ["350g Jar", "500g Jar"] }],
      variants: [
        {
          title: "350g Jar",
          sku: "SPOOWA-HON-KES-350",
          manage_inventory: false,
          prices: [{ amount: 59900, currency_code: "inr" }],
          options: { Size: "350g Jar" },
        },
        {
          title: "500g Jar",
          sku: "SPOOWA-HON-KES-500",
          manage_inventory: false,
          prices: [{ amount: 84900, currency_code: "inr" }],
          options: { Size: "500g Jar" },
        },
      ],
      sales_channels: [{ id: salesChannelId }],
    },
    {
      title: "SPOOWA Honey – Matcha Green Tea",
      subtitle: "Wellness Infused Honey",
      description: "Premium matcha-infused honey blend combining the antioxidant power of Japanese ceremonial-grade matcha with pure Himalayan honey. A functional wellness superfood that supports metabolism, focus, and natural energy. Smooth, earthy flavor with a sweet finish. Perfect for morning rituals, smoothies, or as a health tonic.",
      handle: "spoowa-honey-matcha",
      material: "Raw Honey with Matcha",
      weight: 350,
      origin_country: "IN",
      status: "published",
      thumbnail: `${IMG}/mixed_matcha.png`,
      images: [
        { url: `${IMG}/mixed_matcha.png` },
        { url: `${IMG}/athlete_honey.png` },
      ],
      options: [{ title: "Size", values: ["350g Jar"] }],
      variants: [{
        title: "350g Jar",
        sku: "SPOOWA-HON-MAT-350",
        manage_inventory: false,
        prices: [{ amount: 64900, currency_code: "inr" }],
        options: { Size: "350g Jar" },
      }],
      sales_channels: [{ id: salesChannelId }],
    },
    {
      title: "SPOOWA Honey – Cinnamon Spice",
      subtitle: "Warm Natural Energy",
      description: "Natural cinnamon-infused honey crafted for daily wellness. Ceylon cinnamon combined with pure raw honey creates a warming functional food that supports blood sugar balance, immunity, and digestive health. Drizzle on toast, stir into warm water, or enjoy straight from the spoon. No artificial anything.",
      handle: "spoowa-honey-cinnamon",
      material: "Raw Honey with Cinnamon",
      weight: 350,
      origin_country: "IN",
      status: "published",
      thumbnail: `${IMG}/mixed_cinnamon.png`,
      images: [
        { url: `${IMG}/mixed_cinnamon.png` },
      ],
      options: [{ title: "Size", values: ["350g Jar"] }],
      variants: [{
        title: "350g Jar",
        sku: "SPOOWA-HON-CIN-350",
        manage_inventory: false,
        prices: [{ amount: 54900, currency_code: "inr" }],
        options: { Size: "350g Jar" },
      }],
      sales_channels: [{ id: salesChannelId }],
    },
    {
      title: "SPOOWA Discovery Box",
      subtitle: "Premium Subscription Box",
      description: "The ultimate SPOOWA experience in one premium box. Contains curated samples of our Hydration Mix, Energy Drink, and Honey Collection. Perfect for first-time buyers who want to explore the full SPOOWA product ecosystem. Makes an excellent gift for fitness enthusiasts and wellness lovers. Beautifully packaged in a luxury unboxing experience.",
      handle: "spoowa-discovery-box",
      material: "Mixed Product Bundle",
      weight: 1200,
      origin_country: "IN",
      status: "published",
      thumbnail: `${IMG}/mixed_discovery.png`,
      images: [
        { url: `${IMG}/mixed_discovery.png` },
        { url: `${IMG}/mixed_showcase.png` },
      ],
      options: [{ title: "Size", values: ["Standard Box"] }],
      variants: [{
        title: "Standard Box",
        sku: "SPOOWA-DISC-STD",
        manage_inventory: false,
        prices: [{ amount: 149900, currency_code: "inr" }],
        options: { Size: "Standard Box" },
      }],
      sales_channels: [{ id: salesChannelId }],
    },
    {
      title: "SPOOWA Electrolyte Mix – Berry",
      subtitle: "Fast Absorption Hydration",
      description: "Rapid-absorbing electrolyte formula with mixed berry flavor. Scientifically formulated with optimal sodium-to-potassium ratio for maximum hydration efficiency. Contains added zinc and vitamin C for immune support. Designed for endurance athletes, marathon runners, and intense training sessions. Clean label, no artificial dyes.",
      handle: "spoowa-electrolyte-berry",
      material: "Electrolyte Powder Blend",
      weight: 200,
      origin_country: "IN",
      status: "published",
      thumbnail: `${IMG}/athlete_hydration.png`,
      images: [
        { url: `${IMG}/athlete_hydration.png` },
        { url: `${IMG}/collection_hydration.png` },
      ],
      options: [{ title: "Size", values: ["200g Pouch", "30 Sachets"] }],
      variants: [
        {
          title: "200g Pouch",
          sku: "SPOOWA-ELT-BER-200",
          manage_inventory: false,
          prices: [{ amount: 39900, currency_code: "inr" }],
          options: { Size: "200g Pouch" },
        },
        {
          title: "30 Sachets",
          sku: "SPOOWA-ELT-BER-30S",
          manage_inventory: false,
          prices: [{ amount: 69900, currency_code: "inr" }],
          options: { Size: "30 Sachets" },
        },
      ],
      sales_channels: [{ id: salesChannelId }],
    },
    {
      title: "SPOOWA Recovery Blend",
      subtitle: "Post Workout Recovery",
      description: "Advanced post-workout recovery formula with electrolytes, BCAAs, and essential minerals. Designed to reduce muscle soreness, replenish glycogen stores, and accelerate recovery between training sessions. Clean ingredients with a refreshing citrus flavor. Used by professional athletes and sports academies across India.",
      handle: "spoowa-recovery-blend",
      material: "Recovery Supplement Blend",
      weight: 300,
      origin_country: "IN",
      status: "published",
      thumbnail: `${IMG}/athlete_recovery.png`,
      images: [
        { url: `${IMG}/athlete_recovery.png` },
        { url: `${IMG}/collection_performance.png` },
      ],
      options: [{ title: "Size", values: ["300g Pouch"] }],
      variants: [{
        title: "300g Pouch",
        sku: "SPOOWA-REC-CIT-300",
        manage_inventory: false,
        prices: [{ amount: 74900, currency_code: "inr" }],
        options: { Size: "300g Pouch" },
      }],
      sales_channels: [{ id: salesChannelId }],
    },
  ];

  // Create each product
  let created = 0;
  for (const productData of products) {
    try {
      const product = await createProduct(token, productData);
      console.log(`    ✓ Created: ${product.title} (${product.id})`);
      created++;
    } catch (e) {
      console.error(`    ✗ Failed: ${productData.title} — ${e.message}`);
    }
  }

  console.log(`\n${"━".repeat(50)}`);
  console.log(`\n✅ Done! Created ${created}/${products.length} products.`);
  console.log(`\n📦 Products are now visible in:`);
  console.log(`   • Medusa Admin Panel: http://localhost:9000/app/products`);
  console.log(`   • Store API: http://localhost:5173/products`);
  console.log(`   • Shop Page: http://localhost:5173/shop\n`);
}

seed().catch((e) => {
  console.error("\n❌ Seed failed:", e.message);
  process.exit(1);
});
