# 🤖 AI System Documentation - Modular Architecture

## 📁 البنية المعمارية الجديدة

النظام تم إعادة هيكلته بشكل **Modular** حيث كل Feature له ملف مستقل ومنفصل.

```
Backend-FinalProject/
├── controllers/
│   └── aiController.js          (Dynamic Router - يستدعي الـ Feature المناسب)
├── features/                     (كل Feature في ملف مستقل)
│   ├── chat.js                  (Chatbot Logic)
│   ├── compare.js               (Product Comparison)
│   ├── recommend.js             (Smart Recommendations)
│   └── admin.js                 (Admin Analytics)
├── services/
│   ├── aiService.js             (OpenAI Integration)
│   ├── ragService.js            (Hybrid RAG - البحث الذكي)
│   └── featureService.js        (DEPRECATED - تم استبداله بالـ Controller)
└── utils/
    └── aiClient.js              (OpenAI Client Setup)
```

---

## 🎯 1. Controller (Dynamic Router)

**File:** `controllers/aiController.js`

**الوظيفة:** Controller ديناميك يستقبل `feature` name ويستدعي الـ Feature المناسب.

**الكود:**
```javascript
const featureMap = {
  chat: runChat,
  compare: runCompare,
  recommend: runRecommend,
  admin: runAdmin
};

export const aiCore = async (req, res) => {
  const { feature, question, userId } = req.body;
  
  if (!featureMap[feature]) {
    return res.status(400).json({ 
      error: `Invalid feature: ${feature}` 
    });
  }
  
  const result = await featureMap[feature]({ question, userId });
  res.json({ success: true, ...result });
};
```

**مميزات:**
- ✅ ديناميك تماماً
- ✅ سهل إضافة features جديدة
- ✅ لا يحتوي على Business Logic
- ✅ فقط Routing Layer

---

## 🧩 2. Features (Modular Logic)

كل Feature مستقل تماماً ويحتوي على:
- User Context (بيانات المستخدم المخصصة)
- Hybrid RAG (البحث الذكي عن المنتجات)
- System Prompt (تعليمات الـ AI المخصصة)
- AI Call (استدعاء OpenAI)

### 📱 Chat Feature (`features/chat.js`)

**الوظيفة:** Chatbot ذكي للإجابة على أسئلة المستخدمين وترشيح المنتجات.

**User Context المستخدم:**
- الاسم والبريد
- السجل الشرائي
- محتويات الكارت
- الأقسام المتاحة

**System Prompt:**
```
You are an intelligent assistant for a phone and electronics store.
- Speak both English and Arabic fluently
- Help users understand products
- Suggest suitable products based on needs
- All prices in Egyptian Pounds (EGP)
```

**Return:**
```javascript
{
  answer: "AI Response",
  productsUsed: 5,
  productsSuggested: [product1, product2, product3]
}
```

---

### 🔍 Compare Feature (`features/compare.js`)

**الوظيفة:** مقارنة المنتجات وتوضيح المميزات والعيوب.

**User Context:**
- اسم المستخدم فقط (للترحيب)

**System Prompt:**
```
Compare products and clearly explain:
- Advantages and disadvantages of each
- Final recommendation with reasons
```

---

### 💡 Recommend Feature (`features/recommend.js`)

**الوظيفة:** ترشيحات ذكية بناءً على احتياجات المستخدم.

**User Context:**
- الاسم
- السجل الشرائي (لفهم الميزانية والتفضيلات)
- محتويات الكارت

**System Prompt:**
```
Understand user's needs and budget
Suggest best products with reasons
Consider purchase history
```

---

### 👨‍💼 Admin Feature (`features/admin.js`)

**الوظيفة:** تحليل بيانات المبيعات والمخزون.

**User Context:**
- التحقق من صلاحية Admin
- اسم المسؤول

**System Prompt:**
```
Analyze sales, inventory, pricing, customer behavior
Give business insights
```

---

## 🧠 3. RAG Service (Hybrid RAG)

**File:** `services/ragService.js`

**الوظيفة:** أهم جزء في النظام - البحث الذكي عن المنتجات باستخدام AI Embeddings.

### كيف يعمل:

**1. Get Embeddings** 📊
```javascript
// تحويل النص إلى Vector رقمي
await getEmbedding("موبايل للجيمنج")
// → [0.123, -0.456, 0.789, ...]
```

**2. Product Embeddings** 📱
```javascript
// لكل منتج، عمل embedding من:
- Name
- Category
- Brand  
- Description
- Specifications (RAM, Storage, Processor, etc.)
```

**3. Similarity Score** 🎯
```javascript
// حساب التشابه بين سؤال المستخدم وكل منتج
cosineSimilarity(queryEmbedding, productEmbedding)
// → 0.85 (تشابه عالي) أو 0.12 (تشابه ضعيف)
```

**4. Top-K Selection** 🏆
```javascript
// اختيار أفضل 5 منتجات الأقرب للسؤال
return topProducts.slice(0, 5)
```

**مثال:**
```
السؤال: "عاوز موبايل للجيمنج بميزانية 15 ألف"

RAG يبحث عن:
✅ High GPU performance
✅ Snapdragon processors
✅ Gaming keywords
✅ Price ≈ 15000 EGP

النتيجة: أفضل 5 موبايلات gaming مناسبة للميزانية
```

---

## 📡 4. API Request/Response

### Request Example:
```http
POST /api/ai HTTP/1.1
Content-Type: application/json

{
  "feature": "chat",
  "question": "عاوز موبايل كاميرا حلوة",
  "userId": "676c123abc456def789"
}
```

### Response Example:
```json
{
  "success": true,
  "answer": "مرحباً! بناءً على احتياجاتك للكاميرا، أنصحك بـ iPhone 15 Pro Max (كاميرا 48MP) أو Samsung S24 Ultra (كاميرا 200MP)...",
  "productsUsed": 5,
  "productsSuggested": [
    {
      "_id": "676c...",
      "name": { "en": "iPhone 15 Pro Max", "ar": "ايفون 15 برو ماكس" },
      "priceAfterDiscount": 45999,
      "images": ["image_url"],
      "category": { "name": "Smartphones" }
    }
  ]
}
```

---

## ⚙️ 5. How to Add New Feature

**1. إنشاء ملف جديد** في `features/`:
```javascript
// features/myNewFeature.js
import { hybridRAG } from "../services/ragService.js";
import { askAI } from "../services/aiService.js";

export async function runMyNewFeature({ question, userId }) {
  const { products, context } = await hybridRAG({ keywords: question });
  
  const systemPrompt = `Your custom prompt here...`;
  
  const answer = await askAI({ systemPrompt, userPrompt: question });
  
  return { answer, productsUsed: products.length };
}
```

**2. إضافته في الـ Controller:**
```javascript
// controllers/aiController.js
import { runMyNewFeature } from "../features/myNewFeature.js";

const featureMap = {
  chat: runChat,
  myNewFeature: runMyNewFeature  // ← أضفه هنا
};
```

**3. استخدمه من Frontend:**
```javascript
callAI("myNewFeature", "سؤال المستخدم")
```

---

## ✅ Benefits of New Architecture

| الميزة | الوصف |
|--------|------|
| **Modular** | كل Feature مستقل ومنفصل |
| **Scalable** | سهل إضافة features جديدة |
| **Maintainable** | سهل الصيانة والتعديل |
| **Clean Code** | Controller بسيط وديناميك |
| **Testable** | سهل اختبار كل Feature لوحده |
| **Reusable** | إعادة استخدام الـ Logic |

---

## 🔒 Error Handling

```javascript
// جميع الأخطاء تُعالج بشكل آمن
try {
  const result = await featureMap[feature]({ question, userId });
} catch (err) {
  console.error(err);
  res.status(500).json({ success: false, error: err.message });
}
```

✅ لا يتم رمي معلومات حساسة  
✅ رسائل خطأ واضحة للمستخدم  
✅ تسجيل الأخطاء للـ debugging

---

**Last Updated:** December 26, 2025  
**Architecture Version:** 2.0 (Modular)
