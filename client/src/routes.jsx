import { createBrowserRouter } from "react-router-dom";
import Layout from "./components/Layout/Layout";

// ===== Pages =====
import Home from "./Pages/Home/Home";
import About from "./Pages/About/About";
import Contact from "./Pages/Contact/Contact";

// -----------------------------------------

import Category from "./Pages/Category/Category";
import ProductDetails from "./Pages/ProductDetails/ProductDetails";
// -----------------------------------------

// -----------------------------------------

import Login from "./Pages/Auth/Login/Login";
import Register from "./Pages/Auth/Register/Register";
import Profile from "./Pages/Profile/Profile";
import Wishlist from "./Pages/Profile/pages/Favorites/Favorites";

// Profile sub-pages
import AccountInfo from "./Pages/Profile/pages/AccountInfo/AccountInfo";
import EditAccount from "./Pages/Profile/pages/EditAccount/EditAccount";
import ChangePassword from "./Pages/Profile/pages/ChangePassword/ChangePassword";
import Favorites from "./Pages/Profile/pages/Favorites/Favorites";
import ProfileOrders from "./Pages/Profile/pages/Orders/Orders";
import Refunds from "./Pages/Profile/pages/Refunds/Refunds";
import Addresses from "./Pages/Profile/pages/Addresses/Addresses";
import Ads from "./Pages/Profile/pages/Ads/Ads";
import Notifications from "./Pages/Profile/pages/Notifications/Notifications";
// -----------------------------------------

import Cart from "./Pages/Cart/Cart";
import ShoppingCart from "./Pages/Cart/ShoppingCart/ShoppingCart";
import Checkout from "./Pages/Cart/Checkout/Checkout";
import OrderSuccess from "./Pages/Cart/OrderSuccess/OrderSuccess";
// -----------------------------------------

import NotFoundPage from "./Pages/NotFoundPage/NotFoundPage";
import NotFoundProduct from "./Pages/NotFoundProduct/NotFoundProduct";
import Categories from "./Pages/Categories/Categories";
import Vendor from "./Pages/Vendor/Vendor";
import Comparison from "./Pages/Comparison/Comparison";
import ProtectRoute from "./Pages/ProtectRoute/ProtectRoute";

// -----------------------------------------

// ===== Router Config =====
const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      // ==== Public routes ====
      { path: "/", element: <Home /> },
      { path: "/about", element: <About /> },
      { path: "/contact", element: <Contact /> },

      { path: "category/:category/:compare?", element: <Category /> },
      { path: "/categories/:compare?", element: <Categories /> },
      { path: "/products/:id", element: <ProductDetails /> },
      { path: "/vendor/:id", element: <Vendor /> },
      { path: "/comparison", element: <Comparison /> },

      { path: "/login", element: <Login /> },
      { path: "/register", element: <Register /> },

      { path: "/not-found-product", element: <NotFoundProduct /> },

      // ===== Protected routes group =====
      {
        element: <ProtectRoute />,
        children: [
          {
            path: "/profile",
            element: <Profile />,
            children: [
              { path: "", element: <AccountInfo /> },
              { path: "account", element: <AccountInfo /> },
              { path: "edit-account", element: <EditAccount /> },
              { path: "change-password", element: <ChangePassword /> },
              { path: "favorites", element: <Favorites /> },
              { path: "orders", element: <ProfileOrders /> },
              { path: "refunds", element: <Refunds /> },
              { path: "addresses", element: <Addresses /> },
              { path: "ads", element: <Ads /> },
              { path: "notifications", element: <Notifications /> },
            ],
          },
          { path: "/wishlist", element: <Wishlist /> },
          {
            path: "/cart",
            element: <Cart />,
            children: [
              { path: "", element: <ShoppingCart /> },
              { path: "checkout", element: <Checkout /> },
              { path: "order-success", element: <OrderSuccess /> },
            ],
          },
        ],
      },

      // ==== 404 ====
      { path: "*", element: <NotFoundPage /> },
    ],
  },
]);

export default router;
