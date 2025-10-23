export interface TableHeaders {
  id: number;
  field?: string;
  visible: boolean;
  header?: string;
  props?: any;
  disabled: boolean;
}

// export interface TableHeaderLanguages {
//   en?: string;
//   ar?: string;
//   ta?:string;
//   hi?:string
// }

export interface CommonResponseStructure<T> {
  statusCode: number;
  message: string;
  error?: string;
  data: T;
}

export interface CategoriesListInterface {
  _id: string;
  uniqueId: string;
  name: string;
  liveUrl: string;
}

export interface CategoryHomeInterface {
  _id: string;
  uniqueId: string;
  name: string;
  liveUrl: string;
  mappedChildrenCount: number;
}

export type CategoriesListArrayInterface = Array<CategoriesListInterface>;

export type CategoryHomeArrayInterface = Array<CategoryHomeInterface>;

export interface VirtualScrollerProps {
  itemSize: number;
  lazy?: boolean;
  showLoader?: boolean;
  loading?: boolean;
}

export interface Upload {
  src: string;
  alt: string;
  exten: string;
  size: number;
}
export interface NewsletterSubscribeDto {
  email: string;

  phoneNumber?: string;

  country?: string;
}

export interface ConsentInterface {
  userId?: string;
  // ip: string;
  consent: boolean;
  userAgent?: string;
  meta?: Record<string, any>;
}
