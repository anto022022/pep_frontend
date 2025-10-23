import React from "react";
import Typography from "../Base/Typography";
import { useRouter } from "next/navigation";
import { useAppDispatch } from "@/app/[locale]/_store/store";
import { setCurrentForm } from "@/app/[locale]/_store/reducers/stepper_status_store";

interface SettingsCardProps {
  title: string;
  subTxt: string | React.ReactNode;
  path?: string;
  Icon?: React.ReactNode;
  tabKey: string;
}

const SettingsCard: React.FC<SettingsCardProps> = ({
  title,
  subTxt,
  path = "",
  Icon,
  tabKey,
}) => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const handleClick = () => {
    dispatch(setCurrentForm(tabKey));
    router.push(path);
  };

  return (
    <div onClick={handleClick} className="st-explore-card-comp cursor-pointer">
      <div className="st-e-c-c-top ">
        {Icon}
        <div className="st-c-c-content-wrapper">
          <Typography variant="span" className="st-c-c-c-w-title">
            {title}
          </Typography>
          <Typography variant="span" className="st-c-c-c-w-subtxt">
            {subTxt}
          </Typography>
        </div>
      </div>
    </div>
  );
};

export default SettingsCard;
