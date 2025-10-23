import React, { useState } from "react";
import { useTranslations } from "next-intl";
//import "./CatalogProduct.css";

interface FilterDropdownProps {
  onFilterChange: (filters: any) => void;
}

const FilterDropdown: React.FC<FilterDropdownProps> = ({ onFilterChange }) => {
  const [showDropdown, setShowDropdown] = useState(false);
  const t = useTranslations("freeCatalog.catalog.filters");
  const [priceRange, setPriceRange] = useState<[number, number]>([50, 10000]);
  const [sortBy, setSortBy] = useState("");
  const [itemStatus, setItemStatus] = useState("");

  const toggleDropdown = () => setShowDropdown(!showDropdown);

  const applyFilters = () => {
    onFilterChange({
      sortBy,
      itemStatus,
      minPrice: priceRange[0],
      maxPrice: priceRange[1],
    });
    setShowDropdown(false); // Close dropdown after applying
  };

  const handlePriceChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    index: number
  ) => {
    const newRange = [...priceRange] as [number, number];
    newRange[index] = parseInt(e.target.value);
    setPriceRange(newRange);
  };

  return (
    <div className="filter-wrapper">
      <button className="filter-btn" onClick={toggleDropdown}>
        <label className="filter-label" />
      </button>

      {showDropdown && (
        <div className="filter-dropdown">
          {/* Sort By */}
          <div className="filter-option">
            <label>{t("sortBy.label")}</label>
            <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
              <option value="">{t("sortBy.options.select")}</option>
              <option value="latest">{t("sortBy.options.latest")}</option>
              <option value="priceLowHigh">
                {t("sortBy.options.priceLowHigh")}
              </option>
              <option value="priceHighLow">
                {t("sortBy.options.priceHighLow")}
              </option>
            </select>
          </div>

          {/* Stock Status */}
          <div className="filter-option">
            <label>{t("stockStatus.label")}</label>
            <select
              value={itemStatus}
              onChange={(e) => setItemStatus(e.target.value)}
            >
              <option value="">{t("stockStatus.all")}</option>
              <option value="inStock">{t("stockStatus.inStock")}</option>
              <option value="outOfStock">{t("stockStatus.outOfStock")}</option>
            </select>
          </div>

          {/* Price Range */}
          <div className="filter-option">
            <label>{t("priceRange.label")}</label>
            <div className="price-slider">
              <input
                type="range"
                min="0"
                max="10000"
                step="10"
                value={priceRange[0]}
                onChange={(e) => handlePriceChange(e, 0)}
              />
              <input
                type="range"
                min="0"
                max="10000"
                step="10"
                value={priceRange[1]}
                onChange={(e) => handlePriceChange(e, 1)}
              />
              <div className="price-values">
                <span>₹{priceRange[0]}</span> - <span>₹{priceRange[1]}</span>
              </div>
            </div>
          </div>

          <button onClick={applyFilters} className="apply-filter-btn">
            {t("apply")}
          </button>
        </div>
      )}
    </div>
  );
};

export default FilterDropdown;
