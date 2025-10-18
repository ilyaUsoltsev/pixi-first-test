import { Application, Assets, AnimatedSprite } from "pixi.js";

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
  const characters: AnimatedSprite[] = [];

  // Function to spawn a character
  function spawnCharacter() {
    // Create an animated sprite from the walk animation
    const textures = Assets.cache.get("/assets/character.json").textures;
    const walkFrames = [
      textures["walk_02.png"],
      textures["walk_03.png"],
      textures["walk_04.png"],
      textures["walk_05.png"],
      textures["walk_07.png"],
      textures["walk_08.png"],
    ];

    const character = new AnimatedSprite(walkFrames);

    // Set anchor point to center
    character.anchor.set(0.5);

    // Scale down the character (650x650 is quite large)
    character.scale.set(0.15);

    // Position on the left side at a random height
    character.position.x = -50; // Start off-screen on the left
    character.position.y = Math.random() * app.screen.height;

    // Set animation speed and play
    character.animationSpeed = 0.15;
    character.play();

    // Add to stage and array
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
      character.position.x += 2 * time.deltaTime;

      // Remove character if it goes off-screen on the right
      if (character.position.x > app.screen.width + 50) {
        app.stage.removeChild(character);
        characters.splice(index, 1);
      }
    });
  });
})();
