import React, { useState } from 'react';
import { characterData } from '../data/characterData';
import { CharacterAsset } from '../types/character';
import { 
  User, MapPin, Shirt, Briefcase, 
  Plus, Search, Filter, Download,
  ChevronDown, ChevronUp, ChevronRight
} from 'lucide-react';

const CharacterSettings = () => {
  const [selectedCharacter, setSelectedCharacter] = useState(characterData[0]);
  const [activeTab, setActiveTab] = useState<'character' | 'location' | 'costume' | 'prop'>('character');
  const [expandedAsset, setExpandedAsset] = useState<string | null>(null);

  const renderCharacterList = () => (
    <div className="space-y-2">
      {characterData.map(character => (
        <button
          key={character.id}
          onClick={() => setSelectedCharacter(character)}
          className={`w-full flex items-center gap-3 px-4 py-2 rounded-lg text-left ${
            selectedCharacter.id === character.id 
              ? 'bg-indigo-50 text-indigo-700' 
              : 'hover:bg-gray-50'
          }`}
        >
          <div className="relative w-10 h-10 rounded-full overflow-hidden">
            <img
              src={character.mainImage.imageUrl}
              alt={character.name}
              className="w-full h-full object-cover"
            />
          </div>
          <div>
            <div className="font-medium">{character.name}</div>
            <div className="text-xs text-gray-500">{character.profile.role || '役割未設定'}</div>
          </div>
          {selectedCharacter.id === character.id && (
            <ChevronRight className="w-4 h-4 ml-auto" />
          )}
        </button>
      ))}
    </div>
  );

  const renderAssetCard = (asset: CharacterAsset) => {
    const isExpanded = expandedAsset === asset.id;

    return (
      <div 
        key={asset.id}
        className="bg-white rounded-xl shadow-sm border border-indigo-50 overflow-hidden hover:shadow-md transition-all"
      >
        <div className="relative aspect-video">
          <img
            src={asset.imageUrl}
            alt={asset.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
          <div className="absolute bottom-2 left-2 right-2">
            <h3 className="text-white font-medium truncate">{asset.name}</h3>
          </div>
        </div>
        <div className="p-4">
          <div className="flex items-center justify-between mb-2">
            <div className="flex flex-wrap gap-1">
              {asset.tags.map((tag, index) => (
                <span 
                  key={index}
                  className="px-2 py-0.5 bg-indigo-50 text-indigo-600 rounded text-xs"
                >
                  {tag}
                </span>
              ))}
            </div>
            <button
              onClick={() => setExpandedAsset(isExpanded ? null : asset.id)}
              className="p-1 hover:bg-gray-100 rounded"
            >
              {isExpanded ? (
                <ChevronUp className="w-4 h-4" />
              ) : (
                <ChevronDown className="w-4 h-4" />
              )}
            </button>
          </div>
          <p className="text-sm text-gray-600 line-clamp-2">{asset.description}</p>
          
          {isExpanded && (
            <div className="mt-4 pt-4 border-t border-gray-100 space-y-2 text-sm">
              <div className="flex justify-between text-gray-600">
                <span>作成日:</span>
                <span>{new Date(asset.createdAt).toLocaleDateString('ja-JP')}</span>
              </div>
              {asset.metadata && (
                <>
                  {asset.metadata.size && (
                    <div className="flex justify-between text-gray-600">
                      <span>サイズ:</span>
                      <span>{asset.metadata.size}</span>
                    </div>
                  )}
                  {asset.metadata.dimensions && (
                    <div className="flex justify-between text-gray-600">
                      <span>寸法:</span>
                      <span>{asset.metadata.dimensions}</span>
                    </div>
                  )}
                  {asset.metadata.colorScheme && (
                    <div className="flex justify-between text-gray-600">
                      <span>カラースキーム:</span>
                      <span>{asset.metadata.colorScheme}</span>
                    </div>
                  )}
                </>
              )}
              <div className="flex justify-end gap-2 mt-4">
                <button className="px-3 py-1.5 bg-indigo-50 text-indigo-600 rounded-lg text-sm hover:bg-indigo-100">
                  編集
                </button>
                <button className="px-3 py-1.5 flex items-center gap-1 bg-indigo-600 text-white rounded-lg text-sm hover:bg-indigo-700">
                  <Download className="w-4 h-4" />
                  ダウンロード
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  };

  const getAssetsByType = () => {
    switch (activeTab) {
      case 'location':
        return selectedCharacter.locations;
      case 'costume':
        return selectedCharacter.costumes;
      case 'prop':
        return selectedCharacter.props;
      default:
        return [selectedCharacter.mainImage];
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">キャラクター設定</h1>
        <button className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:from-indigo-700 hover:to-purple-700">
          <Plus className="w-5 h-5" />
          新規キャラクター
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* キャラクター一覧 */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl shadow-sm border border-indigo-50 p-4">
            <h2 className="text-lg font-semibold mb-4">キャラクター一覧</h2>
            {renderCharacterList()}
          </div>
        </div>

        {/* キャラクター情報とアセット一覧 */}
        <div className="lg:col-span-3 space-y-6">
          {/* キャラクター情報 */}
          <div className="bg-white rounded-xl shadow-sm border border-indigo-50 overflow-hidden">
            <div className="relative aspect-[3/1]">
              <img
                src={selectedCharacter.mainImage.imageUrl}
                alt={selectedCharacter.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
              <div className="absolute bottom-4 left-4 right-4">
                <h2 className="text-xl font-bold text-white mb-1">
                  {selectedCharacter.name}
                </h2>
                <p className="text-sm text-white/80">
                  {selectedCharacter.description}
                </p>
              </div>
            </div>
            <div className="p-4">
              <div className="grid grid-cols-2 gap-4">
                {Object.entries(selectedCharacter.profile).map(([key, value]) => (
                  <div key={key} className="flex justify-between text-sm">
                    <span className="text-gray-500">{key}:</span>
                    <span className="text-gray-900">{value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* アセット一覧 */}
          <div className="space-y-6">
            {/* タブ */}
            <div className="flex items-center gap-2 bg-white rounded-lg border border-indigo-100 p-1">
              <button
                onClick={() => setActiveTab('character')}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg ${
                  activeTab === 'character' 
                    ? 'bg-indigo-100 text-indigo-800' 
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                <User className="w-4 h-4" />
                キャラクター
              </button>
              <button
                onClick={() => setActiveTab('location')}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg ${
                  activeTab === 'location' 
                    ? 'bg-indigo-100 text-indigo-800' 
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                <MapPin className="w-4 h-4" />
                場所
              </button>
              <button
                onClick={() => setActiveTab('costume')}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg ${
                  activeTab === 'costume' 
                    ? 'bg-indigo-100 text-indigo-800' 
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                <Shirt className="w-4 h-4" />
                衣装
              </button>
              <button
                onClick={() => setActiveTab('prop')}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg ${
                  activeTab === 'prop' 
                    ? 'bg-indigo-100 text-indigo-800' 
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                <Briefcase className="w-4 h-4" />
                小物
              </button>
            </div>

            {/* 検索・フィルター */}
            <div className="flex items-center gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="アセットを検索..."
                  className="w-full pl-10 pr-4 py-2 rounded-lg border border-indigo-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              <button className="flex items-center gap-2 px-4 py-2 border border-indigo-100 rounded-lg hover:bg-indigo-50">
                <Filter className="w-4 h-4" />
                フィルター
              </button>
              <button className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700">
                <Plus className="w-4 h-4" />
                新規追加
              </button>
            </div>

            {/* アセット一覧 */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {getAssetsByType().map(asset => renderAssetCard(asset))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CharacterSettings;