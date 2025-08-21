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
  userLoginDetails:builder.query({
    query:()=>({
      url:'user-details/',
      method:'GET',
    }),
  }),
  userFollowRequest:builder.mutation({
    query:(data)=>({
      url:'profile/follow/request/',
      method:'POST',
      body:data,
    }),
  }),
  userUnFollowRequest:builder.mutation({
    query:(data)=>({
      url:'profile/unfollow/request/',
      method:'POST',
      body:data,
    }),
  }),
  userPosts:builder.query({
    query:()=>({
      url:'posts/user/posts/',
      method:'GET',
    }),
  }),
  likepost:builder.mutation({
    query:(data)=>({
      url:'posts/post/like/',
      method:'POST',
      body:data

    }),
  }),
  unlikepost:builder.mutation({
    query:(data)=>({
      url:'posts/post/unlike/',
      method:'POST',
      body:data
    }),
  }),
  postComments:builder.mutation({
    query:(data)=>({
      url:'posts/post/comments/',
      method:'POST',
      body:data
    }),
  }),
  postDelete:builder.mutation({
    query:(data)=>({
      url:'posts/post/delete/',
      method:'DELETE',
      body:data
    }),
  }),

  }),
});


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
  useUserLoginDetailsQuery,
  useUserFollowRequestMutation,
  useUserUnFollowRequestMutation,
  useUserPostsQuery,
  useLikepostMutation,
  useUnlikepostMutation,
  usePostCommentsMutation,
  usePostDeleteMutation,
} = userAuthenticationApi;
