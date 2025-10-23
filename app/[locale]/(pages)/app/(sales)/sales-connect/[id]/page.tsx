"use client";
import Typography from "@/app/[locale]/_components/Base/Typography";
import Button from "@/app/[locale]/_components/Buttons/Button";
import ButtonIcon from "@/app/[locale]/_components/Buttons/ButtonIcon";
import ButtonIconLeftOutline from "@/app/[locale]/_components/Buttons/ButtonIconLeftOutline";
import ButtonIconRight from "@/app/[locale]/_components/Buttons/ButtonIconRight";
import LeadSummaryCard from "@/app/[locale]/_components/Cards/LeadSummaryCard";
import NoInquiresCard from "@/app/[locale]/_components/Cards/NoInquiriesCard";

import {
  CollapseUpIcon,
  EditVariantsIcon,
  FilterMobIcon,
  LeftArrowIcon,
  SearchIcon,
} from "@/app/[locale]/_components/Icons/SVGIcons";
import MobileTabs from "@/app/[locale]/_components/MobileComponents/MobileTabs";
import MobileNavBar from "@/app/[locale]/_components/Navbar/MobileNavBar";
import AddNewContactForm, {
  ContactFormValues,
} from "@/app/[locale]/_components/OverLay/AddNewContactForm";
import CompanyInformationTab from "@/app/[locale]/_components/StoreFront/Forms/ConnectInfoAccordion/CompanyInfromationTab";
import ContactInformationTab from "@/app/[locale]/_components/StoreFront/Forms/ConnectInfoAccordion/ContactInformationTab";
import LeadsList from "@/app/[locale]/_components/StoreFront/LeadsList";
import LogsList from "@/app/[locale]/_components/StoreFront/LogsList";
import useIsMobile from "@/app/[locale]/_hooks/useIsMobile";
import { CustomerLifeCycle } from "@/app/[locale]/_interface/CustomerInterface";
import {
  useGetContactDetailsQuery,
  useGetContactThreadDetailsQuery,
  useGetDropdownListQuery,
  useUpdateCustomerInformationMutation,
} from "@/app/[locale]/_store/apiReducer/connectApi";
import { setThreadId } from "@/app/[locale]/_store/reducers/connect_store";
import { setIsAddNewContactOpen } from "@/app/[locale]/_store/reducers/ui_store";
import {
  RootState,
  useAppDispatch,
  useAppSelector,
} from "@/app/[locale]/_store/store";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { Accordion, AccordionTab } from "primereact/accordion";
import { TabPanel, TabView } from "primereact/tabview";
import { use, useEffect, useState } from "react";

const page = ({ params }: { params: Promise<any> }) => {
  const unwrappedParams = use(params);
  const t = useTranslations("salesConnect.detailPage");
  const [updateContactInformation] = useUpdateCustomerInformationMutation();
  const id = unwrappedParams?.id;
  const dispatch = useAppDispatch();
  const isMobile = useIsMobile(1200);
  const threadId = useAppSelector((state: RootState) => state.connect.threadId);
  const { data, isSuccess } = useGetContactDetailsQuery(
    unwrappedParams?.id ?? undefined,
    { skip: !unwrappedParams?.id }
  );
  const { data: dropdownData } = useGetDropdownListQuery({
    page: 1,
    limit: 10,
  });

  const { data: threadData } = useGetContactThreadDetailsQuery(
    {
      threadId: data?.data?.responses?.threadIds ?? undefined,
      page: 1,
      limit: 10,
      pageType: "connect",
      pageId: id,
    },
    {
      skip: !data?.data?.responses?.threadIds,
    }
  );
  const [activeIndex, setActiveIndex] = useState(0);
  const [activeMainIndex, setActiveMainIndex] = useState(0);


  useEffect(() => {
    dispatch(setThreadId(data?.data?.responses?.threadIds));
  }, [data]);

  const handleTagChange = async (tagValue: CustomerLifeCycle) => {
    try {
      await updateContactInformation({
        id: data?.data?.customerId,
        data: {
          lifeCycle: tagValue,
        },
      }).unwrap();
    } catch (error) {
      console.log(error);
    }
  };

  const handleSourceChange = async (sourceValue: any) => {
    try {
      await updateContactInformation({
        id: data?.data?.customerId,
        data: {
          source: sourceValue,
        },
      }).unwrap();
    } catch (error) {
      console.log(error);
    }
  };

  // if (isMobile) {
  //   return <TempMobScreen />;
  // }


  const tabName = [
    {
      name: "salesConnect.detailPage.information",
      id: 1,
      status: 0,
    },
    {
      name: "salesConnect.detailPage.leads",
      id: 2,
      status: 1,
    },
    {
      name: "salesConnect.detailPage.analytics",
      id: 3,
      status: 2,
    },
  ];

  return (
    <>
      {!isMobile ?
        <div className="page-three-layout scroll-page">
          <div className="p-t-l-head">
            <div className="p-t-l-h-left">
              <div className="previous-btn-comp">
                <Link href={"/app/sales-connect"} className="btn-comp btn-icon">
                  <LeftArrowIcon />
                </Link>
                <Typography variant="span" className="p-b-c-txt">
                  {t("title")}
                </Typography>
              </div>
            </div>
            <div className="p-t-l-h-right"></div>
          </div>
          <div className="p-t-l-body">
            <div className="p-t-l-b-left">
              <div className="contact-card-comp">
                <div className="c-c-c-left">
                  <div className="profile-card-comp">
                    {/* <div className='p-c-c-img'>
                                    <Image src={'https://www.shutterstock.com/image-photo/head-shot-portrait-close-smiling-600nw-1714666150.jpg'} width={40} height={40} alt='Profile' sizes='100vw' />
                                    <span className='active-bagde'></span>
                                </div> */}
                    <div className="p-c-c-info">
                      <Typography variant="span" className="p-c-c-name">
                        {data?.data?.customer.contactName}
                      </Typography>
                      <Typography variant="span" className="p-c-c-role">
                        {data?.data?.customer.companyName}
                      </Typography>
                    </div>
                  </div>
                </div>
              </div>
              <div className="accordion-comp label-grey-reverse">
                <Accordion activeIndex={[0, 1]} multiple>
                  <AccordionTab
                    header={
                      <div className="wid-100 d-flex align-cntr jus-btwn">
                        <Typography variant="h2">{t("contactInfo")}</Typography>

                        <div className="d-flex align-cntr gap-5px">
                          <ButtonIconLeftOutline
                            className="bg-outline-grey remv-outline pad-unset"
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              dispatch(setIsAddNewContactOpen(true));
                            }}
                          >
                            <EditVariantsIcon />
                          </ButtonIconLeftOutline>
                        </div>
                      </div>
                    }
                  >
                    {data?.data?.customer && (
                      <ContactInformationTab customer={data?.data?.customer} />
                    )}
                  </AccordionTab>
                  <AccordionTab
                    header={
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          width: "100%",
                        }}
                      >
                        <Typography variant="h2">{t("companyInfo")}</Typography>

                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "8px",
                          }}
                        >
                          <ButtonIconLeftOutline
                            className="bg-outline-grey remv-outline pad-unset"
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              dispatch(setIsAddNewContactOpen(true));
                            }}
                          >
                            <EditVariantsIcon />
                          </ButtonIconLeftOutline>
                        </div>
                      </div>
                    }
                  >
                    {data?.data?.company && (
                      <CompanyInformationTab
                        company={data?.data?.company}
                        customer={data?.data?.customer}
                      />
                    )}
                  </AccordionTab>
                </Accordion>
              </div>
            </div>
            <div className="p-t-l-b-center">
              {isSuccess &&
                (data?.data?.responses?.leads?.length > 0 ||
                  data?.data?.responses?.threadIds?.length > 0) ? (
                <>
                  <div className="leads-inbox-block">
                    <div className="inbox-title-block-comp">
                      <div className="i-t-b-c-details-block">
                        <div className="i-t-b-c-d-b-left button-wrapper">
                          <div className="search-product-comp grey-search-comp icon-left">
                            <input
                              type="search"
                              className="s-p-c-input"
                              placeholder={t("search")}
                            ></input>
                            <div className="s-p-c-icons">
                              <SearchIcon />
                            </div>
                          </div>
                          <ButtonIcon className={"b-c-i-outline b-c-i-light-grey"}>
                            <FilterMobIcon />
                          </ButtonIcon>
                        </div>
                        <div className="i-t-b-c-d-b-right">
                          <ButtonIconRight
                            name={t("expand")}
                            theme={"btn-outline bg-outline-light-grey"}
                          >
                            <CollapseUpIcon />
                          </ButtonIconRight>
                        </div>
                      </div>
                      <div className="i-t-b-c-action-block">
                        <div className="tabs-block leads-inbox-tabs">
                          <Button
                            className={`btn-outline ${activeIndex == 0 ? "active" : ""
                              }`}
                            text={t("leads")}
                            onClick={() => setActiveIndex(0)}
                          />
                          <Button
                            className={`btn-outline ${activeIndex == 1 ? "active" : ""
                              }`}
                            text={t("inbox")}
                            onClick={() => setActiveIndex(1)}
                          />
                        </div>
                      </div>
                      <TabView
                        activeIndex={activeIndex}
                        onTabChange={(e) => setActiveIndex(e.index)}
                        className="inbox-log-tabs"
                      >
                        <TabPanel>
                          <div className="logs-list-comp">
                            {data?.data?.responses?.leads ? (
                              <LeadsList leads={data?.data?.responses?.leads} />
                            ) : null}
                          </div>
                        </TabPanel>
                        <TabPanel>
                          {data?.data?.responses.threadIds ? (
                            <LogsList
                              threadData={threadData?.data?.listData}
                              pageId={id}
                              listData={dropdownData?.data?.listData?.result}
                              pageType="connect"
                            />
                          ) : null}
                        </TabPanel>
                      </TabView>
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <NoInquiresCard
                    listData={dropdownData?.data?.listData?.result}
                    id={id}
                    pageType="connect"
                  />
                </>
              )}
            </div>
            <div className="p-t-l-b-right">
              {data?.data?.customer && (
                <LeadSummaryCard
                  customer={data?.data?.customer}
                  onTagChange={handleTagChange}
                  onSourceChange={handleSourceChange}
                />
              )}
            </div>
          </div>
        </div>
        :
        <>
          <MobileNavBar title={t("title")} path={`/app/sales-connect`}>
            {null}
          </MobileNavBar>
          <div className="d-l-wrapper">
            <div className="d-l-body">
              <div className='dash-center-layout-mob'>
                <MobileTabs
                  tabsName={tabName}
                  activeTab={activeMainIndex}
                  setListStatus={(val: string | number) =>
                    setActiveMainIndex(Number(val))
                  }
                />
                <div className='d-c-l-m-body'>
                  <TabView activeIndex={activeMainIndex} onTabChange={(e) => setActiveMainIndex(e.index)} className='dash-tabview-mob'>
                    <TabPanel className='tab-panel'>
                      <div className='lead-info-wrapper-mob'>
                        <div className="contact-card-comp">
                          <div className="c-c-c-left">
                            <div className="profile-card-comp">
                              {/* <div className='p-c-c-img'>
                                    <Image src={'https://www.shutterstock.com/image-photo/head-shot-portrait-close-smiling-600nw-1714666150.jpg'} width={40} height={40} alt='Profile' sizes='100vw' />
                                    <span className='active-bagde'></span>
                                </div> */}
                              <div className="p-c-c-info">
                                <Typography variant="span" className="p-c-c-name">
                                  {data?.data?.customer.contactName}
                                </Typography>
                                <Typography variant="span" className="p-c-c-role">
                                  {data?.data?.customer.companyName}
                                </Typography>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="accordion-comp label-grey-reverse">
                          <Accordion activeIndex={[0, 1]} multiple>
                            <AccordionTab
                              header={
                                <div className="wid-100 d-flex align-cntr jus-btwn">
                                  <Typography variant="h2">{t("contactInfo")}</Typography>

                                  <div className="d-flex align-cntr gap-5px">
                                    <ButtonIconLeftOutline
                                      className="bg-outline-grey remv-outline pad-unset"
                                      onClick={(e) => {
                                        e.preventDefault();
                                        e.stopPropagation();
                                        dispatch(setIsAddNewContactOpen(true));
                                      }}
                                    >
                                      <EditVariantsIcon />
                                    </ButtonIconLeftOutline>
                                  </div>
                                </div>
                              }
                            >
                              {data?.data?.customer && (
                                <ContactInformationTab customer={data?.data?.customer} />
                              )}
                            </AccordionTab>
                            <AccordionTab
                              header={
                                <div
                                  style={{
                                    display: "flex",
                                    justifyContent: "space-between",
                                    alignItems: "center",
                                    width: "100%",
                                  }}
                                >
                                  <Typography variant="h2">{t("companyInfo")}</Typography>

                                  <div
                                    style={{
                                      display: "flex",
                                      alignItems: "center",
                                      gap: "8px",
                                    }}
                                  >
                                    <ButtonIconLeftOutline
                                      className="bg-outline-grey remv-outline pad-unset"
                                      onClick={(e) => {
                                        e.preventDefault();
                                        e.stopPropagation();
                                        dispatch(setIsAddNewContactOpen(true));
                                      }}
                                    >
                                      <EditVariantsIcon />
                                    </ButtonIconLeftOutline>
                                  </div>
                                </div>
                              }
                            >
                              {data?.data?.company && (
                                <CompanyInformationTab
                                  company={data?.data?.company}
                                  customer={data?.data?.customer}
                                />
                              )}
                            </AccordionTab>
                          </Accordion>
                        </div>
                      </div>
                    </TabPanel>
                    <TabPanel className='tab-panel'>
                      {isSuccess &&
                        (data?.data?.responses?.leads?.length > 0 ||
                          data?.data?.responses?.threadIds) ? (
                        <>
                          <div className="leads-inbox-block">
                            <div className="inbox-title-block-comp">
                              <div className="i-t-b-c-details-block">
                                <div className="i-t-b-c-d-b-left button-wrapper">
                                  <div className="search-product-comp grey-search-comp icon-left">
                                    <input
                                      type="search"
                                      className="s-p-c-input"
                                      placeholder={t("search")}
                                    ></input>
                                    <div className="s-p-c-icons">
                                      <SearchIcon />
                                    </div>
                                  </div>
                                  <ButtonIcon className={"b-c-i-outline b-c-i-light-grey"}>
                                    <FilterMobIcon />
                                  </ButtonIcon>
                                </div>
                                <div className="i-t-b-c-d-b-right">
                                  <ButtonIconRight
                                    name={t("expand")}
                                    theme={"btn-outline bg-outline-light-grey"}
                                  >
                                    <CollapseUpIcon />
                                  </ButtonIconRight>
                                </div>
                              </div>
                              <div className="i-t-b-c-action-block">
                                <div className="tabs-block leads-inbox-tabs">
                                  <Button
                                    className={`btn-outline ${activeIndex == 0 ? "active" : ""
                                      }`}
                                    text={t("leads")}
                                    onClick={() => setActiveIndex(0)}
                                  />
                                  <Button
                                    className={`btn-outline ${activeIndex == 1 ? "active" : ""
                                      }`}
                                    text={t("inbox")}
                                    onClick={() => setActiveIndex(1)}
                                  />
                                </div>
                              </div>
                              <TabView
                                activeIndex={activeIndex}
                                onTabChange={(e) => setActiveIndex(e.index)}
                                className="inbox-log-tabs"
                              >
                                <TabPanel>
                                  <div className="logs-list-comp">
                                    {data?.data?.responses?.leads ? (
                                      <LeadsList leads={data?.data?.responses?.leads} />
                                    ) :
                                      null
                                    }
                                  </div>
                                </TabPanel>
                                <TabPanel>
                                  {data?.data?.responses.threadIds ? (
                                    <LogsList
                                      threadData={threadData?.data?.listData}
                                      pageId={id}
                                      listData={dropdownData?.data?.listData?.result}
                                      pageType="connect"
                                    />
                                  ) : null}
                                </TabPanel>
                              </TabView>
                            </div>
                          </div>
                        </>
                      ) : (
                        <>
                          <NoInquiresCard
                            listData={dropdownData?.data?.listData?.result}
                            id={id}
                            pageType="connect"
                          />
                        </>
                      )}
                    </TabPanel>
                    <TabPanel className='tab-panel'>
                      {data?.data?.customer && (
                        <LeadSummaryCard
                          customer={data?.data?.customer}
                          onTagChange={handleTagChange}
                          onSourceChange={handleSourceChange}
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
      <AddNewContactForm data={data?.data?.customer as ContactFormValues} />
    </>
  );
};

export default page;
