import React, { useState } from 'react';
import { X } from 'lucide-react';
import { CalendarEvent } from '../types/schedule';

interface AddScheduleModalProps {
  initialDate: Date;
  onClose: () => void;
  onSave: (event: CalendarEvent) => void;
}

const AddScheduleModal: React.FC<AddScheduleModalProps> = ({
  initialDate,
  onClose,
  onSave
}) => {
  const [title, setTitle] = useState('');
  const [type, setType] = useState('meeting');
  const [date, setDate] = useState(initialDate.toISOString().split('T')[0]);
  const [startTime, setStartTime] = useState('09:00');
  const [endTime, setEndTime] = useState('10:00');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('');
  const [project, setProject] = useState('');

  // 背景クリックでモーダルを閉じる
  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  // フォーム送信時の処理
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // 日付と時間を組み合わせてISOString形式に変換
    const startDateTime = new Date(`${date}T${startTime}`).toISOString();
    const endDateTime = new Date(`${date}T${endTime}`).toISOString();
    
    // イベントオブジェクトを作成
    const newEvent: CalendarEvent = {
      id: Date.now().toString(), // 一意のIDを生成
      title,
      type,
      startTime: startDateTime,
      endTime: endDateTime,
      description: description || undefined,
      location: location || undefined,
      project: project || undefined
    };
    
    onSave(newEvent);
  };

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      onClick={handleBackdropClick}
    >
      <div 
        className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4"
        onClick={e => e.stopPropagation()}
      >
        {/* ヘッダー */}
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-xl font-bold">スケジュール追加</h2>
          <button 
            className="p-1 rounded-full hover:bg-gray-100"
            onClick={onClose}
          >
            <X size={20} />
          </button>
        </div>
        
        {/* フォーム */}
        <form onSubmit={handleSubmit} className="p-4">
          {/* タイトル */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              タイトル *
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3 py-2 border rounded-md"
              required
            />
          </div>
          
          {/* タイプ */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              タイプ *
            </label>
            <select
              value={type}
              onChange={(e) => setType(e.target.value)}
              className="w-full px-3 py-2 border rounded-md"
            >
              <option value="meeting">ミーティング</option>
              <option value="work">作業</option>
              <option value="deadline">締切</option>
              <option value="other">その他</option>
            </select>
          </div>
          
          {/* 日付 */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              日付 *
            </label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full px-3 py-2 border rounded-md"
              required
            />
          </div>
          
          {/* 時間 */}
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                開始時間 *
              </label>
              <input
                type="time"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                className="w-full px-3 py-2 border rounded-md"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                終了時間 *
              </label>
              <input
                type="time"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                className="w-full px-3 py-2 border rounded-md"
                required
              />
            </div>
          </div>
          
          {/* 説明 */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              説明
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3 py-2 border rounded-md"
              rows={3}
            />
          </div>
          
          {/* 場所 */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              場所
            </label>
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="w-full px-3 py-2 border rounded-md"
            />
          </div>
          
          {/* プロジェクト */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              プロジェクト
            </label>
            <input
              type="text"
              value={project}
              onChange={(e) => setProject(e.target.value)}
              className="w-full px-3 py-2 border rounded-md"
            />
          </div>
          
          {/* ボタン */}
          <div className="flex justify-end space-x-2 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border rounded-md"
            >
              キャンセル
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              保存
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddScheduleModal; 