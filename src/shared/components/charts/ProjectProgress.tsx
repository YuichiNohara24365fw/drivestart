import React from 'react';
import {
  Chart as ChartJS,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend
} from 'chart.js';
import { Radar } from 'react-chartjs-2';

ChartJS.register(
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend
);

interface ProjectProgressType {
  [key: string]: number;
}

interface ProjectProgressProps {
  progress?: ProjectProgressType;
  title?: string;
}

const phases = {
  storyboard: '絵コンテ',
  animation: 'アニメーション',
  background: '背景',
  sound: '音響',
  editing: '編集'
};

const ProjectProgress: React.FC<ProjectProgressProps> = ({ 
  progress = {
    storyboard: 85,
    animation: 60,
    background: 70,
    sound: 45,
    editing: 30
  }, 
  title = 'プロジェクト' 
}) => {
  const data = {
    labels: Object.keys(progress).map(key => phases[key as keyof typeof phases] || key),
    datasets: [
      {
        label: '進捗率',
        data: Object.values(progress),
        backgroundColor: 'rgba(99, 102, 241, 0.2)',
        borderColor: 'rgb(99, 102, 241)',
        borderWidth: 2,
        pointBackgroundColor: 'rgb(99, 102, 241)',
        pointBorderColor: '#fff',
        pointHoverBackgroundColor: '#fff',
        pointHoverBorderColor: 'rgb(99, 102, 241)',
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
        text: `${title} - 工程別進捗`,
        font: {
          size: 14,
        },
      },
    },
    scales: {
      r: {
        beginAtZero: true,
        max: 100,
        ticks: {
          stepSize: 20,
          callback: function(value: number) {
            return `${value}%`;
          },
        },
      },
    },
  };

  return <Radar data={data} options={options} />;
};

export default ProjectProgress; 