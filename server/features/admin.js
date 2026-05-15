import { hybridRAG } from "../services/ragService.js";
import { askAI } from "../services/aiService.js";
import User from "../models/userModel.js";
import Order from "../models/orderModel.js";
import Product from "../models/productModel.js";

// Profit margins by condition
const PROFIT_MARGIN = {
  new: 0.2,
  used: 0.4,
};

// How many admins share profit
const ADMIN_COUNT = 5;

export async function runAdmin({ question, userId }) {
  let userContext = "";

  if (userId) {
    try {
      const user = await User.findById(userId);
      if (user?.role === "admin") {
        userContext = `\nالمسؤول: ${user?.firstName || "Admin"}`;
      }
    } catch (e) {
      console.log("Error fetching user data:", e.message);
    }
  }

  const { products, context } = await hybridRAG({});

  const systemPrompt = `You are an AI assistant for e-commerce admins.
You speak both English and Arabic fluently. Respond in the same language the user uses.

${userContext}

${context}

Analyze sales, inventory, pricing, and customer behavior, and give business insights.`;

  const answer = await askAI({ 
    systemPrompt, 
    userPrompt: question 
  });

  return { 
    answer, 
    productsUsed: products.length
  };
}

// ==================== ADMIN DASHBOARD AI =======================
export async function adminDashboardAI({ question, userId }) {
  // تحقق من صلاحيات الـ admin
  let userContext = "";
  if (userId) {
    try {
      const user = await User.findById(userId);
      if (user?.role !== "admin") {
        return { error: "Access denied. Admin only." };
      }
      userContext = `Admin: ${user?.firstName || "Admin"}`;
    } catch (e) {
      console.log("Error fetching user:", e.message);
      return { error: "User verification failed" };
    }
  }

  // جلب البيانات الشاملة للـ admin
  const { salesData, inventoryData, customerData, topProducts, lowStockProducts, context } = await getAdminData();

  // حساب الأرباح للفترات المختلفة + أفضل المنتجات ربحية
  const profitSummary = await computeProfitSummary();
  const chartPayload = buildChartsPayload(profitSummary);
  const productCards = buildProfitProductCards(profitSummary.topProducts || []);

  // نص سياق واضح للأرقام (لضمان التزام الـ AI بالأرقام الفعلية)
  const profitContext = formatProfitContext(profitSummary);

  const systemPrompt = `You are an AI Analytics Assistant for E-commerce Admins.
You speak English and Arabic fluently. Respond in the user's language.

${userContext}

You have access to:
- Sales & Revenue Data
- Inventory & Stock Levels
- Customer Analytics
- Product Performance
- Order Trends

Profit data (authoritative, do NOT fabricate):
${profitContext}

${context}

Provide actionable insights, recommendations, and data-driven answers.
Be concise and highlight key metrics with numbers.
Always suggest actions based on the data.
If the user asks for charts or product cards, refer to the provided structured data payload and acknowledge what is available.
Always respect the exact profit numbers supplied (do not guess).`;

  const answer = await askAI({ 
    systemPrompt, 
    userPrompt: question 
  });

  return { 
    answer, 
    dataUsed: {
      sales: salesData.length,
      products: inventoryData.length,
      customers: customerData.length,
      topProducts: topProducts.length,
      lowStockCount: lowStockProducts.length
    },
    structuredData: {
      profits: profitSummary,
      charts: chartPayload,
      productCards,
      perAdminShare: {
        today: profitSummary?.today?.perAdmin || 0,
        month: profitSummary?.month?.perAdmin || 0,
        year: profitSummary?.year?.perAdmin || 0,
      }
    }
  };
}

// ==================== GET ADMIN DATA =======================
async function getAdminData() {
  try {
    // جلب بيانات المبيعات (آخر 30 يوم)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const salesData = await Order.aggregate([
      { $match: { createdAt: { $gte: thirtyDaysAgo } } },
      { $group: { 
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } }, 
          total: { $sum: "$totalPrice" }, 
          count: { $sum: 1 } 
        } 
      },
      { $sort: { _id: -1 } }
    ]);

    // جلب بيانات المخزون
    const inventoryData = await Product.find(
      {},
      { name: 1, stock: 1, price: 1, soldCount: 1, category: 1 }
    ).limit(100);

    // جلب بيانات العملاء الجدد
    const customerData = await User.aggregate([
      { $match: { role: "customer", createdAt: { $gte: thirtyDaysAgo } } },
      { $group: { _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } }, newCustomers: { $sum: 1 } } },
      { $sort: { _id: -1 } }
    ]);

    // أكثر 5 منتجات بيعاً
    const topProducts = await Product.find(
      {},
      { name: 1, soldCount: 1, price: 1 }
    ).sort({ soldCount: -1 }).limit(5);

    // منتجات بمخزون منخفض
    const lowStockProducts = await Product.find(
      { stock: { $lt: 5 } },
      { name: 1, stock: 1, price: 1 }
    ).limit(10);

    // حساب الإجمالي
    const totalRevenue = salesData.reduce((sum, day) => sum + day.total, 0);
    const totalOrders = salesData.reduce((sum, day) => sum + day.count, 0);
    const totalCustomers = await User.countDocuments({ role: "customer" });
    const totalProducts = await Product.countDocuments();
    const newCustomersThisMonth = customerData.reduce((sum, day) => sum + day.newCustomers, 0);

    // بناء السياق
    const context = `
📊 ANALYTICS SUMMARY (Last 30 Days):
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Total Revenue: ${totalRevenue.toLocaleString()} EGP
Total Orders: ${totalOrders}
Total Customers: ${totalCustomers}
New Customers This Month: ${newCustomersThisMonth}
Total Products: ${totalProducts}

💰 TOP 5 BEST SELLING PRODUCTS:
${topProducts.map((p, i) => `${i + 1}. ${p.name?.en || p.name}: ${p.soldCount} sold @ ${p.price} EGP`).join("\n")}

⚠️ LOW STOCK ALERT (< 5 items):
${lowStockProducts.map(p => `- ${p.name?.en || p.name}: ${p.stock} left @ ${p.price} EGP`).join("\n")}

📈 RECENT SALES (Last 7 Days):
${salesData.slice(0, 7).map(s => `${s._id}: ${s.total.toLocaleString()} EGP (${s.count} orders)`).join("\n")}
`;

    return { 
      salesData, 
      inventoryData, 
      customerData, 
      topProducts, 
      lowStockProducts, 
      context,
      summary: {
        totalRevenue,
        totalOrders,
        totalCustomers,
        newCustomersThisMonth,
        totalProducts
      }
    };
  } catch (e) {
    console.log("Error fetching admin data:", e.message);
    return { 
      salesData: [], 
      inventoryData: [], 
      customerData: [], 
      topProducts: [],
      lowStockProducts: [],
      context: "",
      summary: {}
    };
  }
}

// ==================== PROFIT HELPERS =======================
function startOfDay(date = new Date()) {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d;
}

function endOfDay(date = new Date()) {
  const d = new Date(date);
  d.setHours(23, 59, 59, 999);
  return d;
}

function startOfMonth(date = new Date()) {
  return new Date(date.getFullYear(), date.getMonth(), 1);
}

function startOfYear(date = new Date()) {
  return new Date(date.getFullYear(), 0, 1);
}

async function computeProfitSummary() {
  const now = new Date();

  const ranges = {
    today: { start: startOfDay(now), end: endOfDay(now) },
    month: { start: startOfMonth(now), end: endOfDay(now) },
    year: { start: startOfYear(now), end: endOfDay(now) },
  };

  const summary = {};
  for (const [key, range] of Object.entries(ranges)) {
    summary[key] = await profitForRange(range.start, range.end);
  }

  // Top products across the year range (for cards)
  summary.topProducts = summary.year?.products?.slice(0, 5) || [];

  return summary;
}

async function profitForRange(start, end) {
  const baseMatch = {
    paymentStatus: "paid",
    orderStatus: "delivered",
  };

  if (start || end) {
    baseMatch.createdAt = {};
    if (start) baseMatch.createdAt.$gte = start;
    if (end) baseMatch.createdAt.$lte = end;
  }

  const result = await Order.aggregate([
    { $match: baseMatch },
    { $unwind: "$items" },
    {
      $lookup: {
        from: "products",
        localField: "items.product",
        foreignField: "_id",
        as: "product",
      },
    },
    { $unwind: { path: "$product", preserveNullAndEmptyArrays: true } },
    {
      $addFields: {
        condition: {
          $toLower: {
            $ifNull: ["$product.condition.en", "new"],
          },
        },
        saleAmount: { $multiply: ["$items.price", "$items.quantity"] },
      },
    },
    {
      $addFields: {
        marginRate: {
          $cond: [
            { $eq: ["$condition", "used"] },
            PROFIT_MARGIN.used,
            PROFIT_MARGIN.new,
          ],
        },
      },
    },
    {
      $addFields: {
        profit: { $multiply: ["$saleAmount", "$marginRate"] },
      },
    },
    {
      $group: {
        _id: "$items.product",
        productId: { $first: "$items.product" },
        name: { $first: "$product.name" },
        image: { $first: { $arrayElemAt: ["$product.images", 0] } },
        condition: { $first: "$condition" },
        saleAmount: { $sum: "$saleAmount" },
        profit: { $sum: "$profit" },
        quantity: { $sum: "$items.quantity" },
      },
    },
    {
      $group: {
        _id: null,
        totalSales: { $sum: "$saleAmount" },
        totalProfit: { $sum: "$profit" },
        newProfit: {
          $sum: {
            $cond: [{ $eq: ["$condition", "new"] }, "$profit", 0],
          },
        },
        usedProfit: {
          $sum: {
            $cond: [{ $eq: ["$condition", "used"] }, "$profit", 0],
          },
        },
        products: {
          $push: {
            productId: "$productId",
            name: "$name",
            image: "$image",
            condition: "$condition",
            saleAmount: "$saleAmount",
            profit: "$profit",
            quantity: "$quantity",
          },
        },
      },
    },
  ]);

  if (!result || result.length === 0) {
    return {
      totalSales: 0,
      totalProfit: 0,
      newProfit: 0,
      usedProfit: 0,
      perAdmin: 0,
      products: [],
    };
  }

  const agg = result[0];
  const perAdmin = agg.totalProfit / ADMIN_COUNT;

  // Sort products by profit desc
  const products = Array.isArray(agg.products)
    ? agg.products.sort((a, b) => (b?.profit || 0) - (a?.profit || 0))
    : [];

  return {
    totalSales: agg.totalSales || 0,
    totalProfit: agg.totalProfit || 0,
    newProfit: agg.newProfit || 0,
    usedProfit: agg.usedProfit || 0,
    perAdmin,
    products,
  };
}

function buildChartsPayload(summary) {
  const bar = {
    type: "bar",
    title: "Profit by Period",
    labels: ["Today", "This Month", "This Year"],
    datasets: [
      {
        label: "Total Profit (EGP)",
        data: [summary.today.totalProfit, summary.month.totalProfit, summary.year.totalProfit],
        backgroundColor: ["#16a34a", "#0ea5e9", "#6366f1"],
      },
    ],
  };

  const pieToday = {
    type: "pie",
    title: "Today Profit: New vs Used",
    labels: ["New", "Used"],
    datasets: [
      {
        data: [summary.today.newProfit, summary.today.usedProfit],
        backgroundColor: ["#16a34a", "#f97316"],
      },
    ],
  };

  return [bar, pieToday];
}

function buildProfitProductCards(products = []) {
  return products.slice(0, 5).map((p) => ({
    _id: p.productId,
    name: p.name,
    image: p.image,
    condition: p.condition,
    profit: p.profit,
    saleAmount: p.saleAmount,
    quantity: p.quantity,
  }));
}

function formatProfitContext(summary) {
  const fmt = (n) => Number(n || 0).toFixed(2);
  return `
Today: totalProfit=${fmt(summary.today.totalProfit)} EGP, newProfit=${fmt(summary.today.newProfit)}, usedProfit=${fmt(summary.today.usedProfit)}, perAdmin=${fmt(summary.today.perAdmin)}
This Month: totalProfit=${fmt(summary.month.totalProfit)} EGP, newProfit=${fmt(summary.month.newProfit)}, usedProfit=${fmt(summary.month.usedProfit)}, perAdmin=${fmt(summary.month.perAdmin)}
This Year: totalProfit=${fmt(summary.year.totalProfit)} EGP, newProfit=${fmt(summary.year.newProfit)}, usedProfit=${fmt(summary.year.usedProfit)}, perAdmin=${fmt(summary.year.perAdmin)}
`;
}
