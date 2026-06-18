import React, { useState } from 'react'
import { useParams } from 'react-router'
import { Box, Flex, Grid, GridItem, Text } from '@chakra-ui/react'
import TopBar from '../../components/TopBar'
import Icon from '../../components/Icon'
import LeaveButton from '../../components/LeaveButton'
import { colors } from '../../libs/theme/colors'
import { useLobby, type Player } from './hooks/useLobby'

const formatCode = (code: string) => `${code.slice(0, 3)} ${code.slice(3)}`

const LobbyPage = () => {
  const { code } = useParams<{ code: string }>()
  const { players, currentPlayer, readyCount, allReady, statusText, handleAction } = useLobby(code)

  const actionIcon = currentPlayer?.isReady ? 'rocket_launch' : 'check_circle'
  const actionLabel = currentPlayer?.isReady ? 'ゲームを開始する' : '準備OK'
  const actionBg = currentPlayer?.isReady ? colors.primary : colors.secondary
  const actionDisabled =
    !currentPlayer || (currentPlayer.isReady && (!currentPlayer.isHost || !allReady))

  return (
    <Box minH="100vh" display="flex" flexDir="column">
      <TopBar />

      <Box
        as="main"
        flex={1}
        w="full"
        maxW="1280px"
        mx="auto"
        px={{ base: '16px', md: '48px' }}
        py="32px"
        display="flex"
        flexDir="column"
        gap="24px"
      >
        <Box>
          <Text
            fontSize={{ base: '28px', md: '32px' }}
            fontWeight="700"
            color={colors.primary}
            lineHeight="1.2"
            mb={1}
          >
            待機室
          </Text>
          <Text fontSize="16px" color={colors.onSurfaceVariant}>
            {statusText}
          </Text>
        </Box>

        <Grid templateColumns={{ base: '1fr', md: 'repeat(12, 1fr)' }} gap="24px">
          <GridItem colSpan={{ base: 1, md: 4 }}>
            <RoomCodeCard code={code ?? ''} />
          </GridItem>
          <GridItem colSpan={{ base: 1, md: 8 }}>
            <PlayerRoster players={players} readyCount={readyCount} />
          </GridItem>
        </Grid>

        <Box w="full" maxW="sm" mx="auto" pt="16px" pb="32px">
          <Box
            as="button"
            w="full"
            display="flex"
            alignItems="center"
            justifyContent="center"
            gap={2}
            bg={actionBg}
            color={colors.onPrimary}
            borderRadius="xl"
            py={4}
            fontSize="24px"
            fontWeight="700"
            border="none"
            cursor={actionDisabled ? 'not-allowed' : 'pointer'}
            opacity={actionDisabled ? 0.4 : 1}
            transition="opacity 0.2s"
            _hover={actionDisabled ? {} : { opacity: 0.9 }}
            onClick={actionDisabled ? undefined : handleAction}
          >
            <Icon name={actionIcon} filled />
            {actionLabel}
          </Box>

          <Flex justify="center" pt="16px">
            <LeaveButton code={code} />
          </Flex>
        </Box>
      </Box>
    </Box>
  )
}

// ── Sub-components ────────────────────────────────────────────

const RoomCodeCard = ({ code }: { code: string }) => {
  const [copied, setCopied] = useState(false)

  const handleCopy = () => {
    navigator.clipboard.writeText(code)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <Flex
      direction="column"
      align="center"
      justify="center"
      textAlign="center"
      bg={colors.tertiaryFixed}
      borderRadius="xl"
      p="32px"
      minH="250px"
      gap={4}
    >
      <Text
        fontSize="12px"
        fontWeight="600"
        letterSpacing="0.05em"
        color={colors.onSurfaceVariant}
        textTransform="uppercase"
      >
        ルームコード
      </Text>
      <Text
        fontSize="48px"
        fontWeight="800"
        letterSpacing="0.15em"
        color={colors.primary}
        userSelect="none"
      >
        {formatCode(code)}
      </Text>
      <Box
        as="button"
        display="flex"
        alignItems="center"
        gap={2}
        bg={copied ? colors.secondaryContainer : colors.surfaceContainerLowest}
        border="1px solid"
        borderColor={copied ? colors.secondary : colors.outlineVariant}
        borderRadius="full"
        px={6}
        py={2}
        fontSize="14px"
        fontWeight="700"
        color={copied ? colors.secondary : colors.primary}
        cursor="pointer"
        transition="all 0.2s"
        _hover={{ bg: copied ? colors.secondaryContainer : colors.surfaceVariant }}
        onClick={handleCopy}
      >
        <Icon name={copied ? 'check' : 'content_copy'} size={18} />
        {copied ? 'コピーしました！' : 'コードをコピー'}
      </Box>
    </Flex>
  )
}

const PlayerRoster = ({ players, readyCount }: { players: Player[]; readyCount: number }) => (
  <Flex
    direction="column"
    bg={colors.surfaceContainerLowest}
    border="1px solid"
    borderColor={colors.outlineVariant}
    borderRadius="xl"
    minH="400px"
  >
    <Flex
      px="32px"
      py="16px"
      borderBottom="1px solid"
      borderColor={colors.outlineVariant}
      justify="space-between"
      align="center"
      bg={colors.surfaceContainerLow}
      borderTopRadius="xl"
    >
      <Text fontSize="14px" fontWeight="700" color={colors.onSurfaceVariant} letterSpacing="0.02em">
        参加者
      </Text>
      <Box
        bg={colors.primary}
        color={colors.onPrimary}
        px={3}
        py={1}
        borderRadius="full"
        fontSize="14px"
        fontWeight="700"
      >
        {readyCount} / {players.length} 準備完了
      </Box>
    </Flex>

    <Grid templateColumns={{ base: '1fr', sm: 'repeat(2, 1fr)' }} gap="16px" p="32px">
      {players.map((player) => (
        <PlayerCard key={player.id} player={player} />
      ))}
    </Grid>
  </Flex>
)

const PlayerCard = ({ player }: { player: Player }) => (
  <Flex
    align="center"
    gap="16px"
    p="8px"
    border="1px solid"
    borderColor={player.isCurrentUser ? colors.outlineVariant : 'transparent'}
    borderRadius="lg"
    bg={colors.surface}
    position="relative"
    transition="border-color 0.2s"
    _hover={{ borderColor: colors.outlineVariant }}
  >
    {player.isHost && (
      <Box
        position="absolute"
        top="-12px"
        right="-12px"
        color={colors.secondary}
        bg={colors.surfaceContainerLowest}
        borderRadius="full"
        p={1}
        border="1px solid"
        borderColor={colors.outlineVariant}
        display="flex"
      >
        <Icon name="star" filled size={18} />
      </Box>
    )}

    <Flex
      w="48px"
      h="48px"
      borderRadius="full"
      bg={player.avatarBg}
      color={player.avatarColor}
      align="center"
      justify="center"
      fontSize="20px"
      fontWeight="700"
      flexShrink={0}
    >
      {player.initials}
    </Flex>

    <Box overflow="hidden">
      <Text
        fontSize="14px"
        fontWeight="700"
        color={colors.primary}
        overflow="hidden"
        textOverflow="ellipsis"
        whiteSpace="nowrap"
      >
        {player.name}
        {player.isCurrentUser && (
          <Box as="span" color={colors.onSurfaceVariant} fontWeight="400">
            {' '}
            (あなた)
          </Box>
        )}
      </Text>
      <Text
        fontSize="12px"
        fontWeight="600"
        color={player.isReady ? colors.secondary : colors.onSurfaceVariant}
      >
        {player.isReady ? '準備完了 ✓' : '待機中'}
      </Text>
    </Box>
  </Flex>
)

export default LobbyPage
