import styled from 'styled-components';
import Tile from '../../../Atoms/Grid/Tile/Tile';

type Props = {
  tiles: number[];
};

const Wrapper = styled.div`
  display: flex;
`;

function TileRow({ tiles }: Props) {
  return (
    <Wrapper>
      {tiles.map((tile, index) => (
        <Tile key={index} value={tile} />
      ))}
    </Wrapper>
  );
}

export default TileRow;
