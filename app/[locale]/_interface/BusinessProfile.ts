import { Currency } from "@/app/[locale]/_interface/SalesProductInterface";

export interface NamedImage {
  name?: string;
  image?: ImportImage;
}
export interface ImportImage {
  src?: string;
  alt?: string;
  exten?: string;
  size?: number;
}
export interface Award {
  name?: string | undefined;
  image?: ImportImage;
  year?: number | undefined;
}

export interface SocialMediaLinks {
  facebook?: string;
  youtube?: string;
  instagram?: string;
  linkedin?: string;
}

export class MinimumOrderValue {
  currency?: Currency;
  value?: number;
}

export class DeliveryTimeEstimateDto {
  value?: number;
  unit?: "days" | "weeks" | "months";
}

// Business information section
// Common
export interface BusinessInformationInterface {
  // this interface name have many place check it
  isEdit: boolean;
  updateEditStatus?: (key: string, value: boolean) => void;
  onSuccess: () => void;
}
export interface countryBasedStates {
  name?: string;
  isoCode?: string;
  latitude?: string | null;
  longitude?: string | null;
  countryCode?: string;
  stateCode?: string;
}

export interface countryCodesInterface {
  code: string;
  name: string;
}
// Additional
export interface AdditionalSectionInterface {
  shippingAddress?: {
    addressLine?: string;
    state?: countryBasedStates;
    pinCode?: string;
    city?: countryBasedStates;
    country?: {
      code?: string;
      name?: string;
    };
  };
  annualTurnover?: string;
  website?: string;
}

//Factory and Warehouse Details section
//common
export interface FactoryWarehouseInterface {
  contractManufacturing: string[];
}

export interface EmployeeRangeInterface {
  name: string;
  value: string;
}

export interface phoneNumberInterface {
  countryCode: string;
  number: string;
}
export interface phoneNumberOptionalInterface {
  countryCode?: string;
  number?: string;
}
export interface InfrastructureImgInterface {
  src: string;
  alt: string;
  exten: string;
  size: number;
}
export interface factoryDivision {
  divisionName?: string;
  companyName?: string;
  contactName?: string;
  phoneNumber?: phoneNumberOptionalInterface;
  address?: {
    addressLine?: string;
    state?: string;
    pinCode?: string;
    city?: string;
    country?: { code?: string; name?: string };
  };
  googleMapLink?: string;
}

export interface IndustryInterface {
  _id: string;
  uniqueId: string;
  name: string;
}

export interface FormData {
  legalBusinessName: string;
  businessName: string;
  ownerName: string;
  businessTypeSpecific: string[];
  businessAddress: {
    addressLine: string;
    city: countryBasedStates;
    state: countryBasedStates;
    pinCode: string;
    country: countryCodesInterface;
  };
  phoneNumber: phoneNumberInterface;
  email: string;
  businessType: string;
  industry: IndustryInterface;
  establishment: string;
  employeeCount: string;
  mainProduct: any[];
  shipAddress?: boolean;
}

//Factory and Warehouse Details  - Additional Information
export interface FactoryWarehouseAdditionalSectionInterface {
  totalFactorySize?: string;
  noOfProductionLines?: number;
  annualOutputValue?: string;
  productionFacilities?: string;
  annualProductionCapacity: {
    product?: string;
    quantity?: number;
    unit?: string;
  }[];
  warehouseStorageArea?: string;
  warehouseCertification?: {
    src?: string;
    alt?: string;
    exten?: string;
    size?: number;
  };
  infrastructureImg?: InfrastructureImgInterface[];
  infrastructureOverview?: string;
  noOfQcStaff?: number;
  noOfRdStaff?: number;
  factoryDivision?: factoryDivision[];
}

export interface FactoryWarehouseAdditionalSectionPayloadInterface {
  totalFactorySize?: string;
  noOfProductionLines?: number;
  annualOutputValue?: string;
  productionFacilities?: string;
  annualProductionCapacity: {
    product?: string;
    quantity?: number;
    unit?: string;
  }[];
  warehouseStorageArea?: string;
  warehouseCertification?: {
    src: string;
    alt: string;
    exten: string;
    size: number;
  };
  infrastructureImg?: InfrastructureImgInterface[];
  infrastructureOverview?: string;
  noOfQcStaff?: number;
  noOfRdStaff?: number;
  factoryDivision?: {
    divisionName?: string;
    companyName?: string;
    contactName?: string;
    phoneNumber?: phoneNumberOptionalInterface;
    address?: {
      addressLine: string;
      state: string;
      pinCode: string;
      city: string;
      country?: { code?: string; name?: string };
    };
    googleMapLink?: string;
  }[];
}

// Business Details- Additional form
export interface AdditionalSectionAPIFormat {
  shippingAddress?: {
    addressLine: string;
    state: string;
    pinCode: string;
    city: string;
    country?: {
      name?: string;
      code?: string;
    };
  };
  annualTurnover?: string;
  website?: string;
}
