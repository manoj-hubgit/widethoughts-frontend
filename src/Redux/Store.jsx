import { combineReducers, configureStore } from "@reduxjs/toolkit";
import userReducer from "./Slice/UserSlice"
import persistReducer from "redux-persist/lib/persistReducer";
import persistStore from "redux-persist/es/persistStore";
import storage from "redux-persist/lib/storage";
import themeReducer from "./Slice/ThemeSlice"

const rootReducer =combineReducers({
    user:userReducer,
    theme:themeReducer
})
const persistConfig={
    key:"root",
    storage,
    version:1
}
const persistedReducer=persistReducer(persistConfig,rootReducer)

export const store =configureStore({
   reducer:persistedReducer,
   middleware:(getDefaultMiddleware)=>{
   return getDefaultMiddleware({serializableCheck:false})
   }
})
export const persistor= persistStore(store);

