import React, { useState } from 'react';
import { CutGroup } from '../../types/koubanhyou';
import { characterData } from '../../data/characterData';
import { sampleStaffEntries } from '../../data/sampleData';
import MaterialInfoModal from '../MaterialInfoModal';

interface KoubanHyouOverviewProps {
  cutGroups: CutGroup[];
}

const KoubanHyouOverview: React.FC<KoubanHyouOverviewProps> = ({
  cutGroups,
}) => {
  const [selectedImage, setSelectedImage] = useState<{
    url: string;
    title: string;
    description: string;
    metadata?: {
      createdAt: string;
      updatedAt: string;
      size?: string;
      dimensions?: string;
      author?: string;
      tags?: string[];
    };
  } | null>(null);

  const getCharacterName = (characterCode: string) => {
    const character = characterData.find((char) => char.id === characterCode);
    return character?.name || characterCode;
  };

  const getStaffName = (staffId: string) => {
    const staff = sampleStaffEntries.find((s) => s.id === staffId);
    if (!staff) {
      if (staffId.startsWith('temp_')) {
        return `要員${staffId.replace('temp_', '')}`;
      }
      return '未割当';
    }
    return staff.name;
  };

  const getCharacterImage = (characterCode: string) => {
    const character = characterData.find((char) => char.id === characterCode);
    if (!character) return null;

    const images = [];

    // メイン画像を追加
    if (character.mainImage) {
      images.push({
        url: character.mainImage.imageUrl,
        title: character.mainImage.name,
        description: character.mainImage.description,
        type: 'character',
        metadata: character.mainImage.metadata,
      });
    }

    // 衣装画像を追加
    const costumeImages = character.costumes.map((costume) => ({
      url: costume.imageUrl,
      title: costume.name,
      description: costume.description,
      type: 'costume',
      metadata: costume.metadata,
    }));
    images.push(...costumeImages);

    return images;
  };

  // カットNo.を生成する関数
  const getCutNumber = (group: CutGroup, index: number) => {
    const cutNumber = group.rangeStart ? 
      String(parseInt(group.rangeStart) + index).padStart(3, '0') : 
      String(index + 1).padStart(3, '0');
    
    return `${group.cutNo}-${cutNumber}`;
  };

  return (
    <>
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-24">
                  カット
                </th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-32">
                  場所
                </th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-24">
                  時間帯
                </th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-24">
                  天気
                </th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-24">
                  キャラクター
                </th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-32">
                  衣装
                </th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-32">
                  小物
                </th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-32">
                  担当者
                </th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-48">
                  設定画像
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {cutGroups.map((group) => (
                <React.Fragment key={group.id}>
                  <tr>
                    <td
                      colSpan={9}
                      className="px-4 py-2 font-medium"
                      style={{ backgroundColor: group.backgroundColor }}
                    >
                      パート: {group.cutNo} ({group.rangeStart} -{' '}
                      {group.rangeEnd})
                    </td>
                  </tr>
                  {group.entries.map((entry, entryIndex) => (
                    <tr key={entry.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3 text-sm text-gray-500">
                        {getCutNumber(group, entryIndex)}
                        {entry.branchNo && `-${entry.branchNo}`}
                      </td>
                      <td className="px-4 py-3 text-sm">{entry.location}</td>
                      <td className="px-4 py-3 text-sm">{entry.timeOfDay}</td>
                      <td className="px-4 py-3 text-sm">{entry.weather}</td>
                      <td className="px-4 py-3 text-sm">
                        {entry.characters[0]
                          ? getCharacterName(entry.characters[0])
                          : ''}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex flex-col">
                          <span className="text-sm">{entry.costume}</span>
                          {entry.costumeNotes && (
                            <span className="text-xs text-gray-500">
                              {entry.costumeNotes}
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-3 text-sm">{entry.props}</td>
                      <td className="px-4 py-3">
                        {entry.assignedStaff.map((staff, index) => (
                          <div key={index} className="text-sm">
                            <span className="font-medium">
                              {getStaffName(staff.staffId)}
                            </span>
                            <span className="text-xs text-gray-500 ml-1">
                              ({staff.role})
                            </span>
                          </div>
                        ))}
                      </td>
                      <td className="px-4 py-3">
                        {entry.characters[0] && (
                          <div className="flex gap-2">
                            {getCharacterImage(entry.characters[0])?.map(
                              (image, index) => (
                                <button
                                  key={index}
                                  onClick={() =>
                                    setSelectedImage({
                                      url: image.url,
                                      title: image.title,
                                      description: image.description,
                                      metadata: {
                                        createdAt: new Date().toISOString(),
                                        updatedAt: new Date().toISOString(),
                                        ...image.metadata,
                                      },
                                    })
                                  }
                                  className="relative group cursor-pointer"
                                >
                                  <img
                                    src={image.url}
                                    alt={image.description}
                                    className="w-16 h-16 object-cover rounded-lg"
                                  />
                                  <div className="absolute inset-0 bg-black/50 text-white text-xs p-1 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg">
                                    {image.description}
                                  </div>
                                </button>
                              )
                            )}
                          </div>
                        )}
                      </td>
                    </tr>
                  ))}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {selectedImage && (
        <MaterialInfoModal
          material={{
            id: 'temp',
            type: '2D',
            title: selectedImage.title,
            url: selectedImage.url,
            metadata: {
              createdAt:
                selectedImage.metadata?.createdAt || new Date().toISOString(),
              updatedAt:
                selectedImage.metadata?.updatedAt || new Date().toISOString(),
              size: selectedImage.metadata?.size,
              dimensions: selectedImage.metadata?.dimensions,
              author: selectedImage.metadata?.author,
              tags: selectedImage.metadata?.tags || [],
              comments: selectedImage.description,
            },
          }}
          onClose={() => setSelectedImage(null)}
        />
      )}
    </>
  );
};

export default KoubanHyouOverview;