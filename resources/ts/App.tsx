import React from 'react'
import { ChakraProvider } from '@chakra-ui/react'
import { RouterProvider } from 'react-router'
import { router } from './libs/router'
import { system } from './libs/theme'

const App = () => (
  <ChakraProvider value={system}>
    <RouterProvider router={router} />
  </ChakraProvider>
)

export default App
