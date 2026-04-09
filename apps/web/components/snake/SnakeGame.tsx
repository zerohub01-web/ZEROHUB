"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  createInitialSnakeGame,
  queueSnakeDirection,
  stepSnakeGame,
  toggleSnakePause,
  type GridPoint,
  type SnakeDirection
} from "../../lib/snake";

const GAME_CONFIG = {
  gridSize: 16,
  initialLength: 3
} as const;

const TICK_MS = 130;

const KEY_TO_DIRECTION: Record<string, SnakeDirection> = {
  ArrowUp: "up",
  ArrowDown: "down",
  ArrowLeft: "left",
  ArrowRight: "right",
  w: "up",
  W: "up",
  s: "down",
  S: "down",
  a: "left",
  A: "left",
  d: "right",
  D: "right"
};

function toKey(point: GridPoint): string {
  return `${point.x},${point.y}`;
}

function ControlButton({
  onClick,
  label,
  ariaLabel
}: {
  onClick: () => void;
  label: string;
  ariaLabel: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={ariaLabel}
      className="rounded-lg border border-black/15 bg-white/85 px-4 py-2 text-lg font-semibold text-[var(--ink)] active:scale-95"
    >
      {label}
    </button>
  );
}

export function SnakeGame() {
  const [gameState, setGameState] = useState(() => createInitialSnakeGame(GAME_CONFIG));

  const handleDirection = useCallback((direction: SnakeDirection) => {
    setGameState((current) => queueSnakeDirection(current, direction));
  }, []);

  const handlePauseToggle = useCallback(() => {
    setGameState((current) => toggleSnakePause(current));
  }, []);

  const handleRestart = useCallback(() => {
    setGameState(createInitialSnakeGame(GAME_CONFIG));
  }, []);

  useEffect(() => {
    if (gameState.status !== "running") {
      return;
    }

    const timerId = window.setInterval(() => {
      setGameState((current) => stepSnakeGame(current, GAME_CONFIG));
    }, TICK_MS);

    return () => {
      window.clearInterval(timerId);
    };
  }, [gameState.status]);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      const direction = KEY_TO_DIRECTION[event.key];
      if (direction) {
        event.preventDefault();
        handleDirection(direction);
        return;
      }

      if (event.key === " " || event.key === "Spacebar") {
        event.preventDefault();
        handlePauseToggle();
        return;
      }

      if (event.key.toLowerCase() === "r") {
        event.preventDefault();
        handleRestart();
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [handleDirection, handlePauseToggle, handleRestart]);

  const headKey = gameState.snake.length > 0 ? toKey(gameState.snake[0]) : "";

  const snakeBody = useMemo(() => {
    const body = new Set<string>();
    gameState.snake.slice(1).forEach((point) => {
      body.add(toKey(point));
    });
    return body;
  }, [gameState.snake]);

  const foodKey = gameState.food ? toKey(gameState.food) : "";

  const gridCells = useMemo(() => {
    const cells: JSX.Element[] = [];
    for (let y = 0; y < GAME_CONFIG.gridSize; y += 1) {
      for (let x = 0; x < GAME_CONFIG.gridSize; x += 1) {
        const key = `${x},${y}`;
        const isHead = key === headKey;
        const isBody = snakeBody.has(key);
        const isFood = key === foodKey;

        let className = "h-full w-full rounded-[2px] border border-black/5 bg-white/70";
        if (isBody) {
          className = "h-full w-full rounded-[2px] border border-cyan-900/20 bg-cyan-700/80";
        }
        if (isHead) {
          className = "h-full w-full rounded-[2px] border border-cyan-950/40 bg-cyan-950";
        }
        if (isFood) {
          className = "h-full w-full rounded-[2px] border border-rose-700/40 bg-rose-500";
        }

        cells.push(<div key={key} className={className} />);
      }
    }
    return cells;
  }, [foodKey, headKey, snakeBody]);

  const statusText =
    gameState.status === "running"
      ? "Running"
      : gameState.status === "paused"
        ? "Paused"
        : "Game Over";

  return (
    <section className="soft-card p-5 md:p-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-xs uppercase tracking-[0.16em] text-[var(--muted)]">Classic Snake</p>
        <div className="flex items-center gap-2 text-sm">
          <span className="rounded-full border border-black/10 bg-white/75 px-3 py-1">
            Score: <strong>{gameState.score}</strong>
          </span>
          <span className="rounded-full border border-black/10 bg-white/75 px-3 py-1">{statusText}</span>
        </div>
      </div>

      <div className="mt-4 w-full max-w-[460px] mx-auto">
        <div
          className="grid aspect-square rounded-xl border border-black/15 bg-white/60 p-2"
          style={{ gridTemplateColumns: `repeat(${GAME_CONFIG.gridSize}, minmax(0, 1fr))`, gap: "2px" }}
        >
          {gridCells}
        </div>
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        <button
          type="button"
          onClick={handlePauseToggle}
          className="btn-secondary rounded-full px-4 py-2 text-sm"
          disabled={gameState.status === "gameOver"}
        >
          {gameState.status === "paused" ? "Resume" : "Pause"}
        </button>
        <button type="button" onClick={handleRestart} className="btn-primary rounded-full px-4 py-2 text-sm">
          Restart
        </button>
      </div>

      <p className="mt-3 text-sm text-[var(--muted)]">
        Keyboard: Arrow keys or WASD. Press <strong>Space</strong> to pause/resume, <strong>R</strong> to restart.
      </p>

      <div className="mt-5 md:hidden">
        <p className="text-xs uppercase tracking-[0.16em] text-[var(--muted)]">Touch Controls</p>
        <div className="mt-2 mx-auto grid w-44 grid-cols-3 gap-2">
          <span />
          <ControlButton onClick={() => handleDirection("up")} label="U" ariaLabel="Move up" />
          <span />
          <ControlButton onClick={() => handleDirection("left")} label="L" ariaLabel="Move left" />
          <ControlButton onClick={() => handleDirection("down")} label="D" ariaLabel="Move down" />
          <ControlButton onClick={() => handleDirection("right")} label="R" ariaLabel="Move right" />
        </div>
      </div>

      {gameState.status === "gameOver" ? (
        <p className="mt-4 text-sm font-semibold text-rose-700">Game over. Press Restart or R to play again.</p>
      ) : null}
    </section>
  );
}

