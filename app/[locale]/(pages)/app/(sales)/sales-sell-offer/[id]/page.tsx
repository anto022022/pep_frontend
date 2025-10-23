"use client";
import PlaceholderGallerySlider from "@/app/[locale]/_components/Carousel/PlaceholderGallerySlider";
import ThumbsGallerySlider from "@/app/[locale]/_components/Carousel/ThumbsGallerySlider";
import TempMobScreen from "@/app/[locale]/_components/Common/TempMobScreen";
import MainAccordion from "@/app/[locale]/_components/StoreFront/Forms/SellOfferInfoAccordion/MainAccordion";
import ProductViewSideComponent from "@/app/[locale]/_components/StoreFront/Forms/SellOfferInfoAccordion/ProductViewSideComponent";
import useIsMobile from "@/app/[locale]/_hooks/useIsMobile";
import { SellOfferPreviewData } from "@/app/[locale]/_interface/SellOfferInterface";
import { useGetOfferPreviewDetailsQuery } from "@/app/[locale]/_store/apiReducer/sellOfferApi";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { use, useEffect, useState } from "react";
import Typography from "../../../../../_components/Base/Typography";
import ButtonIconLeftOutline from "../../../../../_components/Buttons/ButtonIconLeftOutline";
import { EditVariantsIcon, LeftArrowIcon } from "../../../../../_components/Icons/SVGIcons";
import MobileNavBar from "@/app/[locale]/_components/Navbar/MobileNavBar";
import MobileTabs from "@/app/[locale]/_components/MobileComponents/MobileTabs";
import { TabPanel, TabView } from "primereact/tabview";
import Buttons from "@/app/[locale]/_components/Buttons/Buttons";

const page = ({ params }: { params: Promise<any> }) => {

  // const params = useParams()
  // const { locale } = params
  const unwrappedParams = use(params);
  // const locale = unwrappedParams.locale;
  const t = useTranslations("salesOffer.viewPage");
  const isMobile = useIsMobile(1200);
  const router = useRouter();
  const [previewData, setPreviewData] = useState<SellOfferPreviewData | null>(
    null
  );
  const [activeIndex, setActiveIndex] = useState<number>(0);
  const { data, isSuccess, refetch } = useGetOfferPreviewDetailsQuery(
    unwrappedParams?.id ?? undefined,
    { skip: !unwrappedParams?.id, refetchOnMountOrArgChange: true }
  );

  useEffect(() => {
    if (unwrappedParams?.id) refetch();
  }, [unwrappedParams?.id]);

  useEffect(() => {
    if (isSuccess && data) {
      setPreviewData(data.data);
    }
  }, [data, isSuccess]);
  const handleEditClick = () => {
    router.push(`./form?id=${unwrappedParams?.id}`);
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
      {previewData && (
        !isMobile ? (
          <div className="landing-page-layout">
            <header className="l-p-l-header">
              <div className="l-p-l-h-left">
                <div className="previous-btn-comp">
                  <Link
                    href={`../sales-sell-offer`}
                    className="btn-comp btn-icon"
                  >
                    <LeftArrowIcon />
                  </Link>
                  <Typography variant="span" className="p-b-c-txt">
                    {t("mainTitle")}
                  </Typography>
                </div>
              </div>
              <div className="l-p-l-h-right">
                <ButtonIconLeftOutline
                  name={t("editDetails")}
                  className={"bg-outline-grey custom-width"}
                  onClick={handleEditClick}
                ></ButtonIconLeftOutline>
              </div>
            </header>
            <section className="l-p-l-body">
              <div className="l-p-l-b-left wid-100">
                <div className="box-shads-1 product-main-info">
                  <div className="p-m-i-title-breif">
                    <Typography variant="h1" className="p-m-i-title">
                      {previewData?.offerTitle}
                    </Typography>
                    <p className="p-m-i-desc"> {previewData?.offerDescription}</p>
                  </div>

                  {previewData?.productDetails?.productImage ? (
                    <ThumbsGallerySlider
                      sliderImages={previewData?.productDetails.productImage}
                      isViewDetailPage={true}
                    />
                  ) : (
                    <PlaceholderGallerySlider />
                  )}
                </div>
                <MainAccordion
                  previewData={previewData}
                  id={unwrappedParams?.id}
                />
              </div>
              <ProductViewSideComponent previewData={previewData} />
            </section>
          </div>
        )
          :
          (
            <>
              <MobileNavBar title={t("mainTitle")} path={`/app/sales-sell-offer`}>
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
                                  {previewData?.offerTitle}
                                </Typography>
                                <p className="p-m-i-desc"> {previewData?.offerDescription}</p>
                              </div>

                              {previewData?.productDetails?.productImage ? (
                                <ThumbsGallerySlider
                                  sliderImages={previewData?.productDetails.productImage}
                                  isViewDetailPage={true}
                                />
                              ) : (
                                <PlaceholderGallerySlider />
                              )}
                            </div>
                            <MainAccordion
                              previewData={previewData}
                              id={unwrappedParams?.id}
                            />
                          </div>
                        </TabPanel>
                        <TabPanel className="tab-panel">
                          <ProductViewSideComponent previewData={previewData} />
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
          )
      )}
    </>
  );
};

export default page;
