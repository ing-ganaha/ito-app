import type { Analogy } from "@/features/game/types";

import {
  Badge,
  Box,
  Button,
  Flex,
  IconButton,
  Input,
  Text,
} from "@chakra-ui/react";

type Props = {
  isAnalogySent: boolean;
  myAnalogy: Analogy | undefined;
  myAnalogyText: string;
  myNumber: number;
  onChange: (text: string) => void;
  onDelete: () => void;
  onEdit: () => void;
  onSend: () => void;
  topic: string;
};

export function MyHandArea({
  isAnalogySent,
  myAnalogy,
  myAnalogyText,
  myNumber,
  onChange,
  onDelete,
  onEdit,
  onSend,
  topic,
}: Props) {
  return (
    <Box
      bg="rgba(0,0,0,0.55)"
      borderTop="1px solid"
      borderColor="rgba(255,255,255,0.06)"
      flexShrink={0}
      px={8}
      py={5}
    >
      <Flex
        align={{ base: "stretch", sm: "center" }}
        direction={{ base: "column", sm: "row" }}
        gap={{ base: 3, sm: 6 }}
        justify="center"
        maxW="680px"
        mx="auto"
      >
        {/* My number card */}
        <Flex align="center" flexShrink={0} gap={3}>
          <Box textAlign="center">
            <Text
              color="gray.600"
              fontSize="9px"
              fontWeight="bold"
              letterSpacing="widest"
              mb={2}
              textTransform="uppercase"
            >
              あなたの数字
            </Text>
            <Box
              alignItems="center"
              bg="linear-gradient(150deg, #1e3a8a 0%, #1d4ed8 60%, #2563eb 100%)"
              border="2px solid"
              borderColor="rgba(59,130,246,0.5)"
              borderRadius="12px"
              boxShadow="0 0 20px rgba(37,99,235,0.35), inset 0 1px 0 rgba(255,255,255,0.1)"
              display="flex"
              h={{ base: "64px", sm: "88px" }}
              justifyContent="center"
              w={{ base: "48px", sm: "64px" }}
            >
              <Text
                color="white"
                fontSize={{ base: "xl", sm: "2xl" }}
                fontWeight="bold"
              >
                {myNumber}
              </Text>
            </Box>
          </Box>
        </Flex>

        {/* Vertical divider — hidden on mobile */}
        <Box
          bg="rgba(255,255,255,0.07)"
          display={{ base: "none", sm: "block" }}
          flexShrink={0}
          h="72px"
          w="1px"
        />

        {/* Analogy input / display */}
        <Box flex={1} maxW="400px">
          <Text color="gray.600" fontSize="xs" fontWeight="medium" mb={2}>
            「{topic}」に例えると...
          </Text>

          {!isAnalogySent ? (
            <Flex gap={2}>
              <Input
                _focus={{
                  borderColor: "rgba(59,130,246,0.6)",
                  boxShadow: "0 0 0 1px rgba(59,130,246,0.4)",
                }}
                _placeholder={{ color: "gray.600" }}
                bg="rgba(255,255,255,0.04)"
                border="1px solid"
                borderColor="rgba(255,255,255,0.1)"
                color="white"
                onChange={(e) => onChange(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") onSend();
                }}
                placeholder="たとえを入力..."
                value={myAnalogyText}
              />
              <Button
                colorPalette="blue"
                disabled={myAnalogyText.trim() === ""}
                flexShrink={0}
                onClick={onSend}
              >
                投稿
              </Button>
            </Flex>
          ) : (
            <Flex align="center" gap={2}>
              <Badge colorPalette="blue" fontSize="sm" px={3} py={1} size="lg">
                {myAnalogy?.text}
              </Badge>
              <IconButton
                aria-label="編集"
                onClick={onEdit}
                size="xs"
                variant="ghost"
              >
                ✏️
              </IconButton>
              <IconButton
                aria-label="削除"
                colorPalette="red"
                onClick={onDelete}
                size="xs"
                variant="ghost"
              >
                🗑️
              </IconButton>
            </Flex>
          )}
        </Box>
      </Flex>
    </Box>
  );
}
