import React from "react";
import "./OrderSummary.css";
import { useSelector } from "react-redux";
import { useTranslation } from "react-i18next";

function OrderSummary() {
  const { items, totalPrice } = useSelector((state) => state.cart);
  const shippingFees = 100;
  const finalTotal = totalPrice + shippingFees;
  const { t } = useTranslation();
  // Format number with comma separator
  const formatPrice = (price) => {
    return price.toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  };

  return (
    <div className="abd-order-summary pt-4">
      <h3 className="mb-4">{t("Your Order")}</h3>

      {/* =================Cart Items==================== */}
      <div className="abd-order-items mb-4">
        {items && items.length > 0 ? (
          items.map((item) => (
            <div key={item.product?._id} className="abd-order-item">
              <div className="abd-order-item-info">
                <img
                  src={item.product?.images?.[0]}
                  alt={item.product?.name}
                  className="abd-order-item-img"
                />
                <div className="abd-order-item-details">
                  <h6 className="abd-order-item-name">{item.product?.name}</h6>
                  <p className="abd-order-item-quantity">
                    {t("Quantity")}: {item.quantity}
                  </p>
                </div>
              </div>
              <div className="abd-order-item-price">
                {formatPrice(item.price * item.quantity)} {t("EGP")}
              </div>
            </div>
          ))
        ) : (
          <p className="text-muted">{t("No items in cart")}</p>
        )}
      </div>

      {/* ===================== Price Summary ==================== */}
      <div className="abd-order-summary-details">
        <div className="abd-summary-row">
          <span>{t("Subtotal")}:</span>
          <span>
            {formatPrice(totalPrice || 0)} {t("EGP")}
          </span>
        </div>
        <div className="abd-summary-row">
          <span>{t("Shipping Fees")}:</span>
          <span>
            {formatPrice(shippingFees)} {t("EGP")}
          </span>
        </div>
        <div className="abd-summary-row abd-summary-total">
          <span>{t("Total")}:</span>
          <span>
            {formatPrice(finalTotal)} {t("EGP")}
          </span>
        </div>
      </div>
    </div>
  );
}

export default OrderSummary;
