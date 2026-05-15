import React from "react";
import "./MobileSortSection.css";
import { useTranslation } from "react-i18next";

function MobileSortSection({ sortBy, onSortChange }) {
  const { t } = useTranslation();
  return (
    <div className="mos-mobile-sort-section">
      <h4 className="mos-mobile-section-title">{t("Sort by")}</h4>
      <div className="mos-sort-options">
        <div className="mos-sort-option-item">
          <input
            type="radio"
            id="sort-newest"
            name="sortOption"
            value="newest"
            checked={sortBy === "newest"}
            onChange={() => onSortChange("newest")}
          />
          <label htmlFor="sort-newest">{t("Newest Arrival")}</label>
        </div>
        <div className="mos-sort-option-item">
          <input
            type="radio"
            id="sort-low"
            name="sortOption"
            value="priceLowToHigh"
            checked={sortBy === "priceLowToHigh"}
            onChange={() => onSortChange("priceLowToHigh")}
          />
          <label htmlFor="sort-low">{t("Price Low To High")}</label>
        </div>
        <div className="mos-sort-option-item">
          <input
            type="radio"
            id="sort-high"
            name="sortOption"
            value="priceHighToLow"
            checked={sortBy === "priceHighToLow"}
            onChange={() => onSortChange("priceHighToLow")}
          />
          <label htmlFor="sort-high">{t("Price High To Low")}</label>
        </div>
      </div>
    </div>
  );
}

export default MobileSortSection;
