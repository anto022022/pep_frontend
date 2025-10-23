"use client";
import Typography from "@/app/[locale]/_components/Base/Typography";
import ButtonIconLeftOutline from "@/app/[locale]/_components/Buttons/ButtonIconLeftOutline";
import Buttons from "@/app/[locale]/_components/Buttons/Buttons";
import BrDetailsCard from "@/app/[locale]/_components/Cards/BrDetailsCard";
import ChartAnalyticsCard from "@/app/[locale]/_components/Cards/ChartAnalyticsCard";
import SupplierQuoteCard from "@/app/[locale]/_components/Cards/SupplierQuoteCard";
import ApprovalStatus from "@/app/[locale]/_components/Common/dataTable/ApprovalStatus";
import TempMobScreen from "@/app/[locale]/_components/Common/TempMobScreen";
import {
  ArrowSwapIcon,
  LeftArrowIcon,
  QuotesIcon,
} from "@/app/[locale]/_components/Icons/SVGIcons";
import MobileTabs from "@/app/[locale]/_components/MobileComponents/MobileTabs";
import MobileNavBar from "@/app/[locale]/_components/Navbar/MobileNavBar";
import CreateBuyingRequestDialog from "@/app/[locale]/_components/OverLay/CreateBuyingRequestDialog";
import DatePipe from "@/app/[locale]/_components/Pipe/DatePipe";
import useIsMobile from "@/app/[locale]/_hooks/useIsMobile";
import { BuyingRequestDetails } from "@/app/[locale]/_interface/RfqInterface";
import { useGetBuyingRequestDetailsQuery } from "@/app/[locale]/_store/apiReducer/buyingRequestApi";
import { setIsAddPostBuyingRequestOpen } from "@/app/[locale]/_store/reducers/ui_store";
import { useAppDispatch } from "@/app/[locale]/_store/store";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { TabPanel, TabView } from "primereact/tabview";
import { use, useEffect, useState } from "react";

const page = ({ params }: { params: Promise<any> }) => {
  const [previewData, setPreviewData] = useState<BuyingRequestDetails | null>(
    null
  );
  const [selectedEditRfq, setSelectedEditRfq] = useState<string>("");
  const dispatch = useAppDispatch();
  const isMobile = useIsMobile(1200);
  const unwrappedParams = use(params);
  const editRequest = (id: string) => {
    setSelectedEditRfq(id);
    dispatch(setIsAddPostBuyingRequestOpen(true));
  };
  const [activeMainIndex, setActiveMainIndex] = useState(0);
  const [activeIndex, setActiveIndex] = useState<number>(0);
  const { data, isSuccess } = useGetBuyingRequestDetailsQuery(
    unwrappedParams?.id ?? undefined,
    { skip: !unwrappedParams?.id }
  );

  useEffect(() => {
    if (isSuccess && data) {
      setPreviewData(data.data);
    }
  }, [data, isSuccess]);

  const t = useTranslations("rfq.buyingRequest");

  // if (isMobile) {
  //   return <TempMobScreen />;
  // }

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
    {
      name: "rfq.buyingRequest.buyingRequestDetails.quotesReceived",
      id: 3,
      status: 2,
    },
  ];

  console.log('activeIndex', activeMainIndex);


  return (
    <>
      {previewData && (
        !isMobile ? (
          <div className="landing-page-layout buying-request-layout">
            <header className="l-p-l-header">
              <div className="l-p-l-h-left">
                <div className="previous-btn-comp">
                  <Link href={"/app/sourcing-rfq"} className="btn-comp btn-icon">
                    <LeftArrowIcon />
                  </Link>
                  <Typography variant="span" className="p-b-c-txt fnt-w-600">
                    {previewData?.rfqTitle ? previewData?.rfqTitle : ""}
                  </Typography>
                </div>

              </div>
              <div className="l-p-l-h-right">
                {/* <ButtonIconLeftOutline
                name={"Edit Details"}
                className={"bg-outline-grey custom-width"}
                onClick={() => editRequest(previewData._id)}
              ></ButtonIconLeftOutline> */}
                <div className="valid-txt">
                  <Typography variant="span" className="v-t-label">
                    {t("buyingRequestDetails.validityDate")}
                  </Typography>
                  <Typography variant="span" className="v-t-value">
                    {previewData.validityDate ? (
                      <DatePipe value={previewData.validityDate} type="date" />
                    ) : (
                      "Open Ended"
                    )}
                  </Typography>
                </div>
                <Link href={"/app/sourcing-rfq"}>
                  <Buttons
                    className={"btn-c-primary"}
                    disabled={true}
                    text={"Re-Post"}
                  />
                </Link>
              </div>
            </header>
            <div className="l-p-l-body-block">
              <section className="l-p-l-body">
                <div className="l-p-l-b-left width-100">
                  <BrDetailsCard {...previewData} />
                </div>
                <aside className="l-p-l-b-right">
                  <div className="box-shads-2 product-right-info status-box">
                    <div className="p-r-i-item">
                      <div className="space-btwn">
                        <div className="icon-label">
                          <label htmlFor="status" className="i-l-txt">
                            {t("buyingRequestDetails.status")}

                          </label>
                        </div>
                        <ApprovalStatus
                          key={previewData._id}
                          status={previewData?.status}
                        />
                      </div>
                    </div>
                  </div>
                  <ChartAnalyticsCard
                    impressions={previewData.analytics.impressions}
                    views={previewData.analytics.views}
                    quotes={previewData.analytics.quotesReceivedCount}
                  />
                </aside>
              </section>
              <div className="quotes-received-block">
                <div className="block-head">
                  <div className="b-h-left">
                    <div className="d-flex gap-10px align-cntr">
                      <QuotesIcon />
                      <Typography variant="span" className="b-h-title">
                        {t("buyingRequestDetails.quotesReceived")}
                      </Typography>
                    </div>
                  </div>
                  <div className="b-h-right">
                    <ButtonIconLeftOutline
                      name={"Sort By"}
                      className={"bg-outline-grey btn-c-sm"}
                    >
                      <ArrowSwapIcon />
                    </ButtonIconLeftOutline>
                  </div>
                </div>
                <SupplierQuoteCard data={[]} />
              </div>
            </div>
          </div>
        )
          :
          <>
            <MobileNavBar title={t("pageTitleMob")} path={`/app/sourcing-rfq`}>
              {null}
            </MobileNavBar>
            <div className="d-l-wrapper">
              <div className="d-l-body">
                <div className='dash-center-layout-mob'>
                  <MobileTabs
                    tabsName={tabName}
                    activeTab={activeIndex}
                    setListStatus={(val: string | number) =>
                      setActiveIndex(Number(val))
                    }
                  />
                  <div className='d-c-l-m-body'>
                    <TabView activeIndex={activeIndex} onTabChange={(e) => setActiveIndex(e.index)} className='dash-tabview-mob'>
                      <TabPanel className='tab-panel'>
                        <BrDetailsCard {...previewData} />
                      </TabPanel>
                      <TabPanel className='tab-panel'>
                        <div className='d-flex gap-10px flex-dir-col'>
                          <div className="box-shads-2 product-right-info status-box">
                            <div className="p-r-i-item">
                              <div className="space-btwn">
                                <div className="icon-label">
                                  <label htmlFor="status" className="i-l-txt">
                                    {t("buyingRequestDetails.status")}

                                  </label>
                                </div>
                                <ApprovalStatus
                                  key={previewData._id}
                                  status={previewData?.status}
                                />
                              </div>
                            </div>
                          </div>
                          <ChartAnalyticsCard
                            impressions={previewData.analytics.impressions}
                            views={previewData.analytics.views}
                            quotes={previewData.analytics.quotesReceivedCount}
                          />
                        </div>
                      </TabPanel>
                      <TabPanel className='tab-panel'>
                        <div className="quotes-received-block">
                          <div className="block-head">
                            <div className="b-h-left">
                              <div className="d-flex gap-10px align-cntr">
                                <QuotesIcon />
                                <Typography variant="span" className="b-h-title">
                                  {t("buyingRequestDetails.quotesReceived")}
                                </Typography>
                              </div>
                            </div>
                            <div className="b-h-right">
                              <ButtonIconLeftOutline
                                name={"Sort By"}
                                className={"bg-outline-grey btn-c-sm"}
                              >
                                <ArrowSwapIcon />
                              </ButtonIconLeftOutline>
                            </div>
                          </div>
                          <SupplierQuoteCard data={[]} />
                        </div>
                      </TabPanel>
                    </TabView>
                  </div>
                  <div className='d-c-l-m-footer d-c-l-m-f-left-right'>
                    <div className='d-c-l-m-f-l-f-left'>
                      <div className="valid-txt">
                        <span className="v-t-label">{t("buyingRequestDetails.validityDate")}</span>
                        <span className="v-t-value">{previewData.validityDate ? (
                          <DatePipe value={previewData.validityDate} type="date" />
                        ) : (
                          "Open Ended"
                        )}</span>
                      </div>
                    </div>
                    <div className='d-c-l-m-f-l-f-right'>
                      <Link href={"/app/sourcing-rfq"}>
                        <Buttons
                          className={"btn-c-primary"}
                          disabled={true}
                          text={"Re-Post"}
                        />
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </>
      )}
      <CreateBuyingRequestDialog selectedEditRfq={selectedEditRfq} />
    </>
  );
};

export default page;
