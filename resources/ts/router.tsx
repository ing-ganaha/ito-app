import { createBrowserRouter } from 'react-router'
import { Button } from '@chakra-ui/react'

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Button colorPalette="teal">Hello React Router</Button>,
  },
])
