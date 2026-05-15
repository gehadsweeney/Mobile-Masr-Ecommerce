// function Categories() {

import React, { useEffect, useState } from "react";
import axios from "axios";
import "./Categories.css";
import { Link, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";

const Categories = () => {
  const [categories, setCategories] = useState([]);
  const { compare } = useParams();
  const { t } = useTranslation();
  const currentLang = useSelector((state) => state.language.currentLang);
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_API_URL}/categories`,
        );
        setCategories(res.data);
      } catch (err) {
        console.error("Error fetching categories:", err);
      }
    };
    fetchCategories();
  }, []);

  return (
    <div
      className="heb-category-page container my-5"
      dir={currentLang === "ar" ? "rtl" : "ltr"}
    >
      <h2 className="heb-category-title">{t("All Categories")}</h2>

      <div className="heb-category-grid">
        {categories.map((cat) => {
          const slug = `/category/${cat.name
            .toLowerCase()
            .replace(/\s+/g, "-")}/${compare ? compare : ""}`;
          return (
            <Link to={slug} key={cat._id} className="heb-category-card">
              <img src={cat.image} alt={t(cat.name)} />
              <h3>{t(cat.name)}</h3>
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default Categories;
