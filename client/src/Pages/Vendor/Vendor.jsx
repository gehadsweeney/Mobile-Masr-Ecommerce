import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { fetchVendorData } from "../../store/slices/VendorSlice";

import Card from "../../components/GlobalComponents/Card/Card";
import VendorContainer from "../../components/GlobalComponents/VendorContainer/VendorContainer";
import Pagination from "../../components/GlobalComponents/Pagination/Pagination";

import "./Vendor.css";
import KnowledgeBanners from "../../components/HomeComponents/KnowledgeBanners/KnowledgeBanners.jsx";
import Loader from "../../components/GlobalComponents/Loader/Loader.jsx";
import PagePath from "../../components/GlobalComponents/PagePath/PagePath.jsx";
import { useTranslation } from "react-i18next";

function Vendor() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { t } = useTranslation();

  const allProducts = useSelector((store) => store.products.data) || [];
  const vendor = useSelector((store) => store.vendors.data);
  const currentLang = useSelector((state) => state.language.currentLang);

  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 12;

  useEffect(() => {
    dispatch(fetchVendorData(id));
  }, [dispatch, id]);

  if (!vendor || allProducts.length === 0) {
    return <Loader />;
  }

  const vendorProducts = allProducts.filter(
    (product) => product?.vendor?._id?.toString() === id
  );

  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = vendorProducts.slice(
    indexOfFirstProduct,
    indexOfLastProduct
  );

  return (
    <div className="container pt-5">
      <PagePath path={`${vendor.name}`} />
      <div className="py-5">
        <div className="row" dir={currentLang === "ar" ? "rtl" : "ltr"}>
          <aside className="col-12 col-lg-3">
            <VendorContainer vendor={vendor} />
          </aside>

          <main className="col-12 col-lg-9">
            {vendorProducts.length > 0 ? (
              <>
                <div className="row g-3 reh-vendor-products-row">
                  {currentProducts.map((product) => (
                    <div
                      key={product._id}
                      className="col-12 col-md-6 col-lg-4 "
                    >
                      <Card product={product} className=" mx-auto" />
                    </div>
                  ))}
                </div>
                <Pagination
                  currentPage={currentPage}
                  totalProducts={vendorProducts.length}
                  productsPerPage={productsPerPage}
                  onPageChange={setCurrentPage}
                />
              </>
            ) : (
              <div className="reh-text-center reh-fs-4">
                {t("No products for this vendor yet.")}
              </div>
            )}
          </main>
        </div>
      </div>
      <KnowledgeBanners />
    </div>
  );
}

export default Vendor;
