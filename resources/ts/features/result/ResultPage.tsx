import React from 'react'
import { useParams } from 'react-router'
import { Box, Flex, Text } from '@chakra-ui/react'
import TopBar from '../../components/TopBar'
import Icon from '../../components/Icon'
import { colors } from '../../libs/theme/colors'
import { useLeaveRoom } from '../../libs/useLeaveRoom'
import { useResult } from './hooks/useResult'

const ResultPage = () => {
  const { code } = useParams<{ code: string }>()
  const { topic, players } = useResult(code)
  const { leave: handleLeave } = useLeaveRoom(code)

  return (
    <Box
      minH="100vh"
      display="flex"
      flexDir="column"
      position="relative"
      _before={{
        content: '""',
        position: 'absolute',
        inset: 0,
        zIndex: 0,
        pointerEvents: 'none',
        backgroundImage: 'radial-gradient(#c5c6cd 1px, transparent 1px)',
        backgroundSize: '16px 16px',
        opacity: 0.4,
      }}
    >
      <Box position="relative" zIndex={1} display="flex" flexDir="column" minH="100vh">
        <TopBar />

        <Flex
          as="main"
          flex={1}
          direction="column"
          align="center"
          px={{ base: '16px', md: '48px' }}
          py="32px"
          maxW="1280px"
          w="full"
          mx="auto"
        >
          <Box textAlign="center" mb="32px" w="full" maxW="2xl">
            <Text
              fontSize="48px"
              fontWeight="800"
              lineHeight="1.1"
              letterSpacing="-0.02em"
              color={colors.primary}
            >
              結果
            </Text>
          </Box>

          <Box w="full" maxW="xl" mb="8px">
            <Text
              fontSize="12px"
              fontWeight="600"
              letterSpacing="0.05em"
              color={colors.onSurfaceVariant}
              textTransform="uppercase"
              px={1}
            >
              今回のお題: {topic ?? '...'}
            </Text>
          </Box>

          <Flex direction="column" gap="8px" w="full" maxW="xl" mb="32px">
            {players.map((p) => (
              <ResultRow key={p.id} name={p.name} number={p.number} />
            ))}
          </Flex>

          <Box w="full" maxW="xl" mt="auto" pt="32px">
            <Box
              as="button"
              w="full"
              display="flex"
              alignItems="center"
              justifyContent="center"
              gap={2}
              bg={colors.surfaceContainerLowest}
              color={colors.primary}
              fontSize="14px"
              fontWeight="700"
              border="1px solid"
              borderColor={colors.outlineVariant}
              borderRadius="lg"
              py={4}
              px="24px"
              cursor="pointer"
              transition="background 0.2s"
              _hover={{ bg: colors.surfaceVariant }}
              onClick={handleLeave}
            >
              <Icon name="home" />
              ホームに戻る
            </Box>
          </Box>
        </Flex>
      </Box>
    </Box>
  )
}

// ── Sub-components ────────────────────────────────────────────

const ResultRow = ({ name, number }: { name: string; number: number | null }) => (
  <Flex
    bg={colors.surfaceContainerLowest}
    border="1px solid"
    borderColor={colors.outlineVariant}
    borderRadius="lg"
    p="16px"
    justify="space-between"
    align="center"
  >
    <Text fontSize="18px" fontWeight="700" color={colors.primary}>
      {name}
    </Text>
    <Text
      fontSize="48px"
      fontWeight="800"
      lineHeight="1.1"
      letterSpacing="-0.02em"
      color={colors.secondary}
    >
      {number !== null ? String(number).padStart(2, '0') : '--'}
    </Text>
  </Flex>
)

export default ResultPage
