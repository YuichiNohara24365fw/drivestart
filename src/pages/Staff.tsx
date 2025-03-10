import React from 'react';
import { stubData } from '../data/stubData';
import { Plus, Filter, Edit } from 'lucide-react';

const Staff = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">スタッフ管理</h1>
        <button className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:from-indigo-700 hover:to-purple-700 shadow-sm">
          <Plus className="w-5 h-5" />
          スタッフ追加
        </button>
      </div>

      <div className="flex items-center gap-4">
        <button className="flex items-center gap-2 px-4 py-2 border border-indigo-100 rounded-lg hover:bg-indigo-50">
          <Filter className="w-4 h-4" />
          フィルター
        </button>
        <select className="px-4 py-2 border border-indigo-100 rounded-lg bg-white">
          <option>全部門</option>
          <option>アニメーション</option>
          <option>アート</option>
          <option>制作進行</option>
          <option>音響</option>
        </select>
      </div>

      <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-indigo-50">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-indigo-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                スタッフ
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                氏名
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                英語表記
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                役職
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                部門
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                操作
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {stubData.staff.map((member) => (
              <tr key={member.id} className="hover:bg-indigo-50/50 transition-colors">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <img
                      className="h-10 w-10 rounded-full object-cover ring-2 ring-indigo-100"
                      src={member.avatar}
                      alt={member.name}
                    />
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">{member.name}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-500">Yuki Tanaka</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{member.role}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-gradient-to-r from-indigo-100 to-purple-100 text-indigo-800">
                    {member.department}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  <button className="flex items-center gap-1 text-indigo-600 hover:text-indigo-900 font-medium">
                    <Edit className="w-4 h-4" />
                    編集
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Staff;