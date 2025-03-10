import { useState, useEffect, useCallback } from 'react';
import { CutGroup, CutEntry, StaffAssignment } from '../types/koubanhyou';
import { sampleEpisodes } from '../data/sampleData';
import * as XLSX from 'xlsx';

export const useKoubanHyou = (episodeId?: string) => {
  const [cutGroups, setCutGroups] = useState<CutGroup[]>([]);
  const [expandedGroups, setExpandedGroups] = useState<string[]>([]);
  const [editingColor, setEditingColor] = useState<string | null>(null);

  useEffect(() => {
    if (episodeId) {
      const episode = sampleEpisodes.find((ep) => ep.id === episodeId);
      if (episode && episode.cutGroups) {
        setCutGroups(episode.cutGroups);
        if (episode.cutGroups.length > 0) {
          setExpandedGroups([episode.cutGroups[0].id]);
        }
      }
    } else {
      const initialGroup: CutGroup = {
        id: 'group1',
        cutNo: '',
        rangeStart: '',
        rangeEnd: '',
        backgroundColor: '#ffffff',
        entries: [],
      };
      setCutGroups([initialGroup]);
      setExpandedGroups(['group1']);
    }
  }, [episodeId]);

  const generateUniqueId = useCallback(() => {
    return `entry_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
  }, []);

  const createEntry = useCallback(
    (groupId: string): CutEntry => {
      return {
        id: generateUniqueId(),
        partId: '',
        season: '',
        timeOfDay: '',
        weather: '',
        location: '',
        board: '',
        characters: [],
        costume: '',
        costumeNotes: '',
        props: '',
        notes: '',
        materials: [],
        remarks: '',
        status: 'default',
        backgroundColor: cutGroups.find((g) => g.id === groupId)?.backgroundColor || '#ffffff',
        assignedStaff: [],
      };
    },
    [cutGroups, generateUniqueId]
  );

  const addEntry = useCallback(
    (groupId: string, sourceEntry?: CutEntry) => {
      setCutGroups((prev) => {
        const group = prev.find((g) => g.id === groupId);
        if (!group) return prev;

        let newEntry: CutEntry;
        
        if (sourceEntry) {
          // コピー元のエントリーが指定されている場合、完全なディープコピーを作成
          newEntry = {
            id: generateUniqueId(),
            partId: sourceEntry.partId,
            season: sourceEntry.season,
            timeOfDay: sourceEntry.timeOfDay,
            weather: sourceEntry.weather,
            location: sourceEntry.location,
            board: sourceEntry.board,
            characters: [...sourceEntry.characters],
            costume: sourceEntry.costume,
            costumeNotes: sourceEntry.costumeNotes,
            props: sourceEntry.props,
            notes: sourceEntry.notes,
            materials: sourceEntry.materials.map(m => ({...m})),
            remarks: sourceEntry.remarks,
            status: sourceEntry.status,
            backgroundColor: sourceEntry.backgroundColor,
            assignedStaff: sourceEntry.assignedStaff.map(staff => ({...staff})),
            branchNo: sourceEntry.branchNo
          };
        } else {
          // 新規エントリーの場合
          newEntry = createEntry(groupId);
        }

        return prev.map((g) =>
          g.id === groupId 
            ? { ...g, entries: [...g.entries, newEntry] }
            : g
        );
      });
    },
    [createEntry, generateUniqueId]
  );

  const updateGroup = useCallback(
    (groupId: string, field: keyof CutGroup, value: any) => {
      setCutGroups((prev) =>
        prev.map((group) =>
          group.id === groupId ? { ...group, [field]: value } : group
        )
      );
    },
    []
  );

  const addGroup = useCallback(() => {
    const newGroupId = `group_${Date.now()}_${Math.random()
      .toString(36)
      .substring(2, 9)}`;

    setCutGroups((prev) => {
      const lastGroup = prev[prev.length - 1];
      const nextStartNumber = lastGroup?.rangeEnd ? String(Number(lastGroup.rangeEnd) + 1) : '1';

      const newGroup: CutGroup = {
        id: newGroupId,
        cutNo: '',
        rangeStart: nextStartNumber,
        rangeEnd: '',
        backgroundColor: '#ffffff',
        entries: [],
      };

      return [...prev, newGroup];
    });
    setExpandedGroups((prev) => [...prev, newGroupId]);
  }, []);

  const copyGroup = useCallback(
    (groupId: string) => {
      setCutGroups((prev) => {
        const groupToCopy = prev.find((g) => g.id === groupId);
        if (!groupToCopy) return prev;

        const newGroupId = `group_${Date.now()}_${Math.random()
          .toString(36)
          .substring(2, 9)}`;

        const lastGroup = prev[prev.length - 1];
        const nextStartNumber = lastGroup?.rangeEnd ? String(Number(lastGroup.rangeEnd) + 1) : '1';

        const newEntries = groupToCopy.entries.map((originalEntry) => {
          const newEntry = createEntry(newGroupId);
          return {
            ...newEntry,
            season: originalEntry.season,
            timeOfDay: originalEntry.timeOfDay,
            weather: originalEntry.weather,
            location: originalEntry.location,
            board: originalEntry.board,
            characters: [...originalEntry.characters],
            costume: originalEntry.costume,
            costumeNotes: originalEntry.costumeNotes,
            props: originalEntry.props,
            notes: originalEntry.notes,
            materials: [...originalEntry.materials],
            remarks: originalEntry.remarks,
            status: originalEntry.status,
            backgroundColor: originalEntry.backgroundColor,
            assignedStaff: [...originalEntry.assignedStaff],
          };
        });

        const newGroup: CutGroup = {
          ...groupToCopy,
          id: newGroupId,
          rangeStart: nextStartNumber,
          rangeEnd: nextStartNumber ? String(Number(nextStartNumber) + newEntries.length - 1) : '',
          entries: newEntries,
        };

        const insertIndex = prev.findIndex((g) => g.id === groupId) + 1;
        const newGroups = [...prev];
        newGroups.splice(insertIndex, 0, newGroup);
        return newGroups;
      });
    },
    [generateUniqueId, createEntry]
  );

  const deleteGroup = useCallback((groupId: string) => {
    setCutGroups((prev) => prev.filter((g) => g.id !== groupId));
    setExpandedGroups((prev) => prev.filter((id) => id !== groupId));
  }, []);

  const updateEntry = useCallback(
    (groupId: string, entryId: string, field: keyof CutEntry, value: any) => {
      setCutGroups((prev) =>
        prev.map((group) =>
          group.id === groupId
            ? {
                ...group,
                entries: group.entries.map((entry) =>
                  entry.id === entryId ? { ...entry, [field]: value } : entry
                ),
              }
            : group
        )
      );
    },
    []
  );

  const reorderEntries = useCallback((groupId: string, entries: CutEntry[]) => {
    setCutGroups((prev) =>
      prev.map((group) =>
        group.id === groupId
          ? {
              ...group,
              entries,
            }
          : group
      )
    );
  }, []);

  const deleteEntry = useCallback((groupId: string, entryId: string) => {
    setCutGroups((prev) =>
      prev.map((group) =>
        group.id === groupId
          ? {
              ...group,
              entries: group.entries.filter((entry) => entry.id !== entryId),
            }
          : group
      )
    );
  }, []);

  const assignStaff = useCallback(
    (groupId: string, entryId: string, assignment: StaffAssignment) => {
      setCutGroups((prev) =>
        prev.map((group) =>
          group.id === groupId
            ? {
                ...group,
                entries: group.entries.map((entry) =>
                  entry.id === entryId
                    ? {
                        ...entry,
                        assignedStaff: [assignment],
                      }
                    : entry
                ),
              }
            : group
        )
      );
    },
    []
  );

  const removeStaffAssignment = useCallback(
    (groupId: string, entryId: string, staffId: string) => {
      setCutGroups((prev) =>
        prev.map((group) =>
          group.id === groupId
            ? {
                ...group,
                entries: group.entries.map((entry) =>
                  entry.id === entryId
                    ? {
                        ...entry,
                        assignedStaff: entry.assignedStaff.filter(
                          (a) => a.staffId !== staffId
                        ),
                      }
                    : entry
                ),
              }
            : group
        )
      );
    },
    []
  );

  const exportToExcel = useCallback(() => {
    const exportData = cutGroups.flatMap((group) =>
      group.entries.map((entry) => ({
        パート: group.cutNo,
        範囲開始: group.rangeStart,
        範囲終了: group.rangeEnd,
        季節: entry.season,
        時間帯: entry.timeOfDay,
        天気: entry.weather,
        場所: entry.location,
        ボード: entry.board,
        キャラクター: entry.characters.join(', '),
        衣装: entry.costume,
        衣装メモ: entry.costumeNotes,
        小物: entry.props,
        備考: entry.remarks,
        スタッフ: entry.assignedStaff
          .map((a) => `${a.role}: ${a.staffId}`)
          .join(', '),
      }))
    );

    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.json_to_sheet(exportData);

    const columnWidths = [
      { wch: 10 },
      { wch: 8 },
      { wch: 8 },
      { wch: 6 },
      { wch: 8 },
      { wch: 6 },
      { wch: 20 },
      { wch: 10 },
      { wch: 20 },
      { wch: 15 },
      { wch: 20 },
      { wch: 15 },
      { wch: 20 },
      { wch: 30 },
    ];
    ws['!cols'] = columnWidths;

    XLSX.utils.book_append_sheet(wb, ws, '香盤表');
    XLSX.writeFile(wb, `香盤表_${new Date().toISOString().split('T')[0]}.xlsx`);
  }, [cutGroups]);

  return {
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
    reorderEntries,
  };
};