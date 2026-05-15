import React from "react";
import { Link } from "react-router";
import "./CartItemBox.css";
import CardFavoriteIcon from "../../GlobalComponents/Card/CardFavoriteIcon";
import CartItemPrice from "./CartItemPrice/CartItemPrice";
import CartItemAccessories from "./CartItemAccessories/CartItemAccessories";
import CartItemDelete from "./CartItemDelete/CartItemDelete";
import CartItemQuantity from "./CartItemQuantity/CartItemQuantity";
import { useTranslation } from "react-i18next";
function CartItemBox({ item }) {
  const { t } = useTranslation();
  console.log("cart item", item);

  return (
    <div className="abd-Cart-item my-3 p-3 border d-flex gap-3">
      {/* ===============item image container start================= */}
      <div className="abd-item-imageContainer py-5 center">
        {/* ------------cart-item-image------------- */}
        <Link to={`/products/${item.product?._id}`}>
          <img
            src={item.product?.images?.[0] || "/placeholder.png"}
            alt={item.product?.name || "Product"}
            className="abd-cartItemImage"
          />
        </Link>
        {/* ------------cart-item-condition------------- */}
        <div
          className={`abd-cartCondition ${
            item.product?.condition === "new" ? "bg-warning" : "bg-primary"
          }`}
        >
          {item.product?.condition}
        </div>
        {/* ------------cart-item-wishlist------------- */}
        <CardFavoriteIcon
          productId={item.product?._id}
          className="abd-cartFavoriteIcon"
        />
      </div>
      {/* ===============item image container end================= */}

      {/* ===============item details start================= */}
      <div className="abd-item-details">
        <h3 className="abd-cartItemName">
          {item.product?.name || t("Product")}
        </h3>
        <CartItemPrice item={item} />
        {/* <p>Quantity: {item.quantity}</p> */}
        <CartItemAccessories accessories={item.product?.accessories || []} />
      </div>
      {/* ===============item details end================= */}
      <div className="abd-item-actions ms-auto p-2 d-flex flex-column justify-content-between align-items-center">
        <CartItemQuantity
          quantity={item.quantity}
          productId={item.product?._id}
          stock={item.product?.stock}
        />
        <CartItemDelete productId={item.product?._id} />
      </div>
    </div>
  );
}

export default CartItemBox;
