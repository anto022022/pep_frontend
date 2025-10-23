import useCookies from "@/app/[locale]/_hooks/useCookies";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const baseQuery = fetchBaseQuery({
    baseUrl: `${process.env.NEXT_PUBLIC_API_URL_IDN || "https://identity-api.sandbox.pepagora.org/"}payments/`,
    prepareHeaders: (headers: any) => {
        const cookies = useCookies();
        const token = cookies.getCookie("userSession");

        if (token) {
            headers.set("userSession", token);
        }
        headers.set("Content-Type", "application/json");
        return headers;
    },
});

export const paymentsApi = createApi({
    reducerPath: "paymentsApi",
    baseQuery: baseQuery,
    tagTypes: [
        'Packages',
        'PackageDetails', 
        'PlanStatus',
        'PaymentIntent',
        'PaymentHistory',
        'CountryConfig'
    ],
    endpoints: (build) => {
        return {
            // Get available packages
            getAvailablePackages: build.query<any, void>({
                query: () => `packages`,
                providesTags: ['Packages'],
            }),

            // Get package details
            getPackageDetails: build.query<any, string>({
                query: (planId) => `packages/${planId}`,
                providesTags: (result, error, planId) => [
                    { type: 'PackageDetails', id: planId }
                ],
            }),

            // Get current plan status
            getCurrentPlanStatus: build.query<any, string>({
                query: (userId) => `packages/status/${userId}`,
                providesTags: (result, error, userId) => [
                    { type: 'PlanStatus', id: userId }
                ],
            }),

            // Compare plans
            comparePlans: build.query<any, { currentPlan: string; targetPlan: string }>({
                query: ({ currentPlan, targetPlan }) => 
                    `packages/compare?currentPlan=${currentPlan}&targetPlan=${targetPlan}`,
                providesTags: ['Packages'],
            }),

            // Get country payment configuration
            getCountryPaymentConfig: build.query<any, string>({
                query: (countryCode) => `countries/${countryCode}/config`,
                providesTags: (result, error, countryCode) => [
                    { type: 'CountryConfig', id: countryCode }
                ],
            }),

            // Get payment history
            getPaymentHistory: build.query<any, string>({
                query: (userId) => `history/${userId}`,
                providesTags: ['PaymentHistory'],
            }),

            // Create payment intent
            createPaymentIntent: build.mutation<any, any>({
                query: (paymentData) => ({
                    url: 'create-intent',
                    method: 'POST',
                    body: paymentData,
                }),
                invalidatesTags: ['PaymentIntent'],
            }),

            // Process payment
            processPayment: build.mutation<any, any>({
                query: (paymentData) => ({
                    url: 'process',
                    method: 'POST',
                    body: paymentData,
                }),
                invalidatesTags: ['PaymentHistory', 'PlanStatus'],
            }),

            // Verify payment
            verifyPayment: build.query<any, { 
                paymentId: string; 
                countryCode: string; 
                paymentMethod: string; 
                signature?: string 
            }>({
                query: ({ paymentId, countryCode, paymentMethod, signature }) => {
                    let url = `verify/${paymentId}?countryCode=${countryCode}&paymentMethod=${paymentMethod}`;
                    if (signature) {
                        url += `&signature=${signature}`;
                    }
                    return url;
                },
                providesTags: ['PaymentHistory'],
            }),

            // Initiate package upgrade
            initiatePackageUpgrade: build.mutation<any, any>({
                query: (upgradeRequest) => ({
                    url: 'packages/upgrade',
                    method: 'POST',
                    body: upgradeRequest,
                }),
                invalidatesTags: ['Packages', 'PlanStatus'],
            }),

            // Start trial
            startTrial: build.mutation<any, { userId: string; trialDays?: number }>({
                query: ({ userId, trialDays = 7 }) => ({
                    url: `packages/trial/${userId}?trialDays=${trialDays}`,
                    method: 'POST',
                }),
                invalidatesTags: ['PlanStatus'],
            }),

            // Cancel package/subscription
            cancelPackage: build.mutation<any, string>({
                query: (userId) => ({
                    url: `packages/cancel/${userId}`,
                    method: 'POST',
                }),
                invalidatesTags: ['PlanStatus', 'Packages'],
            }),

            // Update membership auto-renewal
            updateMembershipAutoRenewal: build.mutation<any, any>({
                query: (autoRenewalData) => ({
                    url: 'membership/auto-renewal',
                    method: 'PUT',
                    body: autoRenewalData,
                }),
                invalidatesTags: ['PlanStatus'],
            }),

            // Get membership details
            getMembershipDetails: build.query<any, void>({
                query: () => 'membership/details',
                providesTags: ['PlanStatus'],
            }),

            // Update billing information
            updateBillingInformation: build.mutation<any, any>({
                query: (billingData) => ({
                    url: 'billing/information',
                    method: 'PUT',
                    body: billingData,
                }),
                invalidatesTags: ['PlanStatus'],
            }),

            // Update payment method
            updatePaymentMethod: build.mutation<any, any>({
                query: (paymentMethodData) => ({
                    url: 'payment-method',
                    method: 'PUT',
                    body: paymentMethodData,
                }),
                invalidatesTags: ['PlanStatus'],
            }),
        };
    },
});

export const {
    useGetAvailablePackagesQuery,
    useGetPackageDetailsQuery,
    useGetCurrentPlanStatusQuery,
    useComparePlansQuery,
    useGetCountryPaymentConfigQuery,
    useGetPaymentHistoryQuery,
    useCreatePaymentIntentMutation,
    useProcessPaymentMutation,
    useVerifyPaymentQuery,
    useInitiatePackageUpgradeMutation,
    useStartTrialMutation,
    useCancelPackageMutation,
    useUpdateMembershipAutoRenewalMutation,
    useGetMembershipDetailsQuery,
    useUpdateBillingInformationMutation,
    useUpdatePaymentMethodMutation,
} = paymentsApi;
