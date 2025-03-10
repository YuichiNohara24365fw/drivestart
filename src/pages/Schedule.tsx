// /src/pages/Schedule.tsx

import React, { useState } from 'react';
import {
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  CalendarDays,
  CalendarRange,
  CalendarClock,
  Clock,
  LayoutList
} from 'lucide-react';
import { stubData } from '../data/stubData';
import ScheduleGantt from '../components/ScheduleGantt';
import { calendarData } from '../data/calendarData';
import ScheduleDetailModal from '../components/ScheduleDetailModal';
import ScheduleDailyGantt from '../components/ScheduleDailyGantt';
import ScheduleDayGantt from '../components/ScheduleDayGantt';
import ScheduleDayView from '../components/ScheduleDayView';
import ScheduleListView from '../components/ScheduleListView';
import ScheduleMonthView from '../components/ScheduleMonthView';
import ScheduleWeekView from '../components/ScheduleWeekView';
import AddScheduleModal from '../components/AddScheduleModal';
import DatePicker from '../components/DatePicker';

type ViewMode = 'calendar' | 'gantt' | 'dailyGantt' | 'dayGantt' | 'list' | 'week' | 'day';

const Schedule = () => {
  const [selectedProject, setSelectedProject] = useState(stubData.projects[0].id);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [viewMode, setViewMode] = useState<ViewMode>('calendar');
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const project = stubData.projects.find((p) => p.id === selectedProject);
  
  // 日付移動のハンドラー
  const navigateDate = (direction: 'prev' | 'next') => {
    setCurrentMonth(prev => {
      const newDate = new Date(prev);
      
      switch (viewMode) {
        case 'calendar':
          // 月ビュー: 前後の月に移動
          if (direction === 'prev') {
            newDate.setMonth(newDate.getMonth() - 1);
          } else {
            newDate.setMonth(newDate.getMonth() + 1);
          }
          break;
          
        case 'week':
          // 週ビュー: 前後の週に移動
          if (direction === 'prev') {
            newDate.setDate(newDate.getDate() - 7);
          } else {
            newDate.setDate(newDate.getDate() + 7);
          }
          break;
          
        case 'day':
          // 日ビュー: 前後の日に移動
          if (direction === 'prev') {
            newDate.setDate(newDate.getDate() - 1);
          } else {
            newDate.setDate(newDate.getDate() + 1);
          }
          break;
          
        default:
          // その他のビュー: 月移動
          if (direction === 'prev') {
            newDate.setMonth(newDate.getMonth() - 1);
          } else {
            newDate.setMonth(newDate.getMonth() + 1);
          }
      }
      
      return newDate;
    });
  };

  // 現在のビューモードに応じた日付表示フォーマット
  const getDateDisplayFormat = () => {
    switch (viewMode) {
      case 'calendar':
        return `${currentMonth.getFullYear()}年${currentMonth.getMonth() + 1}月`;
      case 'week':
        const weekStart = new Date(currentMonth);
        weekStart.setDate(weekStart.getDate() - weekStart.getDay());
        const weekEnd = new Date(weekStart);
        weekEnd.setDate(weekEnd.getDate() + 6);
        return `${weekStart.getMonth() + 1}月${weekStart.getDate()}日 - ${weekEnd.getMonth() + 1}月${weekEnd.getDate()}日`;
      case 'day':
        return `${currentMonth.getFullYear()}年${currentMonth.getMonth() + 1}月${currentMonth.getDate()}日`;
      default:
        return `${currentMonth.getFullYear()}年${currentMonth.getMonth() + 1}月`;
    }
  };

  // ----- カレンダー表示用 -----
  const firstDayOfMonth = new Date(
    currentMonth.getFullYear(),
    currentMonth.getMonth(),
    1
  );
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const startingDayOfWeek = firstDayOfMonth.getDay();
  const daysInMonth = new Date(
    currentMonth.getFullYear(),
    currentMonth.getMonth() + 1,
    0
  ).getDate();

  const calendarDays: (number | null)[] = [];
  for (let i = 0; i < startingDayOfWeek; i++) {
    calendarDays.push(null);
  }
  for (let i = 1; i <= daysInMonth; i++) {
    calendarDays.push(i);
  }

  // イベント種類ごとの色
  const getScheduleTypeColor = (type: string) => {
    const colors = {
      animation: 'from-blue-100 to-indigo-100 text-blue-800',
      background: 'from-emerald-100 to-teal-100 text-emerald-800',
      storyboard: 'from-purple-100 to-pink-100 text-purple-800',
      sound: 'from-amber-100 to-orange-100 text-amber-800',
      design: 'from-rose-100 to-pink-100 text-rose-800',
    };
    return (
      colors[type as keyof typeof colors] ||
      'from-gray-100 to-gray-200 text-gray-800'
    );
  };

  const handleDateClick = (day: number) => {
    const date = new Date(
      currentMonth.getFullYear(),
      currentMonth.getMonth(),
      day
    );
    setSelectedDate(date);
  };

  const getEventsForDate = (date: Date) => {
    const dateStr = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(
      2,
      '0'
    )}-${String(date.getDate()).padStart(2, '0')}`;
    return (
      calendarData[dateStr]?.filter((event) => event.project === selectedProject) ||
      []
    );
  };

  return (
    <div className="space-y-6">
      {/* ---------------- ヘッダー ---------------- */}
      <div className="space-y-4">
        <h1 className="text-xl sm:text-2xl font-bold text-gray-900">
          制作スケジュール
        </h1>

        <div className="flex flex-col md:flex-row items-center gap-4 md:justify-between">
          {/* プロジェクト選択 */}
          <div className="w-full md:w-auto">
            <select
              value={selectedProject}
              onChange={(e) => setSelectedProject(e.target.value)}
              className="h-10 px-4 text-sm sm:text-base font-medium text-gray-600 border border-indigo-100 rounded-lg bg-white w-full sm:w-auto"
            >
              {stubData.projects.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.title}
                </option>
              ))}
            </select>
          </div>

          {/* 年月選択（中央配置） */}
          <div className="flex items-center gap-4 w-full md:w-auto justify-center">
            <button
              onClick={() => navigateDate('prev')}
              className="h-10 w-10 flex items-center justify-center hover:bg-indigo-50 rounded-lg"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={() => setShowDatePicker(true)}
              className="h-10 flex items-center gap-2 px-4 border border-indigo-100 rounded-lg bg-white"
            >
              <CalendarIcon className="w-4 h-4" />
              <span className="text-sm sm:text-base">{getDateDisplayFormat()}</span>
            </button>
            <button
              onClick={() => navigateDate('next')}
              className="h-10 w-10 flex items-center justify-center hover:bg-indigo-50 rounded-lg"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>

          {/* 右側の空のスペース（バランス用） */}
          <div className="w-full sm:w-auto flex justify-center md:justify-end gap-2">
            <div className="h-10 flex items-center gap-2 bg-white rounded-lg border border-indigo-100 p-1 w-full sm:w-auto justify-center">
              <button
                onClick={() => setViewMode('gantt')}
                className={`p-2 rounded flex items-center gap-1 ${
                  viewMode === 'gantt'
                    ? 'bg-indigo-100 text-indigo-600'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                <CalendarRange className="w-4 h-4" />
                <span className="text-xs sm:text-sm">全行程</span>
              </button>
              <button
                onClick={() => setViewMode('dailyGantt')}
                className={`p-2 rounded flex items-center gap-1 ${
                  viewMode === 'dailyGantt'
                    ? 'bg-indigo-100 text-indigo-600'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                <CalendarRange className="w-4 h-4" />
                <span className="text-xs sm:text-sm">全行程(月)</span>
              </button>
              <button
                onClick={() => setViewMode('dayGantt')}
                className={`p-2 rounded flex items-center gap-1 ${
                  viewMode === 'dayGantt'
                    ? 'bg-indigo-100 text-indigo-600'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                <CalendarClock className="w-4 h-4" />
                <span className="text-xs sm:text-sm">一覧</span>
              </button>
              <button
                onClick={() => setViewMode('calendar')}
                className={`p-2 rounded flex items-center gap-1 ${
                  viewMode === 'calendar'
                    ? 'bg-indigo-100 text-indigo-600'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                <CalendarDays className="w-4 h-4" />
                <span className="text-xs sm:text-sm">月</span>
              </button>
              <button
                onClick={() => setViewMode('week')}
                className={`p-2 rounded flex items-center gap-1 ${
                  viewMode === 'week'
                    ? 'bg-indigo-100 text-indigo-600'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                <LayoutList className="w-4 h-4" />
                <span className="text-xs sm:text-sm">週</span>
              </button>
              <button
                onClick={() => setViewMode('day')}
                className={`p-2 rounded flex items-center gap-1 ${
                  viewMode === 'day'
                    ? 'bg-indigo-100 text-indigo-600'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                <Clock className="w-4 h-4" />
                <span className="text-xs sm:text-sm">日</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ---------------- メイン表示 ---------------- */}
      {project && (
        <div className="bg-white rounded-xl shadow-sm border border-indigo-50 p-4 overflow-x-auto">
          {viewMode === 'calendar' && (
            <ScheduleMonthView
              currentMonth={currentMonth}
              selectedProject={selectedProject}
              getScheduleTypeColor={getScheduleTypeColor}
              onDateClick={handleDateClick}
            />
          )}

          {viewMode === 'week' && (
            <ScheduleWeekView
              currentMonth={currentMonth}
              selectedProject={selectedProject}
              getScheduleTypeColor={getScheduleTypeColor}
              onDateClick={setSelectedDate}
            />
          )}

          {viewMode === 'day' && (
            <ScheduleDayView
              currentMonth={currentMonth}
              selectedProject={selectedProject}
              getScheduleTypeColor={getScheduleTypeColor}
            />
          )}

          {viewMode === 'gantt' && (
            /* 4か月分ガントチャート */
          <div className="w-full overflow-x-auto">
              <ScheduleGantt project={project} currentMonth={currentMonth} />
            </div>
          )}
          
          {viewMode === 'dailyGantt' && (
            <div className="w-full overflow-x-auto">
              <ScheduleDailyGantt project={project} currentMonth={currentMonth} />
            </div>
          )}

          {viewMode === 'dayGantt' && (
            /* 日別ガントチャート */
          <div className="w-full overflow-x-auto">
              <ScheduleDayGantt project={project} currentMonth={currentMonth} selectedProject={selectedProject} />
            </div>
          )}

          {viewMode === 'list' && (
            /* 一覧表示 */
            <div className="w-full">
              <ScheduleListView project={project} currentMonth={currentMonth} />
            </div>
          )}
        </div>
      )}

      {/* スケジュール詳細モーダル */}
      {selectedDate && (
        <ScheduleDetailModal
          date={selectedDate}
          onAddSchedule={() => {
            setShowAddModal(true);
          }}
          events={getEventsForDate(selectedDate)}
          onClose={() => setSelectedDate(null)}
        />
      )}
      
      {/* 予定追加モーダル */}
      {showAddModal && (
        <AddScheduleModal
          date={selectedDate || currentMonth}
          onClose={() => setShowAddModal(false)}
          onAdd={(schedule) => {
            console.log('New schedule:', schedule);
            setShowAddModal(false);
          }}
        />
      )}

      {/* 日付選択モーダル */}
      {showDatePicker && (
        <DatePicker
          selectedDate={currentMonth}
          onDateChange={(date) => {
            setCurrentMonth(date);
            setShowDatePicker(false);
          }}
          onClose={() => setShowDatePicker(false)}
        />
      )}
    </div>
  );
};

export default Schedule;