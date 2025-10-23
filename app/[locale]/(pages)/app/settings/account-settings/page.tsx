"use client";

import EasyGuide from "@/app/[locale]/_components/BusinessProfileComponents/EasyGuide";
import {
  DataAndPrivacy,
  GroupIcon,
  GroupTick,
  ProductInfoIcon,
  ProfileTwoUser,
} from "@/app/[locale]/_components/Icons/SVGIcons";
import MobileNavBar from "@/app/[locale]/_components/Navbar/MobileNavBar";
import BusinessSettings from "@/app/[locale]/_components/SettingsComponents/BusinessSettings";
import ComplianceSettings from "@/app/[locale]/_components/SettingsComponents/ComplianceSettings";
import DataPrivacySettings from "@/app/[locale]/_components/SettingsComponents/DataPrivacySettings";
import MembershipSettings from "@/app/[locale]/_components/SettingsComponents/MembershipSettings";
import TaxSettings from "@/app/[locale]/_components/SettingsComponents/TaxSettings";
import FormTitle from "@/app/[locale]/_components/StoreFront/Forms/FormTitle";
import useIsMobile from "@/app/[locale]/_hooks/useIsMobile";
import { AccountSettingsStageKey } from "@/app/[locale]/_models/StoreFront";
import { setCurrentForm } from "@/app/[locale]/_store/reducers/stepper_status_store";
import { setIsAccountSettingsSidebarOpen } from "@/app/[locale]/_store/reducers/ui_store";
import {
  RootState,
  useAppDispatch,
  useAppSelector,
} from "@/app/[locale]/_store/store";
import { useTranslations } from "next-intl";
import { useSearchParams } from "next/navigation";
import { JSX, useEffect } from "react";

const formIconMap: Record<string, JSX.Element> = {
  BusinessSettings: <GroupIcon />,
  ComplianceSettings: <GroupTick />,
  TaxSettings: <GroupTick />,
  DataPrivacySettings: <DataAndPrivacy />,
  SubscriptionDetails: <ProfileTwoUser />,
};

const page = () => {
  const searchParams = useSearchParams();
  const type = searchParams.get("type");
  const currentForm = useAppSelector(
    (state: RootState) => state.stepperStatus.currentForm
  );
  const dispatch = useAppDispatch();
  const isMobile = useIsMobile(1200);
  const accSetLang = useTranslations("accountSettings");

  useEffect(() => {
    let formKey = "";
    if (type === "compliance-settings") {
      formKey = AccountSettingsStageKey.ComplianceSettings;
    } else if (currentForm && currentForm !== "") {
      formKey = currentForm;
    } else {
      formKey = AccountSettingsStageKey.BusinessSettings;
    }
    dispatch(setCurrentForm(formKey));
  }, [type, dispatch]);


  const titleKeyByForm: Record<AccountSettingsStageKey, string> = {
    [AccountSettingsStageKey.BusinessSettings]:
      "accountSettingsStepper.businessSettings",
    [AccountSettingsStageKey.ComplianceSettings]:
      "accountSettingsStepper.complianceSettings",
    [AccountSettingsStageKey.TaxSettings]: "accountSettingsStepper.taxSettings",
    [AccountSettingsStageKey.DataPrivacySettings]:
      "accountSettingsStepper.dataPrivacySettings",
    [AccountSettingsStageKey.SubscriptionDetails]:
      "accountSettingsStepper.SubscriptionDetails",
    [AccountSettingsStageKey.UserSettings]:
      "accountSettingsStepper.UserSettings",
  };
  const renderTab = () => {
    if (currentForm === AccountSettingsStageKey.BusinessSettings) {
      return <BusinessSettings />;
    } else if (
      currentForm === AccountSettingsStageKey.ComplianceSettings ||
      type === "compliance-settings"
    ) {
      return <ComplianceSettings />;
    } else if (currentForm === AccountSettingsStageKey.TaxSettings) {
      return <TaxSettings />;
    } else if (currentForm === AccountSettingsStageKey.DataPrivacySettings) {
      return <DataPrivacySettings />;
    }
    else if (currentForm === AccountSettingsStageKey.SubscriptionDetails) {
      return <MembershipSettings />;
    }
    // else if (currentForm === AccountSettingsStageKey.UserSettings) {
    //   return "Coming Soon";
    // }
    return <BusinessSettings />;
  };
  const onClick = () => {
    dispatch(setIsAccountSettingsSidebarOpen(true));
  };


  return (
    <>
      {!isMobile ? (
        <>
          <div className="t-c-l-c-head">
            <FormTitle
              variant={"h1"}
              text={accSetLang(
                (titleKeyByForm as Record<string, string>)[currentForm] ||
                "accountSettingsStepper.businessSettings"
              )}
            >
              {/* {currentForm === "BusinessSettings" && <GroupIcon />}
              {currentForm === "ComplianceSettings" && <GroupTick />}
              {currentForm === "TaxSettings" && <GroupTick />}
              {currentForm === "DataPrivacySettings" && <DataAndPrivacy />}
              {currentForm === "SubscriptionDetails" && <ProfileTwoUser />} */}
              {formIconMap[currentForm] ?? <ProductInfoIcon />}
            </FormTitle>
          </div>
          <div className="t-c-l-c-body">
            <div className="t-c-l-c-left">{renderTab()}</div>
            <div className="t-c-l-c-right align-s-end">
              <EasyGuide />
            </div>
          </div>
        </>
      ) : (
        <>
          <div className="body-preview-mob three-col-form-mob">
            <MobileNavBar
              path=""
              title={accSetLang(
                (titleKeyByForm as Record<string, string>)[currentForm] ||
                "accountSettingsStepper.businessSettings"
              )}
              headIcon={formIconMap[currentForm] ?? <ProductInfoIcon />}
              onClick={onClick}
              isRFQActive={false}
              isLogoShow={false}
              children={false}
            />

            <div className="b-p-m-body">
              <div className="compliance-mob-wrapper">{renderTab()}</div>
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default page;
