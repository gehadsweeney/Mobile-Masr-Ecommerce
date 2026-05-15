import Product from "../models/productModel.js";
import getClient from "../utils/aiClient.js";
import OpenAI from "openai";


// دالة لحساب embedding لأي نص
async function getEmbedding(text) {
  const client = getClient();
  const response = await client.embeddings.create({
    model: "text-embedding-3-small", // أرخص وأسرع
    input: text,
  });
  return response.data[0].embedding;
}

// مسافة cosine similarity
function cosineSimilarity(a, b) {
  const dot = a.reduce((sum, val, i) => sum + val * b[i], 0);
  const magA = Math.sqrt(a.reduce((sum, val) => sum + val * val, 0));
  const magB = Math.sqrt(b.reduce((sum, val) => sum + val * val, 0));
  return dot / (magA * magB);
}

// Hybrid RAG
export async function hybridRAG({ keywords }) {
  // 1️⃣ جلب المنتجات الأساسية (Simple RAG)
  const products = await Product.find()
    .populate("category brand vendor")
    .limit(50); // ناخد أكبر مجموعة ممكنة للفلترة الأولية

  // 2️⃣ إنشاء embeddings لكل منتج
  const productsWithEmbedding = await Promise.all(
    products.map(async p => {
      const text = `
Name: ${p.name.en}
Category: ${p.category?.name || "N/A"}
Brand: ${p.brand?.name || "N/A"}
Price: ${p.priceAfterDiscount}
Description: ${p.description.en}
RAM: ${p.ram.join(", ")}
Storage: ${p.storage}
Processor: ${p.processor}
GPU: ${p.gpu}
Camera: ${p.camera}
Stock: ${p.stock}
      `;
      const embedding = await getEmbedding(text);
      return { product: p, embedding, text };
    })
  );

  // 3️⃣ عمل embedding لسؤال المستخدم
  const queryEmbedding = await getEmbedding(keywords);

  // 4️⃣ حساب similarity واختيار Top-K
  const topK = 5;
  const scored = productsWithEmbedding.map(p => ({
    product: p.product,
    score: cosineSimilarity(queryEmbedding, p.embedding),
    text: p.text,
  }));

  scored.sort((a, b) => b.score - a.score); // أكبر تشابه في الأول

  const topProducts = scored.slice(0, topK);

  // 5️⃣ تكوين context نصي
  const context = topProducts.map(p => p.text).join("\n");

  return { products: topProducts.map(p => p.product), context };
}
