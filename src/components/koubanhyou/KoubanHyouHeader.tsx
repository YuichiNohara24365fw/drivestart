import React from 'react';
import { FileText, Users, FileSpreadsheet, Plus, Table } from 'lucide-react';

interface KoubanHyouHeaderProps {
  title: string;
  lastModified?: string;
  totalCuts?: number;
  activeTab: 'setting' | 'staff' | 'overview';
  onTabChange: (tab: 'setting' | 'staff' | 'overview') => void;
  onExport: () => void;
  onAddGroup: () => void;
}

const KoubanHyouHeader: React.FC<KoubanHyouHeaderProps> = ({
  title,
  lastModified,
  totalCuts,
  activeTab,
  onTabChange,
  onExport,
  onAddGroup
}) => {
  return (
    <div className="flex items-center justify-between">
      <div>
        <h1 className="text-xl font-bold text-gray-900">{title}</h1>
        {lastModified && totalCuts && (
          <p className="mt-0.5 text-xs text-gray-500">
            最終更新: {new Date(lastModified).toLocaleDateString('ja-JP')} | 
            総カット数: {totalCuts}カット
          </p>
        )}
      </div>
      <div className="flex items-center gap-4">
        <div className="flex rounded-lg border border-gray-200 p-1 bg-white">
          <button
            onClick={() => onTabChange('setting')}
            className={`px-4 py-1.5 rounded-md text-sm font-medium flex items-center gap-1 ${
              activeTab === 'setting'
                ? 'bg-indigo-100 text-indigo-800'
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            <FileText className="w-4 h-4" />
            設定・背景
          </button>
          <button
            onClick={() => onTabChange('staff')}
            className={`px-4 py-1.5 rounded-md text-sm font-medium flex items-center gap-1 ${
              activeTab === 'staff'
                ? 'bg-indigo-100 text-indigo-800'
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            <Users className="w-4 h-4" />
            スタッフ
          </button>
          <button
            onClick={() => onTabChange('overview')}
            className={`px-4 py-1.5 rounded-md text-sm font-medium flex items-center gap-1 ${
              activeTab === 'overview'
                ? 'bg-indigo-100 text-indigo-800'
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            <Table className="w-4 h-4" />
            一覧表示
          </button>
        </div>
        <button
          onClick={onExport}
          className="flex items-center gap-1 px-3 py-1.5 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700"
        >
          <FileSpreadsheet className="w-3.5 h-3.5" />
          Excel出力
        </button>
        {activeTab === 'setting' && (
          <button
            onClick={onAddGroup}
            className="flex items-center gap-1 px-3 py-1.5 bg-indigo-600 text-white text-sm rounded-lg hover:bg-indigo-700"
          >
            <Plus className="w-3.5 h-3.5" />
            新規カット
          </button>
        )}
      </div>
    </div>
  );
};

export default KoubanHyouHeader;