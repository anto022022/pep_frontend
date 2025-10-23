"use client";

import Typography from "@/app/[locale]/_components/Base/Typography";
import {
  DataAndPrivacy,
  GroupIcon,
  GroupTick,
  NotificationIcon,
  VectorIcon
} from "@/app/[locale]/_components/Icons/SVGIcons";
import SettingsCard from "@/app/[locale]/_components/MicroComponents/SettingsCard";
import MobileNavBar from "@/app/[locale]/_components/Navbar/MobileNavBar";
import useIsMobile from "@/app/[locale]/_hooks/useIsMobile";
import {
  AccountSettingsStageKey,
  ProfileSettingsStageKey,
} from "@/app/[locale]/_models/StoreFront";
import { useGetBusinessProfileQuery } from "@/app/[locale]/_store/apiReducer/settingsApi";
import { useAppSelector } from "@/app/[locale]/_store/store";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { use, useEffect, useState } from "react";

export default function Page({ params }: { params: Promise<any> }) {
  const unwrappedParams = use(params);
  const locale = unwrappedParams?.locale || "en";
  const s = useTranslations("settings");
  // const t = useTranslations("common");
  const router = useRouter();
  const [completedBusinessProfile, setCompletedBusinessProfile] =
    useState<boolean>(false);
  const userType = useAppSelector((state) => state.userData.userType);
  const { data, isSuccess } = useGetBusinessProfileQuery();
  const isMobile = useIsMobile(1200);
  useEffect(() => {
    if (isSuccess && data?.data?.length) {
      const profile = data.data[0];
      const status = profile?.stageStatus?.AdditionalTradeDetails;

      if (status === "completed") {
        setCompletedBusinessProfile(true);
      } else {
        setCompletedBusinessProfile(false);
      }
    }
  }, [isSuccess, data]);

  const onClick = () => {
    router.push(`/${locale}/app/settings/profile-settings`);
  };

  const renderSettings = () => {
    return (
      <>
        <div className="dashboard-main-block">

          <div className="space-first">
            <div className="dashboard-section-block">
              <div className="settings-top">
                {!isMobile && (
                  <>
                    <div>
                      <Typography
                        variant="h2"
                        className="d-s-b-title setting-title"
                      >
                        {s("moduleName")}
                      </Typography>
                    </div>
                  </>
                )}
                {/* <div>
                  <div className="settings-badge-pep-prima">{s("badge")}</div>
                </div> */}
              </div>
              {/* <div className="settings-pep-upgrade">
                {s("upgradeBanner")}
              </div> */}
            </div>
          </div>

          <div className="space-second">
            <div className="dashboard-section-block">
              <Typography variant="h2" className="setting-sub-title">
                {s("personalSettings.title")}
              </Typography>
              <div className="card-group-block">
                <SettingsCard
                  title={s("cards.profile.title")}
                  Icon={<VectorIcon />}
                  subTxt={s("cards.profile.subTxt")}
                  path={`/${locale}/app/settings/profile-settings`}
                  tabKey={ProfileSettingsStageKey.Profile}
                />
                <SettingsCard
                  title={s("cards.notificationPreferences.title")}
                  subTxt={s("cards.notificationPreferences.subTxt")}
                  Icon={<NotificationIcon />}
                  path={`/${locale}/app/settings/profile-settings`}
                  tabKey={ProfileSettingsStageKey.NotificationPreferences}
                />
                {/* <SettingsCard
                  title={s("cards.chatPreferences.title")}
                  subTxt={t("comingSoon")}
                  Icon={<ChatPreferencesIcon />}
                  path={`/${locale}/app/settings/profile-settings`}
                  tabKey={ProfileSettingsStageKey.ChatPreferences}
                /> */}
              </div>
            </div>
          </div>

          <div className="dashboard-section-block">
            <Typography variant="h2" className="setting-sub-title">
              {s("accountSettings.title")}
            </Typography>
            <div className="card-group-block  ">
              {userType !== "buyer" && (
                <SettingsCard
                  title={s("accountSettings.cards.businessSettings.title")}
                  subTxt={
                    <>
                      <div>
                        <span>
                          {" "}
                          {s("accountSettings.cards.businessSettings.subTxt")}
                        </span>
                      </div>
                    </>
                  }
                  Icon={<GroupIcon />}
                  // path={
                  //   completedBusinessProfile
                  //     ? `/${locale}/app/settings/account-settings`
                  //     : `/${locale}/app/business-profile`
                  // }
                  path={`/${locale}/app/settings/account-settings`}
                  tabKey={AccountSettingsStageKey.BusinessSettings}
                />
              )}
              <SettingsCard
                title={s("accountSettings.cards.complianceSettings.title")}
                subTxt={s("accountSettings.cards.complianceSettings.subTxt")}
                Icon={<GroupTick />}
                path={`/${locale}/app/settings/account-settings`}
                tabKey={AccountSettingsStageKey.ComplianceSettings}
              />
              <SettingsCard
                title={s("accountSettings.cards.taxSettings.title")}
                subTxt={s("accountSettings.cards.taxSettings.subTxt")}
                Icon={<GroupTick />}
                path={`/${locale}/app/settings/account-settings`}
                tabKey={AccountSettingsStageKey.TaxSettings}
              />
            </div>
          </div>

          <div className="dashboard-section-block">
            <div className="card-group-block">
              <SettingsCard
                title={s("accountSettings.cards.dataPrivacySettings.title")}
                subTxt={s("accountSettings.cards.dataPrivacySettings.subTxt")}
                Icon={<DataAndPrivacy />}
                path={`/${locale}/app/settings/account-settings`}
                tabKey={AccountSettingsStageKey.DataPrivacySettings}
              />
              {/* <SettingsCard
                title={s("accountSettings.cards.subscriptionDetails.title")}
                subTxt={s("accountSettings.cards.subscriptionDetails.subTxt")}
                Icon={<ProfileTwoUser />}
                path={`/${locale}/app/settings/account-settings`}
                tabKey={AccountSettingsStageKey.SubscriptionDetails}
              /> */}
              {/* <SettingsCard
                    title={s("accountSettings.cards.userSettings.title")}
                    subTxt={s("accountSettings.cards.userSettings.subTxt")}
                    Icon={<VectorIcon />}
                    path={`/${locale}/app/settings/account-settings`}
                    tabKey={AccountSettingsStageKey.UserSettings}
                  /> */}
            </div>
          </div>
        </div>
      </>
    );
  };

  return (
    <>
      {!isMobile ? (
        <div className="settings-page">
          <div className="body-preview show-screen">{renderSettings()}</div>
        </div>
      ) : (
        <>
          <div className="body-preview-mob three-col-form-mob">
            <MobileNavBar
              path=""
              title={s("moduleName")}
              onClick={onClick}
              isRFQActive={false}
              isLogoShow={false}
              children={false}
            />
            <div className="b-p-m-body">
              <div className="compliance-mob-wrapper">
                <div className="settings-page">{renderSettings()}</div>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
}
