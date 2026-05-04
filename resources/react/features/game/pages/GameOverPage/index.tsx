import { Box, Button, Container, Heading, Stack, Text } from "@chakra-ui/react";
import { useNavigate, useParams } from "react-router";

import { mockRound } from "@/features/game/mocks";

export function GameOverPage() {
  const { roomId } = useParams<{ roomId: string }>();
  const navigate = useNavigate();

  const handlePlayAgain = () => {
    void navigate(`/room/${roomId}`);
  };

  const handleDisband = () => {
    void navigate("/");
  };

  return (
    <Container maxW="md" py={16}>
      <Stack gap={8} align="center">
        <Box textAlign="center">
          <Heading size="4xl" color="red.500" mb={4}>
            ゲームオーバー
          </Heading>
          <Text color="fg.muted" fontSize="lg">
            ラウンド {mockRound.roundNumber} で終了しました
          </Text>
        </Box>

        <Stack w="full" gap={3}>
          <Button colorPalette="blue" size="lg" onClick={handlePlayAgain}>
            もう一度遊ぶ
          </Button>
          <Button variant="outline" size="lg" onClick={handleDisband}>
            解散する
          </Button>
        </Stack>
      </Stack>
    </Container>
  );
}
