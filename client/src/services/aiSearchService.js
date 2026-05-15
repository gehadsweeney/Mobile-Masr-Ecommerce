const OPENAI_API_KEY = import.meta.env.VITE_OPENAI_API_KEY;

// Normalize helper (للمقارنة فقط)
const normalizeText = (str = "") =>
  str.toLowerCase().trim().replace(/\s+/g, " ");

// check Arabic chars
const hasArabic = (str = "") => /[\u0600-\u06FF]/.test(str);

// Convert category name to slug like your routes: "Smart Watches" -> "smart-watches"
const slugifyCategory = (cat) =>
  (cat?.name || cat || "all")
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-");

// -------- SYSTEM PROMPT -------- //
const SYSTEM_MESSAGE = `
You are an AI search engine for an e-commerce website.

The site has these main categories (slugs in parentheses):
- Mobile ("mobile")
- Tablet ("tablet")
- Laptop ("laptop")
- Smart Watches ("smart-watches")
- Wireless Earbuds ("wireless-earbuds")
- Game Consoles ("game-consoles")
If nothing matches clearly, use "all".

Users can type in:
- Arabic (e.g. "موبايلات", "ساعات ذكية", "كونسول", "تليفون ايفون")
- English (e.g. "iphone", "samsung mobiles")
- Arabizi (e.g. "mobail", "labtop")
- Typos (e.g. "iphon", "laptoop")

Your job is to understand the TRUE intent and return ONLY JSON.

You MUST:

1) Classify "intent":
   - "product"  → user means a specific model (e.g. "iphone 15 pro max")
   - "brand"    → user mainly means a brand (e.g. "samsung", "apple")
   - "category" → user mainly means a device category (e.g. "موبايلات")
   - "mixed"    → brand + category or product + brand (e.g. "تليفون ايفون")

2) Detect:
   - "categorySlug": one of
     "mobile", "tablet", "laptop", "smart-watches", "wireless-earbuds", "game-consoles", "all"
   - "brand": canonical English brand with proper capitalization if clear (e.g. "Apple", "Samsung"), else null.
   - "normalizedQuery": an English/Latin search string that best represents what the user means.
       VERY IMPORTANT:
       - "normalizedQuery" MUST use ONLY English letters, digits and spaces.
       - NO Arabic letters are allowed in "normalizedQuery".
       - It should be short and suitable for a search box and URL.

       Examples:
         "موبايلات سامسونج"        -> "samsung mobile"
         "لاب توب hp"              -> "hp laptop"
         "ايفون ١٥ برو ماكس"       -> "iphone 15 pro max"
         "سماعات بلوتوث"           -> "wireless earbuds"
         "تليفون ايفون"            -> "iphone mobile"

   - "productName": if a specific model is present (e.g. "iphone 15 pro max"), else "".

3) Fix spelling and translate Arabic/Arabizi where needed:
   - "موبايل", "موبايلات", "موبيل", "phone", "mobail"            -> categorySlug = "mobile"
   - "لاب", "لاب توب", "لابتوب", "labtop"                         -> "laptop"
   - "تاب", "تابلت", "ايباد", "tablet", "ipad"                    -> "tablet"
   - "ساعة ذكية", "ساعات ذكية", "سمارت ووتش"                     -> "smart-watches"
   - "سماعات", "سماعات بلوتوث", "earbuds", "headphones"           -> "wireless-earbuds"
   - "بلايستيشن", "اكس بوكس", "كونسول", "console", "ps5", "xbox"  -> "game-consoles"
   - "ايفون", "ايفون ١٥", "تليفون ايفون"                         -> brand = "Apple", categorySlug = "mobile", normalizedQuery like "iphone", "iphone 15"

4) Output MUST be ONLY this JSON shape:
{
  "intent": "product | brand | category | mixed",
  "categorySlug": "mobile | tablet | laptop | smart-watches | wireless-earbuds | game-consoles | all",
  "brand": "Apple or Samsung or ... or null",
  "normalizedQuery": "english/latin search string (NO Arabic)",
  "productName": "model name or empty string",
  "confidence": 0-100
}

5) Absolutely NO explanations. NO extra text. JSON ONLY.
`;

// -------- Call OpenAI via fetch -------- //
async function askAI(query) {
  try {
    const res = await fetch(import.meta.env.VITE_OPENAI_API_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${OPENAI_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          { role: "system", content: SYSTEM_MESSAGE },
          { role: "user", content: `User search: "${query}"` },
        ],
        temperature: 0.2,
      }),
    });

    const data = await res.json();

    let parsed;
    try {
      parsed = JSON.parse(data.choices[0].message.content.trim());
    } catch {
      parsed = {
        intent: "unknown",
        categorySlug: "all",
        brand: null,
        normalizedQuery: query,
        productName: "",
        confidence: 10,
      };
    }

    // safety: لو normalizedQuery فيه عربي، تجاهله وخليه نفس query (هنعالج ده تحت)
    if (parsed.normalizedQuery && hasArabic(parsed.normalizedQuery)) {
      parsed.normalizedQuery = "";
    }

    return parsed;
  } catch (err) {
    console.error("AI Search Error:", err);
    return {
      intent: "error",
      categorySlug: "all",
      brand: null,
      normalizedQuery: "",
      productName: "",
      confidence: 0,
    };
  }
}

// -------- Fallback search (no AI) -------- //
const fallbackSearch = (query, productsArray) => {
  const q = normalizeText(query);

  const results = productsArray.filter((p) => {
    const brandName = typeof p.brand === "object" ? (p.brand?.name || "") : (p.brand || "");
    const categoryName = p.category?.name || p.category || "";
    const text = normalizeText(
      `${p.name || ""} ${brandName} ${categoryName}`
    );
    return text.includes(q);
  });

  return {
    matchedProducts: results.slice(0, 50),
    ai: null,
    categorySlug: "all",
  };
};

// -------- MAIN: searchProductsWithAI -------- //
export async function searchProductsWithAI(query, productsArray) {
  if (!query || !query.trim()) {
    return {
      matchedProducts: [],
      ai: null,
      categorySlug: "all",
    };
  }

  const ai = await askAI(query);

  // نحدد كويري للبحث + كويري للـ URL
  let urlQuery = ai.normalizedQuery && !hasArabic(ai.normalizedQuery)
    ? ai.normalizedQuery.trim()
    : query.trim();

  // ده اللي هنستخدمه في الفلترة (منسّق)
  const normalizedQueryForSearch = normalizeText(urlQuery);

  const categorySlug = ai.categorySlug || "all";
  const brand = ai.brand || null;

  // نبدأ بكل المنتجات
  let products = [...productsArray];

  // ----- 2) فلترة بالكَتِيجوري من الـ AI (hint مش شرط يمسك جامد) -----
  if (categorySlug !== "all") {
    const afterCategory = products.filter((p) => {
      const cSlug = slugifyCategory(p.category);
      return cSlug === categorySlug;
    });
    if (afterCategory.length > 0) {
      products = afterCategory;
    }
    // لو صفر؛ سيب الكل زي ما هو، ما تنشفهاش
  }

  // ----- 3) فلترة بالبراند من الـ AI (لو واضح) -----
  if (brand) {
    const afterBrand = products.filter((p) => {
      const b = p.brand ? (typeof p.brand === "object" ? p.brand.name : p.brand) : null;
      return b && normalizeText(b) === normalizeText(brand);
    });
    if (afterBrand.length > 0) {
      products = afterBrand;
    }
    // برضه لو صفر؛ ما نرميش كل حاجة
  }

  // ----- 4) فلترة بالنورماليزد كويري (tokens مش ستيرنج كامل) -----
  if (normalizedQueryForSearch) {
    const tokens = normalizedQueryForSearch
      .split(" ")
      .filter(Boolean);

    if (tokens.length > 0) {
      const beforeQueryProducts = [...products];

      products = products.filter((p) => {
        const brandName = typeof p.brand === "object" ? (p.brand?.name || "") : (p.brand || "");
        const categoryName = p.category?.name || p.category || "";
        const text = normalizeText(
          `${p.name || ""} ${brandName} ${categoryName}`
        );

        // نخلي على الأقل معظم الكلمات تبان في النص
        const matchedTokens = tokens.filter((t) => text.includes(t));
        return matchedTokens.length >= Math.ceil(tokens.length / 2);
      });

      // لو الفلترة دي صفّرت الدنيا → ارجع للي قبلها
      if (products.length === 0) {
        products = beforeQueryProducts;
      }
    }
  }

  // ----- 5) في حالة برضه مفيش نتيجة → Fallback -----
  if (products.length === 0) {
    // جرب بالفورم الإنجليزي الأول، لو مفيش استخدم الكويري الأصلي
    const fbQuery = urlQuery || query;
    return fallbackSearch(fbQuery, productsArray);
  }

  // ده اللي هنستخدمه في الـ URL (SearchInput بياخده من ai.normalizedQuery، فهنرجعه برضه من هنا)
  ai.normalizedQuery = urlQuery;

  return {
    matchedProducts: products,
    ai,
    categorySlug,
  };
}

// -------- LIVE suggestions (زي ما هي، سريعة) -------- //
export const getLiveSuggestions = (query, productsArray, limit = 5) => {
  if (!query || query.length < 2) return [];

  const q = normalizeText(query);

  return productsArray
    .filter((p) => p?.name && normalizeText(p.name).includes(q))
    .slice(0, limit);
};
