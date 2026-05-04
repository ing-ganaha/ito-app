import type { GameSettings } from "@/features/game/types";

import {
  Avatar,
  Badge,
  Box,
  Button,
  Dialog,
  Field,
  Flex,
  Input,
  NativeSelect,
  Text,
} from "@chakra-ui/react";
import { useState } from "react";
import { useNavigate, useParams } from "react-router";

import { mockPlayers, mockRoom } from "@/features/game/mocks";

export function LobbyPage() {
  const { roomId } = useParams<{ roomId: string }>();
  const navigate = useNavigate();
  const [copied, setCopied] = useState(false);

  const [joiningName, setJoiningName] = useState("");
  const [showJoinDialog, setShowJoinDialog] = useState(
    !sessionStorage.getItem("nickname")
  );

  const handleConfirmJoin = () => {
    if (joiningName.trim() === "") return;
    sessionStorage.setItem("nickname", joiningName.trim());
    setShowJoinDialog(false);
  };

  const [settings, setSettings] = useState<GameSettings>({
    difficulty: mockRoom.difficulty,
    lives: mockRoom.lives,
    numberMax: mockRoom.numberMax,
    numberMin: mockRoom.numberMin,
    totalRounds: mockRoom.totalRounds,
  });

  const inviteUrl = window.location.href;

  const handleCopy = () => {
    void navigator.clipboard.writeText(inviteUrl).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <Box
      bg="#0d1117"
      color="white"
      display="flex"
      flexDirection="column"
      minH="100vh"
      overflow="hidden"
    >
      {/* ── Header ── */}
      <Flex
        align="center"
        as="header"
        bg="rgba(0,0,0,0.5)"
        borderBottom="1px solid rgba(255,255,255,0.06)"
        flexShrink={0}
        gap={3}
        h="52px"
        px={6}
      >
        <Text fontSize="lg" fontWeight="bold">
          ロビー
        </Text>
        <Text color="gray.700" fontSize="sm">
          |
        </Text>
        <Text color="gray.500" fontSize="sm">
          ルームID: {roomId}
        </Text>
      </Flex>

      {/* ── 2-column main area ── */}
      <Box
        display="grid"
        flex={1}
        gap={4}
        gridTemplateColumns={{ base: "1fr", md: "1fr 1fr" }}
        minH={0}
        overflow={{ base: "auto", md: "hidden" }}
        p={5}
      >
        {/* Left column: invite + players */}
        <Flex direction="column" gap={4} overflow="auto">
          {/* Invite URL card */}
          <Box
            bg="rgba(255,255,255,0.03)"
            border="1px solid"
            borderColor="rgba(255,255,255,0.07)"
            borderRadius="xl"
            p={5}
          >
            <Text
              color="gray.500"
              fontSize="xs"
              fontWeight="bold"
              letterSpacing="widest"
              mb={3}
              textTransform="uppercase"
            >
              招待URL
            </Text>
            <Flex gap={2}>
              <Input
                _focus={{
                  borderColor: "rgba(59,130,246,0.6)",
                  boxShadow: "0 0 0 1px rgba(59,130,246,0.4)",
                }}
                bg="rgba(255,255,255,0.04)"
                border="1px solid"
                borderColor="rgba(255,255,255,0.08)"
                color="gray.300"
                fontSize="xs"
                readOnly
                value={inviteUrl}
              />
              <Button
                colorPalette={copied ? "green" : "gray"}
                flexShrink={0}
                onClick={handleCopy}
                size="sm"
                variant={copied ? "solid" : "outline"}
              >
                {copied ? "コピー済み" : "コピー"}
              </Button>
            </Flex>
          </Box>

          {/* Player list card */}
          <Box
            bg="rgba(255,255,255,0.03)"
            border="1px solid"
            borderColor="rgba(255,255,255,0.07)"
            borderRadius="xl"
            flex={1}
            overflow="auto"
            p={5}
          >
            <Text
              color="gray.500"
              fontSize="xs"
              fontWeight="bold"
              letterSpacing="widest"
              mb={3}
              textTransform="uppercase"
            >
              参加者 ({mockPlayers.length}人)
            </Text>
            <Flex direction="column" gap={2}>
              {mockPlayers.map((player) => (
                <Flex
                  key={player.id}
                  align="center"
                  bg="rgba(255,255,255,0.03)"
                  borderRadius="lg"
                  gap={3}
                  px={3}
                  py={2}
                >
                  <Avatar.Root size="xs">
                    <Avatar.Fallback
                      bg="rgba(37,99,235,0.3)"
                      color="blue.200"
                      fontSize="xs"
                    >
                      {player.name.charAt(0).toUpperCase()}
                    </Avatar.Fallback>
                  </Avatar.Root>
                  <Text flex={1} fontSize="sm" fontWeight="medium">
                    {player.name}
                  </Text>
                  <Badge colorPalette="green" fontSize="9px" px={2}>
                    準備OK
                  </Badge>
                </Flex>
              ))}
            </Flex>
          </Box>
        </Flex>

        {/* Right column: settings + start button */}
        <Flex direction="column" gap={4} overflow="auto">
          {/* Settings card */}
          <Box
            bg="rgba(255,255,255,0.03)"
            border="1px solid"
            borderColor="rgba(255,255,255,0.07)"
            borderRadius="xl"
            flex={1}
            p={5}
          >
            <Text
              color="gray.500"
              fontSize="xs"
              fontWeight="bold"
              letterSpacing="widest"
              mb={4}
              textTransform="uppercase"
            >
              ゲーム設定
            </Text>

            <Flex direction="column" gap={4}>
              {/* Lives */}
              <Field.Root>
                <Field.Label
                  color="gray.400"
                  fontSize="xs"
                  fontWeight="semibold"
                >
                  ライフ数
                </Field.Label>
                <Input
                  _focus={{
                    borderColor: "rgba(59,130,246,0.6)",
                    boxShadow: "0 0 0 1px rgba(59,130,246,0.4)",
                  }}
                  _placeholder={{ color: "gray.600" }}
                  bg="rgba(255,255,255,0.05)"
                  border="1px solid"
                  borderColor="rgba(255,255,255,0.1)"
                  color="white"
                  max={10}
                  min={1}
                  onChange={(e) =>
                    setSettings((s) => ({
                      ...s,
                      lives: Number(e.target.value),
                    }))
                  }
                  type="number"
                  value={settings.lives}
                />
              </Field.Root>

              {/* Min / Max — horizontal pair */}
              <Flex gap={3}>
                <Field.Root flex={1}>
                  <Field.Label
                    color="gray.400"
                    fontSize="xs"
                    fontWeight="semibold"
                  >
                    数字の最小値
                  </Field.Label>
                  <Input
                    _focus={{
                      borderColor: "rgba(59,130,246,0.6)",
                      boxShadow: "0 0 0 1px rgba(59,130,246,0.4)",
                    }}
                    bg="rgba(255,255,255,0.05)"
                    border="1px solid"
                    borderColor="rgba(255,255,255,0.1)"
                    color="white"
                    onChange={(e) =>
                      setSettings((s) => ({
                        ...s,
                        numberMin: Number(e.target.value),
                      }))
                    }
                    type="number"
                    value={settings.numberMin}
                  />
                </Field.Root>
                <Field.Root flex={1}>
                  <Field.Label
                    color="gray.400"
                    fontSize="xs"
                    fontWeight="semibold"
                  >
                    数字の最大値
                  </Field.Label>
                  <Input
                    _focus={{
                      borderColor: "rgba(59,130,246,0.6)",
                      boxShadow: "0 0 0 1px rgba(59,130,246,0.4)",
                    }}
                    bg="rgba(255,255,255,0.05)"
                    border="1px solid"
                    borderColor="rgba(255,255,255,0.1)"
                    color="white"
                    onChange={(e) =>
                      setSettings((s) => ({
                        ...s,
                        numberMax: Number(e.target.value),
                      }))
                    }
                    type="number"
                    value={settings.numberMax}
                  />
                </Field.Root>
              </Flex>

              {/* Difficulty */}
              <Field.Root>
                <Field.Label
                  color="gray.400"
                  fontSize="xs"
                  fontWeight="semibold"
                >
                  お題の難易度
                </Field.Label>
                <NativeSelect.Root
                  bg="rgba(255,255,255,0.05)"
                  border="1px solid"
                  borderColor="rgba(255,255,255,0.1)"
                  borderRadius="md"
                >
                  <NativeSelect.Field
                    color="white"
                    onChange={(e) =>
                      setSettings((s) => ({
                        ...s,
                        difficulty: e.target
                          .value as GameSettings["difficulty"],
                      }))
                    }
                    value={settings.difficulty}
                  >
                    <option value="easy">かんたん</option>
                    <option value="normal">ふつう</option>
                    <option value="hard">むずかしい</option>
                  </NativeSelect.Field>
                  <NativeSelect.Indicator />
                </NativeSelect.Root>
              </Field.Root>

              {/* Rounds */}
              <Field.Root>
                <Field.Label
                  color="gray.400"
                  fontSize="xs"
                  fontWeight="semibold"
                >
                  ラウンド数
                </Field.Label>
                <Input
                  _focus={{
                    borderColor: "rgba(59,130,246,0.6)",
                    boxShadow: "0 0 0 1px rgba(59,130,246,0.4)",
                  }}
                  bg="rgba(255,255,255,0.05)"
                  border="1px solid"
                  borderColor="rgba(255,255,255,0.1)"
                  color="white"
                  max={10}
                  min={1}
                  onChange={(e) =>
                    setSettings((s) => ({
                      ...s,
                      totalRounds: Number(e.target.value),
                    }))
                  }
                  type="number"
                  value={settings.totalRounds}
                />
              </Field.Root>
            </Flex>
          </Box>

          {/* Start button */}
          <Button
            _active={{ transform: "translateY(0)" }}
            _hover={{
              boxShadow: "0 4px 24px rgba(34,197,94,0.35)",
              transform: "translateY(-1px)",
            }}
            color="white"
            flexShrink={0}
            fontWeight="bold"
            h="52px"
            onClick={() => void navigate(`/room/${roomId}/game`)}
            style={{
              background: "linear-gradient(135deg, #16a34a 0%, #15803d 100%)",
            }}
            transition="all 0.2s ease"
            w="full"
          >
            ゲームを開始する
          </Button>
        </Flex>
      </Box>

      {/* ── Join dialog (invite URL flow) ── */}
      <Dialog.Root open={showJoinDialog} onOpenChange={() => {}}>
        <Dialog.Backdrop />
        <Dialog.Positioner>
          <Dialog.Content>
            <Dialog.Header>
              <Dialog.Title>ルームに参加する</Dialog.Title>
            </Dialog.Header>
            <Dialog.Body>
              <Flex direction="column" gap={3}>
                <Text color="fg.muted" fontSize="sm">
                  ルームID: {roomId}
                </Text>
                <Field.Root>
                  <Field.Label>ニックネーム</Field.Label>
                  <Input
                    autoFocus
                    onChange={(e) => setJoiningName(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") handleConfirmJoin();
                    }}
                    placeholder="あなたの名前を入力"
                    value={joiningName}
                  />
                </Field.Root>
              </Flex>
            </Dialog.Body>
            <Dialog.Footer>
              <Button
                colorPalette="blue"
                disabled={joiningName.trim() === ""}
                onClick={handleConfirmJoin}
              >
                参加する
              </Button>
            </Dialog.Footer>
          </Dialog.Content>
        </Dialog.Positioner>
      </Dialog.Root>
    </Box>
  );
}
