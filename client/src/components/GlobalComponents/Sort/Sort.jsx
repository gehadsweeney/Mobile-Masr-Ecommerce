import React, { useState } from "react";
import { FaChevronDown } from "react-icons/fa";
import "./Sort.css";
import { useTranslation } from "react-i18next";

const Sort = ({ sortBy, onSortChange }) => {
  const [showDropdown, setShowDropdown] = useState(false);

  const handleSortSelect = (option) => {
    onSortChange(option);
    setShowDropdown(false);
  };

  const { t } = useTranslation();

  return (
    <div className="position-relative">
      <button
        className="btn d-flex align-items-center gap-2 mos-sort-btn"
        onClick={() => setShowDropdown(!showDropdown)}
      >
        <span>{t("Sort by")}</span>
        <FaChevronDown
          className={`mos-sort-arrow ${showDropdown ? "rotate" : ""}`}
        />
      </button>

      {showDropdown && (
        <div className="mos-sort-dropdown">
          <button
            className={`mos-sort-option ${sortBy === "newest" ? "active" : ""}`}
            onClick={() => handleSortSelect("newest")}
          >
            {t("Newest Arrival")}
          </button>
          <button
            className={`mos-sort-option ${
              sortBy === "priceLowToHigh" ? "active" : ""
            }`}
            onClick={() => handleSortSelect("priceLowToHigh")}
          >
            {t("Price Low To High")}
          </button>
          <button
            className={`mos-sort-option ${
              sortBy === "priceHighToLow" ? "active" : ""
            }`}
            onClick={() => handleSortSelect("priceHighToLow")}
          >
            {t("Price High To Low")}
          </button>
        </div>
      )}
    </div>
  );
};

export default Sort;
