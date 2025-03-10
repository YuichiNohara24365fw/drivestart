import React, { useEffect, useState } from 'react';
import { CalendarEvent } from '../types/schedule';

interface ScheduleMonthViewProps {
  currentMonth: Date;
  events: CalendarEvent[];
}

const ScheduleMonthView: React.FC<ScheduleMonthViewProps> = ({ currentMonth, events }) => {
  const [calendarDays, setCalendarDays] = useState<Date[]>([]);
  const [eventsByDate, setEventsByDate] = useState<Record<string, CalendarEvent[]>>({});

  // カレンダーの日付を生成する
  useEffect(() => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();

    // 月の最初の日
    const firstDayOfMonth = new Date(year, month, 1);
    // 月の最後の日
    const lastDayOfMonth = new Date(year, month + 1, 0);

    // カレンダーの最初の日（前月の日を含む）
    const startDay = new Date(firstDayOfMonth);
    startDay.setDate(startDay.getDate() - (startDay.getDay() === 0 ? 6 : startDay.getDay() - 1));

    // カレンダーの最後の日（翌月の日を含む）
    const endDay = new Date(lastDayOfMonth);
    const daysToAdd = 7 - endDay.getDay();
    endDay.setDate(endDay.getDate() + (endDay.getDay() === 0 ? 0 : daysToAdd));

    // カレンダーの日付を生成
    const days: Date[] = [];
    let currentDay = new Date(startDay);

    while (currentDay <= endDay) {
      days.push(new Date(currentDay));
      currentDay.setDate(currentDay.getDate() + 1);
    }

    setCalendarDays(days);
  }, [currentMonth]);

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
    
    setEventsByDate(eventMap);
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

  // 日付が現在の月のものかどうかをチェック
  const isCurrentMonth = (date: Date): boolean => {
    return date.getMonth() === currentMonth.getMonth();
  };

  // 日付の特定の日のイベントを取得
  const getEventsForDate = (date: Date): CalendarEvent[] => {
    const dateKey = `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;
    return eventsByDate[dateKey] || [];
  };

  // 曜日の配列
  const weekdays = ['月', '火', '水', '木', '金', '土', '日'];

  return (
    <div className="bg-white rounded-lg overflow-hidden">
      {/* 曜日ヘッダー */}
      <div className="grid grid-cols-7 gap-px bg-gray-200">
        {weekdays.map((day, index) => (
          <div
            key={day}
            className={`text-center py-2 font-medium ${
              index >= 5 ? 'text-red-500' : 'text-gray-700'
            }`}
          >
            {day}
          </div>
        ))}
      </div>

      {/* カレンダー本体 */}
      <div className="grid grid-cols-7 gap-px bg-gray-200">
        {calendarDays.map((day, index) => {
          const dayEvents = getEventsForDate(day);
          const hasEvents = dayEvents.length > 0;
          
          return (
            <div
              key={index}
              className={`min-h-[120px] p-1 ${
                isCurrentMonth(day) ? 'bg-white' : 'bg-gray-50'
              }`}
            >
              {/* 日付表示 */}
              <div
                className={`text-right p-1 font-medium ${
                  isToday(day) ? 'bg-blue-100 rounded' : ''
                } ${
                  day.getDay() === 0 || day.getDay() === 6 ? 'text-red-500' : ''
                }`}
              >
                {day.getDate()}
              </div>

              {/* イベント表示 */}
              <div className="mt-1 space-y-1">
                {dayEvents.slice(0, 3).map((event, eventIndex) => (
                  <div
                    key={eventIndex}
                    className={`text-xs p-1 rounded truncate ${
                      event.type === 'meeting' ? 'bg-blue-100 text-blue-800' :
                      event.type === 'deadline' ? 'bg-red-100 text-red-800' :
                      event.type === 'work' ? 'bg-green-100 text-green-800' :
                      'bg-gray-100 text-gray-800'
                    }`}
                    title={`${event.title} (${new Date(event.startTime).toLocaleTimeString()} - ${new Date(event.endTime).toLocaleTimeString()})`}
                  >
                    {new Date(event.startTime).getHours()}:{String(new Date(event.startTime).getMinutes()).padStart(2, '0')} {event.title}
                  </div>
                ))}
                
                {/* 表示しきれないイベントの数を表示 */}
                {dayEvents.length > 3 && (
                  <div className="text-xs text-gray-500 text-right">
                    他 {dayEvents.length - 3} 件
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ScheduleMonthView; 