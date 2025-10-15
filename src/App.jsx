import { BrowserRouter, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import CountyPage from './pages/CountyPage';
import { usePageTracking } from './hooks/usePageTracking';
import './styles/App.css';

function AppRoutes() {
  usePageTracking();

  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/county/:countySlug" element={<CountyPage />} />
    </Routes>
  );
}

function App() {
  return (
    <BrowserRouter basename={import.meta.env.BASE_URL}>
      <AppRoutes />
    </BrowserRouter>
  );
}

export default App;
