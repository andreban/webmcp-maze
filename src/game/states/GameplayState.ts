import { type GameState } from "../GameState.ts";
import { type Game } from "../Game.ts";
import { GameOverState } from "./GameOverState.ts";

/**
 * The main gameplay state.
 * The maze is visible and the player moves via AI agent MCP tools.
 * Checks for win condition each frame.
 */
export class GameplayState implements GameState {
  /** Reference to the game orchestrator. */
  private game: Game;

  /** DOM element for the in-game HUD (move counter). */
  private hud: HTMLDivElement | null = null;

  /** Span displaying the current move count. */
  private moveCountEl: HTMLSpanElement | null = null;

  /**
   * @param game - The game orchestrator instance.
   */
  constructor(game: Game) {
    this.game = game;
  }

  /** @inheritdoc */
  enter(): void {
    // newGame() should already have been called (e.g. by StartGameTool)
    // before transitioning to this state. If not, create a default game.
    if (!this.game.board) {
      this.game.newGame();
    }
    this.game.renderer.buildMazeView(this.game.board);
    this.game.renderer.updatePlayerPosition(this.game.player.position);
    this.game.renderer.showGameCanvas(true);
    this.game.mcpRegistry.registerGameplayTools();
    this.createHud();
  }

  /** @inheritdoc */
  exit(): void {
    this.game.renderer.showGameCanvas(false);
    this.hud?.remove();
    this.hud = null;
    this.moveCountEl = null;
  }

  /**
   * Updates the move counter display.
   * @param count - The current move count.
   */
  updateMoveCount(count: number): void {
    if (this.moveCountEl) {
      this.moveCountEl.textContent = String(count);
    }
  }

  /** Creates the HUD overlay with a move counter. */
  private createHud(): void {
    this.hud = document.createElement("div");
    this.hud.id = "gameplay-hud";

    this.moveCountEl = document.createElement("span");
    this.moveCountEl.id = "move-count";
    this.moveCountEl.textContent = "0";

    this.hud.innerHTML = `<span class="hud-label">MOVES</span> `;
    this.hud.appendChild(this.moveCountEl);

    document.getElementById("app")!.appendChild(this.hud);
  }

  /** @inheritdoc */
  update(_dt: number): void {
    if (this.game.board.isExit(this.game.player.position)) {
      this.game.won = true;
      this.game.setState(new GameOverState(this.game));
    }
  }
}
