import { Application, Graphics, Point } from "pixi.js";
import { TILE_SIZE } from "./constants";

class Sprite extends Graphics {
  private movingPath: Array<Point> = [];

  constructor(
    private startPoint: Point,
    private app: Application,
  ) {
    super();
    this.rect(-TILE_SIZE / 4, -TILE_SIZE / 4, TILE_SIZE / 2, TILE_SIZE / 2);
    this.fill(0xff0000); // Red square
    this.x = this.startPoint.x * TILE_SIZE + TILE_SIZE / 2;
    this.y = this.startPoint.y * TILE_SIZE + TILE_SIZE / 2;
  }

  public setPath(path: Array<Point>) {
    this.movingPath = path;
  }

  public getPath(): Array<Point> {
    return this.movingPath;
  }

  move(speed: number = 2) {
    let currentIndex = 0;
    this.app.ticker.add(() => {
      if (currentIndex >= this.movingPath.length - 1) return;

      const next = this.movingPath[currentIndex + 1];
      const targetX = next.x * TILE_SIZE + TILE_SIZE / 2;
      const targetY = next.y * TILE_SIZE + TILE_SIZE / 2;

      const dx = targetX - this.x;
      const dy = targetY - this.y;
      const distance = Math.sqrt(dx * dx + dy * dy);

      if (distance < speed) {
        this.x = targetX;
        this.y = targetY;
        currentIndex++;
      } else {
        this.x += (dx / distance) * speed;
        this.y += (dy / distance) * speed;
      }
    });
  }
}

export { Sprite };
