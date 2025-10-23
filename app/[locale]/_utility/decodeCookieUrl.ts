// utils/decodeCountryCookie.ts
export function decodeCountryCookie(
  fallback: string,
  encodedCountry?: string
): string {
  if (!encodedCountry) return fallback;

  try {
    return Buffer.from(encodedCountry, "base64").toString("utf8");
  } catch (error) {
    console.error("Failed to decode country cookie:", error);
    return fallback;
  }
}
