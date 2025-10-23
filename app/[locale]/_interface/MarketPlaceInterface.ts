import { CountryOfOrigin } from "@/app/[locale]/(pages)/app/(sales)/sales-product/form/(forms)/ProductInformation";
import {
  countryCodesInterface,
  IndustryInterface,
} from "@/app/[locale]/_interface/BusinessProfile";
import { productCategory } from "../_models/sales/product";
import { OfferType } from "../_models/sales/sellOffer";
import {
  Currency,
  DispatchLeadTime,
  ProductionLeadTime,
  ProductPricing,
} from "./SalesProductInterface";
// import { PricingType } from "@/app/[locale]/_models/StoreFront";

export interface SelectedFilterObjectInterface {
  key: string;
  type: string;
  value: any;
}
export interface SelectedFilterListItemInterface {
  key: string;
  id?: string | number;
  title: string;
  parentIndex: number;
  childIndex: number;
  selected?: boolean;
  name?: string;
}
export interface ProductImage {
  src: string;
  alt: string;
  exten: string;
  size: number;
}

export interface Country {
  name: string;
  code: string;
}

export interface UserInfo {
  verification: string;
  years: number;
  businessName: string;
}

export interface BusinessInfo {
  businessLocation: Country;
  businessName: string;
  kybVerification: boolean;
  kycVerified: boolean;
  uboVerification: boolean;
  years: number;
  subDomain: string;
  isCatalogPublished: boolean;
}
export interface ProductListInterface {
  productName: string;
  productImage: Array<ProductImage>;
  category: productCategory;
  subCategory: productCategory;
  pricing: ProductPricing;
  currency: Currency;
  countryOfOrigin: Country;
  userInfo: UserInfo;
  minOrderQuantity: number;
  moqUnit: string;
  activeOffer: OfferInfo;
  liveUrl: string;
  brandName: string;
  stockAvailability: "inStock" | "outOfStock";
  productionLeadTime: ProductionLeadTime;
  dispatchLeadTime: DispatchLeadTime;
  analytics: {
    shares: number;
    views: number;
    clicks: number;
    likes: number;
  };
  businessInfo: BusinessInfo;
}

export interface trendingTabs {
  mostViewed: number;
  recentlyListed: number;
  topExportInterest: number;
}
export interface supplierInfo {
  verification: string;
  topManufacture: boolean;
  years: string;
  businessName: string;
  country: string;
}

export interface SupplierImage {
  productName: string;
  products: Array<ProductImage>;
}
export interface SupplierListInterface {
  userInfo: supplierInfo;
  products: Array<SupplierImage>;
}

export interface SupplierInfo {
  companyLogo: ProductImage;
  businessName: string;
  years: number;
  kycVerified: boolean;
  kybVerification: boolean;
  businessLocation: Country;
  uboVerification?: boolean;
}
export interface SupplierListItemInterface {
  _id: string;
  years: string;
  businessName: string;
  topProducts: TopProduct[];
  businessLocation: Country;
  subDomain: string;
  isCatalogPublished: boolean;
  companyLogo: ProductImage;
  kycVerified: boolean;
  kybVerification: boolean;
  uboVerification?: boolean;
  country?: string;
  businessTypeSpecific: string[];
  mainProducts: string[];
  mainMarkets: CountryOfOrigin[];
  contractManufacturing: string[];
  noOfEmployees: string;
}

export interface TopProduct {
  productName: string;
  image: ProductImage;
}

export interface BulkPrice {
  minQty: number;
  maxQty: number;
  price: number;
}

export interface OfferInfo {
  offerInfo: {
    offerType: OfferType;
    discountPercent?: number;
    minQty?: number;
    maxQty?: number;
    unit: string;
    currency?: Currency;
    pricing?: ProductPricing;
    buyQty?: number;
    freeQty?: number;
  };
  expires?: Date;
  validOffer: boolean;
  isApproved: boolean;
}
export interface DealCardInterface {
  productName: string;
  productImage: Array<ProductImage>;
  currency: Currency;
  pricing: ProductPricing;
  activeOffer: OfferInfo;
  minOrderQuantity: number;
  unit: string;
}

export type ProductDetailQueryArg = {
  productId: string;
  currencyCode: string;
};

export interface MarketApiQueryInterface {
  category_id?: string[];
  subCategory_id?: string[];
  productCategory_id?: string[];
  specificSort?: string;
  filterBy?: Record<string, any>;
  page?: number;
  limit?: number;
  currencyCode?: string;
  productSearch?: string;
  similarTo?: string;
  productOf?:string;
}

export interface FiltersListQuery {
  type: FiltersModuleTypes;
  mappedId?: string;
}

export interface FiltersValue<T = any> {
  key: string;
  title: string;
  value: Array<any> | T;
  type: string;
}

export interface PriceRangeInterface {
  minPriceRange: number;
  maxPriceRange: number;
  step: number;
  minPrice?: number;
  maxPrice?: number;
}

// export type FiltersModuleTypes = "Products" | "Suppliers" | "RFQ" | "Offers";

export enum FilterModuleEnum {
  PRODUCTS = "Products",
  SUPPLIERS = "Suppliers",
  RFQ = "RFQ",
  OFFERS = "Offers",
}

export type FiltersModuleTypes = `${FilterModuleEnum}`;

export type ProductSortingItemInterface = {
  name: string;
  value: string;
};
export interface FilterQueryPayload {
  type: FiltersModuleTypes;
  value: Array<SelectedFilterObjectInterface>;
}

export interface FilterQueryObject {
  [FilterModuleEnum.PRODUCTS]: FiltersValue[];
  [FilterModuleEnum.OFFERS]: FiltersValue[];
  [FilterModuleEnum.RFQ]: FiltersValue[];
  [FilterModuleEnum.SUPPLIERS]: FiltersValue[];
}
export interface UserInfo {
  year: string;
  businessName: string;
  address: {
    country: string;
    streetAddress: string;
    apartmentUnitOrOther: string;
    cityTown: string;
    postalCode: string;
  };
}
export interface RfqData {
  productName: string;
  productDescription: string;
  productImageSrc: ProductImage;
  createdAt: string;
  validityDate: Date;
  currency: Currency;
  totalOrderQuantity: {
    orderedQuantity: number;
    orderedUnit: string;
  };
  estOrderQuantity: {
    quantity: number;
    unit: string;
  };
  type: string;
  preferredUnitPrice: {
    priceRange: {
      minPrice: number;
      maxPrice: number;
    };

    currency: Currency;
  };
  pricing: ProductPricing;
  preferredSourcingRegion: string;
  expectedDeliveryTime: string;
  destinationPort: string;
  supplyContractType: string;
  paymentTerms: string;
  sampleRequired: boolean;
  customizationRequired: boolean;
  rfqTitle: string;
  userInfo: UserInfo;
  additionalBuyingReqDetails: string;
  businessInfo: {
    subDomain: string;
    isCatalogPublished: boolean;
    years: number;
    kycVerified: boolean;
    kybVerification: boolean;
    uboVerification: boolean;
    businessLocation: Country;
    businessName: boolean;
    businessTypeSpecific: string[];
    industry: IndustryInterface;
    businessAddress: {
      addressLine: string;
      city: string;
      state: string;
      pincode: string;
      country: countryCodesInterface;
    };
  };
}

export enum EndorsementFlagEnum {
  UNVERIFIED_PURCHASE = "unverified_purchase",
  VERIFIED_PURCHASE = "verified_purchase",
  ENDORSED_BY_BUYER = "endorsed_by_buyer",
}

//Sort Interfaces
export enum ProductSortByEnum {
  NewlyAdded = "newlyAdded",
  PriceDrop = "priceDrop",
  MostViewed = "mostViewed",
  MostInquired = "mostInquired",
  ExportInterest = "exportInterest",
  RecentlyListed = "recentlyListed",
  None = "",
}

export enum SupplierSortByEnum {
  HighlyEngaged = "highlyEngaged",
  RecentlyAdded = "recentlyAdded",
  MostRecommended = "mostRecommended",
  TopManufacturer = "topManufacturer",
  None = "",
}

export enum RFQSortByEnum {
  Price = "price",
  DatePosted = "datePosted",
  EstimatedQuantity = "estimatedQuantity",
  None = "",
}

export enum OffersSortByEnum {
  HighToLow = "highToLow",
  LowToHigh = "lowToHigh",
  Recommended = "recommended",
  None = "",
}

export type ProductSortBy = `${ProductSortByEnum}`;
export type SupplierSortBy = `${SupplierSortByEnum}`;
export type RfqSortBy = `${RFQSortByEnum}`;
export type OfferSortBy = `${OffersSortByEnum}`;
export interface ProductSupplierListInterface {
  productSort: ProductSortBy;
  supplierSort: SupplierSortBy;
}

export interface SearchProductResult {
  _id: string;
  productName: string;
  productImage: Array<ProductImage>;
  category: productCategory;
  subCategory: productCategory;
  liveUrl: string;
  uniqueId: string;
}

export interface SearchProductsResponse {
  listData: SearchProductResult[];
  totalPages: number;
  currentPage: number;
  totalListCount: number;
}
export interface ProductCategoryListInterface {
  
  subCategory_id?: string;
  page?: number;
  limit?: number;
}
export interface OfferDiscountListInterface {
  _id: string;
  productName: string;
  productImage: Array<ProductImage>;
  category: productCategory;
  subCategory: productCategory;
  liveUrl: string;
  currency: {
    code: string;
    name: string;
    symbol: string;
  };
  pricing: {
    pricingType: string;
    unitPrice: number;
  };
  minOrderQuantity: number;
  moqUnit: string;
  activeOffer: {
    offerId: string;
    offerInfo: {
      discountPercent: number;
      minQty: number;
      maxQty: number;
      unit: string;
      currency: {
        code: string;
        name: string;
        symbol: string;
      };
      offerType: string;
      pricing: {
        pricingType: string;
        unitPrice: number;
      };
    };
    expires: string;
    validOffer: boolean;
    isApproved: boolean;
  };
  businessInfo: {
    kycVerified: boolean;
    kybVerification: boolean;
    uboVerification: boolean;
  };
}
