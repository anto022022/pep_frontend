
export interface AttachmentType {
  src: string;
  alt: string;
  exten: string;
  size: number;
}

export enum EndorsmentFlagEnum {
  UNVERIFIED_PURCHASE = "unverified_purchase",
  VERIFIED_PURCHASE = "verified_purchase",
  ENDORSED_BY_BUYER = "endorsed_by_buyer",
}

export enum ReviewFlagEnum {
  SPAM = "spam",
  INAPPROPRIATE = "inappropriate",
  OFFENSIVE = "offensive",
  FAKE = "fake",
  OTHER = "other",
}

export enum SortByEnum {
  NEWEST = "newest",
  OLDEST = "oldest",
  HIGHEST_RATING = "highest_rating",
  LOWEST_RATING = "lowest_rating",
}
export enum StarRatingEnum {
  ONE_STAR = "1star",
  TWO_STAR = "2stars",
  THREE_STAR = "3stars",
  FOUR_STAR = "4stars",
  FIVE_STAR = "5stars",
}

export enum ReviewTypeEnum {
  PRODUCT = "product",
  SUPPLIER = "supplier",
  APPLICATION = "application",
}

export enum ReviewStatusEnum {
  PENDING = "pending",
  APPROVED = "approved",
  REJECTED = "rejected",
}

export interface ReviewSchemaType {
  _id: string;
  userId: string;
  isHelpful: boolean;
  productId: string;
  reviewType: ReviewTypeEnum;
  rating: number;
  review: string;
  status: ReviewStatusEnum;
  approvedBy?: string;
  endorsmentFlag: EndorsmentFlagEnum;
  flag?: ReviewFlagEnum;
  flaggedBy?: string;
  flagReason?: string;
  flagComment?: string;
  attachments?: AttachmentType[];
  createdAt: Date;
  updatedAt: Date;
}

export interface UpdateProductReviewInterface {
  reviewId: string;
  review?: string;
  rating?: number;
  endorsmentFlag?: EndorsmentFlagEnum;
  flag?: ReviewFlagEnum;
  flagReason?: string;
  flagComment?: string;
  status?: ReviewStatusEnum;
  isHelpful?: boolean;
}
export interface CreateProductReviewInterface {
  productId: string;
  attachements?: AttachmentType[];
  rating: number;
  review?: string;
  endorsmentFlag?: EndorsmentFlagEnum;
}


export interface ProductReviewsListQuery {
  productId: string;
  page: number;
  limit: number;
  status?: ReviewStatusEnum;
  endorsmentFlag?: EndorsmentFlagEnum;
  isReviews?: boolean;
  sortByEnum?: SortByEnum;
  starRatingEnum?: StarRatingEnum;
  isAttachements?: boolean;
}

// Response interfaces for getProductReviewsList
export interface ReviewListItem {
  _id: string;
  productId: string;
  review: string;
  rating: number;
  endorsmentFlag: EndorsmentFlagEnum;
  attachments?: AttachmentType[];
  createdAt: Date;
  isHelpful: boolean;
  reviewerName: string;
}

export interface PaginatedListData {
  result: ReviewListItem[];
  totalPages: number;
  currentPage: number;
  totalListCount: number;
}

export interface RatingBreakdown {
  [key: number]: number; // 1: count, 2: count, 3: count, 4: count, 5: count
}

export interface ProductReviewsListResult {
  listData: PaginatedListData;
  totalItems: number;
  ratingBreakdown: RatingBreakdown;
}

export interface ProductReviewsListResponse {
  statusCode: number;
  message: string;
  data: ProductReviewsListResult;
}