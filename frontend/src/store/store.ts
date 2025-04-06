import { configureStore } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/query/react";
import storage from "redux-persist/lib/storage";
import { persistReducer, persistStore, FLUSH, REHYDRATE, PAUSE, PURGE, PERSIST, REGISTER } from "redux-persist";
import userReducer from "./slice/userSlice";
import { api } from "./api"; //  Ensure `api` is imported!

// 🔥 Persist Configuration for User
const userPersistConfig = {
  key: "user", // localStorage me "user" key ke under save hoga
  storage, // localStorage use hoga
  whitelist: ["user", "isEmailVerified", "isLoggedIn"], // Sirf ye values persist hongi
};

//  Persisted Reducer Create Karo
const persistedUserReducer = persistReducer(userPersistConfig, userReducer);
//Pehla Argument → userPersistConfig → Batata hai kahan store hoga aur kaunse values save hongi.
//Dusra Argument → userReducer → Yeh batata hai ki kaunsa reducer persist hoga

//  Redux Store Configure Karo
export const store = configureStore({
  reducer: {
    [api.reducerPath]: api.reducer, 
    user: persistedUserReducer, //  Persisted Reducer Use Ho Raha Hai
  },

  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, REGISTER, PURGE], //  Redux Persist Errors Avoid Karega
      },
    }).concat(api.middleware), 
});

// Redux-Persist ke liye Store Persist Karo
export const persistor = persistStore(store);

//  API Listeners Setup Karo
setupListeners(store.dispatch);

export type RootState=ReturnType<typeof store.getState>
export type AppDispatch=typeof store.dispatch
