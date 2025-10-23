import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface RequestQuoteState {
  isSelectVariantSidebarOpen: boolean;
  isReqQuoteShow: boolean;
}

const initialState: RequestQuoteState = {
  isSelectVariantSidebarOpen: false,
  isReqQuoteShow: false,
};

const requestQuoteSlice = createSlice({
  name: "requestQuote",
  initialState,
  reducers: {
    setSelectVariantSidebarOpen(state, action: PayloadAction<boolean>) {
      state.isSelectVariantSidebarOpen = action.payload;
    },
    setIsReqQuoteShow(state, action: PayloadAction<boolean>) {
      state.isReqQuoteShow = action.payload;
    },
  },
});

export const { setSelectVariantSidebarOpen, setIsReqQuoteShow } =
  requestQuoteSlice.actions;
export default requestQuoteSlice.reducer;
