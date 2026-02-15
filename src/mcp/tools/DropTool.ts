import { type Game } from "../../game/Game.ts";
import { collectibleDisplayName } from "../../types/index.ts";
import { SoundId } from "../../audio/AudioManager.ts";

/**
 * Creates the `drop` MCP tool.
 * Drops the currently held item at the player's current cell.
 *
 * @param game - The game orchestrator instance.
 * @returns A {@link ModelContextTool} for dropping items.
 */
export function createDropTool(game: Game): ModelContextTool {
  return {
    name: "drop",
    description:
      "Drop your currently held item at your current location. " +
      "The item will remain on this cell and can be picked up again later.",
    inputSchema: {
      type: "object",
      properties: {},
    },
    async execute() {
      if (game.player.inventory === null) {
        return JSON.stringify({
          success: false,
          reason: "You are not carrying any item.",
        });
      }

      const pos = game.player.position;
      if (game.board.getCollectible(pos)) {
        return JSON.stringify({
          success: false,
          reason:
            "There is already an item on this cell. Move to an empty cell first.",
        });
      }

      const item = game.player.drop()!;
      game.board.addCollectible({
        type: item,
        position: { ...pos },
      });
      game.renderer.updateCollectibles(game.board);
      game.audio.play(SoundId.Drop);
      game.gameplayState?.updateInventory();

      return JSON.stringify({
        success: true,
        item,
        message: `Dropped: ${collectibleDisplayName(item)}`,
        position: { row: pos.row, col: pos.col },
      });
    },
  };
}
