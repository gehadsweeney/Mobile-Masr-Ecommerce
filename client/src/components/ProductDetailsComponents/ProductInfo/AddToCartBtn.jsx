import React from "react";
import "./ProductInfo.css";
import { useDispatch, useSelector } from "react-redux";
import { addToCart, fetchCart } from "../../../store/slices/cartSlice";
import { logout } from "../../../store/slices/usersSlice";
import { AiOutlineShoppingCart as Cart } from "react-icons/ai";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";

// Pass the whole `product` to avoid extra lookups
function AddToCartBtn({ product }) {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { loading, items } = useSelector(
    (state) => state.cart || { loading: false, items: [] }
  );
  const currentLang = useSelector((state) => state.language.currentLang);

  const handleAdd = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      toast.error(t("Please login first to add to cart"));
      return;
    }
    // Stock guard: current quantity in cart + 1 must not exceed product.stock
    const productId = product?.id || product?._id;
    const existingItem = items?.find(
      (i) => (i.product?._id || i.product) === productId
    );
    const currentQty = existingItem?.quantity || 0;
    const availableStock = product?.stock;
    if (typeof availableStock === "number" && currentQty + 1 > availableStock) {
      toast.error(t("Out of stock: quantity exceeds available stock"));
      return;
    }
    try {
      await dispatch(addToCart({ productId, quantity: 1 })).unwrap();
      await dispatch(fetchCart(currentLang));
      toast.success(t("Added to cart successfully"));
    } catch (err) {
      const msg = typeof err === "string" ? err : err?.message;
      if (msg?.toLowerCase().includes("not authorized")) {
        dispatch(logout());
        toast.error(
          t("Not authorized. You have been logged out. Please login again.")
        );
      } else {
        toast.error(msg || t("Failed to add to cart"));
      }
    }
  };

  const isOutOfStock = typeof product?.stock === "number" && product.stock <= 0;
  return (
    <button
      className="abd-InfoAddToCartBtn w-100 center gap-3 "
      onClick={handleAdd}
      disabled={loading || isOutOfStock}
    >
      <Cart size={20} />{" "}
      {isOutOfStock
        ? t("Out of Stock")
        : loading
        ? t("Adding...")
        : t("Add to Cart")}
    </button>
  );
}

export default AddToCartBtn;
