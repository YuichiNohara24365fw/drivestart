import React, { useState } from 'react';
import { CutGroup, CutEntry, StaffAssignment } from '../../types/koubanhyou';
import {
  ChevronDown,
  ChevronUp,
  Copy,
  Palette,
  Trash2,
  Settings,
} from 'lucide-react';
import KoubanHyouEntries from './KoubanHyouEntries';

interface KoubanHyouGroupProps {
  group: CutGroup;
  isExpanded: boolean;
  onToggle: () => void;
  onUpdateGroup: (field: keyof CutGroup, value: any) => void;
  onCopy: () => void;
  onDelete: () => void;
  onEditColor: () => void;
  editingColor: boolean;
  onColorChange: (color: string) => void;
  onAddEntry: (sourceEntry?: CutEntry) => void;
  onUpdateEntry: (entryId: string, field: keyof CutEntry, value: any) => void;
  onDeleteEntry: (entryId: string) => void;
  onAssignStaff: (entryId: string, assignment: StaffAssignment) => void;
  onRemoveStaffAssignment: (entryId: string, staffId: string) => void;
}

const KoubanHyouGroup: React.FC<KoubanHyouGroupProps> = ({
  group,
  isExpanded,
  onToggle,
  onUpdateGroup,
  onCopy,
  onDelete,
  onEditColor,
  editingColor,
  onColorChange,
  onAddEntry,
  onUpdateEntry,
  onDeleteEntry,
  onAssignStaff,
  onRemoveStaffAssignment,
}) => {
  const [showBulkSettings, setShowBulkSettings] = useState(false);
  const [bulkValues, setBulkValues] = useState({
    season: '',
    timeOfDay: '',
    weather: '',
    location: '',
    board: '',
    costume: '',
    costumeNotes: '',
    props: '',
    remarks: '',
  });

  const seasons = ['', '春', '夏', '秋', '冬'];
  const timeOfDays = ['', '朝', '昼', '夕方', '夜', '深夜', '未明'];
  const weathers = ['', '晴れ', '曇り', '雨', '雪', '霧', '嵐'];

  const handleBulkUpdate = () => {
    Object.entries(bulkValues).forEach(([field, value]) => {
      if (value !== '') {
        group.entries.forEach((entry) => {
          onUpdateEntry(entry.id, field as keyof CutEntry, value);
        });
      }
    });
    setShowBulkSettings(false);
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      <div className="p-4 border-b border-gray-200 bg-gray-50">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="grid grid-cols-3 gap-2">
              <input
                type="text"
                value={group.cutNo}
                onChange={(e) => onUpdateGroup('cutNo', e.target.value)}
                placeholder="パート"
                className="px-2 py-1 border rounded text-sm"
              />
              <input
                type="text"
                value={group.rangeStart}
                onChange={(e) => onUpdateGroup('rangeStart', e.target.value)}
                placeholder="カットNo開始"
                className="px-2 py-1 border rounded text-sm"
              />
              <input
                type="text"
                value={group.rangeEnd}
                onChange={(e) => onUpdateGroup('rangeEnd', e.target.value)}
                placeholder="カットNo終了"
                className="px-2 py-1 border rounded text-sm"
              />
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowBulkSettings(!showBulkSettings)}
              className="p-1 hover:bg-gray-100 rounded"
              title="一括設定"
            >
              <Settings className="w-4 h-4" />
            </button>
            <button
              onClick={onEditColor}
              className="p-1 hover:bg-gray-100 rounded"
              title="背景色を設定"
            >
              <Palette className="w-4 h-4" />
            </button>
            <button
              onClick={onCopy}
              className="p-1 hover:bg-gray-100 rounded"
              title="グループをコピー"
            >
              <Copy className="w-4 h-4" />
            </button>
            <button
              onClick={onDelete}
              className="p-1 hover:bg-red-100 rounded text-red-600"
              title="グループを削除"
            >
              <Trash2 className="w-4 h-4" />
            </button>
            <button
              onClick={onToggle}
              className="p-1 hover:bg-gray-100 rounded"
            >
              {isExpanded ? (
                <ChevronUp className="w-4 h-4" />
              ) : (
                <ChevronDown className="w-4 h-4" />
              )}
            </button>
            {editingColor && (
              <input
                type="color"
                value={group.backgroundColor || '#ffffff'}
                onChange={(e) => onColorChange(e.target.value)}
                className="w-6 h-6"
              />
            )}
          </div>
        </div>

        {showBulkSettings && (
          <div className="mt-4 p-4 bg-white rounded-lg border border-gray-200">
            <h4 className="text-sm font-medium mb-3">一括設定</h4>
            <div className="grid grid-cols-3 gap-4 mb-4">
              <div>
                <label className="block text-xs text-gray-500 mb-1">季節</label>
                <select
                  value={bulkValues.season}
                  onChange={(e) =>
                    setBulkValues({ ...bulkValues, season: e.target.value })
                  }
                  className="w-full px-2 py-1 border rounded text-sm"
                >
                  {seasons.map((season) => (
                    <option key={season} value={season}>
                      {season || '選択してください'}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">
                  時間帯
                </label>
                <select
                  value={bulkValues.timeOfDay}
                  onChange={(e) =>
                    setBulkValues({ ...bulkValues, timeOfDay: e.target.value })
                  }
                  className="w-full px-2 py-1 border rounded text-sm"
                >
                  {timeOfDays.map((time) => (
                    <option key={time} value={time}>
                      {time || '選択してください'}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">天気</label>
                <select
                  value={bulkValues.weather}
                  onChange={(e) =>
                    setBulkValues({ ...bulkValues, weather: e.target.value })
                  }
                  className="w-full px-2 py-1 border rounded text-sm"
                >
                  {weathers.map((weather) => (
                    <option key={weather} value={weather}>
                      {weather || '選択してください'}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-xs text-gray-500 mb-1">場所</label>
                <input
                  type="text"
                  value={bulkValues.location}
                  onChange={(e) =>
                    setBulkValues({ ...bulkValues, location: e.target.value })
                  }
                  className="w-full px-2 py-1 border rounded text-sm"
                  placeholder="場所を入力"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">
                  ボード
                </label>
                <input
                  type="text"
                  value={bulkValues.board}
                  onChange={(e) =>
                    setBulkValues({ ...bulkValues, board: e.target.value })
                  }
                  className="w-full px-2 py-1 border rounded text-sm"
                  placeholder="ボード番号を入力"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-xs text-gray-500 mb-1">衣装</label>
                <input
                  type="text"
                  value={bulkValues.costume}
                  onChange={(e) =>
                    setBulkValues({ ...bulkValues, costume: e.target.value })
                  }
                  className="w-full px-2 py-1 border rounded text-sm"
                  placeholder="衣装を入力"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">
                  衣装メモ
                </label>
                <input
                  type="text"
                  value={bulkValues.costumeNotes}
                  onChange={(e) =>
                    setBulkValues({
                      ...bulkValues,
                      costumeNotes: e.target.value,
                    })
                  }
                  className="w-full px-2 py-1 border rounded text-sm"
                  placeholder="衣装メモを入力"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-xs text-gray-500 mb-1">小物</label>
                <input
                  type="text"
                  value={bulkValues.props}
                  onChange={(e) =>
                    setBulkValues({ ...bulkValues, props: e.target.value })
                  }
                  className="w-full px-2 py-1 border rounded text-sm"
                  placeholder="小物を入力"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">備考</label>
                <input
                  type="text"
                  value={bulkValues.remarks}
                  onChange={(e) =>
                    setBulkValues({ ...bulkValues, remarks: e.target.value })
                  }
                  className="w-full px-2 py-1 border rounded text-sm"
                  placeholder="備考を入力"
                />
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowBulkSettings(false)}
                className="px-3 py-1 text-sm text-gray-600 hover:bg-gray-100 rounded"
              >
                キャンセル
              </button>
              <button
                onClick={handleBulkUpdate}
                className="px-3 py-1 text-sm bg-indigo-600 text-white rounded hover:bg-indigo-700"
              >
                一括適用
              </button>
            </div>
          </div>
        )}
      </div>

      {isExpanded && (
        <KoubanHyouEntries
          group={group}
          onAddEntry={onAddEntry}
          onUpdateEntry={onUpdateEntry}
          onDeleteEntry={onDeleteEntry}
          onAssignStaff={onAssignStaff}
          onRemoveStaffAssignment={onRemoveStaffAssignment}
          seasons={seasons}
          timeOfDays={timeOfDays}
          weathers={weathers}
        />
      )}
    </div>
  );
};

export default KoubanHyouGroup;
