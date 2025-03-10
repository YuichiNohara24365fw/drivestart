import React, { useState } from 'react';
import { X, Search } from 'lucide-react';
import { sampleStaffEntries } from '../../data/sampleData';
import { StaffAssignment } from '../../types/koubanhyou';

interface StaffAssignmentModalProps {
  onClose: () => void;
  onAssign: (assignment: StaffAssignment) => void;
  currentAssignment?: StaffAssignment;
}

const StaffAssignmentModal: React.FC<StaffAssignmentModalProps> = ({
  onClose,
  onAssign,
  currentAssignment
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState<'staff' | 'temp'>('staff');

  const temporaryStaff = Array.from({ length: 26 }, (_, i) => ({
    id: `temp_${String.fromCharCode(65 + i)}`,
    name: `要員${String.fromCharCode(65 + i)}`,
    nameEn: `Staff ${String.fromCharCode(65 + i)}`,
    role: '作画',
    roleEn: 'Animator',
    department: '作画'
  }));

  const filteredStaff = selectedType === 'staff' 
    ? sampleStaffEntries.filter(staff => 
        staff.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        staff.nameEn.toLowerCase().includes(searchTerm.toLowerCase()) ||
        staff.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
        staff.roleEn.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : temporaryStaff.filter(staff =>
        staff.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        staff.nameEn.toLowerCase().includes(searchTerm.toLowerCase())
      );

  const handleAssign = (staffId: string, role: string, name: string, nameEn: string) => {
    onAssign({
      staffId,
      role,
      name,
      nameEn,
      isTemporary: selectedType === 'temp',
      assignedAt: new Date().toISOString()
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-lg w-full">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-medium">スタッフ割り当て</h3>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-4">
          {/* タブ切り替え */}
          <div className="flex rounded-lg border border-gray-200 p-1">
            <button
              onClick={() => setSelectedType('staff')}
              className={`flex-1 px-4 py-2 rounded-md text-sm font-medium ${
                selectedType === 'staff'
                  ? 'bg-indigo-100 text-indigo-800'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              正規スタッフ
            </button>
            <button
              onClick={() => setSelectedType('temp')}
              className={`flex-1 px-4 py-2 rounded-md text-sm font-medium ${
                selectedType === 'temp'
                  ? 'bg-indigo-100 text-indigo-800'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              仮スタッフ
            </button>
          </div>

          {/* 検索フィールド */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="名前や役職で検索..."
              className="w-full pl-10 pr-4 py-2 border rounded-lg"
            />
          </div>

          {/* スタッフリスト */}
          <div className="border rounded-lg overflow-hidden">
            <div className="max-h-[400px] overflow-y-auto">
              {filteredStaff.map(staff => (
                <div
                  key={staff.id}
                  className={`p-4 border-b last:border-b-0 hover:bg-gray-50 ${
                    currentAssignment?.staffId === staff.id ? 'bg-indigo-50' : ''
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium">{staff.name}</div>
                      <div className="text-sm text-gray-500">{staff.nameEn}</div>
                      <div className="text-sm text-gray-500">{staff.role}</div>
                    </div>
                    <button
                      onClick={() => handleAssign(staff.id, staff.role, staff.name, staff.nameEn)}
                      className={`px-3 py-1 rounded text-sm ${
                        currentAssignment?.staffId === staff.id
                          ? 'bg-indigo-600 text-white hover:bg-indigo-700'
                          : 'bg-indigo-100 text-indigo-700 hover:bg-indigo-200'
                      }`}
                    >
                      {currentAssignment?.staffId === staff.id ? '割当済' : '割り当て'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StaffAssignmentModal;