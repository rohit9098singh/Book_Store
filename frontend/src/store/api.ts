import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const BASE_URl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api";

const API_URLS = {
  // user related urls
  REGISTER: `${BASE_URl}/auth/register`,
  LOGIN: `${BASE_URl}/auth/login`,
  VERIFY_EMAIL: (token: string) => `${BASE_URl}/auth/verify-email/${token}`,
  FORGET_PASSWORD: `${BASE_URl}/auth/forgot-password`,
  RESET_PASSWORD: (token: string) => `${BASE_URl}/auth/reset-password/${token}`,
  VERIFY_AUTH: `${BASE_URl}/auth/verify-auth`,
  LOGOUT: `${BASE_URl}/auth/logout`,
  UPDATE_USER_PROFILE: (userId: string) =>
    `${BASE_URl}/user/profile/update/${userId}`,

  // product related urls :
  CREATE_PRODUCT: `${BASE_URl}/product/create-product`,
  GET_ALL_PRODUCTS: `${BASE_URl}/product/get-all-product`,
  GET_PRODUCT_BY_ID: (id: string) =>
    `${BASE_URl}/product/get-product-by-Id/${id}`,
  DELETE_PRODUCT: (productId: string) =>
    `${BASE_URl}/product/delete-product/${productId}`,
  GET_PRODUCT_BY_SELLER_ID: (sellerId: string) =>
    `${BASE_URl}/product/get-product-by-sellerId/${sellerId}`,

  // Cart realted urls
  ADD_TO_CART: `${BASE_URl}/cart/add-to-cart`,
  GET_CART_BY_USER_ID: (userId: string) => `${BASE_URl}/cart/${userId}`,
  REMOVE_FROM_CART: (productId: string) =>
    `${BASE_URl}/cart/remove/${productId}`,

  // wishlist related urls
  ADD_TO_WISHLIST: `${BASE_URl}/wishlist/add-to-wishlist`,
  GET_WISHLIST_BY_USER_ID: (userId: string) => `${BASE_URl}/wishlist/${userId}`,
  REMOVE_FROM_WISHLIST: (productId: string) =>
    `${BASE_URl}/wishlist/remove/${productId}`,

  // order related urls
  CREATE_ORDER: `${BASE_URl}/order/create-order`,
  GET_LOGGED_IN_USER_ORDERS: `${BASE_URl}/order/user-order`,
  GET_ORDER_BY_ID: (id: string) => `${BASE_URl}/order/user-order/${id}`,
  CREATE_RAZORPAY_PAYMENT: `${BASE_URl}/order/payment-razorpay`,

  // address related urls
  CREATE_OR_UPDATE_ADDRESS: `${BASE_URl}/user/address/create-or-update-address-by-userId`,
  GET_ADDRESS_BY_USER_ID: `${BASE_URl}/user/address/get-address-by-userId`,
};

export const api = createApi({
  // createApi Redux Toolkit ka ek function (factory) hai
  //  jo tumhare liye API wali dukaan banata hai.
  //  Jisme tum:

  baseQuery: fetchBaseQuery({
    //Ye Redux Toolkit ke andar built-in hota hai, jo automatically tumhare liye server se request bhejta hai — bilkul jaise hum normally fetch() use karte hain JavaScript mein, lekin thoda aur smart version.

    baseUrl: BASE_URl, //Tum server ka main gate batate ho — jaise "http://localhost:8080/api"

    credentials: "include", //Matlab agar server cookie ya token de toh usko bhi bhej do har request ke sath (jaise ek ID card).
  }),

  tagTypes: ["User", "Product", "Cart", "WishList", "Order", "Address"], // ek label ke jaise aage ka use ke liye

  endpoints: (builder) => ({
    //Yeh ek function hai jo tumhare API ke kaam (endpoints) define karta hai.

    //builder ek helper hai jo tumhe mutation ya query banane mein madad karta hai.

    // Socho builder ek kaam karne waala banda hai, usse tum bol rahe ho:

    //Yeh register ka kaam tum sambhaal lo!”

    // USER ENDPOINTS
    register: builder.mutation({
      // Jab tum server pe kuch change karte ho:
      //    1) Register karna
      //    2) Login karna
      //    3) Product add karna
      //    4) Profile update karna
      //    5) Cart me item daalna => tab hum  bulder.mutiton he likhenge
      query: (userData) => ({
        url: API_URLS.REGISTER,
        method: "POST",
        body: userData, // jaise data hum req.body se uthate hai na postman me bhj ke use tarah ka hai ye
      }),
    }),
    login: builder.mutation({
      query: (userData) => ({
        url: API_URLS.LOGIN,
        method: "POST",
        body: userData,
      }),
    }),

    verifyEmail: builder.mutation({
      query: (token) => ({
        url: API_URLS.VERIFY_EMAIL(token),
        method: "POST",
        //Even though verifyEmail ek GET request hai,   uska intent data fetch karna nahi hai...
        //Server ko batana ke "yeh user email verify kar raha hai" — ek action perform ho raha hai, data fetch nahi ho raha.
        //Isiliye hum isko mutation treat karte hain.
      }),
    }),
    forgotPassword: builder.mutation({
      query: (email) => ({
        url: API_URLS.FORGET_PASSWORD,
        method: "POST",
        body: { email },
      }),
    }),
    resetPassword: builder.mutation({
      query: ({ token, newPassword }) => ({
        url: API_URLS.RESET_PASSWORD(token),
        method: "POST",
        body: { newPassword },
      }),
    }),
    verifyAuth: builder.mutation({
      query: () => ({
        url: API_URLS.VERIFY_AUTH,
        method: "GET",
        //Iska purpose hai: “Check karo user valid hai ya nahi, agar valid nahi hai toh token expire ya session end kar do.”

        //It’s not just "get some data"

        // It’s "verify the session/token" = action

        // Isliye hum use mutation treat karte hain — kyunki wo backend pe kuch check/change trigger kar raha hai
      }),
    }),
    logoutApi: builder.mutation({
      query: () => ({
        url: API_URLS.LOGOUT,
        method: "POST",
      }),
    }),
    updateUser: builder.mutation({
      query: ({ userId, userData }) => ({
        url: API_URLS.UPDATE_USER_PROFILE(userId),
        method: "PUT",
        body: userData, //{ "name": "Rohit", "email": "..." } aise aara hai isliye without {} written
      }),
    }),

    // PRODUCT RELATED ENDPOINTS
    addProduct: builder.mutation({
      query: (productData) => ({
        url: API_URLS.CREATE_PRODUCT,
        method: "POST",
        body: productData,
      }),
      invalidatesTags: ["Product"],

      //   1)Tu getAllProducts se saare products fetch karta hai → RTK Query us data ko cache kar leta hai.
      //   2)Fir tu addProduct se naya product add karta hai.
      //   3)By default, getAllProducts waali list update nahi hoti — woh purana cache hi dikhata hai.
      // lekin ye likne se  invalidatesTags:["Product"] => RTK Query ko ye signal milta hai:
      // 4)Arre bhai, Product related kuch change hua hai, toh jitni bhi Product tag waali queries thi, unko re-fetch kar do!
    }),

    getAllProducts: builder.query({
      query: () => ({
        url: API_URLS.GET_ALL_PRODUCTS,
        method: "GET",
      }),
    }),

    getProductById: builder.query({
      query: (id) => ({
        url: API_URLS.GET_PRODUCT_BY_ID(id),
        // jo ke hum query likh rahe hai isliye hame method batane ke zarurat nhi qke query ka matlab he hota hai get karna kuch bhi
      }),
      providesTags: ["Product"], // “Jo data abhi fetch ho raha hai, use Product tag se jod do (tag karo).”
    }),

    deleteProduct: builder.mutation({
      query: (productId) => ({
        url: API_URLS.DELETE_PRODUCT(productId),
        method: "DELETE",
      }),
      invalidatesTags: ["Product"],
    }),

    getProductsBySellerId: builder.query({
      query: (sellerId) => ({
        url: API_URLS.GET_PRODUCT_BY_SELLER_ID(sellerId),
      }),
      providesTags: ["Product"],
    }),

    // Cart Related Endpoints
    addToCart: builder.mutation({
      query: (cartData) => ({
        url: API_URLS.ADD_TO_CART,
        method: "POST",
        body: cartData,
      }),
      invalidatesTags: ["Cart"],
    }),
    getCartByUserId: builder.query({
      query: (userId) => ({
        url: API_URLS.GET_CART_BY_USER_ID(userId),
      }),
      providesTags: ["Cart"],
    }),
    removeFromCart: builder.mutation({
      query: (productId) => ({
        url: API_URLS.REMOVE_FROM_CART(productId),
        method: "DELETE",
      }),
      invalidatesTags: ["Cart"],
    }),

    // WishList Related Endpoints
    addToWishList: builder.mutation({
      query: (productId) => ({
        url: API_URLS.ADD_TO_WISHLIST,
        method: "POST",
        body: { productId },
      }),
      invalidatesTags: ["WishList"],
    }),

    getWishlistByUserId: builder.query({
      query: (userId) => ({
        url: API_URLS.GET_WISHLIST_BY_USER_ID(userId),
        method: "GET",
      }),
      providesTags: ["WishList"],
    }),

    removeFromWishlist: builder.mutation({
      query: (productId) => ({
        url: API_URLS.REMOVE_FROM_WISHLIST(productId),
        method: "DELETE",
      }),
      invalidatesTags: ["WishList"],
    }),

    // Order Related Endpoints
    createOrUpdateOrder: builder.mutation({
      query: ({ orderId, orderData }) => ({
        url: API_URLS.CREATE_ORDER, 
        method: orderId ? "PATCH" : "POST",
        body: orderData,
      }),
      invalidatesTags: ["Order"],
    }),

    getUserOrders: builder.query({
      query: () => ({
        url: API_URLS.GET_LOGGED_IN_USER_ORDERS,
      }),
      providesTags: ["Order"],
    }),

    getOrderById: builder.query({
      query: (orderId) => ({
        url: API_URLS.GET_ORDER_BY_ID(orderId),
      }),
      providesTags: ["Order"],
    }),

    createRazorpayPayment: builder.mutation({
      query: (orderId) => ({
        url: API_URLS.CREATE_RAZORPAY_PAYMENT,
        method: "POST",
        body: {orderId},
      }),
    }),

    // Address Related Endpoints
    createOrUpdateAddress: builder.mutation<any,any>({
      query: (addressData) => ({
        url: API_URLS.CREATE_OR_UPDATE_ADDRESS,
        method: "POST",
        body: addressData,
      }),
      invalidatesTags:["Address"]
    }),
    getAddressByUserId: builder.query<any[],void>({
      query: () => ({
        url: API_URLS.GET_ADDRESS_BY_USER_ID,
        method: "GET",
      }),
      providesTags:["Address"]
    }),
  }),
});

export const {
  useRegisterMutation,
  useLoginMutation,
  useVerifyEmailMutation,
  useForgotPasswordMutation,
  useResetPasswordMutation,
  useVerifyAuthMutation,
  useLogoutApiMutation,
  useUpdateUserMutation,

  useAddProductMutation,
  useGetAllProductsQuery,
  useGetProductByIdQuery,
  useDeleteProductMutation,
  useGetProductsBySellerIdQuery,

  useAddToCartMutation,
  useGetCartByUserIdQuery,
  useRemoveFromCartMutation,

  useAddToWishListMutation,
  useGetWishlistByUserIdQuery,
  useRemoveFromWishlistMutation,

  useCreateOrUpdateOrderMutation,
  useGetUserOrdersQuery,
  useGetOrderByIdQuery,
  useCreateRazorpayPaymentMutation,

  useCreateOrUpdateAddressMutation,
  useGetAddressByUserIdQuery,
} = api;
