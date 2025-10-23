import CategoryFilter from "@/app/[locale]/_components/Filters/MarketPlaceFilters/CategoryFilter";
import CommonFilter from "@/app/[locale]/_components/Filters/MarketPlaceFilters/CommonFilter";
import CountyFilter from "@/app/[locale]/_components/Filters/MarketPlaceFilters/CountyFilter";
import DeliveryFilter from "@/app/[locale]/_components/Filters/MarketPlaceFilters/DeliveryFilter";
import PriceRangeFilter from "@/app/[locale]/_components/Filters/MarketPlaceFilters/PriceRangeFilter";
import {
  FiltersModuleTypes,
  FiltersValue,
} from "@/app/[locale]/_interface/MarketPlaceInterface";

type FilterTypeRendererProps = {
  index: number;
  filterModuleType: FiltersModuleTypes;
  data: FiltersValue;
};

export const FilterTypeRenderer: React.FC<FilterTypeRendererProps> = ({
  data,
  index,
  filterModuleType,
}) => {
  switch (data.type) {
    case "common":
      return (
        <>
          {data.key !== "countries" ? (
            <CommonFilter
              type={filterModuleType}
              values={data.value}
              parentIndex={index}
            />
          ) : (
            <CountyFilter
              values={data.value}
              type={filterModuleType}
              parentIndex={index}
            />
          )}
        </>
      );
    case "supplierVerificationStatus":
      return (
        <>
          <CommonFilter
            type={filterModuleType}
            values={data.value}
            parentIndex={index}
          />
        </>
      );
    case "deliveryTime":
      return (
        <>
          <DeliveryFilter
            type={filterModuleType}
            values={data.value}
            parentIndex={index}
          />
        </>
      );
    case "category":
      return (
        <CategoryFilter
          type={filterModuleType}
          values={data.value}
          parentIndex={index}
        />
      );
    case "priceRange":
      return (
        <PriceRangeFilter
          type={filterModuleType}
          values={data.value}
          parentIndex={index}
        />
      );
    default:
      return <></>;
  }
};
