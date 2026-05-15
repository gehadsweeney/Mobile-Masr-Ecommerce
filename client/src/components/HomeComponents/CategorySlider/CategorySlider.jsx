import React, { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Link } from "react-router-dom";
import "swiper/css";
import { Autoplay } from "swiper/modules";
import axios from "axios";
import "./CategorySlider.css";
import { useTranslation } from "react-i18next";

const CategorySlider = () => {
  const [categories, setCategories] = useState([]);
  const { t } = useTranslation();
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
    <div className="geh-category-slider container">
      <Swiper
        modules={[Autoplay]}
        autoplay={{ delay: 2000, disableOnInteraction: false }}
        spaceBetween={32}
        slidesPerView={6}
        breakpoints={{
          320: {
            slidesPerView: 2,
            spaceBetween: 10,
          },
          480: {
            slidesPerView: 3,
            spaceBetween: 20,
          },
          768: {
            slidesPerView: 4,
            spaceBetween: 22,
          },
          1024: {
            slidesPerView: 4,
          },
          1280: {
            slidesPerView: 6,
            spaceBetween: 32,
          },
        }}
      >
        {categories.map((cat) => {
          const slug = `/category/${cat.name
            .toLowerCase()
            .replace(/\s+/g, "-")}`;
          return (
            <SwiperSlide key={cat._id}>
              <Link to={slug} className="geh-category-card">
                <div className="geh-image-box">
                  <img src={cat.image} alt={t(cat.name)} />
                </div>
                <span className="geh-title">{t(cat.name)}</span>
              </Link>
            </SwiperSlide>
          );
        })}
      </Swiper>
    </div>
  );
};

export default CategorySlider;
