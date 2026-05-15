# Mobil Masr 🚗🇪🇬

## 👥 Team Members

- Abdullah
- Mostafa
- Ghehad
- Rehab
- Heba

---

## 📖 Project Overview

Mobil Masr is a comprehensive e-commerce platform for automotive products and accessories, designed to serve the Egyptian market. Built with React and modern web technologies, the project offers a seamless experience for users to browse, compare, and purchase car-related products from various vendors.

### Key Features

- **Product Catalog:** Browse a wide range of automotive products, including spare parts, accessories, and car care items.
- **Advanced Search & Filters:** Easily find products using smart search, category filters, and sorting options.
- **Product Comparison:** Compare specifications and prices of multiple products side-by-side.
- **AI Assistant:** Get personalized recommendations and answers to automotive questions using integrated AI features.
- **Cart & Checkout:** Add products to your cart, manage quantities, and complete purchases securely.
- **User Authentication:** Register, login, and manage your profile for a personalized experience.
- **Multi-language Support:** Switch between Arabic and English for a localized experience.
- **Vendor Profiles:** Explore trusted vendors and their product offerings.
- **Responsive Design:** Optimized for mobile and desktop devices.

### Why Mobil Masr?

Mobil Masr aims to simplify the process of finding and buying automotive products in Egypt, bringing together trusted vendors and smart tools to help users make informed decisions. The platform leverages AI to enhance user experience and provide valuable insights.

---

## 🛠️ Technologies Used

- React
- Vite
- Redux Toolkit
- i18next (Localization)
- CSS Modules
- Node.js (API integration)
- AI APIs

---

## 📬 Contact & Contribution

For questions or contributions, feel free to reach out to any team member. We welcome feedback and suggestions to improve Mobil Masr!

---

## 📝 Detailed Project Explanation

Mobil Masr is built to provide a modern, fast, and user-friendly experience for anyone looking to buy or compare automotive products in Egypt. Below is a technical and user flow overview:

### 🏗️ Project Structure & Logic

- **Pages:**

  - Home: Highlights new and featured products, sliders, reviews, and platform features.
  - Categories: Browse product categories with images and links.
  - Product Details: View product images, specs, prices, and add to cart or compare.
  - Comparison: Compare selected products in a table, get AI recommendations.
  - Vendor: View vendor profile, products, and ratings.
  - Profile: Manage user info, orders, favorites, addresses, etc.
  - Auth: Login/Register pages for user authentication.

- **Core Components:**

  - Navbar, Footer, ChatFeature (AI assistant), Cart, CompareList, ProductCard, etc.
  - Contexts for login state, product comparison, and AI chat.
  - Redux Toolkit for global state (user, products, cart, wishlist, etc).

- **Services:**
  - API services for backend communication (products, user, cart, etc).
  - AI API integration for chat and recommendations.

### 🔄 User Flow

1. **Language Initialization:**

   - Loads preferred language from localStorage (Arabic/English).

2. **Authentication:**

   - If user is logged in, loads profile, cart, and wishlist.

3. **Browsing & Searching:**

   - Users can browse categories, search for products, and filter results.

4. **Product Comparison:**

   - Add products to compare list, view detailed comparison, and get AI advice.

5. **Cart & Checkout:**

   - Add products to cart, adjust quantities, and proceed to secure checkout.

6. **AI Assistant:**

   - Ask questions or request recommendations via integrated chat.

7. **Vendor Exploration:**

   - View vendor profiles, ratings, and product offerings.

8. **Profile Management:**

   - Edit account info, view orders, manage favorites and addresses.

9. **Responsive Experience:**
   - All features work seamlessly on mobile and desktop.

### ⚙️ Technical Highlights

- **React & Vite:** Fast SPA with modular components.
- **Redux Toolkit:** Centralized state management for scalability.
- **i18next:** Full localization for Arabic and English.
- **Context API:** For login, comparison, and AI chat state.
- **AI Integration:** OpenAI-powered assistant for smart recommendations and Q&A.
- **Toast Notifications:** Real-time feedback for user actions.
- **Secure Storage:** Uses localStorage/sessionStorage for user/session data.

---

## 💡 Example User Scenario

1. User visits Mobil Masr, chooses language.
2. Browses categories or searches for a product.
3. Adds products to cart or compare list.
4. Opens chat to ask AI for advice on best product.
5. Registers or logs in to save cart and complete purchase.
6. Views vendor info and ratings before buying.
7. Manages orders and favorites from profile page.

---

## 🌟 Team & Credits

Mobil Masr was developed by:

- Abdullah
- Mostafa
- Ghehad
- Rehab
- Heba

For any questions, feedback, or contributions, contact any team member.
