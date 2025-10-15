import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import CountyNav from '../components/CountyNav';
import MonthlyChart from '../components/MonthlyChart';
import SeasonalityChart from '../components/SeasonalityChart';
import AnnualChart from '../components/AnnualChart';
import FeedbackButton from '../components/FeedbackButton';
import { loadCountyData, slugToCountyName } from '../utils/dataLoader';

export default function CountyPage() {
  const { countySlug } = useParams();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const countyName = slugToCountyName(countySlug);

  useEffect(() => {
    // Set page title and meta description dynamically
    document.title = `${countyName} County Births Data - California Birth Statistics (1960-2025)`;
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', `Explore ${countyName} County birth statistics from 1960-2025. Interactive charts showing monthly trends, annual births, and seasonality patterns from California Department of Public Health.`);
    }

    setLoading(true);
    setError(null);

    loadCountyData(countySlug)
      .then(data => {
        setData(data);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error loading county data:', error);
        setError(error.message);
        setLoading(false);
      });
  }, [countySlug, countyName]);

  if (loading) {
    return (
      <div className="container">
        <h1>{countyName} Births Data</h1>
        <p className="subtitle">Loading data...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container">
        <h1>{countyName} Births Data</h1>
        <p className="subtitle" style={{ color: 'red' }}>Error loading data: {error}</p>
        <CountyNav currentCounty={countyName} />
      </div>
    );
  }

  return (
    <div className="container">
      <script type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Dataset",
          "name": `${countyName} County Births Data`,
          "description": `Provisional and historical birth data for ${countyName} County, California from 1960-2025`,
          "url": `https://astromme.github.io/calbirths/county/${countySlug}`,
          "keywords": [countyName, "California", "births", "vital statistics", "demographic data", "birth trends", "county data"],
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
            "name": `${countyName} County, California`,
            "containedInPlace": {
              "@type": "Place",
              "name": "California"
            }
          }
        })}
      </script>
      <div className="page-header">
        <div className="page-header-content">
          <h1>{countyName} Births Data</h1>
          <p className="subtitle">Provisional and historical birth data from California Department of Public Health</p>
        </div>
        <FeedbackButton />
      </div>

      <MonthlyChart data={data} />
      <SeasonalityChart data={data} />
      <AnnualChart data={data} />

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
          Counts include births that occurred in {countyName} regardless of residence.
        </div>
        <CountyNav currentCounty={countyName} />
      </div>
    </div>
  );
}
