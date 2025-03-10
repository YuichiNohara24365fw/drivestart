import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface DatePickerProps {
  selectedDate: Date;
  onSelect: (date: Date) => void;
  onClose: () => void;
}

const DatePicker: React.FC<DatePickerProps> = ({
  selectedDate,
  onSelect,
  onClose,
}) => {
  const [currentMonth, setCurrentMonth] = useState(new Date(selectedDate));
  const [calendarDays, setCalendarDays] = useState<Date[]>([]);

  // 月を変更する
  const changeMonth = (direction: 'prev' | 'next') => {
    setCurrentMonth((prevMonth) => {
      const newMonth = new Date(prevMonth);
      if (direction === 'prev') {
        newMonth.setMonth(newMonth.getMonth() - 1);
      } else {
        newMonth.setMonth(newMonth.getMonth() + 1);
      }
      return newMonth;
    });
  };

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

  // 日付が今日かどうかをチェック
  const isToday = (date: Date): boolean => {
    const today = new Date();
    return (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    );
  };

  // 日付が選択された日付かどうかをチェック
  const isSelected = (date: Date): boolean => {
    return (
      date.getDate() === selectedDate.getDate() &&
      date.getMonth() === selectedDate.getMonth() &&
      date.getFullYear() === selectedDate.getFullYear()
    );
  };

  // 日付が現在の月のものかどうかをチェック
  const isCurrentMonth = (date: Date): boolean => {
    return date.getMonth() === currentMonth.getMonth();
  };

  // 曜日の配列
  const weekdays = ['月', '火', '水', '木', '金', '土', '日'];

  // クリックイベントハンドラー
  const handleDateClick = (date: Date) => {
    onSelect(date);
  };

  // 外側のクリックを処理するためのハンドラー
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest('.date-picker-container')) {
        onClose();
      }
    };

    document.addEventListener('mousedown', handleOutsideClick);
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
    };
  }, [onClose]);

  return (
    <div className="date-picker-container bg-white border border-gray-200 rounded-lg shadow-lg p-4 w-80">
      {/* ヘッダー */}
      <div className="flex justify-between items-center mb-4">
        <button
          onClick={() => changeMonth('prev')}
          className="p-1 rounded-full hover:bg-gray-100"
        >
          <ChevronLeft size={20} />
        </button>
        <h2 className="text-lg font-semibold">
          {currentMonth.getFullYear()}年{currentMonth.getMonth() + 1}月
        </h2>
        <button
          onClick={() => changeMonth('next')}
          className="p-1 rounded-full hover:bg-gray-100"
        >
          <ChevronRight size={20} />
        </button>
      </div>

      {/* 曜日ヘッダー */}
      <div className="grid grid-cols-7 gap-1 mb-2">
        {weekdays.map((day) => (
          <div
            key={day}
            className="text-center text-sm font-medium text-gray-500 py-1"
          >
            {day}
          </div>
        ))}
      </div>

      {/* カレンダー本体 */}
      <div className="grid grid-cols-7 gap-1">
        {calendarDays.map((day, index) => (
          <button
            key={index}
            onClick={() => handleDateClick(day)}
            className={`
              h-9 w-9 rounded-full flex items-center justify-center text-sm
              ${isCurrentMonth(day) ? 'text-gray-800' : 'text-gray-400'}
              ${isToday(day) ? 'bg-blue-100' : ''}
              ${isSelected(day) ? 'bg-blue-500 text-white hover:bg-blue-600' : 'hover:bg-gray-100'}
            `}
          >
            {day.getDate()}
          </button>
        ))}
      </div>
    </div>
  );
};

export default DatePicker; 