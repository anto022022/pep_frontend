"use client";

import Typography from "@/app/[locale]/_components/Base/Typography";
import { Sidebar } from "primereact/sidebar";
import { useEffect, useState } from "react";
// import InputField from "@/app/[locale]/_components/StoreFront/Forms/InputField";
import ButtonIconRight from "@/app/[locale]/_components/Buttons/ButtonIconRight";
import {
  CloseIcon,
  RightArrowIcon,
} from "@/app/[locale]/_components/Icons/SVGIcons";
import {
  useGetSubdomainQuery,
  useUpdateCatalogDomainMutation,
} from "@/app/[locale]/_store/apiReducer/catalogApi";
import "@/assets/css/catalogsubdomain.css";
// import { useRouter } from "next/navigation";
import { setDomain } from "@/app/[locale]/_store/reducers/location_store";
import { showToast } from "@/app/[locale]/_store/reducers/ui_store";
import { RootState, useAppSelector } from "@/app/[locale]/_store/store";
import { useTranslations } from "next-intl";
import { useDispatch } from "react-redux";
import { PackageSelectionUI } from "@/app/[locale]/_components/Plans/PackageSelectionUI";

type CatalogSubDomainProps = {
  visible: boolean;
  onHide: () => void;
  onSuccess?: () => void; // Add success callback prop
  showPackageSelection: boolean; // NEW
  setShowPackageSelection: (value: boolean) => void; // NEW
};

const CatalogSubDomain = ({
  visible,
  onHide,
  onSuccess,
  showPackageSelection,
  setShowPackageSelection,
}: CatalogSubDomainProps) => {
  // const router = useRouter();
  const t = useTranslations("freeCatalog");
  const dispatch = useDispatch();
  const [updateCatalogDomain] = useUpdateCatalogDomainMutation();
  const [selectedPackage, setSelectedPackage] = useState("free");
  const [billingCycle, setBillingCycle] = useState("monthly");
  const subDomainName = useAppSelector(
    (state: RootState) => state.location.domain
  );

  // Fetch current subdomain from API
  const {
    data: subdomainData,
    isLoading: isSubdomainLoading,
    error: subdomainError,
    refetch: refetchSubdomain,
  } = useGetSubdomainQuery(undefined, { refetchOnMountOrArgChange: true });

  const [subdomain, setSubdomain] = useState(() => {
    // Initialize with Redux state first, then update with API data when available
    return subDomainName || "";
  });
  const [hasUserInteracted, setHasUserInteracted] = useState(false);

  // Reset user interaction state when component opens
  useEffect(() => {
    if (visible) {
      setHasUserInteracted(false);
    }
  }, [visible]);

  // Update subdomain state when API data is available (only if user hasn't interacted)
  useEffect(() => {
    if (subdomainData?.data?.subDomain && !hasUserInteracted) {
      setSubdomain(subdomainData.data.subDomain);
    }
  }, [subdomainData, hasUserInteracted]);

  // Handle API error
  useEffect(() => {
    if (subdomainError) {
      console.error("Failed to fetch subdomain:", subdomainError);
      dispatch(
        showToast({
          title: t("subdomain.toasts.errorTitle"),
          message: t("subdomain.toasts.fetchFailed"),
          theme: "danger",
        })
      );
    }
  }, [subdomainError, dispatch, t]);

  // Handle close button click - reset to subdomain UI
  const handleClose = () => {
    setShowPackageSelection(false);
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

  const handleContinue = async () => {
    // Client-side validation
    if (!subdomain.trim()) {
      dispatch(
        showToast({
          title: t("subdomain.toasts.validationErrorTitle"),
          message: t("subdomain.toasts.validationErrorMessage"),
          theme: "danger",
        })
      );
      return;
    }

    try {
      const res = await updateCatalogDomain({
        subDomain: subdomain.trim(),
      }).unwrap();

      // API-level error
      if (res?.statusCode === 409 || res?.error === 409001) {
        dispatch(
          showToast({
            title: t("subdomain.toasts.warningTitle"),
            message: t("subdomain.toasts.subdomainExists"),
            theme: "danger",
          })
        );
        return;
      }
      // Call the success callback instead of showing modal here
      if (onSuccess) {
        onSuccess();
      }
      dispatch(setDomain(subdomain.trim()));

      // Refetch subdomain data to get the latest from server
      refetchSubdomain();

      // dispatch(
      //   showToast({
      //     title: t("subdomain.toasts.successTitle"),
      //     message: t("subdomain.toasts.updated"),
      //     theme: "success",
      //   })
      // );
    } catch (error: any) {
      console.error("Failed to update catalog subdomain:", error);
      dispatch(
        showToast({
          title: t("subdomain.toasts.errorTitle"),
          message: t("subdomain.toasts.updateFailed"),
          theme: "danger",
        })
      );
    }
  };

  // const handlePackageSelection = (packageName: string) => {
  //   setSelectedPackage(packageName);
  //   onHide();
  //   if (onSuccess) {
  //     onSuccess();
  //   }
  //   //router.push("./");
  // };

  // Package Card Component for reusability

  return (
    <Sidebar
      visible={visible}
      position="right"
      onHide={handleClose}
      appendTo={null}
      className="offcanvas-sidebar-comp url-setup-sidebar"
      content={() => (
        <>
          {!showPackageSelection ? (
            <>
              <div className="o-s-c-top">
                <div className="o-s-c-header">
                  <Typography variant="h4" className="o-s-c-h-title">
                    {t("subdomain.title")}
                  </Typography>
                  <CloseIcon onClick={handleClose} />
                </div>
                <div className="o-s-c-body">
                  <div className="url-setup-wrapper">
                    <div className="u-s-w-content-wrapper">
                      <span className="u-s-w-c-w-title">
                        {t("subdomain.readyTitle")}
                      </span>
                      <span className="u-s-w-c-w-subtxt">
                        {t("subdomain.readySubtitle")}
                      </span>
                    </div>
                    <div className="url-setup-box">
                      <div className="u-s-b-content-wrapper">
                        <span className="u-s-b-c-w-title">
                          {t("subdomain.goPublicTitle")}
                        </span>
                        <span className="u-s-b-c-w-subtxt">
                          {t("subdomain.goPublicSubtitle")}
                        </span>
                      </div>
                      <div className="url-setup-input-block">
                        <span className="u-s-i-b-txt">
                          {" "}
                          {process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "")}
                          /
                        </span>
                        <input
                          type="text"
                          className="u-s-i-b-input"
                          value={subdomain}
                          autoFocus
                          disabled={isSubdomainLoading}
                          placeholder={
                            isSubdomainLoading ? t("subdomain.loading") : ""
                          }
                          onChange={(e) => {
                            setSubdomain(e.target.value);
                            setHasUserInteracted(true);
                          }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="o-s-c-footer">
                <div className="o-s-c-f-left"></div>
                <div className="o-s-c-f-right">
                  <div className="o-s-c-btn-group">
                    <ButtonIconRight
                      name={t("continue")}
                      disabled={!subdomain.trim() || isSubdomainLoading}
                      onClick={handleContinue}
                    >
                      <RightArrowIcon />
                    </ButtonIconRight>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <PackageSelectionUI />
          )}
        </>
      )}
    ></Sidebar>
  );
};

export default CatalogSubDomain;
