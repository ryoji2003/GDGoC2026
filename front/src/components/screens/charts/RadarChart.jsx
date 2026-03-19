import { Radar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(RadialLinearScale, PointElement, LineElement, Filler, Tooltip, Legend);

const labels = ['話の明確さ', '敬語の正確さ', 'テンポ・間', '共感表現'];

const options = {
  elements: { line: { borderWidth: 3 } },
  scales: {
    r: {
      angleLines: { display: true },
      suggestedMin: 0,
      suggestedMax: 100,
      ticks: { stepSize: 20 },
    },
  },
  plugins: { legend: { display: false } },
};

export default function RadarChart({ scores }) {
  const scoreValues = scores
    ? [scores.clarity, scores.keigo, scores.tempo, scores.empathy]
    : [0, 0, 0, 0];

  const data = {
    labels,
    datasets: [
      {
        label: '今回のスコア',
        data: scoreValues,
        fill: true,
        backgroundColor: 'rgba(108, 99, 255, 0.2)',
        borderColor: 'rgba(108, 99, 255, 1)',
        pointBackgroundColor: 'rgba(108, 99, 255, 1)',
        pointBorderColor: '#fff',
        pointHoverBackgroundColor: '#fff',
        pointHoverBorderColor: 'rgba(108, 99, 255, 1)',
      },
    ],
  };

  return <Radar data={data} options={options} />;
}
