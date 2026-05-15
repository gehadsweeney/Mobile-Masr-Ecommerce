# 📱 Mobil Masr - E-Commerce Backend

<div align="center">

![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![Express.js](https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-47A248?style=for-the-badge&logo=mongodb&logoColor=white)
![Stripe](https://img.shields.io/badge/Stripe-626CD9?style=for-the-badge&logo=Stripe&logoColor=white)
![OpenAI](https://img.shields.io/badge/OpenAI-412991?style=for-the-badge&logo=openai&logoColor=white)

**A full-featured RESTful API for a mobile phones and electronics e-commerce platform**

</div>

---

## 👥 Team Members

- Abdullah
- Mostafa
- Ghehad
- Rehab
- Heba

---

## 📌 About the Project

**Mobil Masr** is a comprehensive e-commerce backend solution for selling mobile phones and electronics in Egypt. Built with Node.js and Express.js, this API provides all the necessary endpoints to power a modern online store with AI-powered features.

### 🌟 Key Features

- **🛒 Complete E-Commerce Flow** - Products, Cart, Wishlist, Orders
- **🤖 AI-Powered Assistant** - Smart product recommendations using OpenAI GPT-4
- **💳 Payment Integration** - Secure payments via Stripe (Online & COD)
- **👤 User Management** - Authentication, Google OAuth, Role-based access
- **🏪 Multi-Vendor Support** - Vendors can list and manage their products
- **📊 Admin Dashboard** - Analytics, Revenue tracking, User management
- **🌐 Bilingual Support** - Arabic & English content for products
- **📷 Cloud Storage** - Image uploads via Cloudinary
- **📄 API Documentation** - Swagger UI integration

---

## 🏗️ Project Structure

```
├── app.js                 # Application entry point
├── config/
│   ├── cloudinary.js      # Cloudinary configuration
│   ├── connectDB.js       # MongoDB connection
│   └── stripeClient.js    # Stripe configuration
├── controllers/           # Request handlers
│   ├── productController.js
│   ├── userController.js
│   ├── orderController.js
│   ├── cartController.js
│   ├── aiController.js
│   └── ...
├── models/                # MongoDB schemas
│   ├── productModel.js
│   ├── userModel.js
│   ├── orderModel.js
│   └── ...
├── routes/                # API routes
├── middleware/            # Custom middleware
├── services/              # Business logic
│   ├── aiService.js       # OpenAI integration
│   └── ragService.js      # RAG for recommendations
├── features/              # Feature modules
│   ├── recommend.js       # AI recommendations
│   ├── compare.js         # Product comparison
│   └── chat.js            # AI chat assistant
└── utils/                 # Utility functions
```

---

## 🚀 API Endpoints

### 🔐 Authentication

| Method | Endpoint                | Description            |
| ------ | ----------------------- | ---------------------- |
| POST   | `/auth/register`        | Register new user      |
| POST   | `/auth/login`           | User login             |
| POST   | `/auth/google`          | Google OAuth login     |
| POST   | `/auth/forgot-password` | Password reset request |

### 📦 Products

| Method | Endpoint        | Description                   |
| ------ | --------------- | ----------------------------- |
| GET    | `/products`     | Get all products              |
| GET    | `/products/:id` | Get product by ID             |
| POST   | `/products`     | Create product (Vendor/Admin) |
| PUT    | `/products/:id` | Update product                |
| DELETE | `/products/:id` | Delete product                |

### 🛒 Cart & Wishlist

| Method | Endpoint           | Description           |
| ------ | ------------------ | --------------------- |
| GET    | `/cart`            | Get user's cart       |
| POST   | `/cart/add`        | Add item to cart      |
| DELETE | `/cart/remove/:id` | Remove item from cart |
| GET    | `/wishlist`        | Get user's wishlist   |
| POST   | `/wishlist/add`    | Add to wishlist       |

### 📋 Orders

| Method | Endpoint             | Description                 |
| ------ | -------------------- | --------------------------- |
| GET    | `/orders`            | Get user's orders           |
| POST   | `/orders`            | Create new order            |
| PUT    | `/orders/:id/status` | Update order status (Admin) |

### 💳 Payments

| Method | Endpoint                  | Description                    |
| ------ | ------------------------- | ------------------------------ |
| POST   | `/stripe/create-checkout` | Create Stripe checkout session |
| POST   | `/stripe/webhook`         | Stripe webhook handler         |

### 🤖 AI Features

| Method | Endpoint        | Description                    |
| ------ | --------------- | ------------------------------ |
| POST   | `/ai/chat`      | Chat with AI assistant         |
| POST   | `/ai/recommend` | Get AI product recommendations |
| POST   | `/ai/compare`   | Compare products with AI       |

### 📊 Dashboard (Admin)

| Method | Endpoint               | Description          |
| ------ | ---------------------- | -------------------- |
| GET    | `/dashboard/overview`  | Dashboard statistics |
| GET    | `/dashboard/analytics` | Sales analytics      |

---

## 🔧 Tech Stack

| Category           | Technology                  |
| ------------------ | --------------------------- |
| **Runtime**        | Node.js                     |
| **Framework**      | Express.js 5                |
| **Database**       | MongoDB + Mongoose          |
| **Authentication** | JWT + bcrypt + Google OAuth |
| **Payments**       | Stripe                      |
| **AI/ML**          | OpenAI GPT-4                |
| **File Upload**    | Multer + Cloudinary         |
| **Validation**     | Express Validator           |
| **Documentation**  | Swagger UI                  |

---

## ⚙️ Installation & Setup

### Prerequisites

- Node.js (v18+)
- MongoDB
- Stripe Account
- Cloudinary Account
- OpenAI API Key

### 1. Clone the repository

```bash
git clone https://github.com/Abdullah-Nasr10/Backend-MobileMasr.git
cd Backend-MobileMasr
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

Create a `.env` file in the root directory:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string

# JWT
JWT_SECRET=your_jwt_secret

# Cloudinary
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Stripe
STRIPE_SECRET_KEY=your_stripe_secret_key
STRIPE_WEBHOOK_SECRET=your_webhook_secret

# OpenAI
OPENAI_API_KEY=your_openai_api_key

# Google OAuth
GOOGLE_CLIENT_ID=your_google_client_id

# Swagger
swaggerURL=http://localhost:5000
```

### 4. Start the server

```bash
# Development
npm run dev

# Production
npm start
```

### 5. Access API Documentation

Open your browser and navigate to:

```
http://localhost:5000/api-docs
```

---

## 🤖 AI Features Explained

### Smart Product Recommendations

The system uses **RAG (Retrieval-Augmented Generation)** to provide personalized product recommendations based on:

- User's purchase history
- Current cart items
- Product specifications and prices
- User's budget preferences

### AI Chat Assistant

An intelligent chatbot that can:

- Answer questions about products
- Help users find the right phone/laptop
- Provide comparisons between products
- Assist with order-related queries

---

## 📱 Product Schema Highlights

- **Bilingual Support**: Product names, descriptions in Arabic & English
- **Detailed Specs**: RAM, Storage, Processor, GPU, Camera, Battery
- **Pricing**: Original price, discount percentage, calculated final price
- **Condition**: New or Used products
- **Warranty**: Guarantee information

---

## 🔒 Security Features

- JWT-based authentication
- Password hashing with bcrypt
- Role-based access control (User, Vendor, Admin)
- Secure payment processing via Stripe
- Input validation and sanitization

---

## 📄 License

This project is part of the MEARN Track graduation project.

---

<div align="center">

**Made with ❤️ by the Mobil Masr Team**

</div>
