import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  fetchWishlist,
  clearAllWishlist,
} from "../../../../store/slices/WishlistSlice";
import { toast } from "react-toastify";
import Card from "../../../../components/GlobalComponents/Card/Card";
import { FaRegHeart } from "react-icons/fa";
import "./Favorites.css";
import { useTranslation } from "react-i18next";

const Favorites = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const currentLang = useSelector((state) => state.language.currentLang);
  const [showModal, setShowModal] = useState(false);

  const { items: wishlistItems, isLoading } = useSelector(
    (state) => state.wishlist || {}
  );

  useEffect(() => {
    if (token) {
      dispatch(fetchWishlist(currentLang));
    } else {
      navigate("/login");
    }
  }, [dispatch, token, navigate, currentLang]);

  const handleClearAllWishlist = () => {
    if (!wishlistItems.length) return;
    setShowModal(true);
  };

  const confirmClearAll = () => {
    dispatch(clearAllWishlist())
      .unwrap()
      .then(() => {
        toast.success(t("Favorites cleared successfully"));
        setShowModal(false);
      })
      .catch((error) => {
        toast.error(error || t("Failed to clear Favorites"));
        setShowModal(false);
      });
  };

  // EMPTY UI (MobileMasr style)
  if (!wishlistItems || wishlistItems.length === 0) {
    return (
      <div className="mos-empty-container">
        {/* Heart Icon */}
        <FaRegHeart className="mos-empty-heart-icon" />

        <p className="mos-empty-text">
          {t("There are no products in your Favorites")}
        </p>

        <button
          className="mos-empty-btn"
          onClick={() => navigate("/category/all")}
        >
          {t("Add Products")}
        </button>
      </div>
    );
  }
  /* ---------------- NORMAL UI ---------------- */
  return (
    <div className="container my-3">
      <div className="mos-Favorites-header d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="mos-Favorites-title mb-1">{t("Favorites")}</h2>
          <p className="text-muted mos-Favorites-count">
            {wishlistItems.length}{" "}
            {wishlistItems.length === 1 ? t("item") : t("items")} {t("Added")}
          </p>
        </div>

        <button
          className="btn btn-danger px-4 py-3"
          onClick={handleClearAllWishlist}
          disabled={!wishlistItems.length || isLoading}
        >
          {isLoading ? t("Clearing...") : t("Delete All")}
        </button>
      </div>

      {/* Product Grid */}
      <div className="mos-Favorites-grid">
        {wishlistItems.map((product) => (
          <div key={product._id} className="mos-Favorites-card p-2">
            <Card product={product} />
          </div>
        ))}
      </div>

      {/* Confirmation Modal */}
      {showModal && (
        <div className="mos-modal-overlay" onClick={() => setShowModal(false)}>
          <div className="mos-modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="mos-modal-header">
              <h5 className="mos-modal-title">{t("Confirm Delete")}</h5>
              <button
                className="mos-modal-close"
                onClick={() => setShowModal(false)}
              >
                &times;
              </button>
            </div>
            <div className="mos-modal-body">
              <p>{t("Are you sure you want to delete all items from your Favorites?")}</p>
            </div>
            <div className="mos-modal-footer">
              <button
                className="mos-modal-btn mos-modal-btn-cancel"
                onClick={() => setShowModal(false)}
              >
                {t("Cancel")}
              </button>
              <button
                className="mos-modal-btn mos-modal-btn-confirm"
                onClick={confirmClearAll}
                disabled={isLoading}
              >
                {isLoading ? t("Clearing...") : t("Delete All")}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Favorites;
