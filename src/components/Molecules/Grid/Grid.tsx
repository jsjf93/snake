import React, { useEffect, useReducer, useRef } from 'react';
import { Direction, Keys } from '../../../constants';
import { generateGrid, move } from '../../../helpers/gridHelpers';
import TileRow from './TileRow/TileRow';

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
  grid: number[][];
  direction: keyof typeof Keys;
};

const initialState: State = {
  coordinates: [
    { row: 0, col: 4 },
    { row: 0, col: 3 },
    { row: 0, col: 2 },
    { row: 0, col: 1 },
    { row: 0, col: 0 },
  ],
  grid: [],
  direction: 'right',
};

type Action =
  | { type: 'load'; payload: Props }
  | { type: Direction.up }
  | { type: Direction.down }
  | { type: Direction.left }
  | { type: Direction.right };

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case 'load': {
      return { ...state, grid: generateGrid(action.payload, state.coordinates) };
    }
    case 'up':
    case 'down':
    case 'left':
    case 'right': {
      const { coordinates, grid } = move(
        action.type,
        state.grid.length,
        state.grid[0].length,
        state.coordinates,
      );

      return { coordinates, grid, direction: action.type };
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

  const handleKeyPress = (event: React.KeyboardEvent) => {
    if (event.key === Keys.up && state.direction !== 'down') {
      dispatch({ type: Direction.up });
    }
    if (event.key === Keys.down && state.direction !== 'up') {
      dispatch({ type: Direction.down });
    }
    if (event.key === Keys.left && state.direction !== 'right') {
      dispatch({ type: Direction.left });
    }
    if (event.key === Keys.right && state.direction !== 'left') {
      dispatch({ type: Direction.right });
    }
  };

  return (
    <div ref={ref} tabIndex={0} onKeyDown={handleKeyPress}>
      {state.grid.map((tiles, index) => (
        <TileRow key={index} tiles={tiles} />
      ))}
    </div>
  );
}

export default Grid;
