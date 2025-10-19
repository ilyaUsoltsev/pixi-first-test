import { Application, Ticker } from "pixi.js";
import { Character } from "./Character";

class CharacterManager {
  private toRemove: Set<Character> = new Set<Character>();
  private app: Application;
  private characters: Character[] = [];
  private spawnInterval: number = 200; // Spawn every 2 seconds
  private intervalId: number | undefined;

  constructor(app: Application) {
    this.app = app;
  }

  public startSpawning() {
    this.intervalId = window.setInterval(() => {
      this.spawnCharacter();
    }, this.spawnInterval);
  }

  public stopSpawning() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
  }

  public getCharacters(): Character[] {
    return this.characters;
  }

  public markForRemoval(charactersToRemove: Character[]) {
    charactersToRemove.forEach((character) => this.toRemove.add(character));
  }

  public processRemovals() {
    this.toRemove.forEach((character) => {
      const index = this.characters.indexOf(character);
      if (index !== -1) {
        this.characters.splice(index, 1);
        this.app.stage.removeChild(character);
        character.destroy();
      }
    });
    this.toRemove.clear();
  }
  public updateAll(ticker: Ticker) {
    this.characters.forEach((character, idx) => {
      character.updatePosition(ticker);
      if (character.isOffScreen(this.app.screen.width)) {
        this.app.stage.removeChild(character);
        this.characters.splice(idx, 1);
        character.destroy();
      }
    });
  }

  private spawnCharacter() {
    const character = new Character(this.app.screen.height);
    this.app.stage.addChild(character);
    this.characters.push(character);
  }
}
export { CharacterManager };
