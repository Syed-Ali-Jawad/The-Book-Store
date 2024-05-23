import { createSlice } from "@reduxjs/toolkit";
import { configureStore } from "@reduxjs/toolkit";

const reduxSlice = createSlice({
  name: "State Managment",
  initialState: {
    isBookSellModalOpen: false,
    sellerId: localStorage.getItem("SellerId") || null,
    buyerId: localStorage.getItem("BuyerId") || null,
    isCartModalOpen: false,
    isOrdersModalOpen: false,
    buyerOrders: null,
    isProfileUpdateModalOpen: false,
    buyerProfile: {},
    adminId: localStorage.getItem("AdminId") || null,
    bookToEdit: [],
    isBookEditModalOpen: false,
    search: null,
    genreFilter: null,
    priceFilter: null,
    dateFilter: null,
  },
  reducers: {
    setIsBookSellModalOpen(state, action) {
      state.isBookSellModalOpen = action.payload;
    },
    // setSellerId(state,action){state.sellerId=action.payload},
    // setBuyerId(state,action){state.buyerId=action.payload},
    setIsCartModalOpen(state, action) {
      state.isCartModalOpen = action.payload;
    },
    setIsOrdersModalOpen(state, action) {
      state.isOrdersModalOpen = action.payload;
    },
    setBuyerOrders(state, action) {
      state.buyerOrders = action.payload;
    },
    setIsProfileUpdateModalOpen(state, action) {
      state.isProfileUpdateModalOpen = action.payload;
    },
    setBuyerProfile(state, action) {
      state.buyerProfile = { ...action.payload };
    },
    setSellerId(state, action) {
      state.sellerId = action.payload;
    },
    setBuyerId(state, action) {
      state.buyerId = action.payload;
    },
    setAdminId(state, action) {
      state.adminId = action.payload;
    },
    setBookToEdit(state, action) {
      state.bookToEdit = action.payload;
    },
    setIsBookEditModalOpen(state, action) {
      state.isBookEditModalOpen = action.payload;
    },
    setSearch(state, action) {
      state.search = action.payload;
    },
    setGenreFilter(state, action) {
      state.genreFilter = action.payload;
    },
    setPriceFilter(state, action) {
      state.priceFilter = action.payload;
    },
    setDateFilter(state, action) {
      state.dateFilter = action.payload;
    },
  },
});

const store = configureStore({
  reducer: reduxSlice.reducer,
});

export const {
  setIsBookSellModalOpen,
  setIsCartModalOpen,
  setIsOrdersModalOpen,
  setBuyerOrders,
  setIsProfileUpdateModalOpen,
  setBuyerProfile,
  setSellerId,
  setBuyerId,
  setAdminId,
  setBookToEdit,
  setIsBookEditModalOpen,
  setSearch,
  setGenreFilter,
  setPriceFilter,
  setDateFilter,
} = reduxSlice.actions;
export default store;
