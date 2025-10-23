import {
  FiltersModuleTypes,
  FiltersValue,
  PriceRangeInterface,
  SelectedFilterObjectInterface,
} from "@/app/[locale]/_interface/MarketPlaceInterface";
import {
  setFilterQuery,
  setOffersFilterData,
  setProductsFilterData,
  setRFQFilterData,
  setSuppliersFilterData,
} from "@/app/[locale]/_store/reducers/filters_store";
import { useAppDispatch, useAppSelector } from "@/app/[locale]/_store/store";

interface SetMarketsFiltersDataArgs {
  filterModuleType: FiltersModuleTypes;
  value: any;
  filterType: string;
  parentIndex: number;
}
export default function useFiltersData() {
  const dispatch = useAppDispatch();
  const productFilters = useAppSelector(
    (state) => state.filterData.productsFilterData
  );
  const offerFilters = useAppSelector(
    (state) => state.filterData.offersFilterData
  );
  const supplierFilters = useAppSelector(
    (state) => state.filterData.suppliersFilterData
  );
  const rfqFilters = useAppSelector((state) => state.filterData.rfqFilterData);

  const getSetFilterVal = (type: FiltersModuleTypes, value?: any) => {
    switch (type) {
      case "Products":
        if (value) dispatch(setProductsFilterData(value));
        return productFilters;
      case "Offers":
        if (value) dispatch(setOffersFilterData(value));
        return offerFilters;
      case "Suppliers":
        if (value) dispatch(setSuppliersFilterData(value));
        return supplierFilters;
      case "RFQ":
        if (value) dispatch(setRFQFilterData(value));
        return rfqFilters;
      default:
        return [];
    }
  };

  const getMarketsFiltersData = (type: FiltersModuleTypes) => {
    return getSetFilterVal(type);
  };

  const setMarketsFiltersData = ({
    filterModuleType,
    value,
    filterType,
    parentIndex,
  }: SetMarketsFiltersDataArgs) => {
    try {
      // debugger;
      let newValue = JSON.parse(
        JSON.stringify(getSetFilterVal(filterModuleType))
      );
      if (
        filterType === "common" ||
        filterType === "supplierVerificationStatus" ||
        filterType === "category" ||
        filterType === "deliveryTime"
      ) {
        newValue[parentIndex]["value"] = value;
        prepareQueryFilter(newValue, filterModuleType);
        getSetFilterVal(filterModuleType, newValue);
      }
      if (filterType === "priceRange") {
        newValue[parentIndex]["value"]["minPrice"] = value?.minPrice ?? 0;
        newValue[parentIndex]["value"]["maxPrice"] = value?.maxPrice ?? 0;
        prepareQueryFilter(newValue, filterModuleType);
        getSetFilterVal(filterModuleType, newValue);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const prepareQueryFilter = (
    newValue: FiltersValue<any | PriceRangeInterface>[],
    type: FiltersModuleTypes
  ) => {
    // debugger;
    if (!newValue || !Array.isArray(newValue) || newValue.length === 0)
      return "";
    let updatedQuery: Array<SelectedFilterObjectInterface> = [];

    try {
      for (let i = 0; i < newValue.length; i++) {
        if (
          newValue[i].type === "common" ||
          newValue[i].type === "supplierVerificationStatus"
        ) {
          // debugger;
          let selectedItems: Array<string> = [];
          for (
            let childIndex = 0;
            childIndex < newValue[i].value.length;
            childIndex++
          ) {
            if (!newValue[i].value[childIndex]["selected"]) continue;
            selectedItems.push(newValue[i].value[childIndex]?.value ?? "");
          }
          if (selectedItems.length === 0) continue;
          let queryValue = { ...newValue[i] };
          queryValue.value = selectedItems;
          const { title, ...rest } = queryValue;
          updatedQuery.push(rest);
        }
        if (newValue[i].type === "deliveryTime") {
          let selectedItems: Array<{ minDate: number; maxDate: number }> = [];
          for (
            let childIndex = 0;
            childIndex < newValue[i].value.length;
            childIndex++
          ) {
            if (!newValue[i].value[childIndex]["selected"]) continue;
            selectedItems.push(newValue[i].value[childIndex]?.value);
            // break;
          }
          // if (selectedItems.length === 0) continue;
          let queryValue = { ...newValue[i] };
          if (selectedItems.length === 0) continue;
          queryValue.value = selectedItems;
          const { title, ...rest } = queryValue;
          updatedQuery.push(rest);
        }
        if (newValue[i].type === "category") {
          let selectedItems: Array<string> = [];
          // debugger;
          for (
            let childIndex = 0;
            childIndex < newValue[i].value.length;
            childIndex++
          ) {
            if (!newValue[i].value[childIndex]["selected"]) continue;
            selectedItems.push(newValue[i].value[childIndex]?.uniqueId ?? "");
          }
          if (selectedItems.length === 0) continue;
          let queryValue = { ...newValue[i] };
          queryValue.value = selectedItems;
          const { title, ...rest } = queryValue;
          updatedQuery.push(rest);
        }
        if (newValue[i].type === "priceRange") {
          const { minPriceRange, maxPriceRange, step, ...rest } = newValue[i]
            .value as PriceRangeInterface;
          if (rest?.minPrice === undefined && rest?.maxPrice === undefined)
            continue;
          let queryValue = {
            key: newValue[i].key,
            type: newValue[i].type,
            value: rest,
          };
          updatedQuery.push(queryValue);
        }
      }

      dispatch(setFilterQuery({ value: updatedQuery, type: type }));
    } catch (error) {
      console.log("error");
    }
  };

  return {
    getMarketsFiltersData,
    setMarketsFiltersData,
    getSetFilterVal,
    prepareQueryFilter,
  };
}
