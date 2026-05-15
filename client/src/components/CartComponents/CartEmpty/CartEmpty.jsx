import React from "react";
import "./CartEmpty.css";
import { useTranslation } from "react-i18next";
function CartEmpty() {
  const { t } = useTranslation();
  return (
    <div className="container d-flex flex-column justify-content-center align-items-center abd-CartEmpty my-5">
      <img
        src="https://res.cloudinary.com/dj1omur11/image/upload/v1764541617/CartEmpty_w8xrvv.jpg"
        alt="Empty Cart"
        className="abd-CartEmpty-Image mb-4"
      />
      <div className="abd-CartEmpty-Text fw-bold">
        {t("Your cart is empty")}
      </div>
    </div>
  );
}

export default CartEmpty;
