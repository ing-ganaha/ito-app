import React from 'react'
import { useParams } from 'react-router'
import { Box, Flex, Text } from '@chakra-ui/react'
import TopBar from '../../components/TopBar'
import Icon from '../../components/Icon'
import { colors } from '../../libs/theme/colors'
import { useGame } from './hooks/useGame'

const GamePage = () => {
  const { code } = useParams<{ code: string }>()
  const { topic, number, isReady, handleReady } = useGame(code)

  return (
    <Box minH="100vh" display="flex" flexDir="column">
      <TopBar />

      <Flex
        as="main"
        flex={1}
        direction="column"
        align="center"
        justify="center"
        px={{ base: '16px', md: '48px' }}
        py={{ base: '32px', md: '48px' }}
        pb="120px"
        gap="32px"
        maxW="1280px"
        w="full"
        mx="auto"
      >
        <TopicCard topic={topic ?? '...'} />
        {number !== null && <NumberCard number={number} />}

        <Flex direction="column" align="center" gap="16px" w="full" maxW="sm" mt="16px">
          <Text
            fontSize="16px"
            lineHeight="1.5"
            color={colors.onSurfaceVariant}
            textAlign="center"
            px={4}
          >
            1〜100のスケールの中で、自分の数字がどの位置か話し合いましょう。
          </Text>
          <Box
            as="button"
            w="full"
            display="flex"
            alignItems="center"
            justifyContent="center"
            gap={2}
            bg={isReady ? colors.outlineVariant : colors.primary}
            color={colors.onPrimary}
            fontSize="24px"
            fontWeight="700"
            borderRadius="full"
            py={4}
            border="none"
            cursor={isReady ? 'not-allowed' : 'pointer'}
            opacity={isReady ? 0.6 : 1}
            boxShadow="md"
            transition="all 0.2s"
            _hover={isReady ? {} : { opacity: 0.9 }}
            _active={isReady ? {} : { transform: 'scale(0.98)' }}
            onClick={isReady ? undefined : handleReady}
          >
            <Icon name={isReady ? 'hourglass_top' : 'visibility'} filled />
            {isReady ? '他のプレイヤーを待っています...' : '結果を見る'}
          </Box>
        </Flex>
      </Flex>
    </Box>
  )
}

// ── Sub-components ────────────────────────────────────────────

const TopicCard = ({ topic }: { topic: string }) => (
  <Box w="full" maxW="lg">
    <Box
      bg={colors.surfaceContainer}
      borderRadius="2xl"
      px={6}
      py={6}
      textAlign="center"
      border="1px solid"
      borderColor={`${colors.outlineVariant}4d`}
    >
      <Text
        fontSize="12px"
        fontWeight="600"
        letterSpacing="0.05em"
        color={colors.onSurfaceVariant}
        textTransform="uppercase"
        mb={2}
      >
        現在のお題
      </Text>
      <Text fontSize={{ base: '28px', md: '32px' }} fontWeight="700" color={colors.primary} py={2}>
        {topic}
      </Text>
    </Box>
  </Box>
)

const NumberCard = ({ number }: { number: number }) => (
  <Box
    position="relative"
    w="full"
    maxW="320px"
    h="448px"
    bg={colors.surfaceContainerLowest}
    borderRadius="24px"
    overflow="hidden"
    boxShadow="0 8px 30px rgba(0,0,0,0.04)"
    border="1px solid"
    borderColor={`${colors.outlineVariant}33`}
    transition="transform 0.3s"
    _hover={{ transform: 'translateY(-4px)' }}
  >
    <Text
      position="absolute"
      top={6}
      left={6}
      fontSize="24px"
      fontWeight="700"
      color={`${colors.outline}66`}
    >
      {number}
    </Text>
    <Text
      position="absolute"
      bottom={6}
      right={6}
      fontSize="24px"
      fontWeight="700"
      color={`${colors.outline}66`}
      transform="rotate(180deg)"
    >
      {number}
    </Text>

    <Flex h="full" direction="column" align="center" justify="center" gap={4}>
      <Box
        fontSize="12px"
        fontWeight="600"
        letterSpacing="0.05em"
        color={colors.secondary}
        bg={colors.surfaceContainerLowest}
        px={4}
        py={1}
        borderRadius="full"
        border="1px solid"
        borderColor={`${colors.secondary}33`}
        boxShadow="sm"
        textTransform="uppercase"
      >
        あなたの数字
      </Box>
      <Text
        fontSize="140px"
        fontWeight="900"
        lineHeight={1}
        color={colors.primary}
        letterSpacing="-0.02em"
      >
        {number}
      </Text>
    </Flex>
  </Box>
)

export default GamePage
