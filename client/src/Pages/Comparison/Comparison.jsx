import React, { useContext } from "react";
import "./Comparison.css";
import CompareContext from "../../context/CompareContext";
import PagePath from "../../components/GlobalComponents/PagePath/PagePath";

import TableComparison from "../../components/ComparisonComponents/TableComparison/TableComparison";
import AskAiRecommendation from "../../components/ComparisonComponents/AskAiRecommendation/AskAiRecommendation";

import { useTranslation } from "react-i18next";

const Comparison = () => {
  //   console.log("api key", import.meta.env.VITE_OPENAI_API_KEY);
  const { compareItems } = useContext(CompareContext);

  const { t } = useTranslation();

  if (compareItems.length === 0) {
    return (
      <div className="container pt-4">
        <PagePath path={t("Comparison")} />
        <div className="abd-emptyCompare p-3 text-center fs-5">
          {t("No items to compare")}
        </div>
      </div>
    );
  }

  return (
    <div className="container pt-4">
      <PagePath path={t("Comparison")} />
      <TableComparison compareItems={compareItems} />
      {/* =========Ask Ai what the best item======= */}
      <AskAiRecommendation compareItems={compareItems} />
    </div>
  );
};

export default Comparison;
