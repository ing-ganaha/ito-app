import React from 'react'
import { ChakraProvider } from '@chakra-ui/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { RouterProvider } from 'react-router'
import { router } from './libs/router'
import { system } from './libs/theme'

const queryClient = new QueryClient()

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ChakraProvider value={system}>
      <RouterProvider router={router} />
    </ChakraProvider>
  </QueryClientProvider>
)

export default App
