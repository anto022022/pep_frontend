import {
  LowestPriceIcon,
  ManufacturerIcon,
  TrendingIcon,
  VerifiedSupplierIcon,
  ViewGridIcon,
  ViewListIcon,
} from "@/app/[locale]/_components/Icons/SVGIcons";
import { EmployeeRangeInterface } from "@/app/[locale]/_interface/BusinessProfile";
import { CustomerSource } from "@/app/[locale]/_interface/ConnectInterface";
import {
  OffersSortByEnum,
  ProductSortByEnum,
  RFQSortByEnum,
  SupplierSortByEnum,
} from "@/app/[locale]/_interface/MarketPlaceInterface";
import { type TranslationValues } from "next-intl";

type TranslateFunction = (key: string, values?: TranslationValues) => string;

export const tabsName = [
  {
    id: 1,
    name: "salesOffer.offerTable.all_offers",
    keyName: "totalItems",
    status: "",
  },
  {
    id: 2,
    name: "salesOffer.offerTable.drafts_offers",
    keyName: "totalDrafted",
    status: "draft",
  },
  {
    id: 3,
    name: "salesOffer.offerTable.archive_offers",
    keyName: "totalArchived",
    status: "archive",
  },
];
export const catalogTabs = [
  {
    id: 1,
    name: "freeCatalog.products.tab.all.name",
    keyName: "totalItems",
    status: "",
  },
  {
    id: 2,
    name: "freeCatalog.products.tab.selected.name",
    keyName: "totalSelected",
    status: "selected",
  },
  {
    id: 3,
    name: "freeCatalog.products.tab.unSelected.name",
    keyName: "totalUnSelected",
    status: "unSelected",
  },
];

export const supplierTabs = [
  {
    id: 1,
    name: "categoryPage.trending.supplierFilters.topManufacturer",
    keyName: SupplierSortByEnum.TopManufacturer,
    status: SupplierSortByEnum.TopManufacturer,
  },
  {
    id: 2,
    name: "categoryPage.trending.supplierFilters.highlyEngaged",
    keyName: SupplierSortByEnum.HighlyEngaged,
    status: SupplierSortByEnum.HighlyEngaged,
  },
  // {
  //   id: 3,
  //   name: "categoryPage.trending.supplierFilters.mostRecommended",
  //   keyName: SupplierSortByEnum.MostRecommended,
  //   status: SupplierSortByEnum.MostRecommended,
  // },
];

export const productTabs = [
  {
    id: 1,
    name: "categoryPage.trending.filters.mostViewed",
    keyName: ProductSortByEnum.MostViewed,
    status: ProductSortByEnum.MostViewed,
  },
  {
    id: 2,
    name: "categoryPage.trending.filters.recentlyListed",
    keyName: ProductSortByEnum.RecentlyListed,
    status: ProductSortByEnum.RecentlyListed,
  },
  // {
  //   id: 3,
  //   name: "categoryPage.trending.filters.exportInterest",
  //   keyName: "exportInterest",
  //   status: ProductSortByEnum.ExportInterest,
  // },
];

export const catDetailTabs = [
  {
    id: 1,
    name: "Grid",
    icon: <ViewGridIcon />,
    status: "Grid",
  },
  {
    id: 2,
    name: "List",
    icon: <ViewListIcon className={"list-view"} />,
    status: "List",
  },
];

// Sort Lists
export const productSortingList = [
  {
    name: "Newly Added",
    value: ProductSortByEnum.NewlyAdded,
  },
  {
    name: "Price Drop",
    value: ProductSortByEnum.PriceDrop,
  },
  {
    name: "Most Viewed",
    value: ProductSortByEnum.MostViewed,
  },
  {
    name: "Most Inquired",
    value: ProductSortByEnum.MostInquired,
  },
];

export const supplierSortingList = [
  {
    name: "Highly Engaged",
    value: SupplierSortByEnum.HighlyEngaged,
  },
  {
    name: "Recently Added",
    value: SupplierSortByEnum.RecentlyAdded,
  },
  // {
  //   name: "Most Recommended",
  //   value: SupplierSortByEnum.MostRecommended,
  // },
];

export const rfqSortingList = [
  {
    name: "Price",
    value: RFQSortByEnum.Price,
  },
  {
    name: "Date Posted",
    value: RFQSortByEnum.DatePosted,
  },
  {
    name: "Estimated Quantity",
    value: RFQSortByEnum.EstimatedQuantity,
  },
];

export const offerSortingList = [
  {
    name: "High to Low",
    value: OffersSortByEnum.HighToLow,
  },
  {
    name: "Low to High",
    value: OffersSortByEnum.LowToHigh,
  },
  // {
  //   name: "Recommended",
  //   value: OffersSortByEnum.Recommended,
  // },
];

///

export const categoryBadgeList = [
  {
    id: 1,
    name: "Trending",
    path: "/",
    icon: <TrendingIcon />,
  },
  {
    id: 2,
    name: "Manufacturer",
    path: "/",
    icon: <ManufacturerIcon />,
  },
  {
    id: 3,
    name: "Lowest price",
    path: "/",
    icon: <LowestPriceIcon />,
  },
  {
    id: 4,
    name: "Lowest price",
    path: "/",
    icon: <LowestPriceIcon />,
  },
  {
    id: 5,
    name: "Verified Suppliers",
    path: "/",
    icon: <VerifiedSupplierIcon />,
  },
];

export const ratingList = [
  {
    name: "5 Star",
    value: "5",
  },
  {
    name: "4 Star",
    value: "4",
  },
  {
    name: "3 Star",
    value: "3",
  },
  {
    name: "2 Star",
    value: "2",
  },
  {
    name: "1 Star",
    value: "1",
  },
];

export enum EndorsementFlagEnum {
  UNVERIFIED_PURCHASE = "unverified_purchase",
  VERIFIED_PURCHASE = "verified_purchase",
  ENDORSED_BY_BUYER = "endorsed_by_buyer",
}

export const sourceList = [
  { name: "Offline", value: CustomerSource.OFFLINE },
  { name: "Social Media", value: CustomerSource.SOCIAL_MEDIA },
  { name: "Website", value: CustomerSource.WEBSITE },
  { name: "Email", value: CustomerSource.EMAIL },
  { name: "Phone", value: CustomerSource.PHONE },
  { name: "Chat", value: CustomerSource.CHAT },
  { name: "Other", value: CustomerSource.OTHER },
  { name: "Trade Show", value: CustomerSource.TRADE_SHOW },
  { name: "Pepagora", value: CustomerSource.PEPAGORA },
];

export function getKycVerificationData(t: TranslateFunction) {
  return [
    {
      id: 1,
      title: t("complianceSettings.kycVerification.step_1.title"),
      subTxt: t("complianceSettings.kycVerification.step_1.subTitle"),
    },
    {
      id: 2,
      title: t("complianceSettings.kycVerification.step_2.title"),
      subTxt: t("complianceSettings.kycVerification.step_2.subTitle"),
    },
    {
      id: 3,
      title: t("complianceSettings.kycVerification.step_3.title"),
      subTxt: t("complianceSettings.kycVerification.step_3.subTitle"),
    },
  ];
}

export function getKybVerificationData(t: TranslateFunction) {
  return [
    {
      id: 1,
      title: t("complianceSettings.kybVerification.step_1.title"),
      subTxt: t("complianceSettings.kybVerification.step_1.subTitle"),
    },
    {
      id: 2,
      title: t("complianceSettings.kybVerification.step_2.title"),
      subTxt: t("complianceSettings.kybVerification.step_2.subTitle"),
    },
    {
      id: 3,
      title: t("complianceSettings.kybVerification.step_3.title"),
      subTxt: t("complianceSettings.kybVerification.step_3.subTitle"),
    },
  ];
}

export function getUboVerificationData(t: TranslateFunction) {
  return [
    {
      id: 1,
      title: t("complianceSettings.uboVerification.step_1.title"),
      subTxt: t("complianceSettings.uboVerification.step_1.subTitle"),
    },
    {
      id: 2,
      title: t("complianceSettings.uboVerification.step_2.title"),
      subTxt: t("complianceSettings.uboVerification.step_2.subTitle"),
    },
    {
      id: 3,
      title: t("complianceSettings.uboVerification.step_3.title"),
      subTxt: t("complianceSettings.uboVerification.step_3.subTitle"),
    },
  ];
}

export const settingsProofValues = [
  {
    name: "Pan card",
    value: "Pancard",
  },
  {
    name: "Aadhar card",
    value: "Aadharcard",
  },
  {
    name: "Voter ID",
    value: "VoterID",
  },
];
export function getComplianceSettingsOptions() {
  return {
    KybForm: {
      businessRegistrationDocument: [
        {
          name: "Business License",
          value: "business_license",
        },
        {
          name: "Tax Registration Certificate",
          value: "tax_registration",
        },
        {
          name: "Certificate of Incorporation",
          value: "incorporation_certificate",
        },
        {
          name: "Partnership Agreement",
          value: "partnership_agreement",
        },
        {
          name: "Vendor Permit",
          value: "vendor_permit",
        },
        {
          name: "GST Certificate",
          value: "gst_certificate",
        },
        {
          name: "Trade License",
          value: "trade_license",
        },
        {
          name: "Other",
          value: "other",
        },
      ],

      taxIdentificationVerification: [
        { name: "PAN Card", value: "pan_card" },
        { name: "GST Certificate", value: "gst_certificate" },
        { name: "TIN Certificate", value: "tin_certificate" },
        { name: "Tax Clearance Certificate", value: "tax_clearance" },
        { name: "Business Tax ID", value: "business_tax_id" },
        { name: "Other", value: "other" },
      ],
      businessAddressProof: [
        {
          name: "Utility Bill (Electricity, Water, Gas)",
          value: "utility_bill",
        },
        { name: "Lease or Rent Agreement", value: "lease_agreement" },
        { name: "Property Tax Receipt", value: "property_tax" },
        { name: "Bank Statement", value: "bank_statement" },
        { name: "Shop or Trade License", value: "trade_license" },
        { name: "Company Incorporation Document", value: "incorporation_doc" },
        { name: "Other", value: "other" },
      ],
    },
    KycForm: {
      identityVerification: [
        {
          name: "Pan card",
          value: "Pancard",
        },
        {
          name: "Aadhar card",
          value: "Aadharcard",
        },
        {
          name: "Voter ID",
          value: "VoterID",
        },
      ],
      addressVerification: [
        {
          name: "Pan card",
          value: "Pancard",
        },
        {
          name: "Aadhar card",
          value: "Aadharcard",
        },
        {
          name: "Voter ID",
          value: "VoterID",
        },
      ],
    },
  };
}

export const countryOptions = [
  { name: "Afghanistan", value: "afghanistan" },
  { name: "Albania", value: "albania" },
  { name: "Algeria", value: "algeria" },
  { name: "Andorra", value: "andorra" },
  { name: "Angola", value: "angola" },
  { name: "Antigua and Barbuda", value: "antigua_and_barbuda" },
  { name: "Argentina", value: "argentina" },
  { name: "Armenia", value: "armenia" },
  { name: "Australia", value: "australia" },
  { name: "Austria", value: "austria" },
  { name: "Azerbaijan", value: "azerbaijan" },
  { name: "Bahamas", value: "bahamas" },
  { name: "Bahrain", value: "bahrain" },
  { name: "Bangladesh", value: "bangladesh" },
  { name: "Barbados", value: "barbados" },
  { name: "Belarus", value: "belarus" },
  { name: "Belgium", value: "belgium" },
  { name: "Belize", value: "belize" },
  { name: "Benin", value: "benin" },
  { name: "Bhutan", value: "bhutan" },
  { name: "Bolivia", value: "bolivia" },
  { name: "Bosnia and Herzegovina", value: "bosnia_and_herzegovina" },
  { name: "Botswana", value: "botswana" },
  { name: "Brazil", value: "brazil" },
  { name: "Brunei", value: "brunei" },
  { name: "Bulgaria", value: "bulgaria" },
  { name: "Burkina Faso", value: "burkina_faso" },
  { name: "Burundi", value: "burundi" },
  { name: "Cabo Verde", value: "cabo_verde" },
  { name: "Cambodia", value: "cambodia" },
  { name: "Cameroon", value: "cameroon" },
  { name: "Canada", value: "canada" },
  { name: "Central African Republic", value: "central_african_republic" },
  { name: "Chad", value: "chad" },
  { name: "Chile", value: "chile" },
  { name: "China", value: "china" },
  { name: "Colombia", value: "colombia" },
  { name: "Comoros", value: "comoros" },
  { name: "Congo (Congo-Brazzaville)", value: "congo" },
  { name: "Costa Rica", value: "costa_rica" },
  { name: "Croatia", value: "croatia" },
  { name: "Cuba", value: "cuba" },
  { name: "Cyprus", value: "cyprus" },
  { name: "Czechia", value: "czechia" },
  {
    name: "Democratic Republic of the Congo",
    value: "democratic_republic_of_the_congo",
  },
  { name: "Denmark", value: "denmark" },
  { name: "Djibouti", value: "djibouti" },
  { name: "Dominica", value: "dominica" },
  { name: "Dominican Republic", value: "dominican_republic" },
  { name: "Ecuador", value: "ecuador" },
  { name: "Egypt", value: "egypt" },
  { name: "El Salvador", value: "el_salvador" },
  { name: "Equatorial Guinea", value: "equatorial_guinea" },
  { name: "Eritrea", value: "eritrea" },
  { name: "Estonia", value: "estonia" },
  { name: "Eswatini", value: "eswatini" },
  { name: "Ethiopia", value: "ethiopia" },
  { name: "Fiji", value: "fiji" },
  { name: "Finland", value: "finland" },
  { name: "France", value: "france" },
  { name: "Gabon", value: "gabon" },
  { name: "Gambia", value: "gambia" },
  { name: "Georgia", value: "georgia" },
  { name: "Germany", value: "germany" },
  { name: "Ghana", value: "ghana" },
  { name: "Greece", value: "greece" },
  { name: "Guatemala", value: "guatemala" },
  { name: "Haiti", value: "haiti" },
  { name: "Honduras", value: "honduras" },
  { name: "Hungary", value: "hungary" },
  { name: "Iceland", value: "iceland" },
  { name: "India", value: "india" },
  { name: "Indonesia", value: "indonesia" },
  { name: "Iran", value: "iran" },
  { name: "Iraq", value: "iraq" },
  { name: "Ireland", value: "ireland" },
  { name: "Israel", value: "israel" },
  { name: "Italy", value: "italy" },
  { name: "Jamaica", value: "jamaica" },
  { name: "Japan", value: "japan" },
  { name: "Jordan", value: "jordan" },
  { name: "Kazakhstan", value: "kazakhstan" },
  { name: "Kenya", value: "kenya" },
  { name: "Kuwait", value: "kuwait" },
  { name: "Malaysia", value: "malaysia" },
  { name: "Mexico", value: "mexico" },
  { name: "Netherlands", value: "netherlands" },
  { name: "New Zealand", value: "new_zealand" },
  { name: "Nigeria", value: "nigeria" },
  { name: "Norway", value: "norway" },
  { name: "Pakistan", value: "pakistan" },
  { name: "Peru", value: "peru" },
  { name: "Philippines", value: "philippines" },
  { name: "Poland", value: "poland" },
  { name: "Portugal", value: "portugal" },
  { name: "Qatar", value: "qatar" },
  { name: "Russia", value: "russia" },
  { name: "Saudi Arabia", value: "saudi_arabia" },
  { name: "South Africa", value: "south_africa" },
  { name: "South Korea", value: "south_korea" },
  { name: "Spain", value: "spain" },
  { name: "Sweden", value: "sweden" },
  { name: "Switzerland", value: "switzerland" },
  { name: "Thailand", value: "thailand" },
  { name: "Turkey", value: "turkey" },
  { name: "Ukraine", value: "ukraine" },
  { name: "United Arab Emirates", value: "uae" },
  { name: "United Kingdom", value: "uk" },
  { name: "United States of America", value: "usa" },
  { name: "Vietnam", value: "vietnam" },
  { name: "Zimbabwe", value: "zimbabwe" },
];

export const languageList = [
  {
    name: "English",
    value: "English",
  },
  {
    name: "Tamil",
    value: "Tamil",
  },
  {
    name: "Arabic",
    value: "Arabic",
  },
  {
    name: "Hindi",
    value: "Hindi",
  },
];

export const unitOptions = [
  { label: "Days", value: "days" },
  { label: "Weeks", value: "weeks" },
  { label: "Months", value: "months" },
];

export const contractManufacturingOptions = [
  { name: "OEM Service", value: "OEM Service" },
  { name: "ODM Service", value: "ODM Service" },
  { name: "Private Label", value: "Private Label" },
  { name: "Sub-Contractor", value: "Sub-Contractor" },
];

export const annualTurnoverRanger = [
  { name: "Below ₹25 Lakhs", value: "Below ₹25 Lakhs" },
  { name: "₹25 Lakhs to ₹1 Crore", value: "₹25 Lakhs - ₹1 Crore" },
  { name: "₹1 to ₹5 Crore", value: "₹1 - ₹5 Crore" },
  { name: "₹5 to ₹10 Crore", value: "₹5 - ₹10 Crore" },
  { name: "Above ₹10 Crore", value: "Above ₹10 Crore" },
];

export const totalFactorySizeRange = [
  { name: "Below 1000 sqm", value: "Below 1000 sqm" },
  { name: "1000 to 5000 sqm", value: "1000-5000 sqm" },
  { name: "Above 5000 sqm", value: "Above 5000 sqm" },
];

export const annualOutputValueRange = [
  { name: "Less than $1M", value: "Less than $1M" },
  { name: "$1M to $10M", value: "$1M-$10M" },
  { name: "$10M to $50M", value: "$10M-$50M" },
  { name: "Above $50M", value: "Above $50M" },
];

export const warehouseStorageAreaRange = [
  { name: "Less than 100 sqft", value: "<1000 sqft" },
  { name: "1000 to 5000 sqft", value: "1000-5000 sqft" },
  { name: "5000 to 10000 sqft", value: "5000-10000 sqft" },
  { name: "Above 50000 sqft", value: ">50000 sqft" },
];

export const timeZoneOptions = [
  { name: "Pacific Time (US & Canada)", value: "America/Los_Angeles" },
  { name: "Mountain Time (US & Canada)", value: "America/Denver" },
  { name: "Central Time (US & Canada)", value: "America/Chicago" },
  { name: "Eastern Time (US & Canada)", value: "America/New_York" },
  { name: "Greenwich Mean Time", value: "Etc/Greenwich" },
  { name: "London", value: "Europe/London" },
  { name: "Berlin", value: "Europe/Berlin" },
  { name: "Moscow", value: "Europe/Moscow" },
  { name: "India Standard Time", value: "Asia/Kolkata" },
  { name: "Singapore", value: "Asia/Singapore" },
  { name: "Tokyo", value: "Asia/Tokyo" },
  { name: "Sydney", value: "Australia/Sydney" },
  { name: "Auckland", value: "Pacific/Auckland" },
];

export const countryWishDocumentsList = [
  {
    _id: {
      $oid: "68948005c11c5f78ce470ff9",
    },
    "Country Name": "United Arab Emirates",
    "Country Code": "AE",
    Accepted_documents: {
      CBLS: "CBLS",
      "Local Business Number": "BL Local",
    },
  },
  {
    _id: {
      $oid: "68948005c11c5f78ce470ffa",
    },
    "Country Name": "Argentina",
    "Country Code": "AR",
    Accepted_documents: {
      "Argentina Unique Tax Identification Key": "CUIT or CUIL",
    },
  },
  {
    _id: {
      $oid: "68948005c11c5f78ce470ffb",
    },
    "Country Name": "Austria",
    "Country Code": "AT",
    Accepted_documents: {
      "Commercial Register Number (Firmenbuchnummer)": "FN",
      "Value Added Tax ID": "VAT Number",
    },
  },
  {
    _id: {
      $oid: "68948005c11c5f78ce470ffc",
    },
    "Country Name": "Australia",
    "Country Code": "AU",
    Accepted_documents: {
      "Australian Business Number": "ABN",
      "Australian Company Number": "ACN",
    },
  },
  {
    _id: {
      $oid: "68948005c11c5f78ce470ffd",
    },
    "Country Name": "Belgium",
    "Country Code": "BE",
    Accepted_documents: {
      "Company Number": "Numéro d'entreprise",
      "Value Added Tax ID": "VAT Number",
    },
  },
  {
    _id: {
      $oid: "68948005c11c5f78ce470ffe",
    },
    "Country Name": "Bermuda",
    "Country Code": "BM",
    Accepted_documents: {
      "Bermuda Registration Number": "Registration Number",
    },
  },
  {
    _id: {
      $oid: "68948005c11c5f78ce470fff",
    },
    "Country Name": "Brazil",
    "Country Code": "BR",
    Accepted_documents: {
      "Legal entity tax identification number": "CNPJ",
    },
  },
  {
    _id: {
      $oid: "68948005c11c5f78ce471000",
    },
    "Country Name": "Bahamas",
    "Country Code": "BS",
    Accepted_documents: {
      "Bahamas Tax Identification Number": "Tax Identification Number",
    },
  },
  {
    _id: {
      $oid: "68948005c11c5f78ce471001",
    },
    "Country Name": "Canada",
    "Country Code": "CA",
    Accepted_documents: {
      "Corporations Number": "CN",
      "Business Number": "BN",
    },
  },
  {
    _id: {
      $oid: "68948005c11c5f78ce471002",
    },
    "Country Name": "Switzerland",
    "Country Code": "CH",
    Accepted_documents: {
      "Business Identification Number (Unternehmens-Identifikationsnummer)":
        "UID",
    },
  },
  {
    _id: {
      $oid: "68948005c11c5f78ce471003",
    },
    "Country Name": "China",
    "Country Code": "CN",
    Accepted_documents: {
      "Unified Social Credit Identifier (USCN)": "USCN",
    },
  },
  {
    _id: {
      $oid: "68948005c11c5f78ce471004",
    },
    "Country Name": "Colombia",
    "Country Code": "CO",
    Accepted_documents: {
      "Mercantile Enrolment Number": "Numero de Matricula",
      "Número de Identificación Tributaria": "NIT",
    },
  },
  {
    _id: {
      $oid: "68948005c11c5f78ce471005",
    },
    "Country Name": "Cyprus",
    "Country Code": "CY",
    Accepted_documents: {
      "Registration Number": "Reg Number",
      "Value Added Tax ID": "VAT Number",
    },
  },
  {
    _id: {
      $oid: "68948005c11c5f78ce471006",
    },
    "Country Name": "Czech Republic",
    "Country Code": "CZ",
    Accepted_documents: {
      "Identifikační číslo (ID Number)": "IČO",
      "Value Added Tax ID": "VAT Number",
    },
  },
  {
    _id: {
      $oid: "68948005c11c5f78ce471007",
    },
    "Country Name": "Germany",
    "Country Code": "DE",
    Accepted_documents: {
      Handelsregisternummer: "Registernummer",
      "Value Added Tax ID": "VAT Number",
    },
  },
  {
    _id: {
      $oid: "68948005c11c5f78ce471008",
    },
    "Country Name": "Denmark",
    "Country Code": "DK",
    Accepted_documents: {
      "Central Business Register Number - Det Centrale Virksomhedsregister Number":
        "CVR Number",
      "Value Added Tax ID": "VAT Number",
    },
  },
  {
    _id: {
      $oid: "68948005c11c5f78ce471009",
    },
    "Country Name": "Estonia",
    "Country Code": "EE",
    Accepted_documents: {
      "Registry Code": "Registrikood",
      "Value Added Tax ID": "VAT Number",
    },
  },
  {
    _id: {
      $oid: "68948005c11c5f78ce47100a",
    },
    "Country Name": "Spain",
    "Country Code": "ES",
    Accepted_documents: {
      "Número de Identificación Fiscal - Tax Identification Number":
        "TIN (formerly known as a CIF)",
      "Value Added Tax ID": "VAT Number",
    },
  },
  {
    _id: {
      $oid: "68948005c11c5f78ce47100b",
    },
    "Country Name": "Finland",
    "Country Code": "FI",
    Accepted_documents: {
      "Business ID": "Y-tunnus",
      "Value Added Tax ID": "VAT Number",
    },
  },
  {
    _id: {
      $oid: "68948005c11c5f78ce47100c",
    },
    "Country Name": "France",
    "Country Code": "FR",
    Accepted_documents: {
      "SIREN number": "SIREN",
      "Value Added Tax ID": "VAT Number",
    },
  },
  {
    _id: {
      $oid: "68948005c11c5f78ce47100d",
    },
    "Country Name": "United Kingdom",
    "Country Code": "GB",
    Accepted_documents: {
      "Company Registration Number": "Company Number",
      "Value Added Tax ID": "VAT Number",
    },
  },
  {
    _id: {
      $oid: "68948005c11c5f78ce47100e",
    },
    "Country Name": "Guernsey",
    "Country Code": "GG",
    Accepted_documents: {
      "Guernsey Corporate Registry Number": "Reg Number",
    },
  },
  {
    _id: {
      $oid: "68948005c11c5f78ce47100f",
    },
    "Country Name": "Gibraltar",
    "Country Code": "GI",
    Accepted_documents: {
      "Gibraltar Corporate Registration Number": "Registration Number",
    },
  },
  {
    _id: {
      $oid: "68948005c11c5f78ce471010",
    },
    "Country Name": "Hong Kong",
    "Country Code": "HK",
    Accepted_documents: {
      "Company Registration Number": "CRN",
    },
  },
  {
    _id: {
      $oid: "68948005c11c5f78ce471011",
    },
    "Country Name": "Hungary",
    "Country Code": "HU",
    Accepted_documents: {
      "Corporate Registration Number": "Cégjegyzékszám",
      "Value Added Tax ID": "VAT Number",
    },
  },
  {
    _id: {
      $oid: "68948005c11c5f78ce471012",
    },
    "Country Name": "Indonesia",
    "Country Code": "ID",
    Accepted_documents: {
      "Business Identification Number": "NIB",
    },
  },
  {
    _id: {
      $oid: "68948005c11c5f78ce471013",
    },
    "Country Name": "Ireland",
    "Country Code": "IE",
    Accepted_documents: {
      "Company Number": "Company Number",
      "Value Added Tax ID": "VAT Number",
    },
  },
  {
    _id: {
      $oid: "68948005c11c5f78ce471014",
    },
    "Country Name": "India",
    "Country Code": "IN",
    Accepted_documents: {
      "Corporate Identity Number": "CIN",
      "Limited Liability Partnership Identification Number": "LLPIN",
    },
  },
  {
    _id: {
      $oid: "68948005c11c5f78ce471015",
    },
    "Country Name": "Italy",
    "Country Code": "IT",
    Accepted_documents: {
      "Codice fiscale": "CF",
      "Value Added Tax ID": "VAT Number",
    },
  },
  {
    _id: {
      $oid: "68948005c11c5f78ce471016",
    },
    "Country Name": "Jersey",
    "Country Code": "JE",
    Accepted_documents: {
      "Jersey Corporate Registry Number": "Register Number",
    },
  },
  {
    _id: {
      $oid: "68948005c11c5f78ce471017",
    },
    "Country Name": "Japan",
    "Country Code": "JP",
    Accepted_documents: {
      "Japan Corporate Number": "JCN",
    },
  },
  {
    _id: {
      $oid: "68948005c11c5f78ce471018",
    },
    "Country Name": "South Korea",
    "Country Code": "KR",
    Accepted_documents: {
      "Corporate registration number": "Registration Number",
    },
  },
  {
    _id: {
      $oid: "68948005c11c5f78ce471019",
    },
    "Country Name": "Cayman Islands",
    "Country Code": "KY",
    Accepted_documents: {
      "Cayman Islands Company Registration Number":
        "Company Registration Number",
    },
  },
  {
    _id: {
      $oid: "68948005c11c5f78ce47101a",
    },
    "Country Name": "Lithuania",
    "Country Code": "LT",
    Accepted_documents: {
      "Juridinio asmens kodas (Legal entity code)": "Kodas",
      "Value Added Tax ID": "VAT Number",
    },
  },
  {
    _id: {
      $oid: "68948005c11c5f78ce47101b",
    },
    "Country Name": "Luxembourg",
    "Country Code": "LU",
    Accepted_documents: {
      "RCS Number": "RCS Number",
      "Value Added Tax ID": "VAT Number",
    },
  },
  {
    _id: {
      $oid: "68948005c11c5f78ce47101c",
    },
    "Country Name": "Latvia",
    "Country Code": "LV",
    Accepted_documents: {
      "Registration Number": "Reģistrācijas numurs",
      "Value Added Tax ID": "VAT Number",
    },
  },
  {
    _id: {
      $oid: "68948005c11c5f78ce47101d",
    },
    "Country Name": "Malta",
    "Country Code": "MT",
    Accepted_documents: {
      "Company Registration Number": "Registration Number",
      "Value Added Tax ID": "VAT Number",
    },
  },
  {
    _id: {
      $oid: "68948005c11c5f78ce47101e",
    },
    "Country Name": "Mexico",
    "Country Code": "MX",
    Accepted_documents: {
      "Registro Federal de Contribuyentes": "RFC",
    },
  },
  {
    _id: {
      $oid: "68948005c11c5f78ce47101f",
    },
    "Country Name": "Malaysia",
    "Country Code": "MY",
    Accepted_documents: {
      "Company Registration Number or Business Registration Number": "CRN, BRN",
    },
  },
  {
    _id: {
      $oid: "68948005c11c5f78ce471020",
    },
    "Country Name": "Netherlands",
    "Country Code": "NL",
    Accepted_documents: {
      "KVK-nummer": "KVK-nummer",
      "Value Added Tax ID": "VAT Number",
    },
  },
  {
    _id: {
      $oid: "68948005c11c5f78ce471021",
    },
    "Country Name": "Norway",
    "Country Code": "NO",
    Accepted_documents: {
      "Organisation Number": "Organisasjonsnummer",
    },
  },
  {
    _id: {
      $oid: "68948005c11c5f78ce471022",
    },
    "Country Name": "New Zealand",
    "Country Code": "NZ",
    Accepted_documents: {
      "New Zealand Business Number": "NZBN",
    },
  },
  {
    _id: {
      $oid: "68948005c11c5f78ce471023",
    },
    "Country Name": "Philippines",
    "Country Code": "PH",
    Accepted_documents: {
      "Philippines Certificate No. / BNN": "BNN",
    },
  },
  {
    _id: {
      $oid: "68948005c11c5f78ce471024",
    },
    "Country Name": "Poland",
    "Country Code": "PL",
    Accepted_documents: {
      "Registration number": "Numer KRS",
      "Value Added Tax ID": "VAT Number",
    },
  },
  {
    _id: {
      $oid: "68948005c11c5f78ce471025",
    },
    "Country Name": "Sweden",
    "Country Code": "SE",
    Accepted_documents: {
      "Business Registration Number": "Organisationsnummer",
      "Value Added Tax ID": "VAT Number",
    },
  },
  {
    _id: {
      $oid: "68948005c11c5f78ce471026",
    },
    "Country Name": "Singapore",
    "Country Code": "SG",
    Accepted_documents: {
      "Unique Entity Number": "UEN",
    },
  },
  {
    _id: {
      $oid: "68948005c11c5f78ce471027",
    },
    "Country Name": "Slovenia",
    "Country Code": "SI",
    Accepted_documents: {
      "National business register identifier": "Matična številka",
      "Value Added Tax ID": "VAT Number",
    },
  },
  {
    _id: {
      $oid: "68948005c11c5f78ce471028",
    },
    "Country Name": "Slovakia",
    "Country Code": "SK",
    Accepted_documents: {
      "Business register number": "Identifikačné číslo organizácie",
      "Value Added Tax ID": "VAT Number",
    },
  },
  {
    _id: {
      $oid: "68948005c11c5f78ce471029",
    },
    "Country Name": "Thailand",
    "Country Code": "TH",
    Accepted_documents: {
      "Thailand Company Registration Number": "Registration Number",
    },
  },
  {
    _id: {
      $oid: "68948005c11c5f78ce47102a",
    },
    "Country Name": "Taiwan",
    "Country Code": "TW",
    Accepted_documents: {
      "Unified Business Number": "UBN",
    },
  },
  {
    _id: {
      $oid: "68948005c11c5f78ce47102b",
    },
    "Country Name": "United States",
    "Country Code": "US",
    Accepted_documents: {
      "Tax Identification Number (or Employer Identification Number)":
        "TIN / EIN",
    },
  },
  {
    _id: {
      $oid: "68948005c11c5f78ce47102c",
    },
    "Country Name": "British Virgin Islands",
    "Country Code": "VG",
    Accepted_documents: {
      "British Virgin Islands Company Number": "Company Number",
    },
  },
  {
    _id: {
      $oid: "68948005c11c5f78ce47102d",
    },
    "Country Name": "South Africa",
    "Country Code": "ZA",
    Accepted_documents: {
      "Registration Number": "Registration Number",
    },
  },
];

// Business profile
export const EmployeeRange: EmployeeRangeInterface[] = [
  { name: "1-10", value: "1-10" },
  { name: "11-25", value: "11-25" },
  { name: "26-50", value: "26-50" },
  { name: "51-100", value: "51-100" },
  { name: "101-250", value: "101-250" },
  { name: "251-500", value: "251-500" },
  { name: "500+", value: "500+" },
];

export const BusinessTypeData: EmployeeRangeInterface[] = [
  { name: "Manufacturer", value: "Manufacturer" },
  { name: "Distributor / Wholesaler", value: "Distributor / Wholesaler" },
  { name: "Trading Company", value: "Trading Company" },
  { name: "Retailer", value: "Retailer" },
  { name: "Importer / Exporter", value: "Importer / Exporter" },
];