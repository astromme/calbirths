import { BrowserRouter, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import CountyPage from './pages/CountyPage';
import './styles/App.css';

function App() {
  return (
    <BrowserRouter basename={import.meta.env.BASE_URL}>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/county/:countySlug" element={<CountyPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
