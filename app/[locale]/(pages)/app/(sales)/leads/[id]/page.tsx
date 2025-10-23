"use client";
import CompanyInfoCard from "@/app/[locale]/_components/Cards/CompanyInfoCard";
import ContactInfoCard from "@/app/[locale]/_components/Cards/ContactInfoCard";

import Typography from "@/app/[locale]/_components/Base/Typography";
import PreviousPageButton from "@/app/[locale]/_components/Buttons/PreviousPageButton";
import LeadDetailsCard from "@/app/[locale]/_components/Cards/LeadDetailsCard";
import SavedContactCard from "@/app/[locale]/_components/Cards/SavedContactCard";
import TempMobScreen from "@/app/[locale]/_components/Common/TempMobScreen";
import MessagingLayout from "@/app/[locale]/_components/Inbox/MessagingLayout";
import useIsMobile from "@/app/[locale]/_hooks/useIsMobile";
import { LeadsDetails } from "@/app/[locale]/_interface/LeadsInterface";
import { useGetDropdownListQuery } from "@/app/[locale]/_store/apiReducer/connectApi";
import { useGetLeadsDetailsQuery } from "@/app/[locale]/_store/apiReducer/leadsApi";
import { setThreadId } from "@/app/[locale]/_store/reducers/connect_store";
import { useAppDispatch } from "@/app/[locale]/_store/store";
import { useTranslations } from "next-intl";
import { Accordion, AccordionTab } from "primereact/accordion";
import { use, useEffect, useState } from "react";
import Buttons from "@/app/[locale]/_components/Buttons/Buttons";
import { TabPanel, TabView } from "primereact/tabview";
import MobileNavBar from "@/app/[locale]/_components/Navbar/MobileNavBar";
import MobileTabs from "@/app/[locale]/_components/MobileComponents/MobileTabs";

const page = ({ params }: { params: Promise<any> }) => {
  const unwrappedParams = use(params);
  const t = useTranslations("leads");
  const isMobile = useIsMobile(1200);
  const [previewData, setPreviewData] = useState<LeadsDetails | null>(null);
  const [activeMainIndex, setActiveMainIndex] = useState(0);
  const [activeIndex, setActiveIndex] = useState(0);
  const { data, isSuccess } = useGetLeadsDetailsQuery(
    unwrappedParams?.id ?? undefined,
    { skip: !unwrappedParams?.id }
  );
  const dispatch = useAppDispatch();
  const { data: dropdownData } = useGetDropdownListQuery({
    page: 1,
    limit: 10,
  });

  useEffect(() => {
    if (isSuccess && data) {
      setPreviewData(data.data);
      dispatch(setThreadId(data.data.threadId));
    }
  }, [data, isSuccess]);

  const tabName = [
    {
      name: "leads.viewPage.information",
      id: 1,
      status: 0,
    },
    {
      name: "leads.viewPage.logs",
      id: 2,
      status: 1,
    },
    {
      name: "leads.viewPage.leadDetails",
      id: 3,
      status: 2,
    },
  ];

  return (
    <>
      {
        !isMobile ?
          <div className="page-three-layout scroll-page">
            <div className="p-t-l-head">
              <div className="p-t-l-h-left">
                <PreviousPageButton href="/app/leads" title={t("title")} />
              </div>
              <div className="p-t-l-h-right"></div>
            </div>
            <div className="p-t-l-body">
              <div className="p-t-l-b-left">
                <SavedContactCard
                  name={previewData?.customer?.contactName}
                  role={previewData?.customer?.jobTitle}
                  image={previewData?.customer?.profileImage}
                />
                <div className="accordion-comp label-grey-reverse">
                  <Accordion
                    activeIndex={activeIndex}
                    multiple
                    onTabChange={(e) => setActiveIndex(e.index as number)}
                  >
                    <AccordionTab
                      header={
                        <Typography variant="h2">
                          {t("viewPage.contactInformation.title")}
                        </Typography>
                      }
                    >
                      <ContactInfoCard contactInfo={previewData?.customer ?? {}} />
                    </AccordionTab>
                    <AccordionTab
                      header={
                        <Typography variant="h2">
                          {t("viewPage.companyInformation.title")}
                        </Typography>
                      }
                    >
                      {" "}
                      <CompanyInfoCard
                        companyInfo={previewData?.company ?? {}}
                        contactInfo={previewData?.customer ?? {}}
                      />{" "}
                    </AccordionTab>
                  </Accordion>
                </div>
              </div>
              <div className="p-t-l-b-center">
                <div className="leads-inbox-block">
                  {previewData && (
                    <MessagingLayout
                      previewData={previewData}
                      listData={dropdownData?.data?.listData?.result}
                    />
                  )}
                </div>
              </div>
              <div className="p-t-l-b-right">
                {previewData && (
                  <LeadDetailsCard
                    previewData={previewData}
                    totalOrderQuantity={previewData?.totalOrderQuantity}
                  />
                )}
              </div>
            </div>
          </div>
          :
          <>
            <MobileNavBar title={t("viewPage.title")} path={`/app/leads`}>
              {null}
            </MobileNavBar>
            <div className="d-l-wrapper leads-view-detail">
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
                    <TabView activeIndex={activeMainIndex} onTabChange={(e) => setActiveMainIndex(e.index)} className='dash-tabview-mob'>
                      <TabPanel className='tab-panel'>
                        <div className='lead-info-wrapper-mob'>
                          <SavedContactCard
                            name={previewData?.customer?.contactName}
                            role={previewData?.customer?.jobTitle}
                            image={previewData?.customer?.profileImage}
                          />
                          <div className="accordion-comp label-grey-reverse">
                            <Accordion
                              activeIndex={activeIndex}
                              multiple
                              onTabChange={(e) => setActiveIndex(e.index as number)}
                            >
                              <AccordionTab
                                header={
                                  <Typography variant="h2">
                                    {t("viewPage.contactInformation.title")}
                                  </Typography>
                                }
                              >
                                <ContactInfoCard contactInfo={previewData?.customer ?? {}} />
                              </AccordionTab>
                              <AccordionTab
                                header={
                                  <Typography variant="h2">
                                    {t("viewPage.companyInformation.title")}
                                  </Typography>
                                }
                              >
                                {" "}
                                <CompanyInfoCard
                                  companyInfo={previewData?.company ?? {}}
                                  contactInfo={previewData?.customer ?? {}}
                                />{" "}
                              </AccordionTab>
                            </Accordion>
                          </div>
                        </div>
                      </TabPanel>
                      <TabPanel className='tab-panel'>
                        {previewData && (
                          <MessagingLayout
                            previewData={previewData}
                            listData={dropdownData?.data?.listData?.result}
                          />
                        )}
                      </TabPanel>
                      <TabPanel className='tab-panel'>
                        {previewData && (
                          <LeadDetailsCard
                            previewData={previewData}
                            totalOrderQuantity={previewData?.totalOrderQuantity}
                          />
                        )}
                      </TabPanel>
                    </TabView>
                  </div>
                </div>
              </div>
            </div>
          </>
      }

    </>
  );
};

export default page;
