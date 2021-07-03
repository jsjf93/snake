import { useCallback, useEffect, useReducer } from 'react';
import { useSwipeable } from 'react-swipeable';
import styled from 'styled-components';
import { Direction, Keys } from '../../../constants';
import { generateGrid, move, setTarget } from '../../../helpers/gridHelpers';
import { Coordinates } from '../../../types';
import TileRow from '../../Molecules/Grid/TileRow/TileRow';

const Wrapper = styled.div`
  text-align: center;
`;

type Props = {
  width: number;
  height: number;
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
      const coordinates = state.coordinates.concat(state.previousTailCoordinate);

      return {
        ...state,
        coordinates,
        ...setTarget(state.grid, coordinates),
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

  const handleKeyPress = useCallback(
    (event: KeyboardEvent) => {
      if (event.key === Keys.up && state.direction !== 'down' && state.direction !== Direction.up) {
        dispatch({ type: Direction.up });
      } else if (
        event.key === Keys.down &&
        state.direction !== 'up' &&
        state.direction !== Direction.down
      ) {
        dispatch({ type: Direction.down });
      } else if (
        event.key === Keys.left &&
        state.direction !== 'right' &&
        state.direction !== Direction.left
      ) {
        dispatch({ type: Direction.left });
      } else if (
        event.key === Keys.right &&
        state.direction !== 'left' &&
        state.direction !== Direction.right
      ) {
        dispatch({ type: Direction.right });
      }
    },
    [state.direction],
  );

  useEffect(() => {
    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [handleKeyPress]);

  useEffect(() => {
    dispatch({ type: 'load', payload: props });
  }, [props]);

  useEffect(() => {
    if (!state.hasEnded) {
      const intervalId = setInterval(() => dispatch({ type: 'move' }), 100);
      return () => clearInterval(intervalId);
    }
  }, [state.hasEnded]);

  const gestureHandlers = useSwipeable({
    onSwipedUp: (eventData) => {
      if (state.direction !== 'down' && state.direction !== Direction.up) {
        dispatch({ type: Direction.up });
      }
    },
    onSwipedDown: (eventData) => {
      if (state.direction !== 'up' && state.direction !== Direction.down) {
        dispatch({ type: Direction.down });
      }
    },
    onSwipedLeft: (eventData) => {
      if (state.direction !== 'right' && state.direction !== Direction.left) {
        dispatch({ type: Direction.left });
      }
    },
    onSwipedRight: (eventData) => {
      if (state.direction !== 'left' && state.direction !== Direction.right) {
        dispatch({ type: Direction.right });
      }
    },
  });

  const head = state.coordinates[0];
  const tail = state.coordinates.slice(1);

  if (
    state.coordinates[0].col === state.target.col &&
    state.coordinates[0].row === state.target.row &&
    !state.hasEnded
  ) {
    dispatch({ type: 'eat' });
  } else if (tail.some((x) => x.row === head.row && x.col === head.col && !state.hasEnded)) {
    dispatch({ type: 'end' });
  }

  return (
    <Wrapper {...gestureHandlers}>
      {state.grid.map((tiles, index) => (
        <TileRow key={index} tiles={tiles} />
      ))}
      {<p>Score: {state.coordinates.length - 5}</p>}
      {state.hasEnded && <p>Game over</p>}
    </Wrapper>
  );
}

export default Grid;
