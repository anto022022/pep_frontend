import { createSlice } from "@reduxjs/toolkit";
// import {
//   RegisteredUserModel,
//   UnRegisteredUserModel,
// } from "@/app/_models/onBoardings";
import { RegisteredUserModel } from "../../_models/onBoardingStages";

let initialState = {
  boardingStepper: RegisteredUserModel,
  userType: "",
  businessType: "",
  email:"",
  phoneNo:"",
  countryCode:"",
  stage: {},
  showSkip: false,
};

const onboardingSlice = createSlice({
  name: "onboarding_store",
  initialState: initialState,
  reducers: {
    setStepperData(state, action) {
      state.boardingStepper = action.payload;
    },
    setBusinessType(state, action) {
      state.businessType = action.payload;
    },
    setUserType(state, action) {
      state.userType = action.payload;
    },
    setStage(state, action) {
      state.stage = action.payload;
    },
    setShowSkip(state, action) {
      state.showSkip = action.payload;
    },
     setUserPhone(state, action) {
      state.phoneNo = action.payload;
    },
    setUserEmail(state, action) {
      state.email = action.payload;
    },
    setUserCountryCode(state, action) {
      state.countryCode = action.payload;
    },
  },
});

export const {
  setStepperData,
  setBusinessType,
  setUserType,
  setStage,
  setShowSkip,
  setUserPhone,
  setUserEmail,
  setUserCountryCode
} = onboardingSlice.actions;
export default onboardingSlice.reducer;
