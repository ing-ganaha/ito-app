/**
 * Route path builders — use these for navigate() calls.
 * Route pattern strings (with :param) are defined in libs/router.tsx.
 */
export const routes = {
  home: '/',
  lobby: (code: string) => `/lobby/${code}`,
  game: (code: string) => `/game/${code}`,
  result: (code: string) => `/result/${code}`,
} as const
