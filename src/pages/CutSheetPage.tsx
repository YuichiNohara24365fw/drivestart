import React, { useState } from 'react';
import { stubData } from '../data/stubData';
import { AlertTriangle, Filter, LayoutGrid, Table, GanttChart } from 'lucide-react';
import DelayReport from '../components/DelayReport';
import CutSheet from '../components/CutSheet';
import CutSheetTable from '../components/CutSheetTable';
import CutSheetGantt from '../components/CutSheetGantt';

const CutSheetPage = () => {
  const [selectedDelay, setSelectedDelay] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'card' | 'table' | 'gantt'>('card');
  const activeDelays = stubData.delays.filter(delay => delay.status !== 'resolved');

  const getSelectedProject = () => {
    if (!selectedDelay) return stubData.projects[0];
    const delay = activeDelays.find(d => d.id === selectedDelay);
    if (!delay) return stubData.projects[0];
    return stubData.projects.find(p => p.id === delay.projectId) || stubData.projects[0];
  };

  const getFilteredStaff = () => {
    if (!selectedDelay) return stubData.staff;
    const delay = activeDelays.find(d => d.id === selectedDelay);
    if (!delay) return stubData.staff;
    const project = getSelectedProject();
    if (!project) return stubData.staff;

    return stubData.staff.filter(s => 
      delay.affectedScenes.some(scene => 
        project.episodes.some(ep => 
          ep.cuts.some(cut => 
            cut.assignedTo === s.id && 
            cut.number.includes(scene)
          )
        )
      )
    );
  };

  const renderContent = () => {
    const project = getSelectedProject();
    const staff = getFilteredStaff();

    switch (viewMode) {
      case 'table':
        return <CutSheetTable project={project} staff={staff} />;
      case 'gantt':
        return <CutSheetGantt project={project} staff={staff} />;
      default:
        return (
          selectedDelay ? (
            <CutSheet staff={staff} project={project} />
          ) : (
            <div className="text-center py-12 text-gray-500">
              <AlertTriangle className="w-12 h-12 mx-auto mb-4 text-gray-400" />
              <p>遅延レポートを選択してカット表を表示</p>
            </div>
          )
        );
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">カット管理</h1>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 bg-white rounded-lg border border-indigo-100 p-1">
            <button
              onClick={() => setViewMode('card')}
              className={`p-2 rounded ${viewMode === 'card' ? 'bg-indigo-100 text-indigo-600' : 'text-gray-600 hover:bg-gray-50'}`}
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('table')}
              className={`p-2 rounded ${viewMode === 'table' ? 'bg-indigo-100 text-indigo-600' : 'text-gray-600 hover:bg-gray-50'}`}
            >
              <Table className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('gantt')}
              className={`p-2 rounded ${viewMode === 'gantt' ? 'bg-indigo-100 text-indigo-600' : 'text-gray-600 hover:bg-gray-50'}`}
            >
              <GanttChart className="w-4 h-4" />
            </button>
          </div>
          <button className="flex items-center gap-2 px-4 py-2 border border-indigo-100 rounded-lg hover:bg-indigo-50">
            <Filter className="w-4 h-4" />
            フィルター
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 space-y-4">
          <h2 className="text-lg font-semibold text-gray-900">遅延レポート</h2>
          {activeDelays.map(delay => (
            <div
              key={delay.id}
              className={`cursor-pointer transition-all ${
                selectedDelay === delay.id ? 'ring-2 ring-indigo-500' : ''
              }`}
              onClick={() => setSelectedDelay(delay.id)}
            >
              <DelayReport delay={delay} />
            </div>
          ))}
        </div>

        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl shadow-sm border border-indigo-100 p-6">
            {renderContent()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CutSheetPage;