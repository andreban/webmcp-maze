import { Application } from "pixi.js";
import { MazeView } from "./MazeView.ts";
import { PlayerView } from "./PlayerView.ts";
import { type MazeBoard } from "../game/MazeBoard.ts";
import { type Position, CELL_SIZE } from "../types/index.ts";

/**
 * Manages the PixiJS application, camera, and child views (maze + player).
 * Owns the canvas element and exposes methods for the game to drive rendering.
 */
export class Renderer {
  /** The PixiJS application instance. */
  private app: Application;

  /** View that draws the maze walls and exit. */
  private mazeView: MazeView;

  /** View that draws the player circle. */
  private playerView: PlayerView;

  constructor() {
    this.app = new Application();
    this.mazeView = new MazeView();
    this.playerView = new PlayerView();
  }

  /**
   * Initializes the PixiJS application and attaches the canvas to the DOM.
   * Must be called once before any other methods.
   * @param container - The DOM element to append the canvas to.
   */
  async init(container: HTMLElement): Promise<void> {
    await this.app.init({
      background: 0xf1f5f9,
      resizeTo: container,
      antialias: true,
    });
    container.appendChild(this.app.canvas);

    this.app.stage.addChild(this.mazeView.container);
    this.app.stage.addChild(this.playerView.container);

    // Drive PlayerView animation each frame
    this.app.ticker.add((ticker) => {
      this.playerView.tick(ticker.deltaMS / 1000);
    });

    this.showGameCanvas(false);
  }

  /**
   * Rebuilds the maze view from a new board and centers the camera.
   * @param board - The maze board to visualize.
   */
  buildMazeView(board: MazeBoard): void {
    this.mazeView.build(board);
    this.centerCamera(board);
  }

  /**
   * Updates the player graphic to reflect a new grid position.
   * @param pos - The player's current row/col in the maze.
   */
  updatePlayerPosition(pos: Position): void {
    this.playerView.updatePosition(pos);
  }

  /**
   * Smoothly animates the player to a new grid position.
   * Resolves once the animation is complete.
   * @param pos - The target row/col in the maze.
   */
  animatePlayerMove(pos: Position): Promise<void> {
    return this.playerView.animateTo(pos);
  }

  /**
   * Shows or hides the game canvas (maze + player).
   * Used to toggle between overlay screens and the active game.
   * @param visible - Whether to show the canvas.
   */
  showGameCanvas(visible: boolean): void {
    this.app.canvas.style.display = visible ? "block" : "none";
  }

  /**
   * Registers a per-frame callback on the PixiJS ticker.
   * @param callback - Function called each frame with delta time in seconds.
   */
  onTick(callback: (dt: number) => void): void {
    this.app.ticker.add((ticker) => {
      callback(ticker.deltaMS / 1000);
    });
  }

  /**
   * Centers the maze in the viewport by offsetting the stage.
   * @param board - The maze board (for computing total pixel dimensions).
   */
  private centerCamera(board: MazeBoard): void {
    const mazeWidth = board.cols * CELL_SIZE;
    const mazeHeight = board.rows * CELL_SIZE;
    const screenWidth = this.app.screen.width;
    const screenHeight = this.app.screen.height;

    this.app.stage.x = (screenWidth - mazeWidth) / 2;
    this.app.stage.y = (screenHeight - mazeHeight) / 2;
  }
}
