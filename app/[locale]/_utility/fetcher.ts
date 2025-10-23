export async function serverFetcher<T = any>(
  path: string,
  baseUrl = process.env.NEXT_PUBLIC_API_URL_AG || "http://api-gateway:80/"
): Promise<T> {
  const url = `${baseUrl}${path}`;


  try {
    // Add timeout and additional options for better error handling
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout

    const res = await fetch(url, {
      method: "GET",
      cache: "no-store",
      signal: controller.signal,
      headers: {
        "Content-Type": "application/json",
        "User-Agent": "Pepagora-Frontend/1.0",
      },
    });

    clearTimeout(timeoutId);

    if (!res.ok) {
      throw new Error(`Fetch error: ${res.status} ${res.statusText}`);
    }

    const data = (await res.json()) as T;

    return data;
  } catch (error) {
    console.error(`[serverFetcher] GET ${url} failed:`, error);
    console.error(`[serverFetcher] Error details:`, {
      name: error instanceof Error ? error.name : "Unknown",
      message: error instanceof Error ? error.message : "Unknown error",
      stack: error instanceof Error ? error.stack : undefined,
    });

    // Additional error context
    if (error instanceof Error) {
      if (error.name === "AbortError") {
        console.error(`[serverFetcher] Request timed out after 10 seconds`);
      } else if (error.message.includes("ENOTFOUND")) {
        console.error(`[serverFetcher] DNS resolution failed - host not found`);
      } else if (error.message.includes("ECONNREFUSED")) {
        console.error(
          `[serverFetcher] Connection refused - service may be down`
        );
      } else if (error.message.includes("CERTIFICATE_VERIFY_FAILED")) {
        console.error(`[serverFetcher] SSL certificate verification failed`);
      }
    }

    throw error;
  }
}
