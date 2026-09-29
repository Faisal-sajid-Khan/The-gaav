import { configureStore } from '@reduxjs/toolkit';
import cartReducer from './cartSlice';
import uiReducer from './uiSlice';
import customerReducer from './customerSlice';

export const store = configureStore({
  reducer: {
    cart: cartReducer,
    ui: uiReducer,
    customer: customerReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({ serializableCheck: { ignoredActions: ['cart/setCart'] } }),
});
