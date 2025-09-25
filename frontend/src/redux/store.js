import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import productsReducer from './slices/productsSlice';
import cartReducer from './slices/cartSlice';
import checkoutReducer from './slices/checkoutSlice';
import orderReducer from './slices/orderSlice';
import adminReducer from './slices/adminSlice';
import adminProductReducer from './slices/adminProductSlice';
import adminOrderReducer from './slices/adminOrderSlice';
import commentsReducer from './slices/commentsSlice';
import profileReducer from './slices/profileSlice';
import commentAdminReducer from './slices/commentAdminSlice';
import postsReducer from './slices/postsSlice';
import favoritesReducer from "./slices/favoritesSlice";
import contactReducer from './slices/contactSlice';
import couponReducer from "./slices/couponSlice";
import categoryReducer from "./slices/categorySlice";
import revenueReducer from './slices/revenueSlice';


const store = configureStore({
  reducer: {
    auth: authReducer,
    products: productsReducer,
    cart: cartReducer,
    checkout: checkoutReducer,
    orders: orderReducer,
    admin: adminReducer,
    adminProducts: adminProductReducer,
    adminOrders: adminOrderReducer,
    comments: commentsReducer,
    profile: profileReducer,
    commentAdmin: commentAdminReducer,
    posts: postsReducer,
    favorites: favoritesReducer,
    contacts: contactReducer,
    coupons: couponReducer,
    categories: categoryReducer,
    revenue: revenueReducer,
  },
});
export default store;