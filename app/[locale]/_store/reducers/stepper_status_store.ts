import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    currentForm:"",
    stepperStatus:{}
};

const stepperStatusSlice = createSlice({
    name: "stepperStatus",
    initialState,
    reducers: {
        setStepperStatus(state, action) {
            state.stepperStatus = action.payload;
        },
        setCurrentForm(state, action){
            state.currentForm=action.payload;
        }
    },
});

export const { 
    setStepperStatus,
    setCurrentForm
} = stepperStatusSlice.actions;

export default stepperStatusSlice.reducer;