import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { extensionId, origin } from '../utils/origin'

export const apiSlice = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({
    baseUrl: origin,
    prepareHeaders: (headers) => {
      headers.set('X-Client-Id', extensionId)
      return headers
    },
    fetchFn: (...args) => fetch(...args),
  }),
  endpoints: () => ({}),
})
