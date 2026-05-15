import React from "react";
import { useSelector } from "react-redux";
import "./FeatureBar.css";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import "swiper/css";

const features = [
  {
    title: { en: "Diagnostic Tool Report", ar: "تقرير أداة التشخيص" },
    subtitle: {
      en: "Generate a diagnostic report for your device",
      ar: "إنشاء تقرير تشخيص لجهازك",
    },
    img: "https://res.cloudinary.com/dfigu6nnn/image/upload/v1762703701/ico1_we1fiu.svg",
  },
  {
    title: {
      en: "Guaranteed Sellers & Buyers",
      ar: "البائعون والمشترون المضمونون",
    },
    subtitle: {
      en: "Secure Platform for your info and cards",
      ar: "منصة آمنة لمعلوماتك وبطاقاتك",
    },
    img: "https://res.cloudinary.com/dfigu6nnn/image/upload/v1762703701/ico2_gzqxy5.svg",
  },
  {
    title: { en: "30 days warranty", ar: "ضمان 30 يومًا" },
    subtitle: {
      en: "Buy with warranty from Verified Stores",
      ar: "اشترِ بضمان من المتاجر الموثوقة",
    },
    img: "https://res.cloudinary.com/dfigu6nnn/image/upload/v1762703700/ico3_bwbcqx.svg",
  },
  {
    title: { en: "Fast Delivery", ar: "توصيل سريع" },
    subtitle: {
      en: "Safe Delivery to All Governorates",
      ar: "توصيل آمن إلى جميع المحافظات",
    },
    img: "https://res.cloudinary.com/dfigu6nnn/image/upload/v1762703700/ico4_idusrb.svg",
    flip: true,
  },
];

const FeatureBar = () => {
  const currentLang = useSelector((state) => state.language.currentLang);

  return (
    <div
      className="container geh-feature-bar my-3"
      dir={currentLang === "ar" ? "rtl" : "ltr"}
    >
      <Swiper
        modules={[Autoplay]}
        autoplay={{ delay: 2500, disableOnInteraction: false }}
        spaceBetween={15}
        breakpoints={{
          320: { slidesPerView: 1 },
          480: { slidesPerView: 1.2 },
          576: { slidesPerView: 1.5 },
          768: { slidesPerView: 2 },
          1024: { slidesPerView: 3 },
          1280: { slidesPerView: 4 },
        }}
      >
        {features.map((item, index) => (
          <SwiperSlide key={index}>
            <div className="geh-feature-card-mobile">
              <img
                src={item.img}
                alt={item.title[currentLang]}
                className={`geh-feature-img ${item.flip ? "geh-flip" : ""}`}
              />
              <div>
                <p>{item.title[currentLang]}</p>
                <p>{item.subtitle[currentLang]}</p>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default FeatureBar;
