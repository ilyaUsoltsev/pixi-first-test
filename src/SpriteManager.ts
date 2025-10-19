import { Application, Point } from "pixi.js";
import { Sprite } from "./Sprite";

class SpriteManager {
  constructor(private app: Application) {}

  public createSprite(startPoint: Point): Sprite {
    return new Sprite(startPoint, this.app);
  }
}

export { SpriteManager };
