import ButtonIconLeftOutline from "@/app/[locale]/_components/Buttons/ButtonIconLeftOutline";
import { CloseIcon } from "@/app/[locale]/_components/Icons/SVGIcons";
import useFiltersData from "@/app/[locale]/_hooks/useFiltersData";
import {
  FiltersModuleTypes,
  SelectedFilterListItemInterface,
} from "@/app/[locale]/_interface/MarketPlaceInterface";
import React, { useEffect, useState } from "react";

interface SelectedFiltersTabProps {
  type: FiltersModuleTypes;
}

export const SelectedFiltersTab: React.FC<SelectedFiltersTabProps> = ({
  type,
}) => {
  const filtersData = useFiltersData().getMarketsFiltersData(type);
  const { getSetFilterVal, prepareQueryFilter } = useFiltersData();
  const [selectedItems, setSelectedItems] = useState<
    SelectedFilterListItemInterface[]
  >([]);

  useEffect(() => {
    const selectedList: SelectedFilterListItemInterface[] = [];

    filtersData.forEach((filterGroup, parentIndex) => {
      // debugger;
      if (!Array.isArray(filterGroup?.value) || filterGroup.value?.length === 0)
        return;
      filterGroup.value.forEach(
        (item: SelectedFilterListItemInterface, childIndex) => {
          if (item?.selected) {
            selectedList.push({
              key: filterGroup.key,
              // id: item.id ?? childIndex,
              title:
                filterGroup.key === "category" ? item.name ?? "" : item.title,
              parentIndex: parentIndex,
              childIndex: childIndex,
            });
          }
        }
      );
    });

    setSelectedItems(selectedList);
  }, [filtersData]);

  const removeFilterItem = (childIndex: number, parentIndex: number) => {
    let updatedFiltersData = JSON.parse(JSON.stringify(filtersData));
    updatedFiltersData[parentIndex].value[childIndex].selected = false;
    getSetFilterVal(type, updatedFiltersData);
    prepareQueryFilter(updatedFiltersData, type);
    // dispatch(setFilterQuery(updatedFiltersData));
  };

  return (
    <>
      {selectedItems.map((item, i) => (
        <div className="flex gap-2 flex-wrap" key={i}>
          <ButtonIconLeftOutline
            // key={`${item.key}-${item.id}`}
            name={item.title}
            className="bg-outline-grey btn-filter-select"
          >
            <CloseIcon
              onClick={() =>
                removeFilterItem(item.childIndex, item.parentIndex)
              }
            />
          </ButtonIconLeftOutline>
        </div>
      ))}
    </>
  );
};
