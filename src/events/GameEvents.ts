import { Point } from "pixi.js";

/**
 * Central event definitions for game-wide communication
 */
export interface GameEvents {
  // Map events
  "map:collisionAdded": { x: number; y: number };
  "map:collisionRemoved": { x: number; y: number };

  // Path events
  "path:recalculated": { path: Point[] };
  "path:blocked": { reason: string };

  // Entity events
  "entity:reachedEnd": { entityId: string };
  "entity:destroyed": { entityId: string };
}

export type GameEventName = keyof GameEvents;
export type GameEventPayload<T extends GameEventName> = GameEvents[T];
