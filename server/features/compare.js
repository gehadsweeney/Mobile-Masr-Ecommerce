import { hybridRAG } from "../services/ragService.js";
import { askAI } from "../services/aiService.js";
import User from "../models/userModel.js";

export async function runCompare({ question, userId }) {
  let userContext = "";

  if (userId) {
    try {
      const user = await User.findById(userId);
      userContext = `\nالمستخدم: ${user?.firstName || "Friend"}`;
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

Compare products and clearly explain the advantages and disadvantages of each, then give a final recommendation.`;

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
