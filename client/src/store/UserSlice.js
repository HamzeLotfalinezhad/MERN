import { createSlice } from "@reduxjs/toolkit";

export const userSlice = createSlice({
  name: 'user',
  initialState: {
    // loading: false,
    user: null,
    isAdmin: false,
  },
  reducers: {
    login: (state, action) => {
      state.user = action.payload; // put user object data here after success login with dispatch in login page
      state.isAdmin = action.payload.isAdmin;
    },
    logout: (state) => {
      state.user = null;
      // state.loggedIn = false;
    }
  }
})

export const { login, logout } = userSlice.actions;
export const selectUser = (state) => state.user.user;
export default userSlice.reducer