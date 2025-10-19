export interface MapData {
  tileSize: number;
  mapWidth: number;
  mapHeight: number;
  layers: Array<{
    name: string;
    tiles: Array<{ id: string; x: number; y: number }>;
    collider: boolean;
  }>;
}
