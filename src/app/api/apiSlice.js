import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { origin } from '../utils/origin'

export const apiSlice = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({
    baseUrl: origin,
    fetchFn: (...args) => fetch(...args),
  }),
  endpoints: () => ({}),
})
