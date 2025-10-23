import {
  Currency,
  ProductPricing,
} from "@/app/[locale]/_interface/SalesProductInterface";
import { PricingType } from "@/app/[locale]/_models/StoreFront";
import { computeCurrentPrice } from "@/app/[locale]/_utility/enquiryUtility";

interface RFQPricePipeProps {
  pricing: ProductPricing;
  currency: Currency;
  totalOrderQuantity?: number;
  multiplyByQuantity?: boolean;
  shippingFee?: number;
  offer?: ProductPricing;
}

const RFQPricePipe = ({
  pricing,
  currency,
  totalOrderQuantity = 0,
  multiplyByQuantity = false,
  shippingFee = 0,
  offer,
}: RFQPricePipeProps) => {
  if (
    pricing.pricingType === PricingType.NEGOTIABLE ||
    pricing.pricingType === PricingType.REQUEST_QUOTE
  ) {
    return null;
  }
  const currentPrice = computeCurrentPrice(pricing, totalOrderQuantity, offer);

  const formatPrice = (price: number) =>
    `${currency?.symbol}${price.toFixed(2)}`;

  const addShipping = (price: number) =>
    multiplyByQuantity ? price * totalOrderQuantity + shippingFee : price;

  if (Array.isArray(currentPrice)) {
    const [min, max] = currentPrice;
    return (
      <>
        {formatPrice(addShipping(min))} - {formatPrice(addShipping(max))}
      </>
    );
  }

  return <>{formatPrice(addShipping(currentPrice ?? 0))}</>;
};

export default RFQPricePipe;
