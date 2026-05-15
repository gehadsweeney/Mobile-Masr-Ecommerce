import React from "react";
import "./BestItemResponse.css";
import { BsPatchCheckFill } from "react-icons/bs";
import { GoArrowRight } from "react-icons/go";
import { BsStars } from "react-icons/bs";

import { NavLink } from "react-router-dom";

function BestItemResponse({ aiRecommendation }) {
  const best = aiRecommendation.analysis.find(
    (item) => item.productId === aiRecommendation.bestProduct._id
  );
  return (
    <div className="abd-askAiBestItem-body-recommendation d-flex justify-content-center flex-wrap gap-4">
      {/* ================best-product-box================= */}
      <div className="abd-bestProductBox center flex-column gap-2">
        {/* -------------------badge------------------- */}
        <div className="abd-bestProductBox-badge d-flex align-items-center gap-2">
          <BsPatchCheckFill />
          <span>Best Product for you</span>
        </div>
        {/* -------------------image------------------- */}
        <div className="abd-bestProductBox-image">
          <img
            src={aiRecommendation.bestProduct.images[0]}
            alt={aiRecommendation.bestProduct.name}
          />
        </div>
        {/* -------------------name------------------- */}
        <h4 className="fw-bolder mb-0">{aiRecommendation.bestProduct.name}</h4>
        {/* -------------------reason------------------- */}
        {best && (
          <>
            <p className="abd-bestProductBox-reason text-center">
              {best.reason}
            </p>
            <div className="abd-bestProductBox-details center flex-wrap gap-2">
              <div className="abd-bestDetailContainer">
                <h6>{best.details.primaryLabel}</h6>
                <h4>{best.details.primaryValue}</h4>
              </div>
              <div className="abd-bestDetailContainer">
                <h6>{best.details.secondaryLabel}</h6>
                <h4>{best.details.secondaryValue}</h4>
              </div>
            </div>
            <NavLink
              to={`/products/${aiRecommendation.bestProduct._id}`}
              className="abd-showBestProdAllDetails"
            >
              Show All Details
              <GoArrowRight size={20} />
            </NavLink>
          </>
        )}
      </div>

      {/* ==================analysis===================== */}
      <div className="abd-analysisBox">
        <div className="abd-analysisBox-header d-flex align-items-center gap-2">
          <BsStars size={17} />
          <h4 className="mb-0">AI analysis of {aiRecommendation.criteria}</h4>
        </div>
        <div className="abd-analysisBox-body">
          {aiRecommendation.analysis.map((item) => (
            <div
              key={item.productId}
              className={`abd-analysisItem ${
                best.productId === item.productId ? "best" : ""
              }`}
            >
              {/* -------------------info-start------------------- */}
              <div className="abd-analysisItem-info">
                <h6 className="mb-1">{item.name}</h6>
                <div className="abd-analysisItem-score">
                  <progress
                    className={best.productId === item.productId ? "best" : ""}
                    value={item.score}
                    max="100"
                  ></progress>
                  <span>{item.score}/100</span>
                </div>
              </div>
              {/* -------------------info-end------------------- */}
            </div>
          ))}
          <div className="abd-analysisBox-summary mt-4">
            <h5 className="mt-4">AI Summary</h5>
            <p>{aiRecommendation.summary}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default BestItemResponse;

/*
 <div className="abd-askAiBestItem-body-recommendation">
      <h3>AI Recommendation:</h3>
      <pre>{JSON.stringify(aiRecommendation, null, 2)}</pre>
    </div>

AI Recommendation:
{
  "criteria": "Display quality",
  "analysis": [
    {
      "productId": "6905db1548005861762f56c1",
      "name": "Samsung Galaxy S24 Ultra 12GB RAM 512GB Titanium Black",
      "score": 95,
      "details": {
        "primaryLabel": "Display Size",
        "primaryValue": "6.8 inch",
        "secondaryLabel": "Resolution",
        "secondaryValue": "1440 x 3088 pixels"
      },
      "reason": "The Galaxy S24 Ultra features a large, high-resolution display that is known for its vibrant colors and excellent brightness, making it a top choice for display quality."
    },
    {
      "productId": "6907453e8b0535ef77dfb755",
      "name": "ZTE Nubia Red Magic 9 Pro Ram 16GB 512GB Cyclone Black",
      "score": 85,
      "details": {
        "primaryLabel": "Display Size",
        "primaryValue": "6.8 inch",
        "secondaryLabel": "Resolution",
        "secondaryValue": "1080 x 2400 pixels"
      },
      "reason": "While the Nubia Red Magic 9 Pro has a decent display size and resolution, it falls short compared to the Galaxy S24 Ultra in terms of color accuracy and brightness."
    },
    {
      "productId": "690714282e9a4f23ab59d639",
      "name": "iPhone 16 Plus 8GB RAM 256GB Pink",
      "score": 90,
      "details": {
        "primaryLabel": "Display Size",
        "primaryValue": "6.7 inch",
        "secondaryLabel": "Resolution",
        "secondaryValue": "1284 x 2778 pixels"
      },
      "reason": "The iPhone 16 Plus has a high-quality display with excellent color reproduction, but its resolution and size are slightly less impressive than the Galaxy S24 Ultra."
    }
  ],
  "bestProduct": {
    "_id": "6905db1548005861762f56c1",
    "name": "Samsung Galaxy S24 Ultra 12GB RAM 512GB Titanium Black",
    "description": "Samsung Galaxy S24 Ultra with 5000mAh battery, 6.8 inch screen, 200MP camera, dual SIM.",
    "condition": "used",
    "accessories": [
      "Original Box",
      "Pen",
      "USB"
    ],
    "batteryStatus": "Very Good",
    "guarantee": "30-days warranty",
    "price": 49750,
    "discount": 0,
    "priceAfterDiscount": 49750,
    "skuCode": "VU016680",
    "storage": "512GB",
    "ram": [
      "12GB"
    ],
    "stock": 1,
    "color": "Titanium Black",
    "batteryCapacity": "5000mAh",
    "simCard": "2-sim",
    "screenSize": "6.8 inch",
    "camera": "200MP",
    "weight": "233g",
    "images": [
      "https://res.cloudinary.com/dj1omur11/image/upload/v1761991010/Samsung_Galaxy_S24_Ultra_Ram_12_gb_512_gb_Titanium_Black_used_1_snz1xl.jpg",
      "https://res.cloudinary.com/dj1omur11/image/upload/v1761991010/Samsung_Galaxy_S24_Ultra_Ram_12_gb_512_gb_Titanium_Black_used_2_mmmico.jpg",
      "https://res.cloudinary.com/dj1omur11/image/upload/v1761991011/Samsung_Galaxy_S24_Ultra_Ram_12_gb_512_gb_Titanium_Black_used_3_ucfdyi.jpg"
    ],
    "category": {
      "_id": "6905c5d28216e066cfd9e0b3",
      "name": "Mobile Phone",
      "image": "https://res.cloudinary.com/dj1omur11/image/upload/v1761901417/Mobile_Phone_np8xnw.webp",
      "createdAt": "2025-11-01T08:33:22.245Z",
      "updatedAt": "2025-12-21T23:50:16.565Z",
      "__v": 0
    },
    "brand": {
      "_id": "68e43c6f97702dc47623e162",
      "name": "Samsung",
      "image": "https://res.cloudinary.com/dj1omur11/image/upload/v1762004461/samsung_onn85q.png"
    },
    "vendor": {
      "_id": "6905cc6948005861762f56b7",
      "name": "Hatly",
      "phone": "01012345678",
      "address": "156 Suez Road, Heliopolis, Cairo",
      "image": "https://res.cloudinary.com/dj1omur11/image/upload/v1761901444/Hatly_hpecko.jpg",
      "rating": 4.6,
      "createdAt": "2025-11-01T09:01:29.455Z",
      "updatedAt": "2025-11-01T09:01:29.455Z",
      "__v": 0
    },
    "date": "2025-11-01T10:04:05.128Z"
  },
  "summary": "The Samsung Galaxy S24 Ultra stands out as the best option for display quality, offering superior resolution and vibrant colors at a competitive price."
}
*/
