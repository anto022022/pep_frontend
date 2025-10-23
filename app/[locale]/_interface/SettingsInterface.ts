export interface DocumentInfo {
  src: string;
  alt: string;
  exten: string;
  size: number;
}

export interface VerificationSection {
  documentType: string;
  document: DocumentInfo;
}

export interface KybFormValues {
  businessRegistration: VerificationSection;
  taxIdVerification: VerificationSection;
  businessAddressProof: VerificationSection;
}

export interface KycFormValues {
  identityVerification: VerificationSection;
  addressVerification: VerificationSection;
}
export interface Section {
  documentType: string;
  document: DocumentInfo;
}

export interface NationalIdDropdown {
  id: string;
  label: string;
  value: string;
}

export interface Country {
  name: string;
  code: string;
}

export interface BusinessAddress {
  addressLine: string;
  city: string;
  state: string;
  pinCode: string;
  country: Country;
}

export interface AccountSettings {
  businessName: string;
  businessAddress: BusinessAddress;
  accountId: string;
  email: string;
  phoneNo: string;
  countryCode: string;
  isEmailVerified: boolean;
  isPhoneNoVerified: boolean;
  membershipStatus: "P1" | "P2" | "P3" | "P4" | "P5";
}
