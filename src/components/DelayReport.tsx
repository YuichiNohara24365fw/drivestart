import React, { useState } from 'react';
import { DelayReport as DelayReportType } from '../types';
import { ChevronDown, ChevronUp, AlertTriangle } from 'lucide-react';
import CutSheet from './CutSheet';
import { stubData } from '../data/stubData';

interface DelayReportProps {
  delay: DelayReportType;
}

const DelayReport: React.FC<DelayReportProps> = ({ delay }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const getImpactColor = (impact: string) => {
    const colors = {
      low: 'bg-yellow-100 text-yellow-800',
      medium: 'bg-orange-100 text-orange-800',
      high: 'bg-red-100 text-red-800'
    };
    return colors[impact as keyof typeof colors];
  };

  const project = stubData.projects.find(p => p.id === delay.projectId);

  return (
    <div className="bg-white rounded-lg shadow-sm border border-indigo-100 overflow-hidden">
      <div
        className="p-4 cursor-pointer hover:bg-indigo-50/50 transition-colors"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <AlertTriangle className={`w-5 h-5 ${delay.impact === 'high' ? 'text-red-500' : 'text-orange-500'}`} />
            <div>
              <h3 className="font-medium text-gray-900">
                {delay.phase === 'animation' ? 'アニメーション' : 
                 delay.phase === 'background' ? '背景' : 
                 delay.phase === 'sound' ? '音響' : 
                 delay.phase === 'editing' ? '編集' : '企画'} 工程の遅延
              </h3>
              <p className="text-sm text-gray-600">{delay.reason}</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getImpactColor(delay.impact)}`}>
              {delay.impact === 'low' ? '軽度' : 
               delay.impact === 'medium' ? '中度' : '重度'}
            </span>
            <span className="text-sm text-gray-500">{delay.delayDays}日遅延</span>
            {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
          </div>
        </div>
      </div>

      {isExpanded && (
        <div className="border-t border-indigo-100">
          <div className="p-4 bg-indigo-50/30">
            <div className="space-y-4">
              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-2">影響を受けるシーン</h4>
                <div className="space-y-3">
                  {delay.details.map((detail) => (
                    <div key={detail.scene} className="bg-white p-3 rounded-lg shadow-sm">
                      <div className="flex justify-between items-start">
                        <div>
                          <span className="text-sm font-medium text-gray-900">シーン {detail.scene}</span>
                          <p className="text-sm text-gray-600 mt-1">{detail.description}</p>
                        </div>
                        <span className="text-xs text-gray-500">
                          予定回復日: {new Date(detail.estimatedRecovery).toLocaleDateString('ja-JP')}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-600">担当者: {delay.assignedTo}</span>
                <span className={`px-2 py-1 rounded-full text-xs font-medium
                  ${delay.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : 
                    delay.status === 'in-progress' ? 'bg-blue-100 text-blue-800' : 
                    'bg-green-100 text-green-800'}`}>
                  {delay.status === 'pending' ? '対応待ち' : 
                   delay.status === 'in-progress' ? '対応中' : '解決済み'}
                </span>
              </div>
            </div>
          </div>

          {project && (
            <div className="p-4 border-t border-indigo-100">
              <h4 className="text-sm font-medium text-gray-700 mb-4">カット表</h4>
              <CutSheet 
                staff={stubData.staff.filter(s => 
                  delay.affectedScenes.some(scene => 
                    project.episodes.some(ep => 
                      ep.cuts.some(cut => 
                        cut.assignedTo === s.id && 
                        cut.number.includes(scene)
                      )
                    )
                  )
                )} 
                project={project} 
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default DelayReport;