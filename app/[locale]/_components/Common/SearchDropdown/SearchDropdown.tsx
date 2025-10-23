"use client";
import Typography from "@/app/[locale]/_components/Base/Typography";
import {
  SearchCloseIcon,
  SearchIcon,
} from "@/app/[locale]/_components/Icons/SVGIcons";
import { useLazySearchProductsQuery } from "@/app/[locale]/_store/apiReducer/marketApi";
import { useLocale, useTranslations } from "next-intl";
// import Link from "next/link";
import { SearchProductResult } from "@/app/[locale]/_interface/MarketPlaceInterface";
import {
  setProductListPageNo,
  setProductSearch,
} from "@/app/[locale]/_store/reducers/filters_store";
import { useAppDispatch, useAppSelector } from "@/app/[locale]/_store/store";
import { usePathname, useRouter } from "next/navigation";
import { KeyboardEvent, useEffect, useState } from "react";
import styles from "./SearchDropdown.module.css";
import { useDebounce } from "@/app/[locale]/_hooks/useDebounce";

interface SearchDropdownProps {
  placeholder?: string;
  className?: string;
  onSearch?: (searchTerm: string) => void;
  showIcon?: boolean;
  searchDelay?: number;
  maxResults?: number;
  isNoPlaceholder?: boolean;
}

const SearchDropdown = ({
  placeholder,
  className = "",
  onSearch,
  showIcon = true,
  isNoPlaceholder = false,
  // searchDelay = 300,
  maxResults = 5,
}: SearchDropdownProps) => {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const searchQuery = useAppSelector(
    (state) => state.filterData.productSearchQuery
  );
  const pathname = usePathname();
  const locale = useLocale();

  const constructImageUrl = (imageSrc: string): string => {
    if (!imageSrc) return "";

    // If it's already a full URL, return as is
    if (imageSrc.startsWith("http://") || imageSrc.startsWith("https://")) {
      return imageSrc;
    }

    // Construct full URL using API base URL
    const baseUrl =
      process.env.NEXT_PUBLIC_BUCKET_URL ||
      "https://pepagora.s3.ap-south-1.amazonaws.com/";
    return `${baseUrl}${imageSrc}`;
  };

  const isImageLoaded = (productId: string): boolean => {
    return imageLoadingStates[productId] === false;
  };

  const t = useTranslations("common.navbar");
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState<SearchProductResult[]>([]);
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [imageLoadingStates, setImageLoadingStates] = useState<{
    [key: string]: boolean;
  }>({});
  const [hasSearched, setHasSearched] = useState(false);
  const [searchKey, setSearchKey] = useState(0);
  const [searchProducts, { data: searchData, isLoading: isSearching }] =
    useLazySearchProductsQuery();
  const debounceSearch = useDebounce((value: string, limit: number) => {
    searchProducts({ search: value, limit: limit });
  }, 500);
  useEffect(() => {
    if (searchData?.data?.listData) {
      setSearchResults(searchData.data.listData);
      if (searchTerm.trim().length > 0) {
        setShowSearchResults(true);
      }
      setHasSearched(true);

      // Initialize image loading states for new results
      const initialLoadingStates: { [key: string]: boolean } = {};
      searchData.data.listData.forEach((product: any) => {
        if (product.productImage && product.productImage.length > 0) {
          initialLoadingStates[product._id] = true;
        }
      });
      setImageLoadingStates(initialLoadingStates);
    } else if (hasSearched) {
      // Only show no results if we've actually performed a search
      setSearchResults([]);
      setShowSearchResults(true);
      resetImageLoadingStates();
    } else {
      // Reset states when no search data and no search performed
      setSearchResults([]);
      setShowSearchResults(false);
      resetImageLoadingStates();
    }
  }, [searchData, hasSearched]);

  useEffect(() => {
    // if (!searchQuery) return;
    setSearchTerm(searchQuery);
  }, [searchQuery]);

  const handleInputFocus = () => {
    if (searchTerm.trim().length >= 2 && searchResults.length > 0) {
      setShowSearchResults(true);
    }
  };

  const handleInputBlur = () => {
    setTimeout(() => setShowSearchResults(false), 200);
  };

  const handleImageLoad = (productId: string) => {
    setImageLoadingStates((prev) => ({ ...prev, [productId]: false }));
  };

  const handleImageError = (productId: string) => {
    setImageLoadingStates((prev) => ({ ...prev, [productId]: false }));
  };

  const resetImageLoadingStates = () => {
    setImageLoadingStates({});
  };

  const clearSearch = () => {
    // debugger;

    setSearchTerm("");
    clearRest();
    dispatch(setProductSearch(""));
    dispatch(setProductListPageNo(1));
    setHasSearched(false);
  };

  const clearRest = () => {
    // debugger;
    setSearchResults([]);
    setShowSearchResults(false);
    resetImageLoadingStates();
    setSearchKey((prev) => prev + 1); // Force re-render
  };

  const handleSearch = (value: string) => {
    if (value.trim().length > 0) {
      // if (value.trim().length >= 2) {
      setSearchResults([]);
      setShowSearchResults(false);
      // debugger;
      // useDebounce(() => {
      //   searchProducts({ search: value, limit: maxResults });
      // }, 2000);
      debounceSearch(value, maxResults);
      onSearch?.(value);
      setHasSearched(true);
    } else {
      // setSearchResults([]);
      // setShowSearchResults(false);
      // setHasSearched(false);
      // resetImageLoadingStates();
      clearSearch();
    }
    setSearchTerm(value);
    // dispatch(setProductSearch(value));
  };

  // const searchProductDebounce = () =>{

  // }

  const onSelectProducts = (product: SearchProductResult) => {
    dispatch(setProductSearch(product.productName));
    dispatch(setProductListPageNo(1));

    setSearchTerm(product.productName);
    redirect();
  };

  const onSearchProducts = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && searchTerm.trim().length >= 2) {
      dispatch(setProductSearch(searchTerm));
      dispatch(setProductListPageNo(1));
      redirect();
    }
  };

  const redirect = () => {
    if (pathname !== `/${locale}/products`) {
      router.push(`/${locale}/products`);
    }
    clearRest();
  };

  return (
    <div className={`p-main-search ${className}`} key={searchKey}>
      <input
        type="search"
        className="s-p-c-input"
        placeholder={
          isNoPlaceholder ? "" : placeholder || t("searchPlaceholder")
        }
        value={searchTerm}
        onChange={(e) => handleSearch(e.target.value)}
        onFocus={handleInputFocus}
        onBlur={handleInputBlur}
        onKeyDown={onSearchProducts}
      />
      <div
        className="search-close-icon"
        // onClick={() => clearSearch()}
      >
        <SearchCloseIcon />
      </div>
      {showIcon && (
        <div className="s-p-c-icons p-m-s-icon p-m-s-icon-position">
          <SearchIcon />
        </div>
      )}

      {/* <MicSearch />

      <ImageSearch /> */}

      {/* Search Results Dropdown */}
      {showSearchResults && (
        <div
          className={styles.searchResultsDropdown}
          style={{ cursor: "pointer" }}
        >
          {isSearching ? (
            <div className={styles.searchLoading}>Loading...</div>
          ) : searchResults.length > 0 ? (
            <div className={styles.searchResultsList}>
              {searchResults.map((product: SearchProductResult) => (
                <div
                  key={product._id}
                  // href={`/products/${product.liveUrl}`}
                  className={styles.searchResultItem}
                  rel="noopener noreferrer"
                  onClick={() => onSelectProducts(product)}
                  // onClick={handleResultClick}
                >
                  <div className={styles.searchResultContent}>
                    <div className={styles.searchResultImage}>
                      {product.productImage &&
                      product.productImage.length > 0 ? (
                        <>
                          {!isImageLoaded(product._id) && (
                            <div className={styles.imagePlaceholder}>
                              <div className={styles.loadingSpinner}></div>
                            </div>
                          )}
                          <img
                            src={constructImageUrl(product.productImage[0].src)}
                            alt={product.productImage[0].alt}
                            className={`${styles.productThumbnail} ${
                              isImageLoaded(product._id)
                                ? styles.imageLoaded
                                : ""
                            }`}
                            onLoad={() => handleImageLoad(product._id)}
                            onError={() => handleImageError(product._id)}
                            style={{
                              opacity: isImageLoaded(product._id) ? 1 : 0,
                              transition: "opacity 0.3s ease",
                            }}
                          />
                        </>
                      ) : (
                        <div className={styles.imagePlaceholder}>
                          <div className={styles.noImageIcon}>📷</div>
                        </div>
                      )}
                    </div>
                    <div className={styles.searchResultDetails}>
                      <Typography variant="span" className={styles.productName}>
                        {product.productName}
                      </Typography>
                      <Typography
                        variant="span"
                        className={styles.productCategory}
                      >
                        {product.category?.name}{" "}
                        {product.subCategory?.name &&
                          `> ${product.subCategory.name}`}
                      </Typography>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : hasSearched ? (
            <div className={styles.noResults}>
              <Typography variant="span" className={styles.noResultsText}>
                No results found for "{searchTerm}"
              </Typography>
            </div>
          ) : null}
        </div>
      )}
    </div>
  );
};

export default SearchDropdown;
