import { ChakraProvider, ThemeConfig } from '@chakra-ui/react'
import { extendTheme } from '@chakra-ui/react'

const config: ThemeConfig = {
  initialColorMode: 'dark',
  useSystemColorMode: false,
}

const theme = extendTheme({
  config,
  colors: {
    primary: {
      50: '#FFa080',
      100: '#FFa080',
      200: '#EC3E6F',
      300: '#FFa080',
      400: '#EC3E6F',
      500: '#EC3E6F',
      600: '#EC3E6F',
      700: '#EC3E6F',
      800: '#EC3E6F',
      900: '#EC3E6F',
    },
  },
})

export default function Chakra({ children }: { children: React.ReactNode }) {
  return <ChakraProvider theme={theme}>{children}</ChakraProvider>
}
