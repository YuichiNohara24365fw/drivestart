import React from 'react';
import { stubData } from '../data/stubData';
import { BarChart, Users, Film, Clock, AlertTriangle, ChevronRight } from 'lucide-react';
import DepartmentProgress from '../components/charts/DepartmentProgress';
import ProjectProgress from '../components/charts/ProjectProgress';
import { useNavigate } from 'react-router-dom';
import CutProgressTable from '../components/CutProgressTable';

const Dashboard = () => {
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
      staff: '原画02',
      all: 30,
      in: 20,
      up: 15,
      holding: 5,
      remaining: 10,
      r: 0,
      control: 3,
      upStatus: '---',
      daily: 3,
      isDelayed: true,
      delayDays: 1,
      progress: 50,
      expectedProgress: 70
    }
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">ダッシュボード</h1>
      
      {/* 基本統計 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { icon: Film, label: '進行中作品', value: '4', color: 'bg-indigo-500' },
          { icon: Users, label: 'スタッフ総数', value: '42', color: 'bg-pink-500' },
          { icon: Clock, label: '制作中カット', value: processData.reduce((sum, p) => sum + p.in, 0).toString(), color: 'bg-purple-500' },
          { 
            icon: AlertTriangle, 
            label: '遅延カット', 
            value: processData.filter(p => p.isDelayed).length.toString(), 
            color: 'bg-red-500',
            onClick: () => navigate('/cut-progress')
          },
        ].map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div 
              key={index} 
              className={`bg-white rounded-xl shadow-sm p-6 border border-indigo-50 hover:shadow-md transition-shadow ${stat.onClick ? 'cursor-pointer' : ''}`}
              onClick={stat.onClick}
            >
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

      {/* 遅延情報とカット進行表 */}
      {processData.some(p => p.isDelayed) && (
        <div className="bg-white rounded-xl shadow-sm p-6 border border-indigo-50">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-gray-900">遅延カット進捗状況</h2>
            <button 
              onClick={() => navigate('/cut-progress')}
              className="flex items-center gap-1 text-sm text-indigo-600 hover:text-indigo-700"
            >
              詳細を表示
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
          <CutProgressTable 
            processData={processData.filter(p => p.isDelayed)} 
          />
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 部門別進捗 */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-indigo-50">
          <DepartmentProgress data={stubData.departmentProgress} />
        </div>

        {/* 作品別進捗 */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-indigo-50">
          <h2 className="text-lg font-semibold mb-4">作品別進捗</h2>
          {stubData.projects.map(project => (
            <div key={project.id} className="mb-6 last:mb-0">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-medium text-gray-900">{project.title}</h3>
                <button 
                  onClick={() => navigate(`/projects/${project.id}`)}
                  className="text-sm text-indigo-600 hover:text-indigo-700"
                >
                  詳細
                </button>
              </div>
              <ProjectProgress progress={project.progress} title={project.title} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Dashboard;