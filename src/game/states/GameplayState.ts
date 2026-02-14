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
  }

  /** @inheritdoc */
  exit(): void {
    this.game.renderer.showGameCanvas(false);
  }

  /** @inheritdoc */
  update(_dt: number): void {
    if (this.game.board.isExit(this.game.player.position)) {
      this.game.won = true;
      this.game.setState(new GameOverState(this.game));
    }
  }
}
