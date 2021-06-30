import { Container } from 'react-bootstrap';
import Grid from './components/Organisms/Grid/Grid';

function App() {
  return (
    <div className="App">
      <main>
        <Container>
          <Grid width={20} height={20} />
        </Container>
      </main>
    </div>
  );
}

export default App;
