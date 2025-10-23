import Typography from "@/app/[locale]/_components/Base/Typography";
import Buttons from "@/app/[locale]/_components/Buttons/Buttons";
import { CloseIcon, TickGreenIcon, VerificationIcon } from "@/app/[locale]/_components/Icons/SVGIcons";
import { useGetDashboardCardDetailsQuery } from "@/app/[locale]/_store/apiReducer/commonApi";
import '@/assets/css/kycAndKybDialog.css';
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { Dialog } from "primereact/dialog";
import React, { useEffect } from "react";
interface ProfileCompletionStatus {
    isAllCompleted?: boolean;
    isBusinessProfileComplete?: boolean;
    isKYBCompleted?: boolean;
    isKYCCompleted?: boolean;
    isProductAdded?: boolean;
    isProfileComplete?: boolean;
}

interface KycAndKybDialogInterface {
    verificationData?: ProfileCompletionStatus;
    visible: boolean;
    onClose?: () => void;
}

const KybAndKycVerificationDialog: React.FC<KycAndKybDialogInterface> = (props) => {
    const { verificationData, visible, onClose } = props;
    const router = useRouter();
    const validateKyb = !verificationData?.isKYBCompleted;
    const validateKyc = !verificationData?.isKYCCompleted;
    const businessProfileT = useTranslations("businessProfile");

    const { data: dashboardDetails, refetch } = useGetDashboardCardDetailsQuery();
    const checkUserType =
        dashboardDetails?.data?.userType === "both" ||
        dashboardDetails?.data?.userType === "seller" ||
        dashboardDetails?.data?.userType === "buyer";
    const checkKycAndKyb = ((validateKyb && validateKyc && checkUserType) ? " KYB & KYC " :
        (!verificationData?.isKYBCompleted && dashboardDetails?.data?.userType === "seller") ? " KYB " :
            (!verificationData?.isKYCCompleted && dashboardDetails?.data?.userType === "buyer") ? " Kyc " : "");


    useEffect(() => {
        refetch();
    }, []);

    return (
        <Dialog
            visible={visible}
            modal
            className='modal-comp get-verified-modal'
            closable={true}
            onHide={onClose || (() => { })}
            content={() => (
                <>
                    <div className='m-c-head'>
                        <div className='m-c-h-left'>
                            <VerificationIcon />
                            <div className='title-block'>
                                <Typography variant='span' className='t-b-title'>{businessProfileT("verificationPopup.getVerified")}</Typography>
                                <Typography variant='span' className='t-b-subtxt'>{businessProfileT("verificationPopup.completeYourProfile")} {checkKycAndKyb} {businessProfileT("verificationPopup.getVerifiedBadge")}</Typography>
                            </div>
                        </div>
                        <div className='m-c-h-right'>
                            <CloseIcon onClick={onClose} />
                        </div>
                    </div>
                    <div className='m-c-body'>
                        <div className='to-get-verified-list-block'>
                            <div className='t-g-v-l-b-item'>
                                <TickGreenIcon />
                                <Typography variant='span' className='t-g-v-l-b-i-txt'>
                                    {businessProfileT("verificationPopup.trustBadges")}
                                </Typography>
                            </div>
                            <div className='t-g-v-l-b-item'>
                                <TickGreenIcon />
                                <Typography variant='span' className='t-g-v-l-b-i-txt'>
                                    {businessProfileT("verificationPopup.getPriorityListing")}
                                </Typography>
                            </div>
                            <div className='t-g-v-l-b-item'>
                                <TickGreenIcon />
                                <Typography variant='span' className='t-g-v-l-b-i-txt'>
                                    {businessProfileT("verificationPopup.newCustomerDiscovery")}
                                </Typography>
                            </div>
                            <div className='t-g-v-l-b-item'>
                                <TickGreenIcon />
                                <Typography variant='span' className='t-g-v-l-b-i-txt'>
                                    {businessProfileT("verificationPopup.increaseVisibility")}
                                </Typography>
                            </div>
                        </div>
                    </div>
                    {(validateKyb || validateKyc) && (
                        <div className='m-c-footer'>
                            <Buttons text={businessProfileT("verificationPopup.remindMeLater")} className={'btn-plain-txt'} onClick={onClose}></Buttons>
                            <Buttons className={'btn-c-primary'} text={businessProfileT("verificationPopup.completeNow")} onClick={() => router.push('settings/account-settings?type=compliance-settings')} />
                        </div>
                    )}
                </>
            )}
        ></Dialog>
    );
};

export default KybAndKycVerificationDialog;