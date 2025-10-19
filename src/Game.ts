import { Application, Assets } from "pixi.js";
import { CONFIG } from "./config";

export class Game {
  private app: Application;
  private isInitialized = false;

  constructor() {
    this.app = new Application();
  }

  async initialize(): Promise<void> {
    try {
      // Load assets
      await this.loadAssets();

      // Initialize PixiJS application
      await this.app.init({
        background: CONFIG.BACKGROUND_COLOR,
        resizeTo: window,
      });

      // Attach canvas to DOM
      const container = document.getElementById(CONFIG.CONTAINER_ID);
      if (!container) {
        throw new Error(`Container with id "${CONFIG.CONTAINER_ID}" not found`);
      }
      container.appendChild(this.app.canvas);

      this.isInitialized = true;
    } catch (error) {
      console.error("Failed to initialize game:", error);
      throw error;
    }
  }

  private async loadAssets(): Promise<void> {
    try {
      await Promise.all([
        Assets.load(CONFIG.ASSETS.MAP),
        Assets.load(CONFIG.ASSETS.SPRITESHEET),
      ]);
    } catch (error) {
      console.error("Failed to load assets:", error);
      throw error;
    }
  }

  getApp(): Application {
    if (!this.isInitialized) {
      throw new Error("Game must be initialized before accessing app");
    }
    return this.app;
  }

  async start(): Promise<void> {
    if (!this.isInitialized) {
      throw new Error("Game must be initialized before starting");
    }
  }

  destroy(): void {
    this.app.destroy(true, { children: true, texture: true });
    this.isInitialized = false;
  }
}
