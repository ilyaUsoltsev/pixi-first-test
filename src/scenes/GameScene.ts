import { Application, Graphics, Point } from "pixi.js";
import { MapManager } from "../MapManager";
import { PathManager } from "../PathManager";
import { EntityManager } from "../managers/EntityManager";
import { CONFIG } from "../config";
import { Entity } from "../entities/Entity";
import { eventBus } from "../events/EventBus";

export class GameScene {
  private mapManager: MapManager;
  private pathManager: PathManager;
  private entityManager: EntityManager;
  private currentPathGraphics: Graphics | null = null;
  private currentEntity: Entity | null = null;
  private endPoint: Point | null = null;

  constructor(private app: Application) {
    this.mapManager = new MapManager();
    this.pathManager = new PathManager(this.mapManager.getCollisionGrid());
    this.entityManager = new EntityManager(app);
    this.setupEventListeners();
  }

  private setupEventListeners(): void {
    eventBus.on("map:collisionAdded", async () => {
      await this.recalculateCurrentPath();
    });
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

    // Store end point for future recalculations
    this.endPoint = endPoint;

    // Create an entity at start point
    this.currentEntity = this.entityManager.createEntity(startPoint);
    this.mapManager.getMapContainer().addChild(this.currentEntity);

    // Find path and animate entity
    await this.calculateAndDrawPath(this.currentEntity, startPoint, endPoint);
  }

  private async recalculateCurrentPath(): Promise<void> {
    if (!this.currentEntity || !this.endPoint) {
      console.warn("Cannot recalculate path: missing entity or end point");
      return;
    }

    try {
      // Remove old path graphics
      if (this.currentPathGraphics) {
        this.mapManager.getMapContainer().removeChild(this.currentPathGraphics);
        this.currentPathGraphics.destroy();
      }

      // Get entity's current position (in grid coordinates)
      const currentPos = new Point(
        Math.floor(this.currentEntity.x / this.mapManager.tileSize),
        Math.floor(this.currentEntity.y / this.mapManager.tileSize),
      );

      // Calculate new path from current position
      await this.calculateAndDrawPath(
        this.currentEntity,
        currentPos,
        this.endPoint,
      );

      console.log("Path recalculated successfully");
    } catch (error) {
      console.error("Failed to recalculate path:", error);
    }
  }

  private async calculateAndDrawPath(
    entity: Entity,
    start: Point,
    end: Point,
  ): Promise<void> {
    try {
      // Find the path using Promise-based API
      const path = await this.pathManager.findPath(start, end);

      // Draw the path
      this.currentPathGraphics = this.pathManager.drawPath(path);
      this.mapManager.getMapContainer().addChild(this.currentPathGraphics);

      // Animate the entity along the path
      entity.setPath(path);
      entity.move(CONFIG.DEFAULT_MOVE_SPEED);
    } catch (error) {
      console.error("Failed to calculate and draw path:", error);
      throw error;
    }
  }

  update(deltaTime: number): void {
    this.entityManager.update(deltaTime);
  }

  destroy(): void {
    this.pathManager.destroy();
    this.entityManager.clear();
    this.mapManager.getMapContainer().destroy({ children: true });
  }
}
