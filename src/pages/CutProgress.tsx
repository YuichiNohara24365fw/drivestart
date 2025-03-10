import React, { useState, useMemo } from 'react';
import { LayoutGrid, Table as TableIcon } from 'lucide-react';

interface ProcessData {
  process: string;
  staff: string;
  all: number;
  in: number;
  up: number;
  holding: number;
  remaining: number;
  r: number;
  control: number;
  upStatus: string;
  daily: number;
  isDelayed: boolean;
  delayDays: number;
  progress: number;
  expectedProgress: number;
}

interface ProcessGroup {
  id: string;
  name: string;
  data: ProcessData[];
}

const CutProgress: React.FC = () => {
  const [viewMode, setViewMode] = useState<'table' | 'group'>('table');

  const processes = [
    { name: 'レイアウト', prefix: 'LO' },
    { name: '原画', prefix: 'GE' },
    { name: '作監', prefix: 'SA' },
    { name: '動画', prefix: 'DO' },
    { name: '彩色', prefix: 'IR' },
    { name: '特効', prefix: 'EF' },
    { name: '背景', prefix: 'BG' },
    { name: '撮影', prefix: 'KO' }
  ];

  const processData: ProcessData[] = useMemo(() => {
    return Array.from({ length: 50 }, (_, i) => {
      const process = processes[Math.floor(i / 7)];
      const all = Math.floor(Math.random() * 30) + 20;
      const up = Math.floor(Math.random() * all);
      const holding = Math.floor(Math.random() * 5);
      const inProgress = up + holding;
      const isDelayed = Math.random() < 0.2;
      const delayDays = isDelayed ? Math.floor(Math.random() * 5) + 1 : 0;
      
      return {
        process: process.prefix,
        staff: `${process.name}${String(i % 7 + 1).padStart(2, '0')}`,
        all,
        in: inProgress,
        up,
        holding,
        remaining: all - inProgress,
        r: Math.floor(Math.random() * 3),
        control: Math.floor(Math.random() * 5),
        upStatus: ['###', '---', '+++'][Math.floor(Math.random() * 3)],
        daily: Math.floor(Math.random() * 5) + 1,
        isDelayed,
        delayDays,
        progress: (up / all) * 100,
        expectedProgress: ((up + holding) / all) * 100 + 20
      };
    });
  }, []);

  const processGroups: ProcessGroup[] = useMemo(() => {
    return processes.map(process => ({
      id: process.prefix,
      name: process.name,
      data: processData.filter(data => data.process === process.prefix)
    }));
  }, [processData]);

  const renderTableView = () => (
    <div className="grid grid-cols-2 divide-x divide-gray-200">
      {[0, 1].map(section => (
        <div key={section} className="overflow-x-auto">
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
              {processData.slice(section * 25, (section + 1) * 25).map((row, i) => (
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
      ))}
    </div>
  );

  const renderGroupView = () => (
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

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">カット進行表</h1>
        <div className="flex items-center gap-2 bg-white rounded-lg border border-indigo-100 p-1">
          <button
            onClick={() => setViewMode('table')}
            className={`p-2 rounded ${viewMode === 'table' ? 'bg-indigo-100 text-indigo-600' : 'text-gray-600 hover:bg-gray-50'}`}
          >
            <TableIcon className="w-4 h-4" />
          </button>
          <button
            onClick={() => setViewMode('group')}
            className={`p-2 rounded ${viewMode === 'group' ? 'bg-indigo-100 text-indigo-600' : 'text-gray-600 hover:bg-gray-50'}`}
          >
            <LayoutGrid className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-indigo-100 p-6">
        {viewMode === 'table' ? renderTableView() : renderGroupView()}
      </div>
    </div>
  );
};

export default CutProgress;