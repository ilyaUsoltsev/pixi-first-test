import { Application, Sprite, Assets } from "pixi.js";

export function addBackground(app: Application) {
  const backgroundTexture = Assets.cache.get("/assets/background.png");
  const background = new Sprite(backgroundTexture);
  background.eventMode = "static";
  background.cursor = "pointer";
  app.stage.addChild(background);
  return background;
}
