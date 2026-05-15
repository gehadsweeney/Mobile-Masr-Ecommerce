import React from "react";
import "./CartItemDelete.css";
import { MdDeleteOutline } from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";
import { removeFromCart, fetchCart } from "../../../../store/slices/cartSlice";
import { logout } from "../../../../store/slices/usersSlice";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";

function CartItemDelete({ productId }) {
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const currentLang = useSelector((state) => state.language.currentLang);

  const handleDelete = async () => {
    try {
      await dispatch(removeFromCart({ productId })).unwrap();
      await dispatch(fetchCart(currentLang));
      toast.success(t("Item removed from cart"));
    } catch (err) {
      const msg = typeof err === "string" ? err : err?.message;
      if (
        msg?.toLowerCase().includes("unauth") ||
        msg?.toLowerCase().includes("not authorized") ||
        msg?.toLowerCase().includes("unauthorized")
      ) {
        dispatch(logout());
        toast.error(
          t("Unauthorized. You have been logged out. Please login again.")
        );
      } else {
        toast.error(msg || t("Failed to remove item"));
      }
    }
  };

  return (
    <div
      className="abd-itemDelete center"
      title="Delete Item"
      onClick={handleDelete}
    >
      <MdDeleteOutline size={24} style={{ cursor: "pointer" }} />
    </div>
  );
}

export default CartItemDelete;
