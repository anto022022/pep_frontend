import { useTranslations } from "next-intl";
import React from "react";

export const PackageCard = ({
  packageKey,
  packageData,
  isSelected,
  onSelect,
}) => {
  const isPopular = packageData.popular;
  const isAdvanced = packageKey === "global";
  const t = useTranslations("freeCatalog");
  const handlePackageSelection = (packageName: string) => {
    // setSelectedPackage(packageName);
    // onHide();
    // if (onSuccess) {
    //   onSuccess();
    // }
    //router.push("./");
  };
  return (
    <div
      onClick={() => onSelect(packageKey)}
      style={{
        backgroundColor: "white",
        borderRadius: "8px",
        border: `2px solid ${isSelected ? "#ef4444" : "#e5e7eb"}`,
        padding: "24px",
        position: "relative",
        boxShadow: "0 1px 3px 0 rgba(0, 0, 0, 0.1)",
        cursor: "pointer",
        transition: "all 0.3s ease",
      }}
    >
      {/* Popular Badge */}
      {isPopular && (
        <div
          style={{
            position: "absolute",
            top: "-12px",
            left: "50%",
            transform: "translateX(-50%)",
            backgroundColor: "#ef4444",
            color: "white",
            padding: "4px 16px",
            borderRadius: "16px",
            fontSize: "14px",
            fontWeight: "500",
          }}
        >
          {t("subdomain.badges.mostPopular")}
        </div>
      )}

      {/* Package Header */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: "8px",
        }}
      >
        <h3
          style={{
            fontSize: "20px",
            fontWeight: "bold",
            color: "#1f2937",
          }}
        >
          {packageData.name}
        </h3>
        {isAdvanced && (
          <span
            style={{
              backgroundColor: "black",
              color: "white",
              padding: "4px 8px",
              borderRadius: "4px",
              fontSize: "12px",
            }}
          >
            {t("subdomain.badges.mostAdvanced")}
          </span>
        )}
      </div>

      {/* Price */}
      <div style={{ marginBottom: "4px" }}>
        {packageKey === "enterprise" && (
          <span
            style={{
              fontSize: "14px",
              color: "#6b7280",
              textDecoration: "line-through",
              marginRight: "8px",
            }}
          >
            {t("subdomain.enterprise.strikePrice", { price: 199 })}
          </span>
        )}
        <span
          style={{
            fontSize: "30px",
            fontWeight: "bold",
            color: "#111827",
          }}
        >
          {typeof packageData.price === "number"
            ? `$${packageData.price}`
            : packageData.price}
        </span>
      </div>

      {/* Description */}
      <p
        style={{
          fontSize: "14px",
          color: "#6b7280",
          marginBottom: "16px",
        }}
      >
        {packageData.description}
      </p>

      {/* Features */}
      <div style={{ marginBottom: "24px" }}>
        {packageData.features.map((feature, index) => (
          <div
            key={index}
            style={{
              display: "flex",
              alignItems: "flex-start",
              marginBottom: "8px",
            }}
          >
            <span
              style={{
                color: "#10b981",
                marginTop: "2px",
                marginRight: "8px",
                flexShrink: 0,
                fontSize: "16px",
                fontWeight: "bold",
              }}
            >
              ✓
            </span>
            <span style={{ fontSize: "14px", color: "#6b7280" }}>
              {feature}
            </span>
          </div>
        ))}
      </div>

      {/* Selection Indicator */}
      {isSelected && (
        <div
          style={{
            position: "absolute",
            top: "12px",
            right: "12px",
            width: "24px",
            height: "24px",
            borderRadius: "50%",
            backgroundColor: "#ef4444",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <span
            style={{ color: "white", fontSize: "14px", fontWeight: "bold" }}
          >
            ✓
          </span>
        </div>
      )}

      {/* Action Button */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          handlePackageSelection(packageKey);
        }}
        style={{
          width: "100%",
          padding: "12px 16px",
          backgroundColor: isSelected ? "#ef4444" : "white",
          color: isSelected ? "white" : "#374151",
          border: isSelected ? "none" : "1px solid #d1d5db",
          borderRadius: "8px",
          fontWeight: "500",
          cursor: "pointer",
          transition: "all 0.3s",
          fontSize: "14px",
        }}
      >
        {packageKey === "free"
          ? t("subdomain.actions.chooseFree")
          : packageKey === "global" || packageKey === "enterprise"
          ? t("subdomain.actions.contactSales")
          : t("subdomain.actions.choosePackageCta", {
              name: packageData.name,
            })}
      </button>
    </div>
  );
};
