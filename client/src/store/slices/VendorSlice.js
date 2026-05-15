import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

// http://localhost:3000/vendors/:id
const fetchData = async (id) => {
  try {
    const response = await fetch(`${import.meta.env.VITE_API_URL}/vendors/${id}`);
    const result = await response.json();
    // لو الـ API رجع object مفرد، حوّله array
    return result
  } catch (error) {
    console.error("Error fetching vendor:", error);
    throw error;
  }
};

// Thunk لجلب بيانات vendor
export const fetchVendorData = createAsyncThunk("fetchVendorData", fetchData);

const vendorSlice = createSlice({
  name: "vendorSlice",
  initialState: {
    data: [],        // دايمًا array
    isLoading: false,
    error: null,
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchVendorData.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchVendorData.fulfilled, (state, action) => {
        state.data = action.payload; // array دائماً
        state.isLoading = false;
        state.error = null;
      })
      .addCase(fetchVendorData.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || "Failed to fetch vendor";
      });
  },
});

export default vendorSlice;
