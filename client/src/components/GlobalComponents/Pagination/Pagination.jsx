import React from "react";
import "./Pagination.css";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";

function Pagination({
  currentPage,
  totalProducts,
  productsPerPage,
  onPageChange,
}) {
  const totalPages = Math.ceil(totalProducts / productsPerPage);

  const handlePageChange = (pageNumber) => {
    onPageChange(pageNumber);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // ======translation=====
  const { t } = useTranslation();
  const currentLang = useSelector((state) => state.language.currentLang);

  if (totalProducts === 0) return null;

  return (
    <div className="mos-pagination-wrapper mt-5">
      <nav
        className="d-flex justify-content-center mos-pagination"
        dir={currentLang === "ar" ? "rtl" : "ltr"}
      >
        <ul className="pagination">
          <li className={`page-item ${currentPage === 1 ? "disabled" : ""}`}>
            <button
              className="page-link page-nav page-first"
              onClick={() => handlePageChange(1)}
              disabled={currentPage === 1}
              aria-label="First Page"
            >
              <span className="page-nav-text">{t("First Page")}</span>
              <span className="page-nav-icon">«</span>
            </button>
          </li>
          <li className={`page-item ${currentPage === 1 ? "disabled" : ""}`}>
            <button
              className="page-link page-nav page-prev"
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              aria-label="Previous"
            >
              <span className="page-nav-text">{t("Previous Page")}</span>
              <span className="page-nav-icon">‹</span>
            </button>
          </li>

          {[...Array(totalPages)].map((_, index) => {
            const pageNumber = index + 1;
            if (
              pageNumber === 1 ||
              pageNumber === totalPages ||
              (pageNumber >= currentPage - 1 && pageNumber <= currentPage + 1)
            ) {
              return (
                <li
                  key={pageNumber}
                  className={`page-item ${
                    currentPage === pageNumber ? "active" : ""
                  }`}
                >
                  <button
                    className="page-link page-number"
                    onClick={() => handlePageChange(pageNumber)}
                  >
                    {pageNumber}
                  </button>
                </li>
              );
            } else if (
              pageNumber === currentPage - 2 ||
              pageNumber === currentPage + 2
            ) {
              return (
                <li key={pageNumber} className="page-item disabled">
                  <span className="page-link page-ellipsis">...</span>
                </li>
              );
            }
            return null;
          })}

          <li
            className={`page-item ${
              currentPage === totalPages ? "disabled" : ""
            }`}
          >
            <button
              className="page-link page-nav page-next"
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              aria-label="Next"
            >
              <span className="page-nav-text">{t("Next Page")}</span>
              <span className="page-nav-icon">›</span>
            </button>
          </li>
          <li
            className={`page-item ${
              currentPage === totalPages ? "disabled" : ""
            }`}
          >
            <button
              className="page-link page-nav page-last"
              onClick={() => handlePageChange(totalPages)}
              disabled={currentPage === totalPages}
              aria-label="Last Page"
            >
              <span className="page-nav-text">{t("Last Page")}</span>
              <span className="page-nav-icon">»</span>
            </button>
          </li>
        </ul>
      </nav>
    </div>
  );
}

export default Pagination;
