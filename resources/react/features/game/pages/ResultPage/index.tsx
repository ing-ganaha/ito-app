import { Badge, Box, Button, Flex, Text } from "@chakra-ui/react";
import { useNavigate, useParams } from "react-router";

import { mockMe, mockRoom, mockRound } from "@/features/game/mocks";

type PlayerResult = { id: number; name: string; number: number };

const mockResult = {
  analogies: { 1: "普通に走る感じ", 2: "新幹線", 3: "自転車" } as Record<
    number,
    string
  >,
  isSuccess: true,
  playerResults: [
    { id: 1, name: "Alice", number: 42 },
    { id: 2, name: "Bob", number: 67 },
    { id: 3, name: "Charlie", number: 23 },
  ],
};

function PlayerCard({
  analogy,
  isMe,
  isSuccess,
  player,
}: {
  analogy: string | undefined;
  isMe: boolean;
  isSuccess: boolean;
  player: PlayerResult;
}) {
  return (
    <Flex align="center" direction="column" gap={2}>
      {/* Analogy bubble — fixed min-height so cards without one still align */}
      <Box
        alignItems="center"
        display="flex"
        justifyContent="center"
        minH="34px"
        px={1}
        w="full"
      >
        {analogy && (
          <Box
            bg="rgba(255,255,255,0.07)"
            border="1px solid"
            borderColor="rgba(255,255,255,0.12)"
            borderRadius="lg"
            px={3}
            py={1}
          >
            <Text
              color="gray.200"
              fontSize="xs"
              fontWeight="medium"
              textAlign="center"
              whiteSpace="nowrap"
            >
              {analogy}
            </Text>
          </Box>
        )}
      </Box>

      {/* Number card */}
      <Box
        alignItems="center"
        bg="linear-gradient(160deg, #0f1e36, #162440)"
        border="2px solid"
        borderColor={
          isSuccess ? "rgba(74,222,128,0.22)" : "rgba(248,113,113,0.22)"
        }
        borderRadius="16px"
        boxShadow={
          isSuccess
            ? "0 12px 40px rgba(0,0,0,0.55), 0 0 24px rgba(74,222,128,0.08)"
            : "0 12px 40px rgba(0,0,0,0.55), 0 0 24px rgba(248,113,113,0.08)"
        }
        display="flex"
        flexDirection="column"
        h={{ base: "128px", md: "168px" }}
        justifyContent="space-between"
        p={{ base: 3, md: 4 }}
        w={{ base: "84px", md: "116px" }}
      >
        {/* Player name top */}
        <Text
          color="gray.500"
          fontSize="xs"
          fontWeight="semibold"
          overflow="hidden"
          textAlign="center"
          textOverflow="ellipsis"
          whiteSpace="nowrap"
        >
          {player.name}
        </Text>

        {/* Number center */}
        <Text
          color={isSuccess ? "green.300" : "blue.300"}
          fontSize={{ base: "3xl", md: "5xl" }}
          fontWeight="black"
          lineHeight={1}
          textAlign="center"
        >
          {player.number}
        </Text>

        {/* Bottom — "あなた" badge or spacer */}
        {isMe ? (
          <Badge colorPalette="blue" fontSize="9px" mx="auto" px={2} py={0.5}>
            あなた
          </Badge>
        ) : (
          <Box h="18px" />
        )}
      </Box>
    </Flex>
  );
}

export function ResultPage() {
  const { roomId } = useParams<{ roomId: string }>();
  const navigate = useNavigate();

  const { isSuccess, playerResults } = mockResult;
  const sortedPlayers = [...playerResults].sort((a, b) => a.number - b.number);
  const hasNextRound = mockRound.roundNumber < mockRoom.totalRounds;

  const glowColor = isSuccess ? "rgba(34,197,94,0.14)" : "rgba(239,68,68,0.14)";

  return (
    <Box
      alignItems="center"
      bg="#0d1117"
      color="white"
      display="flex"
      flexDirection="column"
      justifyContent="center"
      minH="100vh"
      overflow="hidden"
      position="relative"
    >
      {/* Ambient top glow */}
      <Box inset={0} overflow="hidden" pointerEvents="none" position="absolute">
        <Box
          bg={`radial-gradient(circle, ${glowColor} 0%, transparent 60%)`}
          borderRadius="full"
          h="80vh"
          left="50%"
          position="absolute"
          style={{ transform: "translateX(-50%)" }}
          top="-35%"
          w="80vh"
        />
      </Box>

      <Flex
        align="center"
        direction="column"
        gap={14}
        maxW="840px"
        position="relative"
        px={4}
        w="full"
      >
        {/* ── Result header ── */}
        <Flex align="center" direction="column" gap={4} textAlign="center">
          <Text
            lineHeight={1}
            style={{
              background: isSuccess
                ? "linear-gradient(135deg, #4ade80 0%, #22c55e 100%)"
                : "linear-gradient(135deg, #f87171 0%, #ef4444 100%)",
              backgroundClip: "text",
              fontSize: "clamp(2.5rem, 10vw, 4.5rem)",
              fontWeight: 900,
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            {isSuccess ? "成功！" : "失敗..."}
          </Text>

          <Text
            color="gray.500"
            fontSize="sm"
            letterSpacing="widest"
            textTransform="uppercase"
          >
            ラウンド {mockRound.roundNumber} 終了
          </Text>

          <Flex align="center" gap={1}>
            {Array.from({ length: mockRoom.lives }).map((_, i) => (
              <Text
                key={i}
                color={i < mockRoom.remainingLives ? "red.400" : "gray.800"}
                fontSize="xl"
              >
                ❤
              </Text>
            ))}
          </Flex>
        </Flex>

        {/* ── Card spread ── */}
        <Flex align="center" gap={3} justify="center" wrap="wrap">
          {/* 小 label */}
          <Flex align="center" direction="column" flexShrink={0} gap={1}>
            <Text color="gray.700" fontSize="lg">
              ←
            </Text>
            <Text color="gray.600" fontSize="xs" fontWeight="bold">
              小
            </Text>
          </Flex>

          {sortedPlayers.map((player, index) => (
            <Flex key={player.id} align="center" gap={3}>
              <PlayerCard
                analogy={mockResult.analogies[player.id]}
                isMe={player.id === mockMe.id}
                isSuccess={isSuccess}
                player={player}
              />
              {index < sortedPlayers.length - 1 && (
                <Text
                  color={
                    isSuccess ? "rgba(74,222,128,0.4)" : "rgba(248,113,113,0.3)"
                  }
                  fontSize="2xl"
                  fontWeight="light"
                >
                  {"›"}
                </Text>
              )}
            </Flex>
          ))}

          {/* 大 label */}
          <Flex align="center" direction="column" flexShrink={0} gap={1}>
            <Text color="gray.700" fontSize="lg">
              →
            </Text>
            <Text color="gray.600" fontSize="xs" fontWeight="bold">
              大
            </Text>
          </Flex>
        </Flex>

        {/* ── Action buttons ── */}
        <Flex gap={3} justify="center" maxW="420px" w="full">
          {hasNextRound && (
            <Button
              colorPalette="blue"
              flex={1}
              onClick={() => void navigate(`/room/${roomId}/game`)}
              size="lg"
            >
              次のラウンドへ
            </Button>
          )}
          <Button
            _hover={{ bg: "rgba(255,255,255,0.05)" }}
            border="1px solid"
            borderColor="rgba(255,255,255,0.12)"
            color="gray.400"
            flex={hasNextRound ? undefined : 1}
            maxW={hasNextRound ? "160px" : undefined}
            onClick={() => void navigate("/")}
            size="lg"
            variant="outline"
          >
            解散する
          </Button>
        </Flex>
      </Flex>
    </Box>
  );
}
