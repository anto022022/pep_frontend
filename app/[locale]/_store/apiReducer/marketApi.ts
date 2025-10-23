import { useBaseQuery } from "@/app/[locale]/_hooks/usebaseQuery";
import { encodeQuery } from "@/app/[locale]/_hooks/utility";
import { CommonResponseStructure } from "@/app/[locale]/_interface/common";
import {
  setOffersFilterData,
  setProductsFilterData,
  setRFQFilterData,
  setSuppliersFilterData,
} from "@/app/[locale]/_store/reducers/filters_store";
import { createApi } from "@reduxjs/toolkit/query/react";
import {
  FiltersListQuery,
  FiltersValue,
  MarketApiQueryInterface,
  ProductCategoryListInterface,
  ProductDetailQueryArg,
  SearchProductsResponse,
} from "../../_interface/MarketPlaceInterface";

export const marketApi = createApi({
  reducerPath: "marketApi",
  baseQuery: useBaseQuery,
  tagTypes: ["marketApi", "liveProducts", "reviews", "searchProducts"],
  endpoints: (build) => {
    return {
      getCategoryProductList: build.query<
        CommonResponseStructure<any>,
        MarketApiQueryInterface & { productSearch?: string }
      >({
        query: ({
          category_id = [],
          subCategory_id = [],
          productCategory_id = [],
          specificSort = "",
          similarTo = "",
          productOf = "",
          filterBy = [],
          page = 1,
          limit = 10,
          currencyCode = "INR",
          productSearch = "",

        }) => {
          const encodedCategory = encodeQuery(category_id);
          const encodedSubCategory = encodeQuery(subCategory_id);
          const encodedProdCategory = encodeQuery(productCategory_id);
          const encodedFilter = encodeQuery(filterBy);

          return {
            url: `/markets/get-live-product?similarTo=${similarTo}&productOf=${productOf}&productSearch=${productSearch ?? ""
              }&category_id=${encodedCategory}&subcategory_id=${encodedSubCategory}&productCategory_id=${encodedProdCategory}&specificSort=${specificSort}&filterBy=${encodedFilter}&page=${page}&limit=${limit}&currencyCode=${currencyCode}`,
          };
        },
        providesTags: ["liveProducts"],
      }),

      getProductDetailById: build.query<
        CommonResponseStructure<any>,
        ProductDetailQueryArg
      >({
        query: ({ productId, currencyCode = "INR" }) => ({
          url: `/markets/live-product/${productId}?currencyCode=${currencyCode}`,
        }),
        // providesTags: ["liveProducts", "reviews"],
      }),

      getFeaturedSupplierList: build.query<any, MarketApiQueryInterface>({
        query: ({
          category_id = [],
          subCategory_id = [],
          productCategory_id = [],
          specificSort = "",
          filterBy = [],
          page = 1,
          limit = 10,
          productSearch,
        }) => {
          const encodedCategory = encodeQuery(category_id);
          const encodedSubCategory = encodeQuery(subCategory_id);
          const encodedProdCategory = encodeQuery(productCategory_id);
          const encodedFilter = encodeQuery(filterBy);
          return `/markets/live-supplier-list?productSearch=${productSearch ?? ""
            }&category_id=${encodedCategory}&subcategory_id=${encodedSubCategory}&productCategory_id=${encodedProdCategory}&filterBy=${encodedFilter}&specificSort=${specificSort}&page=${page}&limit=${limit}`;
        },
        providesTags: ["marketApi"],
      }),

      getOfferDiscountList: build.query<
        CommonResponseStructure<any>,
        MarketApiQueryInterface
      >({
        query: ({
          category_id = [],
          subCategory_id = [],
          productCategory_id = [],
          specificSort = "",
          filterBy = [],
          page = 1,
          limit = 10,
          currencyCode = "INR",
        }) => {
          const encodedCategory = encodeQuery(category_id);
          const encodedSubCategory = encodeQuery(subCategory_id);
          const encodedProdCategory = encodeQuery(productCategory_id);
          const encodedFilter = encodeQuery(filterBy);

          return {
            url: `/markets/live-offer-list?category_id=${encodedCategory}&subcategory_id=${encodedSubCategory}&productCategory_id=${encodedProdCategory}&specificSort=${specificSort}&filterBy=${encodedFilter}&page=${page}&limit=${limit}&currencyCode=${currencyCode}`,
          };
        },
        providesTags: ["marketApi"],
      }),

      updateProductView: build.mutation<any, { id: string }>({
        query: ({ id }) => ({
          url: `/markets/analytics-view/${id}`,
          method: "PUT",
        }),
        invalidatesTags: ["liveProducts"], // Optional: if you need to refetch
      }),

      updateProductShare: build.mutation<any, { id: string }>({
        query: ({ id }) => ({
          url: `/markets/analytics-share/${id}`,
          method: "PUT",
        }),
        invalidatesTags: ["liveProducts"], // Optional: if you need to refetch
      }),
      getProductCategoryList: build.query<any, ProductCategoryListInterface>({
        query: ({ subCategory_id = "", page = 1, limit = 10 }) => {
          const encodedSubCategory = encodeQuery(subCategory_id);

          return `/markets/product-category-list?&subcategory_id=${encodedSubCategory}&page=${page}&limit=${limit}`;
        },
        providesTags: ["marketApi"],
      }),
      getFiltersList: build.query<
        CommonResponseStructure<FiltersValue[]>,
        FiltersListQuery
      >({
        query: ({ type, mappedId }) =>
          `/markets/filters-list?type=${type}&mappedId=${mappedId ?? ""}`,
        async onQueryStarted(arg, { dispatch, queryFulfilled }) {
          try {
            const { data } = await queryFulfilled;
            if (arg.type === "Products") {
              dispatch(setProductsFilterData(data.data));
            } else if (arg.type === "Offers") {
              dispatch(setOffersFilterData(data.data));
            } else if (arg.type === "Suppliers") {
              dispatch(setSuppliersFilterData(data.data));
            } else if (arg.type === "RFQ") {
              dispatch(setRFQFilterData(data.data));
            }
          } catch (err) {
            console.error("Failed to update filters", err);
          }
        },
      }),

      searchProducts: build.query<
        CommonResponseStructure<SearchProductsResponse>,
        { search: string; page?: number; limit?: number }
      >({
        query: ({ search, page = 1, limit = 5 }) => ({
          url: `/markets/search-products-list?search=${encodeURIComponent(
            search
          )}&page=${page}&limit=${limit}`,
        }),
        providesTags: ["searchProducts"],
      }),

      faqCategoryList: build.query<any, { type: string; categoryId: string; }>({
        query: ({ type, categoryId }) => ({
          url: `/markets/get-category-faq-list?type=${type}&categoryId=${categoryId}`
        })
      }),
    };
  },
});

export const {
  useGetCategoryProductListQuery,
  useGetFeaturedSupplierListQuery,
  useGetOfferDiscountListQuery,
  useGetFiltersListQuery,
  useLazyGetCategoryProductListQuery,
  useLazyGetFeaturedSupplierListQuery,
  useLazyGetOfferDiscountListQuery,
  useUpdateProductViewMutation,
  useGetProductDetailByIdQuery,
  useUpdateProductShareMutation,
  useSearchProductsQuery,
  useLazySearchProductsQuery,
  useFaqCategoryListQuery,
  useGetProductCategoryListQuery,
  // useGetLiveProductsQuery,
  // useGetProductsListQuery
} = marketApi;
