"use client";
import { useTranslations } from "next-intl";
// import KycAndKybIcon from '@/assets/img/kyc-kyb.svg';
import { useGetDashboardCardDetailsQuery } from "@/app/[locale]/_store/apiReducer/commonApi";
import { useEffect } from "react";
import Typography from "../Base/Typography";
import {
  AddSellOffers,
  AddYourFirstProduct,
  ManageRFQ,
  PostYourRequirements,
  ProfileTickIcon,
  PublishYourCatalog,
} from "../Icons/SVGIcons";
import AccountSetupCard from "./AccountSetupCard";
import ExploreCard from "./ExploreCard";

const DashboardBlock = () => {
  const t = useTranslations("userAdminDashboard");
  const { data: dashboardDetails, refetch } = useGetDashboardCardDetailsQuery();

  const exploreCards = [
    {
      title: t("settingsCompletion.addYourProduct"),
      subTxt: t("settingsCompletion.addYourProductSubTxt"),
      linkTxt: t("settingsCompletion.addYourProductLinkTxt"),
      path: "app/sales-product/form",
      icon: <AddYourFirstProduct />,
      type: ["seller", "both"],
      show: true,
    },

    {
      title: t("settingsCompletion.browseVerifiedSuppliers"),
      subTxt: t("settingsCompletion.browseVerifiedSuppliersSubTxt"),
      linkTxt: t("settingsCompletion.browseVerifiedSuppliersLinkTxt"),
      path: ` ${dashboardDetails?.data?.isIndustryStatus ? '/products?direct=supplier' : '/'}`,
      icon: <ProfileTickIcon />,
      type: ["buyer", "both"],
      show: true,
    },
    {
      title: t("settingsCompletion.postYourRequirements"),
      subTxt: t("settingsCompletion.postYourRequirementsSubTxt"),
      linkTxt: t("settingsCompletion.postYourRequirementsLinkTxt"),
      path: "app/sourcing-rfq",
      icon: <PostYourRequirements />,
      type: ["buyer", "both"],
      show: true,
    },
    // {
    //   title: t("settingsCompletion.addSellOffer"),
    //   subTxt: t("settingsCompletion.addSellOfferSubTxt"),
    //   linkTxt: t("settingsCompletion.addSellOfferLinkTxt"),
    //   path: "app/sales-sell-offer/form",
    //   icon: <AddSellOffers />,
    //   type: ["both"],
    //   show: true,
    // },
    // {
    //   title: t("settingsCompletion.manageRFQ"),
    //   subTxt: t("settingsCompletion.manageRFQSubTxt"),
    //   linkTxt: t("settingsCompletion.manageRFQLinkTxt"),
    //   path: "app/sourcing-rfq",
    //   icon: <ManageRFQ />,
    //   type: ["both"],
    //   show: true,
    // },
  ];

  const checkKyc = dashboardDetails?.data?.IdentityVerifyStatus == "Completed";
  const checkKyb = dashboardDetails?.data?.BusinessVerifyStatus == "Completed";
  const checkUserIsBoth = dashboardDetails?.data?.userType === "both";
  const checkUserIsSeller = dashboardDetails?.data?.userType === "seller";
  const checkUserIsBuyer = dashboardDetails?.data?.userType === "buyer";
  let checkTitle = "",
    checkLinkTxt = "";

  const apiUserType = dashboardDetails?.data?.userType as
    | "seller"
    | "buyer"
    | "both";

  if (!checkKyc && !checkKyb &&
    (checkUserIsBoth || checkUserIsSeller)) {
    checkTitle = t("settingsCompletion.completeYourKYCAndKYB");
    checkLinkTxt = t("settingsCompletion.completeYourKYCAndKYBLinkTxt");
  } else if (!checkKyc && checkUserIsBuyer) {
    checkTitle = t("settingsCompletion.completeYourKYC");
    checkLinkTxt = t("settingsCompletion.completeYourKYCLinkTxt");
  } else if (!checkKyb && (checkUserIsBoth || checkUserIsSeller)) {
    checkTitle = t("settingsCompletion.completeYourKYB");
    checkLinkTxt = t("settingsCompletion.completeYourKYBLinkTxt");
  }
  else if (!checkKyc && (checkUserIsBoth || checkUserIsSeller)) {
    checkTitle = t("settingsCompletion.completeYourKYC");
    checkLinkTxt = t("settingsCompletion.completeYourKYCLinkTxt");
  }

  useEffect(() => {
    refetch();
  }, []);

  return (
    <>
      <div className="dashboard-main-block">
        <AccountSetupCard userType={dashboardDetails?.data?.userType} />
        <div className="dashboard-section-block">
          <Typography variant="h2" className="d-s-b-title">
            {t("settingsCompletion.helpNeed")}
          </Typography>
          <div className="card-group-block-grid">
            {/* Static Cards */}
            {exploreCards
              ?.filter((data) => data?.show && data.type.includes(apiUserType))
              ?.map(
                (data, index: number) =>
                  data?.show && (
                    <ExploreCard
                      key={index}
                      title={data?.title}
                      subTxt={data?.subTxt}
                      linkTxt={data?.linkTxt}
                      path={data?.path}
                      icon={data?.icon}
                    />
                  )
              )}
            {/* Manage RFQ for Both type */}
            {((checkUserIsBoth && checkKyc && checkKyb) || (checkUserIsBuyer && checkKyc)) && (
              <ExploreCard
                title={t("settingsCompletion.manageRFQ")}
                subTxt={`${(checkUserIsBoth && checkKyc && checkKyb) ? `${t("settingsCompletion.manageRFQSubTxtPartOne")} KYC and KYB ${t("settingsCompletion.manageRFQSubTxtPartTwo")}` :
                  `${t("settingsCompletion.manageRFQSubTxtPartOne")} KYC ${t("settingsCompletion.manageRFQSubTxtPartTwo")}`}`}
                linkTxt={t("settingsCompletion.manageRFQLinkTxt")}
                path={"app/sourcing-rfq"}
                icon={<ManageRFQ />}
              />
            )}
            {/* Sell Offer */}
            {(checkKyc && checkKyb) &&
              (checkUserIsBoth || checkUserIsSeller) && (
                <ExploreCard
                  title={t("settingsCompletion.addSellOffer")}
                  subTxt={t("settingsCompletion.addSellOfferSubTxt")}
                  linkTxt={t("settingsCompletion.addSellOfferLinkTxt")}
                  path={"app/sales-sell-offer/form"}
                  icon={<AddSellOffers />}
                />
              )}
            {/* KYC and KYB for Seller and Both type */}
            {(!checkKyc || !checkKyb) && (checkUserIsBoth || checkUserIsSeller) && (
              <ExploreCard
                title={checkTitle}
                subTxt={
                  `${t("settingsCompletion.manageRFQSubTxtPartOne")} ${(!checkKyc && !checkKyb) ? 'KYC and KYB' :
                    !checkKyc ? 'KYC' : 'KYB'
                  } ${t("settingsCompletion.manageRFQSubTxtPartTwo")}`}
                linkTxt={checkLinkTxt}
                path={
                  dashboardDetails?.data?.IdentityVerifyStatus !==
                    "Completed" ||
                    dashboardDetails?.data?.BusinessVerifyStatus !== "Completed"
                    ? "/app/settings/account-settings?type=compliance-settings"
                    : ""
                }
                icon={<ProfileTickIcon />}
              />
            )}
            {/* KYC and KYB for Buyer type */}
            {!checkKyc && checkUserIsBuyer && (
              <ExploreCard
                title={checkTitle}
                subTxt={`${t("settingsCompletion.manageRFQSubTxtPartOne")} KYB ${t("settingsCompletion.manageRFQSubTxtPartTwo")}`}
                linkTxt={checkLinkTxt}
                path={
                  dashboardDetails?.data?.IdentityVerifyStatus !==
                    "Completed" ||
                    dashboardDetails?.data?.BusinessVerifyStatus !== "Completed"
                    ? "/app/settings/account-settings?type=compliance-settings"
                    : ""
                }
                icon={<ProfileTickIcon />}
              />
            )}
            {/* Catalog Cards */}
            {(!checkKyc || !checkKyb) &&
              (checkUserIsSeller || checkUserIsBoth) && (
                <>
                  <ExploreCard
                    title={t("settingsCompletion.publishYourCatalog")}
                    subTxt={t("settingsCompletion.addSellOfferSubTxt")}
                    linkTxt={t("settingsCompletion.publishYourCatalogLinkTxt")}
                    path={
                      dashboardDetails?.data?.isCatalogPublished === undefined
                        ? "app/catalog"
                        : dashboardDetails?.data?.isCatalogPublished == false
                          ? "app/catalog"
                          : ""
                    }
                    icon={<PublishYourCatalog />}
                  />
                </>
              )}
            {(checkUserIsSeller || checkUserIsBoth) &&
              (checkKyc && checkKyb) && (
                <>
                  <ExploreCard
                    title={t("settingsCompletion.manageCatalog")}
                    subTxt={t("settingsCompletion.addSellOfferSubTxt")}
                    linkTxt={t("settingsCompletion.manageCatalogLinkTxt")}
                    path={"app/catalog"}
                    icon={<PublishYourCatalog />}
                  />
                </>
              )}
          </div>
        </div>
      </div>
    </>
  );
};

export default DashboardBlock;