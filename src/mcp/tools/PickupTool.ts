import { type Game } from "../../game/Game.ts";
import { collectibleDisplayName } from "../../types/index.ts";
import { SoundId } from "../../audio/AudioManager.ts";

/**
 * Creates the `pickup` MCP tool.
 * Picks up a collectible from the player's current cell if inventory is empty.
 *
 * @param game - The game orchestrator instance.
 * @returns A {@link ModelContextTool} for picking up items.
 */
export function createPickupTool(game: Game): ModelContextTool {
  return {
    name: "pickup",
    description:
      "Pick up a collectible item (key or dynamite) from your current cell. " +
      "You can only carry one item at a time. Drop your current item first if needed.",
    inputSchema: {
      type: "object",
      properties: {},
    },
    async execute() {
      const pos = game.player.position;
      const collectible = game.board.getCollectible(pos);

      if (!collectible) {
        return JSON.stringify({
          success: false,
          reason: "There is no item to pick up at your current location.",
        });
      }

      if (game.player.inventory !== null) {
        return JSON.stringify({
          success: false,
          reason: `Your hands are full. You are already carrying: ${collectibleDisplayName(game.player.inventory)}. Drop it first.`,
          currentItem: game.player.inventory,
        });
      }

      game.player.pickup(collectible.type);
      game.board.removeCollectible(pos);
      game.renderer.updateCollectibles(game.board);
      game.audio.play(SoundId.Pickup);
      game.gameplayState?.updateInventory();

      return JSON.stringify({
        success: true,
        item: collectible.type,
        message: `Picked up: ${collectibleDisplayName(collectible.type)}`,
      });
    },
  };
}
