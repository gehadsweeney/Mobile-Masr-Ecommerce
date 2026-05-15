import { hybridRAG } from "../services/ragService.js";
import { askAI } from "../services/aiService.js";
import User from "../models/userModel.js";
import Order from "../models/orderModel.js";
import Cart from "../models/cartModel.js";
import Category from "../models/categoryModel.js";

export async function runChat({ question, userId, history = [] }) {
  let userContext = "";

  // Fetch user information
  if (userId) {
    try {
      const user = await User.findById(userId);
      const orders = await Order.find({ userId }).lean();
      const cart = await Cart.findOne({ userId }).populate("items.productId");
      const categories = await Category.find().select("name").lean();

      userContext = `
User: ${user?.firstName || "Friend"}
Email: ${user?.email || ""}
Previous Orders: ${orders?.length || 0}
Purchase History: ${orders.flatMap(o => o.items.map(i => i.name)).join(", ") || "No purchases yet"}
Cart Items: ${cart?.items?.length || 0}
Available Categories: ${categories.map(c => c.name).join(", ")}
      `;
    } catch (e) {
      console.log("Error fetching user data:", e.message);
    }
  }

  // Use Hybrid RAG to find relevant products
  const { products, context } = await hybridRAG({ keywords: question });

  // Build conversation history string
  let conversationContext = "";
  if (history && history.length > 0) {
    conversationContext = "\nPrevious Conversation:\n";
    history.forEach(msg => {
      conversationContext += `${msg.role === "user" ? "User" : "Assistant"}: ${msg.content}\n`;
    });
  }

  // Build professional system prompt with conversation history
  const systemPrompt = `You are an intelligent assistant for a phone and electronics store website.
You speak both English and Arabic fluently. Respond in the same language the user uses.
Be friendly, professional, and helpful.
All prices are in Egyptian Pounds (EGP).

User Information:${userContext}
${conversationContext}
Current Question: ${question}

Available Products Context:
${context}

Instructions:
- Remember the previous conversation and maintain context
- Help users understand products based on their needs
- Suggest suitable products only if they match the user's request
- If no relevant products exist, inform the user
- Ask clarifying questions to better understand their needs`;

  const answer = await askAI({ 
    systemPrompt, 
    userPrompt: question,
    history, // pass structured history to the model
  });

  return { 
    answer, 
    productsUsed: products.length,
    productsSuggested: products.slice(0, 3)
  };
}
