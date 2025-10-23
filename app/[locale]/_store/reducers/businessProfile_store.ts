import { createSlice } from "@reduxjs/toolkit";


const initialState: any = {
    countryName: "",
    countryCode: ''
};

const businessProfileSlice = createSlice({
    name: "businessProfile",
    initialState,
    reducers: {
        setCountryName: (state, action) => {
            state.countryName = action.payload;
        },
        setCountryCode: (state, action) => {
            state.countryCode = action.payload;
        }
    },
});

export const { setCountryName, setCountryCode } = businessProfileSlice.actions;

export default businessProfileSlice.reducer;
