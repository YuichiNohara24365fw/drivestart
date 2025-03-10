import React, { useRef, useEffect, useMemo } from 'react';
import { calendarData } from '../data/calendarData';
import { scheduleData } from '../data/scheduleData';

interface ScheduleWeekViewProps {
  currentMonth: Date;
  selectedProject: string;
  getScheduleTypeColor: (type: string) => string;
  onDateClick: (date: Date) => void;
}

const ScheduleWeekView: React.FC<ScheduleWeekViewProps> = ({
  currentMonth,
  selectedProject,
  getScheduleTypeColor,
  onDateClick
}) => {
  const containerRef = useRef<HTMLDivElement>(null);

  // 6時位置まで自動スクロール
  useEffect(() => {
    if (containerRef.current) {
      const hourHeight = 60;
      const scrollTo = hourHeight * 6;
      containerRef.current.scrollTop = scrollTo;
    }
  }, []);

  // 週の開始日と終了日を取得（日曜始まり）
  const weekStart = new Date(currentMonth);
  weekStart.setDate(weekStart.getDate() - weekStart.getDay());
  const weekEnd = new Date(weekStart);
  weekEnd.setDate(weekEnd.getDate() + 6);

  // 週のタスクを取得
  const weekTasks = useMemo(() => {
    const weekStartStr = formatDate(weekStart);
    const weekEndStr = formatDate(weekEnd);
    return scheduleData.flatMap(episode => 
      episode.processes.filter(process => 
        process.startDate <= weekEndStr && process.endDate >= weekStartStr
      ).map(process => ({
        ...process,
        episodeNumber: episode.episode
      }))
    );
  }, [weekStart, weekEnd]);

  // 日付をYYYY-MM-DD形式に変換
  function formatDate(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  return (
    <div className="w-full h-[calc(100vh-100px)] overflow-hidden flex flex-col">
      {/* 週の範囲（上部） */}
      <div className="bg-indigo-50 p-2 text-center text-sm font-medium text-gray-700">
        {`${weekStart.getFullYear()}年${weekStart.getMonth() + 1}月${weekStart.getDate()}日 - 
           ${weekEnd.getFullYear()}年${weekEnd.getMonth() + 1}月${weekEnd.getDate()}日`}
      </div>

      {/* スケジュール全体をスクロールコンテナに */}
      <div
        ref={containerRef}
        className="flex-1 overflow-auto"
        style={{ height: 'calc(100vh - 140px)' }} // 適宜調整
      >
        {/*
          グリッド全体を一括管理:
          - 1行目: [時間] + 7曜日（sticky で固定）
          - 2～25行目: 24時間分 ([時間]列 + 7曜日列)
          
          「時間」列 = 幅固定80px
          残り7列   = 1frずつ
        */}
        <div className="min-w-[768px] grid grid-cols-[80px_repeat(7,1fr)] gap-px bg-indigo-100 relative">
          {/* --- 1行目: ヘッダ部分（sticky） --- */}
          {/* 時間ヘッダ */}
          <div className="bg-indigo-50 p-2 text-center text-xs font-medium text-gray-700 sticky top-0 z-10">
            時間
          </div>
          {/* 曜日ヘッダ */}
          {['日','月','火','水','木','金','土'].map((day, index) => {
            const date = new Date(weekStart);
            date.setDate(date.getDate() + index);
            return (
              <div
                key={day}
                className={`bg-indigo-50 p-2 text-center text-xs font-medium sticky top-0 z-10
                  ${index === 0 ? 'text-red-500' :
                    index === 6 ? 'text-blue-500' :
                    'text-gray-700'}
                `}
              >
                <div>{date.getDate()}</div>
                <div>{day}</div>
              </div>
            );
          })}

          {/* --- 2～25行目: 24時間分 --- */}
          {Array.from({ length: 24 }, (_, i) => {
            return (
              // 1行分
              <React.Fragment key={i}>
                {/* 左端の時間列（sticky left で固定したい場合は 'sticky left-0 z-10' を追加） */}
                <div className="bg-white p-2 text-xs text-gray-500">
                  {`${String(i).padStart(2, '0')}:00`}
                </div>
                {/* 7曜日分のセル */}
                {Array.from({ length: 7 }, (_, j) => {
                  const currentDate = new Date(weekStart);
                  currentDate.setDate(currentDate.getDate() + j);
                  const dateStr = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(currentDate.getDate()).padStart(2, '0')}`;
                  
                  // その日のタスクを取得
                  const todayTasks = weekTasks.filter(task => 
                    task.startDate <= dateStr && dateStr <= task.endDate
                  );

                  const events = calendarData[dateStr]?.filter(event => {
                    if (event.project !== selectedProject) return false;
                    const hour = parseInt(event.time.split(':')[0], 10);
                    return hour === i;
                  });

                  // イベントとタスクを結合して表示
                  const allItems = [
                    ...(events || []).map(event => ({ type: 'event', data: event })),
                    ...(i === 0 ? todayTasks.map(task => ({ type: 'task', data: task })) : [])
                  ];

                  return (
                    <div
                      key={j}
                      className="bg-white p-2 min-h-[60px] relative border-r border-gray-100 last:border-r-0 cursor-pointer hover:bg-gray-50"
                      onClick={() => onDateClick(currentDate)}
                    >
                      {allItems.map((item, itemIndex) => (
                        <div
                          key={itemIndex}
                          onClick={e => {
                            e.stopPropagation();
                            onDateClick(currentDate);
                          }}
                          className={`p-2 bg-gradient-to-r ${
                            item.type === 'task'
                              ? processColors[item.data.type] || 'bg-gray-500 text-white'
                              : getScheduleTypeColor(item.data.type)
                          } rounded mb-2 h-12 overflow-hidden`}
                        >
                          <div className="font-medium text-xs">
                            {item.type === 'task' 
                              ? `#${item.data.episodeNumber} ${item.data.type}`
                              : item.data.title}
                          </div>
                          <div className="text-xs opacity-75">
                            {item.type === 'task'
                              ? `${item.data.startDate} - ${item.data.endDate}`
                              : item.data.time === '終日'
                                ? '終日'
                                : `${item.data.time} - ${parseInt(item.data.time) + 2}:00`}
                          </div>
                        </div>
                      ))}
                    </div>
                  );
                })}
              </React.Fragment>
            );
          })}
        </div>
      </div>
    </div>
  );
};

// タスクの色設定
const processColors: Record<string, string> = {
  '絵コンテ':       'bg-purple-500 text-white',
  'レイアウト':     'bg-blue-500 text-white',
  'アニメーション': 'bg-indigo-500 text-white',
  '背景':           'bg-emerald-500 text-white',
  '彩色':           'bg-amber-500 text-white',
  'コンポジット':   'bg-rose-500 text-white',
  '編集':           'bg-gray-500 text-white',
};

export default ScheduleWeekView;