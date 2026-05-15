import { runChat } from "../features/chat.js";
import { runCompare } from "../features/compare.js";
import { runRecommend } from "../features/recommend.js";
import { runAdmin } from "../features/admin.js";

// Map features to their functions
const featureMap = {
  chat: runChat,
  compare: runCompare,
  recommend: runRecommend,
  admin: runAdmin
};

export const aiCore = async (req, res) => {
  try {
    const { feature, question, userId, history } = req.body;

    // التحقق من وجود الفيتشر
    if (!feature || !featureMap[feature]) {
      return res.status(400).json({ 
        success: false, 
        error: `Invalid feature: ${feature}. Available features: ${Object.keys(featureMap).join(", ")}` 
      });
    }

    // استدعاء الفيتشر المناسب
    const result = await featureMap[feature]({ question, userId, history });

    res.json({ 
      success: true, 
      ...result
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: err.message });
  }
};





























// import client from "../utils/aiClient.js";

// export const aiCore = async (req, res) => {
//   try {
//     const { feature, question, context } = req.body;

//     //  System prompt Common to all site features
//     let systemPrompt =
//       "You are an AI shopping assistant for an e-commerce website. " +
//       "You help users understand products, compare them, and choose the best options based on their needs. " +
//       "The website sells different categories such as phones, smart watches, gaming consoles, and more.";

//     //Directing the prompt according to the feature type
//     switch (feature) {
//       case "chat":
//         systemPrompt +=
//           " Answer user questions clearly about product specifications, features, and usage.";
//         break;

//       case "compare":
//         systemPrompt +=
//           " Compare the given products and summarize pros and cons for each one, then give a final recommendation.";
//         break;

//       case "recommend":
//         systemPrompt +=
//           " Recommend the best products based on the user's preferences, budget, and use case.";
//         break;

//       case "admin":
//         systemPrompt +=
//           " Help the admin analyze sales, inventory, pricing, and customer behavior, and give useful business insights.";
//         break;

//       default:
//         systemPrompt +=
//           " Be helpful and give clear, concise answers.";
//     }

//     // calling the AI model
//     const response = await client.chat.completions.create({
//       model: "gpt-4o-mini",
//       messages: [
//         {
//           role: "system",
//           content: systemPrompt,
//         },
//         {
//           role: "user",
//           content: `Context:\n${context || "No context provided."}\n\nQuestion: ${question}`,
//         },
//       ],
//     });

//     // Sending back the AI response
//     return res.json({
//       success: true,
//       answer: response.choices[0].message.content,
//     });
//   } catch (error) {
//     console.error("AI Controller Error:", error);

//     return res.status(500).json({
//       success: false,
//       error: "Failed to get AI response",
//       details: error.message,
//     });
//   }
// };