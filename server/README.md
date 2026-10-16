<div align="center">

# Mobile Masr — Backend API

**A production-grade REST API for an AI-powered e-commerce platform**

[![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)](https://nodejs.org)
[![Express 5](https://img.shields.io/badge/Express_5-000000?style=for-the-badge&logo=express&logoColor=white)](https://expressjs.com)
[![MongoDB](https://img.shields.io/badge/MongoDB-47A248?style=for-the-badge&logo=mongodb&logoColor=white)](https://mongodb.com)
[![Mongoose](https://img.shields.io/badge/Mongoose_8-880000?style=for-the-badge&logoColor=white)](https://mongoosejs.com)
[![OpenAI](https://img.shields.io/badge/OpenAI_GPT--4o--mini-412991?style=for-the-badge&logo=openai&logoColor=white)](https://openai.com)
[![Stripe](https://img.shields.io/badge/Stripe_v20-635BFF?style=for-the-badge&logo=stripe&logoColor=white)](https://stripe.com)
[![Cloudinary](https://img.shields.io/badge/Cloudinary-3448C5?style=for-the-badge&logo=cloudinary&logoColor=white)](https://cloudinary.com)
[![Swagger](https://img.shields.io/badge/Swagger_UI-85EA2D?style=for-the-badge&logo=swagger&logoColor=black)](https://swagger.io)

</div>

---

## 📌 Overview

This is the Express 5 backend that powers both the **Mobile Masr customer storefront** and the **Angular admin dashboard**. It provides a fully documented REST API covering authentication, product catalog, cart, orders, Stripe payments, image uploads, and four distinct AI features built on OpenAI GPT-4o-mini and a custom Hybrid RAG pipeline.

The server is built as an **ES Module** project (`"type": "module"`) and starts only after MongoDB confirms an open connection, ensuring no requests are accepted before the database is ready.

---

## 🏗️ Architecture

```
server/
├── app.js                  # Entry point — middleware stack, routes, Swagger, server start
├── config/
│   ├── connectDB.js        # Mongoose connection
│   ├── cloudinary.js       # Cloudinary SDK configuration
│   └── stripeClient.js     # Lazy-initialized Stripe singleton
├── controllers/            # Route handler logic
├── features/               # AI feature modules (chat, compare, recommend, admin)
├── middleware/             # JWT auth, file upload, visit tracking
├── models/                 # Mongoose schemas
├── routes/                 # Express routers (one file per resource)
├── services/
│   ├── ragService.js       # Hybrid RAG — OpenAI embeddings + cosine similarity
│   └── aiService.js        # GPT-4o-mini chat completion wrapper
└── utils/
    └── aiClient.js         # Lazy-initialized OpenAI client singleton
```

---

## ⚙️ Middleware Stack

Middleware is applied in this exact order in `app.js`:

```
1.  POST /stripe/webhook   ← express.raw()  (MUST be before express.json)
2.  express.json()
3.  cors()
4.  Routes
```

> The Stripe webhook route is registered **before** `express.json()` so it receives the raw request body, which is required for Stripe's signature verification.

---

## 📡 API Reference

All endpoints are served from the root of the server (default: `http://localhost:3000`).  
Interactive Swagger docs are available at **`/api-docs`**.

---

### 🔐 Authentication — `/auth`

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| `POST` | `/auth/register` | Register new user (name, email, password) | Public |
| `POST` | `/auth/login` | Login and receive a JWT (7-day expiry) | Public |
| `POST` | `/auth/google-login` | Login / register via Google OAuth token | Public |
| `GET` | `/auth/profile` | Get the logged-in user's profile | `protect` |
| `PUT` | `/auth/profile` | Update name and email | `protect` |
| `PUT` | `/auth/change-password` | Change password (requires `oldPassword`) | `protect` |
| `GET` | `/auth/check` | Verify token validity; returns user object | `protect` |

**Register example:**
```json
POST /auth/register
{
  "name": "Ahmed Mohamed",
  "email": "ahmed@example.com",
  "password": "secret123"
}
```

**Login response:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": { "id": "...", "name": "Ahmed Mohamed", "role": "customer" }
}
```

---

### 🛍️ Products — `/products`

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| `GET` | `/products` | List all products (pagination + `?lang=en\|ar`) | Public |
| `GET` | `/products/:id` | Get a single product (`?lang=en\|ar`) | Public |
| `POST` | `/products` | Create a new product | `protect` + `admin` |
| `PUT` | `/products/:id` | Update product | `protect` + `admin` |
| `DELETE` | `/products/:id` | Delete product | `protect` + `admin` |

All bilingual fields (`name`, `description`, `condition`, `accessories`, `batteryStatus`, `guarantee`) accept an `{en, ar}` object. The `priceAfterDiscount` virtual is always included in responses.

---

### 🏷️ Categories — `/categories`

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/categories` | Get all categories |
| `GET` | `/categories/:id` | Get category by ID |
| `POST` | `/categories` | Create category (name + image) |
| `PUT` | `/categories/:id` | Update category |
| `DELETE` | `/categories/:id` | Delete category |

---

### 🏢 Brands — `/brands`

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/brands` | Get all brands |
| `GET` | `/brands/:id` | Get brand by ID |
| `POST` | `/brands` | Create brand (name + image) |
| `PUT` | `/brands/:id` | Update brand |
| `DELETE` | `/brands/:id` | Delete brand |

---

### 🏪 Vendors — `/vendors`

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| `GET` | `/vendors` | Get all vendors | Public |
| `GET` | `/vendors/:id` | Get vendor by ID | Public |
| `POST` | `/vendors` | Create vendor | `protect` + `admin` |
| `PUT` | `/vendors/:id` | Update vendor | `protect` + `admin` |
| `DELETE` | `/vendors/:id` | Delete vendor | `protect` + `admin` |

---

### 🛒 Cart — `/cart`

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| `GET` | `/cart` | Get user's cart (`?lang=en\|ar`) | `protect` |
| `POST` | `/cart/add` | Add item; body: `{productId, quantity}` | `protect` |
| `PUT` | `/cart/update` | Update item quantity; body: `{productId, quantity}` | `protect` |
| `PUT` | `/cart/remove` | Remove one item; body: `{productId}` | `protect` |
| `DELETE` | `/cart/clear` | Empty the entire cart | `protect` |

> Cart price is snapshotted at `priceAfterDiscount` when an item is added, so price changes after that don't affect existing cart items.

---

### 📦 Orders — `/orders`

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| `POST` | `/orders` | Create order from cart (COD or online) | `protect` |
| `GET` | `/orders/user` | Get orders for the logged-in user | `protect` |
| `GET` | `/orders/:id` | Get single order by ID | `protect` |
| `GET` | `/orders/admin/all` | Get all orders (admin) | `protect` + `admin` |
| `PUT` | `/orders/:id` | Update order status / paymentStatus | `protect` + `admin` |
| `DELETE` | `/orders/:id` | Delete order | `protect` + `admin` |

**Create order body:**
```json
{
  "shippingAddress": {
    "fullName": "Ahmed Mohamed",
    "phone": "01012345678",
    "governorate": "Cairo",
    "city": "Nasr City",
    "street": "123 Main St, Apt 5",
    "notes": "Call before delivery"
  },
  "paymentMethod": "cod"
}
```

**Order status flow:**
```
pending → confirmed → processing → shipped → delivered
                                            ↘ cancelled
```

Stock is deducted when an online order payment is verified, or when a COD order moves to `confirmed`. A `stockDeducted` boolean on the Order document prevents double-deduction.

---

### 💳 Stripe Payments — `/stripe`

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| `POST` | `/stripe/create-checkout-session` | Create a Stripe Checkout session from cart | `protect` |
| `GET` | `/stripe/verify-session?session_id=` | Verify payment and create the order | `protect` |
| `POST` | `/stripe/webhook` | Stripe webhook handler (raw body) | Stripe signature |

**Payment flow:**
```
Client                         Server                       Stripe
  │                               │                            │
  ├─ POST /stripe/create-session ─►│─ create session ──────────►│
  │◄─ { url, sessionId } ─────────│◄─ session object ──────────│
  │                               │                            │
  ├─ redirect to Stripe ──────────────────────────────────────►│
  │◄─ redirect to /cart/order-success?session_id=... ──────────│
  │                               │                            │
  ├─ GET /stripe/verify-session ──►│─ retrieve session ─────────►│
  │                               │◄─ payment_status: paid ────│
  │                               │                            │
  │                               ├─ deduct stock (atomic + rollback)
  │                               ├─ create Order document
  │                               └─ clear cart
  │◄─ { order } ──────────────────│
```

- Currency: **EGP**
- Fixed shipping fee: **100 EGP** added as a separate Stripe line item
- `shippingAddress` and `userId` are stored in Stripe session metadata
- Stock deduction is transactional — if one item fails, all deductions are rolled back
- Webhook handler currently logs events; order creation is frontend-driven via `verify-session`

---

### ❤️ Wishlist — `/wishlist`

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| `GET` | `/wishlist` | Get user's wishlist (`?lang=en\|ar`) | `protect` |
| `POST` | `/wishlist` | Add product; body: `{productId}` | `protect` |
| `DELETE` | `/wishlist/remove` | Remove one product; body: `{productId}` | `protect` |
| `DELETE` | `/wishlist` | Delete entire wishlist | `protect` |

---

### ⭐ Site Reviews — `/reviews`

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| `GET` | `/reviews` | Get all site reviews | Public |
| `POST` | `/reviews` | Add review (rating 1–5 + comment) | `protect` |
| `DELETE` | `/reviews/:id` | Delete review (owner or admin) | `protect` |

---

### 👤 Admin — `/admin`

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| `GET` | `/admin/users` | Get all users (pagination + `?search=`) | `protect` + `admin` |
| `GET` | `/admin/users/:id` | Get user by ID | `protect` + `admin` |
| `PUT` | `/admin/users/:id` | Update user (name, email, phone, role, isActive) | `protect` + `admin` |
| `DELETE` | `/admin/users/:id` | Delete user (`?hard=true` for permanent, otherwise soft-deactivate) | `protect` + `admin` |
| `PUT` | `/admin/profile-picture` | Upload admin's own profile picture (multipart) | `protect` + `admin` |
| `POST` | `/admin/ai-chat` | Admin AI analytics assistant | `protect` + `admin` |

---

### 📊 Dashboard — `/dashboard`

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| `GET` | `/dashboard/overview` | Full analytics snapshot | `protect` + `admin` |

**Response includes:**
- Total users, orders, revenue, active carts, site visits
- Today's sales
- Recent orders (last 5)
- New users (last 5)
- Best-selling products (MongoDB aggregation from order items)
- Low-stock alerts (`stock < 2`) and out-of-stock products
- Sales chart data (last 30 days)
- Orders chart data (last 4 weeks)

---

### 🤖 AI — `/ai`

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| `POST` | `/ai` | Unified AI endpoint; dispatches by `feature` | Public |

**Request body:**
```json
{
  "feature": "chat",
  "question": "What's a good phone under 15000 EGP?",
  "userId": "optional-user-id",
  "history": [
    { "role": "user", "content": "I need a good camera phone" },
    { "role": "assistant", "content": "I recommend..." }
  ]
}
```

Available `feature` values:

| Feature | Handler | Description |
|---------|---------|-------------|
| `chat` | `runChat` | Shopping assistant with product suggestions |
| `compare` | `runCompare` | Product comparison with pros/cons |
| `recommend` | `runRecommend` | Personalized recommendations |
| `admin` | `runAdmin` | Business insights from product data |

---

### 📈 Visit Tracking — `/track`

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| `POST` | `/track` | Record a site visit (IP + user-agent) | Public |

---

## 🤖 AI Engine

The AI system is built around a **Hybrid RAG (Retrieval-Augmented Generation)** pipeline and four specialized feature modules, all powered by **OpenAI GPT-4o-mini**.

---

### Hybrid RAG Pipeline (`services/ragService.js`)

Every AI feature call runs through this pipeline before generating a response:

```
1. Fetch up to 50 products from MongoDB (populated with category, brand, vendor)
         │
2. Generate an OpenAI embedding (text-embedding-3-small) for each product's
   text representation: name, category, brand, price, description, specs
         │
3. Generate an embedding for the user's question / keywords
         │
4. Compute cosine similarity between the query embedding and each product
         │
5. Select top-5 most semantically similar products
         │
6. Build a text context string from the top-5 products
         ▼
   Inject context into the GPT-4o-mini system prompt
```

This ensures the AI always responds based on the actual product catalog, not general knowledge.

---

### AI Feature Modules (`features/`)

#### `chat` — Shopping Assistant
Personalizes responses using the logged-in user's order history, cart size, and available categories. Passes the last 6 conversation messages as history for multi-turn context. Returns `answer` + up to 3 `productsSuggested` objects (rendered as inline product cards in the client).

#### `compare` — Product Comparison
Compares products found by the RAG pipeline. Instructs the model to list pros/cons for each product and give a final purchase recommendation.

#### `recommend` — Personalized Recommendations
Enriches the prompt with the user's purchase history (items bought, order count) and cart state. Suggests products most aligned with the user's established preferences.

#### `admin` — Business Insight Assistant
Routes through `runAdmin` (general product-based insights) or `adminDashboardAI` (full analytics). The dashboard AI version:
- Aggregates the last 30 days of sales, orders, and new customers from MongoDB
- Identifies top-5 best-selling products and low-stock items (`< 5`)
- Computes profit summaries for **today / this month / this year**:
  - New products: 20% margin
  - Used products: 40% margin
  - Per-admin share calculated across 5 admins
- Only counts `delivered` + `paid` orders toward profit
- Returns structured `charts` (bar + pie JSON) and `productCards` alongside the text answer

---

### AI Service (`services/aiService.js`)

Thin wrapper over OpenAI Chat Completions:

| Parameter | Value |
|-----------|-------|
| Model | `gpt-4o-mini` |
| Temperature | `0.7` |
| Max tokens | `500` |
| Top P | `0.9` |
| Message structure | `[system, ...history, user]` |

---

## 🔐 Authentication & Authorization

### JWT Flow

```
POST /auth/login
        │
  Verify email + password (bcrypt.compare)
        │
  Sign JWT: { id, role } — expires in 7 days
        │
  Client stores token and sends it as:
  Authorization: Bearer <token>
        │
  protect middleware:
    ├─ Extract token from Authorization header
    ├─ jwt.verify(token, JWT_SECRET)
    ├─ User.findById(decoded.id).select("-password")
    └─ Attach to req.user → next()
```

### Google OAuth

`POST /auth/google-login` accepts either:
- A Google ID token (verified via `google-auth-library`)
- Direct user data (`googleId`, `email`, `name`, `profilePicture`)

The user is looked up by `email` OR `googleId`. If not found, a new account is created without a password. A regular site JWT is returned either way.

### Password Reset

The `User` model includes `createPasswordResetToken()` — generates a SHA-256-hashed reset token stored in `passwordResetToken` with a 10-minute expiry in `passwordResetExpires`.

### Role-Based Access Control

Two middleware guards are chained:

```javascript
// Verify JWT and attach req.user
protect

// Check req.user.role === "admin", return 403 otherwise
admin
```

Admin-only routes: all `/admin/*`, `POST /products`, `PUT/DELETE /products/:id`, `GET /orders/admin/all`, `PUT/DELETE /orders/:id`, `GET /dashboard/overview`, and vendor CRUD.

---

## 🗄️ Database Models

### User

| Field | Type | Notes |
|-------|------|-------|
| `name` | String | 3–50 chars, required |
| `email` | String | unique, lowercase, required |
| `password` | String | bcrypt-hashed, `select: false`, not required if `googleId` set |
| `googleId` | String | unique, sparse |
| `profilePicture` | String | Cloudinary URL |
| `phone` | String | Egyptian format `/^01[0-9]{9}$/` |
| `address` | String | max 200 chars |
| `role` | String | `customer` (default) \| `admin` |
| `isActive` | Boolean | `true` by default; set to `false` on soft delete |
| `passwordResetToken` | String | SHA-256 hashed |
| `passwordResetExpires` | Date | 10-minute window |

Instance methods: `comparePassword`, `generateAuthToken`, `createPasswordResetToken`. Virtual: `profile`.

---

### Product

| Field | Type | Notes |
|-------|------|-------|
| `name` | `{en, ar}` | both required |
| `price` | Number | required, min 0 |
| `discount` | Number | 0–100%, default 0 |
| `skuCode` | String | unique, required |
| `description` | `{en, ar}` | max 1000 each |
| `condition` | `{en: "new"\|"used", ar: "جديد"\|"مستعمل"}` | |
| `storage`, `ram[]`, `processor`, `gpu`, `hdd`, `ssd` | String / [String] | device specs |
| `color`, `batteryCapacity`, `simCard`, `screenSize`, `camera`, `weight` | String | |
| `accessories` | `{en: [String], ar: [String]}` | |
| `batteryStatus`, `guarantee` | `{en, ar}` | |
| `stock` | Number | inventory count, min 0 |
| `sale` | Number | units sold counter |
| `images` | [String] | Cloudinary URLs |
| `category` | ObjectId → Category | required |
| `brand` | ObjectId → Brand | required |
| `vendor` | ObjectId → Vendor | optional |

Virtual: `priceAfterDiscount = price - (price * discount / 100)`

---

### Order

| Field | Type | Notes |
|-------|------|-------|
| `user` | ObjectId → User | required |
| `shippingAddress` | Object | `{fullName, phone, governorate, city, street, notes}` |
| `paymentMethod` | String | `cod` \| `online` |
| `paymentStatus` | String | `pending` \| `paid` \| `refunded` |
| `orderStatus` | String | `pending` → `confirmed` → `processing` → `shipped` → `delivered` \| `cancelled` |
| `items` | [{product, quantity, price}] | price snapshot at checkout time |
| `subtotal` | Number | |
| `shippingFees` | Number | 100 EGP for online; 0 for COD |
| `totalAmount` | Number | |
| `stockDeducted` | Boolean | prevents double stock deduction |

---

### Cart

| Field | Type | Notes |
|-------|------|-------|
| `user` | ObjectId → User | required |
| `items` | [{product, quantity (min 1), price}] | price snapshotted at add time |
| `totalPrice` | Number | auto-computed in `pre('save')` hook |

---

### Other Models

| Model | Key Fields |
|-------|-----------|
| `Brand` | `name` (unique), `image` |
| `Category` | `name` (unique), `image` |
| `Vendor` | `name`, `phone`, `address`, `image`, `rating` (0–5) |
| `Wishlist` | `user`, `products[]` |
| `SiteReview` | `user`, `name`, `rating` (1–5), `comment` |
| `Visit` | `ip`, `userAgent`, `createdAt` |

---

## 🖼️ Image Uploads (Cloudinary)

Image uploads are handled server-side via `multer` + `multer-storage-cloudinary`:

- Files are streamed directly to Cloudinary — no local disk storage
- Allowed types: JPEG, PNG, WEBP
- Max size: **5 MB**
- Destination folder: configured via `CLOUDINARY_FOLDER` env var (default: `"my_app_uploads"`)
- Returns a Cloudinary CDN URL stored in the relevant model field

Currently used on: `PUT /admin/profile-picture`

---

## 🛠️ Tech Stack

| Category | Package | Version |
|----------|---------|---------|
| Web Framework | `express` | ^5.1.0 |
| Database ODM | `mongoose` | ^8.18.3 |
| Auth | `jsonwebtoken` + `bcryptjs` | ^9.0.2 / ^3.0.2 |
| Google OAuth | `google-auth-library` | ^10.5.0 |
| Payments | `stripe` | ^20.0.0 |
| Image Storage | `cloudinary` + `multer-storage-cloudinary` | ^1.41.3 / ^4.0.0 |
| File Upload | `multer` | ^2.0.2 |
| AI | `openai` | ^6.15.0 |
| Validation | `express-validator` | ^7.2.1 |
| API Docs | `swagger-jsdoc` + `swagger-ui-express` | ^6.2.8 / ^5.0.1 |
| Env Config | `dotenv` | ^17.2.3 |
| CORS | `cors` | ^2.8.5 |
| Dev server | `nodemon` | ^3.1.10 |

---

## ⚙️ Environment Variables

Copy `.env.example` to `.env` and fill in your values:

```bash
cp .env.example .env
```

| Variable | Description | Example |
|----------|-------------|---------|
| `PORT` | Server port | `3000` |
| `DATABASE_URL` | MongoDB Atlas connection string | `mongodb+srv://user:pass@cluster/db` |
| `JWT_SECRET` | Secret for signing JWTs | `a-long-random-string` |
| `swaggerURL` | Base URL for Swagger server definition | `http://localhost:3000` |
| `GOOGLE_CLIENT_ID` | Google OAuth 2.0 client ID | `xxxx.apps.googleusercontent.com` |
| `GOOGLE_CLIENT_SECRET` | Google OAuth 2.0 client secret | `GOCSPX-...` |
| `GOOGLE_REDIRECT_URI` | Google OAuth redirect URI | `http://localhost:3000/auth/google/callback` |
| `FRONTEND_URL` | Frontend base URL (used in Stripe redirects) | `http://localhost:5173` |
| `STRIPE_SECRET_KEY` | Stripe secret key | `sk_test_...` |
| `STRIPE_WEBHOOK_SECRET` | Stripe webhook signing secret | `whsec_...` |
| `CLOUDINARY_CLOUD_NAME` | Cloudinary cloud name | `my-cloud` |
| `CLOUDINARY_API_KEY` | Cloudinary API key | `123456789` |
| `CLOUDINARY_API_SECRET` | Cloudinary API secret | `abc-secret` |
| `CLOUDINARY_UPLOAD_PRESET` | Cloudinary upload preset (for frontend direct uploads) | `my_preset` |
| `OPENAI_API_KEY` | OpenAI API key (used for GPT-4o-mini + embeddings) | `sk-...` |

> ⚠️ Never commit `.env` to version control. It is already listed in `.gitignore`.

---

## 🚀 Local Setup

### Prerequisites

- Node.js v18 or newer
- A MongoDB Atlas cluster (or local `mongod`)
- Accounts and API keys for: OpenAI, Stripe, Cloudinary, Google OAuth

### 1. Install dependencies

```bash
cd server
npm install
```

### 2. Configure environment

```bash
cp .env.example .env
# Edit .env and fill in all required values
```

### 3. Start the server

```bash
# Development (auto-restart on file changes)
npm run dev

# Production
npm start
```

The server connects to MongoDB first, then starts listening:

```
Connected to MongoDB
Server running on port 3000
```

### 4. Explore the API

Open your browser at:

```
http://localhost:3000/api-docs
```

This loads the full interactive Swagger UI where you can try every endpoint.

---

## 📁 Project Structure

```
server/
│
├── app.js                      # App entry point
│
├── config/
│   ├── connectDB.js            # mongoose.connect()
│   ├── cloudinary.js           # Cloudinary SDK config + validation
│   └── stripeClient.js         # Lazy Stripe singleton
│
├── controllers/
│   ├── adminController.js      # User CRUD (admin), profile picture, AI chat
│   ├── aiController.js         # AI feature dispatcher (featureMap)
│   ├── brandController.js      # Brand CRUD
│   ├── cartController.js       # Cart operations + price snapshot
│   ├── categoryController.js   # Category CRUD
│   ├── dashboardController.js  # Analytics aggregation
│   ├── orderController.js      # Order lifecycle + stock management
│   ├── productController.js    # Bilingual product CRUD + pagination
│   ├── siteReviewController.js # Site reviews
│   ├── stripeController.js     # Checkout, verify-session, webhook
│   ├── userController.js       # Register, login, Google OAuth, profile
│   ├── vendorController.js     # Vendor CRUD
│   └── wishlistController.js   # Wishlist operations
│
├── features/
│   ├── chat.js                 # Shopping assistant (multi-turn, product suggestions)
│   ├── compare.js              # Product comparison with recommendation
│   ├── recommend.js            # Personalized recommendations
│   └── admin.js                # Business insights + full analytics AI
│
├── middleware/
│   ├── authenticatMiddle.js    # protect + admin guards
│   ├── upload.js               # Multer + Cloudinary storage
│   └── visitMiddleware.js      # Visit tracking (countVisit)
│
├── models/
│   ├── brandModel.js
│   ├── cartModel.js
│   ├── categoryModel.js
│   ├── orderModel.js
│   ├── productModel.js
│   ├── siteReviewModel.js
│   ├── userModel.js
│   ├── vendorModel.js
│   ├── visitModel.js
│   └── wishlistModel.js
│
├── routes/
│   ├── adminRoute.js
│   ├── aiRoutes.js
│   ├── brandRoute.js
│   ├── cartRoute.js
│   ├── categoryRoute.js
│   ├── configRoute.js
│   ├── dashboardRoutes.js
│   ├── orderRoute.js
│   ├── productRoute.js
│   ├── siteReviewRoutes.js
│   ├── stripeRoutes.js
│   ├── userRoute.js
│   ├── vendorRoute.js
│   ├── visitRoutes.js
│   └── wishlistRoute.js
│
├── services/
│   ├── ragService.js           # Hybrid RAG (embeddings + cosine similarity)
│   └── aiService.js            # GPT-4o-mini completion wrapper
│
├── utils/
│   └── aiClient.js             # Lazy OpenAI client singleton
│
├── .env.example                # Environment variable template
└── package.json
```
