import React, { useEffect, useState } from "react";
import { FaHeart } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { toggleWishlist } from "../../../store/slices/WishlistSlice";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";
// import { useNavigate } from "react-router-dom";

function CardFavoriteIcon({ productId, className = "" }) {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  // const navigate = useNavigate();
  const wishlist = useSelector((state) => state.wishlist);
  const token = useSelector((state) => state.users?.token);
  const currentLang = useSelector((state) => state.language.currentLang);
  const [isFav, setIsFav] = useState(false);

  // Check if product is in wishlist
  useEffect(() => {
    if (wishlist?.items && productId) {
      const inWishlist = wishlist.items.some(
        (item) => item._id === productId || item.toString() === productId
      );
      setIsFav(inWishlist);
    }
  }, [wishlist?.items, productId]);

  const handleToggle = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!token) {
      toast.error(t("Please login first to add to Favorites"));
      return;
    }

    // UI Update First (لإحساس فوري)
    setIsFav((prev) => !prev);

    try {
      const result = await dispatch(
        toggleWishlist({ productId, lang: currentLang })
      ).unwrap();

      if (result.action === "added") {
        toast.success(t("Added to Favorites"));
      } else {
        toast.info(t("Removed from Favorites"));
      }
    } catch (error) {
      // رجّع القيمة الأصلية لو حصل خطأ
      setIsFav((prev) => !prev);
      toast.error(error || t("Failed to update Favorites"));
    }
  };

  return (
    <FaHeart
      className={`abd-Icon-Favorite ${
        isFav ? "text-danger" : ""
      } ${className}`.trim()}
      onClick={handleToggle}
      size={20}
      style={{ cursor: wishlist?.isLoading ? "wait" : "pointer" }}
    />
  );
}

export default CardFavoriteIcon;
