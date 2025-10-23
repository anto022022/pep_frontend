"use client";

import {
  ChatPreferencesIcon,
  NotificationIcon,
  VectorIcon,
} from "@/app/[locale]/_components/Icons/SVGIcons";
import MobileNavBar from "@/app/[locale]/_components/Navbar/MobileNavBar";
import NotificationPreferences from "@/app/[locale]/_components/SettingsComponents/NotificationPreferences";
import ProfileSettings from "@/app/[locale]/_components/SettingsComponents/ProfileSettings";
import FormTitle from "@/app/[locale]/_components/StoreFront/Forms/FormTitle";
import useIsMobile from "@/app/[locale]/_hooks/useIsMobile";
import { ProfileSettingsStageKey } from "@/app/[locale]/_models/StoreFront";
import { setCurrentForm } from "@/app/[locale]/_store/reducers/stepper_status_store";
import { setIsAccountSettingsSidebarOpen } from "@/app/[locale]/_store/reducers/ui_store";
import {
  RootState,
  useAppDispatch,
  useAppSelector,
} from "@/app/[locale]/_store/store";
import { useTranslations } from "next-intl";
import { useSearchParams } from "next/navigation";
import { useEffect } from "react";

const page = () => {
  const searchParams = useSearchParams();
  const type = searchParams.get("type");
  const currentForm = useAppSelector(
    (state: RootState) => state.stepperStatus.currentForm
  );
  const t = useTranslations("common");
  const p = useTranslations("profileSettings");
  const isMobile = useIsMobile(1200);
  const dispatch = useAppDispatch();

  useEffect(() => {
    let formKey = "";
    if (type === "personal-information") {
      formKey = ProfileSettingsStageKey.Profile;
    } else if (currentForm && currentForm !== "") {
      formKey = currentForm;
    } else {
      formKey = ProfileSettingsStageKey.Profile;
    }
    dispatch(setCurrentForm(formKey));
  }, [type, dispatch]);

  const titleKeyByForm: Record<ProfileSettingsStageKey, string> = {
    [ProfileSettingsStageKey.Profile]: "profileSettingsStepper.Profile",
    [ProfileSettingsStageKey.NotificationPreferences]:
      "profileSettingsStepper.NotificationPreferences",
    [ProfileSettingsStageKey.ChatPreferences]:
      "profileSettingsStepper.ChatPreferences.title",
  };

  const renderTab = () => {
    if (
      currentForm === ProfileSettingsStageKey.Profile ||
      type === "personal-information"
    ) {
      return <ProfileSettings />;
    } else if (
      currentForm === ProfileSettingsStageKey.NotificationPreferences
    ) {
      return <NotificationPreferences />;
    } else if (currentForm === ProfileSettingsStageKey.ChatPreferences) {
      return t("comingSoon");
    }
    return <ProfileSettings />;
  };

  const onClick = () => {
    dispatch(setIsAccountSettingsSidebarOpen(true));
  };

  const headerIcon =
    currentForm === "Profile" ? (
      <VectorIcon />
    ) : currentForm === "NotificationPreferences" ? (
      <NotificationIcon />
    ) : currentForm === "ChatPreferences" ? (
      <ChatPreferencesIcon />
    ) : (
      <VectorIcon />
    );
  return (
    <>
      {!isMobile ? (
        <>
          {" "}
          <div className="t-c-l-c-head">
            <FormTitle
              variant={"h1"}
              text={p(
                (titleKeyByForm as Record<string, string>)[currentForm] ||
                "profileSettingsStepper.Profile"
              )}
            >
              {headerIcon}
            </FormTitle>
          </div>
          <div className="t-c-l-c-body">
            <div className="t-c-l-c-left">{renderTab()}</div>
          </div>
        </>
      ) : (
        <>
          <div className="body-preview-mob three-col-form-mob">
            <MobileNavBar
              path=""
              title={p(
                (titleKeyByForm as Record<string, string>)[currentForm] ||
                "profileSettingsStepper.Profile"
              )}
              headIcon={headerIcon}
              onClick={onClick}
              isRFQActive={false}
              isLogoShow={false}
              children={false}
            />

            <div className="b-p-m-body">
              <div className="compliance-mob-wrapper">
                <div className="forms-block">{renderTab()}</div>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default page;
