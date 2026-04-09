export type SnakeDirection = "up" | "down" | "left" | "right";

export type SnakeGameStatus = "running" | "paused" | "gameOver";

export interface GridPoint {
  x: number;
  y: number;
}

export interface SnakeGameConfig {
  gridSize: number;
  initialLength: number;
}

export interface SnakeGameState {
  snake: GridPoint[];
  direction: SnakeDirection;
  queuedDirection: SnakeDirection;
  food: GridPoint | null;
  score: number;
  status: SnakeGameStatus;
}

const DEFAULT_GRID_SIZE = 16;
const DEFAULT_INITIAL_LENGTH = 3;

const DIRECTION_VECTORS: Record<SnakeDirection, GridPoint> = {
  up: { x: 0, y: -1 },
  down: { x: 0, y: 1 },
  left: { x: -1, y: 0 },
  right: { x: 1, y: 0 }
};

function clampToInteger(value: number, minimum: number, maximum: number): number {
  return Math.min(maximum, Math.max(minimum, Math.floor(value)));
}

function normalizeConfig(config?: Partial<SnakeGameConfig>): SnakeGameConfig {
  const gridSize = clampToInteger(config?.gridSize ?? DEFAULT_GRID_SIZE, 4, 64);
  const initialLength = clampToInteger(config?.initialLength ?? DEFAULT_INITIAL_LENGTH, 2, gridSize);
  return { gridSize, initialLength };
}

function pointKey(point: GridPoint): string {
  return `${point.x},${point.y}`;
}

function pointsEqual(a: GridPoint, b: GridPoint): boolean {
  return a.x === b.x && a.y === b.y;
}

function isOutOfBounds(point: GridPoint, gridSize: number): boolean {
  return point.x < 0 || point.y < 0 || point.x >= gridSize || point.y >= gridSize;
}

function isOppositeDirection(current: SnakeDirection, next: SnakeDirection): boolean {
  return (
    (current === "up" && next === "down") ||
    (current === "down" && next === "up") ||
    (current === "left" && next === "right") ||
    (current === "right" && next === "left")
  );
}

function movePoint(point: GridPoint, direction: SnakeDirection): GridPoint {
  const offset = DIRECTION_VECTORS[direction];
  return { x: point.x + offset.x, y: point.y + offset.y };
}

function buildInitialSnake(config: SnakeGameConfig): GridPoint[] {
  const centerY = Math.floor(config.gridSize / 2);
  const headX = Math.min(config.gridSize - 1, Math.max(config.initialLength - 1, Math.floor(config.gridSize / 2)));
  const snake: GridPoint[] = [];

  for (let index = 0; index < config.initialLength; index += 1) {
    snake.push({ x: headX - index, y: centerY });
  }

  return snake;
}

export function spawnFoodPosition(gridSize: number, snake: GridPoint[], randomFn: () => number = Math.random): GridPoint | null {
  const occupied = new Set<string>(snake.map(pointKey));
  const freeCells: GridPoint[] = [];

  for (let y = 0; y < gridSize; y += 1) {
    for (let x = 0; x < gridSize; x += 1) {
      const candidate = { x, y };
      if (!occupied.has(pointKey(candidate))) {
        freeCells.push(candidate);
      }
    }
  }

  if (freeCells.length === 0) {
    return null;
  }

  const index = clampToInteger(randomFn() * freeCells.length, 0, freeCells.length - 1);
  return freeCells[index];
}

export function createInitialSnakeGame(config?: Partial<SnakeGameConfig>, randomFn: () => number = Math.random): SnakeGameState {
  const safeConfig = normalizeConfig(config);
  const snake = buildInitialSnake(safeConfig);

  return {
    snake,
    direction: "right",
    queuedDirection: "right",
    food: spawnFoodPosition(safeConfig.gridSize, snake, randomFn),
    score: 0,
    status: "running"
  };
}

export function queueSnakeDirection(state: SnakeGameState, nextDirection: SnakeDirection): SnakeGameState {
  if (state.status !== "running") {
    return state;
  }

  if (isOppositeDirection(state.direction, nextDirection)) {
    return state;
  }

  return {
    ...state,
    queuedDirection: nextDirection
  };
}

export function toggleSnakePause(state: SnakeGameState): SnakeGameState {
  if (state.status === "gameOver") {
    return state;
  }

  return {
    ...state,
    status: state.status === "paused" ? "running" : "paused"
  };
}

export function stepSnakeGame(
  state: SnakeGameState,
  config?: Partial<SnakeGameConfig>,
  randomFn: () => number = Math.random
): SnakeGameState {
  if (state.status !== "running") {
    return state;
  }

  const safeConfig = normalizeConfig(config);
  const nextDirection = state.queuedDirection;
  const currentHead = state.snake[0];
  const nextHead = movePoint(currentHead, nextDirection);

  if (isOutOfBounds(nextHead, safeConfig.gridSize)) {
    return {
      ...state,
      direction: nextDirection,
      queuedDirection: nextDirection,
      status: "gameOver"
    };
  }

  const willGrow = state.food !== null && pointsEqual(nextHead, state.food);
  const collisionTarget = willGrow ? state.snake : state.snake.slice(0, -1);
  const collidedWithBody = collisionTarget.some((segment) => pointsEqual(segment, nextHead));

  if (collidedWithBody) {
    return {
      ...state,
      direction: nextDirection,
      queuedDirection: nextDirection,
      status: "gameOver"
    };
  }

  const movedSnake = willGrow
    ? [nextHead, ...state.snake]
    : [nextHead, ...state.snake.slice(0, state.snake.length - 1)];

  if (!willGrow) {
    return {
      ...state,
      snake: movedSnake,
      direction: nextDirection,
      queuedDirection: nextDirection
    };
  }

  const nextFood = spawnFoodPosition(safeConfig.gridSize, movedSnake, randomFn);

  return {
    ...state,
    snake: movedSnake,
    direction: nextDirection,
    queuedDirection: nextDirection,
    food: nextFood,
    score: state.score + 1,
    status: nextFood ? "running" : "gameOver"
  };
}
