import { FaCircleCheck, FaAward } from "react-icons/fa6";
import { BiSolidBadgeCheck } from "react-icons/bi";
import { TbBuildingStore } from "react-icons/tb";
import { NavLink } from "react-router-dom";
import "./VendorContainer.css";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
function VendorContainer({ vendor }) {
  const { t } = useTranslation();
  const currentLang = useSelector((state) => state.language.currentLang);

  return (
    <div className="abd-InfoVendor mt-5">
      <NavLink to={`/vendor/${vendor._id}`} className="d-flex gap-2">
        <img
          className="abd-InfoVendorImage"
          src={vendor.image}
          alt={vendor.name}
        />
        <div className="abd-InfoVendorName fs-2 fw-semibold me-3">
          {vendor.name}
          <div className="d-flex align-items-center fs-6 fw-medium mt-1">
            <TbBuildingStore size={15} />
            <div className="ms-1 mt-1">{t("Verified Store")}</div>
          </div>
        </div>
      </NavLink>
      <div className="mt-4 fs-5 d-flex gap-2 align-items-center">
        <FaCircleCheck className=" text-primary" />
        <div>{t("Verified by MobileMasr")}</div>
      </div>
      <div
        style={{
          position: "absolute",
          ...(currentLang === "ar"
            ? { top: "1rem", left: "1rem" }
            : { top: "1rem", right: "1rem" }),
        }}
        className="d-flex gap-2"
      >
        <BiSolidBadgeCheck
          style={{ color: "var(--green-color)", fontSize: "2rem" }}
        />
        <FaAward style={{ color: "var(--orange-color)", fontSize: "2rem" }} />
      </div>
    </div>
  );
}

export default VendorContainer;
