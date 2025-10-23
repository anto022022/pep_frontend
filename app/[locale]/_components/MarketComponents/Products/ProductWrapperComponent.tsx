"use client";
import WhyBusiness from "@/app/[locale]/(public_pages)/categories/(sections)/why-business";
import Typography from "@/app/[locale]/_components/Base/Typography";
import Button from "@/app/[locale]/_components/Buttons/Button";
import ButtonIconLeftOutline from "@/app/[locale]/_components/Buttons/ButtonIconLeftOutline";
import BreadCrumbs, {
  BreadcrumbItem,
} from "@/app/[locale]/_components/Cards/Marketplace/BreadCrumbs";
import Tabs from "@/app/[locale]/_components/Common/Tabs";
import { FilterIcon } from "@/app/[locale]/_components/Icons/SVGIcons";
import CategoryOverview from "@/app/[locale]/_components/MarketComponents/CategoryOverView";
import FilterSidebar from "@/app/[locale]/_components/MarketComponents/FilterSidebar";
import ProductList from "@/app/[locale]/_components/MarketComponents/Products/ProductList";
import SupplierList from "@/app/[locale]/_components/MarketComponents/Supplier/SupplierList";
import Select from "@/app/[locale]/_components/StoreFront/Forms/Select";
import useIsMobile from "@/app/[locale]/_hooks/useIsMobile";
import {
  catDetailTabs,
  productSortingList,
  supplierSortingList,
} from "@/app/[locale]/_models/common";
import {
  RootState,
  useAppDispatch,
  useAppSelector,
} from "@/app/[locale]/_store/store";
import "@/app/[locale]/dev_styles.css";
import { TabPanel, TabView } from "primereact/tabview";
import { useEffect, useState } from "react";

import Loading from "@/app/[locale]/_components/Common/Loading";
import MobileMetaSetter from "@/app/[locale]/_components/Common/MobileMetaSetter";
import { MarketMobileFilter } from "@/app/[locale]/_components/Filters/MarketPlaceFilters/Mobile/MarketMobileFilter";
import { SelectedFiltersTab } from "@/app/[locale]/_components/Filters/MarketPlaceFilters/SelectedFiltersTab";
import { FAQComponent } from "@/app/[locale]/_components/MarketComponents/FAQComponent";
import NotFoundPage from "@/app/[locale]/_components/NotFound/NotFoundPage";
import { parseCategoryString } from "@/app/[locale]/_hooks/utility";
import {
  ProductSortBy,
  ProductSupplierListInterface,
} from "@/app/[locale]/_interface/MarketPlaceInterface";
import { useFaqCategoryListQuery, useGetProductCategoryListQuery } from "@/app/[locale]/_store/apiReducer/marketApi";
import {
  setProductsSortBy,
  setSupplierSortBy,
} from "@/app/[locale]/_store/reducers/filters_store";
import {
  setIsFilterSideBarOpen,
  setProductListView,
  setSupplierListView,
} from "@/app/[locale]/_store/reducers/ui_store";
import {
  BreadcrumbItemWithRef,
  updateBreadcrumbTrail,
} from "@/app/[locale]/_utility/breadcrumbTrail";
import { getMetaFromBreadcrumbs } from "@/app/[locale]/_utility/getMetaFromBreadcrumbs ";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { useParams, useRouter, useSearchParams } from "next/navigation";
interface WrapperProps {
  isProduct: boolean;
  categoryInfo?: any;
  breadcrumbData: BreadcrumbItem;
}
export const ProductWrapperComponent: React.FC<WrapperProps> = ({
  isProduct,
  categoryInfo,
  breadcrumbData,
}) => {
  const productListView = useAppSelector(
    (state) => state.uiData.productListView
  );
  const supplierListView = useAppSelector(
    (state) => state.uiData.supplierListView
  );
  const productSearchQuery = useAppSelector(
    (state) => state.filterData.productSearchQuery
  );
  // const [selectedSort, setSelectedSort] =
  //   useState<ProductSupplierListInterface>({
  //     productSort: "",
  //     supplierSort: "",
  //   });
  const [refQuery, setRefQuery] = useState<string>("");
  const [breadCrumpData, setBreadCrumpData] = useState<BreadcrumbItemWithRef[]>(
    []
  );
  // const [isFilterSideBarOpen, setIsFilterSideBarOpen] =
  //   useState<boolean>(false);
  const [, setCategory] = useState<string | null>(null);
  const isMobile = useIsMobile();
  const { locale } = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();
  const direct = searchParams.get("direct");
  const trans = useTranslations("categoryPage");
  const [activeIndex, setActiveIndex] = useState(direct == "supplier" ? 1 : 0);
  const t = useTranslations("productDetailPage");
  const [expanded, setExpanded] = useState(false);

  const MAX_LENGTH = 300;
  const isLong =
    categoryInfo?.seoContent?.by_lang?.en?.intro_html.length > MAX_LENGTH;
  const displayText =
    expanded || !isLong
      ? categoryInfo?.seoContent?.by_lang?.en?.intro_html
      : categoryInfo?.seoContent?.by_lang?.en?.intro_html.slice(0, MAX_LENGTH) +
      "...";
  const dispatch = useAppDispatch();
  const { isFilterSidebarOpen } = useAppSelector(
    (state: RootState) => state.uiData
  );
  const params = useParams();

  const extractID = (value?: string | string[]): string => {
    if (!value) return '';
    const val = Array.isArray(value) ? value.join('-') : value;
    return val.split('-').pop() ?? '';
  };

  const subcategoryParam = params.subcategory;
  const productCategoryParam = params.productCategory;
  const hasSubcategory = Boolean(subcategoryParam);
  const getCategoryType = hasSubcategory ? 'subCategory' : 'productCategory';
  const getID = hasSubcategory
    ? extractID(subcategoryParam)
    : (productCategoryParam as string) ?? '';

  //FAQ List API
  const { data: FaqData, refetch } = useFaqCategoryListQuery({
    type: getCategoryType,
    categoryId: getID
  });

  useEffect(() => {
    refetch();
  }, []);

  const subcategory =
    typeof params?.subcategory === "string" ? params.subcategory : "";
  parseCategoryString(subcategory);

  const { id: subcategory_id } = parseCategoryString(subcategory);

  // subCatDetail is now passed as a prop from the parent component
  const productSort = useAppSelector((state) => state.filterData.productSort);
  const supplierSort = useAppSelector((state) => state.filterData.supplierSort);

  const { data: productCategoryList } = useGetProductCategoryListQuery({
    subCategory_id: subcategory_id ? subcategory_id : undefined,
  });

  console.log("Catgeory list", productCategoryList);

  const productCategory =
    productCategoryList?.data?.listData.length > 0
      ? productCategoryList?.data?.listData[0].productInfo
      : [];

  useEffect(() => {
    const ref = searchParams.get("ref") ?? undefined;
    const {
      refQuery,
      breadCrumpData,
      categoryPaths: { category },
    } = updateBreadcrumbTrail(ref, breadcrumbData);

    setRefQuery(refQuery);
    setBreadCrumpData(breadCrumpData);
    setCategory(category);
  }, [searchParams, breadcrumbData]);

  useEffect(() => {
    const ref = searchParams.get("ref") ?? undefined;
    const {
      categoryPaths: { category },
    } = updateBreadcrumbTrail(ref);
    if (isProduct && productSearchQuery === "" && category === null) {
      router.push(`/${locale}`);
    }
  }, [isProduct, productSearchQuery, searchParams]);

  const handleSpecificSort = (
    type: keyof ProductSupplierListInterface,
    val: ProductSortBy
  ) => {
    if (type === "productSort") {
      dispatch(setProductsSortBy(val));
    } else {
      dispatch(setSupplierSortBy(val));
    }
  };

  const mainContent = (
    <div className="p-w-main page-container category-page-main category-detail-page-main">
      {breadCrumpData.length > 0 && (
        <MobileMetaSetter {...getMetaFromBreadcrumbs(breadCrumpData)} />
      )}
      <BreadCrumbs data={breadCrumpData} />
      <div className="section-block-group">
        <div className="overview-filter-block">
          <section className="section-block cate-info-tabs-block">
            {!(isMobile && isProduct) && (
              <div className="s-b-head">
                <div className="s-b-h-left">
                  <div className="title-block sub-cat-title-block">
                    <Typography className="cat-title" variant="h1">
                      {categoryInfo?.name ?? "Products"}
                    </Typography>

                    {categoryInfo?.seoContent?.by_lang?.en?.llm_text && (
                      <div style={{ display: "none" }}>
                        <Typography className="cat-subtxt" variant="p">
                          {categoryInfo?.seoContent?.by_lang?.en?.llm_text}
                        </Typography>
                      </div>
                    )}
                    {/* {!isProduct && (
                      <Typography className="cat-subtxt" variant="p">
                        {trans("searchResults.title", {
                          count: subCatDetail?.totalProductsCount ?? 0,
                          name: subCatDetail?.name ?? "Products",
                        })}
                      </Typography>
                    )} */}
                    {!isProduct && (
                      <Typography className="cat-subtxt" variant="p">
                        {t("productsAvailable", {
                          count: categoryInfo?.totalProductsCount,
                        })}
                      </Typography>
                    )}
                  </div>
                </div>
                {!isProduct &&
                  (categoryInfo?.marketSize ||
                    categoryInfo?.averageMargin ||
                    categoryInfo?.annualGrowth) && (
                    <div className="s-b-h-right">
                      <CategoryOverview
                        marketSize={categoryInfo?.marketSize}
                        annualGrowth={categoryInfo?.annualGrowth}
                        avgMargin={categoryInfo?.averageMargin}
                      />
                    </div>
                  )}
              </div>
            )}
            <div className="text-container">
              <Typography className="cat-subtxt" variant="h1">
                {displayText}
                {isLong && (
                  <button
                    onClick={() => setExpanded(!expanded)}
                    className="product-description-show-more"
                  >
                    {expanded ? t("showLess") : t("showMore")}
                  </button>
                )}
              </Typography>
            </div>
            <div className="tabs-block-group">
              <div className="tabs-block">
                <Button
                  className={`btn-outline ${activeIndex == 0 ? "active" : ""}`}
                  text={trans("common.products")}
                  onClick={() => setActiveIndex(0)}
                />
                <Button
                  className={`btn-outline ${activeIndex == 1 ? "active" : ""}`}
                  text={trans("common.suppliers")}
                  onClick={() => setActiveIndex(1)}
                />
                {activeIndex == 0 && (
                  <Tabs
                    tabsName={catDetailTabs}
                    className="grid-view-switch"
                    setListStatus={(val) => dispatch(setProductListView(val))}
                    activeTab={productListView}
                    isIcon
                  />
                )}
              </div>
            </div>
          </section>
          <TabView
            activeIndex={activeIndex}
            onTabChange={(e) => setActiveIndex(e.index)}
          >
            <TabPanel className="tab-panel">
              <section className="section-block filter-list-sort-block p-mob-pad">
                <div className="s-b-head">
                  <div className="s-b-h-left filter-list-group">
                    {!isMobile && (
                      <ButtonIconLeftOutline
                        className={
                          "bg-outline-grey btn-filter-select filter-btn"
                        }
                        onClick={() =>
                          dispatch(setIsFilterSideBarOpen(!isFilterSidebarOpen))
                        }
                      >
                        <FilterIcon />
                      </ButtonIconLeftOutline>
                    )}

                    {/* <ButtonIconLeftOutline
                      name={"India"}
                      className={"bg-outline-grey btn-filter-select"}
                    >
                      <CloseIcon />
                    </ButtonIconLeftOutline>
                    <ButtonIconLeftOutline
                      name={"Verified Supplier"}
                      className={"bg-outline-grey btn-filter-select"}
                    >
                      <CloseIcon />
                    </ButtonIconLeftOutline> */}
                    <SelectedFiltersTab type="Products" />
                  </div>
                  <div className="s-b-h-right">
                    <Tabs
                      tabsName={catDetailTabs}
                      className="grid-view-switch"
                      setListStatus={(val) => dispatch(setProductListView(val))}
                      activeTab={productListView}
                      isIcon
                    />
                    <Select
                      options={productSortingList}
                      value={productSort}
                      onChange={(val) => handleSpecificSort("productSort", val)}
                      placeholder={"Sort by relevance"} // placeholder={"Sort by relevance"}
                    />
                  </div>
                </div>
                <ProductList
                  isProductListView={productListView}
                  activeIndex={activeIndex}
                  refQuery={refQuery}
                  isProduct={isProduct}
                // specificSort={selectedSort.productSort}
                />
              </section>
            </TabPanel>

            {/* SuppliersList */}
            <TabPanel>
              <section className="section-block filter-list-sort-block">
                <div className="s-b-head p-mob-pad">
                  <div className="s-b-h-left filter-list-group">
                    <ButtonIconLeftOutline
                      className={"bg-outline-grey btn-filter-select filter-btn"}
                      onClick={() =>
                        dispatch(setIsFilterSideBarOpen(!isFilterSidebarOpen))
                      }
                    >
                      <FilterIcon />
                    </ButtonIconLeftOutline>
                    <SelectedFiltersTab type="Suppliers" />
                  </div>
                  <div className="s-b-h-right">
                    <Tabs
                      tabsName={catDetailTabs}
                      className="grid-view-switch"
                      setListStatus={(val) =>
                        dispatch(setSupplierListView(val))
                      }
                      activeTab={supplierListView}
                      isIcon
                    />
                    <Select
                      options={supplierSortingList}
                      value={supplierSort}
                      onChange={(val) =>
                        handleSpecificSort("supplierSort", val)
                      }
                      placeholder={"Sort by relevance"}
                    />
                  </div>
                </div>
                <SupplierList
                  isProductListView={supplierListView}
                  activeIndex={activeIndex}
                  refQuery={refQuery}
                  specificSort={supplierSort}
                />
              </section>
            </TabPanel>
          </TabView>
        </div>
        {breadcrumbData?.type === "sc" && productCategory?.length > 0 && (
          <div className="product-categories-container">
            <h2 className="product-categories-heading">Product Categories:</h2>
            <ul className="product-categories-list">
              {productCategory?.map((item: any, index: number) => (
                <li key={index}>
                  <div
                    className={`product-category-name ${index < productCategory.length - 1
                      ? "p-c-seperator"
                      : ""
                      }`}
                  >
                    <Link
                      href={{
                        pathname: `/pc/${item?.liveUrl}`,
                        query: { ref: refQuery },
                      }}
                      className="product-category-txt"
                    >
                      {item.name}
                    </Link>
                    {/* <span className="t-f-g-txt">{item.name}</span> */}
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* FAQ Components */}
        {((params.subcategory || params.productCategory) && FaqData?.data?.faqs) && <FAQComponent faqs={FaqData?.data?.faqs} />}

        {/* Why Businesses */}
        <WhyBusiness />
      </div>
    </div>
  );
  // Handle case where categoryInfo is not available (for non-product pages)
  if (!isProduct && !categoryInfo) {
    return <NotFoundPage />;
  }

  return (
    <>
      {!categoryInfo && !isProduct ? (
        <Loading isWrapper />
      ) : (
        <>
          <div className="p-l-m-t-body">
            <div
              className={`page-wrapper page-wrapper-with-side-filter ${isFilterSidebarOpen ? "sidebar-close" : ""
                }`}
            >
              <div className="p-w-sidebar">
                <FilterSidebar
                  type={activeIndex === 0 ? "Products" : "Suppliers"}
                  mappedId=""
                />
              </div>
              {mainContent}
            </div>
          </div>

          {isMobile && (
            <MarketMobileFilter
              type={activeIndex === 0 ? "Products" : "Suppliers"}
              mappedId=""
            />
          )}
        </>
      )}
    </>
  );
};
