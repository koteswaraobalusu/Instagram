import { createApi } from "@reduxjs/toolkit/query/react";
import baseQueryWithReauth from "./baseQueryWithReauth";
import { requestFormReset } from "react-dom";
import { data } from "react-router-dom";


export const userAuthenticationApi = createApi({
  reducerPath: 'userAuthenticationApi',
  baseQuery: baseQueryWithReauth,
  endpoints: (builder) => ({
    userSignup: builder.mutation({
      query: (userData) => ({
        url: 'register/request/',
        method: 'POST',
        body: userData,
      }),
    }),
    userSignupOtpVerify: builder.mutation({
      query: (otpData) => ({
        url: 'register/verify/',
        method: 'POST',
        body: otpData,
      }),
    }),
    userLogin: builder.mutation({
      query: (loginData) => ({
        url: 'login/',
        method: 'POST',
        body: loginData,
      }),
    }),
    protected: builder.query({
      query: () => ({
        url: 'protected/',
        method: 'GET',
      }),
    }),
    userLogout: builder.mutation({
      query: () => ({
        url: 'logout/',
        method: 'POST',
      }),
    }),
    refreshToken: builder.mutation({
      query: () => ({
        url: 'token/refresh/',
        method: 'POST',
      }),
  }),
  users:builder.query({
    query:()=>({
      url:'profile/users/suggest/',
      method:'GET',
    }),
  }),
  create_post_id:builder.mutation({
    query:()=>({
      url:'posts/post/create/',
      method:'POST',
    }),
  }),
  upload_posts:builder.mutation({
    query:(data)=>({
      url:'posts/post/upload/',
      method:'POST',
      body:data,
    }),
  }),

  }),
});

// ✅ Export all hooks
export const {
  useUserSignupMutation,
  useUserSignupOtpVerifyMutation,
  useUserLoginMutation,
  useProtectedQuery,
  useUserLogoutMutation,
  useRefreshTokenMutation,
  useUsersQuery,
  useCreate_post_idMutation,
  useUpload_postsMutation,
} = userAuthenticationApi;
