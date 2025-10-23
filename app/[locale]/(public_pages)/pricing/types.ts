// Pricing page types and interfaces

export interface RegionalSetting {
  countryCode: string;
  regionalName: string;
  currency: string;
  currencySymbol: string;
  regionalPrice: number;
  monthlyPrice: number;
  yearlyPrice: number;
  taxPercent: number;
  monthlyPriceWithTax: number;
  yearlyPriceWithTax: number;
  regionalPriceWithTax: number;
}

export interface Plan {
  _id: string;
  planId: string;
  packageName: string;
  description: {
    en: string;
    ta: string;
    ar: string;
    hi: string;
  };
  features: {
    en: string[];
    ta: string[];
    ar: string[];
    hi: string[];
  };
  billingInfo: {
    en: string;
    ta: string;
    ar: string;
    hi: string;
  };
  regionalSettings: RegionalSetting[];
  monthPaymentLink: string;
  yearPaymentLink: string;
  withTaxMonthPaymentLink: string;
  withTaxYearPaymentLink: string;
  // Additional properties from API
  professionalCatalog?: string;
  ownDomainWebsite?: boolean;
  multilingualWebsite?: {
    qty: number;
    description: string;
  };
  businessEmailZoho?: {
    qty: number;
    description: string;
  } | null;
  marketplaceVisibility?: string;
  featuredProducts?: {
    qty: number;
    description: string;
  };
  rfqAccessPerMonth?: {
    qty: number;
    description: string;
  };
  smartCrmSuite?: string;
  aiLeadScoring?: boolean;
  verificationBadge?: string;
  ecoBusinessBadge?: boolean;
  supportLevel?: string;
  dedicatedAccountManager?: {
    qty: number | null;
    description: string;
  };
  papular?: string;
}

export interface PricingData {
  data: Plan[];
}

export interface PlanConfig {
  currency: string;
  monthPrice: string;
  yearPrice: string;
  monthLink: string;
  yearLink: string;
}

export interface PlanConfigs {
  Explore: {
    IN: PlanConfig;
    AE: PlanConfig;
    DEFAULT: PlanConfig;
  };
}

export interface FAQItem {
  question: string;
  answer: string;
  isRed?: boolean;
}

export interface FAQCategory {
  id: string;
  title: string;
  items: FAQItem[];
}

export type BillingType = 'monthly' | 'yearly';
export type CountryCode = 'IN' | 'AE' | 'US' | 'DEFAULT';
