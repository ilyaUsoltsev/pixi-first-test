import { Application, Point } from "pixi.js";
import { Entity } from "../entities/Entity";

export class EntityManager {
  private entities: Entity[] = [];

  constructor(private app: Application) {}

  createEntity(position: Point): Entity {
    const entity = new Entity(position, this.app.ticker);
    this.entities.push(entity);
    return entity;
  }

  getEntities(): Entity[] {
    return [...this.entities];
  }

  removeEntity(entity: Entity): void {
    const index = this.entities.indexOf(entity);
    if (index > -1) {
      this.entities.splice(index, 1);
      entity.destroy();
    }
  }

  clear(): void {
    this.entities.forEach((entity) => entity.destroy());
    this.entities = [];
  }

  update(deltaTime: number): void {
    // Future: Add update logic for all entities
    this.entities.forEach((entity) => {
      // Entity update logic can go here
    });
  }
}
