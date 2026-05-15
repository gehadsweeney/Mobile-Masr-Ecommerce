import "./BrandBanner.css";
import { NavLink } from "react-router-dom";

function BrandBanners() {
  return (
    <div className="mos-brand-banners container my-5">
      <div className="mos-banner-grid">
        <NavLink to="/category/mobile?brands=Apple">
          <img
            src="https://res.cloudinary.com/dj1omur11/image/upload/v1765293070/AppleBanner_xzrjna.webp"
            alt="Apple Banner"
          />
        </NavLink>
        <NavLink to="/category/mobile?brands=Samsung">
          <img
            src="https://res.cloudinary.com/dj1omur11/image/upload/v1765293069/Samsungbanner_cnmlam.webp"
            alt="Samsung Banner"
          />
        </NavLink>
        <NavLink to="/category/mobile?brands=Xiaomi">
          <img
            src="https://res.cloudinary.com/dj1omur11/image/upload/v1765293069/Xioamibanner_hnsdjt.webp"
            alt="Xiaomi Banner"
          />
        </NavLink>
        <NavLink to="/category/mobile?brands=Oppo">
          <img
            src="https://res.cloudinary.com/dj1omur11/image/upload/v1765293069/oppobanner_awnwrz.webp"
            alt="Oppo Banner"
          />
        </NavLink>
      </div>
    </div>
  );
}

export default BrandBanners;
