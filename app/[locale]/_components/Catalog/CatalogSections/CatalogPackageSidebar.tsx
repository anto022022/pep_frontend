"use client";

import { Sidebar } from "primereact/sidebar";
import { useState } from "react";
import Typography from "@/app/[locale]/_components/Base/Typography";
// Removed unused imports
import "@/assets/css/catalogsubdomain.css";
import { useParams, useRouter } from "next/navigation";
// Removed store selector imports
import {
  CloseIcon,
  RightArrowIcon,
} from "@/app/[locale]/_components/Icons/SVGIcons";
import Buttons from "@/app/[locale]/_components/Buttons/Buttons";
import { useTranslations } from "next-intl";

// Props for sidebar
type CatalogPackageSidebarProps = {
  visible: boolean;
  onHide: () => void;
  onSuccess?: () => void; // Add optional success callback
  disableRouting?: boolean; // When true, clicking a package will not navigate
};

const CatalogPackageSidebar = ({
  visible,
  onHide,
  disableRouting = false,
}: CatalogPackageSidebarProps) => {
  const router = useRouter();
  const t = useTranslations("freeCatalog");
  const c = useTranslations("freeCatalog.catalog");
  // Removed unused subdomain state
  // Removed unused state: showPackageSelection, showSubdomainSetup
  const [selectedPackage, setSelectedPackage] = useState("free");
  const [billingCycle, setBillingCycle] = useState("monthly");
  const { locale } = useParams();

  // Removed subdomain prefill logic
  const handleClose = () => {
    onHide();
  };
  const packages = {
    free: {
      name: t("subdomain.packages.free.name"),
      price: t("subdomain.packages.free.price"),
      description: t("subdomain.packages.free.description"),
      features: [
        t("subdomain.packages.free.features.0"),
        t("subdomain.packages.free.features.1"),
        t("subdomain.packages.free.features.2"),
        t("subdomain.packages.free.features.3"),
      ],
    },
    grow: {
      name: t("subdomain.packages.grow.name"),
      price: billingCycle === "monthly" ? 19 : 15,
      description: t("subdomain.packages.grow.description"),
      features: [
        t("subdomain.packages.grow.features.0"),
        t("subdomain.packages.grow.features.1"),
        t("subdomain.packages.grow.features.2"),
        t("subdomain.packages.grow.features.3"),
        t("subdomain.packages.grow.features.4"),
        t("subdomain.packages.grow.features.5"),
        t("subdomain.packages.grow.features.6"),
      ],
    },
    scale: {
      name: t("subdomain.packages.scale.name"),
      price: billingCycle === "monthly" ? 49 : 39,
      description: t("subdomain.packages.scale.description"),
      features: [
        t("subdomain.packages.scale.features.0"),
        t("subdomain.packages.scale.features.1"),
        t("subdomain.packages.scale.features.2"),
        t("subdomain.packages.scale.features.3"),
        t("subdomain.packages.scale.features.4"),
        t("subdomain.packages.scale.features.5"),
      ],
      popular: true,
    },
    global: {
      name: t("subdomain.packages.global.name"),
      price: billingCycle === "monthly" ? 99 : 79,
      description: t("subdomain.packages.global.description"),
      features: [
        t("subdomain.packages.global.features.0"),
        t("subdomain.packages.global.features.1"),
        t("subdomain.packages.global.features.2"),
        t("subdomain.packages.global.features.3"),
        t("subdomain.packages.global.features.4"),
        t("subdomain.packages.global.features.5"),
        t("subdomain.packages.global.features.6"),
      ],
    },
    enterprise: {
      name: t("subdomain.packages.enterprise.name"),
      price: billingCycle === "monthly" ? 199 : 159,
      description: t("subdomain.packages.enterprise.description"),
      features: [
        t("subdomain.packages.enterprise.features.0"),
        t("subdomain.packages.enterprise.features.1"),
        t("subdomain.packages.enterprise.features.2"),
        t("subdomain.packages.enterprise.features.3"),
        t("subdomain.packages.enterprise.features.4"),
        t("subdomain.packages.enterprise.features.5"),
        t("subdomain.packages.enterprise.features.6"),
        t("subdomain.packages.enterprise.features.7"),
      ],
    },
  };

  // Removed unused handler: handleContinue

  const handlePackageSelection = (packageName: string) => {
    setSelectedPackage(packageName);
    // If routing is disabled (e.g., opened from "See Plans"), just close the sidebar
    if (disableRouting) {
      return; // keep sidebar open and do not route
    }
    onHide();
    return router.push(`/${locale}/app/catalog/form`);
  };

  // Removed unused handler: handleStartWithSubdomain

  const PackageCard = ({ packageKey, packageData, isSelected, onSelect }) => {
    const isPopular = packageData.popular;
    const isAdvanced = packageKey === "global";

    return (
      <>
        <div
          className={`package-plan-card ${isSelected ? "active" : ""}`}
          onClick={() => onSelect(packageKey)}
        >
          <div className="p-p-c-header">
            <span className="p-p-c-h-txt">
              {c("packageSidebar.savePercentYearly", { percent: 20 })}
            </span>
          </div>
          <div className="p-p-c-body">
            <div className="p-p-c-b-top">
              {isPopular && (
                <span className="offer-badge">
                  {t("subdomain.badges.mostPopular")}
                </span>
              )}
              <div className="plans-content-wrapper">
                <span className="p-c-w-title">{packageData.name}</span>
                <div className="price-domain-txt">
                  <span className="p-t-txt">
                    {packageKey === "enterprise" && (
                      <span className="starts-txt">
                        {t("subdomain.enterprise.strikePrice", { price: 199 })}
                      </span>
                    )}
                    <span>
                      {" "}
                      {typeof packageData.price === "number"
                        ? `$${packageData.price}`
                        : packageData.price}
                    </span>
                  </span>
                  <span className="p-d-txt">
                    {c("packageSidebar.monthlySuffix")}
                  </span>
                </div>
              </div>
              <div className="package-features-block">
                <span className="p-f-b-title">{packageData.description}</span>
                <ul className="p-f-b-ul">
                  {packageData.features.map((feature, index) => (
                    <li key={index}>{feature}</li>
                  ))}
                </ul>
              </div>
            </div>
            <div className="p-p-c-b-bottom">
              <Buttons
                text={c("packageSidebar.knowMore")}
                className={"btn-plain-txt"}
              ></Buttons>
              <Buttons
                onClick={(e) => {
                  e.stopPropagation();
                  handlePackageSelection(packageKey);
                }}
                className={` ${
                  isSelected ? "btn-c-primary" : "btn-outline bg-outline-dark"
                }  package-action-btn`}
                text={
                  packageKey === "free"
                    ? t("subdomain.actions.chooseFree")
                    : packageKey === "global" || packageKey === "enterprise"
                    ? t("subdomain.actions.contactSales")
                    : t("subdomain.actions.choosePackageCta", {
                        name: packageData.name,
                      })
                }
              />
            </div>
          </div>
        </div>
      </>
    );
  };

  const PackageSelectionUI = () => (
    <>
      <div className="o-s-c-top">
        <div className="o-s-c-header">
          <Typography variant="h4" className="o-s-c-h-title">
            {c("packageSidebar.title")}
          </Typography>
          <CloseIcon onClick={handleClose} />
        </div>
        <div className="o-s-c-body">
          {/* Billing Toggle */}
          <div className="toggle-group-block">
            <div
              style={{
                display: "flex",
                justifyContent: "center",
              }}
            >
              <div
                style={{
                  backgroundColor: "#f3f4f6",
                  borderRadius: "8px",
                  padding: "4px",
                  display: "flex",
                }}
              >
                <button
                  onClick={() => setBillingCycle("yearly")}
                  style={{
                    padding: "8px 16px",
                    borderRadius: "6px",
                    fontSize: "14px",
                    fontWeight: "500",
                    border: "none",
                    cursor: "pointer",
                    backgroundColor:
                      billingCycle === "yearly" ? "white" : "transparent",
                    color: billingCycle === "yearly" ? "#111827" : "#6b7280",
                    boxShadow:
                      billingCycle === "yearly"
                        ? "0 1px 2px 0 rgba(0, 0, 0, 0.05)"
                        : "none",
                  }}
                >
                  {t("subdomain.billing.yearly")}
                </button>
                <button
                  onClick={() => setBillingCycle("monthly")}
                  style={{
                    padding: "8px 16px",
                    borderRadius: "6px",
                    fontSize: "14px",
                    fontWeight: "500",
                    border: "none",
                    cursor: "pointer",
                    backgroundColor:
                      billingCycle === "monthly" ? "white" : "transparent",
                    color: billingCycle === "monthly" ? "#111827" : "#6b7280",
                    boxShadow:
                      billingCycle === "monthly"
                        ? "0 1px 2px 0 rgba(0, 0, 0, 0.05)"
                        : "none",
                  }}
                >
                  {t("subdomain.billing.monthly")}
                </button>
              </div>
            </div>
            <div className="toggle-wrapper-btwn">
              <div
                style={{
                  textAlign: "center",
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                }}
              >
                <span style={{ color: "#6b7280", fontSize: "14px" }}>
                  {t("subdomain.sslMonthly")}
                </span>
                <label
                  style={{
                    position: "relative",
                    display: "inline-flex",
                    alignItems: "center",
                    cursor: "pointer",
                  }}
                >
                  <input type="checkbox" style={{ display: "none" }} />
                  <div
                    style={{
                      width: "44px",
                      height: "24px",
                      backgroundColor: "#d1d5db",
                      borderRadius: "12px",
                      position: "relative",
                      transition: "all 0.3s",
                    }}
                  >
                    <div
                      style={{
                        position: "absolute",
                        top: "2px",
                        left: "2px",
                        width: "20px",
                        height: "20px",
                        backgroundColor: "white",
                        borderRadius: "50%",
                        transition: "all 0.3s",
                      }}
                    ></div>
                  </div>
                </label>
                <span style={{ color: "#6b7280", fontSize: "14px" }}>
                  {t("subdomain.sslYearly")}
                </span>
              </div>

              <p
                style={{
                  textAlign: "center",
                  fontSize: "14px",
                  textDecoration: "underline",
                  fontWeight: "500",
                  color: "#171A1C",
                }}
              >
                {t("subdomain.comparePlans")}
              </p>
            </div>
          </div>
          <div className="plans-card-group">
            <PackageCard
              packageKey="free"
              packageData={packages.free}
              isSelected={selectedPackage === "free"}
              onSelect={setSelectedPackage}
            />
            <PackageCard
              packageKey="grow"
              packageData={packages.grow}
              isSelected={selectedPackage === "grow"}
              onSelect={setSelectedPackage}
            />
            <PackageCard
              packageKey="scale"
              packageData={packages.scale}
              isSelected={selectedPackage === "scale"}
              onSelect={setSelectedPackage}
            />
            <PackageCard
              packageKey="global"
              packageData={packages.global}
              isSelected={selectedPackage === "global"}
              onSelect={setSelectedPackage}
            />
            <PackageCard
              packageKey="enterprise"
              packageData={packages.enterprise}
              isSelected={selectedPackage === "enterprise"}
              onSelect={setSelectedPackage}
            />
          </div>
        </div>
      </div>
    </>
  );

  return (
    <Sidebar
      visible={visible}
      position="right"
      onHide={onHide}
      appendTo={null}
      className="offcanvas-sidebar-comp choose-package-sidebar"
      content={() => (
        <>
          <PackageSelectionUI />
        </>
      )}
    ></Sidebar>
  );
};

export default CatalogPackageSidebar;
