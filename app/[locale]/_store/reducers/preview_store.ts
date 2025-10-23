import { createSlice } from "@reduxjs/toolkit";

const initialState: any = {};

const previewSlice = createSlice({
  name: "preview",
  initialState,
  reducers: {
    setPreview: (_state, action) => {
      return action.payload;
    },
  },
});

export const { setPreview } = previewSlice.actions;

export default previewSlice.reducer;
