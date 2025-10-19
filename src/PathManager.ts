import EasyStar from "easystarjs";
import { Graphics, Point } from "pixi.js";
import { TILE_SIZE } from "./constants";
import { CONFIG } from "./config";

export interface PathResult {
  path: Point[];
  graphics: Graphics;
}

export class PathManager {
  private easystar: EasyStar.js;
  private gridWidth: number;
  private gridHeight: number;

  constructor(collisionGrid: number[][]) {
    if (!collisionGrid || collisionGrid.length === 0) {
      throw new Error("Invalid collision grid");
    }

    this.gridHeight = collisionGrid.length;
    this.gridWidth = collisionGrid[0].length;

    this.easystar = new EasyStar.js();
    this.easystar.setGrid(collisionGrid);
    this.easystar.setAcceptableTiles([0]); // 0 is walkable
    this.easystar.enableDiagonals();
    this.easystar.disableCornerCutting();
  }

  public async findPath(
    startPoint: { x: number; y: number },
    endPoint: { x: number; y: number },
  ): Promise<Point[]> {
    // Validate points
    this.validatePoint(startPoint, "Start point");
    this.validatePoint(endPoint, "End point");

    return new Promise((resolve, reject) => {
      this.easystar.findPath(
        startPoint.x,
        startPoint.y,
        endPoint.x,
        endPoint.y,
        (path) => {
          if (path === null) {
            reject(new Error("No path found"));
          } else {
            // Convert to Point objects
            const pointPath = path.map((p) => new Point(p.x, p.y));
            resolve(pointPath);
          }
        },
      );
      this.easystar.calculate();
    });
  }

  public drawPath(path: Point[]): Graphics {
    if (!path || path.length === 0) {
      throw new Error("Cannot draw empty path");
    }

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

    pathGraphics.stroke({
      width: CONFIG.PATH_LINE_WIDTH,
      color: CONFIG.PATH_COLOR,
    });

    // Draw circles at each path point
    path.forEach((point) => {
      pathGraphics.circle(
        point.x * tileSize + tileSize / 2,
        point.y * tileSize + tileSize / 2,
        CONFIG.PATH_POINT_RADIUS,
      );
    });

    pathGraphics.fill(CONFIG.PATH_COLOR);

    return pathGraphics;
  }

  private validatePoint(point: { x: number; y: number }, name: string): void {
    if (
      point.x < 0 ||
      point.x >= this.gridWidth ||
      point.y < 0 ||
      point.y >= this.gridHeight
    ) {
      throw new Error(
        `${name} (${point.x}, ${point.y}) is out of bounds. ` +
          `Grid size: ${this.gridWidth}x${this.gridHeight}`,
      );
    }
  }
}
