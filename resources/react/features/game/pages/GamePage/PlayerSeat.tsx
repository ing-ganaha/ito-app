import type { Analogy, Player } from "@/features/game/types";

import { Box, Flex, Text } from "@chakra-ui/react";

type Props = {
  analogy: Analogy | undefined;
  hasPlaced: boolean;
  player: Player;
};

export function PlayerSeat({ analogy, hasPlaced, player }: Props) {
  return (
    <Flex align="center" direction="column" gap={2} minW="96px">
      {/* Analogy speech bubble */}
      <Box
        bg="rgba(255,255,255,0.06)"
        border="1px solid"
        borderColor="rgba(255,255,255,0.1)"
        borderRadius="xl"
        maxW="160px"
        minH="38px"
        minW="80px"
        px={3}
        py={2}
      >
        {analogy ? (
          <Text
            color="gray.100"
            fontSize="sm"
            fontWeight="medium"
            textAlign="center"
          >
            {analogy.text}
          </Text>
        ) : (
          <Text color="gray.600" fontSize="xs" textAlign="center">
            考え中...
          </Text>
        )}
      </Box>

      {/* Hand card — shows face-down card before placing, empty after */}
      <Box
        alignItems="center"
        bg={
          hasPlaced
            ? "rgba(255,255,255,0.03)"
            : "linear-gradient(150deg, #1e3a8a, #1d4ed8)"
        }
        border="2px solid"
        borderColor={
          hasPlaced ? "rgba(255,255,255,0.07)" : "rgba(59,130,246,0.4)"
        }
        borderRadius="8px"
        borderStyle={hasPlaced ? "dashed" : "solid"}
        boxShadow={hasPlaced ? "none" : "0 0 10px rgba(37,99,235,0.2)"}
        display="flex"
        h="52px"
        justifyContent="center"
        transition="all 0.4s ease"
        w="38px"
      >
        <Text color={hasPlaced ? "gray.700" : "blue.300"} fontSize="md">
          {hasPlaced ? "✓" : "?"}
        </Text>
      </Box>

      {/* Name */}
      <Text
        color="gray.500"
        fontSize="xs"
        fontWeight="semibold"
        letterSpacing="wide"
      >
        {player.name}
      </Text>
    </Flex>
  );
}
