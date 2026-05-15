import React from "react";
import Sort from "../../GlobalComponents/Sort/Sort";
import { FiSliders } from "react-icons/fi";
import "./CategoryHeader.css";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";

function CategoryHeader({
  category,
  sortBy,
  onSortChange,
  onMobileFilterClick,
}) {
  const { t } = useTranslation();
  const currentLang = useSelector((state) => state.language.currentLang);
  
  return (
    <>
      {/* Mobile Filter Button */}
      <div className="d-md-none mb-3">
        <button className="mos-mobile-filter-btn" onClick={onMobileFilterClick}>
          <FiSliders size={18} /> {t("Filter & Sort")}
        </button>
      </div>

      {/* Category Header with Sort - Hide title on mobile */}
      <div className="mos-category-header mb-4" dir={currentLang === "ar" ? "rtl" : "ltr"}>
        <div className="d-flex justify-content-between align-items-center gap-3">
          <div className="d-none d-md-block grow">
            <h2 className="mos-category-title mb-0">
              {t(
                category
                  ?.split("-")
                  .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                  .join(" ") || ""
              )}
            </h2>
          </div>

          {/* Sort Dropdown - Desktop Only */}
          <div className="d-none d-md-block shrink-0">
            <Sort sortBy={sortBy} onSortChange={onSortChange} />
          </div>
        </div>
      </div>
    </>
  );
}

export default CategoryHeader;
