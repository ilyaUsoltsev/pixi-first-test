import { Sprite } from "pixi.js";
import { Character } from "./Character";

class CollisionManager {
  constructor() {}

  public checkCollisions(characters: Character[], bunnies: Sprite[]) {
    const collisions: { characters: Character[]; bunnies: Sprite[] } = {
      characters: [],
      bunnies: [],
    };

    characters.forEach((char) => {
      bunnies.forEach((bunny) => {
        if (this.isColliding(char, bunny)) {
          collisions.characters.push(char);
          collisions.bunnies.push(bunny);
        }
      });
    });

    return collisions;
  }

  private isColliding(a: Sprite, b: Sprite): boolean {
    const aBounds = a.getBounds();
    const bBounds = b.getBounds();
    return (
      aBounds.x < bBounds.x + bBounds.width &&
      aBounds.x + aBounds.width > bBounds.x &&
      aBounds.y < bBounds.y + bBounds.height &&
      aBounds.y + aBounds.height > bBounds.y
    );
  }
}

export { CollisionManager };
