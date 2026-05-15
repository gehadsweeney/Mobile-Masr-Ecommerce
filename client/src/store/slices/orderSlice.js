import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

const BASE_URL = `${import.meta.env.VITE_API_URL}/orders`;

const authHeaders = () => {
    const token = localStorage.getItem("token");
    const headers = { "Content-Type": "application/json" };
    if (token) headers["Authorization"] = `Bearer ${token}`;
    return headers;
};

// Create a new order
export const createOrder = createAsyncThunk(
    "order/createOrder",
    async (orderData) => {
        const res = await fetch(`${BASE_URL}/`, {
            method: "POST",
            headers: authHeaders(),
            body: JSON.stringify(orderData),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data?.message || "Failed to create order");
        return data;
    }
);

// Get all orders for the user
export const fetchOrders = createAsyncThunk("order/fetchOrders", async (lang = "en") => {
    const res = await fetch(`${BASE_URL}/user?lang=${lang}`, { headers: authHeaders() });
    const data = await res.json();
    if (!res.ok) throw new Error(data?.message || "Failed to fetch orders");
    return data;
});

// Get a single order by ID
export const fetchOrderById = createAsyncThunk(
    "order/fetchOrderById",
    async ({ orderId, lang = "en" }) => {
        const res = await fetch(`${BASE_URL}/${orderId}?lang=${lang}`, {
            headers: authHeaders(),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data?.message || "Failed to fetch order");
        return data;
    }
);

// Update order status (admin)
export const updateOrderStatus = createAsyncThunk(
    "order/updateOrderStatus",
    async ({ orderId, orderStatus, paymentStatus }) => {
        const res = await fetch(`${BASE_URL}/${orderId}`, {
            method: "PUT",
            headers: authHeaders(),
            body: JSON.stringify({ orderStatus, paymentStatus }),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data?.message || "Failed to update order");
        return data;
    }
);

// Delete an order
export const deleteOrder = createAsyncThunk(
    "order/deleteOrder",
    async (orderId) => {
        const res = await fetch(`${BASE_URL}/${orderId}`, {
            method: "DELETE",
            headers: authHeaders(),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data?.message || "Failed to delete order");
        return data;
    }
);

const initialState = {
    orders: [],
    currentOrder: null,
    lastCreatedOrder: null,
    loading: false,
    error: null,
};

const orderSlice = createSlice({
    name: "order",
    initialState,
    reducers: {
        resetOrderState: () => initialState,
        clearCurrentOrder: (state) => {
            state.currentOrder = null;
        },
    },
    extraReducers: (builder) => {
        const pending = (state) => {
            state.loading = true;
            state.error = null;
        };
        const rejected = (state, action) => {
            state.loading = false;
            state.error = action.error?.message || "Something went wrong";
        };

        builder
            // Create Order
            .addCase(createOrder.pending, pending)
            .addCase(createOrder.fulfilled, (state, action) => {
                state.loading = false;
                state.error = null;
                state.lastCreatedOrder = action.payload.order;
                // Add to orders list if it exists
                if (action.payload.order) {
                    state.orders.unshift(action.payload.order);
                }
            })
            .addCase(createOrder.rejected, rejected)

            // Fetch All Orders
            .addCase(fetchOrders.pending, pending)
            .addCase(fetchOrders.fulfilled, (state, action) => {
                state.loading = false;
                state.error = null;
                state.orders = action.payload || [];
            })
            .addCase(fetchOrders.rejected, rejected)

            // Fetch Order By ID
            .addCase(fetchOrderById.pending, pending)
            .addCase(fetchOrderById.fulfilled, (state, action) => {
                state.loading = false;
                state.error = null;
                state.currentOrder = action.payload;
            })
            .addCase(fetchOrderById.rejected, rejected)

            // Update Order Status
            .addCase(updateOrderStatus.pending, (state) => {
                state.error = null;
            })
            .addCase(updateOrderStatus.fulfilled, (state, action) => {
                state.loading = false;
                state.error = null;
                const updatedOrder = action.payload.order;
                // Update in orders list
                const index = state.orders.findIndex(
                    (order) => order._id === updatedOrder._id
                );
                if (index !== -1) {
                    state.orders[index] = updatedOrder;
                }
                // Update current order if it's the same
                if (state.currentOrder?._id === updatedOrder._id) {
                    state.currentOrder = updatedOrder;
                }
            })
            .addCase(updateOrderStatus.rejected, rejected)

            // Delete Order
            .addCase(deleteOrder.pending, (state) => {
                state.error = null;
            })
            .addCase(deleteOrder.fulfilled, (state, action) => {
                state.loading = false;
                state.error = null;
                // Remove from orders list
                const orderId = action.meta.arg;
                state.orders = state.orders.filter(
                    (order) => order._id !== orderId
                );
                // Clear current order if it's the deleted one
                if (state.currentOrder?._id === orderId) {
                    state.currentOrder = null;
                }
            })
            .addCase(deleteOrder.rejected, rejected);
    },
});

export const { resetOrderState, clearCurrentOrder } = orderSlice.actions;
export default orderSlice.reducer;
