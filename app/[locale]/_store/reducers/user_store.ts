import { UserType } from "@/app/[locale]/_interface/OnboardInterface";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { UserSessionDataInterface } from "../../_interface/userInterface";

// interface UserState {
//   userName: string;
//   ip: string;
//   isVerified: boolean;
//   userSessionData: UserSessionDataInterface | null;
// }

const initialState: UserSessionDataInterface = {
  userName: "User",
  ip: 0,
  isVerified: false,
  _id: "",
  email: "",
  phoneNo: "",
  countryCode: "",
  years: "",
  businessName: "",
  cartCount: 0,
  businessEmail: "",
  userType: "both",
  isLoggedIn: false,
  kybVerification: false,
  kycVerified: false,
  uboVerification: false,
};

const userSlice = createSlice({
  name: "user_store",
  initialState: initialState,
  reducers: {
    setUserName(state, action) {
      state.userName = action.payload.userName;
    },
    setUserSessionData: (
      state,
      action: PayloadAction<Partial<UserSessionDataInterface>>
    ) => {
      return { ...state, ...action.payload };
    },
    setCartCount: (state, action: PayloadAction<number>) => {
      state.cartCount = action.payload;
    },
    setUserTypeInUserData: (state, action: PayloadAction<UserType>) => {
      state.userType = action.payload;
    },
  },
});

export const {
  setUserName,
  setUserSessionData,
  setCartCount,
  setUserTypeInUserData,
} = userSlice.actions;
export default userSlice.reducer;
