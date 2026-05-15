import { hybridRAG } from "../services/ragService.js";
import { askAI } from "../services/aiService.js";
import User from "../models/userModel.js";
import Order from "../models/orderModel.js";
import Cart from "../models/cartModel.js";

export async function runRecommend({ question, userId }) {
  let userContext = "";

  if (userId) {
    try {
      const user = await User.findById(userId);
      const orders = await Order.find({ userId }).lean();
      const cart = await Cart.findOne({ userId }).populate("items.productId");

      userContext = `\nالمستخدم: ${user?.firstName || "Friend"}
السجل الشرائي: ${orders?.length || 0} طلب سابق
الأصناف المشتراة: ${orders.flatMap(o => o.items.map(i => i.name)).join(", ") || "لم يشتري بعد"}
الكارت الحالي: ${cart?.items?.length || 0} منتج`;
    } catch (e) {
      console.log("Error fetching user data:", e.message);
    }
  }

  const { products, context } = await hybridRAG({ keywords: question });

  const systemPrompt = `You are an intelligent assistant for a phone and electronics store.
You speak both English and Arabic fluently. Respond in the same language the user uses.
All prices are in Egyptian Pounds (EGP).

${userContext}

${context}

Understand the user's needs and budget, then suggest the best products that suit them with reasons for the selection.`;

  const answer = await askAI({ 
    systemPrompt, 
    userPrompt: question 
  });

  return { 
    answer, 
    productsUsed: products.length,
    productsSuggested: products.slice(0, 3)
  };
}
