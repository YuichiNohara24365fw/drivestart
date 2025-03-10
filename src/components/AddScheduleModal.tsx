import React, { useState } from 'react';
import { X } from 'lucide-react';

interface AddScheduleModalProps {
  date: Date;
  time?: string;
  onClose: () => void;
  onAdd: (schedule: {
    title: string;
    type: string;
    time: string;
    duration: string;
  }) => void;
}

const AddScheduleModal: React.FC<AddScheduleModalProps> = ({
  date,
  time,
  onClose,
  onAdd
}) => {
  const [title, setTitle] = useState('');
  const [type, setType] = useState('storyboard');
  const [startTime, setStartTime] = useState(time || '09:00');
  const [duration, setDuration] = useState('1');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAdd({
      title,
      type,
      time: startTime,
      duration
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-md">
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold">
            予定の追加: {date.getFullYear()}年{date.getMonth() + 1}月{date.getDate()}日
          </h2>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-4 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              タイトル
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              種別
            </label>
            <select
              value={type}
              onChange={(e) => setType(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500"
            >
              <option value="storyboard">絵コンテ</option>
              <option value="animation">アニメーション</option>
              <option value="background">背景</option>
              <option value="sound">音響</option>
              <option value="design">デザイン</option>
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                開始時間
              </label>
              <input
                type="time"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                所要時間
              </label>
              <select
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500"
              >
                <option value="1">1時間</option>
                <option value="2">2時間</option>
                <option value="3">3時間</option>
                <option value="4">4時間</option>
                <option value="all">終日</option>
              </select>
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg"
            >
              キャンセル
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg"
            >
              追加
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddScheduleModal;