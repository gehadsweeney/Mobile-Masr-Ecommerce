import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import "swiper/css";
import "./BrandsCarousel.css";

const BrandsCarousel = ({ category, onBrandClick, selectedBrand }) => {
  const [brands, setBrands] = useState([]);
  const allProducts = useSelector((state) => state?.products?.data || []);

  useEffect(() => {
    if (!allProducts.length) return;

    // Normalize category name; treat "all" (or missing) as no category filter
    const normalizedCategory = (category || "").toLowerCase().replace(/-/g, " ").trim();

    const categoryProducts =
      !normalizedCategory || normalizedCategory === "all"
        ? allProducts
        : allProducts.filter((product) => {
            const productCategory = product?.category?.name?.toLowerCase() || "";
            return (
              productCategory.includes(normalizedCategory) ||
              normalizedCategory.includes(productCategory)
            );
          });

    // Extract unique brands
    const uniqueBrands = [];
    const brandMap = new Map();

    categoryProducts.forEach((product) => {
      if (product.brand && typeof product.brand === "object") {
        const brandId = product.brand._id;
        if (!brandMap.has(brandId)) {
          brandMap.set(brandId, product.brand);
          uniqueBrands.push(product.brand);
        }
      }
    });

    setBrands(uniqueBrands);
  }, [category, allProducts]);

  if (brands.length === 0) return null;

  return (
    <div className="mos-brands-carousel-wrapper">
      <div className="container">
        <Swiper
          modules={[Autoplay]}
          spaceBetween={15}
          slidesPerView={8}
          autoplay={{ delay: 2500, disableOnInteraction: false }}
          loop={brands.length > 8}
          breakpoints={{
            320: { slidesPerView: 3 },
            480: { slidesPerView: 4 },
            768: { slidesPerView: 6 },
            1024: { slidesPerView: 8 },
          }}
          className="mos-brands-swiper"
        >
          {brands.map((brand) => (
            <SwiperSlide key={brand._id}>
              <div
                className={`mos-brand-card ${
                  String(selectedBrand) === String(brand._id) ? "active" : ""
                }`}
                onClick={() => onBrandClick(brand._id)}
              >
                <img
                  src={brand.image}
                  alt={brand.name}
                  className="mos-brand-image"
                />
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </div>
  );
};

export default BrandsCarousel;
