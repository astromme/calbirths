import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';

export default function CountyNav({ currentCounty }) {
  const [counties, setCounties] = useState([]);

  useEffect(() => {
    fetch(`${import.meta.env.BASE_URL}data/counties.json`)
      .then(response => response.json())
      .then(data => setCounties(data))
      .catch(error => console.error('Error loading counties:', error));
  }, []);

  const getCountySlug = (county) => {
    return county.toLowerCase().replace(/ /g, '-');
  };

  return (
    <div className="county-nav">
      <Link to="/">All Counties</Link>
      <div className="county-list">
        {counties.map((county) => (
          <span key={county}>
            <Link
              to={`/county/${getCountySlug(county)}`}
              style={{ fontWeight: currentCounty === county ? 'bold' : 'normal' }}
            >
              {county}
            </Link>
          </span>
        ))}
      </div>
    </div>
  );
}
