import React from 'react'
import { useState } from 'react'
import { useNavigate } from 'react-router'
import { useMutation } from '@tanstack/react-query'
import { Box, Flex, Input, Text, Dialog } from '@chakra-ui/react'
import TopBar from '../../components/TopBar'
import Icon from '../../components/Icon'
import { colors } from '../../libs/theme/colors'
import { routes } from '../../const/routes'
import { createRoom, joinRoom } from '../../libs/api/rooms'
import { saveSession } from '../../libs/playerSession'
import { ApiError } from '../../libs/apiClient'

const toUserMessage = (error: unknown, context: 'join' | 'create'): string => {
  if (error instanceof ApiError) {
    if (context === 'join' && error.status === 404) return '存在しないルームコードです'
    return error.message
  }
  return 'エラーが発生しました'
}

const HomePage = () => {
  const navigate = useNavigate()
  const [name, setName] = useState('')
  const [joinCode, setJoinCode] = useState('')
  const [isJoinOpen, setIsJoinOpen] = useState(false)

  const createMutation = useMutation({
    mutationFn: () => createRoom(name),
    onSuccess: (res) => {
      saveSession({
        roomCode: res.data.code,
        playerId: res.player.id,
        secretToken: res.player.secret_token,
      })
      navigate(routes.lobby(res.data.code))
    },
  })

  const joinMutation = useMutation({
    mutationFn: () => joinRoom(joinCode, name),
    onSuccess: (res) => {
      saveSession({
        roomCode: res.data.code,
        playerId: res.player.id,
        secretToken: res.player.secret_token,
      })
      navigate(routes.lobby(res.data.code))
      setIsJoinOpen(false)
    },
  })

  const handleCreateRoom = () => {
    if (!name.trim()) return
    createMutation.mutate()
  }

  const handleJoinRoom = () => {
    if (!name.trim() || joinCode.length !== 6) return
    joinMutation.mutate()
  }

  const handleJoinCodeChange = (v: string) => {
    setJoinCode(v)
    if (joinMutation.isError) joinMutation.reset()
  }

  const createError = createMutation.error ? toUserMessage(createMutation.error, 'create') : null
  const joinError = joinMutation.error ? toUserMessage(joinMutation.error, 'join') : null

  return (
    <Box minH="100vh" display="flex" flexDir="column">
      <TopBar />

      <Flex
        as="main"
        flex={1}
        justify="center"
        px={{ base: '16px', md: '48px' }}
        py={{ base: '32px', md: '80px' }}
      >
        <Box w="full" maxW="500px">
          <Box
            bg={colors.surfaceContainerLow}
            p={{ base: 6, md: 8 }}
            borderRadius="xl"
            border="1px solid"
            borderColor={colors.outlineVariant}
          >
            <Box mb={6}>
              <Text
                fontSize="14px"
                fontWeight="700"
                letterSpacing="0.02em"
                color={colors.primary}
                mb={2}
              >
                ニックネーム
              </Text>
              <Input
                placeholder="名前を入力"
                value={name}
                onChange={(e) => setName(e.target.value)}
                bg={colors.surfaceContainerLowest}
                borderColor={colors.outlineVariant}
                color={colors.primary}
                borderRadius="lg"
                px={4}
                py={3}
                fontSize="16px"
                _focus={{ outline: 'none', borderColor: colors.primary }}
                _placeholder={{ color: colors.outline }}
              />
            </Box>

            <Flex direction="column" gap={1}>
              <ActionButton
                bg={colors.primary}
                color={colors.onPrimary}
                onClick={handleCreateRoom}
                disabled={!name.trim() || createMutation.isPending}
              >
                ルームを作る
              </ActionButton>
              {createError && (
                <Text fontSize="13px" color="red.500" textAlign="center" pt={1}>
                  {createError}
                </Text>
              )}

              <Flex align="center" py={4} gap={4}>
                <Box flex={1} h="1px" bg={colors.outlineVariant} />
                <Text
                  fontSize="12px"
                  fontWeight="600"
                  letterSpacing="0.05em"
                  color={colors.onSurfaceVariant}
                >
                  または
                </Text>
                <Box flex={1} h="1px" bg={colors.outlineVariant} />
              </Flex>

              <ActionButton
                bg={colors.secondary}
                color={colors.onSecondary}
                onClick={() => setIsJoinOpen(true)}
                disabled={!name.trim()}
              >
                ルームに入る
              </ActionButton>
            </Flex>
          </Box>
        </Box>
      </Flex>

      <JoinModal
        isOpen={isJoinOpen}
        joinCode={joinCode}
        onClose={() => {
          setIsJoinOpen(false)
          joinMutation.reset()
        }}
        onJoinCodeChange={handleJoinCodeChange}
        onJoin={handleJoinRoom}
        errorMessage={joinError}
        isPending={joinMutation.isPending}
      />
    </Box>
  )
}

// ── Sub-components ────────────────────────────────────────────

interface ActionButtonProps {
  children: React.ReactNode
  bg: string
  color: string
  onClick: () => void
  disabled?: boolean
}

const ActionButton = ({ children, bg, color, onClick, disabled }: ActionButtonProps) => (
  <Box
    as="button"
    w="full"
    display="flex"
    alignItems="center"
    justifyContent="center"
    gap={2}
    bg={disabled ? colors.outlineVariant : bg}
    color={color}
    borderRadius="lg"
    py={4}
    px={4}
    fontSize="14px"
    fontWeight="700"
    letterSpacing="0.02em"
    border="none"
    cursor={disabled ? 'not-allowed' : 'pointer'}
    opacity={disabled ? 0.5 : 1}
    transition="opacity 0.2s"
    _hover={disabled ? {} : { opacity: 0.9 }}
    onClick={disabled ? undefined : onClick}
  >
    {children}
  </Box>
)

interface JoinModalProps {
  isOpen: boolean
  joinCode: string
  onClose: () => void
  onJoinCodeChange: (v: string) => void
  onJoin: () => void
  errorMessage: string | null
  isPending: boolean
}

const JoinModal = ({
  isOpen,
  joinCode,
  onClose,
  onJoinCodeChange,
  onJoin,
  errorMessage,
  isPending,
}: JoinModalProps) => (
  <Dialog.Root
    open={isOpen}
    onOpenChange={(e) => (e.open ? undefined : onClose())}
    placement="center"
  >
    <Dialog.Backdrop bg="rgba(0, 7, 3, 0.4)" backdropFilter="blur(4px)" />
    <Dialog.Positioner px="16px">
      <Dialog.Content
        bg={colors.surface}
        borderRadius="xl"
        overflow="hidden"
        w="full"
        maxW="400px"
        shadow="lg"
      >
        <Dialog.Header
          px={6}
          py={4}
          borderBottom="1px solid"
          borderColor={colors.outlineVariant}
          display="flex"
          justifyContent="space-between"
          alignItems="center"
        >
          <Dialog.Title fontSize="24px" fontWeight="700" color={colors.primary}>
            ルームに参加する
          </Dialog.Title>
          <Dialog.CloseTrigger asChild>
            <Box
              as="button"
              border="none"
              bg="transparent"
              cursor="pointer"
              color={colors.onSurfaceVariant}
              display="flex"
              _hover={{ color: colors.primary }}
              transition="color 0.2s"
            >
              <Icon name="close" />
            </Box>
          </Dialog.CloseTrigger>
        </Dialog.Header>

        <Dialog.Body p={6} display="flex" flexDir="column" gap={4}>
          <Text fontSize="16px" lineHeight="1.5" color={colors.onSurfaceVariant}>
            招待された6桁のコードを入力してください。
          </Text>
          <Input
            placeholder="------"
            maxLength={6}
            value={joinCode}
            onChange={(e) => onJoinCodeChange(e.target.value.toUpperCase())}
            textAlign="center"
            fontSize="32px"
            fontWeight="700"
            letterSpacing="0.25em"
            bg={colors.surfaceContainerLowest}
            borderColor={errorMessage ? 'red.400' : colors.outlineVariant}
            color={colors.primary}
            borderRadius="lg"
            py={4}
            _focus={{ outline: 'none', borderColor: errorMessage ? 'red.400' : colors.primary }}
            _placeholder={{ color: colors.outlineVariant, letterSpacing: '0.25em' }}
          />
          {errorMessage && (
            <Text fontSize="13px" color="red.500" textAlign="center" mt={-2}>
              {errorMessage}
            </Text>
          )}
        </Dialog.Body>

        <Dialog.Footer
          px={6}
          py={4}
          bg={colors.surfaceContainerLow}
          borderTop="1px solid"
          borderColor={colors.outlineVariant}
          display="flex"
          justifyContent="flex-end"
          gap={3}
        >
          <Box
            as="button"
            px={4}
            py={2}
            borderRadius="lg"
            fontSize="14px"
            fontWeight="700"
            color={colors.primary}
            bg="transparent"
            border="none"
            cursor="pointer"
            transition="background 0.2s"
            _hover={{ bg: colors.surfaceVariant }}
            onClick={onClose}
          >
            キャンセル
          </Box>
          <ActionButton
            bg={colors.secondary}
            color={colors.onSecondary}
            onClick={onJoin}
            disabled={joinCode.length !== 6 || isPending}
          >
            参加する
          </ActionButton>
        </Dialog.Footer>
      </Dialog.Content>
    </Dialog.Positioner>
  </Dialog.Root>
)

export default HomePage
