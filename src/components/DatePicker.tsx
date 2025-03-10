import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface DatePickerProps {
  selectedDate: Date;
  onDateChange: (date: Date) => void;
  onClose: () => void;
}

const DatePicker: React.FC<DatePickerProps> = ({ selectedDate, onDateChange, onClose }) => {
  const [displayDate, setDisplayDate] = React.useState(new Date(selectedDate));

  // 月の最初の日の曜日を取得
  const firstDayOfMonth = new Date(displayDate.getFullYear(), displayDate.getMonth(), 1);
  const startingDayOfWeek = firstDayOfMonth.getDay();

  // 月の日数を取得
  const daysInMonth = new Date(displayDate.getFullYear(), displayDate.getMonth() + 1, 0).getDate();

  // カレンダーの日付配列を生成
  const calendarDays: (number | null)[] = [];
  for (let i = 0; i < startingDayOfWeek; i++) {
    calendarDays.push(null);
  }
  for (let i = 1; i <= daysInMonth; i++) {
    calendarDays.push(i);
  }

  // 今日の日付を取得
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // 前月・翌月への移動
  const navigateMonth = (direction: 'prev' | 'next') => {
    const newDate = new Date(displayDate);
    if (direction === 'prev') {
      newDate.setMonth(newDate.getMonth() - 1);
    } else {
      newDate.setMonth(newDate.getMonth() + 1);
    }
    setDisplayDate(newDate);
  };

  // 日付選択時の処理
  const handleDateSelect = (day: number) => {
    const newDate = new Date(displayDate.getFullYear(), displayDate.getMonth(), day);
    onDateChange(newDate);
    onClose();
  };

  // 日付が選択された日付と同じかどうかをチェック
  const isSameDate = (date1: Date, date2: Date) => {
    return date1.getFullYear() === date2.getFullYear() &&
           date1.getMonth() === date2.getMonth() &&
           date1.getDate() === date2.getDate();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={onClose}>
      <div 
        className="bg-white rounded-lg shadow-lg p-4 w-full max-w-sm"
        onClick={e => e.stopPropagation()}
      >
        {/* ヘッダー */}
        <div className="flex items-center justify-between mb-4">
          <button
            onClick={() => navigateMonth('prev')}
            className="p-1 hover:bg-gray-100 rounded"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <h2 className="text-lg font-medium">
            {displayDate.getFullYear()}年 {displayDate.getMonth() + 1}月
          </h2>
          <button
            onClick={() => navigateMonth('next')}
            className="p-1 hover:bg-gray-100 rounded"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>

        {/* 曜日ヘッダー */}
        <div className="grid grid-cols-7 mb-2">
          {['日', '月', '火', '水', '木', '金', '土'].map((day, i) => (
            <div
              key={day}
              className={`text-center text-sm font-medium p-2 ${
                i === 0 ? 'text-red-500' : i === 6 ? 'text-blue-500' : 'text-gray-500'
              }`}
            >
              {day}
            </div>
          ))}
        </div>

        {/* カレンダー本体 */}
        <div className="grid grid-cols-7 gap-1">
          {calendarDays.map((day, i) => {
            if (day === null) {
              return <div key={`empty-${i}`} className="p-2" />;
            }

            const date = new Date(displayDate.getFullYear(), displayDate.getMonth(), day);
            const isToday = isSameDate(date, today);
            const isSelected = isSameDate(date, selectedDate);
            const isWeekend = i % 7 === 0 || i % 7 === 6;

            return (
              <button
                key={day}
                onClick={() => handleDateSelect(day)}
                className={`
                  p-2 text-center rounded-full hover:bg-indigo-50
                  ${isSelected ? 'bg-indigo-600 text-white hover:bg-indigo-700' : ''}
                  ${isToday && !isSelected ? 'ring-2 ring-indigo-600' : ''}
                  ${!isSelected && isWeekend ? (i % 7 === 0 ? 'text-red-500' : 'text-blue-500') : ''}
                `}
              >
                {day}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default DatePicker;