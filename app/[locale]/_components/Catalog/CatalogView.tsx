"use client";
import StepCard from "@/app/[locale]/_components/Cards/StepCard";
import CatalogBodySection from "@/app/[locale]/_components/Catalog/CatalogSections/CatalogBodySection";
import CatalogHeaderSection from "@/app/[locale]/_components/Catalog/CatalogSections/CatalogHeaderSections";
import CatalogPackageSidebar from "@/app/[locale]/_components/Catalog/CatalogSections/CatalogPackageSidebar";
import NoDataScreen from "@/app/[locale]/_components/Common/dataTable/NoDataScreen";
import { useGetCatalogStageStatusQuery } from "@/app/[locale]/_store/apiReducer/catalogApi";
import incomplete from "@/assets/img/incomplete.png";
import rightverf from "@/assets/img/Obj.png";
import tick from "@/assets/img/tick.png";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
// Removed unused store imports
import SuccessDialog from "@/app/[locale]/_components/dialog/SuccessDialog";
import {
  AddContentIcon,
  CatalogFrameIcon,
  ChoosePackageIcon,
  LaunchIcon,
} from "@/app/[locale]/_components/Icons/SVGIcons";

const CatalogView = () => {
  const [sidebarVisible, setSidebarVisible] = useState(false);
  const [sidebarDisableRouting, setSidebarDisableRouting] = useState(false);
  // Removed unused state: showPackageSelection, sidebarStep
  const [showCompletedModal, setShowCompletedModal] = useState(false);
  const router = useRouter();
  const t = useTranslations("freeCatalog.catalog");

  // Removed unused state: isCatalogAvailable

  // Get subdomain from Redux store
  // Removed unused selector: subDomainName

  const { data: stageData, isLoading: isStageLoading } =
    useGetCatalogStageStatusQuery(undefined, {
      refetchOnMountOrArgChange: true,
    });

  useEffect(() => {
    const shouldShow = sessionStorage.getItem("showCompletedModal") === "true";
    if (shouldShow) {
      setShowCompletedModal(true);
      sessionStorage.removeItem("showCompletedModal");
    }
  }, []);
  const openSidebar = () => {
    setSidebarDisableRouting(true);
    setSidebarVisible(true);
  };
  // Removed unused effect for isCatalogAvailable

  // Removed unused locale from params

  const handleAddCatalog = () => {
    setSidebarDisableRouting(false);
    setSidebarVisible(true);
  };

  if (isStageLoading) {
    return <div>Loading...</div>; // or your skeleton loader
  }
  return (
    <>
      {stageData?.data?.isCatalogComplete ? (
        <>
          <CatalogHeaderSection />
          <CatalogBodySection onOpenSidebar={openSidebar} />
        </>
      ) : stageData?.data?.isAllCompleted ? (
        <div className="body-preview">
          <NoDataScreen
            image={rightverf}
            title={t("view.getLiveTitle")}
            subTitle={""}
            buttonTitle={t("view.setupWebsite")}
            onClickAdd={handleAddCatalog}
          // useCatalogViewStyles={true}
          >
            <div className="catalog-stepper">
              <div className="c-s-item">
                <div className="c-s-icon-wrapper">
                  <div className="c-s-frame-img">
                    <CatalogFrameIcon />
                  </div>
                  <div className="c-s-i-icon">
                    <ChoosePackageIcon />
                  </div>
                </div>
                <div className="c-s-i-content-wrapper">
                  <span className="c-s-i-c-w-title">
                    {t("steps.choosePackage.title")}
                  </span>
                  <span className="c-s-i-c-w-subtxt">
                    {t("steps.choosePackage.sub")}
                  </span>
                </div>
              </div>
              <div className="c-s-item">
                <div className="c-s-icon-wrapper">
                  <div className="c-s-frame-img">
                    <CatalogFrameIcon />
                  </div>
                  <div className="c-s-i-icon">
                    <AddContentIcon />
                  </div>
                </div>
                <div className="c-s-i-content-wrapper">
                  <span className="c-s-i-c-w-title">
                    {t("steps.addContent.title")}
                  </span>
                  <span className="c-s-i-c-w-subtxt">
                    {t("steps.addContent.sub")}
                  </span>
                </div>
              </div>
              <div className="c-s-item">
                <div className="c-s-icon-wrapper">
                  <div className="c-s-frame-img">
                    <CatalogFrameIcon />
                  </div>
                  <div className="c-s-i-icon">
                    <LaunchIcon />
                  </div>
                </div>
                <div className="c-s-i-content-wrapper">
                  <span className="c-s-i-c-w-title">
                    {t("steps.launch.title")}
                  </span>
                  <span className="c-s-i-c-w-subtxt">
                    {t("steps.launch.sub")}
                  </span>
                </div>
              </div>
            </div>
          </NoDataScreen>
        </div>
      ) : (
        <div className="body-preview launch-bussiness-main">
          <NoDataScreen
            image={rightverf}
            title={t("view.launchMainTitle")}
            subTitle={t("view.launchMainSub")}
            buttonTitle={t("view.setupWebsite")}
            disableButton={
              !stageData?.data.isBusinessProfileComplete ||
              !stageData?.data.isKYCCompleted ||
              !stageData?.data.isKYBCompleted ||
              !stageData?.data.isProductAdded
            }
          // stageData={stageData?.data || {}}
          // useCatalogViewStyles={true}
          >
            <StepCard
              icon={
                stageData?.data.isBusinessProfileComplete ? tick : incomplete
              }
              clickable={!stageData?.data.isBusinessProfileComplete}
              title={t("stepCards.completeProfile.title")}
              description={t("stepCards.completeProfile.description")}
              linkText={""}
              cardClick={() => {
                if (!stageData?.data.isBusinessProfileComplete) {
                  router.push("/app/business-profile");
                }
              }}
            />
            <StepCard
              icon={
                stageData?.data.isKYCCompleted && stageData?.data.isKYBCompleted
                  ? tick
                  : incomplete
              }
              clickable={
                !stageData?.data.isKYCCompleted ||
                !stageData?.data.isKYBCompleted
              }
              title={t("stepCards.verifyBusiness.title")}
              description={t("stepCards.verifyBusiness.description")}
              linkText={""}
              cardClick={() => {
                if (
                  !stageData?.data.isKYBCompleted ||
                  !stageData?.data.isKYCCompleted
                ) {
                  router.push("/app/settings/account-settings?type=compliance-settings");
                }
              }}
            />
            <StepCard
              icon={stageData?.data.isProductAdded ? tick : incomplete}
              clickable={!stageData?.data.isProductAdded}
              title={t("stepCards.addFirstProduct.title")}
              description={t("stepCards.addFirstProduct.description")}
              linkText={t("stepCards.addFirstProduct.linkText")}
              cardClick={() => {
                if (!stageData?.data.isProductAdded) {
                  router.push("/app/sales-product/form");
                }
              }}
              onLinkClick={() => {
                if (!stageData?.data.isProductAdded) {
                  router.push("/app/sales-product/form");
                }
              }}
            />
          </NoDataScreen>
        </div>
      )}
      <CatalogPackageSidebar
        visible={sidebarVisible}
        onHide={() => setSidebarVisible(false)}
        disableRouting={sidebarDisableRouting}
        onSuccess={() => {
          setSidebarVisible(false);
        }}
      />
      <SuccessDialog
        visible={showCompletedModal}
        title={t("successDialog.title")}
        subTxt={t("successDialog.subTxt")}
        onClose={() => setShowCompletedModal(false)}
      >
        <button
          className="complete-btn"
          onClick={() => setShowCompletedModal(false)}
        >
          {t("successDialog.ok")}
        </button>
      </SuccessDialog>
    </>
  );
};

export default CatalogView;
