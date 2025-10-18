import { Application, Assets } from "pixi.js";
import { Character } from "./Character";

(async () => {
  // Create a new application
  const app = new Application();

  // Initialize the application
  await app.init({ background: "#1099bb", resizeTo: window });

  // Append the application canvas to the document body
  document.getElementById("pixi-container")!.appendChild(app.canvas);

  // Load the character spritesheet
  await Assets.load("/assets/character.json");

  // Array to hold all characters
  const characters: Character[] = [];

  // Function to spawn a character
  function spawnCharacter() {
    const character = new Character(app);
    app.stage.addChild(character);
    characters.push(character);
  }

  // Spawn initial characters
  for (let i = 0; i < 5; i++) {
    spawnCharacter();
  }

  // Spawn a new character every 2 seconds
  setInterval(() => {
    spawnCharacter();
  }, 2000);

  // Listen for animate update
  app.ticker.add((time) => {
    // Move all characters to the right
    characters.forEach((character, index) => {
      character.updatePosition(time);
      // Remove character if it goes off-screen on the right
      if (character.isOffScreen(app.screen.width)) {
        app.stage.removeChild(character);
        characters.splice(index, 1);
      }
    });
  });
})();
