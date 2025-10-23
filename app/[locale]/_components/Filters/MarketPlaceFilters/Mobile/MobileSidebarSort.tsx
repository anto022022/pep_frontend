import Typography from "@/app/[locale]/_components/Base/Typography";
import ButtonIcon from "@/app/[locale]/_components/Buttons/ButtonIcon";
import {
  CloseIcon,
  TickSortIcon,
} from "@/app/[locale]/_components/Icons/SVGIcons";
import ReusableSidebar from "@/app/[locale]/_components/OverLay/ReUsableSidebar";
import {
  FiltersModuleTypes,
  ProductSortingItemInterface,
} from "@/app/[locale]/_interface/MarketPlaceInterface";
import { useAppDispatch, useAppSelector } from "@/app/[locale]/_store/store";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import {
  productSortingList,
  supplierSortingList,
  rfqSortingList,
  offerSortingList,
} from "@/app/[locale]/_models/common";
import {
  setOfferSortBy,
  setProductsSortBy,
  setRfqSortBy,
  setSupplierSortBy,
} from "@/app/[locale]/_store/reducers/filters_store";

type MobileSidebarSortProps = {
  open: boolean;
  setOpen: (val: boolean) => void;
  type: FiltersModuleTypes;
};

const MobileSidebarSort: React.FC<MobileSidebarSortProps> = ({
  open,
  setOpen,
  type,
}) => {
  const t = useTranslations("categoryPage");
  // const specificSort = useAppSelector((state) => state.filterData.specificSort);
  const productSort = useAppSelector((state) => state.filterData.productSort);
  const supplierSort = useAppSelector((state) => state.filterData.supplierSort);
  const rfqSort = useAppSelector((state) => state.filterData.rfqSort);
  const offerSort = useAppSelector((state) => state.filterData.offerSort);
  const [sortList, setSortListState] = useState<ProductSortingItemInterface[]>(
    []
  ); // adjust type if needed
  const [selectedSort, setSelectedSort] = useState("");
  const dispatch = useAppDispatch();

  useEffect(() => {
    setSortList();
  }, [productSort, supplierSort, rfqSort, offerSort]);

  const setSortList = () => {
    switch (type) {
      case "Products":
        setSortListState(productSortingList);
        setSelectedSort(productSort);
        break;
      case "Suppliers":
        setSortListState(supplierSortingList);
        setSelectedSort(supplierSort);
        break;
      case "RFQ":
        setSortListState(rfqSortingList);
        setSelectedSort(rfqSort);
        break;
      case "Offers":
        setSortListState(offerSortingList);
        setSelectedSort(offerSort);
        break;
      default:
        setSortListState([]);
        break;
    }
  };

  const setDynamicSortData = (val: string) => {
    switch (type) {
      case "Products":
        setSortListState(productSortingList);
        dispatch(setProductsSortBy(val));
        break;
      case "Suppliers":
        setSortListState(supplierSortingList);
        dispatch(setSupplierSortBy(val));

        break;
      case "RFQ":
        setSortListState(rfqSortingList);
        dispatch(setRfqSortBy(val));
        break;
      case "Offers":
        setSortListState(offerSortingList);
        dispatch(setOfferSortBy(val));
        break;
      default:
        setSortListState([]);
        break;
    }
  };

  return (
    <ReusableSidebar
      position={"bottom"}
      visible={open}
      onHide={() => setOpen(false)}
      className={"max-height sort-bottom-sheet"}
    >
      <div className="b-s-c-header">
        <div className="b-s-c-h-left">
          <Typography className="b-s-c-title" variant="h6">
            {t("common.sortBy")}
          </Typography>
        </div>
        <div className="b-s-c-h-right">
          <ButtonIcon className={"btn-icon"} onClick={() => setOpen(false)}>
            <CloseIcon />
          </ButtonIcon>
        </div>
      </div>
      <div className="b-s-c-body">
        <ul className="sort-options-ul">
          {sortList.map((ele, i) => (
            <li
              className={`s-o-u-li ${
                ele.value === selectedSort ? "active" : ""
              }`}
              key={i}
              onClick={() => setDynamicSortData(ele.value)}
            >
              <span className="s-o-u-li-txt cursor-pointer">{ele.name}</span>
              {ele.value === selectedSort && (
                <TickSortIcon className={"s-o-u-li-icon"} />
              )}
            </li>
          ))}
          {/* <li className="s-o-u-li active">
            <span className="s-o-u-li-txt">{t("common.relevance")}</span>
            <TickSortIcon className={"s-o-u-li-icon"} />
          </li>
          <li className="s-o-u-li">
            <span className="s-o-u-li-txt">{t("common.highToLow")}</span>
            <TickSortIcon className={"s-o-u-li-icon"} />
          </li>
          <li className="s-o-u-li">
            <span className="s-o-u-li-txt">{t("common.lowToHigh")}</span>
            <TickSortIcon className={"s-o-u-li-icon"} />
          </li>
          <li className="s-o-u-li">
            <span className="s-o-u-li-txt">{t("common.recommended")}</span>
            <TickSortIcon className={"s-o-u-li-icon"} />
          </li> */}
        </ul>
      </div>
    </ReusableSidebar>
  );
};

export default MobileSidebarSort;
