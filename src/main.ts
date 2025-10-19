import { Application, Assets } from "pixi.js";

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
})();
