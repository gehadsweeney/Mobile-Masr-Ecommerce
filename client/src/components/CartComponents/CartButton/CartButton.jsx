import React from "react";
import "./CartButton.css";
function CartButton({ onClick, buttonText }) {
  return (
    <button className="abd-CartButton w-100 mt-3" onClick={onClick}>
      {buttonText}
    </button>
  );
}

export default CartButton;
