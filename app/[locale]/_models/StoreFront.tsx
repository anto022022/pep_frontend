"use client";
import {
  AirIcon,
  BulkBuyerIcon,
  BusinessProfileIcon,
  CashIcon,
  CatalogIcon,
  ChequeIcon,
  CreditCardIcon,
  DemandCraftIcon,
  MoneyGramIcon,
  MypeppagoraIcon,
  PaypalIcon,
  RoadIcon,
  SalesIcon,
  ShipIcon,
  SourcingIcon,
} from "../_components/Icons/SVGIcons";
import { CustomerLifeCycle } from "../_interface/CustomerInterface";
import { OfferType } from "./sales/sellOffer";

export type LocaleType = "en" | "ar";

export interface multilangualInterface {
  en: string;
  ar: string;
}

export const sidebarNav = [
  {
    section: "sidebar.connect",
    items: [
      { title: "sidebar.myPepagora", path: "/app", icon: <MypeppagoraIcon /> },
      // {
      //   title: "sidebar.oneInbox",
      //   path: "/app/one-inbox",
      //   icon: <OneInboxIcon />,
      // },
    ],
  },
  {
    section: "sidebar.manage",
    items: [
      {
        title: "sidebar.sales",
        path: "/app/sales",
        icon: <SalesIcon />,
        children: [
          { title: "sidebar.leads", path: "/app/leads" },
          { title: "sidebar.productISell", path: "/app/sales-product" },
          { title: "sidebar.sellOffer", path: "/app/sales-sell-offer" },
          // { title: "sidebar.crm", path: "/app/sales-crm" },
          // { title: "sidebar.quotations", path: "/app/sales-quotations" },
          // { title: "sidebar.customers", path: "/app/sales-customers" },
          { title: "sidebar.connect", path: "/app/sales-connect" },
        ],
      },
      {
        title: "sidebar.catalogWebsite",
        path: "/app/catalog",
        icon: <CatalogIcon />,
      },
      // {
      //   title: "sidebar.marketing",
      //   path: "/app/marketing",
      //   icon: <MarketingIcon />,
      // },
      {
        title: "sidebar.sourcing",
        path: "/app/sourcing",
        icon: <SourcingIcon />,
        children: [
          // { title: "sidebar.productISource", path: "/app/sourcing-product" },
          { title: "sidebar.rfq", path: "/app/sourcing-rfq" },
          // {
          //   title: "sidebar.purchaseOrder",
          //   path: "/app/sourcing-purchase-order",
          // },
          // { title: "sidebar.bills", path: "/app/sourcing-bills" },
          // { title: "sidebar.vendors", path: "/app/sourcing-vendors" },
        ],
      },
      // {
      //   title: "sidebar.analytics",
      //   path: "/app/analytics",
      //   icon: <AnalyticsIcon />,
      // },
    ],
  },
  {
    section: "sidebar.setup",
    items: [
      {
        title: "sidebar.businessProfile",
        path: "/app/business-profile",
        icon: <BusinessProfileIcon />,
      },
      // { title: "sidebar.media", path: "/app/media", icon: <MediaIcon /> },
    ],
  },
];

export interface Step {
  title: string;
  description?: string;
  status: string;
  value?: string;
  children?: ChildStep[];
}

export interface ChildStep {
  title: string;
  value: string;
  status: string;
}

export type StepperStatus = Record<string, "completed" | "active" | "pending">;

export enum ProductStageKey {
  ProductInformation = "ProductInformation",
  PricingAndMoq = "PricingAndMoq",
  Specification = "Specification",
  ProductDescription = "ProductDescription",
  ProductionAndStock = "ProductionAndStock",
  PaymentTerms = "PaymentTerms",
  ShippingDetails = "ShippingDetails",
  AdditionalDetails = "AdditionalDetails",
  DescriptiveMedia = "DescriptiveMedia",
}
export enum FreeCatalogStageKey {
  homepage = "homepage",
  products = "products",
}
export enum ProductOfferKey {
  ProductDetails = "ProductDetails",
  OfferDetails = "OfferDetails",
  PaymentShipping = "PaymentShipping",
}

export const stockAvailabilityOptions = [
  {
    name: "optionLabels.stockAvailability.inStock",
    value: "inStock",
  },
  {
    name: "optionLabels.stockAvailability.outOfStock",
    value: "outOfStock",
  },
];

export enum PaymentTerm {
  ADVANCE_100 = "ADVANCE_100",
  ADVANCE_50_DISPATCH_50 = "ADVANCE_50_DISPATCH_50",
  NET_30_60 = "NET_30_60",
  LC = "LC",
  ESCROW = "ESCROW",
  COD = "COD",
  CUSTOM = "CUSTOM",
}

export const paymentTermsOptions: { value: PaymentTerm; name: string }[] = [
  {
    value: PaymentTerm.ADVANCE_100,
    name: `optionLabels.paymentTerms.${PaymentTerm.ADVANCE_100}`,
  },
  {
    value: PaymentTerm.ADVANCE_50_DISPATCH_50,
    name: `optionLabels.paymentTerms.${PaymentTerm.ADVANCE_50_DISPATCH_50}`,
  },
  {
    value: PaymentTerm.NET_30_60,
    name: `optionLabels.paymentTerms.${PaymentTerm.NET_30_60}`,
  },
  {
    value: PaymentTerm.LC,
    name: `optionLabels.paymentTerms.${PaymentTerm.LC}`,
  },
  {
    value: PaymentTerm.ESCROW,
    name: `optionLabels.paymentTerms.${PaymentTerm.ESCROW}`,
  },
  {
    value: PaymentTerm.COD,
    name: `optionLabels.paymentTerms.${PaymentTerm.COD}`,
  },
  {
    value: PaymentTerm.CUSTOM,
    name: `optionLabels.paymentTerms.${PaymentTerm.CUSTOM}`,
  },
];
export const freeCatalogStepper = [
  {
    title: "freeCatalog.stepper.homepage.title",
    description: "freeCatalog.stepper.homepage.description",
    status: "pending",
    value: FreeCatalogStageKey.homepage,
  },
  {
    title: "freeCatalog.stepper.products.title",
    description: "freeCatalog.stepper.products.description",
    status: "pending",
    value: FreeCatalogStageKey.products,
  },
];
export const salesProductStepper = [
  {
    title: "salesProduct.stepper.productInformation.title",
    description: "salesProduct.stepper.productInformation.description",
    status: "pending",
    value: ProductStageKey.ProductInformation,
  },
  {
    title: "salesProduct.stepper.pricingAndMOQ.title",
    description: "salesProduct.stepper.pricingAndMOQ.description",
    status: "pending",
    value: ProductStageKey.PricingAndMoq,
  },
  {
    title: "salesProduct.stepper.productSpecifications.title",
    description: "salesProduct.stepper.productSpecifications.description",
    status: "pending",
    children: [
      {
        title: "salesProduct.stepper.specification",
        value: ProductStageKey.Specification,
        status: "pending",
      },
      {
        title: "salesProduct.stepper.productDescription",
        value: ProductStageKey.ProductDescription,
        status: "pending",
      },
    ],
  },
  {
    title: "salesProduct.stepper.tradeDetails.title",
    description: "salesProduct.stepper.tradeDetails.description",
    status: "pending",
    children: [
      {
        title: "salesProduct.stepper.productAndStock",
        value: ProductStageKey.ProductionAndStock,
        status: "pending",
      },
      {
        title: "salesProduct.stepper.paymentTerms",
        value: ProductStageKey.PaymentTerms,
        status: "pending",
      },
    ],
  },
  {
    title: "salesProduct.stepper.shippingAndLogistics.title",
    description: "salesProduct.stepper.shippingAndLogistics.description",
    status: "pending",
    value: ProductStageKey.ShippingDetails,
  },
  {
    title: "salesProduct.stepper.additionalInformation.title",
    description: "salesProduct.stepper.additionalInformation.description",
    status: "pending",
    value: ProductStageKey.AdditionalDetails,
  },
];

export const salesSellOfferStepper = [
  {
    title: "salesOffer.stepper.productDetails.title",
    description: "salesOffer.stepper.productDetails.description",
    value: ProductOfferKey.ProductDetails,
    status: "pending",
  },
  {
    title: "salesOffer.stepper.offerDetails.title",
    description: "salesOffer.stepper.offerDetails.description",
    value: ProductOfferKey.OfferDetails,
    status: "pending",
  },
  {
    title: "salesOffer.stepper.paymentAndShipping.title",
    description: "salesOffer.stepper.paymentAndShipping.description",
    value: ProductOfferKey.PaymentShipping,
    status: "pending",
  },
];

export const shippingType = [
  { name: "optionLabels.shippingType.standard", value: "standard" },
  { name: "optionLabels.shippingType.express", value: "express" },
];

export const supplyContractType = [
  { name: "optionLabels.supplyContractType.oneTime", value: "oneTime" },
  { name: "optionLabels.supplyContractType.longTerm", value: "longTerm" },
  { name: "optionLabels.supplyContractType.repeatOrder", value: "repeatOrder" },
  {
    name: "optionLabels.supplyContractType.fixedScheduleContract",
    value: "fixedScheduleContract",
  },
];
export const shippingMethodsData = [
  { id: "Sea", label: "optionLabels.shippingMethods.Sea", icon: <ShipIcon /> },
  { id: "Air", label: "optionLabels.shippingMethods.Air", icon: <AirIcon /> },
  {
    id: "Road",
    label: "optionLabels.shippingMethods.Road",
    icon: <RoadIcon />,
  },
  {
    id: "Rail",
    label: "optionLabels.shippingMethods.Rail",
    icon: <RoadIcon />,
  },
  {
    id: "Courier",
    label: "optionLabels.shippingMethods.Courier",
    icon: <AirIcon />,
  },
  {
    id: "Buyer-Arranged",
    label: "optionLabels.shippingMethods.Buyer-Arranged",
    icon: <ShipIcon />,
  },
  {
    id: "Local-Delivery",
    label: "optionLabels.shippingMethods.Local Delivery",
    icon: <RoadIcon />,
  },
];

export const paymentMethodsData = [
  {
    id: "credit",
    label: "optionLabels.paymentMethods.credit",
    icon: <CreditCardIcon />,
  },
  { id: "cash", label: "optionLabels.paymentMethods.cash", icon: <CashIcon /> },
  {
    id: "cheque",
    label: "optionLabels.paymentMethods.cheque",
    icon: <ChequeIcon />,
  },
  {
    id: "demandDraft",
    label: "optionLabels.paymentMethods.demandDraft",
    icon: <DemandCraftIcon />,
  },
  {
    id: "paypal",
    label: "optionLabels.paymentMethods.paypal",
    icon: <PaypalIcon />,
  },
  {
    id: "moneyGram",
    label: "optionLabels.paymentMethods.moneyGram",
    icon: <MoneyGramIcon />,
  },
  {
    id: "westerUnion",
    label: "optionLabels.paymentMethods.westerUnion",
    icon: <CreditCardIcon />,
  },
  {
    id: "others",
    label: "optionLabels.paymentMethods.others",
    icon: <CreditCardIcon />,
  },
];

export const currencyList = [
  { name: "currency.AED", code: "AED", symbol: "د.إ" },
  { name: "currency.INR", code: "INR", symbol: "₹" },
  { name: "currency.USD", code: "USD", symbol: "$" },
  { name: "currency.EUR", code: "EUR", symbol: "€" },
  { name: "currency.GBP", code: "GBP", symbol: "£" },
  { name: "currency.JPY", code: "JPY", symbol: "¥" },
  // { name: "currency.CNY", code: "CNY", symbol: "¥" },
];

export const unitOption = [
  {
    name: "optionLabels.unitOption.pieces",
    value: "pieces",
  },
  {
    name: "optionLabels.unitOption.boxes",
    value: "boxes",
  },
  {
    name: "optionLabels.unitOption.ton",
    value: "ton",
  },
  { name: "optionLabels.unitOption.sets", value: "sets" },
  { name: "optionLabels.unitOption.litres", value: "litres" },
  { name: "optionLabels.unitOption.kg", value: "kg" },
  { name: "optionLabels.unitOption.meter", value: "meter" },
  { name: "optionLabels.unitOption.dozen", value: "dozen" },
  { name: "optionLabels.unitOption.sqft", value: "sqft" },
  { name: "optionLabels.unitOption.cans", value: "cans" },
  { name: "optionLabels.unitOption.rolls", value: "rolls" },
  { name: "optionLabels.unitOption.coil", value: "coil" },
];

export const durationOption = [
  {
    name: "optionLabels.durationOption.weekly",
    value: "weekly",
  },
  {
    name: "optionLabels.durationOption.monthly",
    value: "monthly",
  },
  {
    name: "optionLabels.durationOption.Yearly",
    value: "yearly",
  },
];

export enum PricingType {
  FIXED = "fixed",
  PRICE_RANGE = "priceRange",
  BULK = "bulk",
  NEGOTIABLE = "negotiable",
  REQUEST_QUOTE = "requestQuote",
}

export const pricingOptions = [
  {
    name: "optionLabels.pricing.fixed_price",
    helper: "optionLabels.pricing.fixed_price_helper",
    value: PricingType.FIXED,
  },
  {
    name: "optionLabels.pricing.negotiable",
    helper: "optionLabels.pricing.negotiable_helper",
    value: PricingType.NEGOTIABLE,
  },
  {
    name: "optionLabels.pricing.bulk_pricing",
    helper: "optionLabels.pricing.bulk_pricing_helper",
    value: PricingType.BULK,
  },
  {
    name: "optionLabels.pricing.price_range",
    helper: "optionLabels.pricing.price_range_helper",
    value: PricingType.PRICE_RANGE,
  },
  {
    name: "optionLabels.pricing.request_quote",
    helper: "optionLabels.pricing.request_quote_helper",
    value: PricingType.REQUEST_QUOTE,
  },
];
export enum ShipInterNationalType {
  YES = "yes",
  NO = "no",
  UPON_REQUEST = "uponRequest",
}
export const internationalShipping = [
  {
    name: "fields.shipsInternationally.yes",
    value: ShipInterNationalType.YES,
  },
  {
    name: "fields.shipsInternationally.no",
    value: ShipInterNationalType.NO,
  },
  {
    name: "fields.shipsInternationally.uponRequest",
    value: ShipInterNationalType.UPON_REQUEST,
  },
];

export enum SampleAvailability {
  FreeSample = "free",
  RefundableSample = "refundable",
  PaidSample = "paid",
  NoSample = "noSample",
}

export const sampleAvailability = [
  {
    name: "fields.sampleAvailability.freeSample",
    value: SampleAvailability.FreeSample,
  },
  {
    name: "fields.sampleAvailability.refundableSample",
    value: SampleAvailability.RefundableSample,
  },
  {
    name: "fields.sampleAvailability.paidSample",
    value: SampleAvailability.PaidSample,
  },
  {
    name: "fields.sampleAvailability.noSample",
    value: SampleAvailability.NoSample,
  },
];

export enum Incoterms {
  EXW = "EXW",
  FOB = "FOB",
  CIF = "CIF",
  DDP = "DDP",
  DAP = "DAP",
  FCA = "FCA",
  CPT = "CPT",
  CIP = "CIP",
}

export const incoTermsOptions = [
  { name: "optionLabels.incoterms.EXW", code: Incoterms.EXW },
  { name: "optionLabels.incoterms.FOB", code: Incoterms.FOB },
  { name: "optionLabels.incoterms.CIF", code: Incoterms.CIF },
  { name: "optionLabels.incoterms.DDP", code: Incoterms.DDP },
  { name: "optionLabels.incoterms.DAP", code: Incoterms.DAP },
  { name: "optionLabels.incoterms.FCA", code: Incoterms.FCA },
  { name: "optionLabels.incoterms.CPT", code: Incoterms.CPT },
  { name: "optionLabels.incoterms.CIP", code: Incoterms.CIP },
];

export const packagingTypeOptions = [
  { name: "optionLabels.packageTypes.Box", value: "Box" },
  { name: "optionLabels.packageTypes.Carton", value: "Carton" },
  { name: "optionLabels.packageTypes.Pallet", value: "Pallet" },
  { name: "optionLabels.packageTypes.Roll", value: "Roll" },
  { name: "optionLabels.packageTypes.Crate", value: "Crate" },
  { name: "optionLabels.packageTypes.Bag", value: "Bag" },
  { name: "optionLabels.packageTypes.Container", value: "Container" },
  {
    name: "optionLabels.packageTypes.Custom Packaging",
    value: "Custom Packaging",
  },
  {
    name: "optionLabels.packageTypes.Eco-Friendly Packaging",
    value: "Eco-Friendly Packaging",
  },
];

export const dispatchLeadTimeOptions = [
  {
    min_day: 1,
    max_day: 1,
  },
  {
    min_day: 2,
    max_day: 2,
  },
  {
    min_day: 3,
    max_day: 3,
  },
  {
    min_day: 5,
    max_day: 5,
  },
  {
    min_day: 7,
    max_day: 7,
  },
  {
    min_day: 10,
    max_day: 10,
  },
  {
    min_day: 14,
    max_day: null,
  },
  {
    min_day: null,
    max_day: null,
  },
];

export const sampleLeadTime = [
  {
    min_day: 1,
    max_day: 3,
  },
  {
    min_day: 4,
    max_day: 7,
  },
  {
    min_day: 8,
    max_day: 14,
  },

  {
    min_day: null,
    max_day: null,
  },
];

export const offerTypeOptions = [
  {
    name: "optionLabels.offerType.fixedDiscount",
    value: OfferType.FIXED_DISCOUNT,
  },
  {
    name: "optionLabels.offerType.limitedTime",
    value: OfferType.LIMITED_TIME,
  },
  {
    name: "optionLabels.offerType.lowMOQ",
    value: OfferType.LOW_MOQ,
  },
  {
    name: "optionLabels.offerType.buyMore",
    value: OfferType.BUY_MORE,
  },
];

export const productImageList = [
  {
    id: 1,
    name: "Mens T-shirt Short",
    img: "/img/product-1.jpg",
  },
  {
    id: 2,
    name: "Mens T-shirt Short",
    img: "/img/product-2.jpg",
  },
  {
    id: 3,
    name: "Mens T-shirt Short",
    img: "/img/product-3.jpg",
  },
];

export const lifeCycleTagOption = [
  {
    name: "Bulk Buyer",
    value: CustomerLifeCycle.BULK_BUYER,
    icon: <BulkBuyerIcon />,
  },
  { name: "High Value", value: CustomerLifeCycle.HIGH_VALUE_CUSTOMER },
  { name: "Lead", value: CustomerLifeCycle.LEAD },
  { name: "Customer", value: CustomerLifeCycle.CUSTOMER },
];

//Business Profile
export enum BusinessProfileStageKey {
  BrandingMedia = "BrandingMedia",
  TradeInformation = "TradeInformation",
  BusinessDetails = "BusinessDetails",
  CompanyRegistrationDetails = "CompanyRegistrationDetails",
  Additional = "Additional",
  MarketLogistics = "MarketLogistics",
  ShippingPaymentTerms = "ShippingPaymentTerms",
  AdditionalTradeDetails = "AdditionalTradeDetails",
  FactoryWarehouseDetails = "FactoryWarehouseDetails",
  AdditionalFactoryDetails = "AdditionalFactoryDetails",
}

export const businessProfileStepper = [
  {
    title: "businessProfile.businessProfileStepper.businessInformation.title",
    description:
      "businessProfile.businessProfileStepper.businessInformation.description",
    status: "pending",
    children: [
      {
        title: "businessProfile.businessProfileStepper.businessDetails",
        value: BusinessProfileStageKey.BusinessDetails,
        status: "pending",
      },
      {
        title:
          "businessProfile.businessProfileStepper.companyRegistrationDetails",
        value: BusinessProfileStageKey.CompanyRegistrationDetails,
        status: "pending",
      },
      // {
      //   title: "businessProfile.businessProfileStepper.factoryWarehouseDetails",
      //   value: BusinessProfileStageKey.FactoryWarehouseDetails,
      //   status: "pending",
      // },
      {
        title: "businessProfile.businessProfileStepper.additional",
        value: BusinessProfileStageKey.Additional,
        status: "pending",
      },
    ],
  },
  {
    title: "businessProfile.businessProfileStepper.brandingAndMedia.title",
    description:
      "businessProfile.businessProfileStepper.brandingAndMedia.subTxt",
    status: "pending",
    value: BusinessProfileStageKey.BrandingMedia,
  },
  {
    title: "businessProfile.businessProfileStepper.tradeInformation.title",
    description:
      "businessProfile.businessProfileStepper.tradeInformation.description",
    status: "pending",
    children: [
      {
        title: "businessProfile.businessProfileStepper.marketAndLogistics",
        value: BusinessProfileStageKey.MarketLogistics,
        status: "pending",
      },
      {
        title: "businessProfile.businessProfileStepper.shippingAndPaymentTerms",
        value: BusinessProfileStageKey.ShippingPaymentTerms,
        status: "pending",
      },
      {
        title:
          "businessProfile.businessProfileStepper.tradeInformationAdditional",
        value: BusinessProfileStageKey.AdditionalTradeDetails,
        status: "pending",
      },
    ],
  },
  {
    title:
      "businessProfile.businessProfileStepper.factoryWarehouseDetails.title",
    description:
      "businessProfile.businessProfileStepper.factoryWarehouseDetails.description",
    status: "pending",
    value: BusinessProfileStageKey.FactoryWarehouseDetails,
  },
];

export enum AccountSettingsStageKey {
  BusinessSettings = "BusinessSettings",
  ComplianceSettings = "ComplianceSettings",
  TaxSettings = "TaxSettings",
  DataPrivacySettings = "DataPrivacySettings",
  SubscriptionDetails = "SubscriptionDetails",
  UserSettings = "UserSettings",
}
export enum AccountSettingsStage {
  BusinessSettings = "accountSettings.accountSettingsStepper.businessSettings",
  ComplianceSettings = "accountSettings.accountSettingsStepper.complianceSettings",
  TaxSettings = "accountSettings.accountSettingsStepper.taxSettings",
  DataPrivacySettings = "accountSettings.accountSettingsStepper.dataPrivacySettings",
  SubscriptionDetails = "accountSettings.accountSettingsStepper.SubscriptionDetails",
  UserSettings = "accountSettings.accountSettingsStepper.UserSettings",
}
export const accountSettingsStepper = [
  {
    title: "accountSettings.accountSettingsStepper.businessSettings",
    status: "pending",
    value: AccountSettingsStageKey.BusinessSettings,
  },
  {
    title: "accountSettings.accountSettingsStepper.complianceSettings",
    value: AccountSettingsStageKey.ComplianceSettings,
    status: "pending",
  },
  {
    title: "accountSettings.accountSettingsStepper.taxSettings",
    status: "pending",
    value: AccountSettingsStageKey.TaxSettings,
  },
  {
    title: "accountSettings.accountSettingsStepper.dataPrivacySettings",
    status: "pending",
    value: AccountSettingsStageKey.DataPrivacySettings,
  },
  {
    title: "accountSettings.accountSettingsStepper.SubscriptionDetails",
    status: "pending",
    value: AccountSettingsStageKey.SubscriptionDetails,
  },
  // {
  //   title: "accountSettings.accountSettingsStepper.UserSettings",
  //   status: "pending",
  //   value: AccountSettingsStageKey.UserSettings,
  // },
];

export enum ProfileSettingsStageKey {
  Profile = "Profile",
  ChatPreferences = "ChatPreferences",
  NotificationPreferences = "NotificationPreferences",
}
export enum ProfileSettingsStage {
  Profile = "profileSettings.profileSettingsStepper.Profile_1",
  ChatPreferences = "profileSettings.profileSettingsStepper.ChatPreferences",
  NotificationPreferences = "profileSettings.profileSettingsStepper.NotificationPreferences",
}

export const profileSettingsStepper = [
  {
    title: "profileSettings.profileSettingsStepper.Profile_1",
    status: "pending",
    value: ProfileSettingsStageKey.Profile,
  },
  {
    title: "profileSettings.profileSettingsStepper.NotificationPreferences",
    status: "pending",
    value: ProfileSettingsStageKey.NotificationPreferences,
  },
  // {
  //   title: "profileSettings.profileSettingsStepper.ChatPreferences.title",
  //   description:
  //     "profileSettings.profileSettingsStepper.ChatPreferences.description",
  //   value: ProfileSettingsStageKey.ChatPreferences,
  //   status: "pending",
  // },
];
