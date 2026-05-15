import React, { useContext, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchCart } from "../../../store/slices/cartSlice";
import IsLoginContext from "../../../context/IsLoginContext";

function CartCount() {
  const dispatch = useDispatch();
  const { items } = useSelector((state) => state.cart || { items: [] });
  const currentLang = useSelector((state) => state.language.currentLang);
  const { isLoggedIn } = useContext(IsLoginContext);
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (isLoggedIn && token && (!items || items.length === 0)) {
      dispatch(fetchCart(currentLang)).catch(() => {});
    }
  }, [dispatch, token, isLoggedIn, currentLang]);

  const count = isLoggedIn
    ? items?.reduce((acc, item) => acc + (item.quantity || 0), 0) || 0
    : 0;

  return <>{count}</>;
}

export default CartCount;
