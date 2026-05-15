import React from "react";
import "./CartNavbar.css";
import { useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";

function CartNavbar() {
  const location = useLocation();
  const currentPath = location.pathname;
  const { t } = useTranslation();
  const currentLang = useSelector((state) => state.language.currentLang);

  return (
    <div
      className="abd-CartNavbar d-flex align-items-center justify-content-evenly gap-3 gap-md-4 my-4"
      dir={currentLang === "ar" ? "rtl" : "ltr"}
    >
      <div
        className={`abd-cart-link ${currentPath === "/cart" ? "active" : ""}`}
      >
        1. {t("Shopping Cart")}
      </div>
      <div
        className={`abd-cart-link ${
          currentPath === "/cart/checkout" ? "active" : ""
        }`}
      >
        2. {t("Checkout")}
      </div>
      <div
        className={`abd-cart-link ${
          currentPath === "/cart/order-success" ? "active" : ""
        }`}
      >
        3. {t("Order Success")}
      </div>
    </div>
  );
}

export default CartNavbar;
