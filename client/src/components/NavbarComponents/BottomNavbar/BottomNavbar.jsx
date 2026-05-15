import { NavLink, useParams } from "react-router-dom";
import "./BottomNavbar.css";
import { IoHome } from "react-icons/io5";
import { BiCategory } from "react-icons/bi";
import { HiOutlineShoppingCart as ShoppingCart } from "react-icons/hi";
import { FaRegCircleUser as UserIcon } from "react-icons/fa6";
import CartCount from "../../GlobalComponents/CartCount/CartCount";
import { useSelector } from "react-redux";
import { useContext } from "react";
import IsLoginContext from "../../../context/IsLoginContext";
import { useTranslation } from "react-i18next";

function BottomNavbar() {
  const { compare } = useParams();
  const { user } = useSelector((state) => state.users);
  const { isLoggedIn } = useContext(IsLoginContext);
  const { t } = useTranslation();

  const firstNameRaw = (user?.name || "").split(" ")[0] || "";
  const displayName = firstNameRaw
    ? firstNameRaw.charAt(0).toUpperCase() + firstNameRaw.slice(1).toLowerCase()
    : "";
  const profilePicture = user?.profilePicture || "";
  const avatarLetter = (displayName || user?.email || "U")
    .charAt(0)
    .toUpperCase();

  return (
    <div className="abd-BottomNavbar">
      <div className="container d-flex justify-content-around align-items-center py-2">
        <NavLink
          to="/"
          className={({ isActive }) =>
            `d-flex flex-column align-items-center fs-1 gap-2 nav-link ${
              isActive ? "active" : ""
            }`
          }
        >
          <div className="bottomNavIcon">
            <IoHome />
          </div>
          <h4 className="fw-light fs-4">{t("Home")}</h4>
        </NavLink>
        {/* ---------------------- */}
        <NavLink
          to={`/categories/${compare ? compare : ""}`}
          className={({ isActive }) =>
            `d-flex flex-column align-items-center fs-1 gap-2 nav-link ${
              isActive ? "active" : ""
            }`
          }
        >
          <div className="bottomNavIcon">
            <BiCategory />
          </div>
          <h4 className="fw-light fs-4">{t("Categories")}</h4>
        </NavLink>
        {/* ---------------------- */}
        <NavLink
          to="/cart"
          className={({ isActive }) =>
            `d-flex flex-column align-items-center fs-1 gap-2 nav-link ${
              isActive ? "active" : ""
            }`
          }
        >
          <div className="bottomNavIcon position-relative">
            <ShoppingCart />
            <div className="abd-BottomCartCounter center position-absolute top-0 start-100 translate-middle">
              <CartCount />
            </div>
          </div>
          <h4 className="fw-light fs-4">{t("Shopping Cart")}</h4>
        </NavLink>
        {/* ---------------------- */}
        <NavLink
          to={isLoggedIn ? "/profile/account" : "/login"}
          className={({ isActive }) =>
            `d-flex flex-column align-items-center fs-1 gap-2 nav-link ${
              isActive ? "active" : ""
            }`
          }
        >
          <div className="bottomNavIcon bottom-user-avatar">
            {isLoggedIn && profilePicture ? (
              <img
                src={profilePicture}
                alt={displayName || "User"}
                className="bottom-nav-profile-img"
                crossOrigin="anonymous"
                referrerPolicy="no-referrer"
              />
            ) : isLoggedIn ? (
              <span className="bottom-nav-avatar-letter">{avatarLetter}</span>
            ) : (
              <UserIcon />
            )}
          </div>
          <h4 className="fw-light fs-4">{t("My Account")}</h4>
        </NavLink>
      </div>
    </div>
  );
}

export default BottomNavbar;
