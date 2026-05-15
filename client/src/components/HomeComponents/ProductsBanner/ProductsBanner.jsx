import "./ProductsBanner.css";

function ProductsBanners() {
  return (
    <div className="mos-products-banners container my-5">
      <div className="mos-products-banner-grid">
        <img
          src="https://res.cloudinary.com/dj1omur11/image/upload/v1765293070/iphone15_lqwj3k.webp"
          alt="iPhone 15"
        />
        <img
          src="https://res.cloudinary.com/dj1omur11/image/upload/v1765293069/iphone15promax_bdv1id.webp"
          alt="iPhone 15 Pro Max"
        />
        <img
          src="https://res.cloudinary.com/dj1omur11/image/upload/v1765293068/iphone16pro_dceied.webp"
          alt="iPhone 16 Pro"
        />
        <img
          src="https://res.cloudinary.com/dj1omur11/image/upload/v1765293069/iphone16promax_vjapy5.webp"
          alt="iPhone 16 Pro Max"
        />
      </div>
    </div>
  );
}

export default ProductsBanners;
