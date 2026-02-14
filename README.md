# webmcp-maze

A maze escape game where the player navigates entirely by prompting an AI agent in the browser — no keyboard or mouse input. The game registers tools via the [WebMCP](https://webmachinelearning.github.io/webmcp/) browser API so the agent can interact with the game world.

## How It Works

The game exposes tools to the browser's built-in AI agent through `navigator.modelContext`. The agent can:

- **start_game** — begin a new maze
- **look** — inspect the player's surroundings (walls, open paths, exit location)
- **move** — move the player in a cardinal direction

The player starts in a randomly generated maze and must reach the exit by instructing the AI agent through natural language prompts.

## Tech Stack

- [Vite](https://vitejs.dev/) 7 + TypeScript (strict mode)
- [PixiJS](https://pixijs.com/) for rendering
- [Howler.js](https://howlerjs.com/) for audio
- [Bun](https://bun.sh/) as the runtime and test runner

## Getting Started

### Prerequisites

- [Bun](https://bun.sh/) installed
- A WebMCP-capable browser (one that exposes `navigator.modelContext`)

### Install and Run

```bash
bun install
bun run dev
```

Open the local URL printed by Vite in a WebMCP-capable browser and start prompting the AI agent to navigate the maze.

### Other Commands

```bash
bun run build          # typecheck + production build
bun test               # run all tests
bunx prettier --write . # format all files
```

## Project Structure

```
src/
  main.ts                # entry point
  game/                  # game orchestrator, state machine, player, maze data
  generation/            # maze generation algorithms (recursive backtracker)
  rendering/             # PixiJS rendering (maze view, player view, camera)
  audio/                 # Howler.js audio manager
  mcp/                   # WebMCP tool registry and individual tool definitions
  types/                 # shared types, enums, constants
```

## License

[Apache-2.0](LICENSE)
