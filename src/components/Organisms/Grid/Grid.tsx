import React, { useEffect, useReducer, useRef } from 'react';
import { Direction, Keys } from '../../../constants';
import { generateGrid, move, setTarget } from '../../../helpers/gridHelpers';
import TileRow from '../../Molecules/Grid/TileRow/TileRow';

type Props = {
  width: number;
  height: number;
};

type Coordinates = {
  row: number;
  col: number;
};

type State = {
  coordinates: Coordinates[];
  previousTailCoordinate: Coordinates;
  grid: number[][];
  direction: keyof typeof Keys;
  target: Coordinates;
  hasEnded: boolean;
};

const initialState: State = {
  coordinates: [
    { row: 0, col: 4 },
    { row: 0, col: 3 },
    { row: 0, col: 2 },
    { row: 0, col: 1 },
    { row: 0, col: 0 },
  ],
  previousTailCoordinate: { row: 0, col: 0 },
  grid: [],
  direction: 'right',
  target: { row: 10, col: 10 },
  hasEnded: false,
};

type Action =
  | { type: 'load'; payload: Props }
  | { type: 'up' }
  | { type: 'down' }
  | { type: 'left' }
  | { type: 'right' }
  | { type: 'move' }
  | { type: 'eat' }
  | { type: 'end' };

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case 'load': {
      const grid = generateGrid(action.payload, state.coordinates, state.target);
      return {
        ...state,
        ...setTarget(grid, state.coordinates),
      };
    }
    case 'up':
    case 'down':
    case 'left':
    case 'right': {
      return { ...state, direction: action.type };
    }
    case 'move': {
      const { coordinates, grid } = move(
        state.direction,
        state.grid.length,
        state.grid[0].length,
        state.coordinates,
        state.target,
      );

      const previousTailCoordinate = { ...state.coordinates[state.coordinates.length - 1] };

      return { ...state, coordinates, grid, previousTailCoordinate };
    }
    case 'eat': {
      return {
        ...state,
        coordinates: state.coordinates.concat(state.previousTailCoordinate),
        ...setTarget(state.grid, state.coordinates),
      };
    }
    case 'end': {
      return { ...state, hasEnded: true };
    }
    default: {
      throw new Error('[Grid] Action does not exist');
    }
  }
}

function Grid(props: Props) {
  const [state, dispatch] = useReducer(reducer, initialState);

  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    dispatch({ type: 'load', payload: props });
    ref?.current?.focus();
  }, [props]);

  useEffect(() => {
    if (!state.hasEnded) {
      const intervalId = setInterval(() => dispatch({ type: 'move' }), 100);
      return () => clearInterval(intervalId);
    }
  }, [state.hasEnded]);

  const handleKeyPress = (event: React.KeyboardEvent) => {
    if (event.key === Keys.up && state.direction !== 'down' && state.direction !== Direction.up) {
      dispatch({ type: Direction.up });
    }
    if (event.key === Keys.down && state.direction !== 'up' && state.direction !== Direction.down) {
      dispatch({ type: Direction.down });
    }
    if (
      event.key === Keys.left &&
      state.direction !== 'right' &&
      state.direction !== Direction.left
    ) {
      dispatch({ type: Direction.left });
    }
    if (
      event.key === Keys.right &&
      state.direction !== 'left' &&
      state.direction !== Direction.right
    ) {
      dispatch({ type: Direction.right });
    }
  };

  const head = state.coordinates[0];
  const tail = state.coordinates.slice(1);

  if (tail.some((x) => x.row === head.row && x.col === head.col && !state.hasEnded)) {
    dispatch({ type: 'end' });
  }

  if (
    state.coordinates[0].col === state.target.col &&
    state.coordinates[0].row === state.target.row &&
    !state.hasEnded
  ) {
    dispatch({ type: 'eat' });
  }

  return (
    <div ref={ref} tabIndex={0} onKeyDown={handleKeyPress}>
      {state.grid.map((tiles, index) => (
        <TileRow key={index} tiles={tiles} />
      ))}
    </div>
  );
}

export default Grid;
