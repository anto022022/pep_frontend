import useCookies from "@/app/[locale]/_hooks/useCookies";
import { showToast } from "@/app/[locale]/_store/reducers/ui_store";
import {
  BaseQueryFn,
  FetchArgs,
  fetchBaseQuery,
  FetchBaseQueryError,
} from "@reduxjs/toolkit/query/react";

export const getBaseQuery = (customBaseUrl?: string) =>
  fetchBaseQuery({
    baseUrl:
      customBaseUrl ||
      `${process.env.NEXT_PUBLIC_API_URL_AG ||
      "https://api.sandbox.pepagora.org/"
      }`,
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

export const useBaseQuery: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  let adjustedArgs = args;
  let customBaseUrl: string | undefined;

  if (typeof args === "object" && "meta" in args && args.meta?.customBaseUrl) {
    customBaseUrl = args.meta.customBaseUrl;
    const { meta, ...rest } = args;
    adjustedArgs = rest;
  }

  const rawBaseQuery = getBaseQuery(customBaseUrl);
  const result = await rawBaseQuery(adjustedArgs, api, extraOptions);

  if (result.error?.status === 401) {
    // handle unauthorized here
  }

  return result;
};

interface ApiErrorResponse {
  message?: string;
  [key: string]: any;
}

const showErrorToast = (api: any, title: string, message: string) => {
  api.dispatch(
    showToast({
      title,
      message,
      theme: "error",
    })
  );
};

export const useSettingsBaseQuery: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  let adjustedArgs = args;
  let customBaseUrl: string | undefined;

  if (
    typeof args === "object" &&
    "meta" in args &&
    (args as FetchArgs & { meta?: { customBaseUrl?: string } }).meta
      ?.customBaseUrl
  ) {
    const { meta, ...rest } = args as FetchArgs & {
      meta?: { customBaseUrl?: string };
    };
    customBaseUrl = meta?.customBaseUrl;
    adjustedArgs = rest;
  }

  const rawBaseQuery = getBaseQuery(customBaseUrl);
  const result = await rawBaseQuery(adjustedArgs, api, extraOptions);

  if (result.error?.status === 401) {
    // handle unauthorized here
  }

  // Handle 404
  if (result.error?.status === 404) {
    showErrorToast(api, "Not Found", "The requested resource was not found.");
  }
  // Handle other errors
  else if (result.error && result.error.status !== 401) {
    const errorData = result.error.data as ApiErrorResponse;
    const errorMessage = errorData?.message || "Something went wrong!";
    showErrorToast(api, "Request Failed", errorMessage);
  }

  return result;
};
