import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isMobile: false,
  isSearch: false,
};

const miscSlice = createSlice({
  name: "misc",
  initialState,
  reducers: {
    setIsMobile: (state, action) => {
      state.isMobile = action.payload;
    },
    setIsSearch: (state, action) => {
      state.isSearch = action.payload;
    },
  },
});

export default miscSlice;
export const { setIsMobile, setIsSearch } = miscSlice.actions;
