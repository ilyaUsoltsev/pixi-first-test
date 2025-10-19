import { Application, Point } from "pixi.js";
import { MapManager } from "../MapManager";
import { PathManager } from "../PathManager";
import { EntityManager } from "../managers/EntityManager";
import { CONFIG } from "../config";
import { Sprite } from "../Sprite";

export class GameScene {
  private mapManager: MapManager;
  private pathManager: PathManager;
  private entityManager: EntityManager;

  constructor(private app: Application) {
    this.mapManager = new MapManager();
    this.pathManager = new PathManager(this.mapManager.getCollisionGrid());
    this.entityManager = new EntityManager(app);
  }

  async setup(): Promise<void> {
    try {
      this.setupMap();
      await this.startGame();
    } catch (error) {
      console.error("Failed to setup game scene:", error);
      throw error;
    }
  }

  private setupMap(): void {
    // Add map to stage
    this.app.stage.addChild(this.mapManager.getMapContainer());

    // Center map on screen
    this.mapManager.centerMapOnScreen(
      this.app.screen.width,
      this.app.screen.height,
    );
  }

  private async startGame(): Promise<void> {
    const { startPoint, endPoint } = this.mapManager.getStartEndPoints();

    // Create an entity at start point
    const entity = this.entityManager.createEntity(startPoint);
    this.mapManager.getMapContainer().addChild(entity);

    // Find path and animate entity
    await this.moveEntityAlongPath(entity, startPoint, endPoint);
  }

  private moveEntityAlongPath(
    entity: Sprite,
    start: Point,
    end: Point,
  ): Promise<void> {
    return new Promise((resolve, reject) => {
      this.pathManager.findPath(
        start,
        end,
        (path) => {
          if (!path || path.length === 0) {
            reject(new Error("No path found"));
            return;
          }

          const pointsPath = path.map((p) => new Point(p.x, p.y));

          // Draw the path
          const pathGraphics = this.pathManager.drawPath(pointsPath);
          this.mapManager.getMapContainer().addChild(pathGraphics);

          // Animate the entity along the path
          entity.setPath(pointsPath);
          entity.move(CONFIG.DEFAULT_MOVE_SPEED);

          resolve();
        },
        () => {
          reject(new Error("Pathfinding failed"));
        },
      );
    });
  }

  update(deltaTime: number): void {
    this.entityManager.update(deltaTime);
  }

  destroy(): void {
    this.entityManager.clear();
    this.mapManager.getMapContainer().destroy({ children: true });
  }
}
