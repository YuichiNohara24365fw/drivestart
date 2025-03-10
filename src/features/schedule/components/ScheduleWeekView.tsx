import React, { useEffect, useState } from 'react';
import { CalendarEvent } from '../types/schedule';

interface ScheduleWeekViewProps {
  currentDate: Date;
  events: CalendarEvent[];
}

const ScheduleWeekView: React.FC<ScheduleWeekViewProps> = ({ currentDate, events }) => {
  const [weekDays, setWeekDays] = useState<Date[]>([]);
  const [eventsByDay, setEventsByDay] = useState<Record<string, CalendarEvent[]>>({});

  // 週の日付を生成する
  useEffect(() => {
    const days: Date[] = [];
    const startOfWeek = new Date(currentDate);
    
    // 現在の日付から週の開始日（月曜日）を計算
    const dayOfWeek = currentDate.getDay();
    const diff = currentDate.getDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 1); // 月曜日を週の始まりとする調整
    startOfWeek.setDate(diff);
    
    // 週の7日間を生成
    for (let i = 0; i < 7; i++) {
      const day = new Date(startOfWeek);
      day.setDate(day.getDate() + i);
      days.push(day);
    }
    
    setWeekDays(days);
  }, [currentDate]);

  // イベントを日付ごとに整理する
  useEffect(() => {
    const eventMap: Record<string, CalendarEvent[]> = {};
    
    events.forEach(event => {
      const startDate = new Date(event.startTime);
      const dateKey = `${startDate.getFullYear()}-${startDate.getMonth()}-${startDate.getDate()}`;
      
      if (!eventMap[dateKey]) {
        eventMap[dateKey] = [];
      }
      
      eventMap[dateKey].push(event);
    });
    
    setEventsByDay(eventMap);
  }, [events]);

  // 日付が今日かどうかをチェック
  const isToday = (date: Date): boolean => {
    const today = new Date();
    return (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    );
  };

  // 特定の日のイベントを取得
  const getEventsForDay = (date: Date): CalendarEvent[] => {
    const dateKey = `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;
    return eventsByDay[dateKey] || [];
  };

  // 時間帯の配列（1時間ごと）
  const timeSlots = Array.from({ length: 24 }, (_, i) => i);

  // 曜日の配列
  const weekdayNames = ['月', '火', '水', '木', '金', '土', '日'];

  return (
    <div className="bg-white rounded-lg overflow-auto">
      <div className="min-w-[800px]">
        {/* ヘッダー（曜日と日付） */}
        <div className="grid grid-cols-8 border-b">
          <div className="p-2 border-r text-center font-medium">時間</div>
          {weekDays.map((day, index) => (
            <div
              key={index}
              className={`p-2 text-center ${isToday(day) ? 'bg-blue-50' : ''}`}
            >
              <div className="font-medium">{weekdayNames[index]}</div>
              <div className={`text-sm ${(index === 5 || index === 6) ? 'text-red-500' : ''}`}>
                {day.getMonth() + 1}/{day.getDate()}
              </div>
            </div>
          ))}
        </div>

        {/* 時間帯ごとの行 */}
        {timeSlots.map(hour => (
          <div key={hour} className="grid grid-cols-8 border-b">
            {/* 時間表示 */}
            <div className="p-2 border-r text-center text-sm">
              {hour}:00
            </div>

            {/* 各曜日のセル */}
            {weekDays.map((day, dayIndex) => {
              const dayEvents = getEventsForDay(day);
              
              // この時間帯に開始するイベントをフィルタリング
              const hourEvents = dayEvents.filter(event => {
                const eventStart = new Date(event.startTime);
                return eventStart.getHours() === hour;
              });
              
              return (
                <div
                  key={dayIndex}
                  className={`p-1 min-h-[60px] relative ${
                    isToday(day) ? 'bg-blue-50' : ''
                  }`}
                >
                  {hourEvents.map((event, eventIndex) => {
                    const startTime = new Date(event.startTime);
                    const endTime = new Date(event.endTime);
                    
                    // イベントの時間（分）を計算
                    const startMinutes = startTime.getMinutes();
                    const durationMinutes = (endTime.getTime() - startTime.getTime()) / (1000 * 60);
                    
                    // 高さと位置を計算（1分 = 1px と仮定）
                    const top = startMinutes;
                    const height = Math.max(durationMinutes, 30); // 最小高さを30pxに設定
                    
                    return (
                      <div
                        key={eventIndex}
                        className={`absolute left-1 right-1 rounded p-1 text-xs overflow-hidden ${
                          event.type === 'meeting' ? 'bg-blue-100 text-blue-800' :
                          event.type === 'deadline' ? 'bg-red-100 text-red-800' :
                          event.type === 'work' ? 'bg-green-100 text-green-800' :
                          'bg-gray-100 text-gray-800'
                        }`}
                        style={{
                          top: `${top}px`,
                          height: `${height}px`,
                          zIndex: 10
                        }}
                        title={`${event.title} (${startTime.toLocaleTimeString()} - ${endTime.toLocaleTimeString()})`}
                      >
                        <div className="font-medium truncate">
                          {startTime.getHours()}:{String(startTime.getMinutes()).padStart(2, '0')} {event.title}
                        </div>
                        {height > 40 && (
                          <div className="text-xs truncate">
                            {event.description}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ScheduleWeekView; 