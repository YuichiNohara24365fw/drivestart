import React from 'react';
import { ProcessGroup } from '../types';
import ProgressBar from './ProgressBar';

interface CutProgressGroupProps {
  processGroups: ProcessGroup[];
}

const CutProgressGroup: React.FC<CutProgressGroupProps> = ({ processGroups }) => {
  return (
    <div className="space-y-6">
      {processGroups.map(group => (
        <div key={group.id} className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-3 border-b border-gray-200 bg-gray-50">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium text-gray-700">{group.name}</h3>
                <p className="text-xs text-gray-500 mt-1">
                  担当者数: {group.data.length}名
                </p>
              </div>
              {group.data.some(d => d.isDelayed) && (
                <div className="bg-red-50 px-3 py-1 rounded-lg border border-red-100">
                  <span className="text-sm text-red-700">
                    遅延: {group.data.filter(d => d.isDelayed).length}件
                  </span>
                </div>
              )}
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-sm">
              <thead>
                <tr className="bg-gray-50">
                  <th className="border-b border-gray-200 p-2">工程</th>
                  <th className="border-b border-gray-200 p-2">担当</th>
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
                {group.data.map((row, i) => (
                  <tr 
                    key={i} 
                    className={`hover:bg-gray-50 ${
                      row.isDelayed ? 'bg-red-50' : ''
                    }`}
                  >
                    <td className="border-b border-gray-200 p-2">{row.process}</td>
                    <td className="border-b border-gray-200 p-2">
                      <div className="flex items-center gap-2">
                        {row.staff}
                        {row.isDelayed && (
                          <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-red-100 text-red-800">
                            {row.delayDays}日遅延
                          </span>
                        )}
                      </div>
                    </td>
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
                      <ProgressBar
                        progress={row.progress}
                        expectedProgress={row.expectedProgress}
                        isDelayed={row.isDelayed}
                      />
                    </td>
                  </tr>
                ))}
                <tr className="bg-gray-50 font-medium">
                  <td className="border-b border-gray-200 p-2" colSpan={2}>合計</td>
                  <td className="border-b border-gray-200 p-2 text-center">
                    {group.data.reduce((sum, row) => sum + row.all, 0)}
                  </td>
                  <td className="border-b border-gray-200 p-2 text-center">
                    {group.data.reduce((sum, row) => sum + row.in, 0)}
                  </td>
                  <td className="border-b border-gray-200 p-2 text-center">
                    {group.data.reduce((sum, row) => sum + row.up, 0)}
                  </td>
                  <td className="border-b border-gray-200 p-2 text-center">
                    {group.data.reduce((sum, row) => sum + row.holding, 0)}
                  </td>
                  <td className="border-b border-gray-200 p-2 text-center">
                    {group.data.reduce((sum, row) => sum + row.remaining, 0)}
                  </td>
                  <td className="border-b border-gray-200 p-2 text-center">
                    {group.data.reduce((sum, row) => sum + row.r, 0)}
                  </td>
                  <td className="border-b border-gray-200 p-2 text-center">
                    {group.data.reduce((sum, row) => sum + row.control, 0)}
                  </td>
                  <td className="border-b border-gray-200 p-2 text-center">-</td>
                  <td className="border-b border-gray-200 p-2 text-center">
                    {group.data.reduce((sum, row) => sum + row.daily, 0)}
                  </td>
                  <td className="border-b border-gray-200 p-2">-</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      ))}
    </div>
  );
};

export default CutProgressGroup;