import React from 'react';

interface ProcessCalendarProps {
  startDate: Date;
}

const ProcessCalendar: React.FC<ProcessCalendarProps> = ({ startDate }) => {
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
  const dayOfWeekJP = ['日', '月', '火', '水', '木', '金', '土'];
  const processes = ['レイアウト', '原画', '動画', '彩色', '背景', '撮影'];

  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse text-xs">
        <thead>
          <tr>
            <th className="border border-gray-200 bg-gray-50 p-1 w-24">工程</th>
            <th className="border border-gray-200 bg-gray-50 p-1 w-16">計</th>
            {calendarDays.map((day, index) => (
              <th
                key={index}
                className={`border border-gray-200 p-1 min-w-[2.5rem] ${
                  day.isWeekend ? 'bg-red-50' : 'bg-gray-50'
                }`}
              >
                <div className="flex flex-col items-center">
                  <div>{day.date.getDate()}</div>
                  <div>{dayOfWeekJP[day.dayOfWeek]}</div>
                  <div className="flex gap-1 mt-1">
                    <div className="flex flex-col items-center"></div>
                  </div>
                </div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {processes.map((process, index) => (
            <tr key={index}>
              <td className="border border-gray-200 p-1">
                <div className="flex flex-row justify-between">
                  <span>{process}</span>
                </div>
              </td>
              <td className="border border-gray-200 p-1 text-center">0</td>
              {calendarDays.map((_, dayIndex) => (
                <td
                  key={dayIndex}
                  className="border border-gray-200 p-1 text-center"
                >
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

export default ProcessCalendar;
