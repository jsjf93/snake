import { render, screen } from '@testing-library/react';
import Grid from './Grid';

describe('The Grid component', () => {
  const cases: number[][] = [
    [10, 10, 100],
    [5, 200, 1000],
  ];

  it.each(cases)('Should render correctly', (width, height, expected) => {
    render(<Grid width={width} height={height} />);

    const tiles = screen.queryAllByTestId('tile');

    expect(tiles.length).toBe(expected);
  });
});
