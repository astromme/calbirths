import { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import { Link } from 'react-router-dom';
import { loadCountyData } from '../utils/dataLoader';

function countyNameToSlug(countyName) {
  return countyName.toLowerCase().replace(/\s+/g, '-');
}

function SparklineCard({ countyName }) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const slug = countyNameToSlug(countyName);
    loadCountyData(slug)
      .then(countyData => {
        setData(countyData);
        setLoading(false);
      })
      .catch(error => {
        console.error(`Error loading data for ${countyName}:`, error);
        setLoading(false);
      });
  }, [countyName]);

  if (loading) {
    return (
      <Link to={`${import.meta.env.BASE_URL}county/${countyNameToSlug(countyName)}`} className="sparkline-card">
        <div className="sparkline-header">
          <h3>{countyName}</h3>
        </div>
        <div className="sparkline-loading">Loading...</div>
      </Link>
    );
  }

  // Aggregate data by year to create annual totals
  const annualData = {};
  data.forEach(record => {
    if (!annualData[record.year]) {
      annualData[record.year] = 0;
    }
    annualData[record.year] += record.count;
  });

  // Filter out incomplete years (2025 and beyond)
  const years = Object.keys(annualData)
    .map(y => parseInt(y))
    .filter(year => year <= 2024)
    .sort((a, b) => a - b);
  const values = years.map(year => annualData[year]);

  // Calculate latest year and trend
  const latestYear = years[years.length - 1];
  const latestValue = values[values.length - 1];
  const previousValue = values[values.length - 2];
  const trend = previousValue ? ((latestValue - previousValue) / previousValue * 100).toFixed(1) : null;

  const chartData = {
    labels: years,
    datasets: [{
      data: values,
      borderColor: 'rgb(102, 126, 234)',
      borderWidth: 2,
      fill: false,
      tension: 0.3,
      pointRadius: 0,
      pointHoverRadius: 0
    }]
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false
      },
      tooltip: {
        enabled: false
      }
    },
    scales: {
      x: {
        display: false
      },
      y: {
        display: false,
        beginAtZero: false
      }
    },
    interaction: {
      mode: 'nearest',
      intersect: false
    }
  };

  return (
    <Link to={`${import.meta.env.BASE_URL}county/${countyNameToSlug(countyName)}`} className="sparkline-card">
      <div className="sparkline-header">
        <h3>{countyName}</h3>
        {trend !== null && (
          <span className={`sparkline-trend ${trend >= 0 ? 'positive' : 'negative'}`}>
            {trend >= 0 ? '+' : ''}{trend}%
          </span>
        )}
      </div>
      <div className="sparkline-chart">
        <Line data={chartData} options={options} />
      </div>
      <div className="sparkline-footer">
        <span className="sparkline-value">{latestValue?.toLocaleString()}</span>
        <span className="sparkline-year">{latestYear}</span>
      </div>
    </Link>
  );
}

export default function SparklineGrid({ counties }) {
  return (
    <div className="chart-section">
      <h2 className="section-title">All Counties at a Glance</h2>
      <p className="section-subtitle">Annual birth trends for all 58 California counties (click to explore)</p>
      <div className="sparkline-grid">
        {counties.map(county => (
          <SparklineCard key={county} countyName={county} />
        ))}
      </div>
    </div>
  );
}
