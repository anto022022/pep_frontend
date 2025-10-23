import React from "react";
import Typography from "../Base/Typography";
import Buttons from "../Buttons/Buttons";
import Image from "next/image";
import TrueVerified from "../../../../public/img/true-verified.png";
import VerifyCompleted from "../../../../public/img/verification-completed.svg";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";

interface DataProps {
  title: string;
  subTxt: string;
}
interface ComplianceSettingsCardProps {
  title: string;
  subTxt: string;
  handleVerify: () => void;
  data: DataProps[];
  isVerified?: boolean;
  getStartedText: string;
  completedBusinessProfile?: boolean;
  completedPersonalProfile?: boolean;
}
const ComplianceSettingsCard = ({
  title,
  subTxt,
  handleVerify,
  data,
  isVerified = false,
  getStartedText,
  completedBusinessProfile,
  completedPersonalProfile,
}: ComplianceSettingsCardProps) => {
  const router = useRouter();
  const accSetLang = useTranslations("accountSettings");
  const renderActionButton = () => {
    if (completedPersonalProfile !== undefined) {
      if (!completedPersonalProfile) {
        return (
          <Buttons
            className={"btn-c-primary"}
            text="Complete Personal Profile"
            onClick={() => router.push(`/app/settings/profile-settings`)}
          />
        );
      }
      return isVerified ? (
        <Buttons
          text={accSetLang("complianceSettings.kycVerification.button.updateVerification")}
          className="btn-plain-txt"
          onClick={handleVerify}
        />
      ) : (
        <Buttons
          className="btn-c-primary"
          text={getStartedText}
          onClick={handleVerify}
        />
      );
    }

    if (completedBusinessProfile !== undefined) {
      if (!completedBusinessProfile) {
        return (
          <Buttons
            className={"btn-c-primary"}
            text={accSetLang("complianceSettings.kybVerification.button.completeBusinessProfile")}
            onClick={() => router.push(`/app/business-profile`)}
          />
        );
      }
      return isVerified ? (
        <Buttons
          text={accSetLang("complianceSettings.kybVerification.button.updateVerification")}
          className="btn-plain-txt"
          onClick={handleVerify}
        />
      ) : (
        <Buttons
          className="btn-c-primary"
          text={getStartedText}
          onClick={handleVerify}
        />
      );
    }

    return null;
  };

  return (
    <div className="compliance-settings-card-comp">
      <div className="c-s-c-c-head">
        <div className="c-s-c-c-h-left">
          <Typography variant="span" className="c-s-head-title">
            {title}
          </Typography>
          {isVerified ? (
            <div className="c-s-verified-wrapper">
              <Image
                src={TrueVerified}
                alt="True Verified"
                width={75}
                height={15}
              ></Image>
              <Image
                src={VerifyCompleted}
                alt="True Verified"
                width={150}
                height={20}
              ></Image>
            </div>
          ) : (
            <Typography variant="span" className="c-s-head-subtxt">
              {subTxt}
            </Typography>
          )}
        </div>
        {/* <div className="c-s-c-c-h-right">
          {completedBusinessProfile ? (
            <>
              {isVerified ? (
                <Buttons
                  text={"Update Verification"}
                  className={"btn-plain-txt"}
                  onClick={handleVerify}
                ></Buttons>
              ) : (
                <Buttons
                  className={"btn-c-primary"}
                  text={getStartedText}
                  onClick={handleVerify}
                />
              )}
            </>
          ) : (
            <Buttons
              className={"btn-c-primary"}
              text="Complete Business Profile"
              onClick={() => router.push(`/app/business-profile`)}
            />
          )}
        </div> */}
        <div className="c-s-c-c-h-right">{renderActionButton()}</div>
      </div>
      {!isVerified ? (
        <div className="c-s-c-c-body">
          {data?.length > 0 && (
            <div className="verification-group">
              {data?.map((item, index) => {
                return (
                  <div className="v-g-item" key={index}>
                    <Typography variant="span" className="v-g-title">
                      {item.title}
                    </Typography>
                    <Typography variant="span" className="v-g-subtxt">
                      {item.subTxt}
                    </Typography>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      ) : null}
    </div>
  );
};

export default ComplianceSettingsCard;
