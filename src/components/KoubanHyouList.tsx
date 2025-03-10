import React, { useState } from 'react';
import { Plus, FileText, Table, ChevronDown } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { sampleEpisodes } from '../data/sampleData';
import { stubData } from '../data/stubData';

const KoubanHyouList: React.FC = () => {
  const navigate = useNavigate();
  const [selectedProject, setSelectedProject] = useState<string | null>(null);

  const getStatusBadge = (status: 'draft' | 'in_progress' | 'completed') => {
    const styles = {
      draft: 'bg-gray-100 text-gray-800',
      in_progress: 'bg-blue-100 text-blue-800',
      completed: 'bg-green-100 text-green-800'
    };
    
    const labels = {
      draft: '下書き',
      in_progress: '作業中',
      completed: '完了'
    };

    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${styles[status]}`}>
        {labels[status]}
      </span>
    );
  };

  const getProjectStatusBadge = (status: string) => {
    const styles: { [key: string]: string } = {
      'pre-production': 'bg-yellow-100 text-yellow-800',
      'production': 'bg-blue-100 text-blue-800',
      'post-production': 'bg-purple-100 text-purple-800',
      'completed': 'bg-green-100 text-green-800'
    };
    
    const labels: { [key: string]: string } = {
      'pre-production': '企画中',
      'production': '制作中',
      'post-production': '後編集',
      'completed': '完了'
    };

    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${styles[status]}`}>
        {labels[status]}
      </span>
    );
  };

  const filteredEpisodes = selectedProject
    ? sampleEpisodes.filter(episode => 
        stubData.projects.find(p => p.id === selectedProject)?.episodes.some(e => e.id === episode.id)
      )
    : [];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">香盤表</h1>
        <button
          onClick={() => navigate('/kouban-hyou/new')}
          className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
        >
          <Plus className="w-4 h-4" />
          新規作成
        </button>
      </div>

      {/* 作品選択 */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h2 className="text-lg font-semibold mb-4">作品選択</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {stubData.projects.map(project => (
            <button
              key={project.id}
              onClick={() => setSelectedProject(project.id)}
              className={`flex items-start gap-4 p-4 rounded-lg border transition-all ${
                selectedProject === project.id
                  ? 'border-indigo-500 bg-indigo-50'
                  : 'border-gray-200 hover:border-indigo-200 hover:bg-gray-50'
              }`}
            >
              <img
                src={project.thumbnail}
                alt={project.title}
                className="w-16 h-16 rounded-lg object-cover flex-shrink-0"
              />
              <div className="flex-1 text-left">
                <h3 className="font-medium text-gray-900">{project.title}</h3>
                <div className="mt-2">
                  {getProjectStatusBadge(project.status)}
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* 話数一覧 */}
      {selectedProject && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200 text-sm">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">話数</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">タイトル</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">カット数</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ステータス</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">最終更新</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"></th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredEpisodes.length > 0 ? (
                  filteredEpisodes.map((episode) => (
                    <tr key={episode.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3 whitespace-nowrap">
                        <span className="font-medium">第{episode.number}話</span>
                      </td>
                      <td className="px-4 py-3">{episode.title}</td>
                      <td className="px-4 py-3 whitespace-nowrap">{episode.totalCuts}カット</td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        {getStatusBadge(episode.status)}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-gray-500">
                        {new Date(episode.lastModified).toLocaleDateString('ja-JP')}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-right">
                        <div className="flex items-center gap-2 justify-end">
                          <button
                            onClick={() => navigate(`/kouban-hyou/${episode.id}`)}
                            className="p-1 hover:bg-indigo-50 rounded text-indigo-600"
                            title="香盤表を編集"
                          >
                            <FileText className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => navigate(`/kouban-hyou/${episode.id}/overview`)}
                            className="p-1 hover:bg-indigo-50 rounded text-indigo-600"
                            title="一覧表示"
                          >
                            <Table className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} className="px-4 py-8 text-center text-gray-500">
                      この作品には香盤表が登録されていません
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default KoubanHyouList;