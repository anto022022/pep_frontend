import {
  getKybVerificationData,
  getKycVerificationData,
  getUboVerificationData,
} from "@/app/[locale]/_models/common";
import {
  useGetBusinessProfileQuery,
  useGetBusinessDetailsQuery,
} from "@/app/[locale]/_store/apiReducer/settingsApi";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import { setIsAccountSettingOpen } from "../../_store/reducers/ui_store";
import { RootState, useAppDispatch, useAppSelector } from "../../_store/store";
import ComplianceSettingsCard from "./ComplianceSettingsCard";
import KybForm from "./KybForm";
import KycForm from "./KycForm";
import UboForm from "./UboForm";

const ComplianceSettings = () => {
  const dispatch = useAppDispatch();
  const { isKycComplete, isKybComplete, isUboComplete } = useAppSelector(
    (state: RootState) => state.uiData
  );
  const userType = useAppSelector(
    (state: RootState) => state.userData.userType
  );
  const [settingFormType, setSettingFormType] = useState<string>("");
  const [completedBusinessProfile, setCompletedBusinessProfile] =
    useState<boolean>(false);
  const [completedPersonalProfile, setCompletedPersonalProfile] =
    useState<boolean>(false);
  const [completedKyc, setCompletedKyc] = useState<boolean>(false);
  const [completedKyb, setCompletedKyb] = useState<boolean>(false);
  const [packageStatus, setpackageStatus] = useState<boolean>(false);
  const { data, isSuccess } = useGetBusinessProfileQuery();
  const { data: businessApiData, isLoading: isBusinessApiLoading } =
    useGetBusinessDetailsQuery();
  useEffect(() => {
    if (isSuccess && data?.data) {
      const profile = data.data; // assuming it's the first item
      const status = profile?.stageStatus?.AdditionalTradeDetails;

      if (status === "completed") {
        setCompletedBusinessProfile(true);
      } else {
        setCompletedBusinessProfile(false);
      }
      if (
        profile?.userInfo?.planType === "P5" ||
        profile?.userInfo?.planType === "P4"
      ) {
        setpackageStatus(true);
      }
      if (profile?.userInfo?.personalSettings) {
        setCompletedPersonalProfile(true);
      }
      setCompletedKyc(
        profile?.IdentityVerifyStatus === "Completed" &&
          profile.kycStatus === "Completed"
      );
      setCompletedKyb(profile?.BusinessVerifyStatus === "Completed");
    }
  }, [isSuccess, data]);
  const accSetLang = useTranslations("accountSettings");

  const kycVerificationData = getKycVerificationData(accSetLang);
  const kybVerificationData = getKybVerificationData(accSetLang);
  const uboVerificationData = getUboVerificationData(accSetLang);

  const handleSettingForm = (type: string) => {
    setSettingFormType(type);
    dispatch(setIsAccountSettingOpen(true));
  };

  return (
    <>
      <div className="compliance-settings-card-group">
        <ComplianceSettingsCard
          title={accSetLang("complianceSettings.kycVerification.title")}
          subTxt={accSetLang("complianceSettings.kycVerification.subTitle")}
          getStartedText={accSetLang(
            "complianceSettings.kybVerification.button.getStarted"
          )}
          data={kycVerificationData}
          handleVerify={() => {
            handleSettingForm("KYC");
          }}
          isVerified={completedKyc}
          completedPersonalProfile={completedPersonalProfile}
        />
        {userType !== "buyer" && (
          <ComplianceSettingsCard
            title={accSetLang("complianceSettings.kybVerification.title")}
            subTxt={accSetLang("complianceSettings.kybVerification.subTitle")}
            data={kybVerificationData}
            getStartedText={accSetLang(
              "complianceSettings.kybVerification.button.getStarted"
            )}
            handleVerify={() => {
              handleSettingForm("KYB");
            }}
            isVerified={completedKyb}
            completedBusinessProfile={completedBusinessProfile}
          />
        )}
        {packageStatus && (
          <ComplianceSettingsCard
            title={accSetLang("complianceSettings.uboVerification.title")}
            subTxt={accSetLang("complianceSettings.uboVerification.subTitle")}
            getStartedText={accSetLang(
              "complianceSettings.kybVerification.button.getStarted"
            )}
            data={uboVerificationData}
            handleVerify={() => {
              handleSettingForm("UBO");
            }}
            isVerified={isUboComplete}
            completedBusinessProfile={completedBusinessProfile}
          />
        )}
      </div>

      {/* KYC Form Modal */}
      {settingFormType === "KYC" && <KycForm data={businessApiData?.data} />}
      {/* KYB Form Modal */}
      {settingFormType === "KYB" && <KybForm data={businessApiData?.data} />}
      {/* UBO Form Modal */}
      {settingFormType === "UBO" && <UboForm data={businessApiData?.data} />}
    </>
  );
};

export default ComplianceSettings;
