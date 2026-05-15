import React from "react";
import "./BannerGrid.css";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";

const banners = [
  {
    img: {
      en: "https://res.cloudinary.com/dfigu6nnn/image/upload/v1762715545/s3_hgwr5b.webp",
      ar: "https://res.cloudinary.com/dj1omur11/image/upload/v1767216308/CompareItems_hmugwu.png",
    },
    link: "/category/mobile/compare",
    span: "big",
  },
  {
    img: {
      en: "https://res.cloudinary.com/dfigu6nnn/image/upload/v1762715555/s2_ym6ro0.webp",
      ar: "https://res.cloudinary.com/dfigu6nnn/image/upload/v1762715555/s2_ym6ro0.webp",
    },
    link: "#",
    span: "small",
  },
  {
    img: {
      en: "https://res.cloudinary.com/dfigu6nnn/image/upload/v1762715559/s1_q7ljuv.webp",
      ar: "https://res.cloudinary.com/dfigu6nnn/image/upload/v1762715559/s1_q7ljuv.webp",
    },
    link: "#",
    span: "small",
  },
];

const BannerGrid = () => {
  const currentLang = useSelector((state) => state.language.currentLang);
  return (
    <div className="geh-banner-grid container">
      {banners.map((banner, i) => (
        <Link
          key={i}
          to={banner.link}
          rel="noopener noreferrer"
          className={`geh-banner-item ${
            banner.span === "big" ? "geh-banner-big" : "geh-banner-small"
          }`}
        >
          <img
            src={banner.img[currentLang] || banner.img.en}
            alt={`Banner ${i + 1}`}
          />
        </Link>
      ))}
    </div>
  );
};

export default BannerGrid;
