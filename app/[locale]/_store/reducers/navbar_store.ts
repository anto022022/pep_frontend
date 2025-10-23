import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface NavbarSliceType {
    mobileTitle: string;
    mobilePath: string;
}

const initialState: NavbarSliceType = {
    mobilePath: "Default",
    mobileTitle: "./"
};

const navbarSlice = createSlice({
    name: "navbar",
    initialState,
    reducers: {
        setMobileTitle(state, action: PayloadAction<string>) {
            state.mobileTitle = action.payload;
        },
        setMobilePath(state, action: PayloadAction<string>) {
            state.mobilePath = action.payload;
        },
        setMobileMeta(state, action: PayloadAction<{ title: string; path: string }>) {
            state.mobileTitle = action.payload.title;
            state.mobilePath = action.payload.path;
        },
    }
})

export const { setMobileMeta, setMobilePath, setMobileTitle } = navbarSlice.actions;

export default navbarSlice.reducer;
