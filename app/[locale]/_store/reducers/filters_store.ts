import {
  FilterQueryObject,
  FilterQueryPayload,
  FiltersValue,
  OfferSortBy,
  ProductSortBy,
  RfqSortBy,
  SupplierSortBy,
} from "@/app/[locale]/_interface/MarketPlaceInterface";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface FiltersStateInterface {
  productsFilterData: FiltersValue[];
  offersFilterData: FiltersValue[];
  suppliersFilterData: FiltersValue[];
  rfqFilterData: FiltersValue[];
  filterQuery: FilterQueryObject;
  specificSort: string;
  productSort: ProductSortBy;
  supplierSort: SupplierSortBy;
  rfqSort: RfqSortBy;
  offerSort: OfferSortBy;
  triggerMobFilter: boolean;
  productSearchQuery: string;
  productListPageNo: number;
}
const initialState: FiltersStateInterface = {
  productsFilterData: [],
  offersFilterData: [],
  suppliersFilterData: [],
  rfqFilterData: [],
  filterQuery: { Products: [], Offers: [], RFQ: [], Suppliers: [] },
  specificSort: "",
  productSort: "newlyAdded",
  supplierSort: "recentlyAdded",
  rfqSort: "datePosted",
  offerSort: "highToLow",
  triggerMobFilter: false,
  productSearchQuery: "",
  productListPageNo: 1,
};

const FiltersSlice = createSlice({
  name: "filterData",
  initialState,
  reducers: {
    resetFilters: () => initialState,
    initiateMobFilter: (state, action) => {
      state.triggerMobFilter = action.payload;
    },
    setProductsSortBy: (state, action) => {
      state.productSort = action.payload;
    },
    setOfferSortBy: (state, action) => {
      state.offerSort = action.payload;
    },
    setRfqSortBy: (state, action) => {
      state.rfqSort = action.payload;
    },
    setSupplierSortBy: (state, action) => {
      state.supplierSort = action.payload;
    },
    setProductsFilterData: (state, action) => {
      if (
        !action.payload ||
        !Array.isArray(action.payload) ||
        action.payload.length === 0
      )
        return;
      state.productsFilterData = action.payload;
    },
    setOffersFilterData: (state, action) => {
      if (
        !action.payload ||
        !Array.isArray(action.payload) ||
        action.payload.length === 0
      )
        return;
      state.offersFilterData = action.payload;
    },
    setSuppliersFilterData: (state, action) => {
      if (
        !action.payload ||
        !Array.isArray(action.payload) ||
        action.payload.length === 0
      )
        return;
      state.suppliersFilterData = action.payload;
    },
    setRFQFilterData: (state, action) => {
      if (
        !action.payload ||
        !Array.isArray(action.payload) ||
        action.payload.length === 0
      )
        return;
      state.rfqFilterData = action.payload;
    },
    setFilterQuery: (state, action: PayloadAction<FilterQueryPayload>) => {
      if (
        state.filterQuery[action.payload.type].length === 0 &&
        action.payload.value.length === 0
      )
        return;
      state.filterQuery = {
        ...state.filterQuery,
        [action.payload.type]: action.payload.value,
      };
    },
    setSpecificSort: (state, action) => {
      state.specificSort = action.payload;
    },
    setProductSearch: (state, action) => {
      state.productSearchQuery = action.payload;
    },
    setProductListPageNo: (state, action) => {
      state.productListPageNo = action.payload;
    },
  },
});

export const {
  initiateMobFilter,
  setProductsFilterData,
  setOffersFilterData,
  setSuppliersFilterData,
  setRFQFilterData,
  setFilterQuery,
  setSpecificSort,
  setProductsSortBy,
  setSupplierSortBy,
  setOfferSortBy,
  setRfqSortBy,
  setProductSearch,
  setProductListPageNo,
  resetFilters,
} = FiltersSlice.actions;

export default FiltersSlice.reducer;
