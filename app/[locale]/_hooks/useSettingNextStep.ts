import { useRouter } from "next/navigation";
import {
  AccountSettingsStageKey,
  ProfileSettingsStageKey,
} from "@/app/[locale]/_models/StoreFront";
import { useAppDispatch, useAppSelector } from "../_store/store";
import { setCurrentForm } from "@/app/[locale]/_store/reducers/stepper_status_store";

export default function useSettingNextStep() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const userType = useAppSelector((state) => state.userData.userType);
  const nextStep = (currentForm: string, validateObj?: any) => {
    console.log("currentForm: ---->", currentForm);
    console.log("validateObj: ---->", userType, validateObj);
    switch (currentForm) {
      case "Profile":
        dispatch(setCurrentForm(ProfileSettingsStageKey.Profile));
        break;
      case "NotificationPreferences":
        dispatch(
          setCurrentForm(ProfileSettingsStageKey.NotificationPreferences)
        );
        break;
      case "ChatPreferences":
        dispatch(setCurrentForm(ProfileSettingsStageKey.ChatPreferences));
        break;
      case "BusinessSettings":
        router.push("/app/settings/account-settings");
        const navigateTab =
          userType !== "buyer"
            ? AccountSettingsStageKey.BusinessSettings
            : AccountSettingsStageKey.ComplianceSettings;
        dispatch(setCurrentForm(navigateTab));
        break;
      case "ComplianceSettings":
        dispatch(setCurrentForm(AccountSettingsStageKey.ComplianceSettings));
        break;
      case "TaxSettings":
        const membershipStatus = validateObj?.membershipStatus ?? "";

        const isKYCCondition =
          validateObj?.subModule === "KYC" &&
          userType === "buyer" &&
          !["P4", "P5"].includes(membershipStatus);

        const isKYBCondition =
          validateObj?.subModule === "KYB" &&
          (userType === "seller" || userType === "both") &&
          !["P4", "P5"].includes(membershipStatus);

        const isUBOCondition = validateObj?.subModule === "UBO";

        if (isKYCCondition || isKYBCondition || isUBOCondition) {
          dispatch(setCurrentForm(AccountSettingsStageKey.TaxSettings));
        } else {
          dispatch(setCurrentForm(AccountSettingsStageKey.ComplianceSettings));
        }
        break;
      case "DataPrivacySettings":
        dispatch(setCurrentForm(AccountSettingsStageKey.DataPrivacySettings));
        break;
      case "SubscriptionDetails":
        router.push("/app");
        // dispatch(setCurrentForm(AccountSettingsStageKey.SubscriptionDetails));
        break;
      default:
        console.warn("Unknown form:", currentForm);
    }
  };

  return { nextStep };
}
