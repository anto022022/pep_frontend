// utils/fetchMiddleware.ts

export const useFetchMiddleware = () => {
  const headers: HeadersInit = {
    "Access-Control-Allow-Private-Network": "true",
    "Content-Type": "application/json",
    "Access-Control-Allow-Methods": "GET,OPTIONS,POST,PUT",
  };

  const fetchInterceptor = async (
    url: string,
    options: RequestInit = {}
  ): Promise<Response> => {
    try {
      const response = await fetch(url, {
        ...options,
        headers: {
          ...headers,
          ...options.headers,
        },
      });

      // if (!response.ok) {
      //   if (response.status === 401 && retry) {
      //     const newToken = await initializeRefresh();
      //     if (!newToken) {
      //       throw new Error("Session expired. Please log in again.");
      //     }

      //     // Retry with the new token
      //     return fetchInterceptor(url, {
      //       ...options,
      //       headers: {
      //         ...options.headers,
      //         Authorization: `Bearer ${newToken}`,
      //       },
      //     }, false);
      //   }
      //   throw new Error(`HTTP error! Status: ${response.status}`);
      // }

      return response;
    } catch (error) {
      return Promise.reject(error);
    }
  };

  return { fetchInterceptor };
};
