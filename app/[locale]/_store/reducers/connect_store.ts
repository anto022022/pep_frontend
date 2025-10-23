import { createSlice } from "@reduxjs/toolkit";


const initialState:any = {
    threadId:""
};

const connectSlice = createSlice({
  name: "connect",
  initialState,
  reducers: {
    setThreadId: (state, action) => {
      state.threadId=action.payload; 
    },
   
  },
});

export const { setThreadId } = connectSlice.actions;

export default connectSlice.reducer;
