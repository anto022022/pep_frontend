import { CountryOfOrigin } from "@/app/[locale]/_interface/SellOfferInterface";

export interface RegisteredUser {}

export interface UnRegisterUser {}

export enum BusinessTypePathEnum {
  businessDetails = "business-details",
  // complianceDetail = "compliance",
  businessOperation = "business-operation",
  contactInformation = "contact-information",
  businessRepresentative = "business-representative",
  sourcingDetails = "sourcing-details",
  personalInformation = "business-representative",
}

export enum OnBoardingFormEnum {
  businessDetails = "businessDetails",
  businessOperation = "businessOperation",
  contactInformation = "contactInformation",
  businessRepresentative = "businessRepresentative",
  sourcingDetails = "sourcingDetails",
}

export type StageStatusType = "active" | "completed" | "pending";

export interface RegisterStatus {
  businessDetails: StageStatusType;
  businessOperation: StageStatusType;
  contactInformation: StageStatusType;
  businessRepresentative: StageStatusType;
}

export type UserType = "seller" | "both" | "buyer";

export interface UnRegisterStatus {
  businessDetails: StageStatusType;
  businessRepresentative: StageStatusType;
  businessOperation: StageStatusType;
}

export interface CategoriesListInterface {
  _id: string;
  uniqueId: string;
  name: string;
}

export interface BuyerStage {
  businessOperation: StageStatusType;
  sourcingDetails: StageStatusType;
}

export type StageAndBusinessType =
  | {
      onBoardingSkipped: boolean;
      onBoardingComplete: boolean;
      userType: "seller" | "both";
      businessType: "register";
      stage: RegisterStatus;
      email: string;
      phoneNo: string;
      countryCode: string;
    }
  | {
      onBoardingSkipped: boolean;
      onBoardingComplete: boolean;
      userType: "seller" | "both";
      businessType: "unregister";
      stage: UnRegisterStatus;
      email: string;
      phoneNo: string;
      countryCode: string;
    }
  | {
      onBoardingSkipped: boolean;
      onBoardingComplete: boolean;
      userType: "seller" | "both";
      businessType: "nonprofit";
      stage: RegisterStatus;
      email: string;
      phoneNo: string;
      countryCode: string;
    }
  | {
      onBoardingSkipped: boolean;
      onBoardingComplete: boolean;
      userType: "buyer";
      businessType: "register" | "unregister" | "nonprofit";
      stage: BuyerStage;
      email: string;
      phoneNo: string;
      countryCode: string;
    };

export interface UserSessionData {
  userVerified: boolean;
  userSession: string;
}

export interface UserTypeData {
  userType: UserType;
}

export interface BusinessDetailsData {
  businessLocation: CountryOfOrigin;
  businessType: "register" | "unregister" | "nonprofit";
}

export interface BusinessOperationData {
  legalBusinessName?: string;
  industry: CategoriesListInterface;
  website: string;
  productBrief: string;
}

export interface Address {
  addressLine: string;
  city: string;
  state: string;
  pinCode: string;
  country: CountryOfOrigin;
}

export interface ContactInformationData {
  businessPhoneNo: { countryCode: string; number: string };
  businessEmail: string;
  businessAddress: Address;
}

export interface BusinessRepresentativeData {
  jobTitle?: string;
  firstName: string;
  middleName?: string;
  lastName: string;
  workEmail: string;
  workPhoneNo: { countryCode: string; number: string };
}

export interface SourcingDetailsData {
  firstName: string;
  middleName?: string;
  lastName: string;
  workEmail: string;
  industry: CategoriesListInterface;
  mainProducts: string[];
  website?: string;
  legalBusinessName?: string;
}
