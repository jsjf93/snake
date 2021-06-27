import styled from 'styled-components';

type Props = {
  value: number;
};

const Wrapper = styled.div`
  width: 20px;
  height: 20px;
  border: 1px solid black;
  background-color: ${(props) => (props.className?.includes('snake') ? '#005e05' : '#ffffff')};
`;

function Tile({ value }: Props) {
  return <Wrapper data-testid="tile" className={value ? 'snake' : ''} />;
}

export default Tile;
