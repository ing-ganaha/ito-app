import type { SlotCard } from "@/features/game/pages/GamePage/types";

import { Box, Button, Flex, Heading, Text } from "@chakra-ui/react";

type Props = {
  allPlaced: boolean;
  allRevealed: boolean;
  flipDuration: number;
  isRevealPhase: boolean;
  myPlacedSlot: number | null;
  onNextRound: () => void;
  onRevealSlot: (i: number) => void;
  onSlotClick: (i: number) => void;
  onStartReveal: () => void;
  placedCount: number;
  revealedSlots: Set<number>;
  slots: (SlotCard | null)[];
  topic: string;
  totalPlayers: number;
};

export function GameBoard({
  allPlaced,
  allRevealed,
  flipDuration,
  isRevealPhase,
  myPlacedSlot,
  onNextRound,
  onRevealSlot,
  onSlotClick,
  onStartReveal,
  placedCount,
  revealedSlots,
  slots,
  topic,
  totalPlayers,
}: Props) {
  return (
    <Box
      alignItems="center"
      bg="rgba(255,255,255,0.02)"
      border="1px solid"
      borderColor="rgba(255,255,255,0.06)"
      borderRadius="2xl"
      boxShadow="inset 0 0 60px rgba(0,0,0,0.3), 0 8px 40px rgba(0,0,0,0.5)"
      display="flex"
      flexDirection="column"
      gap={8}
      maxW="580px"
      p={{ base: 5, md: 10 }}
      w="full"
    >
      {/* Topic */}
      <Box textAlign="center">
        <Text
          color="gray.600"
          fontSize="9px"
          fontWeight="bold"
          letterSpacing="widest"
          mb={2}
          textTransform="uppercase"
        >
          お題
        </Text>
        <Heading color="white" letterSpacing="tight" size="2xl">
          {topic}
        </Heading>
      </Box>

      {/* Card slots */}
      <Box w="full">
        <Flex align="center" gap={3} justify="center">
          {/* 小 label */}
          <Flex align="center" direction="column" flexShrink={0} gap={1}>
            <Text color="gray.600" fontSize="lg">
              ←
            </Text>
            <Text color="gray.500" fontSize="xs" fontWeight="bold">
              小
            </Text>
          </Flex>

          {slots.map((card, i) => {
            const isRevealed = revealedSlots.has(i);
            const isClickableForReveal =
              isRevealPhase && card !== null && !isRevealed;
            const isEmptyAndCanPlace = card === null && myPlacedSlot === null;

            return (
              <Box
                key={i}
                className={isEmptyAndCanPlace ? "card-slot-empty" : undefined}
                cursor={
                  isEmptyAndCanPlace || isClickableForReveal
                    ? "pointer"
                    : "default"
                }
                onClick={() => {
                  if (isEmptyAndCanPlace) onSlotClick(i);
                  if (isClickableForReveal) onRevealSlot(i);
                }}
              >
                {card !== null ? (
                  <div className="flip-card">
                    <div
                      className={`flip-card-inner${isRevealed ? " revealed" : ""}`}
                      style={{ transition: `transform ${flipDuration}ms ease` }}
                    >
                      <div
                        className={`flip-card-face flip-card-back${isClickableForReveal ? " clickable" : ""}`}
                      >
                        <span className="flip-card-player">
                          {card.playerName}
                        </span>
                        {isClickableForReveal && (
                          <span className="flip-card-hint">タップ</span>
                        )}
                      </div>
                      <div className="flip-card-face flip-card-front">
                        <span className="flip-card-player">
                          {card.playerName}
                        </span>
                        <span className="flip-card-number">{card.number}</span>
                      </div>
                    </div>
                  </div>
                ) : (
                  <Box
                    alignItems="center"
                    bg={
                      isEmptyAndCanPlace
                        ? "rgba(59,130,246,0.05)"
                        : "rgba(255,255,255,0.015)"
                    }
                    border="2px dashed"
                    borderColor={
                      isEmptyAndCanPlace
                        ? "rgba(59,130,246,0.35)"
                        : "rgba(255,255,255,0.05)"
                    }
                    borderRadius="8px"
                    display="flex"
                    flexDirection="column"
                    h={{ base: "80px", md: "110px" }}
                    justifyContent="center"
                    transition="all 0.2s"
                    w={{ base: "56px", md: "80px" }}
                    _hover={
                      isEmptyAndCanPlace
                        ? {
                            bg: "rgba(59,130,246,0.1)",
                            borderColor: "rgba(59,130,246,0.6)",
                          }
                        : {}
                    }
                  >
                    {/* Visible only on hover via CSS class */}
                    <Box
                      alignItems="center"
                      className="slot-hint"
                      display="flex"
                      h="full"
                      justifyContent="center"
                    >
                      <Text
                        color="rgba(147,197,253,0.75)"
                        fontSize="xs"
                        lineHeight="1.5"
                        px={1}
                        textAlign="center"
                      >
                        ここに
                        <br />
                        置く
                      </Text>
                    </Box>
                  </Box>
                )}
              </Box>
            );
          })}

          {/* 大 label */}
          <Flex align="center" direction="column" flexShrink={0} gap={1}>
            <Text color="gray.600" fontSize="lg">
              →
            </Text>
            <Text color="gray.500" fontSize="xs" fontWeight="bold">
              大
            </Text>
          </Flex>
        </Flex>

        <Text color="gray.700" fontSize="xs" mt={3} textAlign="center">
          {allPlaced
            ? "全員カードを置きました"
            : `${placedCount} / ${totalPlayers} 人が置きました`}
        </Text>
      </Box>

      {/* Action buttons */}
      {allPlaced && !isRevealPhase && (
        <Button
          colorPalette="blue"
          maxW="200px"
          onClick={onStartReveal}
          size="md"
          w="full"
        >
          結果を見る
        </Button>
      )}
      {isRevealPhase && !allRevealed && (
        <Text color="gray.600" fontSize="xs" textAlign="center">
          カードをタップして数字を公開（{revealedSlots.size} / {totalPlayers}）
        </Text>
      )}
      {isRevealPhase && allRevealed && (
        <Button
          colorPalette="green"
          maxW="200px"
          onClick={onNextRound}
          size="md"
          w="full"
        >
          次のラウンドへ
        </Button>
      )}
    </Box>
  );
}
