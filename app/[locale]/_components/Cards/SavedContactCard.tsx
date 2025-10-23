import Image from "next/image";
import React from "react";
import Typography from "../Base/Typography";
import { AddImageIcon, SavedContactIcon } from "../Icons/SVGIcons";
import { attachment } from "../../_interface/ConnectInterface";
import { useTranslations } from "next-intl";

const SavedContactCard: React.FC<{
  name?: string;
  role?: string;
  image?: attachment;
}> = ({ name, role, image }) => {
  const t = useTranslations("leads.viewPage.savedContact");
  return (
    <div className="contact-card-comp">
      <div className="c-c-c-left">
        <div className="profile-card-comp">
          <div className="p-c-c-img">
            {image?.url ? (
              <Image
                src={image?.url}
                width={40}
                height={40}
                alt="Profile"
                sizes="100vw"
              />
            ) : (
              // <AddImageIcon />
              <Image
                src={
                  "https://upload.wikimedia.org/wikipedia/commons/8/89/Portrait_Placeholder.png"
                }
                width={40}
                height={40}
                alt="Profile"
                sizes="100vw"
              />
            )}
            <span className="active-bagde"></span>
          </div>
          <div className="p-c-c-info">
            <Typography variant="span" className="p-c-c-name">
              {name}
            </Typography>
            <Typography variant="span" className="p-c-c-role">
              {role}
            </Typography>
          </div>
        </div>
      </div>
      <div className="c-c-c-right">
        <div className="table-badge-comp order-confirm">
          <SavedContactIcon />
          <span>{t("savedContact")}</span>
        </div>
      </div>
    </div>
  );
};

export default SavedContactCard;
