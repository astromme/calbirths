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

const monthLabels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

const monthlyColors = [
  { border: 'rgb(102, 126, 234)', background: 'rgba(102, 126, 234, 0.1)' },
  { border: 'rgb(118, 75, 162)', background: 'rgba(118, 75, 162, 0.1)' }
];

// Helper function to get days in a month
function getDaysInMonth(year, month) {
  return new Date(year, month, 0).getDate();
}

export default function MonthlyChart({ data }) {
  // Group data by year and month, storing both raw count and normalized value
  const dataByYear = {};
  const rawDataByYear = {};

  data.forEach(record => {
    if (!dataByYear[record.year]) {
      dataByYear[record.year] = new Array(12).fill(null);
      rawDataByYear[record.year] = new Array(12).fill(null);
    }
    const monthIndex = record.month - 1;
    const daysInMonth = getDaysInMonth(record.year, record.month);

    rawDataByYear[record.year][monthIndex] = record.count;
    dataByYear[record.year][monthIndex] = record.count / daysInMonth;
  });

  // Get the latest two years for the chart
  const years = Object.keys(dataByYear).map(y => parseInt(y)).sort((a, b) => b - a);
  const displayYears = years.slice(0, 2).reverse();

  const datasets = displayYears.map((year, index) => ({
    label: year.toString(),
    data: dataByYear[year] || new Array(12).fill(null),
    borderColor: monthlyColors[index].border,
    backgroundColor: monthlyColors[index].background,
    borderWidth: 3,
    tension: 0.3,
    fill: true,
    pointRadius: 5,
    pointHoverRadius: 7,
    pointBackgroundColor: monthlyColors[index].border,
    pointBorderColor: '#fff',
    pointBorderWidth: 2
  }));

  const chartData = {
    labels: monthLabels,
    datasets: datasets
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
        display: true,
        position: 'top',
        labels: {
          font: {
            size: 14,
            weight: 'bold'
          },
          padding: 20,
          usePointStyle: true
        }
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
            const value = context.parsed.y;
            if (value === null) {
              return `${context.dataset.label}: No data`;
            }
            const year = parseInt(context.dataset.label);
            const monthIndex = context.dataIndex;
            const rawValue = rawDataByYear[year][monthIndex];
            return [
              `${context.dataset.label}: ${Math.round(value).toLocaleString()} births/day`,
              `Total: ${rawValue.toLocaleString()} births`
            ];
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
          }
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
          text: 'Average Births per Day',
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
      <h2 className="section-title">Monthly Births ({displayYears.join('-')})</h2>
      <p className="section-subtitle">Average daily births (normalized for days in month)</p>
      <div className="chart-container">
        <Line data={chartData} options={options} />
      </div>
    </div>
  );
}
