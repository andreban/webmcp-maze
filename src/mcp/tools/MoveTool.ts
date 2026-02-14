import { type Game } from "../../game/Game.ts";
import { Direction } from "../../types/index.ts";
import { SoundId } from "../../audio/AudioManager.ts";

/** Valid direction strings accepted by the move tool input. */
const VALID_DIRECTIONS = new Set(Object.values(Direction));

/**
 * Creates the `move` MCP tool.
 * Moves the player one cell in a cardinal direction if the path is clear.
 *
 * @param game - The game orchestrator instance.
 * @returns A {@link ModelContextTool} for player movement.
 */
export function createMoveTool(game: Game): ModelContextTool {
  return {
    name: "move",
    description:
      "Move the player one cell in a cardinal direction (north, south, east, west). " +
      "Returns success or failure with a reason.",
    inputSchema: {
      type: "object",
      properties: {
        direction: {
          type: "string",
          enum: ["north", "south", "east", "west"],
          description: "The direction to move.",
        },
      },
      required: ["direction"],
    },
    async execute(input: Record<string, unknown>) {
      const dir = input.direction as string;

      if (!VALID_DIRECTIONS.has(dir as Direction)) {
        return {
          success: false,
          reason: `Invalid direction: "${dir}". Use north, south, east, or west.`,
        };
      }

      const moved = game.player.move(dir as Direction, game.board);

      if (moved) {
        game.audio.play(SoundId.Move);
        await game.renderer.animatePlayerMove(game.player.position);

        const atExit = game.board.isExit(game.player.position);
        return {
          success: true,
          position: {
            row: game.player.position.row,
            col: game.player.position.col,
          },
          atExit,
          moveCount: game.player.moveCount,
        };
      }

      game.audio.play(SoundId.Blocked);
      return {
        success: false,
        reason: `There is a wall blocking the ${dir} direction.`,
      };
    },
  };
}
