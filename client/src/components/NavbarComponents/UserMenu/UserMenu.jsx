import React, { useContext, useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../../../store/slices/usersSlice";
import { Link } from "react-router-dom";
import { FaShoppingBag, FaUserCog, FaSignOutAlt } from "react-icons/fa";
import { CiUser } from "react-icons/ci";
import "./UserMenu.css";
import IsLoginContext from "../../../context/IsLoginContext";
import { useTranslation } from "react-i18next";

const UserMenu = () => {
  const { user } = useSelector((state) => state.users);
  const dispatch = useDispatch();
  const { setIsLoggedIn } = useContext(IsLoginContext);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);
  const { t } = useTranslation();

  useEffect(() => {
    // Reset image loading state when user changes
    setImageLoaded(false);
    setImageError(false);
  }, [user?.profilePicture]);

  if (!user) return null;

  const firstNameRaw = (user?.name || "").split(" ")[0] || "";
  const displayName = firstNameRaw
    ? firstNameRaw.charAt(0).toUpperCase() + firstNameRaw.slice(1).toLowerCase()
    : "";
  const profilePicture = user?.profilePicture || "";
  const avatarLetter = (displayName || user?.email || "?")
    .charAt(0)
    .toUpperCase();

  const handleImageLoad = () => {
    setImageLoaded(true);
  };

  const handleImageError = () => {
    setImageError(true);
  };

  return (
    <div className="dropdown user-dropdown">
      <button
        className="user-dropdown-btn dropdown-toggle"
        data-bs-toggle="dropdown"
      >
        <CiUser className="user-icon" />
        <span className="user-label">{t("Account")}</span>
      </button>

      <ul className="dropdown-menu dropdown-menu-end dropdown-menu-custom">
        {/* User Info Header */}
        <li className="dropdown-user-info">
          <div className="user-avatar-large">
            {profilePicture && !imageError ? (
              <img
                src={profilePicture}
                alt={displayName || "User"}
                loading="eager"
                onLoad={handleImageLoad}
                onError={handleImageError}
                crossOrigin="anonymous"
                referrerPolicy="no-referrer"
              />
            ) : (
              <span className="user-avatar-fallback-large">{avatarLetter}</span>
            )}
          </div>
          <div className="user-info-text">
            <div className="user-display-name">{displayName || t("User")}</div>
            <div className="user-email">{user.email}</div>
          </div>
        </li>

        <li>
          <hr className="dropdown-divider" />
        </li>

        {/* My Purchases */}
        <li>
          <Link className="dropdown-item-custom" to="/profile/orders">
            <FaShoppingBag className="dropdown-icon" /> {t("My Purchases")}
          </Link>
        </li>

        {/* Account Settings */}
        <li>
          <Link className="dropdown-item-custom" to="/profile/account">
            <FaUserCog className="dropdown-icon" /> {t("Account Settings")}
          </Link>
        </li>

        {/* Signout */}
        <li>
          <Link
            className="dropdown-item-custom signout-btn"
            onClick={() => {
              dispatch(logout());
              setIsLoggedIn(false);
            }}
          >
            <FaSignOutAlt className="dropdown-icon" /> {t("Log Out")}
          </Link>
        </li>
      </ul>
    </div>
  );
};

export default UserMenu;
