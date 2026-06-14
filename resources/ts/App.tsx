import React from 'react'
import { ChakraProvider } from '@chakra-ui/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { RouterProvider } from 'react-router'
import { router } from './libs/router'
import { system } from './libs/theme'
import { ApiError } from './libs/apiClient'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: (failureCount, error) => {
        if (error instanceof ApiError && error.status >= 400 && error.status < 500) return false
        return failureCount < 2
      },
    },
  },
})

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ChakraProvider value={system}>
      <RouterProvider router={router} />
    </ChakraProvider>
  </QueryClientProvider>
)

export default App
