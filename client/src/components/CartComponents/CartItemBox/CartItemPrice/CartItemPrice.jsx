import React from "react";
import "./CartItemPrice.css";
import { useTranslation } from "react-i18next";

function CartItemPrice({ item }) {
  const { t } = useTranslation();
  // Prefer product fields when available (populated product)
  const basePrice = item?.product?.price ?? item.price ?? 0;
  const discount = item?.product?.discount ?? 0; // backend must populate discount
  const discountedPrice = basePrice - (basePrice * discount) / 100;
  const fmt = (n) =>
    new Intl.NumberFormat("en-EG", { maximumFractionDigits: 0 }).format(
      Math.round(n)
    );

  return (
    <div className="abd-CartItemPrice">
      {/* =====================Product-Price-After-Discount=================== */}
      <div className="d-flex align-items-baseline flex-wrap gap-3">
        <div
          className="abd-CartPriceDisc"
          style={
            discount > 0
              ? {
                  color: "var(--red-color)",
                  // backgroundColor: "var(--red-color-light)",
                }
              : {}
          }
        >
          {fmt(discountedPrice)} {t("EGP")}
        </div>
        {/* =====================Product-Price-Original=================== */}
        {discount > 0 && (
          <div className="abd-CartPriceOriginal text-muted text-decoration-line-through">
            {fmt(basePrice)} {t("EGP")}
          </div>
        )}
      </div>
      {/* =====================Product-Subtotal=================== */}
      <div className="abd-CartPriceSubtotal">
        {t("Subtotal")}: {fmt(discountedPrice * (item.quantity || 1))}{" "}
        {t("EGP")}
      </div>
    </div>
  );
}

export default CartItemPrice;
