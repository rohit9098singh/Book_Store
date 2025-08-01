import { configureStore } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/query/react";
import storage from "redux-persist/lib/storage";
import { persistReducer, persistStore, FLUSH, REHYDRATE, PAUSE, PURGE, PERSIST, REGISTER } from "redux-persist";
import userReducer from "./slice/userSlice";
import cartReducer from "./slice/cartSlice"
import wishlistReducer from "./slice/wishlistSlice"
import checkoutReducer from "./slice/checkoutSlice"
import { api } from "./api"; //  Ensure `api` is imported!
import { adminApi } from "./adminApi";

// 🔥 Persist Configuration for User
const userPersistConfig = {
  key: "user", // localStorage me "user" key ke under save hoga
  storage, // localStorage use hoga
  whitelist: ["user", "isEmailVerified", "isLoggedIn"], // Sirf ye values persist hongi
};
const cartPersistConfig={key:"cart",storage,whitelist:['items']}
const wishlistPersistConfig={key:"wishlist",storage,}
const checkoutPersistConfig={key:"checkout",storage,}


//  Persisted Reducer Create Karo
const persistedUserReducer = persistReducer(userPersistConfig, userReducer);
//Pehla Argument → userPersistConfig → Batata hai kahan store hoga aur kaunse values save hongi.
//Dusra Argument → userReducer → Yeh batata hai ki kaunsa reducer persist hoga
const persistedCartReducer = persistReducer(cartPersistConfig, cartReducer);
const persistedWishlistReducer = persistReducer(wishlistPersistConfig, wishlistReducer);

const persistedCheckoutReducer = persistReducer(checkoutPersistConfig, checkoutReducer);


//  Redux Store Configure Karo
export const store = configureStore({
  reducer: {
    [api.reducerPath]: api.reducer, 
    [adminApi.reducerPath]:adminApi.reducer,
    user: persistedUserReducer, //  Persisted Reducer Use Ho Raha Hai
    cart:persistedCartReducer,
    wishlist:persistedWishlistReducer,
    checkout:persistedCheckoutReducer
  },

  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, REGISTER, PURGE], //  Redux Persist Errors Avoid Karega
      },
    }).concat(api.middleware)
      .concat(adminApi.middleware)
});

// Redux-Persist ke liye Store Persist Karo
export const persistor = persistStore(store);

//  API Listeners Setup Karo
setupListeners(store.dispatch);

export type RootState=ReturnType<typeof store.getState>
export type AppDispatch=typeof store.dispatch
