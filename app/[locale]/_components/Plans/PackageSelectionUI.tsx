import React, { useState } from "react";
import Typography from "@/app/[locale]/_components/Base/Typography";
import { useTranslations } from "next-intl";
import { PackageCard } from "@/app/[locale]/_components/Plans/PackageCard";

export const PackageSelectionUI = () => {
  const [billingCycle, setBillingCycle] = useState("monthly");
  const t = useTranslations("freeCatalog");
  const [selectedPackage, setSelectedPackage] = useState("free");
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
  return (
    <>
      <div className="csd-package-selection">
        <div className="csd-header">
          <Typography variant="h4" className="csd-header-title">
            {t("subdomain.comparePlans")}
          </Typography>
          {/* <CloseIcon onClick={() => console.log("Tejhd")} /> */}
        </div>

        <div className="csd-body" style={{ padding: "20px" }}>
          {/* Billing Toggle */}
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              marginBottom: "24px",
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

          <div style={{ textAlign: "center", marginBottom: "8px" }}>
            <span
              style={{ color: "#6b7280", fontSize: "14px", marginRight: "8px" }}
            >
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
            <span
              style={{ color: "#6b7280", fontSize: "14px", marginLeft: "8px" }}
            >
              {t("subdomain.sslYearly")}
            </span>
          </div>

          <p
            style={{
              textAlign: "center",
              fontSize: "14px",
              color: "#6b7280",
              marginBottom: "32px",
            }}
          >
            {t("subdomain.comparePlans")}
          </p>

          {/* Package Cards - First Row */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(2, 1fr)",
              gap: "24px",
              marginBottom: "24px",
            }}
          >
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
          </div>

          {/* Package Cards - Second Row */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(2, 1fr)",
              gap: "24px",
              marginBottom: "24px",
            }}
          >
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
          </div>

          {/* Bottom Row - Enterprise Package */}
          <div
            style={{
              display: "flex",
              justifyContent: "center",
            }}
          >
            <div style={{ width: "calc(50% - 12px)" }}>
              <PackageCard
                packageKey="enterprise"
                packageData={packages.enterprise}
                isSelected={selectedPackage === "enterprise"}
                onSelect={setSelectedPackage}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
