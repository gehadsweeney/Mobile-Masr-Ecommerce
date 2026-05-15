import React, { useState } from "react";
import { SiOpenai } from "react-icons/si";
import { BsStars } from "react-icons/bs";
import "./AskAiRecommendation.css";
// import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { askAiAboutBestItem } from "./askAiAboutBestItem";
import { useForm } from "react-hook-form";
import { CATEGORY_CRITERIA } from "./categoryCriteria";
import BestItemResponse from "./BestItemResponse/BestItemResponse";
import AiLoader from "./AiLoader/AiLoader";
function AskAiRecommendation({ compareItems }) {
  const [aiRecommendation, setAiRecommendation] = useState(null);
  // const { t } = useTranslation();
  const currentLang = useSelector((state) => state.language.currentLang);
  const [loading, setLoading] = useState(false);
  const [selectedCriteria, setSelectedCriteria] = useState("");

  // ============CATEGORY_CRITERIA=================
  const categoryName = compareItems?.[0]?.category?.name;
  const criteriaList = CATEGORY_CRITERIA[categoryName] || [];
  // ========form submission handler========
  const { register, handleSubmit } = useForm();
  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const response = await askAiAboutBestItem(
        compareItems,
        data.criteria,
        categoryName
      );
      setAiRecommendation(response);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="abd-askAiBestItem mt-5"
      dir={currentLang === "ar" ? "rtl" : "ltr"}
    >
      {/* ======================header============================== */}
      <div className="abd-askAiBestItem-header center flex-column">
        <div className="abd-askAiBestItem-header-title">
          <BsStars className="abd-askAiBestItem-header-icon" />
          <h3>AI analysis</h3>
        </div>
        {/* ---------------------------------------------------- */}
        <h2>Let us find the best for you</h2>
        {/* ------------------------------------------------------  */}
        <p>
          What is the most important criterion for you? Choose one of the
          criteria and the smart assistant will analyze the devices and suggest
          the best option.
        </p>
        {/* ---------------------checkbox-form---------------------------------  */}
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="abd-askAiBestItem-form"
        >
          <div className="abd-askAiBestItem-form-criteria center flex-wrap gap-2">
            {criteriaList.map((item) => (
              <React.Fragment key={item.key}>
                <label
                  htmlFor={item.key}
                  className={`abd-form-label${
                    selectedCriteria === item.key ? " selected" : ""
                  }`}
                  onClick={() => setSelectedCriteria(item.key)}
                >
                  {item.label}
                </label>

                <input
                  type="radio"
                  id={item.key}
                  {...register("criteria")}
                  value={item.key}
                  hidden
                />
              </React.Fragment>
            ))}
          </div>
          {/* ------------------submit-------------- */}
          <button
            type="submit"
            disabled={loading || !selectedCriteria}
            className="abd-ai-form-submit mx-auto"
            title="Please select once of criteria"
          >
            <SiOpenai className="abd-askAiBestItem-form-icon" />

            {!selectedCriteria
              ? "Please select a criterion"
              : loading
              ? "Analyzing..."
              : "Find the best"}
          </button>
        </form>
      </div>
      {/* ======================body============================== */}
      <div className="abd-askAiBestItem-body">
        {loading ? (
          <AiLoader />
        ) : aiRecommendation ? (
          <BestItemResponse aiRecommendation={aiRecommendation} />
        ) : (
          <p className="text-center text-muted fs-5 mt-4">
            No recommendation found yet.
            <br />
            Please select your most important criterion and click "Find the
            best" to get a smart suggestion!
          </p>
        )}
      </div>
    </div>
  );
}

export default AskAiRecommendation;
