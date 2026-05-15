// import React, { useState } from "react";
import { FaFacebook, FaShareAlt, FaWhatsapp } from "react-icons/fa";
import { MdOutlineBatteryChargingFull as BatteryIcon } from "react-icons/md";
import { TbBuildingStore } from "react-icons/tb";

import "./Card.css";
import React, { useState } from "react";
import { NavLink, useParams } from "react-router-dom";
import Button from "../Button/Button";
import CardCompareBtn from "./CardCompareBtn";
import CardFavoriteIcon from "./CardFavoriteIcon";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";

function Card({ product }) {
  const [showShareOptions, setShowShareOptions] = useState(false);
  const simText = product.simCard || "";
  const simCount = /2[-\s]?sim/i.test(simText) ? "2" : "";
  const { compare } = useParams();
  const { t } = useTranslation();
  const currentLang = useSelector((state) => state.language.currentLang);

  // Generate share URL and text
  const productUrl = `${window.location.origin}/products/${product._id}`;
  const shareText = `Check out ${product.name} - ${product.priceAfterDiscount} EGP`;
  const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(
    shareText + " " + productUrl
  )}`;
  const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
    productUrl
  )}`;

  return (
    <div
      className="abd-Product-Card"
      dir={currentLang === "ar" ? "rtl" : "ltr"}
    >
      {/* ===========Product-Condition=========== */}
      <div
        className={`abd-Product-Type ${
          product.condition == "new" || product.condition == "جديد"
            ? "bg-warning"
            : "bg-primary"
        }`}
      >
        {product.condition}
      </div>

      {/* =============Card-Icons-Start ============ */}
      <div className="abd-Card-Icons d-flex align-items-center fs-2">
        {/* ============Share-Icon =========== */}
        <div className="abd-Card-Icon position-relative ">
          <FaShareAlt
            className="abd-Icon-Share"
            onClick={() => setShowShareOptions(!showShareOptions)}
          />
          <div
            className={`abd-shareOptions d-flex flex-column gap-2 shadow position-absolute top-100 p-3  ${
              showShareOptions ? "d-block" : "d-none"
            }`}
          >
            <a href={whatsappUrl} target="_blank" rel="noopener noreferrer">
              <FaWhatsapp className="whatsapp-Icon" />
            </a>
            <a href={facebookUrl} target="_blank" rel="noopener noreferrer">
              <FaFacebook className="facebook-Icon" />
            </a>
          </div>
        </div>
        {/* ============Heart-Icon =========== */}
        <div className="abd-Card-Icon">
          <CardFavoriteIcon productId={product._id} />
        </div>
      </div>
      {/* =============Card-Icons-End ============ */}

      {/* ==========  Product-Image-Container-start  =========== */}
      <div className="abd-Card-Image-Container center b">
        {/* ----------- Product Image ----------- */}
        <img
          src={product.images[0]}
          alt={product.name}
          className="abd-Product-Image"
        />
        {/* ----------- Product Guarantee ----------- */}
        <div className="abd-Product-Guarantee center">{product.guarantee}</div>
        {/* ----------- Product Sim Count ----------- */}
        {simCount && <div className="abd-simCount">{simCount}</div>}
        {/* ----------- Product Battery Status ----------- */}
        {product.batteryStatus && (
          <div className="abd-BatteryStatus">
            <BatteryIcon size={18} /> {product.batteryStatus}
          </div>
        )}
      </div>
      {/* ==========  Product-Image-Container-end  ===========  */}

      {/* ==========  Card-Details-start  =========== */}
      <div className="abd-Card-Details p-3">
        {/* ----------- Store Name -----------  */}
        <NavLink
          to={`/vendor/${product.vendor._id}`}
          className="abd-storeName d-flex gap-2 fs-5 mb-2"
        >
          <TbBuildingStore size={15} />
          <div>{product.vendor.name}</div>
        </NavLink>
        {/* ----------- Product Name -----------  */}
        <h4 className="abd-Product-Title mb-3">{product.name}</h4>
        {/* ----------- Product Price -----------  */}
        <div className="abd-Price-Section d-flex align-items-center justify-content-between gap-3">
          <div
            className={`fw-bold ${
              product.discount > 0 ? "text-danger" : "text-success"
            }`}
          >
            {product.priceAfterDiscount} {t("EGP")}
          </div>
          {product.discount > 0 && (
            <div className="text-muted text-decoration-line-through">
              {product.price} {t("EGP")}
            </div>
          )}
        </div>
        {/* --------------Go to Product Details ----------- */}
        <div className="abd-Card-Buttons d-flex align-items-center justify-content-between mt-4 gap-3">
          <NavLink
            to={`/products/${product._id}`}
            className="abd-View-Details d-block py-2"
          >
            <Button btnTitle={t("View Details")} style={{ width: "300px" }} />
          </NavLink>
          {/* -----------copmare-Btn------------ */}
          {compare === "compare" && <CardCompareBtn product={product} />}
        </div>
      </div>
      {/* ==========  Card-Details-end  ===========  */}
    </div>
  );
}
export default React.memo(Card);
