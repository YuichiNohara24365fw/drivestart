import React from 'react';
import { CalendarEvent } from '../types/schedule';

interface ScheduleDayViewProps {
  currentDate: Date;
  events: CalendarEvent[];
}

const ScheduleDayView: React.FC<ScheduleDayViewProps> = ({ currentDate, events }) => {
  // 時間帯の配列（1時間ごと）
  const timeSlots = Array.from({ length: 24 }, (_, i) => i);
  
  // イベントを時間でソート
  const sortedEvents = [...events].sort((a, b) => {
    return new Date(a.startTime).getTime() - new Date(b.startTime).getTime();
  });

  // 日付のフォーマット
  const formatDate = (date: Date): string => {
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const weekdays = ['日', '月', '火', '水', '木', '金', '土'];
    const weekday = weekdays[date.getDay()];
    
    return `${year}年${month}月${day}日（${weekday}）`;
  };

  // 時間のフォーマット
  const formatTime = (dateString: string): string => {
    const date = new Date(dateString);
    const hours = date.getHours();
    const minutes = date.getMinutes();
    return `${hours}:${minutes.toString().padStart(2, '0')}`;
  };

  // イベントの時間範囲を表示
  const formatTimeRange = (event: CalendarEvent): string => {
    return `${formatTime(event.startTime)} - ${formatTime(event.endTime)}`;
  };

  // イベントの所要時間を計算（分単位）
  const calculateDuration = (event: CalendarEvent): number => {
    const start = new Date(event.startTime).getTime();
    const end = new Date(event.endTime).getTime();
    return Math.round((end - start) / (1000 * 60));
  };

  // イベントの種類に応じた色を返す
  const getEventColor = (type: string): string => {
    switch (type) {
      case 'meeting':
        return 'bg-blue-100 text-blue-800 border-blue-300';
      case 'deadline':
        return 'bg-red-100 text-red-800 border-red-300';
      case 'work':
        return 'bg-green-100 text-green-800 border-green-300';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  return (
    <div className="bg-white rounded-lg overflow-hidden">
      {/* 日付ヘッダー */}
      <div className="p-4 border-b">
        <h2 className="text-xl font-bold">{formatDate(currentDate)}</h2>
      </div>

      <div className="flex">
        {/* 時間軸 */}
        <div className="w-20 flex-shrink-0 border-r">
          {timeSlots.map(hour => (
            <div key={hour} className="h-16 border-b flex items-start justify-center p-1">
              <span className="text-sm font-medium">{hour}:00</span>
            </div>
          ))}
        </div>

        {/* イベント表示エリア */}
        <div className="flex-grow relative">
          {/* 時間帯の区切り線 */}
          {timeSlots.map(hour => (
            <div
              key={hour}
              className="h-16 border-b border-gray-200"
              style={{ position: 'relative' }}
            />
          ))}

          {/* イベント */}
          {sortedEvents.map((event, index) => {
            const startTime = new Date(event.startTime);
            const startHour = startTime.getHours();
            const startMinute = startTime.getMinutes();
            
            // イベントの位置を計算
            const top = startHour * 64 + (startMinute / 60) * 64; // 1時間 = 64px
            
            // イベントの高さを計算（最小高さは30px）
            const duration = calculateDuration(event);
            const height = Math.max((duration / 60) * 64, 30);
            
            // イベントの色を取得
            const colorClass = getEventColor(event.type);
            
            return (
              <div
                key={index}
                className={`absolute left-2 right-2 rounded-md border p-2 ${colorClass}`}
                style={{
                  top: `${top}px`,
                  height: `${height}px`,
                  zIndex: 10
                }}
              >
                <div className="font-medium truncate">{event.title}</div>
                <div className="text-xs">{formatTimeRange(event)}</div>
                {height > 50 && (
                  <div className="text-xs mt-1 line-clamp-2">{event.description}</div>
                )}
              </div>
            );
          })}
        </div>

        {/* 右側のイベントリスト（モバイル表示時に便利） */}
        <div className="w-64 border-l hidden md:block">
          <div className="p-2 border-b bg-gray-50">
            <h3 className="font-medium">予定一覧</h3>
          </div>
          
          {sortedEvents.length > 0 ? (
            <div className="divide-y">
              {sortedEvents.map((event, index) => (
                <div key={index} className="p-2 hover:bg-gray-50">
                  <div className="font-medium">{event.title}</div>
                  <div className="text-sm text-gray-600">{formatTimeRange(event)}</div>
                  <div className="text-xs text-gray-500 mt-1 line-clamp-2">{event.description}</div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-4 text-center text-gray-500">
              予定はありません
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ScheduleDayView; 