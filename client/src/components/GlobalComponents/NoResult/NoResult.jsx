import { useTranslation } from "react-i18next";
import "./NoResult.css";
function NoResult() {
  const { t } = useTranslation();
  return (
    <div className="noResult center">
      <img src="/no-results.png" alt="No results" />
      <div className="noResultTitle">{t("No Results Found!")}</div>
    </div>
  );
}

export default NoResult;
