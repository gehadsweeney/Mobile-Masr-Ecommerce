import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

const BASE_URL = `${import.meta.env.VITE_API_URL}/cart`;

const authHeaders = () => {
    const token = localStorage.getItem("token");
    const headers = { "Content-Type": "application/json" };
    if (token) headers["Authorization"] = `Bearer ${token}`;
    return headers;
};

export const fetchCart = createAsyncThunk("cart/fetchCart", async (lang = "en") => {
    const res = await fetch(`${BASE_URL}/?lang=${lang}`, { headers: authHeaders() });
    const data = await res.json();
    if (!res.ok) throw new Error(data?.message || "Failed to fetch cart");
    return data;
});

export const addToCart = createAsyncThunk(
    "cart/addToCart",
    async ({ productId, quantity = 1 }) => {
        const res = await fetch(`${BASE_URL}/add`, {
            method: "POST",
            headers: authHeaders(),
            body: JSON.stringify({ productId, quantity }),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data?.message || "Failed to add to cart");
        return data;
    }
);

export const updateCartQuantity = createAsyncThunk(
    "cart/updateQuantity",
    async ({ productId, quantity }) => {
        const res = await fetch(`${BASE_URL}/update`, {
            method: "PUT",
            headers: authHeaders(),
            body: JSON.stringify({ productId, quantity }),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data?.message || "Failed to update quantity");
        return data;
    }
);

export const removeFromCart = createAsyncThunk(
    "cart/removeFromCart",
    async ({ productId }) => {
        const res = await fetch(`${BASE_URL}/remove`, {
            method: "PUT",
            headers: authHeaders(),
            body: JSON.stringify({ productId }),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data?.message || "Failed to remove item");
        return data;
    }
);

export const clearCart = createAsyncThunk("cart/clearCart", async () => {
    const res = await fetch(`${BASE_URL}/clear`, {
        method: "DELETE",
        headers: authHeaders(),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data?.message || "Failed to clear cart");
    return data; // { message }
});

export const checkoutCart = createAsyncThunk("cart/checkout", async () => {
    const res = await fetch(`${BASE_URL}/checkout`, {
        method: "POST",
        headers: authHeaders(),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data?.message || "Failed to checkout");
    return data; // order response
});

const initialState = {
    items: [],
    totalPrice: 0,
    loading: false,
    error: null,
    lastOrder: null,
};

const cartSlice = createSlice({
    name: "cart",
    initialState,
    reducers: {
        resetCartState: () => initialState,
    },
    extraReducers: (builder) => {
        const pending = (state) => {
            state.loading = true;
            state.error = null;
        };
        const fulfilledWithCart = (state, action) => {
            state.loading = false;
            state.error = null;
            const cart = action.payload;
            state.items = cart.items || [];
            state.totalPrice = cart.totalPrice || 0;
        };
        const rejected = (state, action) => {
            state.loading = false;
            state.error = action.payload || "Something went wrong";
        };

        builder
            .addCase(fetchCart.pending, pending)
            .addCase(fetchCart.fulfilled, fulfilledWithCart)
            .addCase(fetchCart.rejected, rejected)

            .addCase(addToCart.pending, pending)
            .addCase(addToCart.fulfilled, fulfilledWithCart)
            .addCase(addToCart.rejected, rejected)

            // Do not flip global loading for small quantity updates
            .addCase(updateCartQuantity.pending, (state) => {
                state.error = null;
            })
            .addCase(updateCartQuantity.fulfilled, (state, action) => {
                state.loading = false;
                state.error = null;
                const cart = action.payload;
                // Merge: keep old product details, update only quantity & totalPrice
                if (cart.items) {
                    state.items = state.items.map((oldItem) => {
                        const newItem = cart.items.find(
                            (ni) => (ni.product?._id || ni.product) === (oldItem.product?._id || oldItem.product)
                        );
                        if (newItem) {
                            return {
                                ...oldItem,
                                quantity: newItem.quantity,
                                price: newItem.price,
                                product: oldItem.product, // preserve full product data
                            };
                        }
                        return oldItem;
                    });
                }
                state.totalPrice = cart.totalPrice || 0;
            })
            .addCase(updateCartQuantity.rejected, rejected)

            .addCase(removeFromCart.pending, (state) => {
                state.error = null;
            })
            .addCase(removeFromCart.fulfilled, (state, action) => {
                state.loading = false;
                state.error = null;
                const cart = action.payload;
                const remainingIds = new Set(
                    (cart.items || []).map((i) => (i.product?._id || i.product))
                );
                // Keep only items that still exist in cart, preserving product details
                state.items = state.items
                    .filter((oldItem) => remainingIds.has(oldItem.product?._id || oldItem.product))
                    .map((oldItem) => {
                        const updated = (cart.items || []).find(
                            (i) => (i.product?._id || i.product) === (oldItem.product?._id || oldItem.product)
                        );
                        if (updated) {
                            return {
                                ...oldItem,
                                quantity: updated.quantity,
                                price: updated.price,
                            };
                        }
                        return oldItem;
                    });
                state.totalPrice = cart.totalPrice || 0;
            })
            .addCase(removeFromCart.rejected, rejected)

            .addCase(clearCart.pending, pending)
            .addCase(clearCart.fulfilled, (state) => {
                state.loading = false;
                state.error = null;
                state.items = [];
                state.totalPrice = 0;
            })
            .addCase(clearCart.rejected, rejected)

            .addCase(checkoutCart.pending, pending)
            .addCase(checkoutCart.fulfilled, (state, action) => {
                state.loading = false;
                state.error = null;
                state.lastOrder = action.payload;
            })
            .addCase(checkoutCart.rejected, rejected);
    },
});

export const { resetCartState } = cartSlice.actions;
export default cartSlice.reducer;
