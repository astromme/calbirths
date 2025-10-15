import { BrowserRouter, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import CountyPage from './pages/CountyPage';
import './styles/App.css';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/calbirths/" element={<HomePage />} />
        <Route path="/calbirths/county/:countySlug" element={<CountyPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
