import getClient from "../utils/aiClient.js";

export async function askAI({ systemPrompt, userPrompt, history = [] }) {
  try {
    const client = getClient();
    const historyMessages = Array.isArray(history)
      ? history.map((msg) => ({ role: msg.role, content: msg.content }))
      : [];

    const response = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: systemPrompt },
        ...historyMessages,
        { role: "user", content: userPrompt },
      ],
      temperature: 0.7, // زيادة قليلة للحصول على ردود أكثر طبيعية
      max_tokens: 500,
      top_p: 0.9,
    });

    // تنظيف الرد والتأكد من جودته
    let answer = response.choices[0].message.content.trim();
    
    // التأكد من أن الرد يحتوي على معنى
    if (!answer || answer.length < 10) {
      answer = "Sorry, I couldn't understand your question well enough. Could you rephrase it?";
    }

    return answer;
  } catch (error) {
    console.error("Error calling AI:", error);
    throw new Error("An error occurred while processing your request. Please try again.");
  }
}