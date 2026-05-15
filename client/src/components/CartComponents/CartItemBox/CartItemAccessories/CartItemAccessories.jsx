import React from "react";
import "./CartItemAccessories.css";
import { GiCharging } from "react-icons/gi";
import { BsBoxSeam, BsUsbPlug, BsEarbuds } from "react-icons/bs";
import { PiDeviceMobileSpeakerLight as MobileCover } from "react-icons/pi";
import { LiaPencilAltSolid } from "react-icons/lia";
import { useTranslation } from "react-i18next";

function CartItemAccessories({ accessories }) {
  const { t } = useTranslation();
  const renderAccessory = (acc) => {
    if (!acc) return acc;
    const a = acc.toLowerCase();
    if (a === "earbuds" || a === "سماعات أذن") return <BsEarbuds />;
    if (a === "charger" || a === "شاحن") return <GiCharging />;
    if (a === "original box" || a === "العلبة الأصلية") return <BsBoxSeam />;
    if (a === "usb" || a === "كابل usb") return <BsUsbPlug />;
    if (a === "cover" || a === "غطاء") return <MobileCover />;
    if (a === "pen" || a === "قلم") return <LiaPencilAltSolid />;
    return acc;
  };

  if (!accessories || accessories.length === 0) {
    return <p className="text-muted">{t("No accessories")}</p>;
  }

  return (
    <div className="d-flex flex-wrap gap-2">
      {t("Accessories")} :&nbsp;
      {accessories.map((acc, i) => (
        <span
          key={i}
          className="d-flex align-items-center gap-1 abd-accessory-item"
        >
          <span className="me-1">{renderAccessory(acc)}</span>
          {/* <small>{acc}</small> */}
        </span>
      ))}
    </div>
  );
}

export default CartItemAccessories;
