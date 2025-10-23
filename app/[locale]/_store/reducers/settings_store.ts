import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  settingPaymentCardInfo: {},
};

const settingPaymentCard = createSlice({
  name: "settings",
  initialState,
  reducers: {
    setSettingPaymentCardInfo(state, action) {
      state.settingPaymentCardInfo = action.payload;
    },
  },
});

export const { setSettingPaymentCardInfo } = settingPaymentCard.actions;

export default settingPaymentCard.reducer;
