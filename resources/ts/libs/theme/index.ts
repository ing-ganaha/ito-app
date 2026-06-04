import { createSystem, defaultConfig, defineConfig } from '@chakra-ui/react'
import { colors } from './colors'

const config = defineConfig({
  globalCss: {
    'html, body': {
      bg: colors.background,
      color: colors.onSurface,
      fontFamily: "'M PLUS Rounded 1c', sans-serif",
      minHeight: '100vh',
    },
  },
})

export const system = createSystem(defaultConfig, config)
