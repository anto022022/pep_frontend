import Typography from "@/app/[locale]/_components/Base/Typography";
import Button from "@/app/[locale]/_components/Buttons/Button";
import { FilterTypeRenderer } from "@/app/[locale]/_components/Filters/MarketPlaceFilters/FilterTypeRenderer";
import ReusableSidebar from "@/app/[locale]/_components/OverLay/ReUsableSidebar";
import SelectedFilterMobileCount from "@/app/[locale]/_components/Pipe/SelectedFilterMobileCount";
import useFiltersData from "@/app/[locale]/_hooks/useFiltersData";
import {
  FiltersModuleTypes,
  FiltersValue,
} from "@/app/[locale]/_interface/MarketPlaceInterface";
import { useTranslations } from "next-intl";
import { TabPanel, TabView } from "primereact/tabview";
import React from "react";

type MobileSidebarFilterProps = {
  open: boolean;
  setOpen: (val: boolean) => void;
  type: FiltersModuleTypes;
  mappedId?: string;
};

export const MobileSidebarFilter: React.FC<MobileSidebarFilterProps> = ({
  open,
  setOpen,
  type,
}) => {
  const filtersData = useFiltersData().getMarketsFiltersData(type);
  const t = useTranslations("categoryPage");
  return (
    <ReusableSidebar
      position={"bottom"}
      visible={open}
      onHide={() => setOpen(false)}
    >
      <div className="b-s-c-header">
        <div className="b-s-c-h-left">
          <Typography className="b-s-c-title" variant="h6">
            {t("common.filter")}
          </Typography>
        </div>
        <div className="b-s-c-h-right">
          {/* <Button className={"btn-txt"} text={t("common.clearAll")} /> */}
        </div>
      </div>
      <div className="b-s-c-body">
        <TabView className="filter-tab-view">
          {filtersData &&
            filtersData.length > 0 &&
            filtersData.map((ele: FiltersValue, i: number) => (
              <TabPanel
                key={i}
                header={<SelectedFilterMobileCount element={ele} />}
              >
                <FilterTypeRenderer
                  filterModuleType={type}
                  index={i}
                  data={ele}
                />
                {/* <CommonFilter /> */}
              </TabPanel>
            ))}
        </TabView>
      </div>
      <div className="b-s-c-footer">
        {/* <Button
          className={"btn-txt"}
          text={"Cancel"}
          onClick={() => setOpen(false)}
        /> */}
        <Button
          className={"btn-c-primary"}
          text={t("common.applyFilters")}
          onClick={() => {
            setOpen(false);
          }}
        />
      </div>
    </ReusableSidebar>
  );
};

export default MobileSidebarFilter;
