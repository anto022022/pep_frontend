import { useLocalizedOptions } from "@/app/[locale]/_hooks/useLocalizedOptions";
import { paymentMethodsData } from "@/app/[locale]/_models/StoreFront";
import { FC } from "react";
export interface paymentInterface {
  value: string[];
  onChange: (value: string) => void;
}
const PaymentMethods: FC<paymentInterface> = ({ value = [], onChange }) => {
  const localizedPaymentMethodsData = useLocalizedOptions(
    "salesProduct",
    paymentMethodsData,
    "label",
    "label"
  );

  return (
    <>
      <div className="payment-option-group">
        {localizedPaymentMethodsData.map(({ id, label, icon }, i) => (
          <label
            className="payment-option-card-comp forms-checkbox"
            htmlFor={id}
            key={i}
          >
            <div className="p-o-c-c-icon-txt">
              {icon}
              <span className="p-o-c-c-txt">{label}</span>
            </div>
            <div>
              <input
                type="checkbox"
                value={id}
                id={id}
                checked={value.includes(id)}
                onChange={() => onChange(id)}
                tabIndex={-1}
              />
              <span className="custom-checkbox"></span>
            </div>
          </label>
        ))}
      </div>
    </>
  );
};

export default PaymentMethods;
