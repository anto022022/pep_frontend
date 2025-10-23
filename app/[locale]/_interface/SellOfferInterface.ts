import { UploadedImage } from "../(pages)/app/(sales)/sales-product/form/(forms)/ProductInformation";
import { PricingType } from "../_models/StoreFront";
import {
  BulkPrice,
  CategorySuggestion,
  Currency,
  listData,
  ProductPricing,
  SubCategory,
} from "./SalesProductInterface";
export enum OfferType {
  FIXED_DISCOUNT = "fixedDiscount",
  LIMITED_TIME = "limitedTime",
  LOW_MOQ = "lowMOQ",
  BUY_MORE = "buyMore",
}

export enum OfferTypeEnum {
  fixedDiscount = "salesOffer.optionLabels.offerType.fixedDiscount",
  limitedTime = "salesOffer.optionLabels.offerType.limitedTime",
  lowMOQ = "salesOffer.optionLabels.offerType.lowMOQ",
  buyMore = "salesOffer.optionLabels.offerType.buyMore",
}
export interface OfferInfo {
  offerType: OfferType;
  discountPercent?: number;
  minQty?: number;
  maxQty?: number;
  unit: string;
  currency?: Currency;
  pricing?: {
    pricingType: PricingType;
    unit?: string;
    unitPrice?: number;
    minPrice?: number;
    maxPrice?: number;
    bulkPrices?: BulkPrice[];
  };
  buyQty?: number;
  freeQty?: number;
}
export interface CountryOfOrigin {
  name: string;
  code: string;
}

export interface SalesOffersListResponse {
  // portOfDispatch: string;
  listData: listData;
  totalItems: number;
  totalDrafted: number;
  totalArchived: number;
}

export interface SellOfferPreviewData {
  //   productImage: UploadedImage[];
  //   currency: string;
  //   productDescription?: string;
  //   productName?: string;
  //   category?: SubCategory;
  //   subCategory?: SubCategory;
  //   productCategory?: SubCategory;
  //   minOrderQuantity?: number;
  //   detailedDescription?: string;
  //   moqUnit?: string;
  //   brandName?: string;
  offerType?: OfferType;
  offerTitle?: string;
  offerDescription?: string;
  offerInfo: OfferInfo;
  offerStartDate: string;

  productDetails: {
    productImage: UploadedImage[];
    currency: Currency;
    productDescription?: string;
    productName?: string;
    category?: SubCategory;
    subCategory?: SubCategory;
    categorySuggestion?: CategorySuggestion;
    productCategory?: SubCategory;
    minOrderQuantity?: number;
    detailedDescription?: string;
    moqUnit?: string;
    pricing: ProductPricing;

    brandName?: string;
  };
  offerEndDate: string;
  marketFocus: CountryOfOrigin[];
  dispatchLeadTime: {
    min_day: number | null;
    max_day: number | null;
  };
  internationalShipping: string;
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
  paymentTerms: [];
  shippingMethod?: string[];
  sellOfferStage: any;
  status: string;
  analytics: {
    shares: number;
    views: number;
    clicks: number;
    likes: number;
  };
}
