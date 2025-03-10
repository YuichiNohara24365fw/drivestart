import React, { useState, useEffect } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { CalendarEvent } from '../types/schedule';
import ScheduleDetailModal from './ScheduleDetailModal';

interface ScheduleDayGanttProps {
  currentDate: Date;
}

const ScheduleDayGantt: React.FC<ScheduleDayGanttProps> = ({ currentDate }) => {
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set(['morning', 'afternoon', 'evening']));

  // サンプルイベントを生成（実際のアプリではAPIから取得するなど）
  useEffect(() => {
    // 現在の日付の0時0分
    const startOfDay = new Date(currentDate);
    startOfDay.setHours(0, 0, 0, 0);
    
    // サンプルイベントを生成
    const sampleEvents: CalendarEvent[] = [
      {
        id: '1',
        title: '朝のミーティング',
        type: 'meeting',
        startTime: new Date(startOfDay.getTime() + 9 * 60 * 60 * 1000).toISOString(), // 9:00
        endTime: new Date(startOfDay.getTime() + 10 * 60 * 60 * 1000).toISOString(), // 10:00
        description: '今日の作業内容の確認と割り当て',
        location: '会議室A'
      },
      {
        id: '2',
        title: 'レイアウト作業',
        type: 'work',
        startTime: new Date(startOfDay.getTime() + 10 * 60 * 60 * 1000).toISOString(), // 10:00
        endTime: new Date(startOfDay.getTime() + 12 * 60 * 60 * 1000).toISOString(), // 12:00
        description: 'シーン5のレイアウト作業',
        project: 'プロジェクトA'
      },
      {
        id: '3',
        title: '昼食',
        type: 'break',
        startTime: new Date(startOfDay.getTime() + 12 * 60 * 60 * 1000).toISOString(), // 12:00
        endTime: new Date(startOfDay.getTime() + 13 * 60 * 60 * 1000).toISOString(), // 13:00
      },
      {
        id: '4',
        title: 'アニメーション作業',
        type: 'work',
        startTime: new Date(startOfDay.getTime() + 13 * 60 * 60 * 1000).toISOString(), // 13:00
        endTime: new Date(startOfDay.getTime() + 16 * 60 * 60 * 1000).toISOString(), // 16:00
        description: 'キャラクターアニメーションの作成',
        project: 'プロジェクトA'
      },
      {
        id: '5',
        title: '進捗確認ミーティング',
        type: 'meeting',
        startTime: new Date(startOfDay.getTime() + 16 * 60 * 60 * 1000).toISOString(), // 16:00
        endTime: new Date(startOfDay.getTime() + 17 * 60 * 60 * 1000).toISOString(), // 17:00
        description: '今日の進捗確認と明日の予定',
        location: '会議室B'
      },
      {
        id: '6',
        title: '納期',
        type: 'deadline',
        startTime: new Date(startOfDay.getTime() + 18 * 60 * 60 * 1000).toISOString(), // 18:00
        endTime: new Date(startOfDay.getTime() + 18 * 60 * 60 * 1000).toISOString(), // 18:00
        description: 'シーン3の納期',
        project: 'プロジェクトB'
      }
    ];
    
    setEvents(sampleEvents);
  }, [currentDate]);

  // イベントを時間帯ごとに分類
  const categorizedEvents = {
    morning: events.filter(event => {
      const hour = new Date(event.startTime).getHours();
      return hour >= 5 && hour < 12;
    }),
    afternoon: events.filter(event => {
      const hour = new Date(event.startTime).getHours();
      return hour >= 12 && hour < 17;
    }),
    evening: events.filter(event => {
      const hour = new Date(event.startTime).getHours();
      return hour >= 17 && hour < 22;
    }),
    night: events.filter(event => {
      const hour = new Date(event.startTime).getHours();
      return hour >= 22 || hour < 5;
    })
  };

  // セクションの展開/折りたたみを切り替える
  const toggleSection = (section: string) => {
    setExpandedSections(prev => {
      const newSet = new Set(prev);
      if (newSet.has(section)) {
        newSet.delete(section);
      } else {
        newSet.add(section);
      }
      return newSet;
    });
  };

  // イベントをクリックしたときの処理
  const handleEventClick = (event: CalendarEvent) => {
    setSelectedEvent(event);
    setShowDetailModal(true);
  };

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

  // イベントの種類に応じた色を返す
  const getEventColor = (type: string): string => {
    switch (type) {
      case 'meeting':
        return 'bg-blue-100 text-blue-800 border-blue-300';
      case 'deadline':
        return 'bg-red-100 text-red-800 border-red-300';
      case 'work':
        return 'bg-green-100 text-green-800 border-green-300';
      case 'break':
        return 'bg-yellow-100 text-yellow-800 border-yellow-300';
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

      {/* 時間帯ごとのセクション */}
      <div className="divide-y">
        {/* 朝のセクション */}
        <div className="border-b">
          <div 
            className="p-3 bg-gray-50 flex justify-between items-center cursor-pointer"
            onClick={() => toggleSection('morning')}
          >
            <h3 className="font-medium">朝（5:00 - 12:00）</h3>
            {expandedSections.has('morning') ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
          </div>
          
          {expandedSections.has('morning') && (
            <div className="p-2">
              {categorizedEvents.morning.length > 0 ? (
                <div className="space-y-2">
                  {categorizedEvents.morning.map((event, index) => (
                    <div 
                      key={index} 
                      className={`p-3 rounded-md border cursor-pointer ${getEventColor(event.type)}`}
                      onClick={() => handleEventClick(event)}
                    >
                      <div className="flex justify-between">
                        <span className="font-medium">{event.title}</span>
                        <span className="text-sm">
                          {formatTime(event.startTime)} - {formatTime(event.endTime)}
                        </span>
                      </div>
                      {event.description && (
                        <p className="text-sm mt-1 line-clamp-2">{event.description}</p>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-4 text-center text-gray-500">
                  予定はありません
                </div>
              )}
            </div>
          )}
        </div>
        
        {/* 午後のセクション */}
        <div className="border-b">
          <div 
            className="p-3 bg-gray-50 flex justify-between items-center cursor-pointer"
            onClick={() => toggleSection('afternoon')}
          >
            <h3 className="font-medium">午後（12:00 - 17:00）</h3>
            {expandedSections.has('afternoon') ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
          </div>
          
          {expandedSections.has('afternoon') && (
            <div className="p-2">
              {categorizedEvents.afternoon.length > 0 ? (
                <div className="space-y-2">
                  {categorizedEvents.afternoon.map((event, index) => (
                    <div 
                      key={index} 
                      className={`p-3 rounded-md border cursor-pointer ${getEventColor(event.type)}`}
                      onClick={() => handleEventClick(event)}
                    >
                      <div className="flex justify-between">
                        <span className="font-medium">{event.title}</span>
                        <span className="text-sm">
                          {formatTime(event.startTime)} - {formatTime(event.endTime)}
                        </span>
                      </div>
                      {event.description && (
                        <p className="text-sm mt-1 line-clamp-2">{event.description}</p>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-4 text-center text-gray-500">
                  予定はありません
                </div>
              )}
            </div>
          )}
        </div>
        
        {/* 夕方・夜のセクション */}
        <div className="border-b">
          <div 
            className="p-3 bg-gray-50 flex justify-between items-center cursor-pointer"
            onClick={() => toggleSection('evening')}
          >
            <h3 className="font-medium">夕方・夜（17:00 - 22:00）</h3>
            {expandedSections.has('evening') ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
          </div>
          
          {expandedSections.has('evening') && (
            <div className="p-2">
              {categorizedEvents.evening.length > 0 ? (
                <div className="space-y-2">
                  {categorizedEvents.evening.map((event, index) => (
                    <div 
                      key={index} 
                      className={`p-3 rounded-md border cursor-pointer ${getEventColor(event.type)}`}
                      onClick={() => handleEventClick(event)}
                    >
                      <div className="flex justify-between">
                        <span className="font-medium">{event.title}</span>
                        <span className="text-sm">
                          {formatTime(event.startTime)} - {formatTime(event.endTime)}
                        </span>
                      </div>
                      {event.description && (
                        <p className="text-sm mt-1 line-clamp-2">{event.description}</p>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-4 text-center text-gray-500">
                  予定はありません
                </div>
              )}
            </div>
          )}
        </div>
        
        {/* 深夜のセクション */}
        <div>
          <div 
            className="p-3 bg-gray-50 flex justify-between items-center cursor-pointer"
            onClick={() => toggleSection('night')}
          >
            <h3 className="font-medium">深夜（22:00 - 5:00）</h3>
            {expandedSections.has('night') ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
          </div>
          
          {expandedSections.has('night') && (
            <div className="p-2">
              {categorizedEvents.night.length > 0 ? (
                <div className="space-y-2">
                  {categorizedEvents.night.map((event, index) => (
                    <div 
                      key={index} 
                      className={`p-3 rounded-md border cursor-pointer ${getEventColor(event.type)}`}
                      onClick={() => handleEventClick(event)}
                    >
                      <div className="flex justify-between">
                        <span className="font-medium">{event.title}</span>
                        <span className="text-sm">
                          {formatTime(event.startTime)} - {formatTime(event.endTime)}
                        </span>
                      </div>
                      {event.description && (
                        <p className="text-sm mt-1 line-clamp-2">{event.description}</p>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-4 text-center text-gray-500">
                  予定はありません
                </div>
              )}
            </div>
          )}
        </div>
      </div>
      
      {/* イベント詳細モーダル */}
      {showDetailModal && selectedEvent && (
        <ScheduleDetailModal
          event={selectedEvent}
          onClose={() => setShowDetailModal(false)}
        />
      )}
    </div>
  );
};

export default ScheduleDayGantt; 