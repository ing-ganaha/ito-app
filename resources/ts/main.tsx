import React from 'react'
import ReactDOM from 'react-dom/client'
import { ChakraProvider, defaultSystem } from '@chakra-ui/react'
import { RouterProvider } from 'react-router'
import { router } from './router'

ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
        <ChakraProvider value={defaultSystem}>
            <RouterProvider router={router} />
        </ChakraProvider>
    </React.StrictMode>
)