import CheckBoxInput from "@/app/[locale]/_components/StoreFront/Forms/CheckBoxInputs";
import useFiltersData from "@/app/[locale]/_hooks/useFiltersData";
import { FiltersModuleTypes } from "@/app/[locale]/_interface/MarketPlaceInterface";
import React from "react";

type CommonFilter = {
  values: Array<any>;
  parentIndex: number;
  type: FiltersModuleTypes;
};
const CommonFilter: React.FC<CommonFilter> = ({
  values,
  parentIndex,
  type,
}) => {
  const setFilterData = useFiltersData();

  const onCheckBoxChange = (index: number) => {
    let updatedValue = JSON.parse(JSON.stringify(values));
    updatedValue[index]["selected"] = !updatedValue[index]["selected"];
    setFilterData.setMarketsFiltersData({
      filterModuleType: type,
      value: updatedValue,
      filterType: "common",
      parentIndex: parentIndex,
    });
  };

  return (
    <div className="tabs-content">
      <div className="checkbox-grp">
        {values &&
          values.length > 0 &&
          values.map((ele, i) => (
            <CheckBoxInput
              key={ele?.id ?? i}
              label={ele?.title}
              onChange={() => onCheckBoxChange(i)}
              className="sm"
              checked={!!ele?.selected}
              // defaultChecked={ele?.selected}
            />
          ))}
      </div>
    </div>
  );
};

export default CommonFilter;
