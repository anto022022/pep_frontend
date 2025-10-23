import { useLocalizedOptions } from "@/app/[locale]/_hooks/useLocalizedOptions";
import { paymentMethodsData } from "@/app/[locale]/_models/StoreFront";

interface PaymentMethodPipeProps {
  value: string[];
  icon?: boolean;
}

const PaymentMethodPipe = ({ value, icon = false }: PaymentMethodPipeProps) => {
  const localizedPaymentMethodsData = useLocalizedOptions(
    "salesProduct",
    paymentMethodsData,
    "label",
    "label"
  );

  const items = value
    ?.map((id) => {
      const match = localizedPaymentMethodsData.find((item) => item.id === id);
      if (!match) return null;

      if (icon) {
        return (
          <span
            key={id}
            style={{
              display: "inline-flex",
              alignItems: "center",
              marginRight: 12,
            }}
          >
            <span style={{ marginRight: 4 }}>{match.icon}</span>
          </span>
        );
      }

      return match.label;
    })
    .filter(Boolean);

  if (!items?.length) return "--";

  return <>{icon ? items : (items as string[]).join(", ")}</>;
};

export default PaymentMethodPipe;
