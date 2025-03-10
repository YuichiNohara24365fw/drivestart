import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import { Bar } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

interface DepartmentProgressProps {
  data: {
    [key: string]: number;
  };
}

const DepartmentProgress: React.FC<DepartmentProgressProps> = ({ data }) => {
  const departments = {
    animation: 'アニメーション',
    background: '背景',
    sound: '音響',
    editing: '編集',
    planning: '企画'
  };

  const chartData = {
    labels: Object.keys(data).map(key => departments[key as keyof typeof departments]),
    datasets: [
      {
        label: '進捗率',
        data: Object.values(data),
        backgroundColor: [
          'rgba(99, 102, 241, 0.8)',
          'rgba(168, 85, 247, 0.8)',
          'rgba(236, 72, 153, 0.8)',
          'rgba(59, 130, 246, 0.8)',
          'rgba(147, 51, 234, 0.8)'
        ],
        borderColor: [
          'rgb(99, 102, 241)',
          'rgb(168, 85, 247)',
          'rgb(236, 72, 153)',
          'rgb(59, 130, 246)',
          'rgb(147, 51, 234)'
        ],
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        display: false,
      },
      title: {
        display: true,
        text: '部門別進捗状況',
        font: {
          size: 16,
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        max: 100,
        ticks: {
          callback: (value: number) => `${value}%`,
        },
      },
    },
  };

  return <Bar data={chartData} options={options} />;
};

export default DepartmentProgress;