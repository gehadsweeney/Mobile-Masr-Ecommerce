// src/components/Navbar/SearchInput/SearchInput.jsx

import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import { CiSearch } from "react-icons/ci";
import { IoClose } from "react-icons/io5";

import {
  searchProductsWithAI,
  getLiveSuggestions,
} from "../../../services/aiSearchService";

import "./SearchInput.css";
import { useTranslation } from "react-i18next";

function SearchInput() {
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [showMobileSearch, setShowMobileSearch] = useState(false);
  const { t } = useTranslation();

  const navigate = useNavigate();
  const allProducts = useSelector((state) => state?.products?.data || []);

  const dropdownRef = useRef(null);
  const mobileInputRef = useRef(null);

  // ---------- Focus mobile input when opened ---------- //
  useEffect(() => {
    if (showMobileSearch && mobileInputRef.current) {
      mobileInputRef.current.focus();
    }
  }, [showMobileSearch]);

  // ---------- LIVE suggestions ---------- //
  useEffect(() => {
    if (query.length >= 2) {
      const matches = getLiveSuggestions(query, allProducts, 20);
      setSuggestions(matches);
      setShowSuggestions(matches.length > 0);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  }, [query, allProducts]);

  // ---------- Close dropdown on outside click ---------- //
  useEffect(() => {
    const handleClick = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  // ---------- MAIN SEARCH ---------- //
  const handleSearch = async (e) => {
    e.preventDefault();

    if (!query.trim()) {
      toast.warning(t("Please enter a search term"));
      return;
    }

    setIsSearching(true);
    setShowSuggestions(false);

    try {
      const { matchedProducts, ai, categorySlug } = await searchProductsWithAI(
        query,
        allProducts
      );

      if (!matchedProducts || matchedProducts.length === 0) {
        toast.info(t("No products found. Try different keywords."));
        setIsSearching(false);
        return;
      }

      // منتج واحد → روح لصفحة المنتج
      if (matchedProducts.length === 1 && matchedProducts[0]?._id) {
        navigate(`/products/${matchedProducts[0]._id}`);
        toast.success(t("Showing selected product"));
        setIsSearching(false);
        return;
      }

      // نحدد الكاتيجوري من الـ AI (أو all لو مش واضح)
      const catPath = categorySlug || "all";

      const params = new URLSearchParams();

      // search في الـ URL يكون normalized English (من AI لو موجود)
      const searchValue =
        ai?.normalizedQuery && !/[\u0600-\u06FF]/.test(ai.normalizedQuery)
          ? ai.normalizedQuery
          : query;
      params.set("search", searchValue);

      // لو فيه براند من الـ AI ضيفه في الـ URL
      if (ai?.brand) {
        params.set("brands", ai.brand);
      }

      navigate(`/category/${catPath}?${params.toString()}`);

      toast.success(t("Showing results for") + ` "${searchValue}"`);
    } catch (err) {
      console.error("AI Search error:", err);
      toast.error(t("Search failed. Please try again."));
    } finally {
      setIsSearching(false);
    }
  };

  // ---------- Click on suggestion → open product ---------- //
  const handleSuggestionClick = (product) => {
    if (!product?._id) return;
    navigate(`/products/${product._id}`);
    setQuery("");
    setShowSuggestions(false);
  };

  return (
    <div className="abd-SearchBox" ref={dropdownRef}>
      {/* Desktop Search - Hide on small screens */}
      <form onSubmit={handleSearch} className="w-100 abd-desktop-search">
        <input
          type="search"
          name="search"
          placeholder={t("What are you looking for today?")}
          className="abd-NavInputSerach w-100 p-3"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          disabled={isSearching}
        />

        {isSearching && (
          <div className="mos-search-loading">
            <span className="spinner-border spinner-border-sm"></span>
          </div>
        )}
      </form>

      {/* Mobile Search Icon */}
      <button
        className="abd-mobile-search-icon"
        onClick={() => setShowMobileSearch(!showMobileSearch)}
        type="button"
        aria-label="Search"
      >
        {showMobileSearch ? <IoClose size={24} /> : <CiSearch size={24} />}
      </button>

      {/* Mobile Search Bar */}
      {showMobileSearch && (
        <form onSubmit={handleSearch} className="abd-mobile-search-form">
          <input
            ref={mobileInputRef}
            type="search"
            name="search"
            placeholder={t("What are you looking for today?")}
            className="abd-mobile-search-input"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            disabled={isSearching}
            autoComplete="off"
          />
        </form>
      )}

      {showSuggestions && suggestions.length > 0 && (
        <div className="mos-search-suggestions-dropdown">
          {suggestions.map((product) => (
            <div
              key={product._id}
              className="mos-search-suggestion-item"
              onClick={() => handleSuggestionClick(product)}
            >
              <img
                src={product.images?.[0] || "/placeholder.png"}
                alt={product.name}
                className="mos-search-suggestion-image"
              />
              <div className="mos-search-suggestion-details">
                <div className="mos-search-suggestion-name">{product.name}</div>
                <div className="mos-search-suggestion-brand">
                  {typeof product.brand === "object"
                    ? product.brand.name
                    : product.brand}
                </div>
                <div className="mos-search-suggestion-price">
                  {product.priceAfterDiscount || product.price} {t("EGP")}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default SearchInput;
