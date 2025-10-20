import { GameEventName, GameEventPayload } from "./GameEvents";

type EventHandler<T extends GameEventName> = (
  payload: GameEventPayload<T>,
) => void;

/**
 * Centralized event bus for game-wide communication
 * Provides type-safe pub/sub pattern for decoupled architecture
 */
export class EventBus {
  private static instance: EventBus;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private handlers: Map<GameEventName, Set<EventHandler<any>>> = new Map();

  private constructor() {}

  /**
   * Get singleton instance of EventBus
   */
  public static getInstance(): EventBus {
    if (!EventBus.instance) {
      EventBus.instance = new EventBus();
    }
    return EventBus.instance;
  }

  /**
   * Subscribe to an event
   * @param event Event name to listen for
   * @param handler Callback function to execute when event fires
   * @returns Unsubscribe function
   */
  public on<T extends GameEventName>(
    event: T,
    handler: EventHandler<T>,
  ): () => void {
    if (!this.handlers.has(event)) {
      this.handlers.set(event, new Set());
    }

    this.handlers.get(event)!.add(handler);

    // Return unsubscribe function
    return () => {
      this.off(event, handler);
    };
  }

  /**
   * Subscribe to an event that will only fire once
   * @param event Event name to listen for
   * @param handler Callback function to execute when event fires
   */
  public once<T extends GameEventName>(
    event: T,
    handler: EventHandler<T>,
  ): void {
    const onceHandler = (payload: GameEventPayload<T>) => {
      handler(payload);
      this.off(event, onceHandler);
    };
    this.on(event, onceHandler);
  }

  /**
   * Unsubscribe from an event
   * @param event Event name to stop listening for
   * @param handler Handler function to remove
   */
  public off<T extends GameEventName>(
    event: T,
    handler: EventHandler<T>,
  ): void {
    const handlers = this.handlers.get(event);
    if (handlers) {
      handlers.delete(handler);
      if (handlers.size === 0) {
        this.handlers.delete(event);
      }
    }
  }

  /**
   * Emit an event to all subscribers
   * @param event Event name to emit
   * @param payload Event payload data
   */
  public emit<T extends GameEventName>(
    event: T,
    payload: GameEventPayload<T>,
  ): void {
    const handlers = this.handlers.get(event);
    if (handlers) {
      handlers.forEach((handler) => handler(payload));
    }
  }

  /**
   * Remove all event listeners
   */
  public clear(): void {
    this.handlers.clear();
  }

  /**
   * Remove all listeners for a specific event
   * @param event Event name to clear
   */
  public clearEvent(event: GameEventName): void {
    this.handlers.delete(event);
  }

  /**
   * Check if an event has any listeners
   * @param event Event name to check
   */
  public hasListeners(event: GameEventName): boolean {
    const handlers = this.handlers.get(event);
    return handlers ? handlers.size > 0 : false;
  }

  /**
   * Get number of listeners for an event
   * @param event Event name to check
   */
  public listenerCount(event: GameEventName): number {
    const handlers = this.handlers.get(event);
    return handlers ? handlers.size : 0;
  }
}

// Export singleton instance
export const eventBus = EventBus.getInstance();
