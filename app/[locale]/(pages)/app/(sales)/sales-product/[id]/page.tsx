"use client";
import Link from "next/link";
import { use, useEffect, useState } from "react";
// import ToggleInputs from '../../../../../_components/Forms/ToggleInputs'
import Typography from "@/app/[locale]/_components/Base/Typography";
import ButtonIconLeft from "@/app/[locale]/_components/Buttons/ButtonIconLeft";
import ButtonIconLeftOutline from "@/app/[locale]/_components/Buttons/ButtonIconLeftOutline";
import Buttons from "@/app/[locale]/_components/Buttons/Buttons";
import PlaceholderGallerySlider from "@/app/[locale]/_components/Carousel/PlaceholderGallerySlider";
import ThumbsGallerySlider from "@/app/[locale]/_components/Carousel/ThumbsGallerySlider";
import {
  EditVariantsIcon,
  LeftArrowIcon,
} from "@/app/[locale]/_components/Icons/SVGIcons";
import MobileTabs from "@/app/[locale]/_components/MobileComponents/MobileTabs";
import MobileNavBar from "@/app/[locale]/_components/Navbar/MobileNavBar";
import MainAccordion from "@/app/[locale]/_components/StoreFront/Forms/ProductInfoAccordion/MainAccordion";
import ProductViewSideComponent from "@/app/[locale]/_components/StoreFront/Forms/ProductInfoAccordion/ProductViewSideComponent";
import useIsMobile from "@/app/[locale]/_hooks/useIsMobile";
import { PreviewData } from "@/app/[locale]/_interface/SalesProductInterface";
import { useGetProductPreviewDetailsQuery } from "@/app/[locale]/_store/apiReducer/productsApi";
import Plus from "@/public/img/icons/plus.svg";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { TabPanel, TabView } from "primereact/tabview";

const page = ({ params }: { params: Promise<any> }) => {
  const unwrappedParams = use(params);
  const router = useRouter();
  const isMobile = useIsMobile(1200);
  const t = useTranslations("salesProduct.viewPage");

  const [previewData, setPreviewData] = useState<PreviewData | null>(null);
  const [activeIndex, setActiveIndex] = useState<number>(0);
  const { data, isSuccess, refetch } = useGetProductPreviewDetailsQuery(
    unwrappedParams?.id ?? undefined,
    { skip: !unwrappedParams?.id }
  );

  useEffect(() => {
    if (isSuccess && data) {
      setPreviewData(data.data);
    }
  }, [data, isSuccess]);

  useEffect(() => {
    if (unwrappedParams?.id) {
      refetch();
    }
  }, [unwrappedParams?.id]);

  const handleEditClick = () => {
    router.push(`/app/sales-product/form?id=${unwrappedParams?.id}`);
  };

  const tabName = [
    {
      name: "salesProduct.viewPage.information",
      id: 1,
      status: 0,
    },
    {
      name: "salesProduct.viewPage.analytics",
      id: 2,
      status: 1,
    },
  ];

  return (
    <>
      {previewData &&
        (!isMobile ? (
          <div className="landing-page-layout">
            <header className="l-p-l-header">
              <div className="l-p-l-h-left">
                <div className="previous-btn-comp">
                  <Link
                    href={"/app/sales-product"}
                    className="btn-comp btn-icon"
                  >
                    <LeftArrowIcon />
                  </Link>
                  <Typography variant="span" className="p-b-c-txt">
                    {t("addProduct")}
                  </Typography>
                </div>
              </div>
              <div className="l-p-l-h-right">
                <ButtonIconLeftOutline
                  name={t("editDetails")}
                  className={"bg-outline-grey custom-width"}
                  onClick={handleEditClick}
                ></ButtonIconLeftOutline>
                <Link href={"/app/sales-product/form"}>
                  <ButtonIconLeft
                    name={t("addNewProduct")}
                    icon={Plus}
                  ></ButtonIconLeft>
                </Link>
              </div>
            </header>
            <section className="l-p-l-body">
              <div className="l-p-l-b-left wid-100">
                <div className="box-shads-1 product-main-info">
                  <div className="p-m-i-title-breif">
                    <Typography variant="h1" className="p-m-i-title">
                      {previewData?.productName}
                    </Typography>
                    <p className="p-m-i-desc">
                      {" "}
                      {previewData?.productDescription}
                    </p>
                  </div>
                  <div className="badge-group">
                    {previewData?.productKeyword?.map((item, index) => (
                      <span key={index} className="badge-comp b-c-sm">
                        {item}
                      </span>
                    ))}
                  </div>
                  {previewData?.productImage ? (
                    <ThumbsGallerySlider
                      sliderImages={previewData.productImage}
                      isViewDetailPage={true}
                    />
                  ) : (
                    <PlaceholderGallerySlider />
                  )}
                </div>
                <MainAccordion previewData={previewData} />
              </div>
              <ProductViewSideComponent previewData={previewData} />
            </section>
          </div>
        ) : (
          <>
            <MobileNavBar title={t("title")} path={`/app/sales-product`}>
              <EditVariantsIcon
                className={"mob-head-icon"}
                onClick={handleEditClick}
              />
            </MobileNavBar>
            <div className="d-l-wrapper">
              <div className="d-l-body">
                <div className="dash-center-layout-mob">
                  <MobileTabs
                    tabsName={tabName}
                    activeTab={activeIndex}
                    setListStatus={(val: string | number) =>
                      setActiveIndex(Number(val))
                    }
                  />
                  <div className="d-c-l-m-body">
                    <TabView
                      activeIndex={activeIndex}
                      onTabChange={(e) => setActiveIndex(e.index)}
                      className="dash-tabview-mob hide-tab-container"
                    >
                      <TabPanel className="tab-panel">
                        <div className="d-flex flex-col gap-15px">
                          <div className="box-shads-1 product-main-info">
                            <div className="p-m-i-title-breif">
                              <Typography variant="h1" className="p-m-i-title">
                                {previewData?.productName}
                              </Typography>
                              <p className="p-m-i-desc">
                                {" "}
                                {previewData?.productDescription}
                              </p>
                            </div>
                            <div className="badge-group">
                              {previewData?.productKeyword?.map(
                                (item, index) => (
                                  <span
                                    key={index}
                                    className="badge-comp b-c-sm"
                                  >
                                    {item}
                                  </span>
                                )
                              )}
                            </div>
                            {previewData?.productImage ? (
                              <ThumbsGallerySlider
                                sliderImages={previewData.productImage}
                                isViewDetailPage={true}
                              />
                            ) : (
                              <PlaceholderGallerySlider />
                            )}
                          </div>
                          <MainAccordion previewData={previewData} />
                        </div>
                      </TabPanel>
                      <TabPanel className="tab-panel">
                        <ProductViewSideComponent
                          previewData={previewData}
                          isRePostBtnHide
                        />
                      </TabPanel>
                    </TabView>
                  </div>
                  <div className="d-c-l-m-footer">
                    <Buttons
                      className={"btn-c-primary wid-100"}
                      disabled={true}
                      text={t("rePost")}
                    />
                  </div>
                </div>
              </div>
            </div>
          </>
        ))}
    </>
  );
};

export default page;
