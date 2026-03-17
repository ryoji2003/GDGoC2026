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
import { radarData } from '../../../data/mockData';

ChartJS.register(RadialLinearScale, PointElement, LineElement, Filler, Tooltip, Legend);

const data = {
  labels: radarData.labels,
  datasets: [
    {
      label: '今回のスコア',
      data: radarData.scores,
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

export default function RadarChart() {
  return <Radar data={data} options={options} />;
}
