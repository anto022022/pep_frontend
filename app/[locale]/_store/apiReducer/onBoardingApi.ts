import { CommonResponseStructure } from "@/app/[locale]/_interface/common";
import {
  BusinessDetailsData,
  BusinessOperationData,
  BusinessRepresentativeData,
  ContactInformationData,
  SourcingDetailsData,
  StageAndBusinessType,
  UserSessionData,
  UserTypeData,
} from "@/app/[locale]/_interface/OnboardInterface";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import useCookies from "../../_hooks/useCookies";

const baseQuery = fetchBaseQuery({
  baseUrl: `${
    process.env.NEXT_PUBLIC_API_URL_IDN ||
    "https://identity-api.sandbox.pepagora.org/"
  }`,
  prepareHeaders: (headers: any) => {
    const cookies = useCookies();
    const token = cookies.getCookie("onboardSession");

    if (token) {
      headers.set("onboardSession", token);
    }
    headers.set("Content-Type", "application/json");
    return headers;
  },
});

const baseQueryWithRefresh = async (args: any, api: any, extraOptions: any) => {
  const result = await baseQuery(args, api, extraOptions);
  if (result.error?.status === 401) {
    // refresh token logic
  }
  return result;
};
export const onBoardingApi = createApi({
  reducerPath: "onBoardingApi",
  baseQuery: baseQueryWithRefresh,
  tagTypes: ["onBoardingApi"],
  endpoints: (build) => {
    return {
      getUserBusinessTypeAndStage: build.query<
        CommonResponseStructure<StageAndBusinessType>,
        void
      >({
        query: () => "onboarding/get-user-stage",
        providesTags: ["onBoardingApi"],
      }),
      getUserType: build.query<CommonResponseStructure<UserTypeData>, void>({
        query: () => "onboarding/get-user-type",
        providesTags: ["onBoardingApi"],
      }),
      getStageDetailData: build.query<
        CommonResponseStructure<any>,
        { stage: string }
      >({
        query: ({ stage }) => `onboarding/get-user-staging-data/${stage}`,
        providesTags: ["onBoardingApi"],
      }),
      updateUserType: build.mutation<void, UserTypeData>({
        query: (data) => ({
          url: "onboarding/update-user-type",
          method: "POST",
          body: data,
        }),
        invalidatesTags: ["onBoardingApi"],
      }),
      postBusinessDetails: build.mutation<void, BusinessDetailsData>({
        query: (data) => ({
          url: "onboarding/business-details",
          method: "POST",
          body: data,
        }),
        invalidatesTags: ["onBoardingApi"],
      }),
      updateBusinessDetails: build.mutation<void, BusinessDetailsData>({
        query: (data) => ({
          url: "onboarding/business-details",
          method: "PATCH",
          body: data,
        }),
        invalidatesTags: ["onBoardingApi"],
      }),
      updateBusinessOperation: build.mutation<
        CommonResponseStructure<UserSessionData>,
        BusinessOperationData & { skipCacheUpdate: boolean }
      >({
        query: (data) => ({
          url: "onboarding/business-operations",
          method: "PATCH",
          body: data,
        }),
        invalidatesTags: (_result, _error, { skipCacheUpdate }) =>
          skipCacheUpdate ? [] : ["onBoardingApi"],
      }),
      updateContactInformation: build.mutation<void, ContactInformationData>({
        query: (data) => ({
          url: "onboarding/contact-information",
          method: "PATCH",
          body: data,
        }),
        invalidatesTags: ["onBoardingApi"],
      }),
      updateRepresentativeDetails: build.mutation<
        CommonResponseStructure<UserSessionData>,
        BusinessRepresentativeData & { skipCacheUpdate: boolean }
      >({
        query: (data) => ({
          url: "onboarding/representative-information",
          method: "PATCH",
          body: data,
        }),
        invalidatesTags: (_result, _error, { skipCacheUpdate }) =>
          skipCacheUpdate ? [] : ["onBoardingApi"],
      }),
      updateSourcingDetails: build.mutation<
        CommonResponseStructure<UserSessionData>,
        SourcingDetailsData & { skipCacheUpdate: boolean }
      >({
        query: (data) => ({
          url: "onboarding/sourcing-details",
          method: "PATCH",
          body: data,
        }),
        invalidatesTags: (_result, _error, { skipCacheUpdate }) =>
          skipCacheUpdate ? [] : ["onBoardingApi"],
      }),
      updateSkipOnboarding: build.mutation<
        CommonResponseStructure<UserSessionData>,
        void
      >({
        query: () => ({
          url: "onboarding/skip-onboarding",
          method: "PATCH",
        }),
      }),
    };
  },
});

export const {
  useGetUserBusinessTypeAndStageQuery,
  useGetUserTypeQuery,
  useGetStageDetailDataQuery,
  usePostBusinessDetailsMutation,
  useUpdateBusinessDetailsMutation,
  useUpdateBusinessOperationMutation,
  useUpdateContactInformationMutation,
  useUpdateRepresentativeDetailsMutation,
  useUpdateSourcingDetailsMutation,
  useUpdateSkipOnboardingMutation,
  useUpdateUserTypeMutation,
} = onBoardingApi;
