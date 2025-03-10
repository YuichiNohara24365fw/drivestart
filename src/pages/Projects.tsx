import React from 'react';
import { stubData } from '../data/stubData';
import { Plus, Filter } from 'lucide-react';

const Projects = () => {
  const getStatusText = (status: string) => {
    const statusMap: { [key: string]: string } = {
      'pre-production': '企画中',
      'production': '制作中',
      'post-production': '後編集',
      'completed': '完了'
    };
    return statusMap[status] || status;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">作品管理</h1>
        <button className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:from-indigo-700 hover:to-purple-700 shadow-sm">
          <Plus className="w-5 h-5" />
          新規作品
        </button>
      </div>

      <div className="flex items-center gap-4">
        <button className="flex items-center gap-2 px-4 py-2 border border-indigo-100 rounded-lg hover:bg-indigo-50">
          <Filter className="w-4 h-4" />
          フィルター
        </button>
        <select className="px-4 py-2 border border-indigo-100 rounded-lg bg-white">
          <option>すべてのステータス</option>
          <option>企画中</option>
          <option>制作中</option>
          <option>後編集</option>
          <option>完了</option>
        </select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {stubData.projects.map(project => (
          <div key={project.id} className="bg-white rounded-xl shadow-sm overflow-hidden border border-indigo-50 hover:shadow-md transition-shadow">
            <div className="relative">
              <img
                src={project.thumbnail}
                alt={project.title}
                className="w-full h-48 object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
            </div>
            <div className="p-4">
              <h3 className="text-lg font-semibold">{project.title}</h3>
              <p className="text-sm text-gray-600 mt-1">{project.description}</p>
              <div className="mt-4 flex items-center justify-between">
                <span className="px-3 py-1 rounded-full text-sm bg-gradient-to-r from-indigo-100 to-purple-100 text-indigo-800 font-medium">
                  {getStatusText(project.status)}
                </span>
                <span className="text-sm text-gray-500">
                  {new Date(project.startDate).toLocaleDateString('ja-JP')}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Projects;