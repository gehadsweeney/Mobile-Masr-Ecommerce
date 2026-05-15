import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import { setLanguage } from "../../../store/slices/languageSlice";
import { fetchProductsData } from "../../../store/slices/ProductSlice";
import "./ToggleLanguage.css";

function ToggleLanguage() {
  const dispatch = useDispatch();
  const { i18n } = useTranslation();
  const currentLang = useSelector((state) => state.language.currentLang);

  const handleToggleLang = () => {
    const newLang = currentLang === "ar" ? "en" : "ar";
    dispatch(setLanguage(newLang));
    i18n.changeLanguage(newLang);
    dispatch(fetchProductsData(newLang));
    // document.documentElement.lang = newLang;
  };

  return (
    <div
      className={`abd-ToggleLanguage ${currentLang === "ar" ? "active" : ""}`}
      onClick={handleToggleLang}
    >
      <div
        className={`language-option ${currentLang === "en" ? "active" : ""}`}
      >
        EN
      </div>
      <div
        className={`language-option ${currentLang === "ar" ? "active" : ""}`}
      >
        AR
      </div>
    </div>
  );
}

export default ToggleLanguage;
