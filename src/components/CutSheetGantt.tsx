import React from 'react';
import { Project, Staff } from '../types';

interface CutSheetGanttProps {
  project: Project;
  staff: Staff[];
}

const CutSheetGantt: React.FC<CutSheetGanttProps> = ({ project, staff }) => {
  const getStatusColor = (status: string) => {
    const colors = {
      not_started: 'bg-emerald-100',
      in_progress: 'bg-yellow-100',
      completed: 'bg-white',
      pending_review: 'bg-blue-100'
    };
    return colors[status as keyof typeof colors];
  };

  const getStatusText = (status: string) => {
    const texts = {
      not_started: '未着手',
      in_progress: '作業中',
      completed: '完了',
      pending_review: '確認待ち'
    };
    return texts[status as keyof typeof texts];
  };

  // 1日を100pxとして表示
  const dayWidth = 100;
  const startDate = new Date(project.startDate);
  const endDate = new Date(project.endDate);
  const totalDays = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
  const chartWidth = totalDays * dayWidth;

  // 月の区切りを生成
  const months: Date[] = [];
  let currentDate = new Date(startDate);
  while (currentDate <= endDate) {
    months.push(new Date(currentDate));
    currentDate.setMonth(currentDate.getMonth() + 1);
  }

  return (
    <div className="space-y-6">
      <div className="overflow-x-auto">
        <div style={{ width: chartWidth + 200 }} className="relative">
          {/* 月の区切り */}
          <div className="flex border-b border-gray-200">
            <div className="w-48 flex-shrink-0"></div>
            <div className="flex-1 flex">
              {months.map((month, index) => (
                <div
                  key={index}
                  className="border-l border-gray-200 py-2 text-sm text-gray-600"
                  style={{ width: dayWidth * 31 }}
                >
                  {month.toLocaleDateString('ja-JP', { year: 'numeric', month: 'long' })}
                </div>
              ))}
            </div>
          </div>

          {/* エピソードとカット */}
          {project.episodes.map(episode => (
            <div key={episode.id} className="mt-6">
              <h3 className="text-lg font-medium mb-4">第{episode.number}話: {episode.title}</h3>
              <div className="space-y-2">
                {episode.cuts.map(cut => {
                  const assignedStaff = staff.find(s => s.id === cut.assignedTo);
                  const startOffset = dayWidth * 2; // 仮の開始位置
                  const duration = cut.duration * dayWidth; // 仮の期間（尺を日数として扱う）

                  return (
                    <div key={cut.id} className="flex items-center">
                      <div className="w-48 flex-shrink-0">
                        <div className="flex items-center gap-2">
                          <img
                            src={assignedStaff?.avatar}
                            alt=""
                            className="w-6 h-6 rounded-full"
                          />
                          <span className="text-sm">{cut.number}</span>
                        </div>
                      </div>
                      <div className="flex-1 relative h-8">
                        <div
                          className={`absolute h-6 rounded ${getStatusColor(cut.status)} border border-gray-200`}
                          style={{
                            left: startOffset,
                            width: duration,
                            top: '4px'
                          }}
                        >
                          <div className="px-2 text-xs truncate">
                            {getStatusText(cut.status)}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CutSheetGantt;