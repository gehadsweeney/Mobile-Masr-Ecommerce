import React, { useEffect } from "react";
import "./Cart.css";
import { useDispatch, useSelector } from "react-redux";
import { fetchCart } from "../../store/slices/cartSlice";
import PagePath from "../../components/GlobalComponents/PagePath/PagePath";
import CartEmpty from "../../components/CartComponents/CartEmpty/CartEmpty";
import { Outlet } from "react-router-dom";
import CartNavbar from "../../components/CartComponents/CartNavbar/CartNavbar";
import { useTranslation } from "react-i18next";

const Cart = () => {
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const { items, totalPrice, loading, error } = useSelector(
    (state) => state.cart || {}
  );
  const currentLang = useSelector((state) => state.language.currentLang);
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (token) {
      dispatch(fetchCart(currentLang));
    }
  }, [dispatch, token, currentLang]);

  if (!token) {
    return (
      <div className="abd-Cart-Page container my-4">
        <PagePath path="Cart" />
        <p>{t("Please login to view your cart")}</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="abd-Cart-Page container my-4">
        <PagePath path="Cart" />
        <p>{t("Loading cart...")}</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="abd-Cart-Page container my-4">
        <PagePath path="Cart" />
        <p>Error: {error}</p>
      </div>
    );
  }

  if (!items || items.length === 0) {
    return (
      <div className="abd-Cart-Page container my-4">
        <PagePath path="Cart" />
        <CartEmpty />
      </div>
    );
  }

  return (
    <div className="abd-Cart-Page container my-4">
      <PagePath path={t("Cart")} />
      <CartNavbar />
      <Outlet context={{ items, totalPrice }} />
    </div>
  );
};

export default Cart;
