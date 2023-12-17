// Character movement
const JUMP_HEIGHT = 3;
const GRAVITY = 0.25;
const SPEED = 2;
const ROPE_CLIMBING_SPEED = 2;

const FRAME_RATE = 60;

const FACING_LEFT = -1;
const FACING_RIGHT = 1;

// Canvas scale factor
const SCALE = 2;

// Blocks
const TILE_SIZE = 16;
const COLLISION_BLOCK = 22016;
const SPAWNABLE_BLOCK = 22017;
const ROPE_BLOCK = 22018;
const ROPE_BLOCK_TOP = 22019;
const ROPE_BLOCK_END = 22020;
const ENEMY_JUMP_BLOCK = 22022;

// Default map size
const MAP_WIDTH = 2640;
const MAP_HEIGHT = 2096;

// Chest
const DEFAULT_CHEST_COST = 25;
const CHEST_COUNT = 10;

// Game
const PLAYER_FACTOR = 1;
const TIME_FACTOR = 0.1012;

// Enemies/Director
const TOTAL_POSSIBLE_ENEMIES = 15;
const MAX_ENEMIES_SPAWN = 2;
const SPAWN_INTERVAL = 25000;

// Teleporter
const TELEPORTER_WIDTH = 48;
const TELEPORTER_HEIGHT = 26;
const CHARGE_TIME = 90;
