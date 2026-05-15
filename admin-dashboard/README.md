# 📊 Mobil Masr - Admin Dashboard

<div align="center">

![Angular](https://img.shields.io/badge/Angular-20DD4A?style=for-the-badge&logo=angular&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![Bootstrap](https://img.shields.io/badge/Bootstrap-7952B3?style=for-the-badge&logo=bootstrap&logoColor=white)
![Chart.js](https://img.shields.io/badge/Chart.js-FF6384?style=for-the-badge&logo=chartdotjs&logoColor=white)
![ngx-toastr](https://img.shields.io/badge/ngx--toastr-FFB000?style=for-the-badge)

**An Angular admin panel for managing the Mobil Masr e-commerce platform**

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

**Mobil Masr Admin Dashboard** is the control panel that powers the platform’s operations. It provides administrators with tools to monitor sales performance, manage products and catalog data, review orders, handle users and vendors, and access AI-assisted admin utilities.

The dashboard is built with Angular 20 and connects directly to the backend API through the shared `apiUrl` environment setting. Admin access is protected with a child-route guard, and authentication relies on the token stored in `localStorage` after login.

### 🌟 Key Features

- **🔐 Secure Admin Login** - Admin-only access with route protection.
- **📈 Dashboard Analytics** - Revenue, orders, users, visitors, carts, and sales summaries.
- **🛍️ Product Management** - Add, edit, delete, and inspect product details.
- **📦 Order Management** - Browse orders and open full order details.
- **👤 User Management** - Review registered users and their account data.
- **🏪 Vendor Management** - Add and maintain vendor records.
- **🏷️ Catalog Management** - Manage categories and brands.
- **⭐ Reviews Moderation** - Inspect platform reviews from the admin side.
- **🤖 AI Admin Tools** - AI chat/analytics utilities for smarter administration.
- **⚙️ Admin Settings** - Centralized configuration screen for the dashboard.
- **🧭 Responsive Layout** - Sidebar-based admin shell that adapts to different screens.
- **🔔 Toast Feedback** - User actions and guard errors are surfaced through notifications.

---

## 🧱 Project Structure

```
├── src/
│   ├── app/
│   │   ├── Components/
│   │   │   ├── DashboardComponents/     # Dashboard overview and KPI cards
│   │   │   ├── ProductComponents/       # Product list, add/edit form, details
│   │   │   ├── OrderComponents/         # Orders list and order details
│   │   │   ├── UserComponents/          # Users administration views
│   │   │   ├── VendorComponents/        # Vendors list and vendor form
│   │   │   ├── CategoryComponents/      # Categories management
│   │   │   ├── BrandComponents/         # Brands management
│   │   │   ├── ReviewComponents/        # Reviews management
│   │   │   ├── NavbarComponents/        # Top navigation controls
│   │   │   ├── SidebarComponents/       # Admin navigation sidebar
│   │   │   ├── layout/                  # Main admin shell layout
│   │   │   ├── login/                   # Login page
│   │   │   ├── admin-aicomponents/      # AI admin tools
│   │   │   ├── admin-settings/          # Dashboard settings
│   │   │   ├── loader/                  # Loading state UI
│   │   │   └── not-found/               # 404 screen
│   │   ├── Services/                    # API service layer
│   │   ├── Models/                      # Shared TypeScript interfaces
│   │   ├── guards/                      # Route guards
│   │   ├── app.routes.ts                # Application routing
│   │   ├── app.config.ts                # App-wide providers
│   │   └── app.ts                       # Root component
│   └── environments/
│       ├── environment.ts
│       └── environment.development.ts
├── angular.json
├── package.json
└── README.md
```

---

## 🧭 Application Routes

### Public Routes

| Path     | Description      |
| -------- | ---------------- |
| `/login` | Admin login page |
| `**`     | Not found page   |

### Protected Admin Routes

| Path                          | Description                      |
| ----------------------------- | -------------------------------- |
| `/admin/dashboard`            | Main analytics overview          |
| `/admin/products`             | Products list                    |
| `/admin/products/add`         | Add product form                 |
| `/admin/products/edit/:id`    | Edit product form                |
| `/admin/products/details/:id` | Product details page             |
| `/admin/orders`               | Orders list                      |
| `/admin/orders/:id`           | Order details page               |
| `/admin/users`                | Users management                 |
| `/admin/vendors`              | Vendors management               |
| `/admin/vendors/add`          | Add vendor form                  |
| `/admin/vendors/edit/:id`     | Edit vendor form                 |
| `/admin/categories`           | Categories management            |
| `/admin/categories/add`       | Add category form                |
| `/admin/brands`               | Brands management                |
| `/admin/brands/add`           | Add brand form                   |
| `/admin/brands/edit/:id`      | Edit brand form                  |
| `/admin/reviews`              | Reviews moderation               |
| `/admin/ai-chat`              | AI analytics and assistant tools |
| `/admin/settings`             | Admin settings                   |

---

## 🛠️ Tech Stack

| Category      | Technology                                    |
| ------------- | --------------------------------------------- |
| Runtime       | Node.js                                       |
| Framework     | Angular 20                                    |
| Language      | TypeScript                                    |
| UI            | Bootstrap 5                                   |
| Charts        | Chart.js + ng2-charts                         |
| Notifications | ngx-toastr                                    |
| HTTP          | Angular HttpClient                            |
| State/Forms   | Angular reactive and template-driven patterns |
| Routing       | Angular Router + route guards                 |

---

## ⚙️ Setup & Installation

### Prerequisites

- Node.js v18 or newer
- Angular CLI installed globally if you prefer CLI commands outside `npm scripts`
- The Mobil Masr backend running locally or deployed and reachable through the configured API URL

### 1. Install dependencies

```bash
npm install
```

### 2. Configure the API URL

The dashboard points to the backend through the environment files:

```ts
apiUrl: 'http://localhost:3000';
```

If your backend runs on another port or domain, update both:

- `src/environments/environment.ts`
- `src/environments/environment.development.ts`

### 3. Start the development server

```bash
npm start
```

Then open:

```bash
http://localhost:4200/
```

### 4. Build for production

```bash
npm run build
```

### 5. Run tests

```bash
npm test
```

---

## 🔐 Authentication Flow

1. The admin enters credentials on the login page.
2. The app sends the credentials to the backend login endpoint.
3. The returned token is stored in `localStorage`.
4. The `adminGuard` checks the decoded token payload before allowing access to admin routes.
5. Non-admin users are redirected to `/login` and receive an access-denied toast message.

---

## 📈 Dashboard Highlights

The main dashboard page is designed to give admins a fast operational snapshot:

- Revenue and order KPIs
- Total users and active carts
- Website visits and today’s sales
- Sales overview charts with daily and weekly filters
- Orders summary visualization
- Recent orders table with direct actions
- Best-selling products panel
- Low-stock alerts and out-of-stock monitoring
- Quick access to restock and product detail views

---

## 🔧 API Integration Notes

The dashboard communicates with backend endpoints for:

- Authentication and profile lookup
- Dashboard overview statistics
- Products, orders, users, vendors, categories, and brands management
- Reviews moderation
- AI-assisted admin tools

Most requests attach the bearer token from `localStorage` when available, so the admin session depends on the backend accepting that token.

---

## 🧩 Code Scaffolding

Angular CLI commands that are useful while extending the dashboard:

```bash
ng generate component component-name
ng generate service service-name
ng generate guard guard-name
```

For more schematics:

```bash
ng generate --help
```

---

## 📚 Notes

This dashboard is intended to be used alongside the Mobil Masr client and server applications. For the full system, make sure the backend is running before testing login, analytics, or any management screens.

If you want, I can also add a short “How to run the full project” section in the repo root README that links the client, server, and admin dashboard together.
