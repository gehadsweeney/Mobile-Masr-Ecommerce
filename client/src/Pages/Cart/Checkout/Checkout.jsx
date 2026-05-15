import React from "react";
import "./Checkout.css";
import BillingDetailsForm from "../../../components/CartComponents/CheckoutComponents/BillingDetailsForm/BillingDetailsForm";
import OrderSummary from "../../../components/CartComponents/CheckoutComponents/OrderSummary/OrderSummary";
import { useSelector } from "react-redux";
function Checkout() {
  const currentLang = useSelector((state) => state.language.currentLang);

  return (
    <div
      className="row row-cols-1 row-cols-md-2 "
      dir={currentLang === "ar" ? "rtl" : "ltr"}
    >
      {/* =========user details form=========   */}
      <div className="col">
        <BillingDetailsForm />
      </div>
      {/* =========order summary=========   */}
      <div className="col">
        <OrderSummary />
      </div>
    </div>
  );
}

export default Checkout;
