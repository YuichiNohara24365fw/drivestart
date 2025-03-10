import React, { useMemo } from 'react';
import { CalendarEvent } from '../types/schedule';
import { calendarData } from '../data/calendarData';
import { scheduleData } from '../data/scheduleData';

interface ScheduleMonthViewProps {
  currentMonth: Date;
  selectedProject: string;
  getScheduleTypeColor: (type: string) => string;
  onDateClick: (day: number) => void;
}

// 日付をYYYY-MM-DD形式に変換
function formatDate(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

const ScheduleMonthView: React.FC<ScheduleMonthViewProps> = ({
  currentMonth,
  selectedProject,
  getScheduleTypeColor,
  onDateClick
}) => {
  // 月のタスクを取得
  const monthTasks = useMemo(() => {
    const monthStartStr = formatDate(new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1));
    const monthEndStr = formatDate(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0));
    return scheduleData.flatMap(episode => 
      episode.processes.filter(process => 
        process.startDate <= monthEndStr && process.endDate >= monthStartStr
      ).map(process => ({
        ...process,
        episodeNumber: episode.episode
      }))
    );
  }, [currentMonth]);

  // 月の最初の日の曜日を取得
  const firstDayOfMonth = new Date(
    currentMonth.getFullYear(),
    currentMonth.getMonth(),
    1
  );
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const startingDayOfWeek = firstDayOfMonth.getDay();
  const daysInMonth = new Date(
    currentMonth.getFullYear(),
    currentMonth.getMonth() + 1,
    0
  ).getDate();

  const calendarDays: (number | null)[] = [];
  for (let i = 0; i < startingDayOfWeek; i++) {
    calendarDays.push(null);
  }
  for (let i = 1; i <= daysInMonth; i++) {
    calendarDays.push(i);
  }

  return (
    <div className="w-full">
      <div className="grid grid-cols-1 gap-px bg-indigo-100">
        <div className="bg-indigo-50 p-2 text-center text-sm font-medium text-gray-700">
          {currentMonth.getFullYear()}年{currentMonth.getMonth() + 1}月
        </div>
      </div>
      <div className="grid grid-cols-7 gap-px bg-indigo-100">
        {['日', '月', '火', '水', '木', '金', '土'].map((day) => (
          <div
            key={day}
            className="bg-indigo-50 p-2 text-center text-xs sm:text-sm font-medium text-gray-700"
          >
            {day}
          </div>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-px bg-indigo-100">
        {calendarDays.map((day, i) => (
          <div
            key={i}
            className={`bg-white p-2 sm:p-4 min-h-[90px] sm:min-h-[120px] hover:bg-indigo-50/50 transition-colors ${
              day === null ? 'bg-gray-50' : 'cursor-pointer'
            } ${
              day !== null && 
              new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day).getTime() === today.getTime() 
                ? 'ring-2 ring-indigo-400 ring-inset bg-indigo-100' 
                : ''
            }`}
            onClick={() => day !== null && onDateClick(day)}
          >
            {day !== null && (
              <div className="h-full">
                <span
                  className={`text-xs sm:text-sm ${
                    i % 7 === 0
                      ? 'text-red-500'
                      : i % 7 === 6
                      ? 'text-blue-500'
                      : 'text-gray-500'
                  }`}
                >
                  {day}
                </span>
                {/* 通常のイベント */}
                {calendarData[
                  `${currentMonth.getFullYear()}-${String(
                    currentMonth.getMonth() + 1
                  ).padStart(2, '0')}-${String(day).padStart(2, '0')}`
                ]?.map((event, index) =>
                  event.project === selectedProject ? (
                    <div
                      key={index}
                      className={`p-1 sm:p-1.5 bg-gradient-to-r ${getScheduleTypeColor(
                        event.type
                      )} text-[10px] sm:text-xs rounded h-10 overflow-hidden`}
                    >
                      <div className="font-medium">{event.title}</div>
                      <div className="opacity-75">{event.time}</div>
                    </div>
                  ) : null
                )}
                {/* タスク */}
                {monthTasks
                  .filter(task => {
                    const dateStr = formatDate(new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day));
                    return task.startDate <= dateStr && dateStr <= task.endDate;
                  })
                  .map((task, index) => (
                    <div
                      key={`task-${index}`}
                      className={`p-1 sm:p-1.5 ${processColors[task.type] || 'bg-gray-500 text-white'} text-[10px] sm:text-xs rounded h-10 overflow-hidden`}
                    >
                      <div className="font-medium">#{task.episodeNumber} {task.type}</div>
                      <div className="opacity-75">{task.startDate} - {task.endDate}</div>
                    </div>
                  ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

// タスクの色設定
const processColors: Record<string, string> = {
  '絵コンテ':       'bg-purple-500',
  'レイアウト':     'bg-blue-500',
  'アニメーション': 'bg-indigo-500',
  '背景':           'bg-emerald-500',
  '彩色':           'bg-amber-500',
  'コンポジット':   'bg-rose-500',
  '編集':           'bg-gray-500',
};

export default ScheduleMonthView;