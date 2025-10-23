"use client";
import { ShipInterNationalType } from "@/app/[locale]/_models/StoreFront";
import { useTranslations } from "next-intl";

interface InternationalShippingLabelProps {
  value?: ShipInterNationalType | string | null;
}

const InternationalShippingLabel: React.FC<InternationalShippingLabelProps> = ({
  value,
}) => {
  const t = useTranslations();

  let label = "-";

  switch (value) {
    case ShipInterNationalType.YES:
      label = t(
        "salesProduct.shipping_logistics.fields.shipsInternationally.yes"
      );
      break;
    case ShipInterNationalType.NO:
      label = t(
        "salesProduct.shipping_logistics.fields.shipsInternationally.no"
      );
      break;
    case ShipInterNationalType.UPON_REQUEST:
      label = t(
        "salesProduct.shipping_logistics.fields.shipsInternationally.uponRequest"
      );
      break;
    default:
      label = "-";
  }

  return <>{label}</>;
};

export default InternationalShippingLabel;
