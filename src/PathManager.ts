import EasyStar from "easystarjs";
import { Graphics, Point } from "pixi.js";
import { TILE_SIZE } from "./constants";

class PathManager {
  private easystar: EasyStar.js;

  constructor(collisionGrid: number[][]) {
    this.easystar = new EasyStar.js();
    this.easystar.setGrid(collisionGrid);
    this.easystar.setAcceptableTiles([0]); // 0 is walkable
    this.easystar.enableDiagonals();
    this.easystar.disableCornerCutting();
  }

  public findPath(
    startPoint: { x: number; y: number },
    endPoint: { x: number; y: number },
    onPathFound: (path: { x: number; y: number }[] | null) => void,
    onPathNotFound?: () => void,
  ) {
    this.easystar.findPath(
      startPoint.x,
      startPoint.y,
      endPoint.x,
      endPoint.y,
      (path) => {
        if (path === null) {
          if (onPathNotFound) {
            onPathNotFound();
          }
        } else {
          onPathFound(path);
        }
      },
    );
    this.easystar.calculate();
  }

  public drawPath(path: Array<Point>) {
    const pathGraphics = new Graphics();
    const tileSize = TILE_SIZE;
    // Draw lines connecting path points
    pathGraphics.moveTo(
      path[0].x * tileSize + tileSize / 2,
      path[0].y * tileSize + tileSize / 2,
    );

    for (let i = 1; i < path.length; i++) {
      pathGraphics.lineTo(
        path[i].x * tileSize + tileSize / 2,
        path[i].y * tileSize + tileSize / 2,
      );
    }

    pathGraphics.stroke({ width: 2, color: 0xffff00 });

    // Draw circles at each path point
    path.forEach((point) => {
      pathGraphics.circle(
        point.x * tileSize + tileSize / 2,
        point.y * tileSize + tileSize / 2,
        3,
      );
    });

    pathGraphics.fill(0xffff00);

    return pathGraphics;
  }
}

export { PathManager };
