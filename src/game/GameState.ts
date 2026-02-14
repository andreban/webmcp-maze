/**
 * Interface for game states in the state machine.
 * Each state handles its own setup, teardown, and per-frame logic.
 */
export interface GameState {
  /** Called when the state becomes active. Set up visuals, register tools, etc. */
  enter(): void;

  /** Called when the state is being replaced. Clean up visuals, unregister tools, etc. */
  exit(): void;

  /**
   * Called once per frame while this state is active.
   * @param dt - Delta time in seconds since the last frame.
   */
  update(dt: number): void;
}
