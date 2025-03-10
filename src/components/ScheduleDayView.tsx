import React, { useState, useEffect, useRef, useMemo } from 'react';
import { calendarData } from '../data/calendarData';
import { scheduleData } from '../data/scheduleData';
import AddScheduleModal from './AddScheduleModal';
import ScheduleDetailModal from './ScheduleDetailModal';

interface ScheduleDayViewProps {
  currentMonth: Date;
  selectedProject: string;
  getScheduleTypeColor: (type: string) => string;
}

const ScheduleDayView: React.FC<ScheduleDayViewProps> = ({
  currentMonth,
  selectedProject,
  getScheduleTypeColor
}) => {
  const containerRef = useRef<HTMLDivElement>(null);

  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);

  // 当日のタスクを全エピソードから取得
  const todayTasks = useMemo(() => {
    const currentDate = formatDate(currentMonth);
    return scheduleData.flatMap(episode => 
      episode.processes
        .filter(process => process.startDate <= currentDate && currentDate <= process.endDate)
        .map(process => ({
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

  // 初期表示時に6時の位置までスクロール
  useEffect(() => {
    if (containerRef.current) {
      const hourHeight = 60; // 1時間あたりの高さ
      const scrollTo = hourHeight * 6; // 6時までの高さ
      containerRef.current.scrollTop = scrollTo;
    }
  }, []);

  return (
    <div className="w-full">
      <div className="flex items-center justify-between p-4 border-b border-gray-200">
        <div className="flex items-center gap-2">
          <h2 className="text-lg font-medium text-gray-900">
            {currentMonth.getFullYear()}年
            {currentMonth.getMonth() + 1}月
            {currentMonth.getDate()}日
          </h2>
          <span className="text-sm text-gray-500">
            ({['日', '月', '火', '水', '木', '金', '土'][currentMonth.getDay()]})
          </span>
        </div>
      </div>
      <div 
        ref={containerRef}
        className="grid grid-cols-1 gap-px bg-indigo-100 overflow-y-auto"
        style={{ height: 'calc(100vh - 300px)' }} // 画面の高さから余白を引いた高さ
      >
        {Array.from({ length: 24 }, (_, i) => (
          <div key={i} className="grid grid-cols-[80px_1fr] gap-px bg-indigo-100">
            <div className="bg-white p-2 text-xs text-gray-500 sticky left-0">
              {`${String(i).padStart(2, '0')}:00`}
            </div>
            <div 
              className="bg-white p-2 min-h-[60px] relative cursor-pointer hover:bg-gray-50"
              onClick={() => {
                setSelectedTime(`${String(i).padStart(2, '0')}:00`);
                setShowAddModal(true);
              }}
            >
              {(() => {
                // 現在の日付の文字列を作成
                const dateStr = `${currentMonth.getFullYear()}-${String(
                  currentMonth.getMonth() + 1
                ).padStart(2, '0')}-${String(
                  currentMonth.getDate()
                ).padStart(2, '0')}`;
                
                // 通常のイベントとタスクを表示
                const events = calendarData[dateStr]?.filter(event => {
                  if (event.project !== selectedProject) return false;
                  
                  // 時間を解析
                  if (event.time === '終日') return i === 0;
                  const hour = parseInt(event.time.split(':')[0]);
                  return hour === i;
                }) || [];

                // タスクは0時の欄に表示
                const tasks = i === 0 ? todayTasks : [];

                return [...events, ...tasks].map((item, index) => (
                  <div
                    onClick={(e) => {
                      e.stopPropagation();
                      setShowDetailModal(true);
                    }}
                    key={index}
                    className={`p-1.5 bg-gradient-to-r ${
                      'type' in item 
                        ? processColors[item.type] || 'bg-gray-500'
                        : getScheduleTypeColor(item.type)
                    } rounded mb-1 h-12 overflow-hidden`}
                  >
                    <div className="font-medium text-xs">
                      {'type' in item ? `#${item.episodeNumber} ${item.type}` : item.title}
                    </div>
                    <div className="text-xs opacity-75">
                      {'type' in item 
                        ? `${item.startDate} - ${item.endDate}`
                        : item.time === '終日' 
                          ? '終日' 
                          : `${item.time}-${parseInt(item.time) + 2}:00`}
                    </div>
                  </div>
                ));
              })()}
            </div>
          </div>
        ))}
      </div>
      
      {/* 予定追加モーダル */}
      {showAddModal && (
        <AddScheduleModal
          date={currentMonth}
          time={selectedTime || undefined}
          onClose={() => setShowAddModal(false)}
          onAdd={(schedule) => {
            console.log('New schedule:', schedule);
            setShowAddModal(false);
          }}
        />
      )}

      {/* 予定詳細モーダル */}
      {showDetailModal && (
        <ScheduleDetailModal
          date={currentMonth}
          events={calendarData[`${currentMonth.getFullYear()}-${String(
            currentMonth.getMonth() + 1
          ).padStart(2, '0')}-${String(
            currentMonth.getDate()
          ).padStart(2, '0')}`]?.filter(event => event.project === selectedProject) || []}
          onAddSchedule={() => {
            setShowDetailModal(false);
            setShowAddModal(true);
          }}
          onClose={() => setShowDetailModal(false)}
        />
      )}
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

export default ScheduleDayView;