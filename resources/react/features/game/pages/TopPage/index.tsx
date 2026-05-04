import {
  Box,
  Button,
  Dialog,
  Field,
  Flex,
  Input,
  Text,
} from "@chakra-ui/react";
import { useState } from "react";
import { useNavigate } from "react-router";

export function TopPage() {
  const navigate = useNavigate();
  const [nickname, setNickname] = useState("");
  const [roomCode, setRoomCode] = useState("");
  const [isJoinOpen, setIsJoinOpen] = useState(false);

  const isNicknameEmpty = nickname.trim() === "";

  const handleCreateRoom = () => {
    sessionStorage.setItem("nickname", nickname.trim());
    void navigate("/room/mock-room-1");
  };

  const handleJoinRoom = () => {
    if (roomCode.trim() === "") return;
    sessionStorage.setItem("nickname", nickname.trim());
    setIsJoinOpen(false);
    void navigate(`/room/${roomCode.trim()}`);
  };

  return (
    <Box
      alignItems="center"
      bg="#0d1117"
      color="white"
      display="flex"
      justifyContent="center"
      minH="100vh"
      overflow="hidden"
      position="relative"
    >
      {/* Ambient background glows */}
      <Box inset={0} overflow="hidden" pointerEvents="none" position="absolute">
        <Box
          bg="radial-gradient(circle, rgba(124,58,237,0.18) 0%, transparent 65%)"
          borderRadius="full"
          h="70vh"
          left="-20%"
          position="absolute"
          top="-25%"
          w="70vh"
        />
        <Box
          bg="radial-gradient(circle, rgba(37,99,235,0.14) 0%, transparent 65%)"
          borderRadius="full"
          bottom="-25%"
          h="60vh"
          position="absolute"
          right="-15%"
          w="60vh"
        />
      </Box>

      {/* Main content */}
      <Flex
        align="center"
        direction="column"
        gap={10}
        maxW="420px"
        position="relative"
        px={4}
        w="full"
      >
        {/* Title */}
        <Flex align="center" direction="column" gap={3}>
          <Text
            as="h1"
            lineHeight={1}
            style={{
              background: "linear-gradient(135deg, #93c5fd 0%, #c4b5fd 100%)",
              backgroundClip: "text",
              fontSize: "clamp(3.5rem, 15vw, 5.5rem)",
              fontWeight: 900,
              letterSpacing: "0.12em",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            ito
          </Text>
          <Text
            color="gray.500"
            fontSize="sm"
            letterSpacing="wide"
            textAlign="center"
          >
            数字でコミュニケーションするカードゲーム
          </Text>
        </Flex>

        {/* Glass card */}
        <Box
          backdropFilter="blur(16px)"
          bg="rgba(255,255,255,0.04)"
          border="1px solid"
          borderColor="rgba(255,255,255,0.08)"
          borderRadius="2xl"
          boxShadow="0 8px 40px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.06)"
          p={8}
          style={{ WebkitBackdropFilter: "blur(16px)" }}
          w="full"
        >
          <Flex direction="column" gap={6}>
            <Field.Root>
              <Field.Label
                color="gray.500"
                fontSize="xs"
                fontWeight="bold"
                letterSpacing="widest"
                textTransform="uppercase"
              >
                ニックネーム
              </Field.Label>
              <Input
                _focus={{
                  bg: "rgba(255,255,255,0.07)",
                  borderColor: "rgba(124,58,237,0.6)",
                  boxShadow: "0 0 0 1px rgba(124,58,237,0.4)",
                }}
                _placeholder={{ color: "gray.600" }}
                autoFocus
                bg="rgba(255,255,255,0.05)"
                border="1px solid"
                borderColor="rgba(255,255,255,0.1)"
                color="white"
                onChange={(e) => setNickname(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !isNicknameEmpty) handleCreateRoom();
                }}
                placeholder="あなたの名前を入力"
                size="lg"
                value={nickname}
              />
            </Field.Root>

            <Flex direction="column" gap={3}>
              <Button
                _disabled={{
                  cursor: "not-allowed",
                  opacity: 0.35,
                }}
                _hover={
                  isNicknameEmpty
                    ? {}
                    : {
                        boxShadow: "0 4px 20px rgba(124,58,237,0.45)",
                        transform: "translateY(-1px)",
                      }
                }
                _active={{ transform: "translateY(0)" }}
                border="none"
                color="white"
                disabled={isNicknameEmpty}
                fontWeight="bold"
                h="48px"
                onClick={handleCreateRoom}
                style={{
                  background: isNicknameEmpty
                    ? "rgba(255,255,255,0.08)"
                    : "linear-gradient(135deg, #7c3aed 0%, #4f46e5 100%)",
                }}
                transition="all 0.2s ease"
                w="full"
              >
                ルームを作成する
              </Button>

              <Button
                _disabled={{
                  cursor: "not-allowed",
                  opacity: 0.35,
                }}
                _hover={isNicknameEmpty ? {} : { bg: "rgba(255,255,255,0.06)" }}
                border="1px solid"
                borderColor="rgba(255,255,255,0.15)"
                color="gray.300"
                disabled={isNicknameEmpty}
                fontWeight="medium"
                h="48px"
                onClick={() => setIsJoinOpen(true)}
                transition="all 0.2s ease"
                variant="outline"
                w="full"
              >
                ルームに参加する
              </Button>
            </Flex>
          </Flex>
        </Box>
      </Flex>

      {/* Join room dialog */}
      <Dialog.Root
        open={isJoinOpen}
        onOpenChange={(e) => setIsJoinOpen(e.open)}
      >
        <Dialog.Backdrop />
        <Dialog.Positioner>
          <Dialog.Content>
            <Dialog.Header>
              <Dialog.Title>ルームに参加する</Dialog.Title>
            </Dialog.Header>
            <Dialog.Body>
              <Field.Root>
                <Field.Label>ルームコード</Field.Label>
                <Input
                  onChange={(e) => setRoomCode(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") handleJoinRoom();
                  }}
                  placeholder="ルームコードを入力"
                  value={roomCode}
                />
              </Field.Root>
            </Dialog.Body>
            <Dialog.Footer gap={2}>
              <Button variant="outline" onClick={() => setIsJoinOpen(false)}>
                キャンセル
              </Button>
              <Button
                colorPalette="blue"
                disabled={roomCode.trim() === ""}
                onClick={handleJoinRoom}
              >
                参加する
              </Button>
            </Dialog.Footer>
            <Dialog.CloseTrigger />
          </Dialog.Content>
        </Dialog.Positioner>
      </Dialog.Root>
    </Box>
  );
}
