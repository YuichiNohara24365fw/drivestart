import React from 'react';

interface ProgressBarProps {
  progress: number;
  expectedProgress: number;
  isDelayed: boolean;
}

const ProgressBar: React.FC<ProgressBarProps> = ({
  progress,
  expectedProgress,
  isDelayed
}) => {
  return (
    <div className="w-full bg-gray-200 rounded-full h-1.5 relative">
      <div
        className="absolute h-4 w-0.5 bg-gray-400 top-1/2 transform -translate-y-1/2"
        style={{ left: `${expectedProgress}%` }}
      />
      <div
        className={`h-1.5 rounded-full ${
          isDelayed ? 'bg-red-500' : 'bg-green-500'
        }`}
        style={{ width: `${progress}%` }}
      />
    </div>
  );
};

export default ProgressBar;