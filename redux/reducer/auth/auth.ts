import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "@/store";
import { IUser, signinReducer } from "@/redux/action/auth";


const isBrowser = typeof window !== "undefined";

export const loginAction = createAsyncThunk(
  "auth/login",
  async (data: { token: {access: string; refresh: string}, user: IUser; roles: string[]; tokenExpiry: string }) => {
    const { token, user } = data;

    if (isBrowser) {
      localStorage.setItem("tandermis_user", JSON.stringify(user));
    
      localStorage.setItem(
        "tandermis_token",
        JSON.stringify(token.access)
      );

      localStorage.setItem(
        "tandermis_refresh_token",
        JSON.stringify(token.refresh)
      );
    }

    return {
      token: token.access,
      user,
      refresh: token.refresh
    };
  }
);

const storedUser = isBrowser ? localStorage.getItem("tandermis_user") : null;
const storedToken = isBrowser ? localStorage.getItem("tandermis_token") : null;
const storedRefresh = isBrowser ? localStorage.getItem("tandermis_refresh_token") : null;

const initialState: signinReducer = {
  user: storedUser ? JSON.parse(storedUser) : null,
  isAuthenticated: !!storedUser,
  token: storedToken || null,
  refresh: storedRefresh || null,
  loading: false,
  success: false,
  error: null,
};

export const signinSlice = createSlice({
  name: "signin",
  initialState,
  reducers: {
    // ✅ update access token after refresh
    setToken: (state, action: PayloadAction<{ token: string; tokenExpiry: number }>) => {
      state.token = action.payload.token;
      state.refresh = action.payload.token;
      state.isAuthenticated = true;

      if (isBrowser) {
        localStorage.setItem("tandermis_token", action.payload.token);
        localStorage.setItem("tandermis_refresh_token", String(action.payload.tokenExpiry));
      }
    },
     
    // ✅ logout user
    logoutUser: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      state.token = null;
      state.refresh = null;
      state.loading = false;
      state.success = false;
      state.error = null;

      if (isBrowser) {
        localStorage.removeItem("tandermis_user");
        localStorage.removeItem("tandermis_token");
        localStorage.removeItem("tandermis_refresh_token");
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

        const token = payload?.token;
        const refresh = payload?.refresh; 
        const user = payload?.user || null;

        state.token = token;
        state.refresh = refresh;
        state.user = user;

        if (isBrowser) {
          localStorage.setItem("tandermis_user", JSON.stringify(user));
          localStorage.setItem("tandermis_token", token);
          localStorage.setItem("tandermis_refresh_token", refresh);
        }
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

export const { setToken, logoutUser  } = signinSlice.actions;

export default signinSlice.reducer;

// ✅ Selectors
export const authState = (state: RootState) => state.auth;
export const selectedToken = (state: RootState) => state?.auth.token;
export const selectedUser = (state: RootState) => state.auth.user;
export const selectedRefresh = (state: RootState) => state.auth.refresh;
