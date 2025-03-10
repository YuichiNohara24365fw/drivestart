import React from 'react';

interface CutType {
  label: string;
  count: number;
  group?: string;
}

const CutTypeManagement: React.FC = () => {
  const cutTypes: CutType[] = [
    { label: '作画_BG', count: 0 },
    { label: '全セル', count: 0 },
    { label: 'BG_only', count: 0 },
    { label: '作画_3D_BG', count: 0 },
    { label: '3D_BG', count: 0, group: 'LOUP' },
    { label: '他', count: 0 },
    { label: 'BANK', count: 0 },
    { label: '修BANK', count: 0 },
    { label: '欠番', count: 0 }
  ];

  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse text-xs">
        <thead>
          <tr>
            <th className="border border-gray-200 bg-gray-50 p-2 text-left">種別(0カット)</th>
            <th className="border border-gray-200 bg-gray-50 p-2 text-center">計</th>
          </tr>
        </thead>
        <tbody>
          {cutTypes.map((type, index) => (
            <tr key={index}>
              <td className="border border-gray-200 p-2">
                <div className="flex justify-between">
                  <span>{type.label}</span>
                  <span>{type.count}</span>
                </div>
                {type.group && (
                  <div className="text-gray-500 text-xs">{type.group}</div>
                )}
              </td>
              <td className="border border-gray-200 p-2 text-center">
                {type.label === '3D_BG' ? '1' : '0'}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default CutTypeManagement;