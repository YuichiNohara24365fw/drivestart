import React, { useState } from 'react';
import { CutInfo } from '../types';
import { Filter, Plus, Search, BarChart, Clock, AlertTriangle, Tag, FileText, Eye } from 'lucide-react';

// サンプルデータを拡張
const sampleCuts: CutInfo[] = [
  {
    id: '1',
    cutNumber: 'c0002',
    episodeNumber: 1,
    sceneNumber: 'A1',
    thumbnailUrl: 'https://images.unsplash.com/photo-1616628188859-7a11abb6fcc9?auto=format&fit=crop&q=80',
    status: 'in_review',
    dueDate: '2024-03-15',
    duration: 4.5,
    complexity: 'high',
    priority: 'high',
    retakeCount: 2,
    lastReviewDate: '2024-03-01',
    notes: '背景の明るさ調整が必要\n- 夕暮れの色調整\n- キャラクターの影の方向修正',
    assignedStaff: [
      { id: '1', name: '山北', role: '作画', department: 'アニメーション' },
      { id: '2', name: 'EOTA撮影部', role: '撮影', department: '撮影' }
    ],
    workProgress: {
      layout: 100,
      keyAnimation: 90,
      inbetween: 80,
      background: 70,
      coloring: 60,
      effects: 50,
      compositing: 40
    },
    tags: ['アクション', '特殊効果', '群衆'],
    references: [
      'https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&q=80'
    ],
    previousVersions: [
      {
        version: 1,
        date: '2024-02-28',
        changes: '初回レイアウト提出',
        reviewedBy: '鈴木監督'
      }
    ]
  },
  {
    id: '2',
    cutNumber: 'c0003',
    episodeNumber: 1,
    sceneNumber: 'A1',
    thumbnailUrl: 'https://images.unsplash.com/photo-1616628188859-7a11abb6fcc9?auto=format&fit=crop&q=80',
    status: 'needs_revision',
    dueDate: '2024-03-10',
    duration: 3.2,
    complexity: 'medium',
    priority: 'medium',
    retakeCount: 1,
    lastReviewDate: '2024-03-02',
    notes: 'キャラクターの表情修正\n- 目の動きを自然に\n- 口パクのタイミング調整',
    assignedStaff: [
      { id: '3', name: 'ぱやし', role: '作画', department: 'アニメーション' }
    ],
    workProgress: {
      layout: 100,
      keyAnimation: 100,
      inbetween: 90,
      background: 100,
      coloring: 80,
      effects: 0,
      compositing: 0
    },
    tags: ['表情', 'アップショット'],
    references: [],
    previousVersions: [
      {
        version: 1,
        date: '2024-02-25',
        changes: '初回提出',
        reviewedBy: '田中作監'
      }
    ]
  },
  {
    id: '3',
    cutNumber: 'c0004',
    episodeNumber: 1,
    sceneNumber: 'A2',
    thumbnailUrl: 'https://images.unsplash.com/photo-1616628188859-7a11abb6fcc9?auto=format&fit=crop&q=80',
    status: 'completed',
    dueDate: '2024-03-20',
    duration: 2.8,
    complexity: 'low',
    priority: 'low',
    retakeCount: 0,
    lastReviewDate: '2024-03-03',
    notes: '完了',
    assignedStaff: [
      { id: '4', name: '佐藤', role: '作画', department: 'アニメーション' }
    ],
    workProgress: {
      layout: 100,
      keyAnimation: 100,
      inbetween: 100,
      background: 100,
      coloring: 100,
      effects: 100,
      compositing: 100
    },
    tags: ['日常'],
    references: [],
    previousVersions: []
  }
];

const CutManagement: React.FC = () => {
  const [cuts] = useState<CutInfo[]>(sampleCuts);
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [selectedStaff, setSelectedStaff] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list');
  const [expandedCut, setExpandedCut] = useState<string | null>(null);

  const getStatusColor = (status: CutInfo['status']) => {
    const colors = {
      not_ordered: 'bg-gray-100 text-gray-800',
      ordered: 'bg-blue-100 text-blue-800',
      in_review: 'bg-yellow-100 text-yellow-800',
      needs_revision: 'bg-red-100 text-red-800',
      completed: 'bg-green-100 text-green-800'
    };
    return colors[status];
  };

  const getStatusText = (status: CutInfo['status']) => {
    const texts = {
      not_ordered: '発注前',
      ordered: '発注済',
      in_review: '作監チェック中',
      needs_revision: '修正待ち',
      completed: '完了'
    };
    return texts[status];
  };

  const isNearDueDate = (dueDate: string) => {
    const today = new Date();
    const due = new Date(dueDate);
    const diffDays = Math.ceil((due.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    return diffDays <= 3 && diffDays > 0;
  };

  const isPastDueDate = (dueDate: string) => {
    const today = new Date();
    const due = new Date(dueDate);
    return today > due;
  };

  const renderProgressBar = (progress: number) => (
    <div className="w-full bg-gray-200 rounded-full h-1.5">
      <div
        className="bg-indigo-600 h-1.5 rounded-full"
        style={{ width: `${progress}%` }}
      />
    </div>
  );

  const renderWorkProgress = (progress: CutInfo['workProgress']) => (
    <div className="space-y-2">
      {Object.entries(progress).map(([key, value]) => (
        <div key={key} className="flex items-center gap-2">
          <span className="text-xs text-gray-500 w-24">{key}</span>
          {renderProgressBar(value)}
          <span className="text-xs text-gray-500 w-8">{value}%</span>
        </div>
      ))}
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">カット管理</h1>
        <div className="flex items-center gap-4">
          <button className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:from-indigo-700 hover:to-purple-700">
            <Plus className="w-5 h-5" />
            新規カット
          </button>
        </div>
      </div>

      <div className="flex flex-wrap gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="カット番号、担当者、タグで検索..."
            className="w-full pl-10 pr-4 py-2 rounded-lg border border-indigo-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
        <select
          value={selectedStatus}
          onChange={(e) => setSelectedStatus(e.target.value)}
          className="px-4 py-2 border border-indigo-100 rounded-lg bg-white"
        >
          <option value="all">全てのステータス</option>
          <option value="not_ordered">発注前</option>
          <option value="ordered">発注済</option>
          <option value="in_review">作監チェック中 </option>
          <option value="needs_revision">修正待ち</option>
          <option value="completed">完了</option>
        </select>
        <button className="flex items-center gap-2 px-4 py-2 border border-indigo-100 rounded-lg hover:bg-indigo-50">
          <Filter className="w-4 h-4" />
          詳細フィルター
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {cuts.map((cut) => (
          <div
            key={cut.id}
            className="bg-white rounded-xl shadow-sm border border-indigo-50 overflow-hidden hover:shadow-md transition-shadow"
          >
            <div className="relative">
              <img
                src={cut.thumbnailUrl}
                alt={`カット ${cut.cutNumber}`}
                className="w-full h-48 object-cover"
              />
              <div className="absolute top-2 right-2 flex gap-2">
                {cut.complexity === 'high' && (
                  <span className="px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                    複雑
                  </span>
                )}
                {cut.priority === 'high' && (
                  <span className="px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                    優先
                  </span>
                )}
              </div>
            </div>

            <div className="p-4">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h3 className="font-medium text-gray-900">
                    {cut.cutNumber}
                  </h3>
                  <p className="text-sm text-gray-500">
                    第{cut.episodeNumber}話 - シーン{cut.sceneNumber}
                  </p>
                </div>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(cut.status)}`}>
                  {getStatusText(cut.status)}
                </span>
              </div>

              <div className="mb-4">
                {renderWorkProgress(cut.workProgress)}
              </div>

              <div className="flex flex-wrap gap-2 mb-4">
                {cut.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="px-2 py-1 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800"
                  >
                    {tag}
                  </span>
                ))}
              </div>

              <div className="space-y-2 mb-4">
                {cut.assignedStaff.map((staff) => (
                  <div key={staff.id} className="flex items-center gap-2">
                    <span className="text-sm text-gray-900">{staff.name}</span>
                    <span className="text-xs text-gray-500">
                      ({staff.role} - {staff.department})
                    </span>
                  </div>
                ))}
              </div>

              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-gray-400" />
                  <span className={`${
                    isPastDueDate(cut.dueDate) ? 'text-red-600' :
                    isNearDueDate(cut.dueDate) ? 'text-yellow-600' : 'text-gray-600'
                  }`}>
                    {new Date(cut.dueDate).toLocaleDateString('ja-JP')}
                  </span>
                </div>
                {cut.retakeCount > 0 && (
                  <div className="flex items-center gap-1 text-orange-600">
                    <AlertTriangle className="w-4 h-4" />
                    <span>リテイク {cut.retakeCount}回</span>
                  </div>
                )}
              </div>

              <div className="mt-4 flex justify-end gap-2">
                <button className="p-2 hover:bg-indigo-50 rounded-lg" title="詳細を表示">
                  <Eye className="w-4 h-4 text-indigo-600" />
                </button>
                <button className="p-2 hover:bg-indigo-50 rounded-lg" title="履歴を表示">
                  <FileText className="w-4 h-4 text-indigo-600" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CutManagement;