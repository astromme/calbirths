import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';

export default function CountyNav({ currentCounty }) {
  const [counties, setCounties] = useState([]);

  useEffect(() => {
    fetch('/calbirths/data/counties.json')
      .then(response => response.json())
      .then(data => setCounties(data))
      .catch(error => console.error('Error loading counties:', error));
  }, []);

  const getCountySlug = (county) => {
    return county.toLowerCase().replace(/ /g, '-');
  };

  return (
    <div className="county-nav">
      <Link to="/calbirths/">All Counties</Link>
      <div className="county-list">
        {counties.map((county) => (
          <span key={county}>
            <Link
              to={`/calbirths/county/${getCountySlug(county)}`}
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
