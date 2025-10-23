// Server-side location utility
export async function getLocationData() {
  try {
    const response = await fetch(
      `https://ipapi.co/json/?key=${process.env.NEXT_IPAPI_KEY ||
      "sXQskzXLShTIsCr5U98XaBFfzx0vWjUsLXLF1jZSRyHQgokt3V"
      }`,
      {
        next: { revalidate: 0 }, // Always fetch fresh data
        headers: {
          'User-Agent': 'Pepagora-Server/1.0'
        }
      }
    );
    if (response.ok) {
      const data = await response.json();
      console.log("data", data);
      return {
        country: data.country_name || "India",
        city: data.city || "Coimbatore",
        countryCode: data.country_code || "IN",
        currency: data.currency || "INR",
        region: data.region,
        regionCode: data.region_code,
        countryCodeIso3: data.country_code_iso3,
        countryCapital: data.country_capital,
        postal: data.postal,
        timezone: data.timezone,
        utcOffset: data.utc_offset,
        countryCallingCode: data.country_calling_code,
        currencyName: data.currency_name,
        languages: data.languages,
        success: true
      };
    }
  } catch (error) {
    console.log("Failed to fetch server-side location:", error);
  }

  return {
    country: "India",
    city: "Coimbatore",
    countryCode: "IN",
    currency: "INR",
    region: "",
    regionCode: "",
    countryCodeIso3: "",
    countryCapital: "",
    postal: "",
    timezone: "",
    utcOffset: "",
    countryCallingCode: "",
    currencyName: "",
    languages: "",
    success: false
  };
}

export function encodeLocationCookies(country: string, city: string, currency: string, countryCode: string) {
  return {
    cr_ctry: Buffer.from(country).toString("base64"),
    cr_cty: Buffer.from(city).toString("base64"),
    currencyCode: currency,
    countryCode: countryCode
  };
}

export async function setLocationCookies(cookieStore: any, locationData: any) {
  try {
    const encodedCookies = encodeLocationCookies(
      locationData.country,
      locationData.city,
      locationData.currency,
      locationData.countryCode
    );

    // Set location cookies
    cookieStore.set("cr_ctry", encodedCookies.cr_ctry);
    cookieStore.set("cr_cty", encodedCookies.cr_cty);

    // Only set currencyCode if it doesn't already exist
    const existingCurrency = cookieStore.get("currencyCode")?.value;
    if (!existingCurrency) {
      cookieStore.set("currencyCode", encodedCookies.currencyCode);
    }
    cookieStore.set("countryCode", encodedCookies.countryCode);

    // Set timestamp for location freshness check
    cookieStore.set("location_timestamp", Date.now().toString());

    return true;
  } catch (error) {
    console.log("Failed to set location cookies:", error);
    return false;
  }
}

export async function getLocationAndSetCookies(cookieStore: any) {
  try {
    const locationData = await getLocationData();
    console.log("locationData", locationData);
    const success = await setLocationCookies(cookieStore, locationData);
    return { locationData, success };
  } catch (error) {
    console.log("Failed to get location and set cookies:", error);
    return { locationData: null, success: false };
  }
}

