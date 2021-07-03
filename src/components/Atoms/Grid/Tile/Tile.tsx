import styled from 'styled-components';
import { useWindowSize } from '../../../../hooks/useWindowSize';

type Props = {
  value: number;
};

const Wrapper = styled.div`
  width: ${(props) => (props.className?.includes('small') ? '15px' : '20px')};
  height: ${(props) => (props.className?.includes('small') ? '15px' : '20px')};
  border: 1px solid black;
  background-color: ${(props) => {
    if (props.className?.includes('1')) return '#005e05';
    else if (props.className?.includes('2')) return '#f1d900';
    else return '#ffffff';
  }};
`;

function Tile({ value }: Props) {
  const size = useWindowSize();
  const isSmallScreen = size?.width || 0 < 410;

  return <Wrapper data-testid="tile" className={`cell-${value} ${isSmallScreen ? 'small' : ''}`} />;
}

export default Tile;
