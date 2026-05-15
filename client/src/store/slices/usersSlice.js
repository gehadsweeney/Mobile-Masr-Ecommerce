
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../services/api";

// thunk register
export const registerUser = createAsyncThunk(
  "users/register",
  async (payload, { rejectWithValue }) => {
    try {
      const res = await api.post("/register", payload); // backend endpoint
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || { message: "Server error" });
    }
  }
);

// thunk fetch user profile
export const fetchUserProfile = createAsyncThunk(
  "users/fetchProfile",
  async (_, { rejectWithValue }) => {
    try {
      const res = await api.get("/profile");
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || { message: "Server error" });
    }
  }
);

// thunk login
export const loginUser = createAsyncThunk(
  "users/login",
  async (payload, { rejectWithValue }) => {
    try {
      const res = await api.post("/login", payload);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || { message: "Server error" });
    }
  }
);

// thunk google login
export const googleLogin = createAsyncThunk(
  "users/googleLogin",
  async (payload, { rejectWithValue }) => {
    try {
      const res = await api.post("/google-login", payload);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || { message: "Google login failed" });
    }
  }
);

const usersSlice = createSlice({
  name: "users",
  initialState: {
    user: null,
    token: localStorage.getItem("token") || null,
    loading: false,
    error: null,
  },
  reducers: {
    logout: (state) => {
      state.user = null;
      state.token = null;
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      window.dispatchEvent(new CustomEvent("userChanged", { detail: null }));
    },
    setCredentials: (state, action) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
      if (action.payload.token) localStorage.setItem("token", action.payload.token);
    },
  },
  extraReducers: (builder) => {
    // register
    builder.addCase(registerUser.pending, (state) => { state.loading = true; state.error = null; });
    builder.addCase(registerUser.fulfilled, (state, action) => {
      state.loading = false;
      state.user = action.payload.user;
      state.token = action.payload.token;
      if (action.payload.token) localStorage.setItem("token", action.payload.token);
      if (action.payload.user) {
        localStorage.setItem("user", JSON.stringify(action.payload.user));
        window.dispatchEvent(new CustomEvent("userChanged", { detail: action.payload.user }));
      }
    });
    builder.addCase(registerUser.rejected, (state, action) => { state.loading = false; state.error = action.payload?.message; });

    // login
    builder.addCase(loginUser.pending, (state) => { state.loading = true; state.error = null; });
    builder.addCase(loginUser.fulfilled, (state, action) => {
      state.loading = false;
      state.user = action.payload.user;
      state.token = action.payload.token;
      if (action.payload.token) localStorage.setItem("token", action.payload.token);
      if (action.payload.user) {
        localStorage.setItem("user", JSON.stringify(action.payload.user));
        window.dispatchEvent(new CustomEvent("userChanged", { detail: action.payload.user }));
      }
    });
    builder.addCase(loginUser.rejected, (state, action) => { state.loading = false; state.error = action.payload?.message; });

    // google login
    builder.addCase(googleLogin.pending, (state) => { state.loading = true; state.error = null; });
    builder.addCase(googleLogin.fulfilled, (state, action) => {
      state.loading = false;
      state.user = action.payload.user;
      state.token = action.payload.token;
      if (action.payload.token) localStorage.setItem("token", action.payload.token);
      if (action.payload.user) {
        localStorage.setItem("user", JSON.stringify(action.payload.user));
        window.dispatchEvent(new CustomEvent("userChanged", { detail: action.payload.user }));
      }
    });
    builder.addCase(googleLogin.rejected, (state, action) => { state.loading = false; state.error = action.payload?.message; });

    // fetch profile
    builder.addCase(fetchUserProfile.pending, (state) => { state.loading = true; state.error = null; });
    builder.addCase(fetchUserProfile.fulfilled, (state, action) => {
      state.loading = false;
      state.user = action.payload.user || action.payload;
      if (state.user) {
        localStorage.setItem("user", JSON.stringify(state.user));
        window.dispatchEvent(new CustomEvent("userChanged", { detail: state.user }));
      }
    });
    builder.addCase(fetchUserProfile.rejected, (state, action) => { state.loading = false; state.error = action.payload?.message; });
  },
});

export const { logout, setCredentials } = usersSlice.actions;
export default usersSlice.reducer;
