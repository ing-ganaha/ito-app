import type { SlotCard } from "@/features/game/pages/GamePage/types";
import type { Analogy } from "@/features/game/types";

import { Box, Button, Dialog, Flex, Text } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";

import {
  mockAnalogies,
  mockMe,
  mockPlayers,
  mockRoom,
  mockRound,
} from "@/features/game/mocks";
import { GameBoard } from "@/features/game/pages/GamePage/GameBoard";
import { GameHeader } from "@/features/game/pages/GamePage/GameHeader";
import { MyHandArea } from "@/features/game/pages/GamePage/MyHandArea";
import { PlayerSeat } from "@/features/game/pages/GamePage/PlayerSeat";

const MOCK_OTHER_CARDS: SlotCard[] = [
  { number: 67, playerId: 2, playerName: "Bob" },
  { number: 23, playerId: 3, playerName: "Charlie" },
];

const FLIP_DURATION = 500;

export function GamePage() {
  const { roomId } = useParams<{ roomId: string }>();
  const navigate = useNavigate();

  const [slots, setSlots] = useState<(SlotCard | null)[]>(() =>
    Array.from({ length: mockPlayers.length }, () => null)
  );
  const [selectedSlot, setSelectedSlot] = useState<number | null>(null);
  const [myPlacedSlot, setMyPlacedSlot] = useState<number | null>(null);
  const [isRevealPhase, setIsRevealPhase] = useState(false);
  const [revealedSlots, setRevealedSlots] = useState<Set<number>>(new Set());

  const [analogies, setAnalogies] = useState<Analogy[]>(mockAnalogies);
  const [myAnalogyText, setMyAnalogyText] = useState("");
  const [isAnalogySent, setIsAnalogySent] = useState(false);

  const allPlaced = slots.every((s) => s !== null);
  const placedCount = slots.filter((s) => s !== null).length;
  const allRevealed = revealedSlots.size === mockPlayers.length;
  const otherPlayers = mockPlayers.filter((p) => p.id !== mockMe.id);

  useEffect(() => {
    if (myPlacedSlot === null) return;
    const remainingSlots = Array.from(
      { length: mockPlayers.length },
      (_, i) => i
    ).filter((i) => i !== myPlacedSlot);

    const timers = remainingSlots.map((slotIndex, i) => {
      const mockCard = MOCK_OTHER_CARDS[i];
      if (!mockCard) return null;
      return setTimeout(
        () => {
          setSlots((prev) => {
            const next = [...prev];
            next[slotIndex] = mockCard;
            return next;
          });
        },
        (i + 1) * 1200
      );
    });

    return () =>
      timers.forEach((t) => {
        if (t !== null) clearTimeout(t);
      });
  }, [myPlacedSlot]);

  const handleSlotClick = (slotIndex: number) => {
    if (slots[slotIndex] !== null || myPlacedSlot !== null) return;
    setSelectedSlot(slotIndex);
  };

  const handleConfirmPlace = () => {
    if (selectedSlot === null) return;
    setSlots((prev) => {
      const next = [...prev];
      next[selectedSlot] = {
        number: mockMe.number,
        playerId: mockMe.id,
        playerName: mockMe.name,
      };
      return next;
    });
    setMyPlacedSlot(selectedSlot);
    setSelectedSlot(null);
  };

  const handleRevealSlot = (slotIndex: number) => {
    setRevealedSlots((prev) => new Set([...prev, slotIndex]));
  };

  const handleSendAnalogy = () => {
    if (myAnalogyText.trim() === "") return;
    setAnalogies((prev) => [
      ...prev.filter((a) => a.playerId !== mockMe.id),
      {
        playerId: mockMe.id,
        playerName: mockMe.name,
        text: myAnalogyText.trim(),
      },
    ]);
    setIsAnalogySent(true);
  };

  const handleEditAnalogy = () => {
    const mine = analogies.find((a) => a.playerId === mockMe.id);
    setMyAnalogyText(mine?.text ?? "");
    setIsAnalogySent(false);
  };

  const handleDeleteAnalogy = () => {
    setAnalogies((prev) => prev.filter((a) => a.playerId !== mockMe.id));
    setMyAnalogyText("");
    setIsAnalogySent(false);
  };

  return (
    <Box
      bg="#0d1117"
      color="white"
      display="flex"
      flexDirection="column"
      minH="100vh"
      overflowX="hidden"
    >
      <style>{`
        /* Flip card animation */
        .flip-card { perspective: 800px; width: 56px; height: 80px; }
        @media (min-width: 768px) { .flip-card { width: 80px; height: 110px; } }
        .flip-card-inner {
          position: relative; width: 100%; height: 100%;
          transform-style: preserve-3d;
        }
        .flip-card-inner.revealed { transform: rotateY(180deg); }
        .flip-card-face {
          position: absolute; inset: 0; border-radius: 8px;
          backface-visibility: hidden; -webkit-backface-visibility: hidden;
          display: flex; flex-direction: column;
          align-items: center; justify-content: center;
          gap: 4px; padding: 6px;
        }
        .flip-card-back {
          background: linear-gradient(150deg, #1e3a8a, #1d4ed8);
          border: 2px solid rgba(59,130,246,0.5);
          box-shadow: 0 4px 12px rgba(37,99,235,0.25);
        }
        .flip-card-back.clickable {
          background: linear-gradient(150deg, #3b0764, #6d28d9);
          border-color: rgba(139,92,246,0.6);
          cursor: pointer;
        }
        .flip-card-back.clickable:hover {
          background: linear-gradient(150deg, #4c0a79, #7c3aed);
        }
        .flip-card-front {
          background: #1a2332;
          border: 2px solid rgba(255,255,255,0.1);
          transform: rotateY(180deg);
        }
        .flip-card-player {
          font-size: 0.6rem; text-align: center;
          word-break: break-all; line-height: 1.2;
          color: rgba(255,255,255,0.7);
        }
        .flip-card-number { font-size: 1.6rem; font-weight: bold; color: #60a5fa; }
        .flip-card-hint { font-size: 0.5rem; color: rgba(255,255,255,0.5); }

        /* Slot hover — hint text appears only on hover */
        .card-slot-empty .slot-hint { opacity: 0; transition: opacity 0.15s ease; }
        .card-slot-empty:hover .slot-hint { opacity: 1; }
      `}</style>

      {/* ── Header ── */}
      <GameHeader
        lives={mockRoom.lives}
        remainingLives={mockRoom.remainingLives}
        roundNumber={mockRound.roundNumber}
        totalRounds={mockRoom.totalRounds}
      />

      {/* ── Table area (other players + board) ── */}
      <Box
        alignItems="center"
        display="flex"
        flex={1}
        flexDirection="column"
        gap={10}
        overflow="auto"
        px={4}
        py={8}
      >
        {/* Other players sit across / around the table */}
        <Flex gap={{ base: 6, md: 12 }} justify="center" wrap="wrap">
          {otherPlayers.map((player) => (
            <PlayerSeat
              key={player.id}
              analogy={analogies.find((a) => a.playerId === player.id)}
              hasPlaced={slots.some((s) => s?.playerId === player.id)}
              player={player}
            />
          ))}
        </Flex>

        {/* Central game board */}
        <GameBoard
          allPlaced={allPlaced}
          allRevealed={allRevealed}
          flipDuration={FLIP_DURATION}
          isRevealPhase={isRevealPhase}
          myPlacedSlot={myPlacedSlot}
          onNextRound={() => void navigate(`/room/${roomId}/result`)}
          onRevealSlot={handleRevealSlot}
          onSlotClick={handleSlotClick}
          onStartReveal={() => setIsRevealPhase(true)}
          placedCount={placedCount}
          revealedSlots={revealedSlots}
          slots={slots}
          topic={mockRound.topic}
          totalPlayers={mockPlayers.length}
        />
      </Box>

      {/* ── My hand (bottom dashboard) ── */}
      <MyHandArea
        isAnalogySent={isAnalogySent}
        myAnalogy={analogies.find((a) => a.playerId === mockMe.id)}
        myAnalogyText={myAnalogyText}
        myNumber={mockMe.number}
        onChange={setMyAnalogyText}
        onDelete={handleDeleteAnalogy}
        onEdit={handleEditAnalogy}
        onSend={handleSendAnalogy}
        topic={mockRound.topic}
      />

      {/* ── Card placement confirmation dialog ── */}
      <Dialog.Root
        open={selectedSlot !== null}
        onOpenChange={(e) => {
          if (!e.open) setSelectedSlot(null);
        }}
      >
        <Dialog.Backdrop />
        <Dialog.Positioner>
          <Dialog.Content>
            <Dialog.Header>
              <Dialog.Title>カードを置く</Dialog.Title>
            </Dialog.Header>
            <Dialog.Body>
              <Text>ここにカードを置きますか？</Text>
            </Dialog.Body>
            <Dialog.Footer gap={2}>
              <Button variant="outline" onClick={() => setSelectedSlot(null)}>
                キャンセル
              </Button>
              <Button colorPalette="blue" onClick={handleConfirmPlace}>
                置く
              </Button>
            </Dialog.Footer>
          </Dialog.Content>
        </Dialog.Positioner>
      </Dialog.Root>
    </Box>
  );
}
