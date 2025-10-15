import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

export default function AnnualChart({ data }) {
  // Group data by year and month
  const dataByYear = {};
  data.forEach(record => {
    if (!dataByYear[record.year]) {
      dataByYear[record.year] = [];
    }
    dataByYear[record.year].push(record.count);
  });

  // Calculate annual totals for years 1960-2024
  const annualData = [];
  const years = Object.keys(dataByYear)
    .map(y => parseInt(y))
    .filter(y => y >= 1960 && y <= 2024)
    .sort((a, b) => a - b);

  years.forEach(year => {
    const yearStr = year.toString();
    if (dataByYear[yearStr]) {
      const total = dataByYear[yearStr].reduce((sum, val) => sum + (val || 0), 0);
      annualData.push({ year, total });
    }
  });

  const chartData = {
    labels: annualData.map(d => d.year),
    datasets: [{
      label: 'Total Births',
      data: annualData.map(d => d.total),
      borderColor: 'rgb(102, 126, 234)',
      backgroundColor: 'rgba(102, 126, 234, 0.1)',
      borderWidth: 3,
      tension: 0.1,
      fill: true,
      pointRadius: 0,
      pointHoverRadius: 5,
      pointBackgroundColor: 'rgb(102, 126, 234)',
      pointBorderColor: '#fff',
      pointBorderWidth: 2
    }]
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: {
      mode: 'index',
      intersect: false
    },
    plugins: {
      legend: {
        display: false
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        padding: 12,
        titleFont: {
          size: 14,
          weight: 'bold'
        },
        bodyFont: {
          size: 13
        },
        callbacks: {
          label: function(context) {
            return `${context.parsed.y.toLocaleString()} births`;
          }
        }
      }
    },
    scales: {
      x: {
        grid: {
          display: false
        },
        ticks: {
          font: {
            size: 12,
            weight: 'bold'
          },
          maxRotation: 45,
          minRotation: 45,
          autoSkip: true,
          maxTicksLimit: 20
        }
      },
      y: {
        beginAtZero: false,
        grid: {
          color: 'rgba(0, 0, 0, 0.05)'
        },
        ticks: {
          font: {
            size: 12
          },
          callback: function(value) {
            return value.toLocaleString();
          }
        },
        title: {
          display: true,
          text: 'Total Annual Births',
          font: {
            size: 14,
            weight: 'bold'
          }
        }
      }
    }
  };

  return (
    <div className="chart-section">
      <h2 className="section-title">Annual Births (1960-2024)</h2>
      <p className="section-subtitle">Historical data showing total births per year</p>
      <div className="chart-container">
        <Line data={chartData} options={options} />
      </div>
    </div>
  );
}
