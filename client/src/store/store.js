import { configureStore } from "@reduxjs/toolkit";
import productSlice from "./slices/ProductSlice";
import vendorSlice from "./slices/VendorSlice";
import categorySlice from "./slices/CategorySlice";
import brandSlice from "./slices/BrandSlice";
import usersReducer from "./slices/usersSlice";
import wishlistReducer from "./slices/WishlistSlice";
import cartReducer from "./slices/cartSlice";
import orderReducer from "./slices/orderSlice";
import languageReducer from "./slices/languageSlice";

const store = configureStore({
    reducer: {
        products: productSlice.reducer,
        vendors: vendorSlice.reducer,
        categories: categorySlice.reducer,
        brands: brandSlice.reducer,
        users: usersReducer,
        wishlist: wishlistReducer,
        cart: cartReducer,
        order: orderReducer,
        language: languageReducer,
    },
});
export default store;
