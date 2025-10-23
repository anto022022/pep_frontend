import { SearchIcon } from "@/app/[locale]/_components/Icons/SVGIcons";
import useFiltersData from "@/app/[locale]/_hooks/useFiltersData";
import { CategoriesListInterface } from "@/app/[locale]/_interface/common";
import { FiltersModuleTypes } from "@/app/[locale]/_interface/MarketPlaceInterface";
import { useGetCategoryListQuery } from "@/app/[locale]/_store/apiReducer/commonApi";
import { updateBreadcrumbTrail } from "@/app/[locale]/_utility/breadcrumbTrail";
import { useSearchParams } from "next/navigation";
import { FC, useEffect, useState } from "react";

type CategoryFilterProps = {
  values: Array<any>;
  parentIndex: number;
  type: FiltersModuleTypes;
};

interface CategoryExtendedListInterface extends CategoriesListInterface {
  selected?: boolean;
  mappedIndex?: number;
}

const CategoryFilter: FC<CategoryFilterProps> = ({
  values,
  parentIndex,
  type,
}) => {
  const [searchQuery, setSearchQuery] = useState<string>("");
  const setFilterData = useFiltersData();
  const [filteredValues, setFilteredValues] =
    useState<Array<CategoryExtendedListInterface>>(values);
  const { data, refetch } = useGetCategoryListQuery({ search: "" });

  const searchParams = useSearchParams();

  const ref = searchParams.get("ref") ?? undefined;
  const {
    categoryPaths: { category },
  } = updateBreadcrumbTrail(ref);

  useEffect(() => {
    refetch();
  }, []);

  useEffect(() => {
    if (values.length > 0) {
      // setFilteredValues(defaultCountryList);
      return;
    }
    if (!data || data?.data.length === 0) return;
    const updatedData = category
      ? data.data.map((item) => ({
          ...item,
          selected: item.uniqueId === category,
        }))
      : data.data;
    setFilteredValues(updatedData);
    setFilterData.setMarketsFiltersData({
      filterModuleType: type,
      value: updatedData,
      filterType: "common",
      parentIndex: parentIndex,
    });
  }, [data, values]);

  useEffect(() => {
    if (values.length === 0) return;
    const updatedValue = filteredValues.map((item) => ({
      ...item,
      selected: !!values.find((f) => f._id === item._id && f.selected),
    }));
    setFilteredValues(updatedValue);
  }, [values]);

  const updateSearchQuery = (val: string) => {
    setSearchQuery(val);
    if (!val) {
      setFilteredValues(values);
      return;
    }
    const newFilteredValues = values.filter((item) =>
      item?.name?.toLowerCase().includes(val.toLowerCase())
    );
    setFilteredValues(newFilteredValues);
  };

  const onCategoryChecked = (_id?: string) => {
    // debugger;

    if (!_id) return;
    let updatedValue = JSON.parse(JSON.stringify(values));
    const mappedIndex = updatedValue.findIndex((item) => item._id === _id);
    if (mappedIndex !== -1) {
      updatedValue[mappedIndex]["selected"] =
        !updatedValue[mappedIndex]["selected"];
    }
    setFilterData.setMarketsFiltersData({
      filterModuleType: type,
      value: updatedValue,
      filterType: "category",
      parentIndex: parentIndex,
    });
  };

  return (
    <div className="tabs-content">
      <div className="icon-input-comp">
        <SearchIcon />
        <input
          placeholder="Search"
          value={searchQuery}
          onChange={(e) => updateSearchQuery(e.target.value)}
          type="search"
          className="forms-input"
        />
      </div>
      <div className="checkbox-grp">
        {filteredValues.map((ele, index) => (
          <label key={index} className="forms-checkbox sm">
            <input
              type="checkbox"
              checked={!!ele?.selected}
              onChange={() => onCategoryChecked(ele._id)}
            />
            <span className="custom-checkbox"></span>
            <span className="f-r-label">{ele?.name ?? "category"}</span>
          </label>
        ))}
      </div>
    </div>
  );
};

export default CategoryFilter;
