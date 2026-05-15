import React from "react";
import "./CategoriesContainer.css";

const CategoriesContainer = () => {
  const items = [
    {
      id: 1,
      title: "Mobile Phone",
      img: "https://static.mobilemasr.com/public/categories/683d9cfd3e58f_1748868349.webp",
      href: "https://example.com/mobile",
    },
    {
      id: 2,
      title: "Tablet",
      img: "https://static.mobilemasr.com/public/categories/683d9cf256d52_1748868338.webp",
      href: "https://example.com/tablet",
    },
    {
      id: 3,
      title: "Smart watches",
      img: "https://static.mobilemasr.com/public/categories/683d9ce6ecda7_1748868326.webp",
      href: "https://example.com/watch",
    },
    {
      id: 4,
      title: "Wireless Earbuds",
      img: "https://static.mobilemasr.com/public/categories/683d9cdb5a56d_1748868315.webp",
      href: "https://example.com/earbuds",
    },
    {
      id: 5,
      title: "Game Consoles",
      img: "https://static.mobilemasr.com/public/categories/683d9cd308f81_1748868307.webp",
      href: "https://example.com/console",
    },
    {
      id: 6,
      title: "Laptop",
      img: "https://static.mobilemasr.com/public/categories/683d9cc4c1307_1748868292.webp",
      href: "https://example.com/laptop",
    },
  ];
  return (
    <div>
      <div className="heb-categories-container">
        {items.map((it) => (
          <a
            key={it.id}
            href={it.href}
            target="_blank"
            rel="noreferrer"
            className="heb-category-card"
          >
            <div className="heb-image-box">
              <img src={it.img} alt={it.title} />
            </div>
            <span className="heb-title">{it.title}</span>
          </a>
        ))}
      </div>
    </div>
  );
};

export default CategoriesContainer;
