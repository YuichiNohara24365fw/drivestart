import React from 'react';
import { AlertTriangle, Clock, Calendar, BarChart2 } from 'lucide-react';
import { ProcessData } from '../types';

interface StaffDetailProps {
  staffId?: string;
}

const StaffDetail: React.FC<StaffDetailProps> = ({ staffId }) => {
  // 担当者の詳細情報（実際のアプリケーションではAPIから取得）
  const staffInfo = {
    id: staffId,
    name: '田中 優希',
    role: 'アニメーションディレクター',
    department: 'アニメーション',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80',
    email: 'tanaka@example.com',
    phone: '03-1234-5678',
    joinDate: '2022-04-01',
    skills: ['キャラクター作画', '動画チェック', 'レイアウト'],
    currentWorkload: {
      assignedCuts: 25,
      completedCuts: 15,
      delayedCuts: 3,
      inProgressCuts: 7
    }
  };

  // 担当カットの進捗データ
  const cutProgress: ProcessData[] = [
    {
      process: 'LO',
      staff: staffInfo.name,
      all: 10,
      in: 8,
      up: 6,
      holding: 2,
      remaining: 2,
      r: 1,
      control: 2,
      upStatus: '+++',
      daily: 2,
      isDelayed: true,
      delayDays: 2,
      progress: 60,
      expectedProgress: 80
    },
    // ... 他のカットデータ
  ];

  // 遅延情報
  const delays = [
    {
      cutNumber: 'A-123',
      scene: 'シーン5',
      delayDays: 2,
      reason: 'キャラクターの動きの修正が必要',
      impact: 'medium',
      dueDate: '2024-03-15',
      status: 'in-progress'
    },
    {
      cutNumber: 'B-456',
      scene: 'シーン8',
      delayDays: 3,
      reason: '背景との調整に時間が必要',
      impact: 'high',
      dueDate: '2024-03-18',
      status: 'pending'
    }
  ];

  return (
    <div className="space-y-6">
      {/* ヘッダー情報 */}
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-4">
          <img
            src={staffInfo.avatar}
            alt={staffInfo.name}
            className="w-16 h-16 rounded-full object-cover ring-2 ring-indigo-100"
          />
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{staffInfo.name}</h1>
            <div className="flex items-center gap-2 text-gray-600">
              <span>{staffInfo.role}</span>
              <span>•</span>
              <span>{staffInfo.department}</span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <button className="px-4 py-2 bg-indigo-50 text-indigo-600 rounded-lg hover:bg-indigo-100">
            メッセージを送信
          </button>
          <button className="px-4 py-2 bg-white border border-gray-200 rounded-lg hover:bg-gray-50">
            スケジュールを確認
          </button>
        </div>
      </div>

      {/* 進捗サマリー */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          {
            icon: BarChart2,
            label: '担当カット数',
            value: staffInfo.currentWorkload.assignedCuts,
            color: 'bg-indigo-500'
          },
          {
            icon: Clock,
            label: '作業中',
            value: staffInfo.currentWorkload.inProgressCuts,
            color: 'bg-yellow-500'
          },
          {
            icon: AlertTriangle,
            label: '遅延',
            value: staffInfo.currentWorkload.delayedCuts,
            color: 'bg-red-500'
          },
          {
            icon: Calendar,
            label: '完了',
            value: staffInfo.currentWorkload.completedCuts,
            color: 'bg-green-500'
          }
        ].map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
              <div className="flex items-center gap-4">
                <div className={`${stat.color} p-3 rounded-lg`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">{stat.label}</p>
                  <p className="text-2xl font-semibold">{stat.value}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* 遅延レポート */}
      {delays.length > 0 && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="p-4 border-b border-gray-200 bg-gray-50">
            <h2 className="text-lg font-semibold text-gray-900">遅延レポート</h2>
          </div>
          <div className="divide-y divide-gray-200">
            {delays.map((delay, index) => (
              <div key={index} className="p-4">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-gray-900">
                        {delay.scene} ({delay.cutNumber})
                      </span>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        delay.impact === 'high' ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {delay.delayDays}日遅延
                      </span>
                    </div>
                    <p className="mt-1 text-sm text-gray-600">{delay.reason}</p>
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-gray-600">期限: {new Date(delay.dueDate).toLocaleDateString('ja-JP')}</div>
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                      delay.status === 'in-progress' ? 'bg-blue-100 text-blue-800' : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {delay.status === 'in-progress' ? '対応中' : '対応待ち'}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* カット進捗 */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="p-4 border-b border-gray-200 bg-gray-50">
          <h2 className="text-lg font-semibold text-gray-900">担当カット進捗</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr className="bg-gray-50">
                <th className="border-b border-gray-200 p-2">工程</th>
                <th className="border-b border-gray-200 p-2">ALL</th>
                <th className="border-b border-gray-200 p-2">IN</th>
                <th className="border-b border-gray-200 p-2">UP</th>
                <th className="border-b border-gray-200 p-2">手持</th>
                <th className="border-b border-gray-200 p-2">残</th>
                <th className="border-b border-gray-200 p-2">R</th>
                <th className="border-b border-gray-200 p-2">制手</th>
                <th className="border-b border-gray-200 p-2">UP</th>
                <th className="border-b border-gray-200 p-2">日割</th>
                <th className="border-b border-gray-200 p-2">進捗</th>
              </tr>
            </thead>
            <tbody>
              {cutProgress.map((row, i) => (
                <tr 
                  key={i} 
                  className={`hover:bg-gray-50 ${
                    row.isDelayed ? 'bg-red-50' : ''
                  }`}
                >
                  <td className="border-b border-gray-200 p-2">{row.process}</td>
                  <td className="border-b border-gray-200 p-2 text-center">{row.all}</td>
                  <td className="border-b border-gray-200 p-2 text-center">{row.in}</td>
                  <td className="border-b border-gray-200 p-2 text-center">{row.up}</td>
                  <td className="border-b border-gray-200 p-2 text-center">{row.holding}</td>
                  <td className="border-b border-gray-200 p-2 text-center">{row.remaining}</td>
                  <td className="border-b border-gray-200 p-2 text-center">{row.r}</td>
                  <td className="border-b border-gray-200 p-2 text-center">{row.control}</td>
                  <td className="border-b border-gray-200 p-2 text-center">{row.upStatus}</td>
                  <td className="border-b border-gray-200 p-2 text-center">{row.daily}</td>
                  <td className="border-b border-gray-200 p-2">
                    <div className="w-full bg-gray-200 rounded-full h-1.5 relative">
                      <div
                        className="absolute h-4 w-0.5 bg-gray-400 top-1/2 transform -translate-y-1/2"
                        style={{ left: `${row.expectedProgress}%` }}
                      />
                      <div
                        className={`h-1.5 rounded-full ${
                          row.isDelayed ? 'bg-red-500' : 'bg-green-500'
                        }`}
                        style={{ width: `${row.progress}%` }}
                      />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default StaffDetail;