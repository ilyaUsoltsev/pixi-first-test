import { Application, Point } from "pixi.js";
import { MapManager } from "../MapManager";
import { PathManager } from "../PathManager";
import { EntityManager } from "../managers/EntityManager";
import { CONFIG } from "../config";
import { Entity } from "../entities/Entity";

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

  private async moveEntityAlongPath(
    entity: Entity,
    start: Point,
    end: Point,
  ): Promise<void> {
    try {
      // Find the path using Promise-based API
      const path = await this.pathManager.findPath(start, end);

      // Draw the path
      const pathGraphics = this.pathManager.drawPath(path);
      this.mapManager.getMapContainer().addChild(pathGraphics);

      // Animate the entity along the path
      entity.setPath(path);
      entity.move(CONFIG.DEFAULT_MOVE_SPEED);
    } catch (error) {
      console.error("Failed to move entity along path:", error);
      throw error;
    }
  }

  update(deltaTime: number): void {
    this.entityManager.update(deltaTime);
  }

  destroy(): void {
    this.entityManager.clear();
    this.mapManager.getMapContainer().destroy({ children: true });
  }
}
