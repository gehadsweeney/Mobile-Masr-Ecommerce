import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

const fetchCategories = async () => {
    try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/categories`);
        const result = await response.json();
        return result;
    } catch (error) {
        console.error("Error fetching categories:", error);
        throw error;
    }
};

export const fetchCategoriesData = createAsyncThunk("fetchCategoriesData", fetchCategories);

const categorySlice = createSlice({
    name: "categorySlice",
    initialState: {
        data: [],
        isLoading: false,
        error: null,
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchCategoriesData.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(fetchCategoriesData.fulfilled, (state, action) => {
                state.data = action.payload;
                state.isLoading = false;
                state.error = null;
            })
            .addCase(fetchCategoriesData.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.error.message;
            });
    }
});

export default categorySlice;
