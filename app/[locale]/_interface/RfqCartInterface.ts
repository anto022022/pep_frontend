import { Variant } from "@/app/[locale]/(pages)/app/(sales)/sales-product/form/(forms)/AttributesVariants";
import {
  BusinessInfo,
  OfferInfo,
  ProductImage,
} from "@/app/[locale]/_interface/MarketPlaceInterface";
import {
  Currency,
  DispatchLeadTime,
  ProductionLeadTime,
  ProductPricing,
} from "@/app/[locale]/_interface/SalesProductInterface";

export interface SelectedVariants {
  _id: string;
  quantity: number;
  isSelected?: boolean;
}

export interface RFQListQuery {
  rfqType: string;
  currencyCode: string;
}

export interface RFQCartItem {
  _id: string;
  variants: Variant[];
  productInfo: {
    _id: string;
    productName: string;
    pricing: ProductPricing;
    productImage: ProductImage[];
    minOrderQuantity: number;
    moqUnit: string;
    productionLeadTime: ProductionLeadTime;
    dispatchLeadTime: DispatchLeadTime;
    stockAvailability: "outOfStock" | "inStock";
    currency: Currency;
    activeOffer?: OfferInfo;
  };
  totalOrderQuantity: number;
  selectedVariants: SelectedVariants[];
  productCreator: {
    businessName: string;
    country: string;
    years: number;
  };
  category: string;
  businessInfo:BusinessInfo;
}
