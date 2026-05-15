import "./Home.css";
import ProductsSlider from "../../components/HomeComponents/ProductsSlider/ProductsSlider.jsx";
import MobileReviewsStatic from "../../components/HomeComponents/SiteReviews/SiteReviews.jsx";
import KnowledgeBanners from "../../components/HomeComponents/KnowledgeBanners/KnowledgeBanners.jsx";
import { useSelector } from "react-redux";
import HeroSlider from "../../components/HomeComponents/HeroSlider/HeroSlider.jsx";
import FeatureBar from "../../components/HomeComponents/FeatureBar/FeatureBar.jsx";
import BannerGrid from "../../components/HomeComponents/BannerGrid/BannerGrid.jsx";
import CategorySlider from "../../components/HomeComponents/CategorySlider/CategorySlider.jsx";
import Loader from "../../components/GlobalComponents/Loader/Loader.jsx";
import BrandBanners from "../../components/HomeComponents/BrandBanner/BrandBanner.jsx";
import ProductsBanners from "../../components/HomeComponents/ProductsBanner/ProductsBanner.jsx";
import { useTranslation } from "react-i18next";
import { useEffect } from "react";
import axios from "axios";

function Home() {
  useEffect(() => {
    axios.post(`${import.meta.env.VITE_API_URL}/track`).catch(() => {});
  }, []);
  const { t } = useTranslation();
  const allProducts = useSelector((store) => store.products.data) || [];
  const isLoading = useSelector((store) => store.products.isLoading);
  if (isLoading && allProducts.length === 0) {
    return <Loader />;
  }
  // const products = allProducts.filter((p) => p.category?.name != "Laptop");
  const newProducts = allProducts.filter(
    (p) => p.condition == "new" || p.condition == "جديد",
  );
  const usedProducts = allProducts.filter(
    (p) => p.condition == "used" || p.condition == "مستعمل",
  );
  // console.log("Products from Redux Store:", allProducts);
  return (
    <>
      {/*geh-Header*/}
      <HeroSlider />
      <FeatureBar />
      <CategorySlider />
      <BannerGrid />

      {/*geh-Card*/}
      <div className="container mt-5">
        <ProductsSlider
          title={t("All Products")}
          products={allProducts}
          seeMoreLink="/category/all"
        />
        <BrandBanners />
        <ProductsSlider
          title={t("New Products")}
          products={newProducts}
          seeMoreLink="/category/all?type=new"
        />
        <ProductsBanners />
        <ProductsSlider
          title={t("Used Products")}
          products={usedProducts}
          seeMoreLink="/category/all?type=used"
        />
      </div>
      <div className="mt-10">
        <MobileReviewsStatic />
      </div>
      <KnowledgeBanners />
    </>
  );
}

export default Home;
