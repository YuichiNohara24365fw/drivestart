import React from 'react';
import { BarChart, Users, Film, Clock, AlertTriangle, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { stubData } from '../../shared/data/stubData';
import DepartmentProgress from '../../shared/components/charts/DepartmentProgress';
import ProjectProgress from '../../shared/components/charts/ProjectProgress';
import CutProgressTable from '../../shared/components/CutProgressTable';

const DashboardPage = () => {
  const navigate = useNavigate();
  const activeDelays = stubData.delays.filter(delay => delay.status !== 'resolved');

  // カット進行データのサンプル
  const processData = [
    {
      process: 'LO',
      staff: 'レイアウト01',
      all: 25,
      in: 15,
      up: 10,
      holding: 5,
      remaining: 10,
      r: 1,
      control: 2,
      upStatus: '+++',
      daily: 2,
      isDelayed: true,
      delayDays: 2,
      progress: 40,
      expectedProgress: 60
    },
    {
      process: 'GE',
      staff: '原画01',
      all: 30,
      in: 20,
      up: 15,
      holding: 3,
      remaining: 10,
      r: 2,
      control: 0,
      upStatus: '++',
      daily: 3,
      isDelayed: false,
      delayDays: 0,
      progress: 50,
      expectedProgress: 45
    },
    {
      process: 'DO',
      staff: '動画01',
      all: 40,
      in: 25,
      up: 20,
      holding: 2,
      remaining: 15,
      r: 3,
      control: 1,
      upStatus: '+',
      daily: 4,
      isDelayed: false,
      delayDays: 0,
      progress: 50,
      expectedProgress: 50
    }
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-800">ダッシュボード</h1>
      
      {/* 上部のカード */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-lg shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">進行中のプロジェクト</p>
              <p className="text-2xl font-bold">{stubData.projects.filter(p => p.status === 'production').length}</p>
            </div>
            <div className="p-3 bg-blue-100 rounded-full">
              <Film className="text-blue-600" size={24} />
            </div>
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-lg shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">スタッフ数</p>
              <p className="text-2xl font-bold">{stubData.staff.length}</p>
            </div>
            <div className="p-3 bg-green-100 rounded-full">
              <Users className="text-green-600" size={24} />
            </div>
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-lg shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">今月の納期数</p>
              <p className="text-2xl font-bold">5</p>
            </div>
            <div className="p-3 bg-purple-100 rounded-full">
              <Clock className="text-purple-600" size={24} />
            </div>
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-lg shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">遅延アラート</p>
              <p className="text-2xl font-bold">{activeDelays.length}</p>
            </div>
            <div className="p-3 bg-red-100 rounded-full">
              <AlertTriangle className="text-red-600" size={24} />
            </div>
          </div>
        </div>
      </div>
      
      {/* 中段のチャート */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-4 rounded-lg shadow-md">
          <h2 className="text-lg font-semibold mb-4">部門別進捗状況</h2>
          <DepartmentProgress />
        </div>
        
        <div className="bg-white p-4 rounded-lg shadow-md">
          <h2 className="text-lg font-semibold mb-4">プロジェクト進捗状況</h2>
          <ProjectProgress />
        </div>
      </div>
      
      {/* 下段のテーブルとアラート */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-4 rounded-lg shadow-md">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold">カット進行状況</h2>
            <button 
              className="text-blue-600 flex items-center text-sm"
              onClick={() => navigate('/cut-progress')}
            >
              詳細を見る <ChevronRight size={16} />
            </button>
          </div>
          <CutProgressTable data={processData} />
        </div>
        
        <div className="bg-white p-4 rounded-lg shadow-md">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold">遅延アラート</h2>
            <button className="text-blue-600 flex items-center text-sm">
              すべて見る <ChevronRight size={16} />
            </button>
          </div>
          
          <div className="space-y-4">
            {activeDelays.length > 0 ? (
              activeDelays.slice(0, 3).map((delay, index) => (
                <div key={index} className="border-l-4 border-red-500 pl-3 py-2">
                  <div className="flex justify-between">
                    <p className="font-medium">{delay.title}</p>
                    <span className="text-sm text-red-600">{delay.days}日遅延</span>
                  </div>
                  <p className="text-sm text-gray-600">{delay.description}</p>
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-center py-4">現在、遅延はありません</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage; 