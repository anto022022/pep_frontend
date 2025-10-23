import { Variant } from "@/app/[locale]/(pages)/app/(sales)/sales-product/form/(forms)/AttributesVariants";
import {
  ProductPricing,
  VariantAttribute,
} from "@/app/[locale]/_interface/SalesProductInterface";
import { PricingType } from "@/app/[locale]/_models/StoreFront";

export const computeCurrentPrice = (
  pricing: ProductPricing,
  totalQty: number,
  offerPricing?: ProductPricing
): number | [number, number] | null => {
  if (!pricing) return null;

  if (pricing.pricingType === PricingType.BULK) {
    if (!pricing.bulkPrices || pricing.bulkPrices.length === 0) return null;

    let resultIndex = 0;
    const sortedPrices = [...pricing.bulkPrices].sort(
      (a, b) => a.minQty - b.minQty
    );

    // Find the applicable price tier
    for (let i = sortedPrices.length - 1; i >= 0; i--) {
      if (totalQty >= sortedPrices[i].minQty) {
        resultIndex = i;
        break;
      }
    }

    if (offerPricing && offerPricing.pricingType === PricingType.BULK) {
      const minQtyOfResult = sortedPrices[resultIndex].minQty;
      const offerBulkPrices = offerPricing.bulkPrices.filter(
        (price) => price.minQty === minQtyOfResult
      );
      if (offerBulkPrices.length > 0) {
        return offerBulkPrices[0].price ?? null;
      }
    }

    // If no bulk tier matched, fallback to first tier
    return sortedPrices[resultIndex].price ?? null;
  }

  // For non-bulk pricing types
  const effectivePricing = offerPricing || pricing;

  switch (effectivePricing.pricingType) {
    case PricingType.FIXED:
      return effectivePricing.unitPrice;

    case PricingType.PRICE_RANGE:
      return [effectivePricing.minPrice, effectivePricing.maxPrice];

    default:
      return null;
  }
};

export const getAvailableAttributes = (
  variants: Variant[]
): VariantAttribute[] => {
  const availableVariants = variants.filter((v) => v.available);

  const attributeValueSets: Record<string, Set<string>> = {};

  for (const variant of availableVariants) {
    for (const [key, value] of Object.entries(variant.attributes)) {
      if (!attributeValueSets[key]) {
        attributeValueSets[key] = new Set();
      }
      attributeValueSets[key].add(value);
    }
  }

  const availableAttributes: VariantAttribute[] = Object.entries(
    attributeValueSets
  ).map(([key, valueSet]) => ({
    key,
    values: Array.from(valueSet),
  }));

  return availableAttributes;
};
