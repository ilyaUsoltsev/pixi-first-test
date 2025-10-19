import { Application, Assets } from "pixi.js";
import { addBackground } from "./addBackground";
import { CharacterManager } from "./CharacterManager";
import { BunniesManager } from "./BunniesManager";
import { CollisionManager } from "./CollisionManager";

async function preloadAssets() {
  await Promise.all([
    Assets.load("/assets/character.json"),
    Assets.load("/assets/background.png"),
    Assets.load("/assets/bunny.png"),
  ]);
}

async function initApp() {
  const app = new Application();

  await app.init({
    background: "#1099bb",
    resizeTo: window,
  });

  document.getElementById("pixi-container")!.appendChild(app.canvas);
  return app;
}

(async () => {
  await preloadAssets();
  const app = await initApp();
  const background = addBackground(app);

  const characterManager = new CharacterManager(app);
  const bunniesManager = new BunniesManager(app);

  characterManager.startSpawning();

  background.on("pointerdown", (event) => {
    const x = event.global.x;
    const y = event.global.y;
    bunniesManager.spawnBunny({ x, y });
  });

  const collisionManager = new CollisionManager();

  app.ticker.add((time) => {
    const { characters, bunnies } = collisionManager.checkCollisions(
      characterManager.getCharacters(),
      bunniesManager.getBunnies(),
    );
    bunniesManager.markForRemoval(bunnies);
    characterManager.markForRemoval(characters);

    characterManager.updateAll(time);

    characterManager.processRemovals();
    bunniesManager.processRemovals();
  });
})();
