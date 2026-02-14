import { Graphics, Container } from "pixi.js";
import { type Position, CELL_SIZE } from "../types/index.ts";

/** Color of the player circle. */
const PLAYER_COLOR = 0x3b82f6;

/** Radius of the player circle in pixels. */
const PLAYER_RADIUS = CELL_SIZE * 0.3;

/**
 * Draws the player as a filled circle positioned within a maze cell.
 * Call {@link updatePosition} to move the visual to a new cell.
 */
export class PlayerView {
  /** The PixiJS container holding the player graphic. */
  readonly container: Container;

  /** The circle graphic representing the player. */
  private circle: Graphics;

  constructor() {
    this.container = new Container();
    this.circle = new Graphics();
    this.circle.circle(0, 0, PLAYER_RADIUS).fill(PLAYER_COLOR);
    this.container.addChild(this.circle);
  }

  /**
   * Moves the player graphic to the center of the given cell.
   * @param pos - The row/col grid position to move to.
   */
  updatePosition(pos: Position): void {
    this.container.x = pos.col * CELL_SIZE + CELL_SIZE / 2;
    this.container.y = pos.row * CELL_SIZE + CELL_SIZE / 2;
  }
}
