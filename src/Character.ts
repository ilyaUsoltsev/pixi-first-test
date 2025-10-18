import { AnimatedSprite, Assets, Texture } from "pixi.js";

export class Character extends AnimatedSprite {
  private speed: number = 2;

  constructor(screenHeight: number) {
    // Load walk animation textures
    const textures = Assets.cache.get("/assets/character.json").textures;
    const walkFrames: Texture[] = [
      textures["walk_02.png"],
      textures["walk_03.png"],
      textures["walk_04.png"],
      textures["walk_05.png"],
      textures["walk_07.png"],
      textures["walk_08.png"],
    ];

    super(walkFrames);

    // Set anchor point to center
    this.anchor.set(0.5);

    // Scale down the character (650x650 is quite large)
    this.scale.set(0.15);

    // Position on the left side at a random height
    this.position.x = -50; // Start off-screen on the left
    this.position.y = Math.random() * screenHeight;

    // Set animation speed and play
    this.animationSpeed = 0.15;
    this.play();
  }

  /**
   * Update the character's position
   * @param deltaTime - The time delta from the ticker
   */
  public update(deltaTime: number): void {
    this.position.x += this.speed * deltaTime;
  }

  /**
   * Check if the character is off-screen to the right
   * @param screenWidth - The width of the screen
   * @returns true if the character is off-screen
   */
  public isOffScreen(screenWidth: number): boolean {
    return this.position.x > screenWidth + 50;
  }

  /**
   * Set the movement speed of the character
   * @param speed - The new speed value
   */
  public setSpeed(speed: number): void {
    this.speed = speed;
  }

  /**
   * Get the current movement speed
   * @returns The current speed value
   */
  public getSpeed(): number {
    return this.speed;
  }
}
