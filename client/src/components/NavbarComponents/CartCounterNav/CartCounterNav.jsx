import React from "react";
import { AiOutlineShoppingCart as Cart } from "react-icons/ai";
import "../Navbar/Navbar.css";
import { Link } from "react-router";
import CartCount from "../../GlobalComponents/CartCount/CartCount";

function CartCounterNav() {
  return (
    <Link to="/cart" className="abd-Cart d-none d-md-inline-block">
      <Cart />
      <div className="abd-CartCounter center">
        <CartCount />
      </div>
    </Link>
  );
}

export default CartCounterNav;
