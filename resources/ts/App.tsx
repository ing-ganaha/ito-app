import React from 'react'
import { ChakraProvider } from '@chakra-ui/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { RouterProvider } from 'react-router'
import { router } from './libs/router'
import { system } from './libs/theme'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: (failureCount, error) => {
        if (error instanceof Error && error.message.startsWith('HTTP 4')) return false
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
