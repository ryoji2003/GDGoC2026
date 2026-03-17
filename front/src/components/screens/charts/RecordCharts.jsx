import { Bar, Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';
import { chartData } from '../../../data/mockData';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const barOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: { legend: { display: false } },
  scales: { y: { beginAtZero: true, ticks: { stepSize: 1 } } },
};

const lineOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: { legend: { display: false } },
  scales: { y: { beginAtZero: true, max: 100 } },
};

export function PracticeChart({ period }) {
  const d = chartData[period];
  const data = {
    labels: d.labels,
    datasets: [
      {
        label: '練習回数',
        data: d.practice,
        backgroundColor: 'rgba(108, 99, 255, 0.8)',
        borderColor: 'rgba(108, 99, 255, 1)',
        borderWidth: 2,
        borderRadius: 8,
      },
    ],
  };
  return <Bar data={data} options={barOptions} />;
}

export function ScoreChart({ period }) {
  const d = chartData[period];
  const data = {
    labels: d.labels,
    datasets: [
      {
        label: '平均スコア',
        data: d.score,
        fill: true,
        backgroundColor: 'rgba(108, 99, 255, 0.1)',
        borderColor: 'rgba(108, 99, 255, 1)',
        borderWidth: 3,
        tension: 0.4,
        pointBackgroundColor: 'rgba(108, 99, 255, 1)',
        pointBorderColor: '#fff',
        pointBorderWidth: 2,
        pointRadius: 5,
      },
    ],
  };
  return <Line data={data} options={lineOptions} />;
}
