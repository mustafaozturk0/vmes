import {
  BaseQueryFn,
  createApi,
  FetchArgs,
  fetchBaseQuery,
  FetchBaseQueryError,
  retry,
} from "@reduxjs/toolkit/query/react";

import { DevRootURL } from "./EndPoints";
import { RootState } from "../store/Store";
import { fetchUserResponse, setUserResponse } from "../fetchers/locale-fetcher";
import { setAuthenticationResult } from "../slices/auth/AuthSlice";
import { LoginResponseDto } from "./swagger/swagger.api";

export const baseQuery = fetchBaseQuery({
  baseUrl: DevRootURL + "/api",
  prepareHeaders: (headers, { getState }) => {
    const token = (getState() as RootState).auth.authenticationResult
      .access_token;
    if (token) {
      headers.set("Authorization", `${token}`);
    }
    return headers;
  },
});

const baseQueryWithReauth: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  let result = await baseQuery(args, api, extraOptions);

  if (result.error && result.error.status === 401) {
    const userResponse = await fetchUserResponse();
    const refreshResult = await baseQuery(
      {
        method: "POST",
        url: "/auth/refreshToken",
        body: { refreshToken: userResponse.refreshToken },
      },
      api,
      extraOptions
    );
    if (refreshResult.data) {
      api.dispatch(
        setAuthenticationResult(refreshResult.data as LoginResponseDto)
      );
      await setUserResponse(refreshResult.data as LoginResponseDto);
      result = await baseQuery(args, api, extraOptions);
    } else {
      localStorage.clear();
      api.dispatch(setAuthenticationResult(null));
    }
  }

  return result;
};

const baseQueryWithRetry = retry(baseQueryWithReauth, { maxRetries: 2 });

/**
 * Create a base API to inject endpoints into elsewhere.
 * Components using this API should import from the injected site,
 * in order to get the appropriate types,
 * and to ensure that the file injecting the endpoints is loaded
 */
export const api = createApi({
  /**
   * `reducerPath` is optional and will not be required by most users.
   * This is useful if you have multiple API definitions,
   * e.g. where each has a different domain, with no interaction between endpoints.
   * Otherwise, a single API definition should be used in order to support tag invalidation,
   * among other features
   */
  reducerPath: "splitApi",
  /**
   * A bare bones base query would just be `baseQuery: fetchBaseQuery({ baseUrl: '/' })`
   */
  baseQuery: baseQueryWithRetry,
  /**
   * Tag types must be defined in the original API definition
   * for any tags that would be provided by injected endpoints
   */
  tagTypes: [],
  /**
   * This api has endpoints injected in adjacent files,
   * which is why no endpoints are shown below.
   * If you want all endpoints defined in the same file, they could be included here instead
   */
  endpoints: () => ({}),
});
