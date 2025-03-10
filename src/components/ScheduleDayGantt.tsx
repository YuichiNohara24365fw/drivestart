import React, { useState, useEffect, useMemo } from 'react';
import { Project } from '../types';
import { scheduleData } from '../data/scheduleData';
import { generateMonthSchedule } from '../data/dayScheduleData';
import ScheduleDetailModal from './ScheduleDetailModal';
import { ChevronDown, ChevronUp } from 'lucide-react';

interface ScheduleDayGanttProps {
  project: Project;
  currentMonth: Date;
  selectedProject: string;
}

interface MonthSchedule {
  year: number;
  month: number;
  schedule: ReturnType<typeof generateMonthSchedule>;
}

const ScheduleDayGantt: React.FC<ScheduleDayGanttProps> = ({ project, currentMonth, selectedProject }) => {
  const [schedules, setSchedules] = useState<MonthSchedule[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [expandedMonths, setExpandedMonths] = useState<Set<string>>(new Set());

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

  // 日付をYYYY-MM-DD形式に変換
  function formatDate(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  // イベントクリック時のハンドラー
  // （イベント要素をクリックしたときは、親要素のクリックを止めたい場合にstopPropagationを使用）
  const handleEventClick = (event: React.MouseEvent, dateStr: string) => {
    event.stopPropagation();
    setSelectedDate(new Date(dateStr));
  };

  // 曜日の表示用配列
  const dayOfWeek = ['日', '月', '火', '水', '木', '金', '土'];

  // 日付のスタイルを取得する関数 (「日付セルのみ」で使う)
  const getDateStyle = (dateStr: string) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const date = new Date(dateStr);
    date.setHours(0, 0, 0, 0);

    if (date.getTime() === today.getTime()) {
      // 今日なら背景色やリングなどで強調
      return 'bg-indigo-100 ring-2 ring-indigo-400 ring-inset';
    } else if (date < today) {
      // 過去日なら薄いグレー
      return 'bg-gray-100';
    }
    // 未来日は特にスタイルを付けない
    return '';
  };

  useEffect(() => {
    const newSchedules: MonthSchedule[] = [];
    const startDate = new Date(currentMonth);

    // 6か月分のスケジュールを生成
    for (let i = 0; i < 6; i++) {
      const year = startDate.getFullYear();
      const month = startDate.getMonth() + 1;
      
      newSchedules.push({
        year,
        month,
        schedule: generateMonthSchedule(year, month)
      });

      startDate.setMonth(startDate.getMonth() + 1);
    }

    setSchedules(newSchedules);
    // 最初の月を展開状態にする
    setExpandedMonths(new Set([`${currentMonth.getFullYear()}-${currentMonth.getMonth() + 1}`]));
  }, [currentMonth]);

  // 日付欄をクリックしたときも、同じくモーダルを出したいので、この共通関数で日付を選択
  const handleDateClick = (dateStr: string) => {
    setSelectedDate(new Date(dateStr));
  };

  // 月の開閉を切り替える
  const toggleMonth = (year: number, month: number) => {
    const key = `${year}-${month}`;
    setExpandedMonths(prev => {
      const next = new Set(prev);
      if (next.has(key)) {
        next.delete(key);
      } else {
        next.add(key);
      }
      return next;
    });
  };

  return (
    <div className="w-full space-y-4">
      {schedules.map(({ year, month, schedule }) => {
        const isExpanded = expandedMonths.has(`${year}-${month}`);
        
        return (
          <div
            key={`${year}-${month}`}
            className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-x-auto"
          >
            {/* 月ヘッダー */}
            <button
              onClick={() => toggleMonth(year, month)}
              className="w-full flex items-center justify-between p-4 hover:bg-gray-50"
            >
              <h3 className="text-lg font-medium text-gray-900">
                {year}年{month}月
              </h3>
              {isExpanded ? (
                <ChevronUp className="w-5 h-5 text-gray-500" />
              ) : (
                <ChevronDown className="w-5 h-5 text-gray-500" />
              )}
            </button>

            {/* 展開時の日別ビュー */}
            {isExpanded && (
              <div className="min-w-[768px]">
                {/* 日付ヘッダー */}
                <div className="grid grid-cols-[120px_repeat(31,minmax(0,1fr))] border-t border-gray-200">
                  <div className="p-2 font-medium text-gray-500 text-sm border-r border-gray-200">
                    日付
                  </div>
                  {schedule.map((day, index) => {
                    const date = new Date(day.date);
                    const dow = date.getDay();
                    return (
                      <div
                        key={index}
                        className={`p-2 text-center text-sm font-medium border-r border-gray-200 cursor-pointer hover:bg-gray-50 ${
                          day.isHoliday
                            ? 'text-red-500'
                            : dow === 6
                            ? 'text-blue-500'
                            : 'text-gray-700'
                        } ${getDateStyle(day.date)}`}
                        onClick={() => handleDateClick(day.date)}
                      >
                        <div>{date.getDate()}</div>
                        <div className="text-xs mt-0.5">{dayOfWeek[dow]}</div>
                      </div>
                    );
                  })}
                </div>

                {/* イベント表示エリア */}
                <div className="grid grid-cols-[120px_repeat(31,minmax(0,1fr))] border-t border-gray-200">
                  <div className="p-2 font-medium text-gray-500 text-sm border-r border-gray-200">
                    イベント
                  </div>
                  {schedule.map((day, index) => (
                    // ここをクリックしてもモーダルが出るように onClick で handleDateClick を呼ぶ
                    <div
                      key={index}
                      className="border-r border-gray-200 p-1 min-h-[100px] cursor-pointer hover:bg-gray-50"
                      onClick={() => handleDateClick(day.date)}
                    >
                      {day.events.map((event, eventIndex) => (
                        event.project === selectedProject && (
                          <div
                          key={eventIndex}
                          className="mb-1 p-1 rounded text-xs text-white cursor-pointer hover:opacity-80 transition-opacity"
                          style={{ backgroundColor: event.color }}
                          title={`${event.title} (${event.start}-${event.end})`}
                          onClick={(e) => handleEventClick(e, day.date)}
                        >
                          <div className="font-medium truncate">{event.title}</div>
                          <div className="text-xs opacity-75">{event.start}</div>
                        </div>
                        )
                      ))}
                      {/* タスク */}
                      {monthTasks
                        .filter(task => {
                          const dateStr = day.date;
                          return task.startDate <= dateStr && dateStr <= task.endDate;
                        })
                        .map((task, index) => (
                          <div
                            key={`task-${index}`}
                            className={`p-1.5 ${processColors[task.type] || 'bg-gray-500 text-white'} rounded mb-1 h-12 overflow-hidden whitespace-nowrap`}
                          >
                            <div className="font-medium text-xs">#{task.episodeNumber} {task.type}</div>
                            <div className="text-xs opacity-75">{task.startDate} - {task.endDate}</div>
                          </div>
                        ))}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        );
      })}

      {selectedDate && (
        <ScheduleDetailModal
          date={selectedDate}
          events={
            schedules
              .find(
                s =>
                  s.year === selectedDate.getFullYear() &&
                  s.month === selectedDate.getMonth() + 1
              )
              ?.schedule[selectedDate.getDate() - 1]?.events.map(e => ({
                title: e.title,
                type: e.type,
                time: `${e.start}-${e.end}`,
                project: project.id
              })) || []
          }
          onClose={() => setSelectedDate(null)}
        />
      )}
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

export default ScheduleDayGantt;
