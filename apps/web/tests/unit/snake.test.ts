import { describe, expect, test } from "vitest";
import {
  createInitialSnakeGame,
  queueSnakeDirection,
  spawnFoodPosition,
  stepSnakeGame,
  type SnakeGameState
} from "../../lib/snake";

describe("snake game logic", () => {
  test("moves one tile per tick and applies queued direction", () => {
    const base = createInitialSnakeGame({ gridSize: 8, initialLength: 3 }, () => 0.2);
    const queued = queueSnakeDirection(base, "up");
    const next = stepSnakeGame(queued, { gridSize: 8, initialLength: 3 }, () => 0.2);

    expect(next.snake[0]).toEqual({ x: base.snake[0].x, y: base.snake[0].y - 1 });
    expect(next.direction).toBe("up");
  });

  test("ignores opposite direction reversal", () => {
    const base = createInitialSnakeGame({ gridSize: 8, initialLength: 3 }, () => 0.2);
    const blocked = queueSnakeDirection(base, "left");
    const next = stepSnakeGame(blocked, { gridSize: 8, initialLength: 3 }, () => 0.2);

    expect(next.snake[0]).toEqual({ x: base.snake[0].x + 1, y: base.snake[0].y });
    expect(next.direction).toBe("right");
  });

  test("grows snake and increments score when food is eaten", () => {
    const running: SnakeGameState = {
      snake: [
        { x: 2, y: 2 },
        { x: 1, y: 2 },
        { x: 0, y: 2 }
      ],
      direction: "right",
      queuedDirection: "right",
      food: { x: 3, y: 2 },
      score: 0,
      status: "running"
    };

    const next = stepSnakeGame(running, { gridSize: 5, initialLength: 3 }, () => 0);

    expect(next.snake).toHaveLength(4);
    expect(next.score).toBe(1);
    expect(next.snake[0]).toEqual({ x: 3, y: 2 });
    expect(next.food).toEqual({ x: 0, y: 0 });
  });

  test("marks game over on wall or self collisions", () => {
    const wallState: SnakeGameState = {
      snake: [
        { x: 4, y: 2 },
        { x: 3, y: 2 },
        { x: 2, y: 2 }
      ],
      direction: "right",
      queuedDirection: "right",
      food: { x: 0, y: 0 },
      score: 0,
      status: "running"
    };

    const selfState: SnakeGameState = {
      snake: [
        { x: 2, y: 2 },
        { x: 2, y: 3 },
        { x: 1, y: 3 },
        { x: 1, y: 2 },
        { x: 1, y: 1 },
        { x: 2, y: 1 },
        { x: 3, y: 1 },
        { x: 3, y: 2 }
      ],
      direction: "up",
      queuedDirection: "up",
      food: { x: 0, y: 0 },
      score: 6,
      status: "running"
    };

    expect(stepSnakeGame(wallState, { gridSize: 5, initialLength: 3 }, () => 0.1).status).toBe("gameOver");
    expect(stepSnakeGame(selfState, { gridSize: 5, initialLength: 3 }, () => 0.1).status).toBe("gameOver");
  });

  test("spawns food only in free cells", () => {
    const snake = [
      { x: 0, y: 0 },
      { x: 1, y: 0 },
      { x: 2, y: 0 },
      { x: 0, y: 1 },
      { x: 1, y: 1 },
      { x: 2, y: 1 },
      { x: 0, y: 2 },
      { x: 1, y: 2 }
    ];

    expect(spawnFoodPosition(3, snake, () => 0.99)).toEqual({ x: 2, y: 2 });
    expect(
      spawnFoodPosition(
        2,
        [
          { x: 0, y: 0 },
          { x: 1, y: 0 },
          { x: 0, y: 1 },
          { x: 1, y: 1 }
        ],
        () => 0.4
      )
    ).toBeNull();
  });
});
