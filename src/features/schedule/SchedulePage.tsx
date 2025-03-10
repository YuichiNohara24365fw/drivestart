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
import { stubData } from './data/stubData';
import { calendarData } from './data/calendarData';
import DatePicker from '../../shared/components/DatePicker';
import ScheduleGantt from './components/ScheduleGantt';
import ScheduleDetailModal from './components/ScheduleDetailModal';
import ScheduleDailyGantt from './components/ScheduleDailyGantt';
import ScheduleDayGantt from './components/ScheduleDayGantt';
import ScheduleDayView from './components/ScheduleDayView';
import ScheduleListView from './components/ScheduleListView';
import ScheduleMonthView from './components/ScheduleMonthView';
import ScheduleWeekView from './components/ScheduleWeekView';
import AddScheduleModal from './components/AddScheduleModal';

type ViewMode = 'calendar' | 'gantt' | 'dailyGantt' | 'dayGantt' | 'list' | 'week' | 'day';

const SchedulePage = () => {
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
          // その他のビュー: 前後の月に移動
          if (direction === 'prev') {
            newDate.setMonth(newDate.getMonth() - 1);
          } else {
            newDate.setMonth(newDate.getMonth() + 1);
          }
      }
      
      return newDate;
    });
  };

  // 日付選択ハンドラー
  const handleDateSelect = (date: Date) => {
    setSelectedDate(date);
    setCurrentMonth(date);
    setShowDatePicker(false);
  };

  // 日付表示用のフォーマット関数
  const formatDate = (date: Date): string => {
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    
    switch (viewMode) {
      case 'calendar':
        return `${year}年${month}月`;
      case 'week':
        // 週の開始日と終了日を計算
        const startOfWeek = new Date(date);
        const dayOfWeek = date.getDay();
        const diff = date.getDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 1); // 月曜日を週の始まりとする調整
        startOfWeek.setDate(diff);
        
        const endOfWeek = new Date(startOfWeek);
        endOfWeek.setDate(startOfWeek.getDate() + 6);
        
        return `${startOfWeek.getFullYear()}年${startOfWeek.getMonth() + 1}月${startOfWeek.getDate()}日 - ${endOfWeek.getMonth() + 1}月${endOfWeek.getDate()}日`;
      case 'day':
        return `${year}年${month}月${day}日`;
      default:
        return `${year}年${month}月`;
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center space-x-4">
          <h1 className="text-2xl font-bold text-gray-800">スケジュール管理</h1>
          
          {/* プロジェクト選択 */}
          <select
            value={selectedProject}
            onChange={(e) => setSelectedProject(e.target.value)}
            className="border border-gray-300 rounded px-3 py-1 text-sm"
          >
            {stubData.projects.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </select>
        </div>
        
        {/* 表示モード切り替えボタン */}
        <div className="flex items-center space-x-2 bg-gray-100 p-1 rounded-lg">
          <button
            onClick={() => setViewMode('calendar')}
            className={`p-2 rounded ${
              viewMode === 'calendar' ? 'bg-white shadow-sm' : 'hover:bg-gray-200'
            }`}
            title="月表示"
          >
            <CalendarIcon size={18} />
          </button>
          <button
            onClick={() => setViewMode('week')}
            className={`p-2 rounded ${
              viewMode === 'week' ? 'bg-white shadow-sm' : 'hover:bg-gray-200'
            }`}
            title="週表示"
          >
            <CalendarRange size={18} />
          </button>
          <button
            onClick={() => setViewMode('day')}
            className={`p-2 rounded ${
              viewMode === 'day' ? 'bg-white shadow-sm' : 'hover:bg-gray-200'
            }`}
            title="日表示"
          >
            <CalendarClock size={18} />
          </button>
          <button
            onClick={() => setViewMode('gantt')}
            className={`p-2 rounded ${
              viewMode === 'gantt' ? 'bg-white shadow-sm' : 'hover:bg-gray-200'
            }`}
            title="ガントチャート"
          >
            <Clock size={18} />
          </button>
          <button
            onClick={() => setViewMode('list')}
            className={`p-2 rounded ${
              viewMode === 'list' ? 'bg-white shadow-sm' : 'hover:bg-gray-200'
            }`}
            title="リスト表示"
          >
            <LayoutList size={18} />
          </button>
        </div>
      </div>
      
      {/* 日付ナビゲーション */}
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center space-x-2">
          <button
            onClick={() => navigateDate('prev')}
            className="p-2 rounded hover:bg-gray-100"
          >
            <ChevronLeft size={20} />
          </button>
          
          <div className="relative">
            <button
              onClick={() => setShowDatePicker(!showDatePicker)}
              className="px-4 py-2 border border-gray-300 rounded-md flex items-center space-x-2 hover:bg-gray-50"
            >
              <span>{formatDate(currentMonth)}</span>
              <CalendarIcon size={16} />
            </button>
            
            {showDatePicker && (
              <div className="absolute z-10 mt-1">
                <DatePicker
                  selectedDate={currentMonth}
                  onSelect={handleDateSelect}
                  onClose={() => setShowDatePicker(false)}
                />
              </div>
            )}
          </div>
          
          <button
            onClick={() => navigateDate('next')}
            className="p-2 rounded hover:bg-gray-100"
          >
            <ChevronRight size={20} />
          </button>
        </div>
        
        <button
          onClick={() => setShowAddModal(true)}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
        >
          スケジュール追加
        </button>
      </div>
      
      {/* スケジュール表示エリア */}
      <div className="bg-white rounded-lg overflow-hidden">
        {viewMode === 'calendar' && (
          <ScheduleMonthView
            currentMonth={currentMonth}
            events={calendarData}
          />
        )}
        
        {viewMode === 'week' && (
          <ScheduleWeekView
            currentDate={currentMonth}
            events={calendarData}
          />
        )}
        
        {viewMode === 'day' && (
          <ScheduleDayView
            currentDate={currentMonth}
            events={calendarData.filter(event => {
              const eventDate = new Date(event.startTime);
              return (
                eventDate.getDate() === currentMonth.getDate() &&
                eventDate.getMonth() === currentMonth.getMonth() &&
                eventDate.getFullYear() === currentMonth.getFullYear()
              );
            })}
          />
        )}
        
        {viewMode === 'gantt' && (
          <ScheduleGantt currentMonth={currentMonth} />
        )}
        
        {viewMode === 'dailyGantt' && (
          <ScheduleDailyGantt currentMonth={currentMonth} />
        )}
        
        {viewMode === 'dayGantt' && (
          <ScheduleDayGantt currentDate={currentMonth} />
        )}
        
        {viewMode === 'list' && (
          <ScheduleListView
            events={calendarData}
            currentMonth={currentMonth}
          />
        )}
      </div>
      
      {/* モーダル */}
      {showAddModal && (
        <AddScheduleModal
          initialDate={currentMonth}
          onClose={() => setShowAddModal(false)}
          onSave={(data) => {
            console.log('Save schedule:', data);
            setShowAddModal(false);
          }}
        />
      )}
    </div>
  );
};

export default SchedulePage; 