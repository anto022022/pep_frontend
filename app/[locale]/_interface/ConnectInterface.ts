import { Contact } from "@/app/[locale]/(pages)/app/(sales)/sales-connect/page";
import {
  LeadSource,
  LeadStage,
  LeadStatus,
} from "@/app/[locale]/_interface/LeadsInterface";
import { CountryOfOrigin } from "@/app/[locale]/_interface/SellOfferInterface";

export enum CustomerSource {
  OFFLINE = "Offline",
  SOCIAL_MEDIA = "Social Media",
  WEBSITE = "Website",
  EMAIL = "Email",
  PHONE = "Phone",
  CHAT = "Chat",
  OTHER = "Other",
  TRADE_SHOW = "Trade Show",
  PEPAGORA = "Pepagora",
}

export type connectStatusIntersection = "active" | "inactive";

export interface CustomerInfo {
  contactName: string;
  email: string;
  phoneNo: phoneNumberInterface;
  jobTitle: string;
  companyName: string;
  country: CountryOfOrigin;
  whatsAppNo: phoneNumberInterface;
  lifeCycle: string;
  source: string;
  status: string;
  lastContactedAt:Date;
}

export interface CustomerResponses {
  leads: LeadItem[];
  quoteIds: string[];
  threadIds: string;
}

export interface BusinessAddressInfo {
  street: string;
  city: string;
  state: string;
  zip: string;
}

export interface CompanyInfo {
  businessName: string;
  industry: string;
  website: string;
  productServiceDescription: string;
  phoneNo: string;
  email: string;
  businessAddress: BusinessAddressInfo;
}
export interface ContactDetail {
  customerId: string;
  customer: CustomerInfo;
  responses: CustomerResponses;
  company: CompanyInfo;
}

export interface ContactsListResponse {
  // portOfDispatch: string;
  listData: listData;
  totalItems: number;
  totalDrafted: number;
  totalArchived: number;
}
export interface listData {
  result: Contact[];
  totalPages: number;
  currentPage: number;
  totalListCount: number;
}

export interface Dropdowndata {
  contactName: string;
  email: string;
  phoneNo: string;
  _id: string;
  isSelected?: boolean;
}

export interface MessageItem {
  _id: string;
  createdBy: string;
  user_id?: string;
  subject?: string;
  content: string;
  attachment?: Attachment[];
  fav: boolean;
  read: boolean;
  threadId?: string;
  isDeleted: boolean;
  isArchive: boolean;
  to?: string[];
  type: MessageType;
  cc?: string[];
  bcc?: string[];
  createdAt: string;
  updatedAt: string;
}

export interface Attachment {
  src: string;
  alt: string;
  exten: string;
  size: number;
}

export enum MessageType {
  EMAIL = "email",
  CHAT = "chat",
}

export interface LeadItem {
  _id: string;
  requirementDetails: string;
  status: LeadStatus;
  source: LeadSource;
  logs: any[];
  threadId: string[];
  stage: LeadStage;
  lastContact: string;
}
export interface attachment {
  name: string;
  url: string;
}
export interface SendMessageInterface {
  subject: string;
  content: string;
  attachments: attachment[];
}

export interface SendMessageResponse {
  messageId: string;
  threadId: string;
  subject: string;
}

export interface ListMessageInterface {
  leadId: string;
  limit: number;
  page: number;
}

export interface ListMessageResponse {
  messages: MessageInterface[];
  total: number;
}

export interface MessageInterface {
  messageId: string;
  threadId: string;
  subject: string;
  content: string;
  attachments: attachment[];
  createdAt: string;
  favorite: boolean;
  read: boolean;
  sender: string;
  receiver: string;
}

export interface phoneNumberInterface {
  countryCode: string;
  number: string;
}
