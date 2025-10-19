export const CONFIG = {
  // Display settings
  BACKGROUND_COLOR: "#1099bb",
  CONTAINER_ID: "pixi-container",

  // Asset paths
  ASSETS: {
    MAP: "/assets/map.json",
    SPRITESHEET: "/assets/spritesheet.png",
  },

  // Game settings
  DEFAULT_MOVE_SPEED: 5,

  // Path visualization
  PATH_COLOR: 0xffff00,
  PATH_LINE_WIDTH: 2,
  PATH_POINT_RADIUS: 3,
} as const;
