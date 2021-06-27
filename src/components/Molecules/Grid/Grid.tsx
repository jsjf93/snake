import React, { useEffect, useReducer, useRef } from 'react';
import { Keys } from '../../../constants';
import { generateGrid } from '../../../helpers/generateGrid';
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
};

const initialState: State = {
  coordinates: [{ row: 0, col: 0 }],
  grid: [],
};

type Action =
  | { type: 'load'; payload: Props }
  | { type: 'up' }
  | { type: 'down' }
  | { type: 'left' }
  | { type: 'right' };

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case 'load': {
      return { ...state, grid: generateGrid(action.payload, state.coordinates) };
    }
    case 'up': {
      return state;
    }
    case 'down': {
      return state;
    }
    case 'left': {
      return state;
    }
    case 'right': {
      const coordinates = [...state.coordinates].reduceRight((coords, cur, i, array) => {
        if (i !== 0) {
          return coords.concat(array[i - 1]);
        }

        return coords.concat({ ...cur, col: cur.col + 1 });
      }, [] as Coordinates[]);

      const width = state.grid.length;
      const height = state.grid[0].length;
      const grid = generateGrid({ width, height }, coordinates);

      return { coordinates, grid };
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
    event.preventDefault();

    if (event.key === Keys.up) {
      dispatch({ type: 'up' });
    }
    if (event.key === Keys.down) {
      dispatch({ type: 'down' });
    }
    if (event.key === Keys.left) {
      dispatch({ type: 'left' });
    }
    if (event.key === Keys.right) {
      dispatch({ type: 'right' });
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
