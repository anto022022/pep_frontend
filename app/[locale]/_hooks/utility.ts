import { StageStatusType } from "@/app/[locale]/_interface/OnboardInterface";
import {
  Variant,
  VariantAttribute,
} from "../(pages)/app/(sales)/sales-product/form/(forms)/AttributesVariants";
import {
  currencyList,
  paymentMethodsData,
  PricingType,
  shippingMethodsData,
  shippingType,
} from "../_models/StoreFront";

export const getImageUrl = (path: string) =>
  `${
    process.env.NEXT_PUBLIC_BUCKET_URL ||
    "https://pepupload.s3.ap-southeast-1.amazonaws.com/"
  }${path}`;

export function getShippingNameByValue(value: string): string | undefined {
  const found = shippingType.find((item) => item.value === value);
  return found?.name;
}

export const getPaymentLabelById = (id: string): string | undefined => {
  const method = paymentMethodsData.find((item) => item.id === id);
  return method?.label;
};

export const getShippmentMethodLableById = (id: string) => {
  const method = shippingMethodsData.find((item) => item.id === id);
  return method?.label;
};

export const getSymbolFromCode = (code: string) => {
  const data = currencyList.find((item) => item.code === code);
  return data?.symbol;
};

export function validateVariantsAttributes(
  variantAttributes: VariantAttribute[]
) {
  return variantAttributes.filter(
    (attr) =>
      !(attr.isEditing || attr.key.trim() === "" || attr.values.length === 0)
  );
}

export function generateVariants(
  variantAttributes: VariantAttribute[],
  pricingType: PricingType
): Variant[] {
  if (variantAttributes.length === 0) return [];

  const getDefaultPricing = (): Variant["pricing"] => {
    switch (pricingType) {
      case PricingType.FIXED:
        return {
          pricingType: PricingType.FIXED,
          unitPrice: undefined as unknown as number,
        };
      case PricingType.BULK:
        return {
          pricingType: PricingType.BULK,
          bulkPrices: [
            {
              unit: "",
              minQty: undefined as unknown as number,
              maxQty: undefined as unknown as number,
              price: undefined as unknown as number,
            },
          ],
        };
      case PricingType.PRICE_RANGE:
        return {
          pricingType: PricingType.PRICE_RANGE,
          minPrice: undefined as unknown as number,
          maxPrice: undefined as unknown as number,
        };
      case PricingType.NEGOTIABLE:
        return {
          pricingType: PricingType.NEGOTIABLE,
        };
      case PricingType.REQUEST_QUOTE:
        return {
          pricingType: PricingType.REQUEST_QUOTE,
        };
      default:
        return {
          pricingType,
        };
    }
  };

  const cartesian = (
    attrs: VariantAttribute[],
    index = 0,
    current: Record<string, string> = {}
  ): Variant[] => {
    if (index === attrs.length) {
      const variantName = Object.values(current).join(" / ");
      return [
        {
          variantName,
          variantImg: [],
          attributes: { ...current },
          available: false,
          pricing: getDefaultPricing(),
          skuCode: "",
          minOrderQuantity: undefined as unknown as number,
          moqUnit: "",
        },
      ];
    }

    const attribute = attrs[index];
    const variants: Variant[] = [];

    for (const value of attribute.values) {
      variants.push(
        ...cartesian(attrs, index + 1, { ...current, [attribute.key]: value })
      );
    }

    return variants;
  };

  return cartesian(variantAttributes);
}

export function updateVariants(
  prevVariants: Variant[],
  variantAttributes: VariantAttribute[],
  pricingType: PricingType
): Variant[] {
  const allGeneratedVariants = generateVariants(variantAttributes, pricingType);

  const newVariants: Variant[] = [];

  for (const variant of allGeneratedVariants) {
    const existing = prevVariants.find(
      (v) => JSON.stringify(v.attributes) === JSON.stringify(variant.attributes)
    );

    if (existing) {
      // Keep existing data (price, images, etc.)
      newVariants.push(existing);
    } else {
      // New variant
      newVariants.push(variant);
    }
  }

  return newVariants;
}

export const groupByAttribute = (
  data: Variant[],
  attribute: string,
  groupSearch: string = ""
) => {
  return data.reduce((acc: Record<string, Variant[]>, variant, index) => {
    const { attributes } = variant;
    const key = variant.attributes[attribute] || "Unknown";

    // If groupSearch is set, skip groups that don't match the search string
    if (groupSearch && !key.toLowerCase().includes(groupSearch.toLowerCase())) {
      return acc;
    }

    const otherValues =
      Object.entries(attributes)
        .filter(([attrKey]) => attrKey !== attribute)
        .map(([, value]) => value)
        .join("/") || "";

    if (!acc[key]) {
      acc[key] = [];
    }
    acc[key].push({ ...variant, index, displayName: otherValues });

    return acc;
  }, {});
};

export function getOriginalPrice(
  offerPrice: number,
  discountPercent: number
): number {
  if (discountPercent >= 100) {
    throw new Error("Discount percent cannot be 100% or more");
  }

  const originalPrice = offerPrice / (1 - discountPercent / 100);
  return parseFloat(originalPrice.toFixed(2)); // rounded to 2 decimal places
}

export function encodeQuery(data: any) {
  return encodeURIComponent(JSON.stringify(data));
}

export function parseCategoryString(category: string): {
  name: string;
  id: string;
} {
  if (!category || typeof category !== "string") {
    return { name: "", id: "" };
  }

  const parts = category.split("-");
  const id = parts.pop() || "";
  const name = parts.join(" ");

  return { name, id };
}

export function getActiveStageKey<T extends Record<string, StageStatusType>>(
  stage: T
): string | undefined {
  return Object.keys(stage).find((key) => stage[key as keyof T] === "active");
}

export const capitalizeFirstLetter = (str: string) =>  (str?.charAt(0)?.toUpperCase() + str?.slice(1));

export function toCamelCase(str: string): string {
  return str
  .toLowerCase()
  .replace(/\b\w/g, (char) => char.toUpperCase());
}

// Utility function to format payment amounts with proper separation
export const formatPayment = (amount: string | number, currencySymbol: string) => {
  const numericAmount = typeof amount === 'string' ? parseInt(amount, 10) : amount;
  
  // Use US formatting for $ symbol, Indian formatting for others
  const locale = currencySymbol === '$' ? 'en-US' : 'en-IN';
  const formattedAmount = numericAmount.toLocaleString(locale, {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  });
  
  return {
    symbol: currencySymbol,
    amount: formattedAmount,
    formatted: `${currencySymbol}${formattedAmount}`
  };
};