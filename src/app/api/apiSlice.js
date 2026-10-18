import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { proxyOrigin } from '../utils/proxy'

export const apiSlice = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({
    baseUrl: proxyOrigin,
    fetchFn: (...args) => fetch(...args),
  }),
  endpoints: () => ({}),
})
