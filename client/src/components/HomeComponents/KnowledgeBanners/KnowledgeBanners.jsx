import { useTranslation } from "react-i18next";

export default function KnowledgeBanners() {
  const imgs = [
    "https://static.mobilemasr.com/public/settings/banners/68f777dc364d2_1761048540.png",
    "https://static.mobilemasr.com/public/settings/banners/68f777dc44d68_1761048540.png",
    "https://static.mobilemasr.com/public/settings/banners/68f777dc58aa3_1761048540.png",
  ];
  const { t } = useTranslation();

  return (
    <div className="container mt-5">
      <div className="text-center w-100 mt-4">
        <h6
          className="text-gray-700 font-medium text-base my-3 position-relative"
          style={{
            paddingBottom: "8px",
            borderBottom: "2px solid #ff7b00",
            color: "#333",
            fontSize: "20px",
            display: "inline-block",
          }}
        >
          {t("Knowledgebase Center")}
        </h6>
      </div>

      <div className="d-flex justify-content-center gap-3 flex-wrap mt-4">
        {imgs.map((src, i) => (
          <img
            key={i}
            src={src}
            style={{
              width: "350px",
              height: "auto",
              borderRadius: "16px",
              cursor: "pointer",
              transition: "0.3s",
            }}
            className="shadow-sm"
            alt="section banner"
          />
        ))}
      </div>
    </div>
  );
}
