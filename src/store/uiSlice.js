import { createSlice } from '@reduxjs/toolkit';

const uiSlice = createSlice({
  name: 'ui',
  initialState: { cartDrawerOpen: false, mobileMenuOpen: false, searchOpen: false },
  reducers: {
    toggleCartDrawer: (state) => { state.cartDrawerOpen = !state.cartDrawerOpen; },
    openCartDrawer: (state) => { state.cartDrawerOpen = true; },
    closeCartDrawer: (state) => { state.cartDrawerOpen = false; },
    toggleMobileMenu: (state) => { state.mobileMenuOpen = !state.mobileMenuOpen; },
    closeMobileMenu: (state) => { state.mobileMenuOpen = false; },
    toggleSearch: (state) => { state.searchOpen = !state.searchOpen; },
    openSearch: (state) => { state.searchOpen = true; },
    closeSearch: (state) => { state.searchOpen = false; },
  },
});

export const {
  toggleCartDrawer, openCartDrawer, closeCartDrawer,
  toggleMobileMenu, closeMobileMenu,
  toggleSearch, openSearch, closeSearch,
} = uiSlice.actions;
export default uiSlice.reducer;
