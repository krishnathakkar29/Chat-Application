import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isMobile: false,
  isSearch: false,
  isNotification: false,
  isNewGroup: false,
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
    setIsNotification: (state, action) => {
      state.isNotification = action.payload;
    },
    setIsNewGroup: (state, action) => {
      state.isNewGroup = action.payload;
    },
  },
});

export default miscSlice;
export const { setIsMobile, setIsSearch, setIsNotification, setIsNewGroup } =
  miscSlice.actions;
