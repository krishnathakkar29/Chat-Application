import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  iAmTyping: false,
  userTyping: false,
};

const typingSlice = createSlice({
  name: "typing",
  initialState,
  reducers: {
    setIAmTyping: (state, action) => {
      state.iAmTyping = action.payload;
    },
    setUserTyping: (state, action) => {
      state.userTyping = action.payload;
    },
  },
});

export default typingSlice;
export const { setIAmTyping, setUserTyping } = typingSlice.actions;