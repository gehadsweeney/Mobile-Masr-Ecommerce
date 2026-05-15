import React from "react";
import Card from "../../GlobalComponents/Card/Card";
import Pagination from "../../GlobalComponents/Pagination/Pagination";

function ProductsGrid({ products, currentPage, totalProducts, productsPerPage, onPageChange }) {
  return (
    <>
      <div className="row g-3 justify-content-center">
        {products.map((product) => (
          <div
            key={product._id}
            className="col-lg-4 col-sm-6 col-12"
            style={{ maxWidth: "350px" }}
          >
            <Card product={product} />
          </div>
        ))}
      </div>

      <Pagination
        currentPage={currentPage}
        totalProducts={totalProducts}
        productsPerPage={productsPerPage}
        onPageChange={onPageChange}
      />
    </>
  );
}

export default ProductsGrid;
