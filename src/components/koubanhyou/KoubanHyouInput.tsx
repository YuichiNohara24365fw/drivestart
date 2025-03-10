import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { sampleEpisodes } from '../../data/sampleData';
import { useKoubanHyou } from '../../hooks/useKoubanHyou';
import KoubanHyouHeader from './KoubanHyouHeader';
import KoubanHyouGroup from './KoubanHyouGroup';
import KoubanHyouOverview from './KoubanHyouOverview';
import StaffKoubanHyou from '../StaffKoubanHyou';

const KoubanHyouInput: React.FC = () => {
  const { id } = useParams();
  const episode = id ? sampleEpisodes.find(ep => ep.id === id) : null;
  const [activeTab, setActiveTab] = useState<'setting' | 'staff' | 'overview'>('setting');
  const {
    cutGroups,
    expandedGroups,
    editingColor,
    setExpandedGroups,
    setEditingColor,
    addGroup,
    copyGroup,
    deleteGroup,
    updateGroup,
    addEntry,
    updateEntry,
    deleteEntry,
    assignStaff,
    removeStaffAssignment,
    exportToExcel,
    reorderEntries
  } = useKoubanHyou(id);

  const handleGroupToggle = (groupId: string) => {
    setExpandedGroups(prev => 
      prev.includes(groupId)
        ? prev.filter(id => id !== groupId)
        : [...prev, groupId]
    );
  };

  return (
    <div className="space-y-4">
      <KoubanHyouHeader
        title={episode ? `第${episode.number}話「${episode.title}」香盤表` : '新規香盤表'}
        lastModified={episode?.lastModified}
        totalCuts={episode?.totalCuts}
        activeTab={activeTab}
        onTabChange={setActiveTab}
        onExport={exportToExcel}
        onAddGroup={addGroup}
      />

      {activeTab === 'setting' ? (
        <div className="space-y-4">
          {cutGroups.map(group => (
            <KoubanHyouGroup
              key={group.id}
              group={group}
              isExpanded={expandedGroups.includes(group.id)}
              onToggle={() => handleGroupToggle(group.id)}
              onUpdateGroup={(field, value) => updateGroup(group.id, field, value)}
              onCopy={() => copyGroup(group.id)}
              onDelete={() => deleteGroup(group.id)}
              onEditColor={() => setEditingColor(group.id)}
              editingColor={editingColor === group.id}
              onColorChange={(color) => {
                updateGroup(group.id, 'backgroundColor', color);
                setEditingColor(null);
              }}
              onAddEntry={(sourceEntry) => addEntry(group.id, sourceEntry)}
              onUpdateEntry={(entryId, field, value) => updateEntry(group.id, entryId, field, value)}
              onDeleteEntry={(entryId) => deleteEntry(group.id, entryId)}
              onAssignStaff={(entryId, assignment) => assignStaff(group.id, entryId, assignment)}
              onRemoveStaffAssignment={(entryId, staffId) => removeStaffAssignment(group.id, entryId, staffId)}
            />
          ))}
        </div>
      ) : activeTab === 'staff' ? (
        <StaffKoubanHyou episodeId={id} />
      ) : (
        <KoubanHyouOverview cutGroups={cutGroups} />
      )}
    </div>
  );
};

export default KoubanHyouInput;