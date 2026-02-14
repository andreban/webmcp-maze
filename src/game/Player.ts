import {
  type Position,
  type Direction,
  DIRECTION_OFFSETS,
} from "../types/index.ts";
import { type MazeBoard } from "./MazeBoard.ts";

/**
 * Tracks the player's position in the maze and handles movement validation.
 * Movement is only allowed when there is no wall blocking the requested direction.
 */
export class Player {
  /** Current position in the maze grid. */
  position: Position;

  /** Total number of moves the player has made. */
  moveCount: number;

  /**
   * Creates a new player at the given starting position.
   * @param start - The initial row/col coordinate (defaults to top-left).
   */
  constructor(start: Position = { row: 0, col: 0 }) {
    this.position = { ...start };
    this.moveCount = 0;
  }

  /**
   * Attempts to move the player in the given direction.
   * The move is rejected if a wall blocks the way.
   *
   * @param dir - The direction to move.
   * @param board - The maze board used to check walls and bounds.
   * @returns `true` if the move succeeded, `false` if blocked.
   */
  move(dir: Direction, board: MazeBoard): boolean {
    if (board.hasWall(this.position, dir)) {
      return false;
    }

    const offset = DIRECTION_OFFSETS[dir];
    const next: Position = {
      row: this.position.row + offset.row,
      col: this.position.col + offset.col,
    };

    if (!board.inBounds(next)) {
      return false;
    }

    this.position = next;
    this.moveCount++;
    return true;
  }

  /**
   * Resets the player back to a starting position with zero moves.
   * @param start - The position to reset to (defaults to top-left).
   */
  reset(start: Position = { row: 0, col: 0 }): void {
    this.position = { ...start };
    this.moveCount = 0;
  }
}
