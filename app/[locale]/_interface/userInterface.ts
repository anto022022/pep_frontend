import { CountryOfOrigin } from "@/app/[locale]/(pages)/app/(sales)/sales-product/form/(forms)/ProductInformation";

export interface UserSessionDataInterface {
  _id: string;
  email: string;
  phoneNo: string;
  countryCode: string;
  years: string;
  businessName: string;
  businessEmail: string;
  country?: CountryOfOrigin;
  ip: number;
  cartCount: number;
  isVerified: boolean;
  userName: string;
  userType: "seller" | "buyer" | "both";
  isLoggedIn: boolean;
  kybVerification: boolean;
  kycVerified: boolean;
  uboVerification: boolean;
}
