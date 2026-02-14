# webmcp-maze

## Overview

A maze escape game that demonstrates WebMCP. The player navigates a maze entirely
by prompting an AI agent in the browser — there is no keyboard or mouse input.
The game registers tools via the WebMCP browser API so the agent can
interact with the game world (move player, inspect surroundings, etc.).

## Tech Stack

- **Build**: Vite 7 + TypeScript (strict mode) + Bun
- **Rendering**: PixiJS
- **Audio**: Howler.js
- **Formatting**: Prettier (run `bunx prettier --write .`)

## Architecture

- **Class-based**, modular design — one class per file, grouped by domain
- **Strategy pattern** for maze generation — `RecursiveBacktracker` is the default,
  but any generator implementing the `MazeGenerator` interface can be swapped in

### Game States

The game uses a state machine with the following states:

- **Intro** — title screen, waits for agent to start the game
- **Gameplay** — maze is visible, player moves via agent tools
- **GameOver** — player escaped (win) or gave up; shows results

Each state is a class implementing a `GameState` interface (`enter()`, `exit()`,
`update()`). `Game` holds the current state and delegates to it.

### Directory Structure

```
src/
  main.ts              # entry point — bootstraps the app
  game/
    Game.ts            # top-level game orchestrator, owns state machine
    GameState.ts       # GameState interface
    states/
      IntroState.ts
      GameplayState.ts
      GameOverState.ts
    Player.ts          # player state and movement logic
    MazeBoard.ts       # maze data structure (grid, cells, walls)
  generation/
    MazeGenerator.ts   # interface / base for all generators
    RecursiveBacktracker.ts
  rendering/
    Renderer.ts        # PixiJS rendering, camera, viewport
    MazeView.ts        # draws the maze grid
    PlayerView.ts      # draws the player
  audio/
    AudioManager.ts    # Howler.js wrapper for SFX and music
  mcp/
    McpToolRegistry.ts # registers/unregisters tools via navigator.modelContext
    tools/             # one file per tool (e.g., MoveTool.ts, LookTool.ts)
  types/
    index.ts           # shared types, enums, constants
```

## Conventions

- PascalCase for classes and types, camelCase for variables and functions
- One exported class per file; filename matches class name
- Prefer `interface` over `type` for object shapes
- No default exports — use named exports everywhere
- Keep rendering logic separate from game logic
- Add JSDoc comments to all exported classes, methods, interfaces, and non-trivial constants

## Testing

- **Runner**: Bun's built-in test runner (`bun test`)
- **Location**: `src/__tests__/` — test files named `<ClassName>.test.ts`
- Write tests for all game-logic classes (data structures, generators, player, etc.)
- Rendering and audio classes are harder to unit-test; focus tests on logic layers
- Run tests before committing: `bun test`
- When adding a new game-logic class, add a corresponding test file

## WebMCP Integration

The game exposes tools to the browser's AI agent via the WebMCP API
(spec: https://webmachinelearning.github.io/webmcp/).

### API Surface (navigator.modelContext)

- `provideContext({ tools })` — register a batch of tools (replaces previous set)
- `registerTool(tool)` / `unregisterTool(name)` — add/remove individual tools
- `clearContext()` — remove all tools

### ModelContext Interface

```ts
interface ModelContext {
  provideContext(options?: { tools: ModelContextTool[] }): void;
  clearContext(): void;
  registerTool(tool: ModelContextTool): void;
  unregisterTool(name: string): void;
}
```

Accessed via `navigator.modelContext`.

### Tool Shape

```ts
interface ModelContextTool {
  name: string; // unique identifier
  description: string; // natural-language explanation
  inputSchema?: object; // JSON Schema for input
  execute: (input: object, client: ModelContextClient) => Promise<any>;
  annotations?: { readOnlyHint?: boolean };
}
```

`client.requestUserInteraction(callback)` can be used inside `execute` when
the tool needs to trigger a user-visible side effect.

### Design Rules

- Each tool lives in its own file under `src/mcp/tools/`
- `McpToolRegistry` owns the lifecycle — calls `provideContext()` on init,
  `registerTool()` / `unregisterTool()` as game state changes
- Tools receive a reference to the `Game` instance so they can query/mutate state
- Keep tool `execute` callbacks thin — delegate to game logic classes

## TODO

- [x] Install dependencies (PixiJS, Howler.js, Prettier)
- [x] Set up project directory structure
- [x] Implement maze data structure and recursive backtracker generator
- [x] Implement player state and movement logic
- [x] Implement Game orchestrator and GameState interface with state machine
- [x] Add tests for MazeBoard, RecursiveBacktracker, and Player
- [x] Implement PixiJS renderer (Renderer, MazeView, PlayerView)
- [x] Set up McpToolRegistry and WebMCP type declarations
- [x] Implement MCP tools (move, look, start_game)
- [x] Add audio via AudioManager (placeholder MP3s in public/audio/)
- [x] Wire up main.ts entry point and game loop
- [x] Add CSS styling for overlay screens
- [ ] Replace placeholder audio files with real sound effects
- [ ] End-to-end manual testing in browser (with WebMCP-capable browser)
- [ ] Add more MCP tools (e.g., give_up, get_map, hint)
- [x] Animate player movement (lerp between cells)
- [ ] Add move history / breadcrumb trail visualization
- [ ] Add fog of war (only render visited/visible cells)
- [ ] Add collectibles (keys, coins, power-ups) scattered through the maze
- [ ] Add locked doors that require finding a key to pass through
- [ ] Add difficulty settings (maze size, mechanics complexity)
- [ ] Add multiple levels (generate a new, harder maze after escaping)
- [ ] Add particle effects (dust on move, glow on exit, sparkles on collectibles)
- [x] Tron-inspired visual overhaul: dark background + neon cyan/magenta color scheme
- [x] Add glow filters to walls, player, and exit
- [x] Thin luminous line walls with outer glow
- [x] Subtle grid floor pattern in maze cells
- [x] Player movement trail (fading breadcrumbs)
- [x] Dark neon overlay screens with digital font (Orbitron)

**Important:** Always keep this TODO list up to date — mark items as done when
completed, and add new items when new work is planned.

## Git

- Write detailed commit messages: short summary line, blank line, then a body
  explaining _what_ changed and _why_

## Commands

- `bun run dev` — start dev server
- `bun run build` — typecheck + production build
- `bun test` — run all tests
- `bunx prettier --write .` — format all files
