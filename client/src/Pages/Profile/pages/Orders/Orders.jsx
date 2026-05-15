import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchOrders } from "../../../../store/slices/orderSlice";
import "./Orders.css";
import { useTranslation } from "react-i18next";

const Orders = () => {
  const dispatch = useDispatch();
  const { orders, loading, error } = useSelector((state) => state.order);
  const currentLang = useSelector((state) => state.language.currentLang);

  const { t } = useTranslation();
  useEffect(() => {
    dispatch(fetchOrders(currentLang));
  }, [dispatch, currentLang]);

  const formatPrice = (price) => {
    return price.toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const getStatusBadgeClass = (status) => {
    const statusClasses = {
      pending: "badge-warning",
      confirmed: "badge-info",
      processing: "badge-primary",
      shipped: "badge-success",
      delivered: "badge-success",
      cancelled: "badge-danger",
    };
    return statusClasses[status] || "badge-secondary";
  };

  const getPaymentStatusBadgeClass = (status) => {
    const statusClasses = {
      pending: "badge-warning",
      paid: "badge-success",
      failed: "badge-danger",
      refunded: "badge-info",
    };
    return statusClasses[status] || "badge-secondary";
  };

  if (loading) {
    return (
      <div className="abd-orders-container">
        <h2 className="abd-orders-title">{t("My Purchases")}</h2>
        <div className="abd-loading-spinner">{t("Loading your orders...")}</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="abd-orders-container">
        <h2 className="abd-orders-title">{t("My Purchases")}</h2>
        <div className="abd-error-message">
          <p>
            {t("Error loading orders")}: {error}
          </p>
        </div>
      </div>
    );
  }

  if (!orders || orders.length === 0) {
    return (
      <div className="abd-orders-container">
        <h2 className="abd-orders-title">{t("My Purchases")}</h2>
        <div className="abd-empty-orders">
          <p>{t("You haven't placed any orders yet.")}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="abd-orders-container">
      <h2 className="abd-orders-title">{t("My Purchases")}</h2>

      <div className="abd-orders-list">
        {orders.map((order) => (
          <div key={order._id} className="abd-order-card">
            <div className="abd-order-header">
              <div className="abd-order-info">
                <span className="abd-order-id">
                  {t("Order")} #{order._id.slice(-8)}
                </span>
                <span className="abd-order-date">
                  {formatDate(order.createdAt)}
                </span>
              </div>
              <div className="abd-order-badges">
                <span
                  className={`abd-badge ${getStatusBadgeClass(
                    order.orderStatus
                  )}`}
                >
                  {order.orderStatus}
                </span>
                <span
                  className={`abd-badge ${getPaymentStatusBadgeClass(
                    order.paymentStatus
                  )}`}
                >
                  {order.paymentStatus}
                </span>
              </div>
            </div>

            <div className="abd-order-items">
              {order.items &&
                order.items.map((item, index) => (
                  <div key={index} className="abd-order-item">
                    <div className="abd-item-details">
                      <span className="abd-item-name">
                        {item.product?.name || "Product"}
                      </span>
                      <span className="abd-item-quantity">
                        {t("Qty")}: {item.quantity}
                      </span>
                    </div>
                    <span className="abd-item-price">
                      {formatPrice(item.price * item.quantity)} {t("EGP")}
                    </span>
                  </div>
                ))}
            </div>

            <div className="abd-order-summary">
              <div className="abd-summary-row">
                <span>{t("Subtotal")}:</span>
                <span>
                  {formatPrice(order.subtotal || 0)} {t("EGP")}
                </span>
              </div>
              <div className="abd-summary-row">
                <span>{t("Shipping")}:</span>
                <span>
                  {formatPrice(order.shippingFees || 0)} {t("EGP")}
                </span>
              </div>
              <div className="abd-summary-row abd-summary-total">
                <span>{t("Total")}:</span>
                <span>
                  {formatPrice(order.totalAmount || 0)} {t("EGP")}
                </span>
              </div>
            </div>

            <div className="abd-order-shipping">
              <h4>{t("Shipping Address")}</h4>
              <p>
                {order.shippingAddress?.fullName}
                <br />
                {order.shippingAddress?.phone}
                <br />
                {order.shippingAddress?.street}, {order.shippingAddress?.city}
                <br />
                {order.shippingAddress?.governorate}
                {order.shippingAddress?.notes && (
                  <>
                    <br />
                    <span className="abd-notes">
                      {t("Notes")}: {order.shippingAddress.notes}
                    </span>
                  </>
                )}
              </p>
            </div>

            <div className="abd-order-payment">
              <span className="abd-payment-method">
                {t("Payment")}:{" "}
                {order.paymentMethod === "cod"
                  ? t("Cash on Delivery")
                  : t("Card Payment")}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Orders;
