// src/utilities/useCategoryFilters.js

import { useState, useEffect, useCallback } from "react";
import {
  filterProductsByCategory,
  applyFilters,
  applySorting,
} from "./useFilterLogic";
import {
  buildUrlParams,
  parseFiltersFromUrl,
  parseSortFromUrl,
} from "./useUrlParams";

export const useCategoryFilters = (
  allProducts,
  category,
  searchParams,
  setSearchParams
) => {
  const [sortBy, setSortBy] = useState(
    () => searchParams.get("sort") || "newest"
  );
  const [selectedBrand, setSelectedBrand] = useState(null);
  const [filters, setFilters] = useState(() =>
    parseFiltersFromUrl(searchParams)
  );

  // Reset filters when category changes
  useEffect(() => {
    setSelectedBrand(null);
    setFilters({
      brands: [],
      priceRange: { min: 0, max: Infinity },
      condition: null,
      simCard: [],
      ram: [],
      storage: [],
      ssd: [],
      color: [],
    });
  }, [category]);

  // Sync filters + sort + brand highlight from URL
  useEffect(() => {
    const urlFilters = parseFiltersFromUrl(searchParams);
    const urlSort = parseSortFromUrl(searchParams);
    setFilters(urlFilters);
    setSortBy(urlSort);

    const brandsParam = searchParams.get("brands");
    if (brandsParam && !brandsParam.includes(",")) {
      const categoryProducts = filterProductsByCategory(allProducts, category);
      let foundBrandId = null;
      for (const p of categoryProducts) {
        if (p.brand && typeof p.brand === "object") {
          if (
            p.brand.name === brandsParam ||
            String(p.brand._id) === brandsParam
          ) {
            foundBrandId = p.brand._id;
            break;
          }
        }
      }
      const normalized = foundBrandId ? String(foundBrandId) : String(brandsParam);
      setSelectedBrand(normalized);
    } else if (brandsParam && brandsParam.includes(",")) {
      setSelectedBrand(null);
    }
  }, [searchParams, allProducts, category]);

  const getCategoryProducts = useCallback(() => {
    return filterProductsByCategory(allProducts, category);
  }, [allProducts, category]);

  const getFilteredAndSortedProducts = useCallback(() => {
    const categoryProducts = getCategoryProducts();

    // search من الـ URL (دلوقتي AI حط فيه normalized English)
    let searchQuery = searchParams.get("search")?.toLowerCase().trim();

    const afterSearch = searchQuery
      ? categoryProducts.filter((p) => {
          const brandName = p?.brand
            ? (typeof p.brand === "object" ? (p.brand?.name || "") : (p.brand || ""))
            : "";
          const categoryName = p?.category?.name || p?.category || "";
          const nameSafe = p?.name || "";
          const text = `${nameSafe} ${brandName} ${categoryName}`.toLowerCase();
          return text.includes(searchQuery);
        })
      : categoryProducts;

    const filteredProducts = applyFilters(
      afterSearch,
      filters,
      selectedBrand
    );
    return applySorting(filteredProducts, sortBy);
  }, [getCategoryProducts, filters, selectedBrand, sortBy, searchParams]);

  // Brand select from carousel
  const handleBrandSelect = useCallback(
    (brandId) => {
      setSelectedBrand(String(brandId));

      let brandNameForUrl = null;
      const categoryProducts = filterProductsByCategory(allProducts, category);
      for (const p of categoryProducts) {
        if (
          p.brand &&
          typeof p.brand === "object" &&
          String(p.brand._id) === String(brandId)
        ) {
          brandNameForUrl = p.brand.name;
          break;
        }
      }
      const brandValueForUrl = brandNameForUrl || brandId;

      const updatedFilters = { ...filters, brands: [] };
      setFilters(updatedFilters);

      const searchQuery = searchParams.get("search");
      const params = buildUrlParams(
        updatedFilters,
        sortBy,
        brandValueForUrl,
        1,
        searchQuery
      );
      setSearchParams(params);
    },
    [filters, sortBy, setSearchParams, allProducts, category, searchParams]
  );

  // Apply filters (sidebar/mobile)
  const handleFilterApply = useCallback(
    (filterData) => {
      const newFilters = {
        brands: filterData.filters.Brands || [],
        priceRange: {
          min: filterData.price?.[0] || 0,
          max: filterData.price?.[1] || Infinity,
        },
        condition:
          filterData.filters.Type && filterData.filters.Type.length > 0
            ? filterData.filters.Type[0].toLowerCase()
            : null,
        simCard: filterData.filters["Sim Card"] || [],
        ram: filterData.filters.Ram || [],
        storage: filterData.filters.Storage || [],
        ssd: filterData.filters.SSD || [],
        color: filterData.filters.Color || [],
      };

      setFilters(newFilters);

      // If user chose brands from sidebar, drop carousel brand to avoid overriding URL with id
      if (newFilters.brands.length > 0) {
        setSelectedBrand(null);
      }

      let brandValueForUrl = null;
      if (newFilters.brands.length === 0 && selectedBrand) {
        const categoryProducts = filterProductsByCategory(allProducts, category);
        for (const p of categoryProducts) {
          if (
            p.brand &&
            typeof p.brand === "object" &&
            String(p.brand._id) === String(selectedBrand)
          ) {
            brandValueForUrl = p.brand.name;
            break;
          }
        }
      }

      const searchQuery = searchParams.get("search");
      const params = buildUrlParams(
        newFilters,
        sortBy,
        newFilters.brands.length > 0 ? null : brandValueForUrl,
        1,
        searchQuery
      );
      setSearchParams(params);
    },
    [sortBy, selectedBrand, setSearchParams, allProducts, category, searchParams]
  );

  // Sort change
  const handleSortChange = useCallback(
    (sortOption) => {
      setSortBy(sortOption);
      const searchQuery = searchParams.get("search");
      setSearchParams(
        buildUrlParams(filters, sortOption, selectedBrand, 1, searchQuery)
      );
    },
    [filters, selectedBrand, setSearchParams, searchParams]
  );

  // Clear all filters (keep search if exists)
  const handleClearAll = useCallback(() => {
    setSelectedBrand(null);
    setFilters({
      brands: [],
      priceRange: { min: 0, max: Infinity },
      condition: null,
      simCard: [],
      ram: [],
      storage: [],
      ssd: [],
      color: [],
    });
    setSortBy("newest");

    const searchQuery = searchParams.get("search");
    if (searchQuery) {
      setSearchParams({ search: searchQuery });
    } else {
      setSearchParams({});
    }
  }, [setSearchParams, searchParams]);

  return {
    sortBy,
    selectedBrand,
    filters,
    filterProductsByCategory: getCategoryProducts,
    getFilteredAndSortedProducts,
    buildUrlParams: (page) => {
      const searchQuery = searchParams.get("search");
      return buildUrlParams(filters, sortBy, selectedBrand, page, searchQuery);
    },
    handleBrandSelect,
    handleFilterApply,
    handleSortChange,
    handleClearAll,
  };
};
