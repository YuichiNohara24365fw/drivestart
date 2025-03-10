import React, { useState } from 'react';
import { Project, Staff } from '../types';
import { ChevronDown, ChevronUp } from 'lucide-react';

interface CutSheetTableProps {
  project: Project;
  staff: Staff[];
}

const CutSheetTable: React.FC<CutSheetTableProps> = ({ project, staff }) => {
  const [expandedEpisodes, setExpandedEpisodes] = useState<string[]>([]);

  const toggleEpisode = (episodeId: string) => {
    setExpandedEpisodes(prev => 
      prev.includes(episodeId) 
        ? prev.filter(id => id !== episodeId)
        : [...prev, episodeId]
    );
  };

  const getStatusColor = (status: string) => {
    const colors = {
      not_started: 'bg-emerald-100 text-emerald-800',
      in_progress: 'bg-yellow-100 text-yellow-800',
      completed: 'bg-white text-gray-800',
      pending_review: 'bg-blue-100 text-blue-800'
    };
    return colors[status as keyof typeof colors];
  };

  const getStatusText = (status: string) => {
    const texts = {
      not_started: '未着手',
      in_progress: '作業中',
      completed: '完了',
      pending_review: '確認待ち'
    };
    return texts[status as keyof typeof texts];
  };

  const calculateProgress = (cuts: any[]) => {
    const total = cuts.length;
    const completed = cuts.filter(cut => cut.status === 'completed').length;
    return Math.round((completed / total) * 100);
  };

  return (
    <div className="space-y-6">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead>
            <tr className="bg-gray-50">
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">話数</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">進捗</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">カット数</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">未着手</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">作業中</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">完了</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">確認待ち</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {project.episodes.map(episode => {
              const notStarted = episode.cuts.filter(cut => cut.status === 'not_started').length;
              const inProgress = episode.cuts.filter(cut => cut.status === 'in_progress').length;
              const completed = episode.cuts.filter(cut => cut.status === 'completed').length;
              const pendingReview = episode.cuts.filter(cut => cut.status === 'pending_review').length;
              const progress = calculateProgress(episode.cuts);

              return (
                <React.Fragment key={episode.id}>
                  <tr className="hover:bg-gray-50 cursor-pointer" onClick={() => toggleEpisode(episode.id)}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        {expandedEpisodes.includes(episode.id) ? (
                          <ChevronUp className="w-4 h-4 mr-2" />
                        ) : (
                          <ChevronDown className="w-4 h-4 mr-2" />
                        )}
                        <span className="font-medium">第{episode.number}話</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="w-full bg-gray-200 rounded-full h-2.5">
                        <div
                          className="bg-indigo-600 h-2.5 rounded-full"
                          style={{ width: `${progress}%` }}
                        ></div>
                      </div>
                      <span className="text-sm text-gray-500">{progress}%</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">{episode.cuts.length}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{notStarted}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{inProgress}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{completed}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{pendingReview}</td>
                  </tr>
                  {expandedEpisodes.includes(episode.id) && (
                    <tr>
                      <td colSpan={7} className="px-6 py-4 bg-gray-50">
                        <table className="min-w-full divide-y divide-gray-200">
                          <thead>
                            <tr>
                              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">カット番号</th>
                              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">担当者</th>
                              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">状態</th>
                              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">尺</th>
                            </tr>
                          </thead>
                          <tbody>
                            {episode.cuts.map(cut => (
                              <tr key={cut.id} className="hover:bg-white">
                                <td className="px-4 py-2">{cut.number}</td>
                                <td className="px-4 py-2">
                                  <div className="flex items-center gap-2">
                                    <img
                                      src={staff.find(s => s.id === cut.assignedTo)?.avatar}
                                      alt=""
                                      className="w-6 h-6 rounded-full"
                                    />
                                    <span>{staff.find(s => s.id === cut.assignedTo)?.name || '-'}</span>
                                  </div>
                                </td>
                                <td className="px-4 py-2">
                                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(cut.status)}`}>
                                    {getStatusText(cut.status)}
                                  </span>
                                </td>
                                <td className="px-4 py-2">{cut.duration}秒</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CutSheetTable;