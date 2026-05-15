import React from "react";
import "./ProductInfo.css";
import { FaCircleCheck } from "react-icons/fa6";
import { GiCharging } from "react-icons/gi";
import { BsBoxSeam, BsUsbPlug } from "react-icons/bs";
import { PiDeviceMobileSpeakerLight as MobileCover } from "react-icons/pi";
import { BsEarbuds } from "react-icons/bs";
import { LiaPencilAltSolid } from "react-icons/lia";
import VendorContainer from "../../GlobalComponents/VendorContainer/VendorContainer";
import AddToCartBtn from "./AddToCartBtn";
import { useTranslation } from "react-i18next";

function ProductInfo({ product }) {
  const { t } = useTranslation();
  return (
    <>
      {/* ===================Category-Name=================== */}
      <div className="abd-InfoCatName mb-3 fs-2 fw-light">
        {product.category.name}
      </div>
      {/* ===================Product-Name=================== */}
      <h2 className="fw-semibold mb-4">{product.name}</h2>
      {/* ===================Product-Price=================== */}
      <div className="abd-InfoPrice d-flex align-items-baseline gap-3 mb-3 fs-3">
        <div
          className="abd-InfoNewPrice"
          style={
            product.discount > 0
              ? {
                  color: "var(--red-color)",
                  backgroundColor: "var(--red-color-light)",
                }
              : {}
          }
        >
          {product.priceAfterDiscount} {t("EGP")}
        </div>
        {product.discount > 0 && (
          <div className="abd-InfoOldPrice text-muted text-decoration-line-through">
            {product.price} {t("EGP")}
          </div>
        )}
      </div>
      {/* ===================SKU-Code=================== */}
      <div className="abd-InfoSKU mb-3">
        <span className="fw-semibold me-3">{t("SKU Code")}: </span>{" "}
        {product.skuCode}
      </div>
      {/* ===================Product-Description=================== */}
      <p className="text-muted fs-4">{product.description}</p>
      {/* ==================Product-Verified=================== */}
      {product.condition == "used" && (
        <div className="abd-InfoVerified mt-4 fs-5 d-flex align-items-center">
          <FaCircleCheck className="me-2 text-success" />
          {t("Checked and Verified By MobileMasr")}
        </div>
      )}
      {/* ================Prod-Info-Details===================== */}
      <div className="abd-InfoDetails mt-4">
        <div className="abd-InfoDetailItem row mb-3">
          {/* ---------------condition-------------- */}
          <div className="fw-semibold col-4">{t("Condition")}:</div>
          <div
            className={`col-8 fw-bold ${
              product.condition === "used" ? "text-primary" : "text-warning"
            }`}
          >
            {product.condition}
          </div>
        </div>
        {/* ---------------storage--------------- */}
        {product.storage && (
          <div className="abd-InfoDetailItem row mb-3">
            <div className="fw-semibold col-4">{t("Storage")}:</div>
            <div className="col-8">{product.storage}</div>
          </div>
        )}
        {/* ---------------ram--------------- */}
        {product.ram[0] && (
          <div className="abd-InfoDetailItem row mb-3">
            <div className="fw-semibold col-4">{t("RAM")}:</div>
            <div className="col-8">{product.ram[0]}</div>
          </div>
        )}
        {/* ---------------color--------------- */}
        {product.color && (
          <div className="abd-InfoDetailItem row mb-3">
            <div className="fw-semibold col-4">{t("Color")}:</div>
            <div className="col-8 d-flex align-items-center gap-2">
              <span
                className="colorBox p-3"
                style={{ backgroundColor: product.color }}
              ></span>
              {product.color}
            </div>
          </div>
        )}
        {/* -------------Battery Capacity--------------- */}
        {product.batteryCapacity && (
          <div className="abd-InfoDetailItem row mb-3">
            <div className="fw-semibold col-4">{t("Battery Capacity")}:</div>
            <div className="col-8">{product.batteryCapacity}</div>
          </div>
        )}
        {/* ---------------sim card--------------- */}
        {product.simCard && (
          <div className="abd-InfoDetailItem row mb-3">
            <div className="fw-semibold col-4">{t("SIM Card")}:</div>
            <div className="col-8">{product.simCard}</div>
          </div>
        )}
        {/* ---------------screen size--------------- */}
        {product.screenSize && (
          <div className="abd-InfoDetailItem row mb-3">
            <div className="fw-semibold col-4">{t("Screen Size")}:</div>
            <div className="col-8">{product.screenSize}</div>
          </div>
        )}
        {/* ---------------camera--------------- */}
        {product.camera && (
          <div className="abd-InfoDetailItem row mb-3">
            <div className="fw-semibold col-4">{t("Camera")}:</div>
            <div className="col-8">{product.camera}</div>
          </div>
        )}
        {/* ---------------weight--------------- */}
        {product.weight && (
          <div className="abd-InfoDetailItem row mb-3">
            <div className="fw-semibold col-4">{t("Weight")}:</div>
            <div className="col-8">{product.weight}</div>
          </div>
        )}
        {/* ---------------SSD--------------- */}
        {product.ssd && (
          <div className="abd-InfoDetailItem row mb-3">
            <div className="fw-semibold col-4">SSD:</div>
            <div className="col-8">{product.ssd}</div>
          </div>
        )}
        {/* ---------------HDD--------------- */}
        {product.hdd && (
          <div className="abd-InfoDetailItem row mb-3">
            <div className="fw-semibold col-4">HDD:</div>
            <div className="col-8">{product.hdd}</div>
          </div>
        )}
        {/* ---------------GPU--------------- */}
        {product.gpu && (
          <div className="abd-InfoDetailItem row mb-3">
            <div className="fw-semibold col-4">GPU:</div>
            <div className="col-8">{product.gpu}</div>
          </div>
        )}
        {/* ---------------processor--------------- */}
        {product.processor && (
          <div className="abd-InfoDetailItem row mb-3">
            <div className="fw-semibold col-4">{t("Processor")}:</div>
            <div className="col-8">{product.processor}</div>
          </div>
        )}
        {/* ---------------accessories--------------- */}
        {product.accessories && (
          <div className="abd-InfoDetailItem row mb-3">
            <div className="fw-semibold col-4">{t("Accessories")}:</div>
            <div className="col-8 d-flex flex-wrap gap-2">
              {product.accessories.map((acc, index) => {
                const a = acc.toLowerCase();
                let icon = acc;

                if (a === "earbuds" || a === "سماعات أذن") {
                  icon = <BsEarbuds />;
                } else if (a === "charger" || a === "شاحن") {
                  icon = <GiCharging />;
                } else if (a === "original box" || a === "العلبة الأصلية") {
                  icon = <BsBoxSeam />;
                } else if (a === "usb" || a === "كابل usb") {
                  icon = <BsUsbPlug />;
                } else if (a === "cover" || a === "غطاء") {
                  icon = <MobileCover />;
                } else if (a === "pen" || a === "قلم") {
                  icon = <LiaPencilAltSolid />;
                }

                return (
                  <span
                    key={index}
                    className="fs-5 d-flex align-items-center gap-2"
                  >
                    <span>{icon}</span>
                    {acc}
                  </span>
                );
              })}
            </div>
          </div>
        )}
      </div>
      {/* =================Product-Vendor=================== */}
      <VendorContainer vendor={product.vendor} />
      {/* ==============Add-To-Cart-Button=================== */}
      <div className="my-5">
        <AddToCartBtn product={product} />
      </div>
    </>
  );
}

export default ProductInfo;
