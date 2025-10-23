import useCookies from "@/app/[locale]/_hooks/useCookies";
import {
  BaseQueryFn,
  createApi,
  FetchArgs,
  fetchBaseQuery,
  FetchBaseQueryError,
} from "@reduxjs/toolkit/query/react";
import {
  CreateProductReviewInterface,
  ProductReviewsListQuery,
  UpdateProductReviewInterface,
} from "../../_interface/review";

const getBaseQuery = () =>
  fetchBaseQuery({
    baseUrl: `${process.env.NEXT_PUBLIC_API_URL_AG || "https://api.sandbox.pepagora.org/"}markets/reviews`,
    prepareHeaders: (headers: Headers) => {
      const cookies = useCookies();

      const token = cookies.getCookie("userSession");
      if (token) {
        headers.set("userSession", token);
      }
      headers.set("Content-Type", "application/json");
      return headers;
    },
  });

const useBaseQuery: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  const rawBaseQuery = getBaseQuery();
  const result = await rawBaseQuery(args, api, extraOptions);

  if (result.error?.status === 401) {
  }

  return result;
};
export const reviewsApi = createApi({
  reducerPath: "reviewsApi",
  baseQuery: useBaseQuery,
  tagTypes: ["reviews"],
  endpoints: (build) => {
    return {
      getReviewsList: build.query<any, ProductReviewsListQuery>({
        query: ({
          page,
          limit,
          status,
          endorsmentFlag,
          isReviews,
          sortByEnum,
          starRatingEnum,
          isAttachements,
          productId,
        }) => ({
          method: "GET",
          url: `/product-list/${productId}`,
          params: {
            ...(page && { page }),
            ...(limit && { limit }),
            ...(status && { status }),
            ...(endorsmentFlag && { endorsmentFlag }),
            ...(isReviews && { isReviews }),
            ...(sortByEnum && { sortByEnum }),
            ...(starRatingEnum && { starRatingEnum }),
            ...(isAttachements && { isAttachements }),
          },
        }),
        providesTags: ["reviews"],
      }),
      createReview: build.mutation<any, CreateProductReviewInterface>({
        query: (data) => ({
          method: "POST",
          url: `/product-create`,
          body: data,
        }),
        invalidatesTags: ["reviews"],
      }),
      updateReview: build.mutation<any, UpdateProductReviewInterface>({
        query: ({
          reviewId,
          rating,
          review,
          endorsmentFlag,
          flag,
          flagReason,
          flagComment,
          isHelpful,
          status,
        }) => ({
          method: "PATCH",
          url: `/product-update/${reviewId}`,
          body: {
            rating,
            review,
            endorsmentFlag,
            flag,
            flagReason,
            flagComment,
            isHelpful,
            status,
          },
        }),
        invalidatesTags: ["reviews"],
      }),
    };
  },
});

export const {
  useGetReviewsListQuery,
  useLazyGetReviewsListQuery,
  useCreateReviewMutation,
  useUpdateReviewMutation,
} = reviewsApi;
