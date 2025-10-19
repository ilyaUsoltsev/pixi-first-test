import { Application, Assets, Point } from "pixi.js";
import { MapManager } from "./MapManager";
import { SpriteManager } from "./SpriteManager";
import { PathManager } from "./PathManager";

async function preloadAssets() {
  await Promise.all([
    Assets.load("/assets/map.json"),
    Assets.load("/assets/spritesheet.png"),
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

  const mapManager = new MapManager();
  const spriteManager = new SpriteManager(app);
  const pathManager = new PathManager(mapManager.getCollisionGrid());

  // Append map container to the stage
  app.stage.addChild(mapManager.getMapContainer());
  mapManager.centerMapOnScreen(app.screen.width, app.screen.height);

  // Find start and end points
  const { startPoint, endPoint } = mapManager.getStartEndPoints();

  // Create a sprite at the start point
  const square = spriteManager.createSprite(startPoint);
  mapManager.getMapContainer().addChild(square);

  pathManager.findPath(
    startPoint,
    endPoint,
    (path) => {
      const pointsPath = path?.map((p) => new Point(p.x, p.y)) || [];
      if (pointsPath) {
        // Draw the path
        const pathGraphics = pathManager.drawPath(pointsPath);
        mapManager.getMapContainer().addChild(pathGraphics);

        // Animate the square along the path
        square.setPath(pointsPath);
        square.move(5);
      }
    },
    () => {
      console.log("Path not found");
    },
  );
})();
