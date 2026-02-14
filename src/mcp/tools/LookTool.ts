import { type Game } from "../../game/Game.ts";

/**
 * Creates the `look` MCP tool.
 * Inspects the player's surroundings — reports which directions are open,
 * the player's current position, and whether they are at the exit.
 *
 * @param game - The game orchestrator instance.
 * @returns A {@link ModelContextTool} for inspecting surroundings.
 */
export function createLookTool(game: Game): ModelContextTool {
  return {
    name: "look",
    description:
      "Look around the current cell. Returns the player's position, " +
      "which directions are open (no wall), and whether the exit is here.",
    inputSchema: {
      type: "object",
      properties: {},
    },
    annotations: { readOnlyHint: true },
    async execute() {
      const pos = game.player.position;
      const openDirections = game.board.openDirections(pos);
      const atExit = game.board.isExit(pos);

      return {
        position: { row: pos.row, col: pos.col },
        openDirections,
        atExit,
        exitPosition: { row: game.board.exit.row, col: game.board.exit.col },
        mazeSize: { rows: game.board.rows, cols: game.board.cols },
        moveCount: game.player.moveCount,
      };
    },
  };
}
