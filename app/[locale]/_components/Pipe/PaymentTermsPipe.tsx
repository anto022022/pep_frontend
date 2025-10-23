import { useLocalizedOptions } from "@/app/[locale]/_hooks/useLocalizedOptions";
import { paymentTermsOptions } from "@/app/[locale]/_models/StoreFront";

const PaymentTermsPipe = ({ value }: { value: string }) => {
  const localizedPaymentTerms = useLocalizedOptions(
    "salesProduct",
    paymentTermsOptions
  );

  return (
    <>
      {localizedPaymentTerms.find((term) => term.value === value)
        ? localizedPaymentTerms.find((term) => term.value === value)?.name
        : value}
    </>
  );
};

export default PaymentTermsPipe;
