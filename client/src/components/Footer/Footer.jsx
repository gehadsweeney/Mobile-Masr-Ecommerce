import "./Footer.css";
import { FaFacebookF, FaInstagram, FaWhatsapp, FaCheckCircle } from "react-icons/fa";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

function Footer() {
  const { t } = useTranslation();
  const currentLang = useSelector((state) => state.language.currentLang);

  return (
    <footer className="mos-footer mt-5" dir={currentLang === "ar" ? "rtl" : "ltr"}>
      <div className="container mos-footer-top">
        <div className="row gy-5">

          {/* Brand */}
          <div className="col-12 col-lg-4">
            <h5 className="mos-footer-brand">{t("MobileMasr")}</h5>
            <p className="mos-footer-desc">
              {t("Footer Brand Desc")}
            </p>

            <div className="mos-footer-social">
              <a href="#"><FaFacebookF /></a>
              <a href="#"><FaInstagram /></a>
              <a href="#"><FaWhatsapp /></a>
            </div>
          </div>

          {/* Shop */}
          <div className="col-6 col-lg-2">
            <h6>{t("Shop")}</h6>
            <ul>
              <li><Link to="/category/mobile">{t("Mobile")}</Link></li>
              <li><Link to="/category/laptop">{t("Laptop")}</Link></li>
              <li><Link to="/category/tablet">{t("Tablet")}</Link></li>
              <li><Link to="/category/wireless-earbuds">{t("Wireless Earbuds")}</Link></li>
            </ul>
          </div>

          {/* Account */}
          <div className="col-6 col-lg-2">
            <h6>{t("Account")}</h6>
            <ul>
              <li><Link to="/profile">{t("Account Information")}</Link></li>
              <li><Link to="/profile/orders">{t("My Purchases")}</Link></li>
              <li><Link to="/profile/favorites">{t("Favorites")}</Link></li>
            </ul>
          </div>

          {/* Why Choose Us */}
          <div className="col-12 col-lg-2">
            <h6>{t("Company")}</h6>
            <ul className="mos-footer-features">
              <li><FaCheckCircle /> {t("Secure Shopping")}</li>
              <li><FaCheckCircle /> {t("Fast Delivery")}</li>
              <li><FaCheckCircle /> {t("Verified Sellers")}</li>
            </ul>
          </div>

          {/* Newsletter */}
          <div className="col-12 col-lg-2">
            <h6>{t("Stay Updated")}</h6>
            <p className="mos-footer-small">
              {t("Newsletter Desc")}
            </p>
            {currentLang === "ar" ? (
              <div className="input-group" >
                <input 
                  type="email"
                  className="form-control py-2"
                  placeholder={t("Your email")}
                  style={{ borderRadius: "0 8px 8px 0" , borderLeft: "none"}}
                />
                <button className="btn btn-dark" style={{ borderRadius: "8px 0 0 8px" }}>←</button>
              </div>
            ) : (
              <div className="input-group">
                <input
                  type="email"
                  className="form-control py-2"
                  placeholder={t("Your email")}
                  style={{ borderRadius: "8px 0 0 8px" }}
                />
                <button className="btn btn-dark" style={{ borderRadius: "0 8px 8px 0" }}>→</button>
              </div>
            )}
          </div>

        </div>
      </div>

      {/* Bottom */}
      <div className="mos-footer-bottom">
        <div className="container">
          <div className="row align-items-center gy-3">
            <div className={`col-md-6 text-center ${currentLang === "ar" ? "text-md-end" : "text-md-start"}`}>
              © {new Date().getFullYear()} {t("MobileMasr")} {t("All rights reserved")}
            </div>
            <div className={`col-md-6 text-center ${currentLang === "ar" ? "text-md-start" : "text-md-end"}`}>
              <Link to="/privacy">{t("Privacy Policy")}</Link> ·{" "}
              <Link to="/terms">{t("Terms & Conditions")}</Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
