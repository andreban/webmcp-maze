import "./style.css";
import { Game } from "./game/Game.ts";
import { Renderer } from "./rendering/Renderer.ts";
import { AudioManager } from "./audio/AudioManager.ts";
import { McpToolRegistry } from "./mcp/McpToolRegistry.ts";
import { IntroState } from "./game/states/IntroState.ts";

/**
 * Application entry point.
 * Initializes all subsystems and starts the game in the intro state.
 */
async function main(): Promise<void> {
  const appContainer = document.getElementById("app")!;

  const game = new Game();

  // Initialize renderer
  const renderer = new Renderer();
  await renderer.init(appContainer);
  game.renderer = renderer;

  // Initialize audio
  const audio = new AudioManager();
  audio.init();
  game.audio = audio;

  // Initialize MCP tool registry
  const mcpRegistry = new McpToolRegistry(game);
  game.mcpRegistry = mcpRegistry;

  // Start the game loop
  renderer.onTick((dt) => game.update(dt));

  // Enter intro state
  game.setState(new IntroState(game));
}

main().catch(console.error);
