import React from 'react'
import { Box, Flex } from '@chakra-ui/react'
import { colors } from '../libs/theme/colors'

const TopBar = () => (
  <Flex
    as="header"
    position="sticky"
    top={0}
    zIndex={40}
    bg={colors.background}
    borderBottom="1px solid"
    borderColor={colors.outlineVariant}
    px={{ base: '16px', md: '48px' }}
    py="12px"
    justify="space-between"
    align="center"
  >
    <Box
      as="span"
      fontSize="48px"
      fontWeight="800"
      lineHeight="1.1"
      letterSpacing="-0.02em"
      fontFamily="'Plus Jakarta Sans', sans-serif"
      color={colors.secondary}
      cursor="pointer"
      transition="opacity 0.2s"
      _hover={{ opacity: 0.8 }}
    >
      ito
    </Box>
  </Flex>
)

export default TopBar
