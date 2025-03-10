import React, { useState } from 'react';
import { X, ChevronDown, Edit, Users, ArrowUpCircle, ArrowDownCircle, Trash2, Plus, Copy } from 'lucide-react';
import { CutGroup, CutEntry, StaffAssignment } from '../../types/koubanhyou';
import StaffAssignmentModal from './StaffAssignmentModal';
import { characters } from '../../data/sampleData';

interface KoubanHyouEntriesProps {
  group: CutGroup;
  onAddEntry: (sourceEntry?: CutEntry) => void;
  onUpdateEntry: (entryId: string, field: keyof CutEntry, value: any) => void;
  onDeleteEntry: (entryId: string) => void;
  onAssignStaff: (entryId: string, assignment: StaffAssignment) => void;
  onRemoveStaffAssignment: (entryId: string, staffId: string) => void;
  seasons: string[];
  timeOfDays: string[];
  weathers: string[];
}

const KoubanHyouEntries: React.FC<KoubanHyouEntriesProps> = ({
  group,
  onAddEntry,
  onUpdateEntry,
  onDeleteEntry,
  onAssignStaff,
  onRemoveStaffAssignment,
  seasons,
  timeOfDays,
  weathers,
}) => {
  const [showCharacterDropdown, setShowCharacterDropdown] = useState<string | null>(null);
  const [editingCharacter, setEditingCharacter] = useState<string | null>(null);
  const [showStaffDialog, setShowStaffDialog] = useState<string | null>(null);
  const [showRangeDialog, setShowRangeDialog] = useState(false);

  const handleCharacterSelect = (entryId: string, character: string) => {
    onUpdateEntry(entryId, 'characters', [character]);
    setShowCharacterDropdown(null);
  };

  const handleCharacterEdit = (entryId: string, value: string) => {
    onUpdateEntry(entryId, 'characters', [value]);
  };

  const handleCopyEntry = (sourceEntry: CutEntry) => {
    onAddEntry(sourceEntry);
  };

  const renderStaffCell = (entry: CutEntry) => {
    const currentStaff = entry.assignedStaff && entry.assignedStaff[0];
    let staffName = '未割当';
    let staffNameEn = '';
    let staffRole = '';

    if (currentStaff) {
      if (currentStaff.isTemporary) {
        const staffCode = currentStaff.staffId.replace('temp_', '');
        staffName = `要員${staffCode}`;
        staffNameEn = `Staff ${staffCode}`;
        staffRole = currentStaff.role;
      } else {
        staffName = currentStaff.name;
        staffNameEn = currentStaff.nameEn;
        staffRole = currentStaff.role;
      }
    }

    return (
      <div className="flex items-center gap-2">
        <button
          onClick={() => setShowStaffDialog(entry.id)}
          className="p-1 hover:bg-indigo-50 rounded text-indigo-600"
          title="スタッフを割り当て"
        >
          <Users className="w-3.5 h-3.5" />
        </button>
        <div className="flex flex-col">
          <span className="text-xs font-medium">{staffName}</span>
          {staffNameEn && (
            <span className="text-xs text-gray-500">{staffNameEn}</span>
          )}
          {staffRole && (
            <span className="text-xs text-gray-500">{staffRole}</span>
          )}
        </div>
      </div>
    );
  };

  const handleAddRange = () => {
    const start = parseInt(group.rangeStart);
    const end = parseInt(group.rangeEnd);

    if (!isNaN(start) && !isNaN(end) && start <= end) {
      const count = end - start + 1;
      for (let i = 0; i < count; i++) {
        onAddEntry();
      }
    }

    setShowRangeDialog(false);
  };

  return (
    <div className="p-4">
      <div className="mb-4 flex items-center gap-2">
        <button
          onClick={() => onAddEntry()}
          className="p-2 bg-indigo-100 text-indigo-700 rounded-lg hover:bg-indigo-200"
          title="新規行を追加"
        >
          <Plus className="w-4 h-4" />
        </button>
        <button
          onClick={() => setShowRangeDialog(true)}
          className="flex items-center gap-1 px-3 py-1.5 bg-indigo-100 text-indigo-700 rounded-lg text-sm hover:bg-indigo-200"
        >
          <Plus className="w-3.5 h-3.5" />
          カット範囲で追加
        </button>
      </div>

      <table className="w-full border-collapse text-sm">
        <thead>
          <tr className="text-[11px] text-gray-500 uppercase tracking-wider">
            <th className="px-2 py-1.5 text-center">カットNo.</th>
            <th className="px-2 py-1.5 text-center">枝番</th>
            <th className="px-2 py-1.5 text-left">季節</th>
            <th className="px-2 py-1.5 text-left">時間帯</th>
            <th className="px-2 py-1.5 text-left">天気</th>
            <th className="px-2 py-1.5 text-left">場所</th>
            <th className="px-2 py-1.5 text-left">ボード</th>
            <th className="px-2 py-1.5 text-left">キャラクター</th>
            <th className="px-2 py-1.5 text-left">衣装</th>
            <th className="px-2 py-1.5 text-left">衣装メモ</th>
            <th className="px-2 py-1.5 text-left">小物</th>
            <th className="px-2 py-1.5 text-left">備考</th>
            <th className="px-2 py-1.5 text-left">スタッフ</th>
            <th className="px-2 py-1.5 text-center">操作</th>
          </tr>
        </thead>
        <tbody>
          {group.entries.map((entry, index) => {
            const cutNumber = group.rangeStart ? 
              String(parseInt(group.rangeStart) + index).padStart(3, '0') : 
              String(index + 1).padStart(3, '0');

            return (
              <tr key={entry.id}>
                <td className="px-2 py-1.5 w-12 text-center">
                  <div className="flex items-center gap-2">
                    <div className="flex flex-col gap-0.5">
                      <button
                        onClick={() => moveEntry(index, 'up')}
                        disabled={index === 0}
                        className={`p-1 rounded-full transition-colors ${
                          index === 0
                            ? 'text-gray-300 cursor-not-allowed'
                            : 'text-indigo-600 hover:bg-indigo-50 active:bg-indigo-100'
                        }`}
                        title="上へ移動"
                      >
                        <ArrowUpCircle className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => moveEntry(index, 'down')}
                        disabled={index === group.entries.length - 1}
                        className={`p-1 rounded-full transition-colors ${
                          index === group.entries.length - 1
                            ? 'text-gray-300 cursor-not-allowed'
                            : 'text-indigo-600 hover:bg-indigo-50 active:bg-indigo-100'
                        }`}
                        title="下へ移動"
                      >
                        <ArrowDownCircle className="w-4 h-4" />
                      </button>
                    </div>
                    <span className="text-gray-500">{cutNumber}</span>
                  </div>
                </td>
                <td className="px-2 py-1.5">
                  <input
                    type="text"
                    value={entry.branchNo || ''}
                    onChange={(e) => {
                      const value = e.target.value.toUpperCase();
                      if (value === '' || /^[A-Z]$/.test(value)) {
                        onUpdateEntry(entry.id, 'branchNo', value);
                      }
                    }}
                    maxLength={1}
                    className="w-12 px-1.5 py-0.5 border rounded text-xs text-center uppercase"
                    placeholder="枝番"
                  />
                </td>
                <td className="px-2 py-1.5">
                  <select
                    value={entry.season}
                    onChange={(e) =>
                      onUpdateEntry(entry.id, 'season', e.target.value)
                    }
                    className="w-16 px-1.5 py-0.5 border rounded text-xs"
                  >
                    {seasons.map((season) => (
                      <option key={season} value={season}>
                        {season}
                      </option>
                    ))}
                  </select>
                </td>
                <td className="px-2 py-1.5">
                  <select
                    value={entry.timeOfDay}
                    onChange={(e) =>
                      onUpdateEntry(entry.id, 'timeOfDay', e.target.value)
                    }
                    className="w-16 px-1.5 py-0.5 border rounded text-xs"
                  >
                    {timeOfDays.map((time) => (
                      <option key={time} value={time}>
                        {time}
                      </option>
                    ))}
                  </select>
                </td>
                <td className="px-2 py-1.5">
                  <select
                    value={entry.weather}
                    onChange={(e) =>
                      onUpdateEntry(entry.id, 'weather', e.target.value)
                    }
                    className="w-16 px-1.5 py-0.5 border rounded text-xs"
                  >
                    {weathers.map((weather) => (
                      <option key={weather} value={weather}>
                        {weather}
                      </option>
                    ))}
                  </select>
                </td>
                <td className="px-2 py-1.5">
                  <input
                    type="text"
                    value={entry.location}
                    onChange={(e) =>
                      onUpdateEntry(entry.id, 'location', e.target.value)
                    }
                    className="w-32 px-1.5 py-0.5 border rounded text-xs"
                  />
                </td>
                <td className="px-2 py-1.5">
                  <input
                    type="text"
                    value={entry.board}
                    onChange={(e) =>
                      onUpdateEntry(entry.id, 'board', e.target.value)
                    }
                    className="w-20 px-1.5 py-0.5 border rounded text-xs"
                  />
                </td>
                <td className="px-2 py-1.5">
                  <div className="relative">
                    {editingCharacter === entry.id ? (
                      <div className="flex items-center gap-1">
                        <input
                          type="text"
                          value={entry.characters[0] || ''}
                          onChange={(e) =>
                            handleCharacterEdit(entry.id, e.target.value)
                          }
                          className="w-32 px-1.5 py-0.5 border rounded text-xs"
                          autoFocus
                          onBlur={() => setEditingCharacter(null)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                              setEditingCharacter(null);
                            }
                          }}
                        />
                      </div>
                    ) : (
                      <div className="flex items-center gap-1">
                        <div
                          onClick={() =>
                            setShowCharacterDropdown(
                              showCharacterDropdown === entry.id ? null : entry.id
                            )
                          }
                          className="w-32 px-1.5 py-0.5 border rounded text-xs flex items-center justify-between cursor-pointer hover:bg-gray-50"
                        >
                          <span className="truncate">
                            {entry.characters[0]
                              ? characters.find(
                                  (c) => c.code === entry.characters[0]
                                )?.name || entry.characters[0]
                              : '選択してください'}
                          </span>
                          <ChevronDown className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" />
                        </div>
                        <button
                          onClick={() => setEditingCharacter(entry.id)}
                          className="p-1 hover:bg-gray-100 rounded"
                          title="直接入力"
                        >
                          <Edit className="w-3.5 h-3.5 text-gray-400" />
                        </button>
                      </div>
                    )}
                    {showCharacterDropdown === entry.id && (
                      <div className="absolute z-10 mt-1 w-48 bg-white border border-gray-200 rounded-lg shadow-lg py-1">
                        {characters.map((char) => (
                          <button
                            key={char.id}
                            onClick={() =>
                              handleCharacterSelect(entry.id, char.code)
                            }
                            className={`w-full px-3 py-1.5 text-left hover:bg-gray-50 ${
                              entry.characters[0] === char.code
                                ? 'bg-indigo-50 text-indigo-600'
                                : ''
                            }`}
                          >
                            {char.name}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </td>
                <td className="px-2 py-1.5">
                  <input
                    type="text"
                    value={entry.costume}
                    onChange={(e) =>
                      onUpdateEntry(entry.id, 'costume', e.target.value)
                    }
                    className="w-32 px-1.5 py-0.5 border rounded text-xs"
                  />
                </td>
                <td className="px-2 py-1.5">
                  <input
                    type="text"
                    value={entry.costumeNotes}
                    onChange={(e) =>
                      onUpdateEntry(entry.id, 'costumeNotes', e.target.value)
                    }
                    className="w-32 px-1.5 py-0.5 border rounded text-xs"
                  />
                </td>
                <td className="px-2 py-1.5">
                  <input
                    type="text"
                    value={entry.props}
                    onChange={(e) =>
                      onUpdateEntry(entry.id, 'props', e.target.value)
                    }
                    className="w-32 px-1.5 py-0.5 border rounded text-xs"
                  />
                </td>
                <td className="px-2 py-1.5">
                  <input
                    type="text"
                    value={entry.remarks}
                    onChange={(e) =>
                      onUpdateEntry(entry.id, 'remarks', e.target.value)
                    }
                    className="w-32 px-1.5 py-0.5 border rounded text-xs"
                  />
                </td>
                <td className="px-2 py-1.5">{renderStaffCell(entry)}</td>
                <td className="px-2 py-1.5 text-center">
                  <div className="flex items-center justify-center gap-1">
                    <button
                      onClick={() => handleCopyEntry(entry)}
                      className="p-1 hover:bg-indigo-50 rounded text-indigo-600"
                      title="行をコピー"
                    >
                      <Copy className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => onDeleteEntry(entry.id)}
                      className="p-1 hover:bg-red-100 rounded text-red-600"
                      title="行を削除"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>

      {showStaffDialog && (
        <StaffAssignmentModal
          onClose={() => setShowStaffDialog(null)}
          onAssign={(assignment) => {
            if (showStaffDialog) {
              const entry = group.entries.find((e) => e.id === showStaffDialog);
              if (entry && entry.assignedStaff.length > 0) {
                onRemoveStaffAssignment(
                  showStaffDialog,
                  entry.assignedStaff[0].staffId
                );
              }
              onAssignStaff(showStaffDialog, assignment);
            }
            setShowStaffDialog(null);
          }}
          currentAssignment={
            group.entries.find((e) => e.id === showStaffDialog)?.assignedStaff[0]
          }
        />
      )}

      {showRangeDialog && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-sm w-full">
            <h3 className="text-lg font-medium mb-4">カット範囲の追加</h3>
            <p className="text-sm text-gray-600 mb-4">
              {group.rangeStart && group.rangeEnd ? (
                <>
                  カット範囲 {group.rangeStart} から {group.rangeEnd} まで、
                  {parseInt(group.rangeEnd) - parseInt(group.rangeStart) + 1}
                  行を追加します。
                </>
              ) : (
                'カット範囲が設定されていません。'
              )}
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowRangeDialog(false)}
                className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg"
              >
                キャンセル
              </button>
              <button
                onClick={handleAddRange}
                className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
                disabled={!group.rangeStart || !group.rangeEnd}
              >
                追加
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default KoubanHyouEntries;