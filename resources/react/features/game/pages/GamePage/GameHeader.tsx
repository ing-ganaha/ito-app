import { Flex, Text } from "@chakra-ui/react";

type Props = {
  lives: number;
  remainingLives: number;
  roundNumber: number;
  totalRounds: number;
};

export function GameHeader({
  lives,
  remainingLives,
  roundNumber,
  totalRounds,
}: Props) {
  return (
    <Flex
      align="center"
      as="header"
      bg="rgba(0,0,0,0.6)"
      borderBottom="1px solid"
      borderColor="rgba(255,255,255,0.06)"
      flexShrink={0}
      h="52px"
      justify="space-between"
      px={6}
    >
      <Text
        color="gray.500"
        fontSize="xs"
        fontWeight="bold"
        letterSpacing="widest"
        textTransform="uppercase"
      >
        Round {roundNumber} / {totalRounds}
      </Text>
      <Flex align="center" gap={1}>
        {Array.from({ length: lives }).map((_, i) => (
          <Text
            key={i}
            color={i < remainingLives ? "red.400" : "gray.800"}
            fontSize="xl"
          >
            ❤
          </Text>
        ))}
      </Flex>
    </Flex>
  );
}
