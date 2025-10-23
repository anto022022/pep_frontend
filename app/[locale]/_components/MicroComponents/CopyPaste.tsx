"use client"
import Image from "next/image";
import React from "react";
import CopyPasteIcon from "../../../../assets/img/icons/paste-code.svg";
import Typography from "../Base/Typography";

type CopyPasteProps = {
  initiatePaste: () => void;
  t: any;

};
    // const t = useTranslations("dynamicOtp");

const CopyPaste: React.FC<CopyPasteProps> = ({ initiatePaste , t}) => {
  return (
    <div className="copy-paste-comp" onClick={initiatePaste}>
      <Image
        src={CopyPasteIcon}
        width={18}
        height={18}
        sizes="100vw"
        alt="Paste"
      ></Image>
      <Typography variant="span" className="c-p-c-txt">
      {t("otpPage.paste_code")}
      </Typography>
    </div>
  );
};

export default CopyPaste;
