import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ProcessData } from '../types';
import ProgressBar from './ProgressBar';

interface CutProgressTableProps {
  processData: ProcessData[];
}

const CutProgressTable: React.FC<CutProgressTableProps> = ({ processData }) => {
  const navigate = useNavigate();

  const handleStaffClick = (staffId: string) => {
    navigate(`/staff/${staffId}`);
  };

  return (
    <div className="grid grid-cols-2 divide-x divide-gray-200">
      {[0, 1].map(section => (
        <div key={section} className="overflow-x-auto">
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr className="bg-gray-50">
                <th className="border-b border-gray-200 p-2">工程</th>
                <th className="border-b border-gray-200 p-2">担当</th>
                <th className="border-b border-gray-200 p-2">ALL</th>
                <th className="border-b border-gray-200 p-2">IN</th>
                <th className="border-b border-gray-200 p-2">UP</th>
                <th className="border-b border-gray-200 p-2">手持</th>
                <th className="border-b border-gray-200 p-2">残</th>
                <th className="border-b border-gray-200 p-2">R</th>
                <th className="border-b border-gray-200 p-2">制手</th>
                <th className="border-b border-gray-200 p-2">UP</th>
                <th className="border-b border-gray-200 p-2">日割</th>
                <th className="border-b border-gray-200 p-2">進捗</th>
              </tr>
            </thead>
            <tbody>
              {processData.slice(section * 25, (section + 1) * 25).map((row, i) => (
                <tr 
                  key={i} 
                  className={`hover:bg-gray-50 ${
                    row.isDelayed ? 'bg-red-50' : ''
                  }`}
                >
                  <td className="border-b border-gray-200 p-2">{row.process}</td>
                  <td 
                    className="border-b border-gray-200 p-2 cursor-pointer hover:text-indigo-600"
                    onClick={() => handleStaffClick(row.staff.replace(/[^0-9]/g, ''))}
                  >
                    <div className="flex items-center gap-2">
                      {row.staff}
                      {row.isDelayed && (
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-red-100 text-red-800">
                          {row.delayDays}日遅延
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="border-b border-gray-200 p-2 text-center">{row.all}</td>
                  <td className="border-b border-gray-200 p-2 text-center">{row.in}</td>
                  <td className="border-b border-gray-200 p-2 text-center">{row.up}</td>
                  <td className="border-b border-gray-200 p-2 text-center">{row.holding}</td>
                  <td className="border-b border-gray-200 p-2 text-center">{row.remaining}</td>
                  <td className="border-b border-gray-200 p-2 text-center">{row.r}</td>
                  <td className="border-b border-gray-200 p-2 text-center">{row.control}</td>
                  <td className="border-b border-gray-200 p-2 text-center">{row.upStatus}</td>
                  <td className="border-b border-gray-200 p-2 text-center">{row.daily}</td>
                  <td className="border-b border-gray-200 p-2">
                    <ProgressBar
                      progress={row.progress}
                      expectedProgress={row.expectedProgress}
                      isDelayed={row.isDelayed}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ))}
    </div>
  );
};

export default CutProgressTable;