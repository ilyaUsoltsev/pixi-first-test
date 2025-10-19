import { Application, Assets, Sprite } from "pixi.js";

class BunniesManager {
  private bunnies: Sprite[] = [];
  private toRemove: Set<Sprite> = new Set<Sprite>();

  constructor(private app: Application) {}

  public async spawnBunny(coordinates: { x: number; y: number }) {
    const bunnyTexture = Assets.cache.get("/assets/bunny.png");
    const bunny = new Sprite(bunnyTexture);
    bunny.x = coordinates.x;
    bunny.y = coordinates.y;
    this.bunnies.push(bunny);
    this.app.stage.addChild(bunny);
  }

  public getBunnies(): Sprite[] {
    return this.bunnies;
  }

  public markForRemoval(bunniesToRemove: Sprite[]) {
    bunniesToRemove.forEach((bunny) => this.toRemove.add(bunny));
  }

  public processRemovals() {
    this.toRemove.forEach((bunny) => {
      const index = this.bunnies.indexOf(bunny);
      if (index !== -1) {
        this.bunnies.splice(index, 1);
        this.app.stage.removeChild(bunny);
        bunny.destroy();
      }
    });
    this.toRemove.clear();
  }
}
export { BunniesManager };
