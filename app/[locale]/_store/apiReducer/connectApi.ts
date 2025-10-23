import { SalesConnectListInterface } from "@/app/[locale]/(pages)/app/(sales)/sales-connect/page";
import { ContactFormValues } from "@/app/[locale]/_components/OverLay/AddNewContactForm";
import { useBaseQuery } from "@/app/[locale]/_hooks/usebaseQuery";
import { CommonResponseStructure } from "@/app/[locale]/_interface/common";
import {
  ContactDetail,
  ContactsListResponse,
  MessageItem,
} from "@/app/[locale]/_interface/ConnectInterface";
import { createApi } from "@reduxjs/toolkit/query/react";

export const connectApi = createApi({
  reducerPath: "connectApi",
  baseQuery: useBaseQuery,
  tagTypes: ["connectApi", "contacts", "messages"],
  endpoints: (build) => {
    return {
      addNewContact: build.mutation<ContactFormValues, any>({
        query: (data) => ({
          url: `sales/customers/add-contact`,
          method: "POST",
          body: data,
        }),
        invalidatesTags: ["connectApi"],
      }),
      getContactsList: build.query<
        CommonResponseStructure<ContactsListResponse>,
        SalesConnectListInterface
      >({
        query: (params) => ({
          url: `/sales/customers/contacts-list`,
          params,
        }),
        providesTags: ["connectApi"],
      }),
      getContactDetails: build.query<
        CommonResponseStructure<ContactDetail>,
        any
      >({
        query: (id) => `sales/customers/get-connect-details/${id}`,
        providesTags: ["connectApi"],
      }),
      updateCustomerInformation: build.mutation<any, any>({
        query: ({ data, id }) => ({
          url: `sales/customers/update-contact/${id}`,
          method: "PATCH",
          body: data,
        }),
        invalidatesTags: (_result, _error, { skipCacheUpdate }) =>
          skipCacheUpdate ? [] : ["connectApi"],
      }),
      updateContactArchive: build.mutation<any, any>({
        query: (data) => ({
          url: `sales/customers/contact-archive`,
          method: "PATCH",
          body: data,
        }),
        invalidatesTags: (_result, _error, { skipCacheUpdate }) =>
          skipCacheUpdate ? [] : ["connectApi"],
      }),
      getDropdownList: build.query<any, any>({
        query: ({ page, limit }) =>
          `sales/customers/dropdown-list?limit=${limit}&page=${page}`,
        providesTags: ["connectApi"],
      }),
      addContactMessage: build.mutation<MessageItem, any>({
        query: ({ data, id }) => ({
          url: `/source/message/create/${id}`,
          method: "POST",
          body: data,
          providesTags: ["messages"],
        }),
        invalidatesTags: ["connectApi"],
      }),
      getContactThreadDetails: build.query<any, any>({
        query: ({ threadId, pageType, limit, page, pageId }) =>
          `source/message/get-thread?pageType=${pageType}&page=${page}&limit=${limit}&pageId=${pageId}`,
        providesTags: ["connectApi"],
      }),
      updateMessageStatus: build.mutation<any, any>({
        query: ({ data, id }) => ({
          url: `source/message/update-status/${id}`,
          method: "PATCH",
          body: data,
        }),
      }),
    };
  },
});

export const {
  useAddNewContactMutation,
  useGetContactsListQuery,
  useGetContactDetailsQuery,
  useUpdateContactArchiveMutation,
  useUpdateCustomerInformationMutation,
  useGetDropdownListQuery,
  useAddContactMessageMutation,
  useGetContactThreadDetailsQuery,
} = connectApi;
