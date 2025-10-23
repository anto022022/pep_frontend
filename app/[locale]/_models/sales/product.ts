export interface productCategory {
  _id: string;
  uniqueId: string;
  value: string;
  name?: string;
}

export interface productImages {
  src: string;
}

export interface productInformation {
  productName: string;
  productKeywords: [];
  category: productCategory;
  subCategory: productCategory;
  productGroup: [];
  productDescription: string;
  images: Array<productImages>;
  video: string;
  referenceCode: string;
}

export const industryOption = [
  {
    name: "Machinery & Equipment",
    value: "machinery-equipment",
  },
  {
    name: "Industrial Supplies",
    value: "industrial-supplies",
  },
  {
    name: "Tools & Hardware",
    value: "tools-hardware",
  },
  {
    name: "Electrical & Electronics",
    value: "electrical-electronics",
  },
  {
    name: "Metals & Alloys",
    value: "metals-alloys",
  },
  {
    name: "Packaging & Printing",
    value: "packaging-printing",
  },
  {
    name: "Agriculture Equipment & Supplies",
    value: "agriculture-supplies",
  },
  {
    name: "Food & Beverages",
    value: "food-beverages",
  },
  {
    name: "Textiles & Apparel",
    value: "textiles-apparel",
  },
  {
    name: "Building Materials",
    value: "building-materials",
  },
  {
    name: "Auto Parts & Accessories",
    value: "auto-parts",
  },
  {
    name: "Medical Equipment & Supplies",
    value: "medical-supplies",
  },
  {
    name: "IT & Electronics",
    value: "it-electronics",
  },
  {
    name: "Renewable Energy",
    value: "renewable-energy",
  },
  {
    name: "Business & Services",
    value: "business-services",
  },
];

export const savedContacts = [
  {
    id: 1,
    img: "/img/saved-contacts-1.png",
    name: "Aneesh Exports",
    manufactures: "Manufacturers | Madurai",
  },
  {
    id: 2,
    img: "/img/saved-contacts-2.png",
    name: "Duo Exports",
    manufactures: "Manufacturers | Madurai",
  },
  {
    id: 3,
    img: "/img/saved-contacts-3.png",
    name: "Angle Exports",
    manufactures: "Manufacturers | Madurai",
  },
  {
    id: 4,
    img: "/img/saved-contacts-4.png",
    name: "Duo Exports",
    manufactures: "Manufacturers | Madurai",
  },
  {
    id: 5,
    img: "/img/saved-contacts-5.png",
    name: "Caty Exports",
    manufactures: "Manufacturers | Madurai",
  },
  {
    id: 6,
    img: "/img/saved-contacts-6.png",
    name: "Bearing Exports",
    manufactures: "Manufacturers | Madurai",
  },
];
