import { Direction } from '../constants';
import { Coordinates } from '../types';

export const generateGrid = (
  { width, height }: { width: number; height: number },
  coordinates: Coordinates[],
  target: Coordinates,
) => {
  const grid: number[][] = [];

  for (let row = 0; row < width; row++) {
    grid[row] = [];
    for (let col = 0; col < height; col++) {
      if (target.row === row && target.col === col) {
        grid[row][col] = 2;
      } else {
        grid[row].push(+coordinates.some((c) => c.row === row && c.col === col));
      }
    }
  }

  return grid;
};

export const setTarget = (grid: number[][], coordinates: Coordinates[]) => {
  const newGrid = [...grid];

  let calculatingCoordinates: boolean = true;
  let targetCoordinates: Coordinates = { row: 0, col: 0 };

  while (calculatingCoordinates) {
    const row = ~~(Math.random() * newGrid.length);
    const col = ~~(Math.random() * newGrid[0].length);

    if (!coordinates.some((x) => x.row === row && x.col === col)) {
      calculatingCoordinates = false;
      newGrid[row][col] = 2;
      targetCoordinates = { row, col };
    }
  }

  return { grid: newGrid, target: targetCoordinates };
};

export const move = (
  direction: string,
  width: number,
  height: number,
  coordinates: Coordinates[],
  target: Coordinates,
) => {
  switch (direction) {
    case Direction.up:
      return moveUp(width, height, coordinates, target);
    case Direction.down:
      return moveDown(width, height, coordinates, target);
    case Direction.left:
      return moveLeft(width, height, coordinates, target);
    case Direction.right:
      return moveRight(width, height, coordinates, target);
    default:
      throw new Error(`[GridHelpers] invalid direction: ${direction}`);
  }
};

const moveUp = (width: number, height: number, coordinates: Coordinates[], target: Coordinates) => {
  const newCoordinates = [...coordinates].reduceRight((coords, cur, i, array) => {
    if (i !== 0) {
      return [array[i - 1]].concat(coords);
    }

    let row;
    if (cur.row - 1 < 0) row = height - 1;
    else row = cur.row - 1;

    return [{ ...cur, row }].concat(coords);
  }, [] as Coordinates[]);

  return {
    grid: generateGrid({ width, height }, newCoordinates, target),
    coordinates: newCoordinates,
  };
};

const moveDown = (
  width: number,
  height: number,
  coordinates: Coordinates[],
  target: Coordinates,
) => {
  const newCoordinates = [...coordinates].reduceRight((coords, cur, i, array) => {
    if (i !== 0) {
      return [array[i - 1]].concat(coords);
    }

    let row;
    if (cur.row + 1 === height) row = 0;
    else row = cur.row + 1;

    return [{ ...cur, row }].concat(coords);
  }, [] as Coordinates[]);

  return {
    grid: generateGrid({ width, height }, newCoordinates, target),
    coordinates: newCoordinates,
  };
};

const moveLeft = (
  width: number,
  height: number,
  coordinates: Coordinates[],
  target: Coordinates,
) => {
  const newCoordinates = [...coordinates].reduceRight((coords, cur, i, array) => {
    if (i !== 0) {
      return [array[i - 1]].concat(coords);
    }

    let col;
    if (cur.col - 1 < 0) col = width - 1;
    else col = cur.col - 1;

    return [{ ...cur, col }].concat(coords);
  }, [] as Coordinates[]);

  return {
    grid: generateGrid({ width, height }, newCoordinates, target),
    coordinates: newCoordinates,
  };
};

const moveRight = (
  width: number,
  height: number,
  coordinates: Coordinates[],
  target: Coordinates,
) => {
  const newCoordinates = [...coordinates].reduceRight((coords, cur, i, array) => {
    if (i !== 0) {
      return [array[i - 1]].concat(coords);
    }

    let col;
    if (cur.col + 1 === width) col = 0;
    else col = cur.col + 1;

    return [{ ...cur, col }].concat(coords);
  }, [] as Coordinates[]);

  return {
    grid: generateGrid({ width, height }, newCoordinates, target),
    coordinates: newCoordinates,
  };
};
