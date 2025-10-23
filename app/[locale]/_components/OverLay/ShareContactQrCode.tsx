import Typography from "@/app/[locale]/_components/Base/Typography";
import ButtonIconLeftOutline from "@/app/[locale]/_components/Buttons/ButtonIconLeftOutline";
import { CloseIcon, InfoIcon, ShareIcon } from "@/app/[locale]/_components/Icons/SVGIcons";
import AlertMessage from "@/app/[locale]/_components/Messages/AlertMessage";
import { phoneNumberInterface } from "@/app/[locale]/_interface/ConnectInterface";
import { setShowContactQrCode } from "@/app/[locale]/_store/reducers/ui_store";
import {
  RootState,
  useAppDispatch,
  useAppSelector,
} from "@/app/[locale]/_store/store";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { Messages } from "primereact/messages";
import { Sidebar } from "primereact/sidebar";
import QRCode from "qrcode";
import { FC, useEffect, useState } from "react";

interface ContactInfo {
  contactName: string;
  email: string;
  phoneNo: phoneNumberInterface;
  companyName: string;
}

interface ContactQRCodeProps {
  contactName: string;
  email: string;
  phoneNo: phoneNumberInterface;
  companyName: string;
  size?: number;
  className?: string;
}

// Simulate QR code generation (replace with actual qrcode library in your implementation)
const generateQRCodeDataURL = async (
  contact: ContactInfo,
  size: number = 315
): Promise<string> => {
  // In your actual implementation, use this code:
  const vCard = `BEGIN:VCARD
VERSION:3.0
FN:${contact.contactName}
ORG:${contact.companyName}
TEL:${contact.phoneNo}
EMAIL:${contact.email}
END:VCARD`;

  return await QRCode.toDataURL(vCard, {
    errorCorrectionLevel: "M",
    type: "image/png",
    margin: 1,
    color: {
      dark: "#000000",
      light: "#FFFFFF",
    },
    width: size,
  });
};

const ShareContactQrCode: FC<ContactQRCodeProps> = ({
  contactName,
  email,
  phoneNo,
  companyName,
  size,
}) => {
  const showContactQrCode = useAppSelector(
    (state: RootState) => state.uiData.showContactQrCode
  );
  const dispatch = useAppDispatch();
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [qrCodeDataURL, setQrCodeDataURL] = useState<string>("");
  const t = useTranslations("salesConnect.qrCode")

  const contact: ContactInfo = {
    contactName,
    email,
    phoneNo,
    companyName,
  };

  // const shareContact = async () => {
  //   if (navigator.share) {
  //     try {
  //       await navigator.share({
  //         title: `Contact: ${contactName}`,
  //         text: `Contact information for ${contactName} from ${companyName}`,
  //         url: qrCodeDataURL,
  //       });
  //     } catch (err) {
  //       console.log("Share failed:", err);
  //     }
  //   } else {
  //     // Fallback: copy to clipboard
  //     navigator.clipboard.writeText(
  //       `Contact: ${contactName}\nEmail: ${email}\nPhone: ${phoneNo}\nCompany: ${companyName}`
  //     );
  //     alert("Contact information copied to clipboard!");
  //   }
  // };

  const shareContact = async () => {
    try {
      // Convert base64 -> Blob
      const response = await fetch(qrCodeDataURL);
      const blob = await response.blob();
      const file = new File([blob], "contact-qrcode.png", { type: "image/png" });

      if (navigator.canShare && navigator.canShare({ files: [file] })) {
        await navigator.share({
          title: `Contact: ${contactName}`,
          text: `Contact information for ${contactName} from ${companyName}`,
          files: [file],
        });
      } else if (navigator.share) {
        // Fallback: share just text + link
        await navigator.share({
          title: `Contact: ${contactName}`,
          text: `Contact information for ${contactName} from ${companyName}`,
          url: window.location.href,
        });
      } else if (navigator.clipboard) {
        // Last fallback: copy to clipboard
        await navigator.clipboard.writeText(
          `Contact: ${contactName}\nEmail: ${email}\nPhone: ${phoneNo}\nCompany: ${companyName}`
        );
        alert("Contact info copied to clipboard!");
      } else {
        alert("Sharing not supported on this browser.");
      }
    } catch (err) {
      console.error("Share failed:", err);
    }
  };



  //Generate QR code
  const generateQRCode = async () => {
    // Don't generate if any required field is empty
    if (!contactName || !email || !phoneNo || !companyName) {
      setError("All contact fields are required");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const dataURL = await generateQRCodeDataURL(contact, size);
      setQrCodeDataURL(dataURL);
    } catch (err) {
      setError("Failed to generate QR code");
      console.error("QR Code generation error:", err);
    } finally {
      setLoading(false);
    }
  };

  // Generate QR code when contact info changes
  useEffect(() => {
    generateQRCode();
  }, [contactName, email, phoneNo, companyName, size]);


  const showAlertMessage = (msgsRef: React.RefObject<Messages | null>) => {
    if (msgsRef.current) {
      msgsRef.current.clear();
      msgsRef.current.show([
        {
          sticky: true,
          severity: "info",
          icon: <InfoIcon className={"alert-icon"} />,
          detail:
            "Scan to See Contact Details.",
        },
      ]);
    }
  };
  return (
    <>
      <Sidebar
        visible={showContactQrCode}
        position="right"
        onHide={() => dispatch(setShowContactQrCode(false))}
        className="offcanvas-sidebar-comp variants-sidebar addnewproduct-sidebar"
        content={() => (
          <>
            <div className="o-s-c-top">
              <div className="o-s-c-header">
                <Typography variant="h4" className="o-s-c-h-title">
                  {t("title")}
                </Typography>
                <CloseIcon
                  onClick={() => dispatch(setShowContactQrCode(false))}
                />
              </div>
              <div className="qr-body">
                <div className="profile-card-comp">
                  <div className="p-c-c-img">
                    {/* <Image
                      src={
                        "https://www.shutterstock.com/image-photo/head-shot-portrait-close-smiling-600nw-1714666150.jpg"
                      }
                      width={40}
                      height={40}
                      alt="Profile"
                      sizes="100vw"
                    /> */}
                    <span className="active-bagde"></span>
                  </div>
                  <div className="p-c-c-info">
                    <Typography variant="span" className="p-c-c-name">
                      {contactName}
                    </Typography>
                    <Typography variant="span" className="p-c-c-role">
                      {companyName}
                    </Typography>
                  </div>


                </div>
                {/* QR Code */}
                <div className="qr-code-img">
                  {qrCodeDataURL && !loading && !error && (
                    <Image
                      src={qrCodeDataURL}
                      alt={`QR Code for ${contactName}`}
                      width={315}
                      height={315}
                      className="block"
                    />
                  )}
                </div>

                {/* Info Text */}
                <AlertMessage showMessage={showAlertMessage} />

                {/* Share Button */}
                <ButtonIconLeftOutline
                  name={t("button")}
                  className={"bg-outline-grey custom-width"}
                  onClick={shareContact}
                ><ShareIcon /></ButtonIconLeftOutline>

              </div>
            </div>
          </>
        )}
      ></Sidebar>
    </>
  );
};

export default ShareContactQrCode;
