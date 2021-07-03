import styled from 'styled-components';

type Props = {
  value: number;
};

const Wrapper = styled.div`
  width: 20px;
  height: 20px;
  border: 1px solid black;
  background-color: ${(props) => {
    if (props.className?.includes('1')) return '#005e05';
    else if (props.className?.includes('2')) return '#f1d900';
    else return '#ffffff';
  }};
`;

function Tile({ value }: Props) {
  return <Wrapper data-testid="tile" className={`cell-${value}`} />;
}

export default Tile;
