import React from "react";
import Typography from "../Base/Typography";
import ProgressBar from "../Misc/ProgressBar";
import ButtonIconRight from "../Buttons/ButtonIconRight";
import RightArrow from "@/assets/img/icons/arrow-right.svg";

const AccountSetupCard: React.FC = () => {
  return (
    <div className="account-setup-card-comp">
      <div className="a-s-c-c-body">
        <div className="a-s-c-c-b-content-wrapper">
          <Typography variant="h1" className="a-s-c-c-title">
            Complete account setup
          </Typography>
          <Typography variant="span" className="a-s-c-c-subtxt">
            Choose your primary goal, and we'll guide you with tailored steps to
            help you succeed
          </Typography>
        </div>

        <div className="a-s-c-c-b-completed-status-block">
          <div className="a-s-c-c-completed-count-block">
            <Typography variant="span" className="a-s-c-c-count">
              27%
            </Typography>
            <Typography variant="span" className="a-s-c-c-badge-txt">
              Completed
            </Typography>
          </div>

          <div className="a-s-c-c-progress-group">
            <div className="a-s-c-c-p-g-item">
              <ProgressBar label="1. Business setup" percentageValue={55} />
            </div>
            <div className="a-s-c-c-p-g-item">
              <ProgressBar label="2. Compliance" percentageValue={30} />
            </div>
            <div className="a-s-c-c-p-g-item">
              <ProgressBar label="3. Personal Details" percentageValue={68} />
            </div>
          </div>
        </div>
      </div>

      <div className="a-s-c-c-footer">
        <ButtonIconRight
          name="Continue Setup"
          icon={RightArrow}
          className="continue-steup-btn"
        />
      </div>
    </div>
  );
};

export default AccountSetupCard;
