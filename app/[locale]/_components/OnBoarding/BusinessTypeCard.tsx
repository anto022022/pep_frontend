import '@/app/[locale]/dev_styles.css';
import React from "react";
import Typography from "../Base/Typography";

interface BusinessTypeCardInterface {
  htmlFor: string;
  name: string;
  subtitle: string;
  value?: any;
  register?: any;
  requiredmsg?: any;
  disabled?: boolean;
}

const BusinessTypeCard: React.FC<BusinessTypeCardInterface> = (props) => {
  const { htmlFor, name, subtitle, value, register, requiredmsg, disabled } = props;
  return (
    <label htmlFor={htmlFor} className={`business-type-card-comp ${disabled ? 'legal-type-with-value' : 'legal-status-without-value'}`}>
      <input
        disabled={disabled}
        type="radio"
        id={htmlFor}
        className={`forms-radio ${disabled ? 'legal-type-with-value' : 'legal-status-without-value'}`}
        value={value}
        {...register("businessType", { required: requiredmsg })}
      />
      <div className="b-t-c-c-txt-wrap">
        <Typography variant="span" className="title">
          {name}
        </Typography>
        <Typography variant="span" className="subtitle">
          {subtitle}
        </Typography>
      </div>
    </label>
  );
};

export default BusinessTypeCard;
