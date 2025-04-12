import { createSlice, PayloadAction } from "@reduxjs/toolkit";

// Define the shape of each wishlist item
interface wishlistItem {
  _id: string;
  products: string[];
}

// Define the overall wishlist state
interface wishlistState {
  items: wishlistItem[];
}

// Initial state of the wishlist
const initialState: wishlistState = {
  items: [],
};

// Create the wishlist slice
const wishlistSlice = createSlice({
  name: "wishlist",
  initialState,
  reducers: {
    // Set the whole wishlist
    setWishList: (state, action: PayloadAction<wishlistItem[]>) => {
      state.items = action.payload;
    },

    // Clear the wishlist
    clearWishList: (state) => {
      state.items = [];
    },

    // Add an item to wishlist (if not already there)
    addToWishListAction: (state, action: PayloadAction<wishlistItem>) => {
      const existingItemIndex = state.items.findIndex(
        (item) => item._id === action.payload._id
      );

      if (existingItemIndex === -1) {
        state.items.push(action.payload);
      }
    },

    // Remove an item from wishlist by ID
    removeFromWishListAction: (state, action: PayloadAction<string>) => {
      state.items = state.items.map(item => ({
        ...item,
        products: item.products.filter(productId => productId !== action.payload)
      })).filter(item => item.products.length > 0)
    }
    
  },
});

export const {
  setWishList,
  clearWishList,
  addToWishListAction,
  removeFromWishListAction,
} = wishlistSlice.actions;

export default wishlistSlice.reducer;
