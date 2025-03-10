import React, { useState, useEffect } from 'react';
import {
  Plus,
  Save,
  Search,
  X,
  ChevronDown,
  Edit,
  FileSpreadsheet,
  Trash2,
} from 'lucide-react';
import { StaffEntry, Studio } from '../types/koubanhyou';
import {
  sampleEpisodes,
  sampleStaffEntries,
  sampleStudios,
} from '../data/sampleData';
import * as XLSX from 'xlsx';

interface StaffKoubanHyouProps {
  episodeId?: string;
}

const StaffKoubanHyou: React.FC<StaffKoubanHyouProps> = ({ episodeId }) => {
  const episode = episodeId
    ? sampleEpisodes.find((ep) => ep.id === episodeId)
    : null;
  const [entries, setEntries] = useState<StaffEntry[]>(
    episode?.staff || sampleStaffEntries
  );
  const [searchDialogOpen, setSearchDialogOpen] = useState(false);
  const [selectedRole, setSelectedRole] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStudio, setSelectedStudio] = useState<Studio | null>(null);
  const [departmentFilter, setDepartmentFilter] = useState<string>('');
  const [editingEntryId, setEditingEntryId] = useState<string | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(
    null
  );
  const [staffSearchTerm, setStaffSearchTerm] = useState('');

  const roles = [
    {
      value: 'director',
      label: '監督',
      labelEn: 'Director',
      department: '演出',
    },
    {
      value: 'subDirector',
      label: '監督補佐',
      labelEn: 'Sub Director',
      department: '演出',
    },
    {
      value: 'storyboard',
      label: 'コンテ',
      labelEn: 'Story Board',
      department: 'コンテ',
    },
    {
      value: 'animator',
      label: '作画監督',
      labelEn: 'Animation Director',
      department: 'アニメーション',
    },
    {
      value: 'drawingChecker',
      label: '動画検査',
      labelEn: 'Drawing Checker',
      department: '動画検査',
    },
    {
      value: 'paintChecker',
      label: '色指定',
      labelEn: 'Paint Checker',
      department: '彩色',
    },
    {
      value: 'artboard',
      label: '背景',
      labelEn: 'Art Board',
      department: '背景',
    },
    {
      value: 'productionManager',
      label: '制作進行',
      labelEn: 'Production Manager',
      department: '制作進行',
    },
  ];

  const allDepartments = Array.from(
    new Set(roles.map((role) => role.department))
  );

  useEffect(() => {
    if (selectedRole) {
      const role = roles.find((r) => r.value === selectedRole);
      if (role) {
        setDepartmentFilter(role.department);
      }
    }
  }, [selectedRole]);

  const openSearchDialog = (entryId?: string) => {
    if (entryId) {
      const entry = entries.find((e) => e.id === entryId);
      if (entry) {
        const role = roles.find((r) => r.label === entry.role);
        setSelectedRole(role?.value || '');
        setDepartmentFilter(role?.department || '');
        setEditingEntryId(entryId);
      }
    } else {
      setEditingEntryId(null);
      setSelectedRole('');
      setDepartmentFilter('');
    }
    setSearchDialogOpen(true);
    setSearchTerm('');
  };

  const handleStaffSelect = (studio: Studio) => {
    setSelectedStudio(studio);
    if (editingEntryId) {
      // 既存のエントリーを更新
      setEntries(
        entries.map((entry) =>
          entry.id === editingEntryId
            ? {
                ...entry,
                studio: studio.name,
                department: studio.departments[0],
              }
            : entry
        )
      );
    } else {
      // 新規エントリーを追加
      const newEntry: StaffEntry = {
        id: `staff${entries.length + 1}`,
        name: '',
        nameEn: '',
        role: selectedRole
          ? roles.find((r) => r.value === selectedRole)?.label || ''
          : '',
        roleEn: selectedRole
          ? roles.find((r) => r.value === selectedRole)?.labelEn || ''
          : '',
        studio: studio.name,
        department: studio.departments[0],
        order: entries.length + 1,
        status: 'active',
      };
      setEntries([...entries, newEntry]);
    }
    closeSearchDialog();
  };

  const closeSearchDialog = () => {
    setSearchDialogOpen(false);
    setSelectedRole('');
    setSearchTerm('');
    setSelectedStudio(null);
    setDepartmentFilter('');
    setEditingEntryId(null);
  };

  const updateEntry = (id: string, field: keyof StaffEntry, value: string) => {
    setEntries(
      entries.map((entry) =>
        entry.id === id ? { ...entry, [field]: value } : entry
      )
    );
  };

  const deleteEntry = (id: string) => {
    setEntries(entries.filter((entry) => entry.id !== id));
    setShowDeleteConfirm(null);
  };

  const filteredStudios = sampleStudios.filter((studio) => {
    const matchesSearch = studio.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesDepartment =
      !departmentFilter || studio.departments.includes(departmentFilter);
    const matchesRole =
      !selectedRole ||
      studio.departments.some((dept) => {
        const role = roles.find((r) => r.value === selectedRole);
        return role && dept.includes(role.department);
      });
    return matchesSearch && matchesDepartment && matchesRole;
  });

  const filteredEntries = entries.filter((entry) => {
    if (!staffSearchTerm) return true;
    const searchLower = staffSearchTerm.toLowerCase();
    return (
      entry.name.toLowerCase().includes(searchLower) ||
      entry.nameEn.toLowerCase().includes(searchLower) ||
      entry.role.toLowerCase().includes(searchLower) ||
      entry.roleEn.toLowerCase().includes(searchLower) ||
      entry.studio.toLowerCase().includes(searchLower)
    );
  });

  const exportToExcel = () => {
    const exportData = entries.map((entry) => ({
      役職: entry.role,
      Role: entry.roleEn,
      氏名: entry.name,
      Name: entry.nameEn,
      スタジオ: entry.studio,
      部門: entry.department,
    }));

    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.json_to_sheet(exportData);

    const columnWidths = [
      { wch: 15 }, // 役職
      { wch: 20 }, // Role
      { wch: 20 }, // 氏名
      { wch: 20 }, // Name
      { wch: 25 }, // スタジオ
      { wch: 15 }, // 部門
    ];
    ws['!cols'] = columnWidths;

    XLSX.utils.book_append_sheet(wb, ws, 'スタッフ一覧');

    const fileName = episode
      ? `スタッフ一覧_第${episode.number}話_${
          new Date().toISOString().split('T')[0]
        }.xlsx`
      : `スタッフ一覧_${new Date().toISOString().split('T')[0]}.xlsx`;
    XLSX.writeFile(wb, fileName);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4 bg-white rounded-lg border border-gray-200 p-2">
        <Search className="w-5 h-5 text-gray-400" />
        <input
          type="text"
          value={staffSearchTerm}
          onChange={(e) => setStaffSearchTerm(e.target.value)}
          placeholder="スタッフ名、役職、スタジオで検索..."
          className="flex-1 border-none focus:ring-0 text-sm"
        />
        {staffSearchTerm && (
          <button
            onClick={() => setStaffSearchTerm('')}
            className="p-1 hover:bg-gray-100 rounded-full"
          >
            <X className="w-4 h-4 text-gray-400" />
          </button>
        )}
      </div>

      {searchDialogOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-2xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium">
                {editingEntryId ? 'スタッフ情報の変更' : 'スタッフ検索'}
              </h3>
              <button
                onClick={closeSearchDialog}
                className="p-1 hover:bg-gray-100 rounded"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    部門
                  </label>
                  <div className="relative">
                    <select
                      value={departmentFilter}
                      onChange={(e) => setDepartmentFilter(e.target.value)}
                      className="w-full px-3 py-2 border rounded-lg text-sm appearance-none"
                    >
                      <option value="">全ての部門</option>
                      {allDepartments.map((dept) => (
                        <option key={dept} value={dept}>
                          {dept}
                        </option>
                      ))}
                    </select>
                    <ChevronDown className="w-4 h-4 text-gray-400 absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none" />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    役職
                  </label>
                  <div className="relative">
                    <select
                      value={selectedRole}
                      onChange={(e) => setSelectedRole(e.target.value)}
                      className="w-full px-3 py-2 border rounded-lg text-sm appearance-none"
                    >
                      <option value="">選択してください</option>
                      {roles
                        .filter(
                          (role) =>
                            !departmentFilter ||
                            role.department === departmentFilter
                        )
                        .map((role) => (
                          <option key={role.value} value={role.value}>
                            {role.label} ({role.labelEn})
                          </option>
                        ))}
                    </select>
                    <ChevronDown className="w-4 h-4 text-gray-400 absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none" />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  スタジオ検索
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="スタジオ名で検索..."
                    className="w-full pl-10 pr-4 py-2 border rounded-lg text-sm"
                  />
                  <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                </div>
              </div>

              <div className="border rounded-lg overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">
                        スタジオ名
                      </th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">
                        対応部門
                      </th>
                      <th className="px-4 py-2 text-center text-xs font-medium text-gray-500">
                        操作
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {filteredStudios.length > 0 ? (
                      filteredStudios.map((studio) => (
                        <tr key={studio.id} className="hover:bg-gray-50">
                          <td className="px-4 py-2 text-sm">{studio.name}</td>
                          <td className="px-4 py-2 text-sm">
                            {studio.departments.join(', ')}
                          </td>
                          <td className="px-4 py-2 text-center">
                            <button
                              onClick={() => handleStaffSelect(studio)}
                              className="px-3 py-1 bg-indigo-100 text-indigo-700 rounded text-sm hover:bg-indigo-200"
                            >
                              選択
                            </button>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td
                          colSpan={3}
                          className="px-4 py-8 text-center text-gray-500"
                        >
                          該当するスタジオが見つかりません
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr className="text-[11px] text-gray-500 uppercase tracking-wider">
              <th className="px-2 py-1.5 text-left">役職</th>
              <th className="px-2 py-1.5 text-left">英語表記</th>
              <th className="px-2 py-1.5 text-left">氏名</th>
              <th className="px-2 py-1.5 text-left">英語表記</th>
              <th className="px-2 py-1.5 text-left">スタジオ</th>
              <th className="px-2 py-1.5 text-center">操作</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 text-xs">
            {filteredEntries.map((entry) => (
              <tr key={entry.id}>
                <td className="px-2 py-1.5">
                  <select
                    value={
                      roles.find((r) => r.label === entry.role)?.value || ''
                    }
                    onChange={(e) => {
                      const role = roles.find(
                        (r) => r.value === e.target.value
                      );
                      if (role) {
                        updateEntry(entry.id, 'role', role.label);
                        updateEntry(entry.id, 'roleEn', role.labelEn);
                      }
                    }}
                    className="w-32 px-1.5 py-0.5 border rounded text-xs"
                  >
                    <option value="">選択してください</option>
                    {roles.map((role) => (
                      <option key={role.value} value={role.value}>
                        {role.label}
                      </option>
                    ))}
                  </select>
                </td>
                <td className="px-2 py-1.5">
                  <input
                    type="text"
                    value={entry.roleEn}
                    readOnly
                    className="w-32 px-1.5 py-0.5 border rounded text-xs bg-gray-50"
                  />
                </td>
                <td className="px-2 py-1.5">
                  <input
                    type="text"
                    value={entry.name}
                    onChange={(e) =>
                      updateEntry(entry.id, 'name', e.target.value)
                    }
                    className="w-32 px-1.5 py-0.5 border rounded text-xs"
                  />
                </td>
                <td className="px-2 py-1.5">
                  <input
                    type="text"
                    value={entry.nameEn}
                    onChange={(e) =>
                      updateEntry(entry.id, 'nameEn', e.target.value)
                    }
                    className="w-32 px-1.5 py-0.5 border rounded text-xs"
                  />
                </td>
                <td className="px-2 py-1.5">
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={entry.studio}
                      readOnly
                      className="w-32 px-1.5 py-0.5 border rounded text-xs bg-gray-50"
                    />
                  </div>
                </td>
                <td className="px-2 py-1.5 text-center">
                  <div className="flex items-center justify-center gap-2">
                    <button
                      onClick={() => openSearchDialog(entry.id)}
                      className="p-1 hover:bg-indigo-50 rounded text-indigo-600"
                      title="スタジオを変更"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setShowDeleteConfirm(entry.id)}
                      className="p-1 hover:bg-red-50 rounded text-red-600"
                      title="行を削除"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* 削除確認ダイアログ */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-sm w-full">
            <h3 className="text-lg font-medium mb-4">スタッフの削除</h3>
            <p className="text-gray-600 mb-6">
              このスタッフを削除してもよろしいですか？
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowDeleteConfirm(null)}
                className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg"
              >
                キャンセル
              </button>
              <button
                onClick={() => deleteEntry(showDeleteConfirm)}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
              >
                削除
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StaffKoubanHyou;
