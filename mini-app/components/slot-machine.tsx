"use client";

import { useState } from "react";
import { Share } from "@/components/share";
import { url } from "@/lib/metadata";
import { Button } from "@/components/ui/button";

const fruits = ["apple", "banana", "cherry", "lemon"] as const;
type Fruit = typeof fruits[number];

const createRandomGrid = (): Fruit[][] => {
  const grid: Fruit[][] = [];
  for (let i = 0; i < 3; i++) {
    const row: Fruit[] = [];
    for (let j = 0; j < 3; j++) {
      row.push(fruits[Math.floor(Math.random() * fruits.length)]);
    }
    grid.push(row);
  }
  return grid;
};

export default function SlotMachine() {
  const [grid, setGrid] = useState<Fruit[][]>(createRandomGrid());
  const [spinning, setSpinning] = useState(false);

  const spin = () => {
    if (spinning) return;
    setSpinning(true);
    const interval = setInterval(() => {
      setGrid((prev) => {
        const newGrid = prev.map((row) => [...row]);
        // shift rows down
        newGrid[2] = newGrid[1];
        newGrid[1] = newGrid[0];
        // new top row
        newGrid[0] = Array.from({ length: 3 }, () =>
          fruits[Math.floor(Math.random() * fruits.length)]
        );
        return newGrid;
      });
    }, 200);

    setTimeout(() => {
      clearInterval(interval);
      setSpinning(false);
    }, 2000);
  };

  // Check win condition directly in render
  const win =
    !spinning &&
    (grid.some(
      (row) => row[0] === row[1] && row[1] === row[2]
    ) ||
      [0, 1, 2].some((col) =>
        grid[0][col] === grid[1][col] && grid[1][col] === grid[2][col]
      ));

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="grid grid-cols-3 gap-2">
        {grid.flat().map((fruit, idx) => (
          <img
            key={idx}
            src={`/${fruit}.png`}
            alt={fruit}
            className="w-16 h-16 object-contain"
          />
        ))}
      </div>
      <Button onClick={spin} disabled={spinning} variant="outline">
        {spinning ? "Spinning…" : "Spin"}
      </Button>
      {win && (
        <div className="flex flex-col items-center gap-2">
          <span className="text-xl font-semibold text-green-600">
            You win!
          </span>
          <Share text={`I just hit a win on the Fruit Slot Machine! ${url}`} />
        </div>
      )}
    </div>
  );
}
