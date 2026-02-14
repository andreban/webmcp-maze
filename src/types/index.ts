/** Cardinal directions for maze navigation. */
export enum Direction {
  North = "north",
  South = "south",
  East = "east",
  West = "west",
}

/** A row/column coordinate in the maze grid. */
export interface Position {
  row: number;
  col: number;
}

/** A single cell in the maze grid, tracking which walls are present. */
export interface Cell {
  row: number;
  col: number;
  /** `true` means the wall in that direction is intact (blocking). */
  walls: Record<Direction, boolean>;
}

/** Identifiers for each state in the game state machine. */
export enum GameStateType {
  Intro = "intro",
  Gameplay = "gameplay",
  GameOver = "gameover",
}

/** Size of one maze cell in pixels. */
export const CELL_SIZE = 48;

/** Thickness of maze walls in pixels. */
export const WALL_THICKNESS = 4;

/** Default maze dimensions. */
export const MAZE_DEFAULT_ROWS = 10;

/** Default maze column count. */
export const MAZE_DEFAULT_COLS = 10;

/** Duration of the player move animation in milliseconds. */
export const MOVE_ANIM_DURATION = 220;

/** Row/col deltas for each cardinal direction. */
export const DIRECTION_OFFSETS: Record<Direction, Position> = {
  [Direction.North]: { row: -1, col: 0 },
  [Direction.South]: { row: 1, col: 0 },
  [Direction.East]: { row: 0, col: 1 },
  [Direction.West]: { row: 0, col: -1 },
};

/** Maps each direction to its opposite. */
export const OPPOSITE_DIRECTION: Record<Direction, Direction> = {
  [Direction.North]: Direction.South,
  [Direction.South]: Direction.North,
  [Direction.East]: Direction.West,
  [Direction.West]: Direction.East,
};
