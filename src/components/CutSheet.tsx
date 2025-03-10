import React, { useState } from 'react';
import { Staff, Project, Episode } from '../types';
import { ChevronDown, ChevronUp, AlertCircle } from 'lucide-react';

interface CutSheetProps {
  staff: Staff[];
  project: Project;
}

const CutSheet: React.FC<CutSheetProps> = ({ staff, project }) => {
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
    <div className="space-y-4">
      {/* スタッフ別進捗状況 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {staff.map(member => (
          <div key={member.id} className="bg-white rounded-lg shadow-sm border border-indigo-100 p-4">
            <div className="flex items-center gap-3 mb-4">
              <img
                src={member.avatar}
                alt={member.name}
                className="w-10 h-10 rounded-full object-cover ring-2 ring-indigo-100"
              />
              <div>
                <h3 className="font-medium text-gray-900">{member.name}</h3>
                <p className="text-sm text-gray-600">{member.role}</p>
              </div>
            </div>
            {member.workload && (
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">担当カット数</span>
                  <span className="font-medium">{member.workload.totalCuts}</span>
                </div>
                <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-indigo-500 to-purple-500"
                    style={{ width: `${(member.workload.completed / member.workload.totalCuts) * 100}%` }}
                  />
                </div>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="bg-emerald-50 p-2 rounded">
                    <span className="text-emerald-600">未着手</span>
                    <div className="font-medium">{member.workload.notStarted}</div>
                  </div>
                  <div className="bg-yellow-50 p-2 rounded">
                    <span className="text-yellow-600">作業中</span>
                    <div className="font-medium">{member.workload.inProgress}</div>
                  </div>
                  <div className="bg-gray-50 p-2 rounded">
                    <span className="text-gray-600">完了</span>
                    <div className="font-medium">{member.workload.completed}</div>
                  </div>
                  <div className="bg-blue-50 p-2 rounded">
                    <span className="text-blue-600">確認待ち</span>
                    <div className="font-medium">{member.workload.pendingReview}</div>
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* カット表 */}
      <div className="bg-white rounded-lg shadow-sm border border-indigo-100 overflow-hidden">
        <div className="p-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold">話数別カット表</h2>
        </div>
        <div className="divide-y divide-gray-200">
          {project.episodes.map(episode => (
            <div key={episode.id}>
              <div
                className="p-4 hover:bg-gray-50 cursor-pointer flex items-center justify-between"
                onClick={() => toggleEpisode(episode.id)}
              >
                <div className="flex items-center gap-3">
                  {expandedEpisodes.includes(episode.id) ? (
                    <ChevronUp className="w-5 h-5 text-gray-500" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-gray-500" />
                  )}
                  <div>
                    <span className="font-medium">第{episode.number}話: {episode.title}</span>
                    <div className="text-sm text-gray-500">
                      進捗率: {calculateProgress(episode.cuts)}%
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-600">
                    {episode.cuts.length}カット
                  </span>
                </div>
              </div>
              {expandedEpisodes.includes(episode.id) && (
                <div className="p-4 bg-gray-50">
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead>
                        <tr className="bg-gray-100">
                          <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">カット</th>
                          <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">担当者</th>
                          <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">状態</th>
                          <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">尺</th>
                          <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">納期</th>
                          <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">備考</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {episode.cuts.map(cut => {
                          const isDelayed = cut.status === 'in_progress' && cut.dueDate && new Date(cut.dueDate) < new Date();
                          return (
                            <tr key={cut.id} className={`hover:bg-gray-50 ${isDelayed ? 'bg-red-50' : ''}`}>
                              <td className="px-4 py-2 text-sm font-medium">{cut.number}</td>
                              <td className="px-4 py-2">
                                <div className="flex items-center gap-2">
                                  <img
                                    src={staff.find(s => s.id === cut.assignedTo)?.avatar}
                                    alt=""
                                    className="w-6 h-6 rounded-full"
                                  />
                                  <span className="text-sm">
                                    {staff.find(s => s.id === cut.assignedTo)?.name || '-'}
                                  </span>
                                </div>
                              </td>
                              <td className="px-4 py-2">
                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(isDelayed ? 'delayed' : cut.status)}`}>
                                  {getStatusText(isDelayed ? 'delayed' : cut.status)}
                                </span>
                              </td>
                              <td className="px-4 py-2 text-sm">{cut.duration}秒</td>
                              <td className="px-4 py-2 text-sm">
                                {cut.dueDate && (
                                  <span className={isDelayed ? 'text-red-600 font-medium' : ''}>
                                    {new Date(cut.dueDate).toLocaleDateString('ja-JP')}
                                  </span>
                                )}
                              </td>
                              <td className="px-4 py-2 text-sm">
                                {isDelayed && (
                                  <div className="flex items-center gap-1 text-red-600">
                                    <AlertCircle className="w-4 h-4" />
                                    <span>納期超過</span>
                                  </div>
                                )}
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CutSheet;