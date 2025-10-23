// hooks/useFetch.ts

// import { useMiddlewareValidator } from "../utils/middlewareValidator";
import { useFetchMiddleware } from "./useFetchMiddleware";

export const useFetchRequest = () => {
  const { fetchInterceptor } = useFetchMiddleware();
  //   const { middlewareValidator } = useMiddlewareValidator();

  const request = async (
    method: string,
    url: string,
    payload?: any,
    customHeaders?: HeadersInit
  ): Promise<any> => {
    const storedToken = localStorage.getItem("accessToken") || "";
    const defaultHeaders: HeadersInit = {
      Authorization: `Bearer ${storedToken}`,
    };

    const headers: HeadersInit = {
      ...defaultHeaders,
      ...customHeaders,
    };

    // const isValid = middlewareValidator(url, headers);
    // if (!isValid.validCall) {
    //   return Promise.reject(isValid.message);
    // }

    const response = await fetchInterceptor(url, {
      method,
      headers,
      body: payload ? JSON.stringify(payload) : undefined,
    });

    return response.json();
  };

  return { request };
};

///    const data = await request("GET", "https://api.example.com/data");
