import { useTranslation } from "react-i18next";
import "./CategoryNavbar.css";
import { NavLink, useParams } from "react-router-dom";
function CategoryNavbar() {
  const { compare } = useParams();
  const { t } = useTranslation();
  return (
    <div className="abd-CategoryNavbar">
      <ul className="d-none d-md-flex align-items-center justify-content-center gap-5 py-4">
        <li>
          <NavLink
            to={`/category/mobile/${compare ? compare : ""}`}
            className={({ isActive }) => (isActive ? "active-link" : "")}
          >
            {t("Mobile")}
          </NavLink>
        </li>
        <li>
          <NavLink
            to={`/category/tablet/${compare ? compare : ""}`}
            className={({ isActive }) => (isActive ? "active-link" : "")}
          >
            {t("Tablet")}
          </NavLink>
        </li>
        <li>
          <NavLink
            to={`/category/laptop/${compare ? compare : ""}`}
            className={({ isActive }) => (isActive ? "active-link" : "")}
          >
            {t("Laptop")}
          </NavLink>
        </li>
        <li>
          <NavLink
            to={`/category/smart-watches/${compare ? compare : ""}`}
            className={({ isActive }) => (isActive ? "active-link" : "")}
          >
            {t("Smart Watches")}
          </NavLink>
        </li>
        <li>
          <NavLink
            to={`/category/wireless-earbuds/${compare ? compare : ""}`}
            className={({ isActive }) => (isActive ? "active-link" : "")}
          >
            {t("Wireless Earbuds")}
          </NavLink>
        </li>
        <li>
          <NavLink
            to={`/category/game-consoles/${compare ? compare : ""}`}
            className={({ isActive }) => (isActive ? "active-link" : "")}
          >
            {t("Game Consoles")}
          </NavLink>
        </li>
      </ul>
    </div>
  );
}

export default CategoryNavbar;
