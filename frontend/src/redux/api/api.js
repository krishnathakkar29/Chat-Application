import { server } from "@/config";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const api = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({ baseUrl: `${server}/api/v1/` }),
  tagTypes: ["User", "Chat"],

  endpoints: (builder) => ({
    searchUser: builder.query({
      query: (name) => ({
        url: `user/search?name=${name}`,
        credentials: "include",
      }),
      providesTags: "User",
    }),
    sendFriendRequest: builder.mutation({
      query: (data) => ({
        url: "user/sendrequest",
        method: "PUT",
        credentials: "include",
        body: data,
      }),
      invalidatesTags: ["User"],
    }),
  }),
});

export default api;
export const { useLazySearchUserQuery, useSendFriendRequestMutation } = api;
