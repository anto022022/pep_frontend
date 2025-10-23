// app/_components/ClientReduxInitializer.tsx
"use client";

import useCookies from "@/app/[locale]/_hooks/useCookies";
import {
  setCity,
  setCountry,
  setCountryCallingCode,
  setCountryCapital,
  setCountryCode,
  setCountryCodeIso3,
  setCountryName,
  setCurrency,
  setCurrencyName,
  setLanguages,
  setPostal,
  setRegion,
  setRegionCode,
  setTimezone,
  setUtcOffset,
  setVisible,
} from "@/app/[locale]/_store/reducers/location_store";
import { useAppDispatch } from "@/app/[locale]/_store/store";
import { useEffect } from "react";

export default function ClientReduxInitializer() {
  const dispatch = useAppDispatch();
  const cookies = useCookies();

  useEffect(() => {
    function initializeFromCookies() {
      // Get location data from cookies (set by server-side)
      const countryCookie = cookies.getCookie("cr_ctry");
      const cityCookie = cookies.getCookie("cr_cty");
      const currencyCookie = cookies.getCookie("currencyCode");
      const countryCodeCookie = cookies.getCookie("countryCode");

      // Decode and set in Redux
      const country = countryCookie
        ? Buffer.from(countryCookie, "base64").toString("utf8")
        : "India";
      const city = cityCookie
        ? Buffer.from(cityCookie, "base64").toString("utf8")
        : "Coimbatore";
      const currency = currencyCookie || "INR";
      const countryCode = countryCodeCookie || "IN";

      // Set all location data in Redux
      dispatch(setCity(city));
      dispatch(setCountryName(country));
      dispatch(setCountryCode(countryCode));
      dispatch(setCurrency(currency));
      dispatch(setVisible(true));

      // Set other default values
      dispatch(setRegion(""));
      dispatch(setRegionCode(""));
      dispatch(setCountryCodeIso3(""));
      dispatch(setCountryCapital(""));
      dispatch(setPostal(""));
      dispatch(setTimezone(""));
      dispatch(setUtcOffset(""));
      dispatch(setCountryCallingCode(""));
      dispatch(setCurrencyName(""));
      dispatch(setLanguages(""));
      dispatch(setCountry(countryCode));
    }

    initializeFromCookies();
  }, []);

  return null;
}
