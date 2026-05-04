import type { RouteObject } from "react-router";

import { createElement } from "react";

import { GameOverPage } from "@/features/game/pages/GameOverPage";
import { GamePage } from "@/features/game/pages/GamePage";
import { LobbyPage } from "@/features/game/pages/LobbyPage";
import { ResultPage } from "@/features/game/pages/ResultPage";
import { TopPage } from "@/features/game/pages/TopPage";

export const gameRoutes: RouteObject[] = [
  { element: createElement(TopPage), path: "/" },
  { element: createElement(LobbyPage), path: "/room/:roomId" },
  { element: createElement(GamePage), path: "/room/:roomId/game" },
  { element: createElement(ResultPage), path: "/room/:roomId/result" },
  { element: createElement(GameOverPage), path: "/room/:roomId/gameover" },
];
