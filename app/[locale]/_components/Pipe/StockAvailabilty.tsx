import { useTranslations } from "next-intl";

type StockAvailabilityValue = "inStock" | "outOfStock";

export default function StockAvailabilityPipe({
  value,
}: {
  value: StockAvailabilityValue;
}) {
  const t = useTranslations("salesProduct");

  return <>{t(`optionLabels.stockAvailability.${value}`)}</>;
}
