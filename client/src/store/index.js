import { configureStore } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import userReducer from "./UserSlice";
import recordReducer from "./RecordSlice";
import { FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER, } from 'redux-persist'

// added persistor to kepp redux states value on page refrehs
const persistConfig = {
  key: "root",
  storage,
};

const persistedReducer_user = persistReducer(persistConfig, userReducer);
const persistedReducer_record = persistReducer(persistConfig, recordReducer);

const store = configureStore({
  reducer: {
    user: persistedReducer_user,
    record: persistedReducer_record,
  },
  middleware: (getDefaultMiddleware) => // added this to remove error of serialize
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});


const persistor = persistStore(store);

export { store, persistor };





////////////////// store without persitor

// import { configureStore } from "@reduxjs/toolkit"
// import userReducer from "./UserSlice"

// const store = configureStore({
//   reducer: {
//     user: userReducer,
//   }
// })

// export default store
