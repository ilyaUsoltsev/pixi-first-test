import { AnimatedSprite, Assets, Ticker } from "pixi.js";

export class Character extends AnimatedSprite {
  private speed: number = 2;

  constructor(height: number) {
    const textures = Assets.cache.get("/assets/character.json").textures;
    const walkFrames = [
      textures["walk_02.png"],
      textures["walk_03.png"],
      textures["walk_04.png"],
      textures["walk_05.png"],
      textures["walk_07.png"],
      textures["walk_08.png"],
    ];

    super(walkFrames);
    this.init(height);
    this.speed = 1 + Math.random(); // Random speed between 1 and 2
  }

  public init(height: number): void {
    this.anchor.set(0.5);
    this.scale.set(0.15);
    this.position.x = -50; // Start off-screen on the left
    this.position.y = Math.random() * height;
    this.animationSpeed = 0.15;
    this.play();
  }

  public updatePosition(ticker: Ticker): void {
    this.position.x += this.speed * ticker.deltaTime;
  }

  public isOffScreen(screenWidth: number): boolean {
    return this.position.x > screenWidth + 50;
  }

  public setSpeed(speed: number): void {
    this.speed = speed;
  }

  public getSpeed(): number {
    return this.speed;
  }

  public getBounds() {
    return super.getBounds();
  }
}
