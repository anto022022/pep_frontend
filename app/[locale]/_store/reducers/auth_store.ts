import { createSlice } from "@reduxjs/toolkit";

let initialState = {
  userName: "user",
  ip: "",
  isVerified: false,
  email: "",
  phone: "",
};

const authSlice = createSlice({
  name: "user_store",
  initialState: initialState,
  reducers: {
    setUserName(state, action) {
      state.userName = action.payload.userName;
    },
  },
});

export const { setUserName } = authSlice.actions;
export default authSlice.reducer;
