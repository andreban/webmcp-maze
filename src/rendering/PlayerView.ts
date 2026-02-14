import { Graphics, Container } from "pixi.js";
import {
  type Position,
  CELL_SIZE,
  MOVE_ANIM_DURATION,
} from "../types/index.ts";

/** Color of the player circle. */
const PLAYER_COLOR = 0x3b82f6;

/** Radius of the player circle in pixels. */
const PLAYER_RADIUS = CELL_SIZE * 0.3;

/**
 * Draws the player as a filled circle positioned within a maze cell.
 * Supports both instant positioning ({@link updatePosition}) and
 * smooth animated transitions ({@link animateTo}).
 */
export class PlayerView {
  /** The PixiJS container holding the player graphic. */
  readonly container: Container;

  /** The circle graphic representing the player. */
  private circle: Graphics;

  /** Whether an animation is currently in progress. */
  private animating = false;

  /** Animation start x/y in pixels. */
  private fromX = 0;
  private fromY = 0;

  /** Animation target x/y in pixels. */
  private toX = 0;
  private toY = 0;

  /** Milliseconds elapsed since the animation started. */
  private elapsed = 0;

  /** Total animation duration in milliseconds. */
  private duration = MOVE_ANIM_DURATION;

  /** Resolve function for the current animation promise. */
  private resolveAnim: (() => void) | null = null;

  constructor() {
    this.container = new Container();
    this.circle = new Graphics();
    this.circle.circle(0, 0, PLAYER_RADIUS).fill(PLAYER_COLOR);
    this.container.addChild(this.circle);
  }

  /**
   * Instantly snaps the player graphic to the center of the given cell.
   * Use this for initial placement, not for in-game movement.
   * @param pos - The row/col grid position to move to.
   */
  updatePosition(pos: Position): void {
    this.container.x = pos.col * CELL_SIZE + CELL_SIZE / 2;
    this.container.y = pos.row * CELL_SIZE + CELL_SIZE / 2;
  }

  /**
   * Smoothly animates the player from its current position to the target cell.
   * Resolves the returned promise once the animation completes.
   * @param pos - The target row/col grid position.
   * @returns A promise that resolves when the animation finishes.
   */
  animateTo(pos: Position): Promise<void> {
    this.fromX = this.container.x;
    this.fromY = this.container.y;
    this.toX = pos.col * CELL_SIZE + CELL_SIZE / 2;
    this.toY = pos.row * CELL_SIZE + CELL_SIZE / 2;
    this.elapsed = 0;
    this.duration = MOVE_ANIM_DURATION;
    this.animating = true;

    return new Promise<void>((resolve) => {
      this.resolveAnim = resolve;
    });
  }

  /**
   * Advances the animation by the given delta time.
   * Call this every frame from the renderer's tick loop.
   * @param dt - Delta time in seconds since the last frame.
   */
  tick(dt: number): void {
    if (!this.animating) return;

    this.elapsed += dt * 1000;
    const t = Math.min(this.elapsed / this.duration, 1);

    // Ease-out quad: decelerates toward the target
    const eased = 1 - (1 - t) * (1 - t);

    this.container.x = this.fromX + (this.toX - this.fromX) * eased;
    this.container.y = this.fromY + (this.toY - this.fromY) * eased;

    if (t >= 1) {
      this.container.x = this.toX;
      this.container.y = this.toY;
      this.animating = false;
      this.resolveAnim?.();
      this.resolveAnim = null;
    }
  }
}
