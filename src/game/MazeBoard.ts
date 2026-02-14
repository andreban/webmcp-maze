import {
  type Cell,
  Direction,
  type Position,
  DIRECTION_OFFSETS,
  OPPOSITE_DIRECTION,
} from "../types/index.ts";

/**
 * Stores the maze grid — a 2D array of {@link Cell} objects.
 * Provides helpers for querying walls, neighbors, and bounds.
 */
export class MazeBoard {
  /** Number of rows in the maze. */
  readonly rows: number;

  /** Number of columns in the maze. */
  readonly cols: number;

  /** The exit cell position (bottom-right by default). */
  readonly exit: Position;

  /** Internal 2D grid of cells. */
  private grid: Cell[][];

  /**
   * Creates a new maze board with all walls intact.
   * @param rows - Number of rows.
   * @param cols - Number of columns.
   */
  constructor(rows: number, cols: number) {
    this.rows = rows;
    this.cols = cols;
    this.exit = { row: rows - 1, col: cols - 1 };
    this.grid = this.buildGrid();
  }

  /**
   * Returns the cell at the given position.
   * @param pos - The row/col coordinate.
   * @returns The cell, or `undefined` if out of bounds.
   */
  getCell(pos: Position): Cell | undefined {
    return this.grid[pos.row]?.[pos.col];
  }

  /**
   * Checks whether a position is within the grid bounds.
   * @param pos - The row/col coordinate to test.
   */
  inBounds(pos: Position): boolean {
    return (
      pos.row >= 0 && pos.row < this.rows && pos.col >= 0 && pos.col < this.cols
    );
  }

  /**
   * Returns the neighbor position in the given direction,
   * or `undefined` if it would be out of bounds.
   * @param pos - Starting position.
   * @param dir - Direction to move.
   */
  neighbor(pos: Position, dir: Direction): Position | undefined {
    const offset = DIRECTION_OFFSETS[dir];
    const next: Position = {
      row: pos.row + offset.row,
      col: pos.col + offset.col,
    };
    return this.inBounds(next) ? next : undefined;
  }

  /**
   * Checks whether the wall in a given direction is present at a cell.
   * @param pos - The cell position.
   * @param dir - The wall direction to check.
   * @returns `true` if the wall blocks passage.
   */
  hasWall(pos: Position, dir: Direction): boolean {
    const cell = this.getCell(pos);
    return cell ? cell.walls[dir] : true;
  }

  /**
   * Removes the wall between two adjacent cells.
   * Both sides of the wall are removed.
   * @param pos - First cell position.
   * @param dir - Direction from the first cell toward the second.
   */
  removeWall(pos: Position, dir: Direction): void {
    const cell = this.getCell(pos);
    const neighborPos = this.neighbor(pos, dir);
    if (!cell || !neighborPos) return;
    const neighborCell = this.getCell(neighborPos);
    if (!neighborCell) return;

    cell.walls[dir] = false;
    neighborCell.walls[OPPOSITE_DIRECTION[dir]] = false;
  }

  /**
   * Returns all directions from a position where there is no wall (open passages).
   * @param pos - The cell to inspect.
   */
  openDirections(pos: Position): Direction[] {
    const cell = this.getCell(pos);
    if (!cell) return [];
    return Object.values(Direction).filter((dir) => !cell.walls[dir]);
  }

  /**
   * Checks if the given position is the maze exit.
   * @param pos - The position to test.
   */
  isExit(pos: Position): boolean {
    return pos.row === this.exit.row && pos.col === this.exit.col;
  }

  /**
   * Builds the initial grid with all walls intact.
   * @returns A 2D array of cells.
   */
  private buildGrid(): Cell[][] {
    const grid: Cell[][] = [];
    for (let r = 0; r < this.rows; r++) {
      const row: Cell[] = [];
      for (let c = 0; c < this.cols; c++) {
        row.push({
          row: r,
          col: c,
          walls: {
            [Direction.North]: true,
            [Direction.South]: true,
            [Direction.East]: true,
            [Direction.West]: true,
          },
        });
      }
      grid.push(row);
    }
    return grid;
  }
}
