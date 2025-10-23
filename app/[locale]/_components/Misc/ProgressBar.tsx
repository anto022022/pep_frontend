import { useTranslations } from "next-intl";

const ProgressBar = ({
  label,
  percentageValue,
}: {
  label: string;
  percentageValue: number;
}) => {
  const t = useTranslations("salesOffer.viewPage");
  return (
    <div className="progressbar-comp">
      <label className="p-c-label">{label}</label>
      <div className="p-c-bar">
        <span
          className="p-c-b-progress"
          style={{ width: `${percentageValue}%` }}
        ></span>
      </div>
      <span className="p-c-value">
        {t("completed")} {percentageValue || 0}%
      </span>
    </div>
  );
};

export default ProgressBar;
