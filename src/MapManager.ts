import {
  Assets,
  Container,
  FederatedPointerEvent,
  Point,
  Rectangle,
  Sprite,
  Texture,
} from "pixi.js";
import { MapData } from "./types";
import { TILE_SIZE } from "./constants";
import { eventBus } from "./events/EventBus";

class MapManager {
  collisionGrid: number[][];
  mapData: MapData;
  spritesheet: Texture;
  tileSize: number = TILE_SIZE;
  mapContainer: Container;
  tileTextures: Map<string, Texture>;

  constructor() {
    this.mapData = Assets.cache.get("/assets/map.json");
    this.spritesheet = Assets.cache.get("/assets/spritesheet.png");
    this.mapContainer = new Container();
    this.tileTextures = this.createTileTextures();
    this.renderBaseLayer("Base", "3");
    this.renderBaseLayer("Collision", "4");
    this.collisionGrid = this.createCollisionGrid();
    this.mapContainer.interactive = true;
    this.mapContainer.on("pointerdown", this.clickOnMap.bind(this));
  }

  public getCollisionGrid(): number[][] {
    return this.collisionGrid;
  }

  public getMapContainer(): Container {
    return this.mapContainer;
  }

  public centerMapOnScreen(width: number, height: number): void {
    const mapWidth = this.mapData.mapWidth * this.tileSize;
    const mapHeight = this.mapData.mapHeight * this.tileSize;
    this.mapContainer.x = (width - mapWidth) / 2;
    this.mapContainer.y = (height - mapHeight) / 2;
  }

  public getStartEndPoints(): {
    startPoint: Point;
    endPoint: Point;
  } {
    const startPoint = this.findPoint("Start");
    const endPoint = this.findPoint("End");
    if (!startPoint || !endPoint) {
      throw new Error("Start or End point not found in map data");
    }
    return {
      startPoint: new Point(startPoint.x, startPoint.y),
      endPoint: new Point(endPoint.x, endPoint.y),
    };
  }

  private findPoint(layerName: string): Point | null {
    const layer = this.mapData.layers.find((l) => l.name === layerName);
    if (layer && layer.tiles.length > 0) {
      return new Point(layer.tiles[0].x, layer.tiles[0].y);
    }
    return null;
  }

  private createCollisionGrid(): number[][] {
    // Create a grid filled with walkable tiles (0)
    const grid: number[][] = [];
    for (let y = 0; y < this.mapData.mapHeight; y++) {
      grid[y] = new Array(this.mapData.mapWidth).fill(0);
    }

    // Mark collision tiles as non-walkable (1)
    const collisionLayer = this.mapData.layers.find(
      (layer) => layer.name === "Collision",
    );
    if (collisionLayer) {
      collisionLayer.tiles.forEach((tile) => {
        grid[tile.y][tile.x] = 1;
      });
    }

    return grid;
  }

  private createTileTextures(): Map<string, Texture> {
    const textures = new Map<string, Texture>();

    // Create textures for each tile ID (1-5)
    for (let i = 0; i < 5; i++) {
      const tileId = (i + 1).toString();
      const texture = new Texture({
        source: this.spritesheet.source,
        frame: new Rectangle(
          i * this.tileSize,
          0,
          this.tileSize,
          this.tileSize,
        ),
      });
      textures.set(tileId, texture);
    }
    return textures;
  }

  private renderBaseLayer(layerName: string, textureId: string): void {
    const baseLayer = this.mapData.layers.find(
      (layer) => layer.name === layerName,
    );
    if (!baseLayer) return;

    // Create a map for quick tile lookup
    const tileMap = new Map<string, string>();
    baseLayer.tiles.forEach((tile) => {
      tileMap.set(`${tile.x},${tile.y}`, tile.id);
    });

    // Render all tiles
    for (let y = 0; y < this.mapData.mapHeight; y++) {
      for (let x = 0; x < this.mapData.mapWidth; x++) {
        const tileId = tileMap.get(`${x},${y}`);
        if (tileId) {
          const texture = this.tileTextures.get(textureId);
          if (texture) {
            const sprite = new Sprite(texture);
            sprite.x = x * this.mapData.tileSize;
            sprite.y = y * this.mapData.tileSize;
            this.mapContainer.addChild(sprite);
          }
        }
      }
    }
  }

  private clickOnMap(event: FederatedPointerEvent): void {
    const localPos = event.currentTarget.toLocal(event.global);
    const tileX = Math.floor(localPos.x / this.tileSize);
    const tileY = Math.floor(localPos.y / this.tileSize);

    // Check if click is within map bounds
    if (
      tileX < 0 ||
      tileX >= this.mapData.mapWidth ||
      tileY < 0 ||
      tileY >= this.mapData.mapHeight
    ) {
      return;
    }

    // Check if tile already has a collision
    const existingTile = this.collisionGrid[tileY][tileX];
    if (existingTile) {
      console.log(`Tile (${tileX}, ${tileY}) already has collision`);
      return;
    }

    // Update the collision grid
    this.collisionGrid[tileY][tileX] = 1;

    // Render the collision sprite
    const texture = this.tileTextures.get("4");
    if (texture) {
      const sprite = new Sprite(texture);
      sprite.x = tileX * this.tileSize;
      sprite.y = tileY * this.tileSize;
      this.mapContainer.addChild(sprite);
    }

    console.log(`Added collision tile at: (${tileX}, ${tileY})`);

    // Emit event to notify other systems
    eventBus.emit("map:collisionAdded", { x: tileX, y: tileY });
  }
}

export { MapManager };
