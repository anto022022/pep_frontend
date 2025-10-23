// import React from "react";
// import RadioButtonInput from "@/app/[locale]/_components/StoreFront/Forms/RadioButtonInput";
// import useFiltersData from "@/app/[locale]/_hooks/useFiltersData";
// import { FiltersModuleTypes } from "@/app/[locale]/_interface/MarketPlaceInterface";

// type CommonFilter = {
//   values: Array<any>;
//   parentIndex: number;
//   type: FiltersModuleTypes;
// };

// const DeliveryFilter: React.FC<CommonFilter> = ({
//   values,
//   parentIndex,
//   type,
// }) => {
//   const setFilterData = useFiltersData();

//   const onRadioChange = (
//     _e: React.ChangeEvent<HTMLInputElement>,
//     index: number
//   ) => {
//     const updatedValue = values.map((item, i) => ({
//       ...item,
//       selected: i === index,
//     }));

//     setFilterData.setMarketsFiltersData({
//       filterModuleType: type,
//       value: updatedValue,
//       filterType: "common",
//       parentIndex: parentIndex,
//     });
//   };

//   const groupName = `radio-group-${parentIndex}`; // ensure consistency

//   return (
//     <div className="tabs-content">
//       <div className="checkbox-grp">
//         {values?.length > 0 &&
//           values.map((ele, i) => (
//             <RadioButtonInput
//               key={ele?.id ?? i}
//               label={ele?.title}
//               onChange={(e) => onRadioChange(e, i)}
//               className="sm"
//               checked={!!ele?.selected}
//               name={groupName}
//               value={ele?.value ?? ele?.title ?? i}
//             />
//           ))}
//       </div>
//     </div>
//   );
// };

// export default DeliveryFilter;

import React from "react";
import CheckBoxInput from "@/app/[locale]/_components/StoreFront/Forms/CheckBoxInputs";
import useFiltersData from "@/app/[locale]/_hooks/useFiltersData";
import { FiltersModuleTypes } from "@/app/[locale]/_interface/MarketPlaceInterface";

type CommonFilter = {
  values: Array<any>;
  parentIndex: number;
  type: FiltersModuleTypes;
};

const DeliveryFilter: React.FC<CommonFilter> = ({
  values,
  parentIndex,
  type,
}) => {
  const setFilterData = useFiltersData();

  const onCheckBoxChange = (index: number) => {
    // Create a deep copy of the array to avoid mutating props directly
    const updatedValue = JSON.parse(JSON.stringify(values));
    // Toggle the selected state for the clicked checkbox
    updatedValue[index].selected = !updatedValue[index].selected;

    // Update filters in global state
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
        {values?.length > 0 &&
          values.map((ele, i) => (
            <CheckBoxInput
              key={ele?.id ?? i}
              label={ele?.title}
              onChange={() => onCheckBoxChange(i)}
              className="sm"
              checked={!!ele?.selected}
            />
          ))}
      </div>
    </div>
  );
};

export default DeliveryFilter;
