import { type Game } from "../game/Game.ts";
import { createMoveTool } from "./tools/MoveTool.ts";
import { createLookTool } from "./tools/LookTool.ts";
import { createStartGameTool } from "./tools/StartGameTool.ts";

/**
 * Manages the lifecycle of WebMCP tools registered with `navigator.modelContext`.
 *
 * Different sets of tools are registered depending on the current game state:
 * - **Intro / GameOver**: only `start_game`
 * - **Gameplay**: `move`, `look`
 */
export class McpToolRegistry {
  /** Reference to the game orchestrator. */
  private game: Game;

  /** Whether the WebMCP API is available in this browser. */
  private supported: boolean;

  /**
   * @param game - The game orchestrator instance.
   */
  constructor(game: Game) {
    this.game = game;
    this.supported = typeof navigator !== "undefined" && !!navigator.modelContext;

    if (!this.supported) {
      console.warn("WebMCP (navigator.modelContext) is not available in this browser.");
    }
  }

  /**
   * Registers tools available during the intro state.
   * Only the `start_game` tool is exposed.
   */
  registerIntroTools(): void {
    this.provideTools([createStartGameTool(this.game)]);
  }

  /**
   * Registers tools available during gameplay.
   * Exposes `move` and `look` tools for maze navigation.
   */
  registerGameplayTools(): void {
    this.provideTools([createMoveTool(this.game), createLookTool(this.game)]);
  }

  /**
   * Registers tools available during the game-over state.
   * Only the `start_game` tool is exposed (to replay).
   */
  registerGameOverTools(): void {
    this.provideTools([createStartGameTool(this.game)]);
  }

  /** Removes all registered tools. */
  clearTools(): void {
    if (!this.supported) return;
    navigator.modelContext!.clearContext();
  }

  /**
   * Replaces the current tool set with a new batch.
   * @param tools - The tools to register.
   */
  private provideTools(tools: ModelContextTool[]): void {
    if (!this.supported) return;
    navigator.modelContext!.provideContext({ tools });
  }
}
