import { useSettingsBaseQuery } from "@/app/[locale]/_hooks/usebaseQuery";
import { createApi } from "@reduxjs/toolkit/query/react";
import { CommonResponseStructure } from "../../_interface/common";
export interface CountryDocumentsRequest {
  country_name: string;
}

// Interface for the response data structure
export interface CountryDocumentsResponse {
  country_name: string;
  documents: [
    {
      label: string;
      value: string;
    }
  ];
}
export const settingApi = createApi({
  reducerPath: "settingApi",
  baseQuery: useSettingsBaseQuery,
  tagTypes: ["settingApi", "countryDocuments"],
  endpoints: (build) => {
    return {
      getKycDetails: build.query<CommonResponseStructure<any>, void>({
        query: () => `account-settings/compliance-kyc-document`,
        providesTags: ["settingApi"],
      }),
      updateKyc: build.mutation<any, any>({
        query: (data) => ({
          url: `/account-settings/update-compliance-kyc-document`,
          method: "PATCH",
          body: data,
        }),
        invalidatesTags: ["settingApi"],
      }),

      getKybDetails: build.query<CommonResponseStructure<any>, void>({
        query: () => `account-settings/compliance-kyb-document`,
        providesTags: ["settingApi"],
      }),

      getBusinessProfile: build.query<CommonResponseStructure<any>, void>({
        query: () => `account-settings/business-profile-verify`,
        providesTags: ["settingApi"],
      }),
      updateKyb: build.mutation<any, any>({
        query: (data) => ({
          url: `/account-settings/update-compliance-kyb-document`,
          method: "PATCH",
          body: data,
        }),
        invalidatesTags: ["settingApi"],
      }),

      updateUbo: build.mutation<any, any>({
        query: (data) => ({
          url: `/account-settings/update-compliance-ubo-user`,
          method: "PATCH",
          body: data,
        }),
        invalidatesTags: ["settingApi"],
      }),

      updateComplianceUbo: build.mutation<
        any,
        { id: string; userId: string; data: any }
      >({
        query: ({ id, userId, data }) => ({
          url: `/account-settings/update-compliance-ubo-user-details?_id=${id}&userId=${userId}`,
          method: "PATCH",
          body: data,
        }),
        invalidatesTags: ["settingApi"],
      }),

      getProfileDetails: build.query<CommonResponseStructure<any>, void>({
        query: () => `personal-settings/get-profile-details`,
        providesTags: ["settingApi"],
      }),
      getBusinessDetails: build.query<CommonResponseStructure<any>, void>({
        query: () => `account-settings/get-account-details`,
        providesTags: ["settingApi"],
      }),
      updateProfileDetails: build.mutation<any, any>({
        query: (data) => ({
          url: `/personal-settings/update-profile`,
          method: "PATCH",
          body: data,
        }),
        invalidatesTags: ["settingApi"],
      }),

      updateNotificationDetails: build.mutation<any, any>({
        query: (data) => ({
          url: `/personal-settings/update-notification`,
          method: "PATCH",
          body: data,
        }),
        invalidatesTags: ["settingApi"],
      }),

      updateDataPrivacyDetails: build.mutation<any, any>({
        query: (data) => ({
          url: `/account-settings/update-data-privacy-settings`,
          method: "PATCH",
          body: data,
        }),
        invalidatesTags: ["settingApi"],
      }),
      updateBusinessSettings: build.mutation<any, any>({
        query: (data) => ({
          url: `/account-settings/update-business-settings`,
          method: "PATCH",
          body: data,
        }),
        invalidatesTags: ["settingApi"],
      }),
      updatebusinessTaxInfo: build.mutation<any, any>({
        query: (data) => ({
          url: `/account-settings/update-business-tax`,
          method: "PATCH",
          body: data,
        }),
        invalidatesTags: ["settingApi"],
      }),
      sendMailOtp: build.mutation<any, any>({
        query: (data) => ({
          url: `auth/settingsSendEmailOtp`,
          method: "POST",
          body: data,
          meta: {
            customBaseUrl: `${
              process.env.NEXT_PUBLIC_API_URL_IDN ||
              "https://identity-api.sandbox.pepagora.org/"
            }`,
          },
        }),
        invalidatesTags: ["settingApi"],
      }),
            sendMobileOtp: build.mutation<any, any>({
        query: (data) => ({
          url: `auth/sendSettingsPhoneOtp`,
          method: "POST",
          body: data,
          meta: {
            customBaseUrl: `${
              process.env.NEXT_PUBLIC_API_URL_IDN ||
              "https://identity-api.sandbox.pepagora.org/"
            }`,
          },
        }),
        invalidatesTags: ["settingApi"],
      }),
      sendOptVerificaion: build.mutation<any, any>({
        query: (data) => ({
          url: `auth/otp-verify`,
          method: "PATCH",
          body: data,
          meta: {
            customBaseUrl: `${
              process.env.NEXT_PUBLIC_API_URL_IDN ||
              "https://identity-api.sandbox.pepagora.org/"
            }`,
          },
        }),
        invalidatesTags: ["settingApi"],
      }),

      updateMembershipBillingAddress: build.mutation<any, any>({
        query: (data) => ({
          url: `account-settings/update-membership-billing-address`,
          method: "PATCH",
          body: data,
        }),
        invalidatesTags: ["settingApi"],
      }),

      updatePaymentMethod: build.mutation<any, any>({
        query: (data) => ({
          url: `account-settings/update-membership-billing-payment-details`,
          method: "PATCH",
          body: data,
        }),
        invalidatesTags: ["settingApi"],
      }),
      updateMembershipAutoRenewal: build.mutation<any, any>({
        query: (data) => ({
          url: `account-settings/update-membership-auto-renewal`,
          method: "PATCH",
          body: data,
        }),
        invalidatesTags: ["settingApi"],
      }),
      getMembershipDetails: build.query<CommonResponseStructure<any>, void>({
        query: () => `account-settings/get-membership-billing-details`,
        providesTags: ["settingApi"],
      }),
      // getCountryDocuments: build.query<
      //   CommonResponseStructure<CountryDocumentsResponse>,
      //   CountryDocumentsRequest
      // >({
      //   query: (data) => ({
      //     url: `account-settings/country-documents`,
      //     method: "POST",
      //     body: data,
      //   }),
      //   providesTags: ["countryDocuments"],
      // }),
     
      getCountryDocuments: build.query<any, { country_name?: string }>({
        query: ({ country_name }) => ({
          url: 'account-settings/country-documents',
          method: 'GET',
          params: country_name ? { country_name } : {}, 
        }),
      }),

    };
  },
});

export const {
  useGetKycDetailsQuery,
  useGetBusinessProfileQuery,
  useUpdateKycMutation,
  useGetKybDetailsQuery,
  useUpdateKybMutation,
  useUpdateUboMutation,
  useUpdateComplianceUboMutation,
  useGetProfileDetailsQuery,
  useUpdateProfileDetailsMutation,
  useUpdateNotificationDetailsMutation,
  useUpdateDataPrivacyDetailsMutation,
  useUpdatebusinessTaxInfoMutation,
  useGetBusinessDetailsQuery,
  useUpdateBusinessSettingsMutation,
  useSendMailOtpMutation,
  useSendMobileOtpMutation,
  useSendOptVerificaionMutation,
  useUpdateMembershipBillingAddressMutation,
  useUpdatePaymentMethodMutation,
  useUpdateMembershipAutoRenewalMutation,
  useGetMembershipDetailsQuery,
  useLazyGetCountryDocumentsQuery
} = settingApi;
