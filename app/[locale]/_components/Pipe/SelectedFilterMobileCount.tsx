import React, { useEffect, useState } from "react";
import { FiltersValue } from "@/app/[locale]/_interface/MarketPlaceInterface";

interface SelectedFilterMobileCountProps {
  element: FiltersValue;
}

const SelectedFilterMobileCount: React.FC<SelectedFilterMobileCountProps> = ({
  element,
}) => {
  const [activeNumber, setActiveNumber] = useState<number>(0);

  useEffect(() => {
    if (!Array.isArray(element?.value) || element.value.length === 0) return;
    let activeCount = 0;
    for (let i = 0; i < element.value.length; i++) {
      // debugger;
      // const item = element.value[i] as { selected?: boolean };
      if (element.value[i]?.selected) activeCount++;
    }
    setActiveNumber(activeCount);
  }, [element]);

  return (
    <div className="f-t-v-navs-item">
      <span className="f-t-v-n-i-txt">{element.title}</span>
      {activeNumber ? (
        <span className="f-t-v-n-i-badge">{activeNumber}</span>
      ) : (
        <> </>
      )}
    </div>
  );
};

export default SelectedFilterMobileCount;
