import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api";

export const adminApi = createApi({
  reducerPath: "adminApi",
  baseQuery: fetchBaseQuery({
    baseUrl: BASE_URL,
    credentials: "include",
  }),

  tagTypes: ["Adminstats", "AdminOrders", "sellerPayments"],

  endpoints: (builder) => ({
    // 1. Get Dashboard Stats
    getDashBoardStats: builder.query({
      query: () => "/admin/dashboard-stats",
      providesTags: ["Adminstats"],
    }),

    // 2. Get Admin Orders with optional filters
    getAdminOrders: builder.query({
      query: (params) => {
        const queryParams = new URLSearchParams();
        if (params) {
          Object.entries(params).forEach(([key, value]) => {
            if (value) queryParams.append(key, value.toString());
          });
        }
        return `/admin/orders?${queryParams.toString()}`;
      },
      providesTags: ["AdminOrders"],
    }),

    // 3. Update Order
    updateOrder: builder.mutation({
      query: ({ orderId, update }) => ({
        url: `/admin/orders/${orderId}`,
        method: "PUT",
        body: update,
      }),
      invalidatesTags: (_result, _error, { orderId }) => [
        { type: "AdminOrders", id: orderId },
        "AdminOrders",
        "Adminstats",
      ],
    }),

    // 4. Get Seller Payments
    getSellerPayment: builder.query({
      query: (params) => {
        const queryParams = new URLSearchParams();
        if (params) {
          Object.entries(params).forEach(([key, value]) => {
            if (value) queryParams.append(key, value.toString());
          });
        }
        return `/admin/seller-payments?${queryParams.toString()}`;
      },
      providesTags: ["sellerPayments"],
    }),

    // 5. Process Seller Payment
    processSellerPayment: builder.mutation({
      query: ({ orderId, paymentData }) => ({
        url: `/admin/process-seller-payment/orderId}`,
        method: "post",
        body: paymentData,
      }),
      invalidatesTags: (_result, _error, { orderId }) => [
        { type: "AdminOrders", id: orderId },
        "AdminOrders",
        "Adminstats",
        "sellerPayments"
      ],
    }),
  }),
});


export const {
  useGetDashBoardStatsQuery,
  useGetAdminOrdersQuery,
  useUpdateOrderMutation,
  useGetSellerPaymentQuery,
  useProcessSellerPaymentMutation,
}=adminApi