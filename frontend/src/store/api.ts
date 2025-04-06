import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

const BASE_URl=process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080"

export const api=createApi({
    baseQuery:fetchBaseQuery({
        baseUrl:BASE_URl,
        credentials:"include"
    }),
    tagTypes:["User"],
    endpoints:(builder)=>({
      
    })
}) 