import { Howl } from "howler";

/**
 * Identifiers for sound effects used in the game.
 * Each maps to an audio file loaded at initialization.
 */
export enum SoundId {
  Move = "move",
  Blocked = "blocked",
  Win = "win",
}

/**
 * Wraps Howler.js to provide a simple interface for playing sound effects.
 * Sounds are lazy-loaded on first play to avoid blocking startup.
 */
export class AudioManager {
  /** Map of sound ID to Howl instance. */
  private sounds: Map<string, Howl> = new Map();

  /**
   * Preloads all game sounds. Call once during initialization.
   * Audio files are expected in `public/audio/`.
   */
  init(): void {
    this.register(SoundId.Move, "/audio/move.mp3");
    this.register(SoundId.Blocked, "/audio/blocked.mp3");
    this.register(SoundId.Win, "/audio/win.mp3");
  }

  /**
   * Plays a sound by its identifier.
   * Silently does nothing if the sound hasn't been registered.
   * @param id - The sound to play.
   */
  play(id: SoundId): void {
    this.sounds.get(id)?.play();
  }

  /**
   * Registers a sound file under the given identifier.
   * @param id - Unique identifier for this sound.
   * @param src - Path to the audio file (relative to public root).
   */
  private register(id: string, src: string): void {
    this.sounds.set(
      id,
      new Howl({
        src: [src],
        preload: true,
        volume: 0.5,
      }),
    );
  }
}
