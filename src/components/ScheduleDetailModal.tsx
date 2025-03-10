import React from 'react';
import { X } from 'lucide-react';

interface ScheduleEvent {
  title: string;
  type: string;
  time: string;
  project: string;
}

interface ScheduleDetailModalProps {
  date: Date;
  events: ScheduleEvent[];
  onAddSchedule?: () => void;
  onClose: () => void;
}

const ScheduleDetailModal: React.FC<ScheduleDetailModalProps> = ({
  date,
  events,
  onAddSchedule,
  onClose
}) => {
  const getScheduleTypeColor = (type: string) => {
    const colors = {
      animation: 'from-blue-100 to-indigo-100 text-blue-800',
      background: 'from-emerald-100 to-teal-100 text-emerald-800',
      storyboard: 'from-purple-100 to-pink-100 text-purple-800',
      sound: 'from-amber-100 to-orange-100 text-amber-800',
      design: 'from-rose-100 to-pink-100 text-rose-800'
    };
    return colors[type as keyof typeof colors] || 'from-gray-100 to-gray-200 text-gray-800';
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-lg w-full max-w-lg">
        {/* ヘッダー */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold">
            {date.getFullYear()}年{date.getMonth() + 1}月{date.getDate()}日のスケジュール
          </h2>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* スケジュール一覧 */}
        <div className="p-4 max-h-[60vh] overflow-y-auto">
          {events.length > 0 ? (
            <div className="space-y-3">
              {events.map((event, index) => (
                <div
                  key={index}
                  className={`p-3 bg-gradient-to-r ${getScheduleTypeColor(event.type)} rounded-lg`}
                >
                  <div className="flex items-center justify-between">
                    <h3 className="font-medium">{event.title}</h3>
                    <span className="text-sm opacity-75">{event.time}</span>
                  </div>
                  <p className="text-sm mt-1 opacity-75">{event.type}</p>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              予定はありません
            </div>
          )}
        </div>

        {/* フッター */}
        <div className="p-4 border-t border-gray-200">
          <div className="flex gap-2">
            {onAddSchedule && (
              <button
                onClick={onAddSchedule}
                className="flex-1 px-4 py-2 text-sm text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg"
              >
                予定を追加
              </button>
            )}
            <button
              onClick={onClose}
              className="flex-1 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm"
            >
              閉じる
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ScheduleDetailModal