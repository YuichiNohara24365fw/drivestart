import React from 'react';
import { X, MapPin, Clock, Calendar, Tag, Briefcase } from 'lucide-react';
import { CalendarEvent } from '../types/schedule';

interface ScheduleDetailModalProps {
  event: CalendarEvent;
  onClose: () => void;
}

const ScheduleDetailModal: React.FC<ScheduleDetailModalProps> = ({ event, onClose }) => {
  // 日付のフォーマット
  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const hours = date.getHours();
    const minutes = date.getMinutes();
    
    return `${year}年${month}月${day}日 ${hours}:${minutes.toString().padStart(2, '0')}`;
  };

  // イベントの種類に応じた色を返す
  const getEventColor = (type: string): string => {
    switch (type) {
      case 'meeting':
        return 'bg-blue-100 text-blue-800';
      case 'deadline':
        return 'bg-red-100 text-red-800';
      case 'work':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // 背景クリックでモーダルを閉じる
  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      onClick={handleBackdropClick}
    >
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4 overflow-hidden">
        {/* ヘッダー */}
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-xl font-bold">{event.title}</h2>
          <button 
            className="p-1 rounded-full hover:bg-gray-100"
            onClick={onClose}
          >
            <X size={20} />
          </button>
        </div>
        
        {/* イベント詳細 */}
        <div className="p-4">
          {/* イベントタイプ */}
          <div className="mb-4">
            <div className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${getEventColor(event.type)}`}>
              <div className="flex items-center">
                <Tag size={16} className="mr-1" />
                {event.type}
              </div>
            </div>
          </div>
          
          {/* 日時 */}
          <div className="mb-4 flex items-start">
            <Clock size={18} className="mr-2 mt-0.5 text-gray-500 flex-shrink-0" />
            <div>
              <div>{formatDate(event.startTime)}</div>
              <div>～</div>
              <div>{formatDate(event.endTime)}</div>
            </div>
          </div>
          
          {/* 場所 */}
          {event.location && (
            <div className="mb-4 flex items-start">
              <MapPin size={18} className="mr-2 mt-0.5 text-gray-500 flex-shrink-0" />
              <div>{event.location}</div>
            </div>
          )}
          
          {/* プロジェクト */}
          {event.project && (
            <div className="mb-4 flex items-start">
              <Briefcase size={18} className="mr-2 mt-0.5 text-gray-500 flex-shrink-0" />
              <div>{event.project}</div>
            </div>
          )}
          
          {/* 説明 */}
          {event.description && (
            <div className="mt-4 p-3 bg-gray-50 rounded-md">
              <p className="text-gray-700 whitespace-pre-line">{event.description}</p>
            </div>
          )}
        </div>
        
        {/* フッター */}
        <div className="p-4 border-t flex justify-end">
          <button
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            onClick={onClose}
          >
            閉じる
          </button>
        </div>
      </div>
    </div>
  );
};

export default ScheduleDetailModal; 