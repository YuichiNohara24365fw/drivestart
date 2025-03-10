import React, { useState, useRef, useCallback, useEffect } from 'react';
import { Project } from '../types';
import { scheduleData as initialScheduleData, ProcessInfo } from '../data/scheduleData';

// === 型 ===
interface ScheduleDailyGanttProps {
  project: Project;        // 親コンポーネントから渡されるプロジェクト情報
  currentMonth: Date;      // 表示したい年月
}

// 日付をYYYY-MM-DD形式の文字列に変換
const formatDate = (date: Date): string => {
  return date.toISOString().split('T')[0];
};

// 2つの日付の差分を日数で取得
const getDaysDiff = (date1: string, date2: string): number => {
  const d1 = new Date(date1);
  const d2 = new Date(date2);
  return Math.floor((d2.getTime() - d1.getTime()) / (1000 * 60 * 60 * 24));
};

// ★ ドラッグ中の情報を保持するための型
type DragAction = 'move' | 'resize-left' | 'resize-right';
type DragInfo = {
  episodeIdx: number;
  processIdx: number;
  actionType: DragAction;
  initialMouseX: number;   // ドラッグ開始時点のマウスX座標
  initialStartCol: number; // ドラッグ開始時点での開始日(列)
  initialEndCol: number;   // ドラッグ開始時点での終了日(列)
};

const ScheduleDailyGantt: React.FC<ScheduleDailyGanttProps> = ({ project, currentMonth }) => {
  // ★ 1) scheduleDataをコピーしてローカルstate管理する
  //     (バーの開始日／終了日を更新していくため)
  const [data, setData] = useState(() => {
    // scheduleData は array。内容をJSONコピーして使う
    return JSON.parse(JSON.stringify(initialScheduleData)) as typeof initialScheduleData;
  });

  // エピソード展開状態
  const [expandedEpisodes, setExpandedEpisodes] = useState<Set<number>>(new Set());

  // ★ 2) ドラッグ関連 state / ref
  const [dragging, setDragging] = useState(false);
  const dragInfoRef = useRef<DragInfo | null>(null);

  // 当月の日数を取得
  const daysInMonth = new Date(
    currentMonth.getFullYear(),
    currentMonth.getMonth() + 1,
    0
  ).getDate();

  // 当月の開始日と終了日 (YYYY-MM-DD形式)
  const monthStart = formatDate(new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1));
  const monthEnd   = formatDate(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0));

  // ======================
  // 日付・カラム変換関連
  // ======================
  // (例) getColumnIndex('YYYY-MM-DD'): 月初から何日目か → 0-based index
  const getColumnIndex = (dateStr: string): number => {
    // 月初を基準にした日数差分
    return getDaysDiff(monthStart, dateStr);
  };

  // コラム番号(0-based)を YYYY-MM-DD文字列に変換
  // (例) 5列目 => 月初 + 5日後 の 日付文字列
  const colIndexToDateStr = (colIndex: number): string => {
    const d = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1);
    d.setDate(d.getDate() + colIndex); // colIndex 日分を加算
    return formatDate(d);
  };

  // ★ プロセスの表示位置を計算 (gridColumnStart/end)
  //   dailyベース => 1日 = 1 列
  const getProcessPosition = (startDate: string, endDate: string) => {
    // 月初から見た開始日の index
    const startCol = getColumnIndex(startDate);
    // duration
    const duration = getDaysDiff(startDate, endDate) + 1;
    // 表示上での gridColumnStart/end
    return {
      gridColumnStart: startCol + 2, // +2は話数列分のオフセット
      gridColumnEnd:   startCol + duration + 2,
      startCol,
      endCol: startCol + duration - 1 // 最終日は startCol+duration-1
    };
  };

  // 現在の日付を取得
  const today = new Date();
  today.setHours(0, 0, 0, 0);

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
  // ドラッグ・リサイズ処理
  // ======================
  const handleMouseDown = useCallback((
    e: React.MouseEvent<HTMLDivElement>,
    episodeIdx: number,
    processIdx: number,
    actionType: DragAction,
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
    
    // 移動距離(ピクセル)
    const deltaX = e.clientX - initialMouseX;
    // 1日分のピクセル幅 (仮)
    // 必要に応じて実際のセル幅から動的に算出したり、固定値にしたり
    const DAY_WIDTH = 50;
    
    // 移動(リサイズ)した日数
    const movedDays = Math.round(deltaX / DAY_WIDTH);

    let newStartCol = initialStartCol;
    let newEndCol   = initialEndCol;

    switch (actionType) {
      case 'move':
        newStartCol = initialStartCol + movedDays;
        newEndCol   = initialEndCol   + movedDays;
        break;
      case 'resize-left':
        newStartCol = initialStartCol + movedDays;
        if (newStartCol > newEndCol) {
          // 左端が右端越えたら補正
          newStartCol = newEndCol;
        }
        break;
      case 'resize-right':
        newEndCol = initialEndCol + movedDays;
        if (newEndCol < newStartCol) {
          newEndCol = newStartCol;
        }
        break;
    }

    // ★ setData で更新
    setData(prevData => {
      const newData = [...prevData];
      const targetEp = { ...newData[episodeIdx] };
      const processes = [...targetEp.processes];
      const p = { ...processes[processIdx] };

      // newStartCol, newEndCol を日付に変換
      const s = colIndexToDateStr(newStartCol);
      // newEndCol は inclusive なので、差分から終了日を求める
      // ただし colIndexToDateStr はその日を表すので単純に newEndCol を変換すればOK
      const eStr = colIndexToDateStr(newEndCol);

      p.startDate = s;
      p.endDate   = eStr;
      processes[processIdx] = p;
      targetEp.processes = processes;
      newData[episodeIdx] = targetEp;
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
  // 展開/折りたたみ
  // ======================
  const handleExpand = (episodeNumber: number) => {
    setExpandedEpisodes(prev => {
      const newSet = new Set(prev);
      newSet.add(episodeNumber);
      return newSet;
    });
  };
  const handleCollapse = (episodeNumber: number) => {
    setExpandedEpisodes(prev => {
      const newSet = new Set(prev);
      newSet.delete(episodeNumber);
      return newSet;
    });
  };

  // 横並び表示（折りたたみ時）
  const HorizontalEpisodeRow: React.FC<{
    episodeIdx: number;
    episodeNumber: number;
    processes: ProcessInfo[];
    onExpand: () => void;
  }> = ({ episodeIdx, episodeNumber, processes, onExpand }) => {
    return (
      <div
        className="relative grid border-b border-gray-200 overflow-hidden hover:bg-indigo-100/70 transition-colors"
        style={{
          gridTemplateColumns: `120px repeat(${daysInMonth}, minmax(0,1fr))`,
          gridTemplateRows: '40px'
        }}
      >
        <div
          className="p-2 font-medium text-gray-700 flex items-center border-r border-gray-200 cursor-pointer"
          onClick={onExpand}
        >
          #{episodeNumber}
        </div>

        {/* 日付セル背景 */}
        {Array.from({ length: daysInMonth }).map((_, colIndex) => (
          <div key={colIndex} className="border-r border-gray-200 last:border-r-0" />
        ))}

        {/* ガントバー描画 */}
        {processes
          .filter(proc => proc.startDate <= monthEnd && proc.endDate >= monthStart)
          .map((proc, processIdx) => {
            const pos = getProcessPosition(proc.startDate, proc.endDate);
            // 月外に完全にはみ出してる場合は非表示(必要に応じて判定)
            if (pos.gridColumnEnd < 2 || pos.gridColumnStart > daysInMonth + 1) {
              return null;
            }
            const colorClass = processColors[proc.type as keyof typeof processColors] ?? 'bg-gray-100 border-gray-300';

            // ドラッグ用コールバック
            const onMouseDownMove = (e: React.MouseEvent<HTMLDivElement>) => {
              handleMouseDown(e, episodeIdx, processIdx, 'move', pos.startCol, pos.endCol);
            };
            const onMouseDownLeft = (e: React.MouseEvent<HTMLDivElement>) => {
              e.stopPropagation(); // 親への伝搬を止める
              handleMouseDown(e, episodeIdx, processIdx, 'resize-left', pos.startCol, pos.endCol);
            };
            const onMouseDownRight = (e: React.MouseEvent<HTMLDivElement>) => {
              e.stopPropagation();
              handleMouseDown(e, episodeIdx, processIdx, 'resize-right', pos.startCol, pos.endCol);
            };

            return (
              <div
                key={processIdx}
                className={`relative flex items-center border rounded-md text-xs h-8 ${colorClass} hover:opacity-80 transition-opacity`}
                style={{
                  gridColumnStart: pos.gridColumnStart,
                  gridColumnEnd: pos.gridColumnEnd,
                  gridRow: 1,
                  marginTop: 'auto',
                  marginBottom: 'auto',
                  cursor: 'move' // バー全体をドラッグ移動
                }}
                onMouseDown={onMouseDownMove}
              >
                {/* 左端リサイズハンドル */}
                <div
                  className="absolute left-0 top-0 bottom-0 w-2 cursor-col-resize"
                  onMouseDown={onMouseDownLeft}
                />
                {/* バー内の文字表示を消したいなら削除 */}
                <span className="ml-2">{proc.type[0]}</span>
                {/* 右端リサイズハンドル */}
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

  // 縦並び表示（展開時）
  const VerticalEpisodeRow: React.FC<{
    episodeIdx: number;
    episodeNumber: number;
    processes: ProcessInfo[];
    onClose: () => void;
  }> = ({ episodeIdx, episodeNumber, processes, onClose }) => {
    return (
      <div className="border-b border-gray-200">
        <div
          className="p-2 font-medium text-gray-700 flex items-center cursor-pointer border-b border-gray-200"
          onClick={onClose}
        >
          ▼ #{episodeNumber}（クリックで閉じる）
        </div>

        {processes.map((proc, processIdx) => {
          const colorClass = processColors[proc.type] ?? 'bg-gray-100 border-gray-300';
          const pos = getProcessPosition(proc.startDate, proc.endDate);

          // 当月にかかってない場合スキップ（必要なら調整）
          if (proc.startDate > monthEnd || proc.endDate < monthStart) {
            return null;
          }

          // ドラッグ用コールバック
          const onMouseDownMove = (e: React.MouseEvent<HTMLDivElement>) => {
            handleMouseDown(e, episodeIdx, processIdx, 'move', pos.startCol, pos.endCol);
          };
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
              className="grid border-b border-gray-200 overflow-hidden hover:bg-indigo-100/70 transition-colors"
              style={{
                gridTemplateColumns: `120px repeat(${daysInMonth}, minmax(0,1fr))`,
                gridTemplateRows: '40px'
              }}
            >
              <div className="p-2 text-sm font-medium text-gray-700 border-r border-gray-200 flex items-center">
                {proc.type}
              </div>

              {/* 日付セル背景 */}
              {Array.from({ length: daysInMonth }).map((_, colIndex) => (
                <div key={colIndex} className="border-r border-gray-200 last:border-r-0" />
              ))}

              {/* ガントバー */}
              <div
                className={`relative flex items-center justify-center text-xs border rounded-md ${colorClass}`}
                style={{
                  gridColumnStart: pos.gridColumnStart,
                  gridColumnEnd: pos.gridColumnEnd,
                  gridRow: 1,
                  marginTop: 'auto',
                  marginBottom: 'auto',
                  height: '70%',
                  cursor: 'move'
                }}
                onMouseDown={onMouseDownMove}
              >
                {/* 左端リサイズハンドル */}
                <div
                  className="absolute left-0 top-0 bottom-0 w-2 cursor-col-resize"
                  onMouseDown={onMouseDownLeft}
                />
                {/* バー内の文字表示を消したいなら削除 */}
                {proc.type}
                {/* 右端リサイズハンドル */}
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

  return (
    <div className="w-full min-w-[768px]">
      {/* ヘッダー */}
      <div className="sticky top-0 bg-white z-20">
        <div
          className="border-b border-gray-200"
          style={{
            display: 'grid',
            gridTemplateRows: 'auto 40px',
            gridTemplateColumns: `120px repeat(${daysInMonth}, minmax(0,1fr))`
          }}
        >
          {/* 左上セル */}
          <div
            className="p-2 font-medium text-gray-500 text-sm border-r border-gray-200 flex items-center justify-center"
            style={{ gridRow: '1 / span 2' }}
          >
            {/* プロジェクト名など表示してもよい */}
          </div>

          {/* 上段: 年月 */}
          <div
            className="border-r border-gray-200 flex items-center justify-center text-sm font-medium text-gray-700"
            style={{ gridColumn: `span ${daysInMonth}` }}
          >
            {currentMonth.getFullYear()}年 {currentMonth.getMonth() + 1}月
          </div>

          {/* 下段: 日付 */}
          {Array.from({ length: daysInMonth }).map((_, i) => {
            const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), i + 1);
            const isToday = date.toDateString() === today.toDateString();
            const dayOfWeek = date.getDay(); // 0=日,1=月,...6=土
            const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
            const weekendStyle = dayOfWeek === 0 ? 'text-red-500' : dayOfWeek === 6 ? 'text-blue-500' : '';
            return (
              <div
                key={i}
                className={`border-r border-gray-200 last:border-r-0 flex items-center justify-center text-xs
                  ${isToday ? 'bg-indigo-100 ring-2 ring-indigo-400 ring-inset' : ''}
                  ${isWeekend ? weekendStyle : 'text-gray-500'}`}
              >
                {i + 1}日
              </div>
            );
          })}
        </div>
      </div>

      {/* ボディ */}
      <div className="max-h-[600px] overflow-y-auto overflow-x-hidden relative">
        {data.map((episode, epiIndex) => {
          const isExpanded = expandedEpisodes.has(episode.episode);

          return (
            <React.Fragment key={epiIndex}>
              {!isExpanded ? (
                <HorizontalEpisodeRow
                  episodeIdx={epiIndex}
                  episodeNumber={episode.episode}
                  processes={episode.processes}
                  onExpand={() => handleExpand(episode.episode)}
                />
              ) : (
                <VerticalEpisodeRow
                  episodeIdx={epiIndex}
                  episodeNumber={episode.episode}
                  processes={episode.processes}
                  onClose={() => handleCollapse(episode.episode)}
                />
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
};

export default ScheduleDailyGantt;