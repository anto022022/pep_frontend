import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import useCookies from "../../_hooks/useCookies";

const baseQuery = fetchBaseQuery({
  baseUrl: `${
    process.env.NEXT_PUBLIC_API_URL_AG || "https://api.sandbox.pepagora.org/"
  }`,
  prepareHeaders: (headers) => {
    const cookies = useCookies();
    const token = cookies.getCookie("userSession");

    if (token) {
      headers.set("userSession", token);
    }
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

export const fileUploadApi = createApi({
  reducerPath: "fileUploadApi",
  baseQuery: baseQueryWithRefresh,
  tagTypes: ["fileUpload"],
  endpoints: (build) => {
    return {
      uploadImageFile: build.mutation<any, any>({
        query: (formData) => ({
          url: "file/fileAttachment",
          // url: "file/upload-multiple",
          // url: "utility/fileAttachment",
          method: "POST",
          body: formData,
        }),
      }),
    };
  },
});

export const { useUploadImageFileMutation } = fileUploadApi;
