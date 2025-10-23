import ButtonIconRight from "@/app/[locale]/_components/Buttons/ButtonIconRight";
import ProgressBar from "@/app/[locale]/_components/Misc/ProgressBar";
import { useGetDashboardCompilationPercentageQuery } from "@/app/[locale]/_store/apiReducer/commonApi";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";
import RightArrow from "../../../../assets/img/icons/arrow-right.svg";
import "../../dev_styles.css";
import Typography from "../Base/Typography";

interface AccountSetupCardInterface {
    userType: string;
}

const AccountSetupCard: React.FC<AccountSetupCardInterface> = (props) => {
    const { userType } = props;
    const t = useTranslations("userAdminDashboard");
    const router = useRouter();

    const { data: CompilationDetails, refetch } =
        useGetDashboardCompilationPercentageQuery();
    const CompilationInfo = CompilationDetails?.data;
    const checkUserType =
        userType === "both" || userType === "seller" || userType === "buyer";
    const roleBasedValidation =
        userType === "buyer"
            ? CompilationInfo?.profileCompletionPercentage == 100
            : CompilationInfo?.totalCompletionPercentage == 100;
    const checkStatusCode =
        CompilationDetails?.statusCode == 200
            ? userType == "buyer"
                ? CompilationInfo?.profileCompletionPercentage
                : CompilationInfo?.totalCompletionPercentage ?? 0
            : 0;


    useEffect(() => {
        refetch();
    }, []);

    const handleContinueSetup = () => {
        if (userType === "buyer") {
            if (CompilationInfo?.profileCompletionPercentage !== 100) {
                router.push(`/app/settings/profile-settings?type=personal-information`);
            }
        } else if (userType === "both" || userType === "seller") {
            if (CompilationInfo?.businessCompletionPercentage !== 100) {
                router.push(`/app/business-profile`);
            } else {
                router.push(`/app/settings/profile-settings?type=personal-information`);
            }
        }
    };

    if (!CompilationDetails) {
        return null;
    }

    return (
        <>
            {roleBasedValidation ? (
                <div className="account-setup-card-comp-handle">
                    {" "}
                    {/* Screen 2 */}
                    <div className="a-s-c-c-body">
                        <div className="a-s-c-c-b-content-wrapper">
                            <Typography variant="h1" className="a-s-c-c-title">
                                {t("accountSetupCard.build")}{" "}
                                <strong style={{ color: "red" }}>
                                    {t("accountSetupCard.trust")}
                                </strong>
                                .
                                <br />
                                {t("accountSetupCard.findPartners")} <br />
                                {t("accountSetupCard.growFaster")}{" "}
                            </Typography>
                        </div>
                    </div>
                    <div className="a-s-c-c-footer"></div>
                </div>
            ) : (
                <div className="account-setup-card-comp">
                    <div className="a-s-c-c-body">
                        <div className="a-s-c-c-b-content-wrapper">
                            <Typography variant="h1" className="a-s-c-c-title">
                                {t("accountSetupCard.completeAccountSetup")}
                            </Typography>
                            <Typography variant="span" className="a-s-c-c-subtxt">
                                {t("accountSetupCard.chooseYourPrimaryGoal")}
                            </Typography>
                        </div>
                        <div className="a-s-c-c-b-completed-status-block">
                            <div className="a-s-c-c-completed-count-block">
                                <Typography variant="span" className="a-s-c-c-count">
                                    {checkStatusCode}%
                                </Typography>
                            </div>
                            <div className="a-s-c-c-progress-group">
                                {userType !== "buyer" && (
                                    <div className="a-s-c-c-p-g-item">
                                        <ProgressBar
                                            label={`1. ${t("accountSetupCard.businessSetup")}`}
                                            percentageValue={
                                                CompilationInfo?.businessCompletionPercentage ?? 0
                                            }
                                        />
                                    </div>
                                )}
                                {checkUserType && (
                                    <div className="a-s-c-c-p-g-item">
                                        <ProgressBar
                                            label={`${userType == "buyer" ? "" : "2."} ${t(
                                                "accountSetupCard.personalDetails"
                                            )}`}
                                            percentageValue={
                                                CompilationInfo?.profileCompletionPercentage ?? 0
                                            }
                                        />
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                    <div className="a-s-c-c-footer">
                        <ButtonIconRight
                            name={t("accountSetupCard.continueSetup")}
                            icon={RightArrow}
                            className={"continue-steup-btn"}
                            onClick={handleContinueSetup}
                        ></ButtonIconRight>
                    </div>
                </div>
            )}
        </>
    );
};

export default AccountSetupCard;