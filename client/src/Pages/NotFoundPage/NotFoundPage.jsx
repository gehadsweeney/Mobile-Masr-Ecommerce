import React from "react";
import { useNavigate } from "react-router-dom";
import Button from "../../components/GlobalComponents/Button/Button";
import "./NotFoundPage.css";
import { useTranslation } from "react-i18next";

const NotFoundpage = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const goBack = () => {
    navigate(-1); // -1 يعني صفحة لورا
  };

  return (
    <div className="heb-notfound-container">
      <img
        src="https://res.cloudinary.com/dj1omur11/image/upload/v1763902216/notFoundPage_lcn23a.jpg"
        alt="Not Found"
        className="heb-notfound-image"
      />
      <Button
        onClick={goBack}
        btnTitle={t("Back")}
        className="heb-notfound-button"
      />
    </div>
  );
};

export default NotFoundpage;
