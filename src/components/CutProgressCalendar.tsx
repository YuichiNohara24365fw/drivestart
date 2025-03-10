import React from 'react';
import { ProcessData } from '../types';

interface CutProgressCalendarProps {
  processData: ProcessData[];
  startDate: Date;
}

const CutProgressCalendar: React.FC<CutProgressCalendarProps> = ({ processData, startDate }) => {
  // 1ヶ月分のカレンダーを生成
  const generateCalendarDays = () => {
    const days = [];
    const currentDate = new Date(startDate);
    
    for (let i = 0; i < 32; i++) {
      days.push({
        date: new Date(currentDate),
        dayOfWeek: currentDate.getDay(),
        isWeekend: currentDate.getDay() === 0 || currentDate.getDay() === 6,
      });
      currentDate.setDate(currentDate.getDate() + 1);
    }
    return days;
  };

  const calendarDays = generateCalendarDays();
  const dayOfWeekJP = ['日', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse text-xs">
        <thead>
          <tr>
            <th className="border border-gray-200 bg-gray-50 p-1 w-24">種別(0カット)</th>
            <th className="border border-gray-200 bg-gray-50 p-1 w-16">計</th>
            {calendarDays.map((day, index) => (
              <th 
                key={index}
                className={`border border-gray-200 p-1 min-w-[2.5rem] ${
                  day.isWeekend ? 'bg-red-50' : 'bg-gray-50'
                }`}
              >
                <div>{day.date.getDate()}</div>
                <div>{dayOfWeekJP[day.dayOfWeek]}</div>
                <div>N</div>
                <div>A</div>
                <div>M</div>
                <div>E</div>
                <div>?</div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {[
            { label: '作画_BG', count: 0 },
            { label: '全セル', count: 0 },
            { label: 'BG_only', count: 0 },
            { label: '作画_3D_BG', count: 0 },
            { label: '3D_BG', count: 0, group: 'LOUP' },
            { label: '他', count: 0 },
            { label: 'BANK', count: 0 },
            { label: '修BANK', count: 0 },
            { label: '欠番', count: 0 }
          ].map((row, index) => (
            <tr key={index}>
              <td className="border border-gray-200 p-1">
                <div className="flex justify-between">
                  <span>{row.label}</span>
                  <span>{row.count}</span>
                </div>
                {row.group && (
                  <div className="text-gray-500 text-xs">{row.group}</div>
                )}
              </td>
              <td className="border border-gray-200 p-1 text-center">
                {row.label === '3D_BG' ? '1' : '0'}
              </td>
              {calendarDays.map((_, dayIndex) => (
                <td key={dayIndex} className="border border-gray-200 p-1 text-center">
                  0
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default CutProgressCalendar;