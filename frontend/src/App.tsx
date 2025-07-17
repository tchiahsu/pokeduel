import { Routes, Route } from 'react-router-dom'
import Home from './pages/Home';
import TeamSelect from './pages/TeamSelect';
import Battle from './pages/Battle';
import Result from './pages/Result';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/team" element={<TeamSelect />} />
      <Route path="/battle" element={<Battle />} />
      <Route path="/result" element={<Result />} />
    </Routes>
  );
}

export default App
