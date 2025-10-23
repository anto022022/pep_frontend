export interface CustomerListResponse {
    listData: listData; 
    totalItems: number;
    totalDrafted: number;
    totalArchived: number;
}
export interface listData {
    result: CustomerListItem[];
    totalPages: number;
    currentPage: number;
    totalListCount: number;
}

export interface CustomerListItem {
    _id: string;
    name: string;
    email: string;
    companyName: string;
    phoneNo: string;
    jobTitle: string;
    whatsappNo?: string;
    country?: string;
    state?: string;
    city?: string;
    address?: string;
    postalCode?: string;
    website?: string;
    imageSrc?: string;
}

export interface CustomerListInterface {
    search?: string;
    limit: number;
    page: number;
}

export interface ContactInfo {
    name: string;
    email: string;
    phoneNo: string;
    jobTitle: string;
}
export enum CustomerLifeCycle {
  LEAD = "lead",
  CUSTOMER = "customer",
  HIGH_VALUE_CUSTOMER = "highValueCustomer",
  BULK_BUYER = "bulkBuyer",
}
  
  export enum CustomerStatus {
    ACTIVE = "active",
    INACTIVE = "inactive",
  }
  
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

  export enum CustomerType {
    USER = "user",
    CONTACT = "contact",
  }