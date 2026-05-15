import React, { useState, useCallback, useEffect } from "react";
import { FiSliders } from "react-icons/fi";
import { MIN_PRICE, MAX_PRICE } from "./FilterData";
import { getFilterGroups, findBrandNameById } from "./FilterUtils";
import FilterGroup from "./FilterGroup";
import PriceFilter from "./PriceFilter";
import FilterActions from "./FilterActions";

import "./Filter.css";
import { useTranslation } from "react-i18next";

const FilterSidebar = ({
  onApply,
  category,
  availableProducts = [],
  selectedBrandFromCarousel = null,
  currentFilters = {},
  onClearAll,
  searchQuery = null, // AI canonical search now supported
}) => {
  const [openKeys, setOpenKeys] = useState(() => new Set());
  const [selected, setSelected] = useState(() => ({}));
  const [price, setPrice] = useState([MIN_PRICE, MAX_PRICE]);

  /* -----------------------------------------------------------
      Reset accordion when category changes
  ----------------------------------------------------------- */
  useEffect(() => {
    setOpenKeys(new Set());
  }, [category]);

  /* -----------------------------------------------------------
      Sync brand from carousel
  ----------------------------------------------------------- */
  useEffect(() => {
    if (selectedBrandFromCarousel) {
      const brandName = findBrandNameById(
        availableProducts,
        selectedBrandFromCarousel
      );
      if (brandName) {
        setSelected((prev) => ({ ...prev, Brands: [brandName] }));
      }
    } else if (currentFilters.brands?.length === 0) {
      setSelected((prev) => {
        const newSelected = { ...prev };
        delete newSelected.Brands;
        return newSelected;
      });
    }
  }, [selectedBrandFromCarousel, availableProducts, currentFilters.brands]);

  /* -----------------------------------------------------------
      Sync all filters from URL (including searchQuery from AI)
  ----------------------------------------------------------- */
  useEffect(() => {
    const newSelected = {};

    if (currentFilters.brands?.length > 0)
      newSelected.Brands = currentFilters.brands;
    if (currentFilters.ram?.length > 0) newSelected.Ram = currentFilters.ram;
    if (currentFilters.storage?.length > 0)
      newSelected.Storage = currentFilters.storage;
    if (currentFilters.ssd?.length > 0) newSelected.SSD = currentFilters.ssd;
    if (currentFilters.color?.length > 0)
      newSelected.Color = currentFilters.color;
    if (currentFilters.simCard?.length > 0)
      newSelected["Sim Card"] = currentFilters.simCard;

    if (currentFilters.condition) {
      const capitalized =
        currentFilters.condition.charAt(0).toUpperCase() +
        currentFilters.condition.slice(1).toLowerCase();
      newSelected.Type = [capitalized];
    }

    setSelected(newSelected);

    // Sync price
    if (currentFilters.priceRange) {
      const min = currentFilters.priceRange.min || MIN_PRICE;
      const max =
        currentFilters.priceRange.max === Infinity
          ? MAX_PRICE
          : currentFilters.priceRange.max;

      setPrice([min, max]);
    }
  }, [currentFilters]);

  /* -----------------------------------------------------------
      Available filters based on products
  ----------------------------------------------------------- */
  const availableFilters = getFilterGroups(category, availableProducts);

  /* -----------------------------------------------------------
      Toggle accordion
  ----------------------------------------------------------- */
  const toggleOpen = (key) => {
    setOpenKeys((prev) => {
      const next = new Set(prev);
      next.has(key) ? next.delete(key) : next.add(key);
      return next;
    });
  };

  /* -----------------------------------------------------------
      Toggle filter values
  ----------------------------------------------------------- */
  const toggleValue = (group, value) => {
    setSelected((prev) => {
      const next = { ...prev };
      const current = new Set(next[group] || []);
      current.has(value) ? current.delete(value) : current.add(value);
      next[group] = Array.from(current);
      return next;
    });
  };

  /* -----------------------------------------------------------
      Clear All Filters
  ----------------------------------------------------------- */
  const clearAll = () => {
    setSelected({});
    setPrice([MIN_PRICE, MAX_PRICE]);

    if (onClearAll) onClearAll();
    else if (onApply) onApply({ filters: {}, price: [MIN_PRICE, MAX_PRICE] });
  };

  /* -----------------------------------------------------------
      Apply filters
  ----------------------------------------------------------- */
  const applyFilters = useCallback(() => {
    const payload = { filters: selected, price };
    if (onApply) onApply(payload);
  }, [selected, price, onApply]);

  const { t } = useTranslation();

  return (
    <aside className="mos-filter-panel">
      <div className="mos-filter-panel__header">
        <FiSliders className="mos-filter-panel__icon" />
        <span>{t("Filter")}</span>
      </div>

      {/* -----------------------------------------------------------
          🔍 AI Search Badge — uses canonical searchQuery
      ----------------------------------------------------------- */}
      {searchQuery && (
        <div className="mos-filter-search-badge">
          <div className="mos-search-badge-label">
            <span className="mos-badge-icon">🔍</span>
            <span className="mos-badge-text">
              {t("Search")}: "{searchQuery}"
            </span>
          </div>
        </div>
      )}

      {/* -----------------------------------------------------------
          Filter Groups
      ----------------------------------------------------------- */}
      <div className="mos-filter-panel__groups">
        {Object.entries(availableFilters).map(([group, options]) => (
          <FilterGroup
            key={group}
            group={group}
            options={options}
            isOpen={openKeys.has(group)}
            selected={selected[group]}
            onToggleOpen={() => toggleOpen(group)}
            onToggleValue={(value) => toggleValue(group, value)}
          />
        ))}

        {/* Price Filter */}
        <PriceFilter
          price={price}
          isOpen={openKeys.has("Price")}
          onToggleOpen={() => toggleOpen("Price")}
          onPriceChange={setPrice}
        />
      </div>

      {/* -----------------------------------------------------------
          Apply + Clear Buttons
      ----------------------------------------------------------- */}
      <FilterActions onApply={applyFilters} onClear={clearAll} />
    </aside>
  );
};

export default FilterSidebar;
