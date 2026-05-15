import { createSlice } from "@reduxjs/toolkit";

const languageSlice = createSlice({
    name: "language",
    initialState: {
        currentLang: localStorage.getItem("language") || "en",
    },
    reducers: {
        setLanguage: (state, action) => {
            state.currentLang = action.payload;
            localStorage.setItem("language", action.payload);
        },
    },
});

export const { setLanguage } = languageSlice.actions;
export default languageSlice.reducer;
