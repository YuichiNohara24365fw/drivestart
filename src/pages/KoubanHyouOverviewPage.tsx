import React from 'react';
import { useParams } from 'react-router-dom';
import { sampleEpisodes } from '../data/sampleData';
import KoubanHyouOverview from '../components/koubanhyou/KoubanHyouOverview';

const KoubanHyouOverviewPage: React.FC = () => {
  const { id } = useParams();
  const episode = id ? sampleEpisodes.find(ep => ep.id === id) : null;

  if (!episode) {
    return <div>エピソードが見つかりません</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">
          第{episode.number}話「{episode.title}」香盤表
        </h1>
        {episode.lastModified && (
          <p className="text-sm text-gray-500">
            最終更新: {new Date(episode.lastModified).toLocaleDateString('ja-JP')}
          </p>
        )}
      </div>

      <KoubanHyouOverview cutGroups={episode.cutGroups || []} />
    </div>
  );
};

export default KoubanHyouOverviewPage;