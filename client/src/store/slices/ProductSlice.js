import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

// http://localhost:3000/products

const fetchData = async (lang = "en") => {
    try {
        const data = await fetch(`${import.meta.env.VITE_API_URL}/products?lang=${lang}`);
        const result = await data.json();
        return result.data;
    } catch (error) {
        console.error("Error fetching products:", error);
        return error;
    }
};


export const fetchProductsData = createAsyncThunk("fetchProductsData", fetchData);

const productSlice = createSlice({
    name: "productSlice",
    initialState: {
        data: [],
        isLoading: true,
        error: null,
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchProductsData.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(fetchProductsData.fulfilled, (state, action) => {
                state.data = Array.isArray(action.payload) ? action.payload : [];
                state.isLoading = false;
                state.error = null;
            })
            .addCase(fetchProductsData.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.error.message;
            });
    }
});

export default productSlice;