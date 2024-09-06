import { createSlice, PayloadAction } from "@reduxjs/toolkit";

import {
  clearUserResponse,
  fetchUserResponse,
  setUserResponse,
} from "../../fetchers/locale-fetcher";
import { AppDispatch, RootState } from "../../store/Store";
import { authApi } from "../../api/auth/authApi";
import { LoginResponseDto } from "../../api/swagger/swagger.api";

export interface AuthState {
  authenticationResult: LoginResponseDto | null;
}

const initialState: AuthState = {
  authenticationResult: null,
};

const slice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setAuthenticationResult: (
      state,
      action: PayloadAction<LoginResponseDto | null>
    ) => {
      state.authenticationResult = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addMatcher(
      authApi.endpoints.login.matchFulfilled,
      (state, { payload }) => {
        state.authenticationResult = payload;
        setUserResponse(payload);
      }
    );
  },
});

export const { setAuthenticationResult } = slice.actions;

export const signOutAction = () => async (dispatch: any) => {
  await clearUserResponse();
  dispatch(setAuthenticationResult(null));
};

export const persistUserAndTokensOnRefresh = (dispatch: AppDispatch) => {
  fetchUserResponse().then((response: any) => {
    dispatch(setAuthenticationResult(response));
  });
};
export const signoutIfUserNotPresent = (dispatch: AppDispatch) => {
  fetchUserResponse().then((response: any) => {
    if (!response) {
      dispatch(signOutAction());
    }
  });
};

export default slice.reducer;

export const selectCurrentUser = (state: RootState) =>
  state.auth.authenticationResult ? state.auth.authenticationResult.user : null;
