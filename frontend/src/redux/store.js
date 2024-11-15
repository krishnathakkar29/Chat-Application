import { configureStore } from "@reduxjs/toolkit";
import authSlice from "./reducers/authSlice";
import miscSlice from "./reducers/miscSlice";
import api from "./api/api";
import chatSlice from "./reducers/chatSlice";
import typingSlice from "./reducers/typingSlice";

export const store = configureStore({
  reducer: {
    [authSlice.name]: authSlice.reducer,
    [miscSlice.name]: miscSlice.reducer,
    [chatSlice.name]: chatSlice.reducer,
    [typingSlice.name]: typingSlice.reducer,
    [api.reducerPath]: api.reducer,
  },
  middleware: (mid) => [...mid(), api.middleware],
});

export default store;
