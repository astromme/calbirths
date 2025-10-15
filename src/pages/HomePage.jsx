import { useEffect, useState } from 'react';
import CountyNav from '../components/CountyNav';
import MonthlyChart from '../components/MonthlyChart';
import AnnualChart from '../components/AnnualChart';
import { loadAggregateData } from '../utils/dataLoader';

export default function HomePage() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadAggregateData()
      .then(data => {
        setData(data);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error loading aggregate data:', error);
        setError(error.message);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="container">
        <h1>California Births Data</h1>
        <p className="subtitle">Loading data...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container">
        <h1>California Births Data</h1>
        <p className="subtitle" style={{ color: 'red' }}>Error loading data: {error}</p>
      </div>
    );
  }

  return (
    <div className="container">
      <h1>California Births Data</h1>
      <p className="subtitle">Aggregate provisional and historical birth data from California Department of Public Health</p>

      <CountyNav currentCounty={null} />

      <MonthlyChart data={data} />
      <AnnualChart data={data} />

      <div className="data-source">
        <strong>Data Source:</strong>{' '}
        <a
          href="https://data.chhs.ca.gov/dataset/live-birth-profiles-by-county"
          target="_blank"
          rel="noopener noreferrer"
        >
          California Department of Public Health, Center for Health Statistics and Informatics, Vital Statistics Branch
        </a>.
        <br />
        <strong>Note:</strong> Provisional counts are based on records available as of August 2025 and may not represent all births that occurred during the time period.
        This aggregate view shows total births across all California counties.
      </div>
    </div>
  );
}
