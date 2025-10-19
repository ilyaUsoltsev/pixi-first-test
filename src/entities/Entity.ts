import {
  DestroyOptions,
  Graphics,
  Point,
  Ticker,
  TickerCallback,
} from "pixi.js";
import { TILE_SIZE } from "../constants";

export class Entity extends Graphics {
  private movingPath: Point[] = [];
  private currentPathIndex: number = 0;
  private moveSpeed: number = 0;
  private tickerCallback: TickerCallback<Ticker> | null = null;

  constructor(
    private startPoint: Point,
    private ticker: Ticker,
  ) {
    super();
    this.rect(-TILE_SIZE / 4, -TILE_SIZE / 4, TILE_SIZE / 2, TILE_SIZE / 2);
    this.fill(0xff0000); // Red square
    this.x = this.startPoint.x * TILE_SIZE + TILE_SIZE / 2;
    this.y = this.startPoint.y * TILE_SIZE + TILE_SIZE / 2;
  }

  public setPath(path: Point[]): void {
    if (!path || path.length === 0) {
      throw new Error("Path cannot be empty");
    }
    this.movingPath = path;
    this.currentPathIndex = 0;
  }

  public getPath(): Point[] {
    return [...this.movingPath];
  }

  public move(speed: number = 2): void {
    if (this.tickerCallback) {
      console.warn("Entity is already moving");
      return;
    }

    if (this.movingPath.length === 0) {
      throw new Error("Cannot move: no path set");
    }

    this.moveSpeed = speed;
    this.currentPathIndex = 0;

    this.tickerCallback = () => {
      this.updateMovement();
    };

    this.ticker.add(this.tickerCallback);
  }

  public stopMovement(): void {
    if (this.tickerCallback) {
      this.ticker.remove(this.tickerCallback);
      this.tickerCallback = null;
    }
  }

  public isMoving(): boolean {
    return this.tickerCallback !== null;
  }

  private updateMovement(): void {
    if (this.currentPathIndex >= this.movingPath.length - 1) {
      this.stopMovement();
      this.onReachedDestination();
      return;
    }

    const next = this.movingPath[this.currentPathIndex + 1];
    const targetX = next.x * TILE_SIZE + TILE_SIZE / 2;
    const targetY = next.y * TILE_SIZE + TILE_SIZE / 2;

    const dx = targetX - this.x;
    const dy = targetY - this.y;
    const distance = Math.sqrt(dx * dx + dy * dy);

    if (distance < this.moveSpeed) {
      this.x = targetX;
      this.y = targetY;
      this.currentPathIndex++;
    } else {
      this.x += (dx / distance) * this.moveSpeed;
      this.y += (dy / distance) * this.moveSpeed;
    }
  }

  protected onReachedDestination(): void {
    // Override in subclasses if needed
    console.log("Entity reached destination");
  }

  public override destroy(options?: DestroyOptions): void {
    this.stopMovement();
    super.destroy(options);
  }
}
