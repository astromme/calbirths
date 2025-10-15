import { useEffect, useState } from 'react';
import CountyNav from '../components/CountyNav';
import MonthlyChart from '../components/MonthlyChart';
import SeasonalityChart from '../components/SeasonalityChart';
import AnnualChart from '../components/AnnualChart';
import SparklineGrid from '../components/SparklineGrid';
import FeedbackButton from '../components/FeedbackButton';
import { loadAggregateData } from '../utils/dataLoader';
import counties from '../../public/data/counties.json';

export default function HomePage() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Set page title and meta description
    document.title = 'California Births Data - Historical & Provisional Birth Statistics (1960-2025)';
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', 'Interactive visualization of California birth statistics from 1960-2025. Explore aggregate birth data across all 58 California counties with monthly trends, annual statistics, and seasonality patterns.');
    }

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
      <script type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Dataset",
          "name": "California Births Data - Aggregate Statistics",
          "description": "Aggregate provisional and historical birth data from California Department of Public Health covering all 58 California counties from 1960-2025",
          "url": "https://astromme.github.io/calbirths/",
          "keywords": ["California", "births", "vital statistics", "demographic data", "birth trends"],
          "creator": {
            "@type": "Organization",
            "name": "California Department of Public Health",
            "url": "https://data.chhs.ca.gov/"
          },
          "includedInDataCatalog": {
            "@type": "DataCatalog",
            "name": "California Health and Human Services Open Data Portal"
          },
          "temporalCoverage": "1960/2025",
          "spatialCoverage": {
            "@type": "Place",
            "name": "California"
          }
        })}
      </script>
      <div className="page-header">
        <div className="page-header-content">
          <h1>California Births Data</h1>
          <p className="subtitle">Aggregate provisional and historical birth data from California Department of Public Health</p>
        </div>
        <FeedbackButton />
      </div>

      <MonthlyChart data={data} />
      <SeasonalityChart data={data} />
      <AnnualChart data={data} />

      <SparklineGrid counties={counties} />

      <div className="data-source">
        <div className="data-source-text">
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
        <CountyNav currentCounty={null} />
      </div>
    </div>
  );
}
