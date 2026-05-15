import { FILTER_GROUPS } from "./FilterData";

// Extract unique brands from available products
export const getAvailableBrands = (availableProducts) => {
  const brandsSet = new Set();
  availableProducts.forEach((product) => {
    if (product.brand) {
      const brandName =
        typeof product.brand === "object" ? product.brand.name : product.brand;
      if (brandName) brandsSet.add(brandName);
    }
  });
  return Array.from(brandsSet).sort();
};

// Define which filters to show per category
export const getFilterGroups = (category, availableProducts) => {
  const normalizedCategory = category?.toLowerCase().replace(/-/g, " ") || "";
  const availableBrands = getAvailableBrands(availableProducts);

  // Common filters for all categories
  const commonFilters = {
    Brands: availableBrands.length > 0 ? availableBrands : FILTER_GROUPS.Brands,
    Type: FILTER_GROUPS.Type,
  };

  // Category-specific filters
  if (
    normalizedCategory.includes("mobile") ||
    normalizedCategory.includes("phone")
  ) {
    return {
      ...commonFilters,
      "Sim Card": FILTER_GROUPS["Sim Card"],
      Ram: FILTER_GROUPS.Ram,
      Storage: FILTER_GROUPS.Storage,
      Color: FILTER_GROUPS.Color,
    };
  }

  if (normalizedCategory.includes("laptop")) {
    return {
      ...commonFilters,
      SSD: FILTER_GROUPS.SSD,
      Ram: FILTER_GROUPS.Ram,
      Color: FILTER_GROUPS.Color,
    };
  }

  if (normalizedCategory.includes("tablet")) {
    return {
      ...commonFilters,
      "Sim Card": FILTER_GROUPS["Sim Card"],
      Ram: FILTER_GROUPS.Ram,
      Storage: FILTER_GROUPS.Storage,
      Color: FILTER_GROUPS.Color,
    };
  }

  if (normalizedCategory.includes("watch")) {
    return {
      ...commonFilters,
      "Sim Card": FILTER_GROUPS["Sim Card"],
      Color: FILTER_GROUPS.Color,
    };
  }

  if (
    normalizedCategory.includes("earbuds") ||
    normalizedCategory.includes("headphone")
  ) {
    return {
      ...commonFilters,
      Color: FILTER_GROUPS.Color,
    };
  }

  if (
    normalizedCategory.includes("console") ||
    normalizedCategory.includes("playstation") ||
    normalizedCategory.includes("xbox")
  ) {
    return {
      ...commonFilters,
      Color: FILTER_GROUPS.Color,
    };
  }

  // Default: show common filters only
  return commonFilters;
};

// Find brand name from product by ID
export const findBrandNameById = (availableProducts, brandId) => {
  const product = availableProducts.find((p) => {
    if (!p || !p.brand) return false;
    if (typeof p.brand === "object" && p.brand !== null && "_id" in p.brand) {
      return p.brand._id === brandId;
    }
    return false;
  });

  if (product && product.brand) {
    return typeof product.brand === "object"
      ? product.brand.name
      : product.brand;
  }

  return null;
};
