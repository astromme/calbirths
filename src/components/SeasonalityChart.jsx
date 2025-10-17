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

// Typical days in each month (using 28.25 for February to account for leap years)
const daysInMonth = [31, 28.25, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

export default function SeasonalityChart({ data }) {
  // Calculate average births per month across all years (1960-2024)
  const monthlyTotals = new Array(12).fill(0);
  const monthlyYearCounts = new Array(12).fill(0);

  data.forEach(record => {
    // Only include data from 1960-2024 for complete years
    if (record.year >= 1960 && record.year <= 2024) {
      const monthIndex = record.month - 1;
      monthlyTotals[monthIndex] += record.count;
      monthlyYearCounts[monthIndex]++;
    }
  });

  // Calculate averages
  const monthlyAverages = monthlyTotals.map((total, index) =>
    monthlyYearCounts[index] > 0 ? total / monthlyYearCounts[index] : 0
  );

  // Normalize by days in month to get average daily births
  const dailyAverages = monthlyAverages.map((avg, index) => avg / daysInMonth[index]);

  // Calculate overall average daily birth rate across all months
  const overallDailyAverage = dailyAverages.reduce((sum, avg) => sum + avg, 0) / 12;

  // Express each month as a percentage relative to the overall average (100% = average)
  const relativeRates = dailyAverages.map(avg =>
    overallDailyAverage > 0 ? (avg / overallDailyAverage) * 100 : 0
  );

  const chartData = {
    labels: monthLabels,
    datasets: [{
      label: 'Relative Daily Birth Rate',
      data: relativeRates,
      borderColor: 'rgb(118, 75, 162)',
      backgroundColor: 'rgba(118, 75, 162, 0.1)',
      borderWidth: 3,
      tension: 0.3,
      fill: true,
      pointRadius: 5,
      pointHoverRadius: 7,
      pointBackgroundColor: 'rgb(118, 75, 162)',
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
            const relativeRate = context.parsed.y;
            const monthIndex = context.dataIndex;
            const yearCount = monthlyYearCounts[monthIndex];
            const avgBirths = monthlyAverages[monthIndex];
            const dailyAvg = dailyAverages[monthIndex];
            return [
              `Relative rate: ${relativeRate.toFixed(1)}% of average`,
              `Avg daily births: ${Math.round(dailyAvg).toLocaleString()}`,
              `Avg monthly births: ${Math.round(avgBirths).toLocaleString()}`,
              `Based on ${yearCount} years (1960-2024)`
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
            return value.toFixed(1) + '%';
          }
        },
        title: {
          display: true,
          text: 'Relative Daily Birth Rate (100% = average)',
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
      <h2 className="section-title">Birth Seasonality (1960-2024)</h2>
      <p className="section-subtitle">Daily birth rate relative to yearly average (normalized for days in month)</p>
      <div className="chart-container">
        <Line data={chartData} options={options} />
      </div>
    </div>
  );
}
