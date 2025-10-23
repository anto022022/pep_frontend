import { FilterTypeRenderer } from "@/app/[locale]/_components/Filters/MarketPlaceFilters/FilterTypeRenderer";
import useFiltersData from "@/app/[locale]/_hooks/useFiltersData";
import {
  FiltersModuleTypes,
  FiltersValue,
} from "@/app/[locale]/_interface/MarketPlaceInterface";
import { Accordion, AccordionTab } from "primereact/accordion";
import { FC } from "react";
import Typography from "../Base/Typography";

type FilterSidebarProps = {
  type: FiltersModuleTypes;
  mappedId?: string;
};

const FilterSidebar: FC<FilterSidebarProps> = ({ type }) => {
  const filtersData = useFiltersData().getMarketsFiltersData(type);
  const defaultOpenedAccordions = [0, 1, 2, 3, 4, 5, 6];

  // const renderTabContent = (ele: FiltersValue, index: number) => {
  //   switch (ele.type) {
  //     case "common":
  //       return (
  //         <>
  //           <CommonFilter type={type} values={ele.value} parentIndex={index} />
  //         </>
  //       );
  //     case "category":
  //       return (
  //         <CategoryFilter type={type} values={ele.value} parentIndex={index} />
  //       );
  //     default:
  //       return <></>;
  //   }
  // };

  return (
    <div className="filter-sidebar-comp">
      <Typography variant="h4" className="f-s-c-title">
        Refine your results
      </Typography>
      <div className="accordion-comp">
        <Accordion activeIndex={defaultOpenedAccordions} multiple>
          {filtersData &&
            filtersData.length > 0 &&
            filtersData.map((ele: FiltersValue, i: number) => (
              <AccordionTab header={ele.title} key={i} disabled={false}>
                <FilterTypeRenderer
                  data={ele}
                  index={i}
                  filterModuleType={type}
                />
                {/* {renderTabContent(ele, i)} */}
              </AccordionTab>
            ))}
        </Accordion>
      </div>
    </div>
  );
};

export default FilterSidebar;