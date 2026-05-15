import React from "react";
import { useTranslation } from "react-i18next";
import { FiRotateCcw } from "react-icons/fi";

const FilterActions = ({ onApply, onClear }) => {
  const { t } = useTranslation();
  return (
    <div className="mos-filter-panel__actions">
      <button type="button" className="mos-btn-apply" onClick={onApply}>
        {t("Search")}
      </button>
      <button type="button" className="mos-btn-clear" onClick={onClear}>
        <FiRotateCcw />
        <span>{t("Clear")}</span>
      </button>
    </div>
  );
};

export default FilterActions;
