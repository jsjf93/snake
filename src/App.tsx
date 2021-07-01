import { Container } from 'react-bootstrap';
import styled from 'styled-components';
import Grid from './components/Organisms/Grid/Grid';

const Wrapper = styled(Container)`
  display: flex;
  justify-content: center;
`;

function App() {
  return (
    <div className="App">
      <main>
        <Wrapper>
          <Grid width={20} height={20} />
        </Wrapper>
      </main>
    </div>
  );
}

export default App;
