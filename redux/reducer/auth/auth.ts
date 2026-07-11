import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "@/store";
import { IUser, SigninReducer } from "@/redux/action/auth";
import {
  clearAuthStorage,
  getAccessToken,
  getRefreshToken,
  getStoredUser,
  setAuthStorage,
} from "@/utils/authStorage";

const isBrowser = typeof window !== "undefined";

export const loginAction = createAsyncThunk(
  "auth/login",
  async (data: {
    token: { access: string; refresh: string };
    user?: IUser | null;
  }) => {
    const { token, user = null } = data;

    if (isBrowser) {
      setAuthStorage({
        access: token.access,
        refresh: token.refresh,
        user,
      });
    }

    return {
      token: token.access,
      user,
      refresh: token.refresh,
    };
  }
);

const initialState: SigninReducer = {
  user: isBrowser ? getStoredUser<IUser>() : null,
  isAuthenticated: isBrowser ? !!getAccessToken() : false,
  token: isBrowser ? getAccessToken() : null,
  refresh: isBrowser ? getRefreshToken() : null,
  loading: false,
  success: false,
  error: null,
};

export const signinSlice = createSlice({
  name: "signin",
  initialState,
  reducers: {
    setAuthTokens: (
      state,
      action: PayloadAction<{ access: string; refresh: string }>
    ) => {
      state.token = action.payload.access;
      state.refresh = action.payload.refresh;
      state.isAuthenticated = true;

      if (isBrowser) {
        setAuthStorage({
          access: action.payload.access,
          refresh: action.payload.refresh,
          user: state.user,
        });
      }
    },

    logoutUser: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      state.token = null;
      state.refresh = null;
      state.loading = false;
      state.success = false;
      state.error = null;

      if (isBrowser) {
        clearAuthStorage();
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginAction.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginAction.fulfilled, (state, { payload }) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.success = true;
        state.error = null;
        state.token = payload.token;
        state.refresh = payload.refresh;
        state.user = payload.user;
      })
      .addCase(loginAction.rejected, (state, { error }) => {
        state.loading = false;
        state.isAuthenticated = false;
        state.success = false;
        state.error = error;
        state.user = null;
        state.token = null;
        state.refresh = null;
      });
  },
});

export const { setAuthTokens, logoutUser } = signinSlice.actions;

export default signinSlice.reducer;

export const authState = (state: RootState) => state.auth;
export const selectedToken = (state: RootState) => state?.auth.token;
export const selectedUser = (state: RootState) => state.auth.user;
export const selectedRefresh = (state: RootState) => state.auth.refresh;
