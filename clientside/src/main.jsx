import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import { ChakraProvider } from '@chakra-ui/react'
import { BrowserRouter } from 'react-router-dom'
import ChatProvider from './Context/ChatProvider.jsx'
import { extendTheme } from "@chakra-ui/react"
const theme = extendTheme({
  colors: {
    brand: {
      100: "#0466c8",
      200: "#ff5d8f",
      300: "#b8e0d2",
      // ...
      900: "#aa3e98",
    },
  },
})

ReactDOM.createRoot(document.getElementById('root')).render(
  <ChakraProvider theme={theme}>
    <BrowserRouter>
      <ChatProvider>
        <App />
      </ChatProvider>
    </BrowserRouter>
  </ChakraProvider>
);
