import React from "react";
import Typography from "../Base/Typography";

interface ProgressBarDashedInterface {
  label?: string;
  subText?: string;
  value: number;
}

const ProgressBarDashed: React.FC<ProgressBarDashedInterface> = (props) => {
  const { label, subText, value } = props;
  return (
    <div className="progress-bar-dashed-comp">
      <div className="p-b-d-c-label-block">
        <Typography variant="span" className="label-txt">
          {label}
        </Typography>
        <Typography variant="span" className="label-subtxt">
          {subText}
        </Typography>
      </div>
      <div className="p-c-bar">
        <span className="p-c-b-progress" style={{ width: `${value}%` }}>
          <span className="p-c-b-value">{value}%</span>
        </span>
      </div>
    </div>
  );
};

export default ProgressBarDashed;
