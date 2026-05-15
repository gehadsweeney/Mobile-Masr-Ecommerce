import React from "react";
import "./TableComparison.css";
import { GiCharging } from "react-icons/gi";
import { BsBoxSeam, BsUsbPlug, BsEarbuds } from "react-icons/bs";
import { PiDeviceMobileSpeakerLight as MobileCover } from "react-icons/pi";
import { LiaPencilAltSolid } from "react-icons/lia";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";

function TableComparison({ compareItems }) {
  const { t } = useTranslation();
  const currentLang = useSelector((state) => state.language.currentLang);
  const renderAccessory = (acc) => {
    if (!acc) return acc;
    const a = acc.toLowerCase();
    if (a.toLowerCase() === "earbuds" || a.toLowerCase() === "سماعات أذن")
      return <BsEarbuds />;
    if (a.toLowerCase() === "charger" || a.toLowerCase() === "شاحن")
      return <GiCharging />;
    if (
      a.toLowerCase() === "original box" ||
      a.toLowerCase() === "العلبة الأصلية"
    )
      return <BsBoxSeam />;
    if (a.toLowerCase() === "usb" || a.toLowerCase() === "كابل usb")
      return <BsUsbPlug />;
    if (a.toLowerCase() === "cover" || a.toLowerCase() === "غطاء")
      return <MobileCover />;
    if (a.toLowerCase() === "pen" || a.toLowerCase() === "قلم")
      return <LiaPencilAltSolid />;
    return acc;
  };

  const rows = [
    { label: "Name", cell: (it) => it.name },
    { label: "Brand", cell: (it) => it.brand?.name || "-" },
    {
      label: "Discount",
      cell: (it) => (it.discount == 0 ? "No Discount" : `${it.discount}%`),
    },
    { label: "Price", cell: (it) => `${it.priceAfterDiscount} EGP` },
    { label: "Description", cell: (it) => it.description || "-" },
    { label: "Guarantee", cell: (it) => it.guarantee || "-" },
    { label: "Condition", cell: (it) => it.condition || "-" },
    { label: "SKU", cell: (it) => it.skuCode || "-" },
    { label: "Storage", cell: (it) => it.storage || "-" },
    {
      label: "RAM",
      cell: (it) =>
        it.ram ? (Array.isArray(it.ram) ? it.ram.join(", ") : it.ram) : "-",
    },
    { label: "Battery Capacity", cell: (it) => it.batteryCapacity || "-" },
    { label: "Battery Status", cell: (it) => it.batteryStatus || "-" },
    { label: "SIM Card", cell: (it) => it.simCard || "-" },
    { label: "Screen Size", cell: (it) => it.screenSize || "-" },
    { label: "Camera", cell: (it) => it.camera || "-" },
    { label: "Weight", cell: (it) => it.weight || "-" },
    { label: "SSD", cell: (it) => it.ssd || "-" },
    { label: "HDD", cell: (it) => it.hdd || "-" },
    { label: "GPU", cell: (it) => it.gpu || "-" },
    { label: "Processor", cell: (it) => it.processor || "-" },
    {
      label: "Accessories",
      cell: (it) =>
        it.accessories && it.accessories.length > 0 ? (
          <div className="d-flex flex-wrap gap-2">
            {it.accessories.map((a, i) => (
              <span key={i} className="d-flex align-items-center gap-1">
                <span className="me-1">{renderAccessory(a)}</span>
                <small>{a}</small>
              </span>
            ))}
          </div>
        ) : (
          "-"
        ),
    },
    {
      label: "Color",
      cell: (it) =>
        it.color ? (
          <div className="d-flex align-items-center gap-2">
            <span
              className="compare-color-box"
              style={{
                background: it.color,
                width: 20,
                height: 20,
                display: "inline-block",
                borderRadius: 4,
              }}
            />
            <span>{it.color}</span>
          </div>
        ) : (
          "-"
        ),
    },
  ];

  const isEmptyValue = (v) => {
    if (v === null || v === undefined) return true;
    if (typeof v === "string") return v.trim() === "" || v === "-";
    if (Array.isArray(v)) return v.length === 0;
    return false; // objects/JSX considered non-empty
  };

  const rowHasData = (row) => {
    return compareItems.some((item) => {
      try {
        const val = row.cell(item);
        return !isEmptyValue(val);
      } catch (e) {
        console.error("Error evaluating row cell:", e);
        return true; // if cell throws (unlikely), keep the row
      }
    });
  };

  const visibleRows = rows.filter(rowHasData);
  return (
    <div
      className="table-responsive"
      dir={currentLang === "ar" ? "rtl" : "ltr"}
    >
      <table className="table table-bordered table-hover table-striped align-middle abd-comparison-table">
        <thead>
          <tr>
            <th>{t("Details")}</th>
            {compareItems.map((item) => (
              <th key={item._id} className="text-center">
                <img
                  src={item.images?.[0]}
                  alt={item.name}
                  className="abd-comparison-image img-fluid mb-2"
                />
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {visibleRows.map((row) => (
            <tr key={row.label}>
              <td className="fw-semibold">{t(row.label)}</td>
              {compareItems.map((item) => (
                <td key={item._id + row.label}>{row.cell(item)}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default TableComparison;
