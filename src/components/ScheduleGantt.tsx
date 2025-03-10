import React, { useState, useRef, useCallback, useEffect } from 'react';
import { scheduleData as initialScheduleData } from '../data/scheduleData';

interface ScheduleGanttProps {
  currentMonth: Date; // 今どの月を表示したいか
}

// 工程の型
interface Process {
  type: string;
  startDate: string; // "YYYY-MM-DD"
  endDate: string;   // "YYYY-MM-DD"
}

// スケジュールエピソードの型
interface ScheduleItem {
  episode: number;
  processes: Process[];
}

// ドラッグ中の情報を保持するための型
type DragInfo = {
  episodeIdx: number;   // どのエピソード(index)か
  processIdx: number;   // どの工程(index)か
  actionType: 'move' | 'resize-left' | 'resize-right';
  initialMouseX: number;   // ドラッグ開始時のマウスX位置
  initialStartCol: number; // ドラッグ開始時点での開始列
  initialEndCol: number;   // ドラッグ開始時点での終了列
};

const ScheduleGantt: React.FC<ScheduleGanttProps> = ({ currentMonth }) => {
  // scheduleDataをコピーして、ローカルstateで管理する
  const [data, setData] = useState<ScheduleItem[]>(() => JSON.parse(JSON.stringify(initialScheduleData)));
  const [expandedEpisodes, setExpandedEpisodes] = useState<Set<number>>(new Set());
  // タスク詳細表示用state（エピソードと工程のインデックス）
  const [selectedTask, setSelectedTask] = useState<{ episodeIdx: number; processIdx: number } | null>(null);

  // ドラッグ用
  const [dragging, setDragging] = useState(false);
  const dragInfoRef = useRef<DragInfo | null>(null);

  // 1) 指定した月の「月曜日」リストを作る
  const getMondayDates = (): Date[] => {
    const start = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1);
    const end = new Date(currentMonth.getFullYear() + 2, currentMonth.getMonth(), 0);
    while (start.getDay() !== 1) {
      start.setDate(start.getDate() + 1);
    }
    const result: Date[] = [];
    const temp = new Date(start);
    while (temp <= end) {
      result.push(new Date(temp));
      temp.setDate(temp.getDate() + 7);
    }
    return result;
  };

  const mondayDates = getMondayDates();
  const totalMondays = mondayDates.length;

  // 先頭週の月曜日
  const chartStart = mondayDates[0];
  const oneWeekMs = 7 * 24 * 60 * 60 * 1000;

  // 日付→何週目か(先頭週からの差) の計算
  const dateToColumn = (d: Date) => {
    const diff = d.getTime() - chartStart.getTime();
    return Math.floor(diff / oneWeekMs);
  };

  // カラム(週数)→Date の計算
  const columnToDate = (col: number) => {
    return new Date(chartStart.getTime() + col * oneWeekMs);
  };

  // カラム→YYYY-MM-DD 文字列
  const colToDateString = (col: number) => {
    const d = columnToDate(col);
    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, '0');
    const dd = String(d.getDate()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd}`;
  };

  // gridColumnStart/End 計算
  const computeGanttColumns = (startDateStr: string, endDateStr: string) => {
    const startDate = new Date(startDateStr);
    const endDate = new Date(endDateStr);

    const startCol = dateToColumn(startDate);
    const endCol = dateToColumn(endDate);

    const gridColumnStart = startCol + 2;  // +2: Episode列 と余白1列ぶん
    const gridColumnEnd   = endCol   + 2 + 1;

    if (gridColumnEnd < 2 || gridColumnStart > totalMondays + 1) {
      return null;
    }
    return {
      gridColumnStart: Math.max(gridColumnStart, 2),
      gridColumnEnd:   Math.min(gridColumnEnd, totalMondays + 2),
      startCol,
      endCol
    };
  };

  // 月グループ（ヘッダ表示用）
  interface MonthGroup {
    year: number;
    month: number;
    mondays: Date[];
  }
  const groupByMonth = (dates: Date[]): MonthGroup[] => {
    const map: Record<string, MonthGroup> = {};
    dates.forEach(d => {
      const y = d.getFullYear();
      const m = d.getMonth();
      const key = `${y}-${m}`;
      if (!map[key]) {
        map[key] = { year: y, month: m, mondays: [] };
      }
      map[key].mondays.push(d);
    });
    return Object.values(map).sort((a, b) => {
      if (a.year !== b.year) return a.year - b.year;
      return a.month - b.month;
    });
  };
  const monthGroups = groupByMonth(mondayDates);

  // 今日のハイライト
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const isCurrentWeek = (monday: Date) => {
    const nextMon = new Date(monday);
    nextMon.setDate(nextMon.getDate() + 7);
    return monday <= today && today < nextMon;
  };

  // 色設定
  const processColors: Record<string, string> = {
    '絵コンテ':       'bg-purple-500 border-purple-700 text-white',
    'レイアウト':     'bg-blue-500 border-blue-700 text-white',
    'アニメーション': 'bg-indigo-500 border-indigo-700 text-white',
    '背景':           'bg-emerald-500 border-emerald-700 text-white',
    '彩色':           'bg-amber-500 border-amber-700 text-white',
    'コンポジット':    'bg-rose-500 border-rose-700 text-white',
    '編集':           'bg-gray-500 border-gray-700 text-white',
  };

  // ======================
  // ドラッグ＆リサイズ関連
  // ======================
  const handleMouseDown = useCallback((
    e: React.MouseEvent<HTMLDivElement, MouseEvent>,
    episodeIdx: number,
    processIdx: number,
    actionType: 'move' | 'resize-left' | 'resize-right',
    startCol: number,
    endCol: number
  ) => {
    e.preventDefault();
    setDragging(true);
    dragInfoRef.current = {
      episodeIdx,
      processIdx,
      actionType,
      initialMouseX: e.clientX,
      initialStartCol: startCol,
      initialEndCol: endCol,
    };
  }, []);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!dragging || !dragInfoRef.current) return;

    const { episodeIdx, processIdx, actionType, initialMouseX, initialStartCol, initialEndCol } = dragInfoRef.current;
    const deltaX = e.clientX - initialMouseX;

    // 1週=25px と仮定
    const WEEK_WIDTH = 10;
    const movedCols = Math.round(deltaX / WEEK_WIDTH);

    let newStartCol = initialStartCol;
    let newEndCol   = initialEndCol;

    switch (actionType) {
      case 'move':
        newStartCol = initialStartCol + movedCols;
        newEndCol   = initialEndCol   + movedCols;
        break;
      case 'resize-left':
        newStartCol = initialStartCol + movedCols;
        if (newStartCol > newEndCol) {
          newStartCol = newEndCol;
        }
        break;
      case 'resize-right':
        newEndCol = initialEndCol + movedCols;
        if (newEndCol < newStartCol) {
          newEndCol = newStartCol;
        }
        break;
    }

    setData(prev => {
      const newData = [...prev];
      const targetEpisode = { ...newData[episodeIdx] };
      const targetProcesses = [...targetEpisode.processes];
      const targetProcess = { ...targetProcesses[processIdx] };

      targetProcess.startDate = colToDateString(newStartCol);
      targetProcess.endDate   = colToDateString(newEndCol);

      targetProcesses[processIdx] = targetProcess;
      targetEpisode.processes = targetProcesses;
      newData[episodeIdx] = targetEpisode;
      return newData;
    });
  }, [dragging]);

  const handleMouseUp = useCallback(() => {
    setDragging(false);
    dragInfoRef.current = null;
  }, []);

  useEffect(() => {
    if (dragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    } else {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    }
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [dragging, handleMouseMove, handleMouseUp]);

  // ======================
  // 展開・折りたたみ
  // ======================
  const handleExpand = (ep: number) => {
    setExpandedEpisodes(prev => new Set(prev).add(ep));
  };
  const handleCollapse = (ep: number) => {
    setExpandedEpisodes(prev => {
      const newSet = new Set(prev);
      newSet.delete(ep);
      return newSet;
    });
  };

  // タスクバーのダブルクリックで詳細を表示
  const handleTaskDoubleClick = (episodeIdx: number, processIdx: number) => {
    setSelectedTask({ episodeIdx, processIdx });
  };

  // モーダルを閉じる
  const closeTaskModal = () => {
    setSelectedTask(null);
  };

  // モーダル外クリックで閉じる
  const handleModalBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      closeTaskModal();
    }
  };

  // ----------------
  // 横並び表示
  // ----------------
  const HorizontalEpisodeRow: React.FC<{
    episodeIdx: number;
    episode: number;
    processes: Process[];
    onExpand: () => void;
  }> = ({ episodeIdx, episode, processes, onExpand }) => {
    return (
      <div
        key={episodeIdx}
        className="grid border-b border-gray-200 overflow-hidden hover:bg-indigo-100/70 transition-colors"
        style={{
          gridTemplateColumns: `120px repeat(${totalMondays}, minmax(0,1fr))`,
          gridTemplateRows: '40px'
        }}
      >
        {/* 話数セル */}
        <div
          className="p-2 font-medium text-gray-700 flex items-center border-r border-gray-200 cursor-pointer"
          onClick={onExpand}
        >
          #{episode}
        </div>

        {/* 週セル（背景だけ） */}
        {Array.from({ length: totalMondays }).map((_, i) => (
          <div key={i} className="border-r border-gray-200 last:border-r-0" />
        ))}

        {/* ガントバー */}
        {processes.map((p, processIdx) => {
          const pos = computeGanttColumns(p.startDate, p.endDate);
          if (!pos) return null;

          const color = processColors[p.type] || 'bg-gray-100 border-gray-300';
          const onMouseDownMove = (e: React.MouseEvent<HTMLDivElement>) =>
            handleMouseDown(e, episodeIdx, processIdx, 'move', pos.startCol, pos.endCol);
          const onMouseDownLeft = (e: React.MouseEvent<HTMLDivElement>) => {
            e.stopPropagation();
            handleMouseDown(e, episodeIdx, processIdx, 'resize-left', pos.startCol, pos.endCol);
          };
          const onMouseDownRight = (e: React.MouseEvent<HTMLDivElement>) => {
            e.stopPropagation();
            handleMouseDown(e, episodeIdx, processIdx, 'resize-right', pos.startCol, pos.endCol);
          };

          return (
            <div
              key={processIdx}
              className={`relative flex items-center text-xs border rounded-md h-8 ${color}`}
              style={{
                gridColumnStart: pos.gridColumnStart,
                gridColumnEnd:   pos.gridColumnEnd,
                gridRow: 1,
                marginTop: 'auto',
                marginBottom: 'auto',
                cursor: 'move',
              }}
              onMouseDown={onMouseDownMove}
              onDoubleClick={(e) => {
                e.stopPropagation();
                handleTaskDoubleClick(episodeIdx, processIdx);
              }}
            >
              {/* 左リサイズハンドル */}
              <div
                className="absolute left-0 top-0 bottom-0 w-2 cursor-col-resize"
                onMouseDown={onMouseDownLeft}
              />
              <span className="ml-2">{p.type[0]}</span>
              {/* 右リサイズハンドル */}
              <div
                className="absolute right-0 top-0 bottom-0 w-2 cursor-col-resize"
                onMouseDown={onMouseDownRight}
              />
            </div>
          );
        })}
      </div>
    );
  };

  // ----------------
  // 縦並び(展開)表示
  // ----------------
  const VerticalEpisodeRow: React.FC<{
    episodeIdx: number;
    episode: number;
    processes: Process[];
    onClose: () => void;
  }> = ({ episodeIdx, episode, processes, onClose }) => {
    return (
      <div className="border-b border-gray-200">
        {/* タイトル部分 (開閉ボタン) */}
        <div
          className="p-2 font-medium text-gray-700 flex items-center cursor-pointer border-b border-gray-200 hover:bg-indigo-100/70 transition-colors"
          onClick={onClose}
        >
          ▼ #{episode}（クリックで閉じる）
        </div>
        {processes.map((p, processIdx) => {
          const pos = computeGanttColumns(p.startDate, p.endDate);
          if (!pos) return null;
          const color = processColors[p.type] || 'bg-gray-100 border-gray-300';

          const onMouseDownMove = (e: React.MouseEvent<HTMLDivElement>) =>
            handleMouseDown(e, episodeIdx, processIdx, 'move', pos.startCol, pos.endCol);
          const onMouseDownLeft = (e: React.MouseEvent<HTMLDivElement>) => {
            e.stopPropagation();
            handleMouseDown(e, episodeIdx, processIdx, 'resize-left', pos.startCol, pos.endCol);
          };
          const onMouseDownRight = (e: React.MouseEvent<HTMLDivElement>) => {
            e.stopPropagation();
            handleMouseDown(e, episodeIdx, processIdx, 'resize-right', pos.startCol, pos.endCol);
          };

          return (
            <div
              key={processIdx}
              className="grid border-b border-gray-100 hover:bg-indigo-100/70 transition-colors"
              style={{
                gridTemplateColumns: `120px repeat(${totalMondays}, minmax(0,1fr))`,
                gridTemplateRows: '40px'
              }}
            >
              <div className="p-2 text-sm font-medium text-gray-700 border-r border-gray-200 flex items-center">
                {p.type}
              </div>
              {Array.from({ length: totalMondays }).map((_, i) => (
                <div key={i} className="border-r border-gray-200 last:border-r-0" />
              ))}
              <div
                className={`relative flex items-center justify-center text-xs border rounded-md h-6 ${color}`}
                style={{
                  gridColumnStart: pos.gridColumnStart,
                  gridColumnEnd:   pos.gridColumnEnd,
                  gridRow: 1,
                  marginTop: 'auto',
                  marginBottom: 'auto',
                  height: '80%',
                  cursor: 'move',
                }}
                onMouseDown={onMouseDownMove}
                onDoubleClick={(e) => {
                  e.stopPropagation();
                  handleTaskDoubleClick(episodeIdx, processIdx);
                }}
              >
                <div
                  className="absolute left-0 top-0 bottom-0 w-2 cursor-col-resize"
                  onMouseDown={onMouseDownLeft}
                />
                <span
                  style={{
                    whiteSpace: 'nowrap',
                    overflow: 'visible',
                    position: 'relative',
                    zIndex: 10,
                  }}
                >
                  {p.type}
                </span>
                <div
                  className="absolute right-0 top-0 bottom-0 w-2 cursor-col-resize"
                  onMouseDown={onMouseDownRight}
                />
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  // タスク詳細モーダル
  const TaskModal: React.FC<{
    task: { episodeIdx: number; processIdx: number };
    onClose: () => void;
  }> = ({ task, onClose }) => {
    const { episodeIdx, processIdx } = task;
    const episode = data[episodeIdx];
    const process = episode.processes[processIdx];
    
    // タスクの色を取得
    const colorClass = processColors[process.type] || 'bg-gray-500';
    // ヘッダー用のカラークラス (bg-* → text-* と border-* に変換)
    const headerColorClass = colorClass
      .replace('bg-', 'text-')
      .replace('border-', '');

    return (
      <div 
        className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
        onClick={handleModalBackdropClick}
      >
        <div 
          className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4 overflow-hidden"
          onClick={e => e.stopPropagation()}
        >
          {/* モーダルヘッダー */}
          <div className={`px-6 py-4 border-b ${headerColorClass}`}>
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-bold">タスク詳細</h3>
              <button 
                onClick={onClose}
                className="text-gray-500 hover:text-gray-700 focus:outline-none"
              >
                ✕
              </button>
            </div>
          </div>
          
          {/* モーダル本文 */}
          <div className="px-6 py-4">
            <div className="mb-4">
              <div className="text-sm text-gray-500 mb-1">エピソード</div>
              <div className="text-lg font-semibold">#{episode.episode}</div>
            </div>
            
            <div className="mb-4">
              <div className="text-sm text-gray-500 mb-1">タスク種別</div>
              <div className="flex items-center">
                <span className={`inline-block w-3 h-3 rounded-full mr-2 ${colorClass.split(' ')[0]}`}></span>
                <span className="text-lg font-semibold">{process.type}</span>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="text-sm text-gray-500 mb-1">開始日</div>
                <div className="text-lg font-semibold">{process.startDate}</div>
              </div>
              
              <div>
                <div className="text-sm text-gray-500 mb-1">終了日</div>
                <div className="text-lg font-semibold">{process.endDate}</div>
              </div>
            </div>
            
            <div className="mt-4">
              <div className="text-sm text-gray-500 mb-1">期間</div>
              <div className="text-lg font-semibold">
                {Math.round((new Date(process.endDate).getTime() - new Date(process.startDate).getTime()) / (1000 * 60 * 60 * 24)) + 1}日間
              </div>
            </div>
          </div>
          
          {/* モーダルフッター */}
          <div className="px-6 py-3 bg-gray-50 flex justify-end">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-gray-400"
            >
              閉じる
            </button>
          </div>
        </div>
      </div>
    );
  };

  // ======================
  // レンダリング
  // ======================
  return (
    <div className="w-full min-w-[768px]">
      {/* === ヘッダ === */}
      <div className="sticky top-0 bg-white z-20">
        <div
          className="border-b border-gray-200"
          style={{
            display: 'grid',
            gridTemplateRows: 'auto 40px',
            gridTemplateColumns: `120px repeat(${totalMondays}, minmax(0,1fr))`
          }}
        >
          <div
            className="p-2 font-medium text-gray-500 text-sm border-r border-gray-200 flex items-center justify-center"
            style={{ gridRow: '1 / span 2' }}
          >
            {/* (空でもOK) */}
          </div>
          {monthGroups.map((grp, idx) => {
            const colSpan = grp.mondays.length;
            return (
              <div
                key={idx}
                className="border-r border-gray-200 flex items-center justify-center text-sm font-medium text-gray-700"
                style={{ gridColumn: `span ${colSpan}` }}
              >
                {grp.year}年{grp.month + 1}月
              </div>
            );
          })}
          {mondayDates.map((d, i) => {
            const highlight = isCurrentWeek(d)
              ? 'bg-indigo-100 ring-2 ring-indigo-400 ring-inset text-gray-800'
              : 'text-gray-500';
            return (
              <div
                key={i}
                className={`border-r border-gray-200 last:border-r-0 flex items-center justify-center text-xs ${highlight}`}
              >
                {d.getDate()}
              </div>
            );
          })}
        </div>
      </div>

      {/* === ボディ === */}
      <div className="max-h-[600px] overflow-y-auto overflow-x-hidden relative">
        {data.map((ep, i) => {
          const expanded = expandedEpisodes.has(ep.episode);
          return (
            <React.Fragment key={i}>
              {!expanded && (
                <HorizontalEpisodeRow
                  episodeIdx={i}
                  episode={ep.episode}
                  processes={ep.processes}
                  onExpand={() => handleExpand(ep.episode)}
                />
              )}
              {expanded && (
                <VerticalEpisodeRow
                  episodeIdx={i}
                  episode={ep.episode}
                  processes={ep.processes}
                  onClose={() => handleCollapse(ep.episode)}
                />
              )}
            </React.Fragment>
          );
        })}
      </div>

      {/* タスク詳細モーダル */}
      {selectedTask && (
        <TaskModal task={selectedTask} onClose={closeTaskModal} />
      )}
    </div>
  );
};

export default ScheduleGantt;