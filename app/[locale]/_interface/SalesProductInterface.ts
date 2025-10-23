import {
  OfferInfo,
  ProductImage,
} from "@/app/[locale]/_interface/MarketPlaceInterface";
import { PricingType } from "@/app/[locale]/_models/StoreFront";
import { ProductVideo } from "../(pages)/app/(sales)/sales-product/form/(forms)/AdditionalDetails";
import { Variant } from "../(pages)/app/(sales)/sales-product/form/(forms)/AttributesVariants";
import { productBrochure } from "../(pages)/app/(sales)/sales-product/form/(forms)/ProductInformation";
import {
  SampleAvailabilityType,
  sampleLeadTime,
} from "../(pages)/app/(sales)/sales-product/form/(forms)/ProductionAndStock";
import { CategoriesListInterface } from "./common";

export interface SalesProductListInterface {
  sortBy: string;
  sortOrder?: number;
  limit?: number;
  page: number;
  searchQuery?: string;
  itemStatus?: listStatusIntersection;
}

export type listStatusIntersection = "" | "draft" | "archive";

export interface SalesProductListResponse {
  // portOfDispatch: string;
  listData: listData;
  totalItems: number;
  totalDrafted: number;
  totalArchived: number;
}

export interface DropdownlistInterface {
  searchQuery?: string;
  page: number;
}
export interface listData {
  result: any[];
  totalPages: number;
  currentPage: number;
  totalListCount: number;
}

export interface listCounts {
  totalArchived?: number;
  totalDrafted?: number;
  totalItems?: number;
}

export interface Fob {
  fobMinPrice?: number;
  fobMaxPrice?: number;
  fobUnit?: string;
}
export interface FAQ {
  question: string;
  answer: string;
}

export interface AttributeValue {
  name: string;
  isSelected: boolean;
  isRemoved: boolean;
}
export interface Attribute {
  key: string;
  values: AttributeValue[];
}

export interface VariantAttribute {
  key: string;
  values: string[];
}

// export interface Variant {
//   _id: string;
//   variantName: string;
//   variantImg: UploadedImage[];
//   price: number;
//   minPrice: number;
//   maxPrice: number;
//   attributes: Record<string, string>;
//   available: boolean;
//   isDeleted: boolean;
//   isActive: boolean;
// }
export interface Slab {
  slabMinQty?: number;
  slabMaxQty?: number;
  slabPrice?: number;
}

export interface ProductCapacityPricing {
  quantity?: number;
  unit?: string;
  duration?: string;
}
export interface SubCategory {
  _id: string;
  name: string;
  uniqueId: string;
}
export interface CategorySuggestion {
  industry: string;
  reason: string;
  suggestedCategory: string;
}
export interface ProductCategory {
  _id: string;
  name: string;
}
export interface ProductStage {
  ProductInformation: "completed" | "active" | "pending";
  DescriptiveMedia: "completed" | "active" | "pending";
  Pricing: "completed" | "active" | "pending";
  DescriptionSpecification: "completed" | "active" | "pending";
  AttributesVariants: "completed" | "active" | "pending";
  AvailableOrigin: "completed" | "active" | "pending";
  PaymentDelivery: "completed" | "active" | "pending";
  ShippingDetails: "completed" | "active" | "pending";
  AdditionalDetails: "completed" | "active" | "pending";
}
export interface ProductionLeadTime {
  min_day: number | undefined;

  max_day?: number;

  min_quantity?: number;

  max_quantity?: number;

  unit?: string;
}

export interface DispatchLeadTime {
  min_day: number | null;
  max_day: number | null;
}
export class Certificates {
  name?: string;
  src?: string;
  alt?: string;
  exten?: string;
  size?: number;
}
export interface GlobalRatings {
  totalRatings: number;
  averageRating: number;
}
export interface PreviewData {
  // [x: string]: string;
  _id: string;
  productImage: ProductImage[];
  skuCode: string;
  currency: Currency;
  productDescription?: string;
  attributes?: Attribute[];
  productName?: string;
  category?: SubCategory;
  categorySuggestion?: CategorySuggestion;
  subCategory?: SubCategory;
  productCategory?: SubCategory;
  minOrderQuantity?: number;
  detailedDescription?: string;
  moqUnit?: string;
  dispatchLeadTime: DispatchLeadTime;
  productBrochure?: productBrochure;
  pricing: ProductPricing;
  productApplications?: string;
  variantAttributes?: VariantAttribute[];
  variants?: Variant[];
  productionCapacity: ProductCapacityPricing;
  stockAvailability?: "inStock" | "outOfStock";
  countryOfOrigin?: object;
  samplesAvailable: boolean;
  samplesFree: boolean;
  samplePrice: number;
  sampleQuantity: number;
  sampleUnit: string;
  paymentMethods?: (
    | "credit"
    | "cash"
    | "cheque"
    | "demandDraft"
    | "paypal"
    | "moneyGram"
    | "westerUnion"
    | "others"
  )[];
  shippingType?: "Standard Shipping" | "Express Shipping";
  shippingMethod?: string[];
  deliveryTime?: string;
  portOfDispatch?: string;
  packagingDetails?: string;
  additionalInfo?: string;
  faqs: FAQ[];
  productGroup?: string;
  productStage: Record<string, string>;
  productKeyword: Array<string>;
  productionLeadTime: ProductionLeadTime;
  samplesAvailability: {
    availabilityType: SampleAvailabilityType;
    samplePrice?: number;
    sampleUnit?: string;
    sampleLeadTime?: sampleLeadTime;
  };
  paymentTerms: string;
  incoTerms: string;
  shippingUnit: string;
  shippingQty: number;
  shipmentIdentifier: string;
  internationalShipping: string;
  businessOf:string;
  brandName: string;
  productVideo: ProductVideo;
  youtubeUrl: string;
  certificates: Certificates[];
  isCustomizable: boolean;
  customization: string[];
  uniqueId: string;
  globalRatings: GlobalRatings;
  activeOffer: OfferInfo;
  status: string;
  leadsReceived:number;
  analytics: {
    shares: number;
    views: number;
    clicks: number;
    likes: number;
  };
}

export interface AiCategorySelectInterface {
  category: CategoriesListInterface | undefined;
  subCategory: CategoriesListInterface | undefined;
  productCategory: CategoriesListInterface | undefined;
  value?: string;
}

export interface SuggestCategory {
  industry: string;
  reason: string;
  suggestedCategory: string;
}

export enum StockAvailabilityEnum {
  // inStock = "salesProduct.optionLabels.stockAvailability.inStock",
  inStock = "In stock",
  outOfStock = "Out of stock",
  // outOfStock = "salesProduct.optionLabels.stockAvailability.outOfStock",
}

export interface Pricing {
  pricingType: PricingType;
}

export interface FixedPricing extends Pricing {
  pricingType: PricingType.FIXED;
  unitPrice: number;
}

export interface PriceRangePricing extends Pricing {
  pricingType: PricingType.PRICE_RANGE;
  minPrice: number;
  maxPrice: number;
}

export interface BulkPrice {
  minQty: number;
  maxQty: number;
  price: number;
}

export interface BulkPricing extends Pricing {
  pricingType: PricingType.BULK;
  unit: string;
  bulkPrices: BulkPrice[];
}

export interface NegotiablePricing extends Pricing {
  pricingType: PricingType.NEGOTIABLE;
}

export interface QuotePricing extends Pricing {
  pricingType: PricingType.REQUEST_QUOTE;
}

export type ProductPricing =
  | FixedPricing
  | PriceRangePricing
  | BulkPricing
  | NegotiablePricing
  | QuotePricing;

export interface Currency {
  code: string;
  name: string;
  symbol: string;
}
