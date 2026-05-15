import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { logout } from "./usersSlice";

// API instance for wishlist
const wishlistApi = axios.create({
  baseURL: `${import.meta.env.VITE_API_URL}/wishlist`,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add token automatically if exists
wishlistApi.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

/* ============================
   Fetch User Wishlist
============================ */
export const fetchWishlist = createAsyncThunk(
  "wishlist/fetchWishlist",
  async (lang = "en", { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        return rejectWithValue("User not logged in");
      }

      const response = await wishlistApi.get(`/?lang=${lang}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch wishlist"
      );
    }
  }
);

/* ============================
   Add To Wishlist
============================ */
export const addToWishlist = createAsyncThunk(
  "wishlist/addToWishlist",
  async ({ productId, lang = "en" }, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        return rejectWithValue("User not logged in");
      }

      const response = await wishlistApi.post(`/?lang=${lang}`, { productId });
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to add to Favorites"
      );
    }
  }
);

/* ============================
   Remove From Wishlist
============================ */
export const removeFromWishlist = createAsyncThunk(
  "wishlist/removeFromWishlist",
  async ({ productId, lang = "en" }, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        return rejectWithValue("User not logged in");
      }

      const response = await wishlistApi.delete(`/remove?lang=${lang}`, {
        data: { productId },
      });

      return { productId, data: response.data };
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to remove from Favorites"
      );
    }
  }
);

/* ============================
   Toggle Wishlist
============================ */
export const toggleWishlist = createAsyncThunk(
  "wishlist/toggleWishlist",
  async ({ productId, lang = "en" }, { getState, rejectWithValue }) => {
    try {
      const { wishlist } = getState();
      const token = localStorage.getItem("token");

      if (!token) {
        return rejectWithValue("User not logged in");
      }

      const isInWishlist = wishlist.items.some(
        (item) => item._id === productId || item.toString() === productId
      );

      if (isInWishlist) {
        const response = await wishlistApi.delete(`/remove?lang=${lang}`, {
          data: { productId },
        });
        return { action: "removed", productId, data: response.data };
      } else {
        const response = await wishlistApi.post(`/?lang=${lang}`, { productId });
        return { action: "added", data: response.data };
      }
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to toggle Favorites"
      );
    }
  }
);

/* ============================
   Clear Entire Wishlist  (FIXED!)
============================ */
export const clearAllWishlist = createAsyncThunk(
  "wishlist/clearAllWishlist",
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        return rejectWithValue("User not logged in");
      }

      // 🔥 FIX → backend accepts DELETE /wishlist only
      const response = await wishlistApi.delete("/");

      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to clear Favorites"
      );
    }
  }
);

/* ============================
   SLICE
============================ */
const wishlistSlice = createSlice({
  name: "wishlist",
  initialState: {
    items: [],
    isLoading: false,
    error: null,
    successMessage: null,
  },
  reducers: {
    clearWishlistError: (state) => {
      state.error = null;
    },
    clearWishlistSuccess: (state) => {
      state.successMessage = null;
    },
    clearWishlist: (state) => {
      state.items = [];
      state.error = null;
      state.successMessage = null;
    },
  },
  extraReducers: (builder) => {
    /* Fetch Wishlist */
    builder
      .addCase(fetchWishlist.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchWishlist.fulfilled, (state, action) => {
        state.isLoading = false;
        state.items = action.payload.products || [];
        state.error = null;
      })
      .addCase(fetchWishlist.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });

    /* Add To Wishlist */
    builder
      .addCase(addToWishlist.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(addToWishlist.fulfilled, (state, action) => {
        state.isLoading = false;
        state.items = action.payload.products || [];
      })
      .addCase(addToWishlist.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });

    /* Remove From Wishlist */
    builder
      .addCase(removeFromWishlist.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(removeFromWishlist.fulfilled, (state, action) => {
        state.isLoading = false;
        state.items = action.payload.data.products || [];
      })
      .addCase(removeFromWishlist.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });

    /* Toggle Wishlist */
    builder
      .addCase(toggleWishlist.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(toggleWishlist.fulfilled, (state, action) => {
        state.isLoading = false;
        state.items = action.payload.data.products || [];
      })
      .addCase(toggleWishlist.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });

    /* Clear All Wishlist (Delete All) */
    builder
      .addCase(clearAllWishlist.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(clearAllWishlist.fulfilled, (state) => {
        state.isLoading = false;
        state.items = [];
      })
      .addCase(clearAllWishlist.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });

    /* Clear wishlist on logout */
    builder.addCase(logout, (state) => {
      state.items = [];
      state.error = null;
      state.successMessage = null;
      state.isLoading = false;
    });
  },
});

export const { clearWishlistError, clearWishlistSuccess, clearWishlist } =
  wishlistSlice.actions;

export default wishlistSlice.reducer;
