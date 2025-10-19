import { Application, Point } from "pixi.js";
import { Sprite } from "../Sprite";

export class EntityManager {
  private entities: Sprite[] = [];

  constructor(private app: Application) {}

  createEntity(position: Point): Sprite {
    const entity = new Sprite(position, this.app);
    this.entities.push(entity);
    return entity;
  }

  getEntities(): Sprite[] {
    return [...this.entities];
  }

  removeEntity(entity: Sprite): void {
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
