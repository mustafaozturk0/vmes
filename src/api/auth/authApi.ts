import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { DevRootURL } from "../EndPoints";
import { LoginDto, LoginResponseDto } from "../swagger/swagger.api";

export const authApi = createApi({
  baseQuery: fetchBaseQuery({
    baseUrl: DevRootURL as unknown as string,
    prepareHeaders: (headers) => {
      return headers;
    },
  }),
  endpoints: (builder) => ({
    login: builder.mutation<LoginResponseDto, LoginDto>({
      query: (credentials) => ({
        url: "api/auth/",
        method: "POST",
        body: credentials,
      }),
    }),
  }),
});

export const { useLoginMutation } = authApi;
