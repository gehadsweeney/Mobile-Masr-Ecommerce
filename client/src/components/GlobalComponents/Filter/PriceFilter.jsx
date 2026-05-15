import React from "react";
import { FiChevronDown, FiChevronRight } from "react-icons/fi";
import { MIN_PRICE, MAX_PRICE } from "./FilterData";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";

const PriceFilter = ({ price, isOpen, onToggleOpen, onPriceChange }) => {
  const { t } = useTranslation();
  const currentLang = useSelector((state) => state.language.currentLang);

  const handlePriceInput = (index, raw) => {
    const val = Math.max(MIN_PRICE, Math.min(MAX_PRICE, Number(raw)));
    const newPrice = [...price];
    newPrice[index] =
      index === 0 ? Math.min(val, price[1]) : Math.max(val, price[0]);
    onPriceChange(newPrice);
  };

  const handleRangeChange = (index, e) => {
    handlePriceInput(index, e.target.value);
  };

  return (
    <div className="mos-filter-group">
      <button
        type="button"
        className="mos-filter-group__toggle"
        onClick={onToggleOpen}
        style={{ flexDirection: "row" }}
      >
        <span
          className="mos-filter-group__arrow"
          style={{ transform: currentLang === "ar" ? "scaleX(-1)" : "none" }}
        >
          {isOpen ? <FiChevronDown /> : <FiChevronRight />}
        </span>
        <span className="mos-filter-group__title">{t("Price")}</span>
        <span className="mos-filter-group__count">
          {price[0].toLocaleString()} - {price[1].toLocaleString()}
        </span>
      </button>
      {isOpen && (
        <div className="mos-filter-group__body no-scroll" dir="ltr">
          <div className="mos-price-inputs">
            <input
              type="number"
              value={price[0]}
              onChange={(e) => handlePriceInput(0, e.target.value)}
            />
            <span className="mos-price-dash">–</span>
            <input
              type="number"
              value={price[1]}
              onChange={(e) => handlePriceInput(1, e.target.value)}
            />
          </div>
          <div className="mos-double-range">
            <div
              className="mos-double-range__track"
              style={{
                background: `linear-gradient(
                  to right,
                  #d1d5db ${
                    ((price[0] - MIN_PRICE) / (MAX_PRICE - MIN_PRICE)) * 100
                  }%,
                  #16a34a ${
                    ((price[0] - MIN_PRICE) / (MAX_PRICE - MIN_PRICE)) * 100
                  }%,
                  #16a34a ${
                    ((price[1] - MIN_PRICE) / (MAX_PRICE - MIN_PRICE)) * 100
                  }%,
                  #d1d5db ${
                    ((price[1] - MIN_PRICE) / (MAX_PRICE - MIN_PRICE)) * 100
                  }%
                )`,
              }}
            />
            <input
              type="range"
              min={MIN_PRICE}
              max={MAX_PRICE}
              value={price[0]}
              onChange={(e) => handleRangeChange(0, e)}
            />
            <input
              type="range"
              min={MIN_PRICE}
              max={MAX_PRICE}
              value={price[1]}
              onChange={(e) => handleRangeChange(1, e)}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default PriceFilter;
