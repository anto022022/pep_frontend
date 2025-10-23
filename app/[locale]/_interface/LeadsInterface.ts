import {
  Currency,
  DispatchLeadTime,
  Pricing,
  ProductionLeadTime,
} from "@/app/[locale]/_interface/SalesProductInterface";
import { CountryOfOrigin } from "@/app/[locale]/_interface/SellOfferInterface";
import { attachment } from "./ConnectInterface";
import {
  EstOrderQuantity,
  PreferredUnitPrice,
  ProductImage,
  TotalOrderQuantity,
} from "./RfqInterface";
export interface CreateLead {
  contactName?: string;
  email?: string;
  phoneNo?: string;
  jobTitle?: string;
  companyName?: string;
  customerId?: string;
  interestProductIds?: string[];
  requirementDetails?: string;
  stage: LeadStage;
  source: LeadSource;
  permission?: string;
  isArchived?: boolean;
  isDraft?: boolean;
}

export enum LeadStage {
  NEW_INQUIRY = "New Inquiry",
  NEGOTIATION = "Negotiation",
  CONTACTED_QUOTED = "Contacted/Quoted",
  DEAL_WON = "Deal Won",
  DEAL_LOST = "Deal Lost",
}
export enum LeadContactPermission {
  ALLOWED = "Allowed",
  NOT_ALLOWED = "Not Allowed",
}

export enum LeadSource {
    REFERRAL = "Referral",
    SOCIAL_MEDIA = "Social Media",
    WEBSITE = "Website",
    EMAIL = "Email Campaign",
    PHONE = "Phone",
    CHAT = "Web Chat",
    COLDCALL ="Cold Call",
    WHATSAPP = "Whatsapp",
    TRADE_SHOW = "Trade Show",
    PEPAGORA = "Pepagora",
  }

export enum LeadStatus {
  NOT_CONNECTED = "Not Connected",
  AWAITING_RESPONSE = "Awaiting Response",
  BUYER_INTERESTED = "Buyer Interested",
  ORDER_CONFIRMED = "Order Confirmed",
  INVALID_LEAD = "Invalid Lead",
}

export const LeadStatusClassMap: Record<LeadStatus, string> = {
  [LeadStatus.NOT_CONNECTED]: "not-contacted",
  [LeadStatus.AWAITING_RESPONSE]: "awaiting",
  [LeadStatus.BUYER_INTERESTED]: "buyer",
  [LeadStatus.ORDER_CONFIRMED]: "order-confirm",
  [LeadStatus.INVALID_LEAD]: "deal-lost",
};

export type listStatusIntersection = "" | "draft" | "archive";

export interface LeadsListInterface {
  sortBy: string;
  sortOrder?: number;
  limit?: number;
  page: number;
  searchQuery?: string;
  isArchived?: boolean;
  isDraft?: boolean;
  status?: LeadStatus;
  itemStatus?: listStatusIntersection;
}

export interface LeadsListItem {
  _id: string;
  contactName: string;
  email: string;
  companyName: string;
  countryCode:string;
  phoneNo: string;
  source: string;
  stage: string;
  status: string;
  lastContact: string;
  createdAt: string;
  isArchived: boolean;
  isDraft: boolean;
  createdBy: string;
  interestProductNames: string[];
  lifecycleTags: string;
}
export interface LeadsDetailsInterestProducts {
  productId: string;
  productName: string;
  productImage?: ProductImage[];
  estOrderQuantity?: EstOrderQuantity;
  preferredUnitPrice?: PreferredUnitPrice;
  pricing: Pricing;
  currency: Currency;
  dispatchLeadTime?: DispatchLeadTime;
  productionLeadTime?: ProductionLeadTime;
  moqUnit?: string;
  totalOrderQuantity: TotalOrderQuantity;
}
interface Country {
  name: string;
  code: string;
}

interface BusinessAddress {
  addressLine: string;
  city: string;
  state: string;
  pinCode: string;
  country: Country;
}

export interface LeadsDetailsCompany {
  businessName?: string;
  industry?: string;
  type?: string;
  noOfEmployees?: string;
  website?: string;
  productServiceDescription?: string;
  buyingRole?: string;
  street?: string;
  city?: string;
  state?: string;
  zip?: string;
  phoneNo?: string;
  email?: string;
  businessLocation?: CountryOfOrigin;
  permissionToContact?: string;
  businessAddress?: BusinessAddress;
  businessType?: string;
}
export interface LeadsDetailsCustomer {
  contactName?: string;
  email?: string;
  phoneNo?: string;
  jobTitle?: string;
  profileImage?: attachment;
  companyName?: string;
}
export interface LeadsDetailsLogs {
  _id: string;
  createdAt: string;        // should be string (ISO date) from API
  description: string;
  reactions: string[];       // fix name to match API
  favorite?: boolean;       // API also sends favorite
  createdBy?: string;       // API also sends createdBy
}


export interface LeadsDetails {
  _id: string;
  interestedProducts: LeadsDetailsInterestProducts[];
  requirementDetails: string;
  stage: LeadStage;
  source: LeadSource;
  status: LeadStatus;
  permission: LeadContactPermission;
  company?: LeadsDetailsCompany;
  customer?: LeadsDetailsCustomer;
  isDraft: boolean;
  isArchived: boolean;
  threadId: string;
  lastContact: string;
  createdAt: string;
  updatedAt: string;
  logs: LeadsDetailsLogs[];
  totalOrderQuantity: TotalOrderQuantity;
}

export interface LeadsListResponse {
  listData: listData;
  totalItems: number;
  totalDrafted: number;
  totalArchived: number;
}
export interface listData {
  result: LeadsListItem[];
  totalPages: number;
  currentPage: number;
  totalListCount: number;
}
