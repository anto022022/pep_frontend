export interface SearchProductImage {
  src: string;
  alt: string;
  exten: string;
  size: number;
}

export interface SearchCategory {
  _id: string;
  name: string;
  uniqueId: string;
}

export interface SearchSubCategory {
  _id: string;
  name: string;
  uniqueId: string;
}

export interface SearchProductResults {
  _id: string;
  productName: string;
  category: SearchCategory;
  subCategory: SearchSubCategory;
  productImage: SearchProductImage[];
  uniqueId: string;
  liveUrl: string;
}
