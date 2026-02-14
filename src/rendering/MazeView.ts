import { Graphics, Container } from "pixi.js";
import { type MazeBoard } from "../game/MazeBoard.ts";
import { Direction, CELL_SIZE, WALL_THICKNESS } from "../types/index.ts";

/** Color used for maze walls. */
const WALL_COLOR = 0x334155;

/** Color used for the exit cell highlight. */
const EXIT_COLOR = 0x22c55e;

/**
 * Draws the maze grid (walls and exit highlight) into a PixiJS container.
 * Rebuilt each time a new maze is generated.
 */
export class MazeView {
  /** The PixiJS container holding all maze graphics. */
  readonly container: Container;

  constructor() {
    this.container = new Container();
  }

  /**
   * Clears the current view and redraws the maze from the given board.
   * @param board - The maze data to visualize.
   */
  build(board: MazeBoard): void {
    this.container.removeChildren();

    this.drawExitHighlight(board);
    this.drawWalls(board);
  }

  /**
   * Draws a translucent highlight on the exit cell.
   * @param board - The maze board (for exit position and cell size).
   */
  private drawExitHighlight(board: MazeBoard): void {
    const gfx = new Graphics();
    gfx
      .rect(
        board.exit.col * CELL_SIZE + WALL_THICKNESS,
        board.exit.row * CELL_SIZE + WALL_THICKNESS,
        CELL_SIZE - WALL_THICKNESS * 2,
        CELL_SIZE - WALL_THICKNESS * 2,
      )
      .fill({ color: EXIT_COLOR, alpha: 0.3 });
    this.container.addChild(gfx);
  }

  /**
   * Draws all maze walls. North and west walls are drawn per-cell;
   * south and east borders are only drawn on the maze edges.
   * @param board - The maze board to read wall data from.
   */
  private drawWalls(board: MazeBoard): void {
    const gfx = new Graphics();

    for (let r = 0; r < board.rows; r++) {
      for (let c = 0; c < board.cols; c++) {
        const cell = board.getCell({ row: r, col: c })!;
        const x = c * CELL_SIZE;
        const y = r * CELL_SIZE;

        if (cell.walls[Direction.North]) {
          gfx.rect(x, y, CELL_SIZE, WALL_THICKNESS).fill(WALL_COLOR);
        }
        if (cell.walls[Direction.West]) {
          gfx.rect(x, y, WALL_THICKNESS, CELL_SIZE).fill(WALL_COLOR);
        }
        if (r === board.rows - 1 && cell.walls[Direction.South]) {
          gfx
            .rect(x, y + CELL_SIZE - WALL_THICKNESS, CELL_SIZE, WALL_THICKNESS)
            .fill(WALL_COLOR);
        }
        if (c === board.cols - 1 && cell.walls[Direction.East]) {
          gfx
            .rect(x + CELL_SIZE - WALL_THICKNESS, y, WALL_THICKNESS, CELL_SIZE)
            .fill(WALL_COLOR);
        }
      }
    }

    this.container.addChild(gfx);
  }
}
