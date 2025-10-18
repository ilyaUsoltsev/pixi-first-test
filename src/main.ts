import { Application, Assets, Sprite } from "pixi.js";
import { Character } from "./Character";

(async () => {
  // Create a new application
  const app = new Application();

  // Initialize the application
  await app.init({
    background: "#1099bb",
    resizeTo: window,
  });

  // Append the application canvas to the document body
  document.getElementById("pixi-container")!.appendChild(app.canvas);

  // Load the character spritesheet

  await Promise.all([
    Assets.load("/assets/character.json"),
    Assets.load("/assets/bunny.png"),
  ]);

  // Create the background sprite
  const backgroundTexture = await Assets.load("/assets/background.png");
  const background = new Sprite(backgroundTexture);
  background.eventMode = "static";
  background.cursor = "pointer";
  app.stage.addChild(background);

  // Array to hold all characters
  const characters: Character[] = [];
  const bunnies: Sprite[] = [];

  // Function to spawn a character
  function spawnCharacter() {
    const character = new Character(app);
    app.stage.addChild(character);
    characters.push(character);
  }

  async function spawnBunny(coordinates: { x: number; y: number }) {
    const bunnyTexture = await Assets.load("/assets/bunny.png");
    const bunny = new Sprite(bunnyTexture);
    bunny.x = coordinates.x;
    bunny.y = coordinates.y;
    app.stage.addChild(bunny);
    bunnies.push(bunny);
  }

  // Spawn initial characters
  for (let i = 0; i < 5; i++) {
    spawnCharacter();
  }

  // Spawn a new character every 2 seconds
  setInterval(() => {
    spawnCharacter();
  }, 2000);

  background.on("pointerdown", (event) => {
    console.log("Background clicked");
    const x = event.global.x;
    const y = event.global.y;
    spawnBunny({ x, y });
  });

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
