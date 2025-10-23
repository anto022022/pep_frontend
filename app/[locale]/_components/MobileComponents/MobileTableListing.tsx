import Typography from "@/app/[locale]/_components/Base/Typography";
import ButtonIcon from "@/app/[locale]/_components/Buttons/ButtonIcon";
import { TabItem } from "@/app/[locale]/_components/Common/Tabs";
import CheckBoxInputs from "@/app/[locale]/_components/form/CheckBoxInputs";
import {
  ArchiveIcon,
  ArrowSwapIcon,
  CloseIcon,
  PlusIcon,
  SearchIcon,
  TickSortIcon,
} from "@/app/[locale]/_components/Icons/SVGIcons";
import MobileTabs from "@/app/[locale]/_components/MobileComponents/MobileTabs";
import MobileNavBar from "@/app/[locale]/_components/Navbar/MobileNavBar";
import ReusableSidebar from "@/app/[locale]/_components/OverLay/ReUsableSidebar";
import { listCounts } from "@/app/[locale]/_interface/SalesProductInterface";
import { setIsBulkActionActive } from "@/app/[locale]/_store/reducers/ui_store";
import { useAppDispatch, useAppSelector } from "@/app/[locale]/_store/store";
import { useTranslations } from "next-intl";
import { DataTablePageEvent } from "primereact/datatable";
import { Paginator } from "primereact/paginator";
import { FC, useEffect, useRef, useState } from "react";

interface MobileTableListProps {
  navTitle: string;
  navPath: string;
  navItem?: React.ReactNode;
  children: React.ReactNode;
  activeTab: string;
  listCounts: listCounts;
  searchPlaceholder: string;
  setListStatus: (val: string) => void;
  tabsName: TabItem[];
  searchValue: string;
  setSearchQuery: (id: string) => void;
  selectedLength: number;
  isAllSelected?: boolean;
  handleSelectAll: (checked: boolean) => void;
  initiateBulkArchive: () => void;
  totalRecords: number;
  onPageChange: (event: DataTablePageEvent) => void;
  first: number;
  rows: number;
  handleAdd: () => void;
  sortOptions?: { label: string; field: string }[];
  handleSort?: (field: string) => void;
  activeSort?: string;
  isEmpty: boolean;
}
const MobileTableListing: FC<MobileTableListProps> = ({
  navTitle,
  navPath,
  navItem = null,
  children,
  activeTab,
  listCounts,
  searchPlaceholder,
  setListStatus,
  tabsName,
  searchValue,
  setSearchQuery,
  selectedLength,
  isAllSelected,
  handleSelectAll,
  initiateBulkArchive,
  totalRecords,
  onPageChange,
  first,
  rows,
  handleAdd,
  sortOptions,
  handleSort,
  activeSort,
  isEmpty,
}) => {
  const isBulkActionActive = useAppSelector(
    (state) => state.uiData.isBulkActionActive
  );
  const dispatch = useAppDispatch();
  const [isSortByVisible, setIsSortByVisible] = useState(false);
  const mobileScrollBody = useRef<HTMLDivElement | null>(null);
  const t = useTranslations("common.mobTable");

  useEffect(() => {
    return () => {
      dispatch(setIsBulkActionActive(false));
    };
  }, []);
  return isEmpty ? (
    <div className={`body-preview-mob`}>
      <MobileNavBar title={navTitle} path={navPath}>
        {navItem}
      </MobileNavBar>
      <div className="b-p-m-body" ref={mobileScrollBody}>
        {children}
      </div>
    </div>
  ) : (
    <div
      className={`body-preview-mob ${
        isBulkActionActive ? "bulk-action-action" : ""
      }`}
    >
      <MobileNavBar title={navTitle} path={navPath}>
        {navItem}
      </MobileNavBar>
      <MobileTabs
        activeTab={activeTab}
        listCounts={listCounts}
        setListStatus={setListStatus}
        tabsName={tabsName}
      />
      <div className="table-search-comp">
        <div className="icon-input-comp">
          <SearchIcon />
          <input
            value={searchValue}
            placeholder={searchPlaceholder}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setSearchQuery(e.target.value)
            }
            type="search"
            className="forms-input"
          />
        </div>
      </div>
      <div className="bulk-action-selected-header">
        <div className="b-a-s-h-comp">
          <div className="b-a-s-h-c-left">
            <Typography variant="span" className="selected-txt-count">
              {selectedLength} {t("selected")}
            </Typography>
          </div>
          <div className="b-a-s-h-c-right">
            <CloseIcon onClick={() => dispatch(setIsBulkActionActive(false))} />
          </div>
        </div>
        <div className="unselect-comp">
          <div className="u-c-left">
            <CheckBoxInputs
              label={isAllSelected ? t("unSelectAll") : t("selectAll")}
              checked={isAllSelected}
              id="unselect-all"
              onchange={(e) => handleSelectAll(e.target.checked)}
              className={"light-bg sm"}
            />
          </div>
          <div className="u-c-right">
            <ButtonIcon
              className={"b-c-i-rounded b-c-i-danger"}
              onClick={() => {
                initiateBulkArchive();
                if (isBulkActionActive) {
                  dispatch(setIsBulkActionActive(false));
                }
              }}
            >
              <ArchiveIcon />
            </ButtonIcon>
          </div>
        </div>
      </div>
      <div className="b-p-m-body" ref={mobileScrollBody}>
        {children}
        {totalRecords > 0 && (
          <Paginator
            first={first}
            rows={rows}
            totalRecords={totalRecords ?? 0}
            pageLinkSize={4}
            onPageChange={(e: DataTablePageEvent) => {
              onPageChange(e);
              mobileScrollBody.current?.scrollTo({
                top: 0,
                behavior: "smooth",
              });
            }}
          />
        )}
      </div>
      {sortOptions && (
        <div className="b-p-m-footer">
          <div className="mob-filter-nav">
            <div
              className="bottom-nav"
              onClick={() => {
                setIsSortByVisible(true);
              }}
            >
              <ArrowSwapIcon />
              <span className="b-n-txt">{t("sortBy")}</span>
            </div>
            {/* <div className="bottom-nav">
                <FilterMobIcon />
                <span className="b-n-txt">Filter by</span>
                <span className="b-n-badge"></span>
              </div> */}
          </div>
        </div>
      )}
      <ButtonIcon
        className={"b-c-i-outline add-new-float-btn"}
        onClick={handleAdd}
      >
        <PlusIcon />
      </ButtonIcon>
      {isSortByVisible && sortOptions && handleSort && (
        <ReusableSidebar
          position={"bottom"}
          visible={isSortByVisible}
          onHide={() => setIsSortByVisible(false)}
          className={"max-height sort-bottom-sheet"}
        >
          <div className="b-s-c-header">
            <div className="b-s-c-h-left">
              <Typography className="b-s-c-title" variant="h6">
                {t("sortBy")}
              </Typography>
            </div>
            <div className="b-s-c-h-right">
              <ButtonIcon
                className={"btn-icon"}
                onClick={() => setIsSortByVisible(false)}
              >
                <CloseIcon />
              </ButtonIcon>
            </div>
          </div>
          <div className="b-s-c-body">
            <ul className="sort-options-ul">
              {sortOptions.map((option, i) => (
                <li
                  className={`s-o-u-li ${
                    activeSort === option.field ? "active" : ""
                  }`}
                  onClick={() => {
                    handleSort(option.field);
                    setIsSortByVisible(false);
                  }}
                  key={i}
                >
                  <span className="s-o-u-li-txt">{option.label}</span>
                  <TickSortIcon className={"s-o-u-li-icon"} />
                </li>
              ))}
            </ul>
          </div>
        </ReusableSidebar>
      )}
    </div>
  );
};

export default MobileTableListing;
