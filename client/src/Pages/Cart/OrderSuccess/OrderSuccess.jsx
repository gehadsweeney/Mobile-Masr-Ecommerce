import React, { useEffect, useState } from "react";
import "./OrderSuccess.css";
import { useNavigate, useSearchParams } from "react-router-dom";
import { FaCheckCircle } from "react-icons/fa";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";

function OrderSuccess() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [orderDetails, setOrderDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { t } = useTranslation();
  const currentLang = useSelector((state) => state.language.currentLang);

  const sessionId = searchParams.get("session_id");

  useEffect(() => {
    // If there's a session_id, verify the payment with Stripe
    if (sessionId) {
      verifyStripePayment();
    } else {
      // Cash on delivery - no verification needed
      setLoading(false);
    }
  }, [sessionId]);

  const verifyStripePayment = async () => {
    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/stripe/verify-session?session_id=${sessionId}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        },
      );

      const data = await res.json();

      if (res.ok) {
        setOrderDetails(data.order);
      } else {
        setError(data.message || "Payment verification failed");
      }
    } catch (err) {
      console.error("Error verifying payment:", err);
      setError("Failed to verify payment");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div
        className="abd-order-success-container"
        dir={currentLang === "ar" ? "rtl" : "ltr"}
      >
        <div className="abd-loading">{t("Verifying your payment...")}</div>
      </div>
    );
  }

  if (error) {
    return (
      <div
        className="abd-order-success-container"
        dir={currentLang === "ar" ? "rtl" : "ltr"}
      >
        <div className="abd-error-box">
          <h2>{t("Payment Verification Failed")}</h2>
          <p>{error}</p>
          <button
            className="btn btn-primary mt-3"
            onClick={() => navigate("/cart/checkout")}
          >
            {t("Return to Checkout")}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      className="abd-order-success-container"
      dir={currentLang === "ar" ? "rtl" : "ltr"}
    >
      <div className="abd-success-card">
        <FaCheckCircle className="abd-success-icon" />
        <h1>{t("Order Placed Successfully!")}</h1>
        <p className="abd-success-message">
          {t(
            "Thank you for your order. We'll send you a confirmation email shortly.",
          )}
        </p>

        {orderDetails && (
          <div className="abd-order-details mt-4">
            <h3>{t("Order Details")}</h3>
            <div className="abd-detail-row">
              <span>{t("Order ID")}:</span>
              <span className="abd-detail-value">{orderDetails._id}</span>
            </div>
            <div className="abd-detail-row">
              <span>{t("Total Amount")}:</span>
              <span className="abd-detail-value">
                {orderDetails.totalAmount?.toFixed(2)} {t("EGP")}
              </span>
            </div>
            <div className="abd-detail-row">
              <span>{t("Payment Status")}:</span>
              <span className="abd-badge abd-badge-success">
                {orderDetails.paymentStatus}
              </span>
            </div>
            <div className="abd-detail-row">
              <span>{t("Order Status")}:</span>
              <span className="abd-badge abd-badge-info">
                {orderDetails.orderStatus}
              </span>
            </div>
          </div>
        )}

        <div className="abd-success-actions mt-4">
          <button
            className="btn btn-primary me-3"
            onClick={() => navigate("/profile/orders")}
          >
            {t("View My Orders")}
          </button>
          <button
            className="btn btn-outline-secondary"
            onClick={() => navigate("/")}
          >
            {t("Continue Shopping")}
          </button>
        </div>
      </div>
    </div>
  );
}

export default OrderSuccess;
