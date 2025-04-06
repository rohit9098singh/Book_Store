import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface UserState {
  user: any | null;
  isEmailVerified: boolean;
  isLoggedInDialogueOpen: boolean;
  isLoggedIn: boolean;
}

const initialState: UserState = {
  user: null,
  isEmailVerified: false,
  isLoggedInDialogueOpen: false,
  isLoggedIn: false,
};

// Ye slice Redux ki state ko modify karega
const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    // 1️ User set karne wala function
    setUser: (state, action: PayloadAction<any>) => {
      state.user = action.payload;
    },

    // 2️ Email verification update karne wala function
    setEmailVerified: (state, action: PayloadAction<boolean>) => {
      state.isEmailVerified = action.payload;
    },

    // 3️  Logout karne ka function (sab reset ho jayega)
    logout: (state) => {
      state.user = null;
      state.isLoggedIn = false;
      state.isEmailVerified = false;
    },

    // 4️ Login dialogue toggle karne ka function
    toggleLoginDialogue: (state) => {
      state.isLoggedInDialogueOpen = !state.isLoggedInDialogueOpen;
    },

    // 5️ User logged in hai ya nahi, uska status change karne wala function
    authStatus: (state) => {
      state.isLoggedIn = true;
    },
  },
});

//  Ye Redux actions ko export karta hai, jo dispatch() se state update karenge
export const { setUser, setEmailVerified, logout, toggleLoginDialogue, authStatus } = userSlice.actions;

//Ye poora reducer export karta hai jo Redux store me add hota hai
export default userSlice.reducer;
