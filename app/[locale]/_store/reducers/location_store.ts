import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface LocationState {
  city: string;
  region: string;
  region_code: string;
  country: string;
  country_name: string;
  country_code: string;
  country_code_iso3: string;
  country_capital: string;
  postal: string;
  timezone: string;
  utc_offset: string;
  country_calling_code: string;
  currency: string | null;
  currency_name: string;
  languages: string;
  visible?: boolean;
  domain: string;
}

const initialState: LocationState = {
  city: "Coimbatore",
  region: "Tamil Nadu",
  region_code: "TN",
  country: "IN",
  country_name: "India",
  country_code: "IN",
  country_code_iso3: "IND",
  country_capital: "New Delhi",
  postal: "641009",
  timezone: "Asia/Kolkata",
  utc_offset: "+0530",
  country_calling_code: "+91",
  currency: null,
  currency_name: "Rupee",
  languages:
    "en-IN,hi,bn,te,mr,ta,ur,gu,kn,ml,or,pa,as,bh,sat,ks,ne,sd,kok,doi,mni,sit,sa,fr,lus,inc",
  visible: false,
  domain: "",
};

const locationSlice = createSlice({
  name: "location",
  initialState,
  reducers: {
    setCity: (state, action: PayloadAction<string>) => {
      state.city = action.payload;
    },
    setRegion: (state, action: PayloadAction<string>) => {
      state.region = action.payload;
    },
    setRegionCode: (state, action: PayloadAction<string>) => {
      state.region_code = action.payload;
    },
    setCountry: (state, action: PayloadAction<string>) => {
      state.country = action.payload;
    },
    setCountryName: (state, action: PayloadAction<string>) => {
      state.country_name = action.payload;
    },
    setCountryCode: (state, action: PayloadAction<string>) => {
      state.country_code = action.payload;
    },
    setCountryCodeIso3: (state, action: PayloadAction<string>) => {
      state.country_code_iso3 = action.payload;
    },
    setCountryCapital: (state, action: PayloadAction<string>) => {
      state.country_capital = action.payload;
    },
    setPostal: (state, action: PayloadAction<string>) => {
      state.postal = action.payload;
    },
    setTimezone: (state, action: PayloadAction<string>) => {
      state.timezone = action.payload;
    },
    setUtcOffset: (state, action: PayloadAction<string>) => {
      state.utc_offset = action.payload;
    },
    setCountryCallingCode: (state, action: PayloadAction<string>) => {
      state.country_calling_code = action.payload;
    },
    setCurrency: (state, action: PayloadAction<string>) => {
      state.currency = action.payload;
    },
    setCurrencyName: (state, action: PayloadAction<string>) => {
      state.currency_name = action.payload;
    },
    setLanguages: (state, action: PayloadAction<string>) => {
      state.languages = action.payload;
    },
    setVisible: (state, action: PayloadAction<boolean>) => {
      state.visible = action.payload;
    },
    setDomain: (state, action: PayloadAction<string>) => {
      state.domain = action.payload;
    },
  },
});

export const {
  setCity,
  setRegion,
  setRegionCode,
  setCountry,
  setCountryName,
  setCountryCode,
  setCountryCodeIso3,
  setCountryCapital,
  setPostal,
  setTimezone,
  setUtcOffset,
  setCountryCallingCode,
  setCurrency,
  setCurrencyName,
  setLanguages,
  setVisible,
  setDomain,
} = locationSlice.actions;

export default locationSlice.reducer;
