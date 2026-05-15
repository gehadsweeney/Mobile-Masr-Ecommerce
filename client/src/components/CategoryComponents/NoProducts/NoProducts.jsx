import React from "react";
import "./NoProducts.css";
import { useTranslation } from "react-i18next";

function NoProducts() {
  const { t } = useTranslation();

  return (
    <div className="text-center py-5">
      <div className="mos-no-products-message">
        <i className="fas fa-box-open fa-3x text-muted mb-3"></i>
        <p className="text-muted">{t("No products found in this category")}</p>
      </div>
    </div>
  );
}

export default NoProducts;
