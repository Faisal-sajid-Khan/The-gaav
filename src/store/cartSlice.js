import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { createCart, getCart, addToCart, updateCartLine, removeFromCart } from '../lib/shopify';

const CART_ID_KEY = 'the_gaav_cart_id_v2';
const getStoredCartId = () => localStorage.getItem(CART_ID_KEY);
const setStoredCartId = (id) => localStorage.setItem(CART_ID_KEY, id);
const clearStoredCartId = () => localStorage.removeItem(CART_ID_KEY);

export const initializeCart = createAsyncThunk('cart/initialize', async (_, { rejectWithValue }) => {
  try {
    const cartId = getStoredCartId();
    if (cartId) {
      try {
        const response = await getCart(cartId);
        if (response.data?.cart) {
          const cart = response.data.cart;
          // Check for valid cost object. A context mismatch (e.g. CAD cart queried in INR)
          // will cause Shopify to return null for costs.
          if (cart.cost && cart.cost.subtotalAmount) {
            return cart;
          }
          console.warn('Cart has invalid costs (likely context mismatch), creating new cart.');
        }
        // Stored cart ID exists but returned null from Shopify
        clearStoredCartId();
      } catch (getCartError) {
        console.warn('Stored cart ID was invalid or expired, creating new cart:', getCartError);
        clearStoredCartId();
      }
    }
    const response = await createCart();
    const cart = response.data?.cartCreate?.cart;
    if (cart) setStoredCartId(cart.id);
    return cart;
  } catch (error) { return rejectWithValue(error.message); }
});

export const addItemToCart = createAsyncThunk('cart/addItem', async ({ variantId, quantity = 1 }, { rejectWithValue }) => {
  try {
    let cartId = getStoredCartId();
    if (!cartId) {
      const createResponse = await createCart([{ variantId, quantity }]);
      const cart = createResponse.data?.cartCreate?.cart;
      if (cart) { setStoredCartId(cart.id); return cart; }
    } else {
      try {
        const response = await addToCart(cartId, [{ variantId, quantity }]);
        const cart = response.data?.cartLinesAdd?.cart;
        // Validate cost to ensure no context mismatch
        if (cart && cart.cost && cart.cost.subtotalAmount) return cart;
        throw new Error('Cart missing valid costs after add (likely context mismatch)');
      } catch (addToCartError) {
        console.warn('Failed to add to stored cart, creating new cart and retrying:', addToCartError);
        clearStoredCartId();
        const createResponse = await createCart([{ variantId, quantity }]);
        const cart = createResponse.data?.cartCreate?.cart;
        if (cart) { setStoredCartId(cart.id); return cart; }
      }
    }
    throw new Error('Failed to add item');
  } catch (error) { return rejectWithValue(error.message); }
});

export const updateItemQuantity = createAsyncThunk('cart/updateItem', async ({ lineId, quantity }, { rejectWithValue }) => {
  try {
    const cartId = getStoredCartId();
    if (!cartId) throw new Error('No cart');
    const response = await updateCartLine(cartId, lineId, quantity);
    return response.data?.cartLinesUpdate?.cart;
  } catch (error) { return rejectWithValue(error.message); }
});

export const removeItemFromCart = createAsyncThunk('cart/removeItem', async (lineId, { rejectWithValue }) => {
  try {
    const cartId = getStoredCartId();
    if (!cartId) throw new Error('No cart');
    const response = await removeFromCart(cartId, [lineId]);
    return response.data?.cartLinesRemove?.cart;
  } catch (error) { return rejectWithValue(error.message); }
});

const cartSlice = createSlice({
  name: 'cart',
  initialState: { cart: null, itemCount: 0, loading: false, error: null, addSuccess: false },
  reducers: { clearError: (state) => { state.error = null; }, clearAddSuccess: (state) => { state.addSuccess = false; } },
  extraReducers: (builder) => {
    builder
      .addCase(initializeCart.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(initializeCart.fulfilled, (state, action) => {
        state.loading = false; state.cart = action.payload;
        state.itemCount = action.payload?.lines?.edges?.reduce((sum, edge) => sum + edge.node.quantity, 0) || 0;
      })
      .addCase(initializeCart.rejected, (state, action) => { state.loading = false; state.error = action.payload; })
      .addCase(addItemToCart.pending, (state) => { state.loading = true; state.error = null; state.addSuccess = false; })
      .addCase(addItemToCart.fulfilled, (state, action) => {
        state.loading = false; state.cart = action.payload;
        state.itemCount = action.payload?.lines?.edges?.reduce((sum, edge) => sum + edge.node.quantity, 0) || 0;
        state.addSuccess = true;
      })
      .addCase(addItemToCart.rejected, (state, action) => { state.loading = false; state.error = action.payload; })
      .addCase(updateItemQuantity.fulfilled, (state, action) => {
        state.cart = action.payload;
        state.itemCount = action.payload?.lines?.edges?.reduce((sum, edge) => sum + edge.node.quantity, 0) || 0;
      })
      .addCase(removeItemFromCart.fulfilled, (state, action) => {
        state.cart = action.payload;
        state.itemCount = action.payload?.lines?.edges?.reduce((sum, edge) => sum + edge.node.quantity, 0) || 0;
      });
  },
});

export const { clearError, clearAddSuccess } = cartSlice.actions;
export default cartSlice.reducer;
