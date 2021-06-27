import { Coordinates } from '../types';

export const generateGrid = (
  { width, height }: { width: number; height: number },
  coordinates: Coordinates[],
) => {
  const grid: number[][] = [];

  for (let row = 0; row < width; row++) {
    grid[row] = [];
    for (let col = 0; col < height; col++) {
      grid[row].push(+coordinates.some((c) => c.row === row && c.col === col));
    }
  }

  return grid;
};
