import { FixedPricing } from "@/app/[locale]/_interface/SalesProductInterface";

export enum PreferredSourcingRegion {
  Nearby = "Nearby",
  WithinMyCountry = "Within My Country",
  International = "International",
}

export enum PaymentTerms {
  AdvanceBalance = "Advance + Balance on Dispatch",
  Net30 = "Net 30",
  Net60 = "Net 60",
  Net90 = "Net 90",
  LC = "LC (Letter of Credit)",
  Other = "Other",
}

export enum ShippingMethod {
  Sea = "Sea",
  Air = "Air",
  Road = "Road",
  Rail = "Rail",
  Courier = "Courier",
  BuyerArranged = "Buyer-Arranged",
  LocalDelivery = "Local-Delivery",
  Others = "Others",
}

export enum SourcingFrequency {
  OneTime = "One time",
  Weekly = "Weekly",
  Every2Weeks = "Every 2 Weeks",
  Monthly = "Monthly",
  Every3Months = "Every 3 Months",
  Every6Months = "Every 6 Months",
  Yearly = "Yearly",
}

export enum DeliveryTimeType {
  Express = "Express",
  Standard = "Standard",
  Flexible = "Flexible / Negotiable",
}

export interface Category {
  _id: string;
  name: string;
}

export interface SubCategory {
  _id: string;
  name: string;
}

export interface ProductCategory {
  _id?: string;
  name: string;
}

export interface SuggestCategory {
  industry?: string;
  reason?: string;
  suggestedCategory?: string;
}

export interface Currency {
  code: string;
  name: string;
  symbol: string;
}

export interface RangePrice {
  maxPrice: number;
  minPrice: number;
}

export interface PreferredUnitPrice {
  currency: Currency;
  priceRange: RangePrice;
}

export interface EstOrderQuantity {
  quantity: number;
  unit: string;
}

export interface RangeQuantity {
  min: number;
  max: number;
  unit: string;
}

export interface RangePriceWithCurrency {
  priceRange: RangePrice;
  currency: Currency;
}

export interface AnnualPurchaseVolume {
  min?: string;
  max?: string;
}

export interface ProductImage {
  src: string;
  alt: string;
  exten: string;
  size: number;
}
export type listStatusIntersection = "" | "draft" | "archive";

export interface ListInterface {
  sortBy: string;
  sortOrder?: number;
  limit?: number;
  page: number;
  searchQuery?: string;
  isArchived?: boolean;
  isDraft?: boolean;
  status?: BuyingRequestApprovalStatus;
  itemStatus?: listStatusIntersection;
}

export interface BuyingRequestListResponse {
  listData: listData;
  totalItems: number;
  totalDrafted: number;
  totalArchived: number;
}
export interface listData {
  result: BuyingRequestListItem[];
  totalPages: number;
  currentPage: number;
  totalListCount: number;
}

export interface PostBuyingRequest {
  productName: string;
  productDescription: string;
  category?: Category;
  subCategory?: SubCategory;
  productCategory?: ProductCategory;
  categorySuggestion?: SuggestCategory;
  estOrderQuantity: EstOrderQuantity;
  preferredUnitPrice: PreferredUnitPrice;
  deliveryDate?: Date;
  deliveryType: DeliveryTimeType;
  preferredSourcingRegion: PreferredSourcingRegion;
  paymentTerms: PaymentTerms;
  shippingMethod: ShippingMethod;
  sourcingFrequency: SourcingFrequency;
  isSampleRequired?: boolean;
  isPrivate?: boolean;
  productImages?: ProductImage[];
  annualPurchaseVolume?: AnnualPurchaseVolume;
  additionalInformation?: string;
}

export interface BuyingRequestDetails {
  _id: string;
  rfqId: string;
  productName: string;
  productDescription: string;
  category?: Category;
  subCategory?: SubCategory;
  productCategory?: ProductCategory;
  estOrderQuantity: EstOrderQuantity;
  preferredUnitPrice: PreferredUnitPrice;
  validityDate: string;
  productImage?: ProductImage[];
  preferredSourcingRegion?: PreferredSourcingRegion;
  preferredSourcingCountry?: string;
  preferredSourcingCity?: string;
  expectedDeliveryTime?: DeliveryTimeType;
  destinationPort?: string;
  supplyContractType?: string;
  paymentTerms?: PaymentTerms;
  shippingMethod?: ShippingMethod[];
  sampleRequired?: boolean;
  customizationRequired?: boolean;
  rfqTitle: string;
  leads: string[];
  analytics: {
    impressions: number;
    views: number;
    quotesReceivedCount: number;
    _id: string;
  };
  userInfo: {
    year: string;
    verification: string;
  };
  createdAt: string;
  status: BuyingRequestApprovalStatus;
  pricing: FixedPricing;
}
export interface CreateBuyingRequest {
  productName: string;
  productDescription?: string;
  additionalBuyingReqDetails?: string;
  category?: Category;
  subCategory?: SubCategory;
  productCategory?: ProductCategory;
  categorySuggestion?: SuggestCategory;
  estOrderQuantity: EstOrderQuantity;
  preferredUnitPrice: PreferredUnitPrice;
  validityDate: Date;
  productImage?: ProductImage[];
  preferredSourcingRegion?: PreferredSourcingRegion;
  preferredSourcingCountry?: string;
  preferredSourcingCity?: string;
  expectedDeliveryTime?: DeliveryTimeType;
  destinationPort?: string;
  supplyContractType?: string;
  paymentTerms?: PaymentTerms;
  shippingMethod?: ShippingMethod[];
  annualPurchaseVolume?: AnnualPurchaseVolume;
  sourcingFrequency?: SourcingFrequency;
  sampleRequired?: boolean;
  customizationRequired?: boolean;
  customizationDetails?: string;
  rfqTitle: string;
  isDraft: boolean;
}
export enum BuyingRequestApprovalStatus {
  Draft = "Draft",
  // Approval="approval",
  PENDING = "Approval Pending",
  Active = "Active",
  Awaiting_Response = "Awaiting Response",
  Quotes_Received = "Quotes Received",
}
export interface TotalOrderQuantity {
  orderedQuantity: number;
  orderedUnit: string;
}
export interface BuyingRequestListItem {
  _id: string;
  rfqId: string;
  productName: string;
  productDescription: string;
  estOrderQuantity: RangeQuantity;
  preferredUnitPrice: RangePriceWithCurrency;
  leads: string[];
  quotesReceived: string[];
  validityDate: string;
  status: BuyingRequestApprovalStatus;
  isArchived: boolean;
  createdAt: string;
  categoryName: string;
  productImageSrc: string;
  pricing: FixedPricing;
  totalOrderQuantity: TotalOrderQuantity;
}

export interface RFQErrorInterface {
  data: {
    statusCode: number;
    message: string;
    error: string;
    errorCode: number;
  };
}
