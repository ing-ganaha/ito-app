import React from 'react'
import { Box } from '@chakra-ui/react'
import Icon from './Icon'
import { colors } from '../libs/theme/colors'
import { useLeaveRoom } from '../libs/useLeaveRoom'

/**
 * ルームから退室する共通ボタン（ロビー・ゲーム画面で使用）。
 */
const LeaveButton = ({
  code,
  label = '退室する',
}: {
  code: string | undefined
  label?: string
}) => {
  const { leave, isLeaving } = useLeaveRoom(code)

  return (
    <Box
      as="button"
      display="inline-flex"
      alignItems="center"
      gap={1}
      bg="transparent"
      color={colors.onSurfaceVariant}
      fontSize="14px"
      fontWeight="600"
      border="none"
      cursor={isLeaving ? 'not-allowed' : 'pointer'}
      opacity={isLeaving ? 0.5 : 1}
      transition="color 0.2s"
      _hover={isLeaving ? {} : { color: colors.primary }}
      onClick={isLeaving ? undefined : leave}
    >
      <Icon name="logout" size={18} />
      {isLeaving ? '退室中...' : label}
    </Box>
  )
}

export default LeaveButton
