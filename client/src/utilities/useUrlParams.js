// -------------------------------------------------------------
export const buildUrlParams = (
  filters,
  sortBy,
  selectedBrand,
  page = 1,
  searchQuery = null
) => {
  const params = {};

  /* -----------------------------------------------------------
       ALWAYS KEEP AI SEARCH CANONICAL TERM IN URL
  ----------------------------------------------------------- */
  if (searchQuery) {
    params.search = searchQuery;
  }

  /* -----------------------------------------------------------
       BRAND HANDLING (carousel OR sidebar)
  ----------------------------------------------------------- */
  // Prefer sidebar brands (names) if present; otherwise fall back to carousel selection
  if (filters.brands && filters.brands.length > 0) {
    params.brands = filters.brands.join(",");
  } else if (selectedBrand) {
    params.brands = selectedBrand;
  }

  /* -----------------------------------------------------------
       PRICE RANGE
  ----------------------------------------------------------- */
  const defaultMin = 0;
  const defaultMax = 199000;

  const min = filters.priceRange?.min ?? defaultMin;
  const max = filters.priceRange?.max ?? defaultMax;

  const minChanged = min !== defaultMin;
  const maxChanged = max !== defaultMax && max < Infinity;

  if (minChanged) params.minPrice = min;
  if (maxChanged) params.maxPrice = max;

  /* -----------------------------------------------------------
       Condition (Type: new/used)
  ----------------------------------------------------------- */
  if (filters.condition) {
    params.type = filters.condition;
  }

  /* -----------------------------------------------------------
       Sim Card
  ----------------------------------------------------------- */
  if (filters.simCard?.length > 0) {
    params.simCard = filters.simCard.join(",");
  }

  /* -----------------------------------------------------------
      RAM
  ----------------------------------------------------------- */
  if (filters.ram?.length > 0) {
    params.ram = filters.ram.join(",");
  }

  /* -----------------------------------------------------------
      Storage
  ----------------------------------------------------------- */
  if (filters.storage?.length > 0) {
    params.storage = filters.storage.join(",");
  }

  /* -----------------------------------------------------------
      SSD
  ----------------------------------------------------------- */
  if (filters.ssd?.length > 0) {
    params.ssd = filters.ssd.join(",");
  }

  /* -----------------------------------------------------------
      Color
  ----------------------------------------------------------- */
  if (filters.color?.length > 0) {
    params.color = filters.color.join(",");
  }

  /* -----------------------------------------------------------
       Sorting
  ----------------------------------------------------------- */
  if (sortBy !== "newest") {
    params.sort = sortBy;
  }

  /* -----------------------------------------------------------
      Pagination
  ----------------------------------------------------------- */
  if (page > 1) {
    params.page = page;
  }

  return params;
};


// -------------------------------------------------------------
// Parse URL params → produce sidebar filter object
// -------------------------------------------------------------
export const parseFiltersFromUrl = (searchParams) => {
  const filters = {
    brands: [],
    priceRange: { min: 0, max: Infinity },
    condition: null,
    simCard: [],
    ram: [],
    storage: [],
    ssd: [],
    color: [],
  };

  // Brands
  const brands = searchParams.get("brands");
  if (brands) {
    filters.brands = brands.split(",").filter(Boolean);
  }

  // Price
  const minPrice = searchParams.get("minPrice");
  const maxPrice = searchParams.get("maxPrice");
  if (minPrice) filters.priceRange.min = parseFloat(minPrice);
  if (maxPrice) filters.priceRange.max = parseFloat(maxPrice);

  // Condition (new/used)
  const type = searchParams.get("type");
  if (type) filters.condition = type;

  // Sim Card
  const simCard = searchParams.get("simCard");
  if (simCard) filters.simCard = simCard.split(",").filter(Boolean);

  // RAM
  const ram = searchParams.get("ram");
  if (ram) filters.ram = ram.split(",").filter(Boolean);

  // Storage
  const storage = searchParams.get("storage");
  if (storage) filters.storage = storage.split(",").filter(Boolean);

  // SSD
  const ssd = searchParams.get("ssd");
  if (ssd) filters.ssd = ssd.split(",").filter(Boolean);

  // Color
  const color = searchParams.get("color");
  if (color) filters.color = color.split(",").filter(Boolean);

  return filters;
};


// -------------------------------------------------------------
// Parse sorting type from URL
// -------------------------------------------------------------
export const parseSortFromUrl = (searchParams) => {
  return searchParams.get("sort") || "newest";
};
