import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { Role } from "@/constants/roles";

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: Role;
  customerId?: string;
}

interface AuthState {
  user: UserProfile | null;
  accessToken: string | null;
  refreshToken: string | null;
  status: "idle" | "loading" | "authenticated";
  initialized: boolean;
}

const initialState: AuthState = {
  user: null,
  accessToken: null,
  refreshToken: null,
  status: "idle",
  initialized: false,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setSession(
      state,
      action: PayloadAction<{ user: UserProfile; accessToken: string; refreshToken?: string }>
    ) {
      state.user = action.payload.user;
      state.accessToken = action.payload.accessToken;
      state.refreshToken = action.payload.refreshToken ?? null;
      state.status = "authenticated";
      state.initialized = true;
    },
    clearSession(state) {
      state.user = null;
      state.accessToken = null;
      state.refreshToken = null;
      state.status = "idle";
      state.initialized = true;
    },
    setAuthLoading(state) {
      state.status = "loading";
    },
    setAuthInitialized(state) {
      state.initialized = true;
    },
  },
});

export const { setSession, clearSession, setAuthLoading, setAuthInitialized } = authSlice.actions;
export default authSlice.reducer;
