import { Game } from "./Game";
import { GameScene } from "./scenes/GameScene";

async function main() {
  try {
    // Initialize game
    const game = new Game();
    await game.initialize();

    // Create and setup game scene
    const gameScene = new GameScene(game.getApp());
    await gameScene.setup();

    // Start game
    await game.start();

    console.log("Game started successfully");
  } catch (error) {
    console.error("Failed to start game:", error);
  }
}

main();
