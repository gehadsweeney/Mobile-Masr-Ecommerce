import React, { useEffect, useState } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";

import { fetchBrandsData } from "../../store/slices/BrandSlice";

import { useCategoryFilters } from "../../utilities/useCategoryFilters.js";

import FilterSidebar from "../../components/GlobalComponents/Filter/Filter";
import BrandsCarousel from "../../components/CategoryComponents/BrandsCarousel/BrandsCarousel";
import PagePath from "../../components/GlobalComponents/PagePath/PagePath";
import KnowledgeBanners from "../../components/HomeComponents/KnowledgeBanners/KnowledgeBanners";
import CategoryHeader from "../../components/CategoryComponents/CategoryHeader/CategoryHeader";
import MobileFilterSidebar from "../../components/CategoryComponents/MobileFilterSidebar/MobileFilterSidebar";
import ProductsGrid from "../../components/CategoryComponents/ProductsGrid/ProductsGrid";
import NoProducts from "../../components/CategoryComponents/NoProducts/NoProducts";
import CompareList from "../../components/CategoryComponents/CompareList/CompareList.jsx";
import Loader from "../../components/GlobalComponents/Loader/Loader.jsx";

import "./Category.css";
import { useTranslation } from "react-i18next";

function Category() {
  const { category, compare } = useParams();
  const dispatch = useDispatch();
  const { t } = useTranslation();

  const [searchParams, setSearchParams] = useSearchParams();
  const allProducts = useSelector((state) => state?.products?.data || []);
  const isLoading = useSelector((store) => store.products.isLoading);

  const [showMobileFilter, setShowMobileFilter] = useState(false);

  const productsPerPage = 12;
  const currentPage = parseInt(searchParams.get("page")) || 1;

  // AI canonical search
  const searchQuery = searchParams.get("search") || null;

  const makeBreadcrumbPath = () => {
    const categoryName = category
      ?.split("-")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ") || "all";
    const base = t(categoryName);

    if (searchQuery) {
      return `${base} > ${searchQuery}`;
    }
    return base;
  };

  /* -----------------------------------------------------------
       Use Category Filters Hook (AI integrated)
  ----------------------------------------------------------- */
  const {
    sortBy,
    selectedBrand,
    filters,

    filterProductsByCategory,
    getFilteredAndSortedProducts,

    buildUrlParams: buildUrlParamsForPage,

    handleBrandSelect,
    handleFilterApply,
    handleSortChange,
    handleClearAll,
  } = useCategoryFilters(allProducts, category, searchParams, setSearchParams);

  /* -----------------------------------------------------------
       Fetch brands on mount
  ----------------------------------------------------------- */
  useEffect(() => {
    dispatch(fetchBrandsData());
  }, [dispatch]);

  /* -----------------------------------------------------------
       Pagination calculations
  ----------------------------------------------------------- */
  const filteredProducts = getFilteredAndSortedProducts();

  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;

  const currentProducts = filteredProducts.slice(
    indexOfFirstProduct,
    indexOfLastProduct
  );

  const handlePageChange = (pageNumber) => {
    const params = buildUrlParamsForPage(pageNumber);
    setSearchParams(params);
  };

  const currentLang = useSelector((state) => state.language.currentLang);

  /* -----------------------------------------------------------
      Loading
  ----------------------------------------------------------- */
  if (isLoading && allProducts.length === 0) return <Loader />;

  return (
    <div className="mos-category-page">
      <div className="container pt-4">
        {/* Breadcrumb */}
        <PagePath path={makeBreadcrumbPath()} />
      </div>

      {/* Brand Carousel */}
      <BrandsCarousel
        category={category}
        onBrandClick={handleBrandSelect}
        selectedBrand={selectedBrand}
      />

      <div className="container py-4">
        <div className="row" dir={currentLang === "ar" ? "rtl" : "ltr"}>
          {/* ---------------- Sidebar (Desktop) ---------------- */}
          <div className="col-lg-3 col-md-4 mb-4 d-none d-md-block">
            <FilterSidebar
              category={category}
              onApply={handleFilterApply}
              availableProducts={filterProductsByCategory()}
              selectedBrandFromCarousel={selectedBrand}
              currentFilters={filters}
              onClearAll={handleClearAll}
              searchQuery={searchQuery}
            />
          </div>

          {/* ---------------- Products Section ---------------- */}
          <div className="col-lg-9 col-md-8 col-12">
            <CategoryHeader
              category={category}
              sortBy={sortBy}
              onSortChange={handleSortChange}
              onMobileFilterClick={() => setShowMobileFilter(true)}
            />

            {currentProducts.length > 0 ? (
              <ProductsGrid
                products={currentProducts}
                currentPage={currentPage}
                totalProducts={filteredProducts.length}
                productsPerPage={productsPerPage}
                onPageChange={handlePageChange}
              />
            ) : (
              <NoProducts />
            )}
          </div>
        </div>

        {/* ---------------- Banners (optional) ---------------- */}
        {filteredProducts.length > 0 && (
          <div className="row mt-5">
            <div className="col-12">
              <KnowledgeBanners />
            </div>
          </div>
        )}
      </div>

      {/* ---------------- Mobile Filters Drawer ---------------- */}
      <MobileFilterSidebar
        show={showMobileFilter}
        onClose={() => setShowMobileFilter(false)}
        sortBy={sortBy}
        onSortChange={handleSortChange}
        category={category}
        onFilterApply={handleFilterApply}
        availableProducts={filterProductsByCategory()}
        selectedBrandFromCarousel={selectedBrand}
        currentFilters={filters}
        onClearAll={handleClearAll}
        searchQuery={searchQuery}
      />

      {/* ---------------- Compare List ---------------- */}
      {compare === "compare" && <CompareList />}
    </div>
  );
}

export default Category;
