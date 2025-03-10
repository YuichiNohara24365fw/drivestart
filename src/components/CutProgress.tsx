import React, { useState, useMemo } from 'react';
import { LayoutGrid, Table as TableIcon } from 'lucide-react';
import CutProgressTable from './CutProgressTable';
import CutProgressGroup from './CutProgressGroup';
import CutTypeManagement from './CutTypeManagement';
import ProcessCalendar from './ProcessCalendar';
import { ProcessData, ProcessGroup } from '../types';

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

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* カット種別管理 */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl shadow-sm border border-indigo-100 p-6">
            <h2 className="text-lg font-semibold mb-4">カット種別</h2>
            <CutTypeManagement />
          </div>
        </div>

        {/* 工程カレンダー */}
        <div className="lg:col-span-3">
          <div className="bg-white rounded-xl shadow-sm border border-indigo-100 p-6">
            <h2 className="text-lg font-semibold mb-4">工程別進捗</h2>
            <ProcessCalendar startDate={new Date('2024-01-23')} />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-indigo-100 p-6">
        <h2 className="text-lg font-semibold mb-4">進行状況詳細</h2>
        {viewMode === 'table' ? (
          <CutProgressTable processData={processData} />
        ) : (
          <CutProgressGroup processGroups={processGroups} />
        )}
      </div>
    </div>
  );
};

export default CutProgress;