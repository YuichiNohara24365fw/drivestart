import React, { useState, useEffect } from 'react';
import { CalendarEvent } from '../types/schedule';

interface ScheduleListViewProps {
  events: CalendarEvent[];
  currentMonth: Date;
}

const ScheduleListView: React.FC<ScheduleListViewProps> = ({ events, currentMonth }) => {
  const [filteredEvents, setFilteredEvents] = useState<CalendarEvent[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'date' | 'title'>('date');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

  // イベントをフィルタリングする
  useEffect(() => {
    let result = [...events];
    
    // 検索語でフィルタリング
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(event => 
        event.title.toLowerCase().includes(term) || 
        (event.description && event.description.toLowerCase().includes(term))
      );
    }
    
    // タイプでフィルタリング
    if (filterType !== 'all') {
      result = result.filter(event => event.type === filterType);
    }
    
    // ソート
    result.sort((a, b) => {
      if (sortBy === 'date') {
        const dateA = new Date(a.startTime).getTime();
        const dateB = new Date(b.startTime).getTime();
        return sortDirection === 'asc' ? dateA - dateB : dateB - dateA;
      } else {
        const titleA = a.title.toLowerCase();
        const titleB = b.title.toLowerCase();
        return sortDirection === 'asc' 
          ? titleA.localeCompare(titleB)
          : titleB.localeCompare(titleA);
      }
    });
    
    setFilteredEvents(result);
  }, [events, searchTerm, filterType, sortBy, sortDirection]);

  // イベントタイプの一覧を取得
  const eventTypes = Array.from(new Set(events.map(event => event.type)));

  // 日付のフォーマット
  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const hours = date.getHours();
    const minutes = date.getMinutes();
    
    return `${year}/${month}/${day} ${hours}:${minutes.toString().padStart(2, '0')}`;
  };

  // ソート方向を切り替える
  const toggleSortDirection = () => {
    setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc');
  };

  // ソート項目を変更する
  const changeSortBy = (value: 'date' | 'title') => {
    if (sortBy === value) {
      toggleSortDirection();
    } else {
      setSortBy(value);
      setSortDirection('asc');
    }
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
      {/* フィルターとソートのコントロール */}
      <div className="p-4 border-b">
        <div className="flex flex-wrap gap-4">
          {/* 検索ボックス */}
          <div className="flex-grow max-w-md">
            <input
              type="text"
              placeholder="イベントを検索..."
              className="w-full px-3 py-2 border rounded-md"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          {/* タイプフィルター */}
          <div>
            <select
              className="px-3 py-2 border rounded-md"
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
            >
              <option value="all">すべてのタイプ</option>
              {eventTypes.map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          </div>
          
          {/* ソートコントロール */}
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-600">並び替え:</span>
            <button
              className={`px-3 py-1 rounded-md ${
                sortBy === 'date' ? 'bg-blue-100 text-blue-800' : 'bg-gray-100'
              }`}
              onClick={() => changeSortBy('date')}
            >
              日付 {sortBy === 'date' && (sortDirection === 'asc' ? '↑' : '↓')}
            </button>
            <button
              className={`px-3 py-1 rounded-md ${
                sortBy === 'title' ? 'bg-blue-100 text-blue-800' : 'bg-gray-100'
              }`}
              onClick={() => changeSortBy('title')}
            >
              タイトル {sortBy === 'title' && (sortDirection === 'asc' ? '↑' : '↓')}
            </button>
          </div>
        </div>
      </div>

      {/* イベントリスト */}
      <div className="divide-y">
        {filteredEvents.length > 0 ? (
          filteredEvents.map((event, index) => (
            <div key={index} className="p-4 hover:bg-gray-50">
              <div className="flex items-start">
                {/* イベントタイプのバッジ */}
                <div className={`px-2 py-1 rounded-md text-xs font-medium mr-3 ${getEventColor(event.type)}`}>
                  {event.type}
                </div>
                
                {/* イベント内容 */}
                <div className="flex-grow">
                  <h3 className="font-medium text-lg">{event.title}</h3>
                  <div className="text-sm text-gray-600 mt-1">
                    {formatDate(event.startTime)} - {formatDate(event.endTime)}
                  </div>
                  {event.description && (
                    <p className="mt-2 text-gray-700">{event.description}</p>
                  )}
                  {event.location && (
                    <div className="mt-1 text-sm text-gray-500">
                      場所: {event.location}
                    </div>
                  )}
                </div>
                
                {/* プロジェクト情報 */}
                {event.project && (
                  <div className="ml-4 text-sm bg-gray-100 px-2 py-1 rounded">
                    {event.project}
                  </div>
                )}
              </div>
            </div>
          ))
        ) : (
          <div className="p-8 text-center text-gray-500">
            該当するイベントはありません
          </div>
        )}
      </div>
    </div>
  );
};

export default ScheduleListView; 