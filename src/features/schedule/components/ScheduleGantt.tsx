import React, { useState, useRef, useCallback, useEffect } from 'react';
import { scheduleData as initialScheduleData } from '../../../data/scheduleData';

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

  // 2) 日付から列インデックスを計算する
  const getColumnIndex = (date: string): number => {
    const mondayDates = getMondayDates();
    const targetDate = new Date(date);
    
    // 最初の月曜日より前の場合は-1を返す
    if (targetDate < mondayDates[0]) return -1;
    
    // 各週の開始日（月曜日）からの差分を計算
    for (let i = 0; i < mondayDates.length; i++) {
      const nextMondayIndex = i + 1;
      const currentMonday = mondayDates[i];
      
      // 次の月曜日がない、または対象日が次の月曜日より前の場合
      if (nextMondayIndex >= mondayDates.length || targetDate < mondayDates[nextMondayIndex]) {
        // 現在の月曜日からの日数差を計算
        const diffDays = Math.floor((targetDate.getTime() - currentMonday.getTime()) / (1000 * 60 * 60 * 24));
        return i * 7 + diffDays; // 週インデックス * 7 + 週内の日数
      }
    }
    
    // ここに到達することはないはずだが、念のため
    return -1;
  };

  // 3) 列インデックスから日付を計算する
  const getDateFromColumnIndex = (colIndex: number): string => {
    const mondayDates = getMondayDates();
    const weekIndex = Math.floor(colIndex / 7);
    const dayOffset = colIndex % 7;
    
    if (weekIndex >= mondayDates.length) return '';
    
    const date = new Date(mondayDates[weekIndex]);
    date.setDate(date.getDate() + dayOffset);
    
    return date.toISOString().split('T')[0]; // YYYY-MM-DD形式
  };

  // 4) 工程の開始列と終了列を計算する
  const getProcessColumns = (process: Process): { startCol: number; endCol: number } => {
    const startCol = getColumnIndex(process.startDate);
    const endCol = getColumnIndex(process.endDate);
    return { startCol, endCol };
  };

  // 5) ドラッグ開始ハンドラー
  const handleDragStart = (
    e: React.MouseEvent,
    episodeIdx: number,
    processIdx: number,
    actionType: 'move' | 'resize-left' | 'resize-right'
  ) => {
    e.preventDefault();
    
    const process = data[episodeIdx].processes[processIdx];
    const { startCol, endCol } = getProcessColumns(process);
    
    dragInfoRef.current = {
      episodeIdx,
      processIdx,
      actionType,
      initialMouseX: e.clientX,
      initialStartCol: startCol,
      initialEndCol: endCol
    };
    
    setDragging(true);
    
    // マウスイベントのグローバルハンドラーを設定
    document.addEventListener('mousemove', handleDragMove);
    document.addEventListener('mouseup', handleDragEnd);
  };

  // 6) ドラッグ中ハンドラー
  const handleDragMove = useCallback((e: MouseEvent) => {
    if (!dragging || !dragInfoRef.current) return;
    
    const dragInfo = dragInfoRef.current;
    const deltaX = e.clientX - dragInfo.initialMouseX;
    
    // 1列の幅を30pxと仮定（実際のUIに合わせて調整）
    const columnWidth = 30;
    const deltaColumns = Math.round(deltaX / columnWidth);
    
    // データのコピーを作成
    const newData = [...data];
    const process = newData[dragInfo.episodeIdx].processes[dragInfo.processIdx];
    
    // アクションタイプに応じて処理
    switch (dragInfo.actionType) {
      case 'move':
        // 工程全体を移動
        const newStartCol = dragInfo.initialStartCol + deltaColumns;
        const newEndCol = dragInfo.initialEndCol + deltaColumns;
        
        // 負の列インデックスにならないように制限
        if (newStartCol >= 0) {
          process.startDate = getDateFromColumnIndex(newStartCol);
          process.endDate = getDateFromColumnIndex(newEndCol);
        }
        break;
        
      case 'resize-left':
        // 左端をリサイズ（開始日を変更）
        const newStartColResize = dragInfo.initialStartCol + deltaColumns;
        
        // 開始列が終了列を超えないように、かつ負にならないように制限
        if (newStartColResize >= 0 && newStartColResize < dragInfo.initialEndCol) {
          process.startDate = getDateFromColumnIndex(newStartColResize);
        }
        break;
        
      case 'resize-right':
        // 右端をリサイズ（終了日を変更）
        const newEndColResize = dragInfo.initialEndCol + deltaColumns;
        
        // 終了列が開始列より前にならないように制限
        if (newEndColResize > dragInfo.initialStartCol) {
          process.endDate = getDateFromColumnIndex(newEndColResize);
        }
        break;
    }
    
    setData(newData);
  }, [dragging, data]);

  // 7) ドラッグ終了ハンドラー
  const handleDragEnd = useCallback(() => {
    setDragging(false);
    dragInfoRef.current = null;
    
    // グローバルイベントリスナーを削除
    document.removeEventListener('mousemove', handleDragMove);
    document.removeEventListener('mouseup', handleDragEnd);
  }, [handleDragMove]);

  // コンポーネントのアンマウント時にイベントリスナーをクリーンアップ
  useEffect(() => {
    return () => {
      document.removeEventListener('mousemove', handleDragMove);
      document.removeEventListener('mouseup', handleDragEnd);
    };
  }, [handleDragMove, handleDragEnd]);

  // 8) エピソードの展開/折りたたみを切り替える
  const toggleEpisodeExpand = (episodeNumber: number) => {
    setExpandedEpisodes(prev => {
      const newSet = new Set(prev);
      if (newSet.has(episodeNumber)) {
        newSet.delete(episodeNumber);
      } else {
        newSet.add(episodeNumber);
      }
      return newSet;
    });
  };

  // 9) タスク選択ハンドラー
  const handleTaskSelect = (episodeIdx: number, processIdx: number) => {
    setSelectedTask({ episodeIdx, processIdx });
  };

  // 10) タスク選択解除ハンドラー
  const handleTaskDeselect = () => {
    setSelectedTask(null);
  };

  // 月曜日のリストを取得
  const mondayDates = getMondayDates();
  
  // 工程の種類と色のマッピング
  const processColors: Record<string, string> = {
    '絵コンテ': '#FFD700',
    '原画': '#FF6347',
    '動画': '#4682B4',
    '彩色': '#32CD32',
    '撮影': '#9370DB',
    '編集': '#FF69B4',
    'レイアウト': '#20B2AA',
    '背景': '#F4A460'
  };

  // 工程の種類
  const processTypes = Object.keys(processColors);

  return (
    <div className="overflow-auto">
      {/* ヘッダー部分（日付表示） */}
      <div className="flex border-b sticky top-0 bg-white z-10">
        {/* エピソード列ヘッダー */}
        <div className="flex-none w-40 p-2 font-semibold border-r">エピソード</div>
        
        {/* 日付ヘッダー */}
        <div className="flex">
          {mondayDates.map((monday, weekIndex) => {
            const dates = [];
            for (let i = 0; i < 7; i++) {
              const day = new Date(monday);
              day.setDate(day.getDate() + i);
              
              // 月の変わり目かどうかをチェック
              const isFirstDayOfMonth = day.getDate() === 1;
              
              // 土日かどうかをチェック
              const isWeekend = day.getDay() === 0 || day.getDay() === 6;
              
              dates.push(
                <div
                  key={`${weekIndex}-${i}`}
                  className={`w-8 text-center text-xs py-1 flex flex-col
                    ${isWeekend ? 'bg-gray-100' : ''}
                    ${isFirstDayOfMonth ? 'border-l-2 border-gray-400' : ''}
                  `}
                >
                  <span className={`${day.getDate() === 1 ? 'font-bold' : ''}`}>
                    {day.getDate() === 1 ? `${day.getMonth() + 1}月` : ''}
                  </span>
                  <span className={`${isWeekend ? 'text-red-500' : ''}`}>
                    {day.getDate()}
                  </span>
                </div>
              );
            }
            return dates;
          })}
        </div>
      </div>
      
      {/* エピソード行 */}
      <div>
        {data.map((item, episodeIdx) => {
          const isExpanded = expandedEpisodes.has(item.episode);
          
          return (
            <div key={episodeIdx} className="border-b">
              {/* エピソード行ヘッダー */}
              <div className="flex">
                <div
                  className="flex-none w-40 p-2 font-medium border-r flex items-center cursor-pointer hover:bg-gray-50"
                  onClick={() => toggleEpisodeExpand(item.episode)}
                >
                  <span className="mr-2">{isExpanded ? '▼' : '▶'}</span>
                  <span>エピソード {item.episode}</span>
                </div>
                
                {/* エピソード行のガントチャート部分 */}
                <div className="flex-grow relative h-10">
                  {item.processes.map((process, processIdx) => {
                    const { startCol, endCol } = getProcessColumns(process);
                    if (startCol < 0 || endCol < 0) return null;
                    
                    const width = (endCol - startCol + 1) * 32; // 1日の幅 = 32px
                    const left = startCol * 32; // 開始位置
                    
                    return (
                      <div
                        key={processIdx}
                        className="absolute h-8 rounded-md flex items-center justify-center text-xs font-medium cursor-pointer"
                        style={{
                          left: `${left}px`,
                          width: `${width}px`,
                          top: '4px',
                          backgroundColor: processColors[process.type] || '#ccc',
                          opacity: selectedTask && selectedTask.episodeIdx === episodeIdx && selectedTask.processIdx === processIdx ? 1 : 0.8
                        }}
                        onClick={() => handleTaskSelect(episodeIdx, processIdx)}
                      >
                        <div className="truncate px-2">{process.type}</div>
                        
                        {/* リサイズハンドル（左） */}
                        <div
                          className="absolute left-0 top-0 w-2 h-full cursor-ew-resize"
                          onMouseDown={(e) => handleDragStart(e, episodeIdx, processIdx, 'resize-left')}
                        />
                        
                        {/* 移動ハンドル（中央部分） */}
                        <div
                          className="absolute left-2 right-2 top-0 h-full cursor-move"
                          onMouseDown={(e) => handleDragStart(e, episodeIdx, processIdx, 'move')}
                        />
                        
                        {/* リサイズハンドル（右） */}
                        <div
                          className="absolute right-0 top-0 w-2 h-full cursor-ew-resize"
                          onMouseDown={(e) => handleDragStart(e, episodeIdx, processIdx, 'resize-right')}
                        />
                      </div>
                    );
                  })}
                </div>
              </div>
              
              {/* 展開時の詳細表示 */}
              {isExpanded && (
                <div className="pl-10 bg-gray-50">
                  {processTypes.map((type, typeIdx) => (
                    <div key={typeIdx} className="flex">
                      <div className="flex-none w-30 p-2 text-sm border-r">
                        <span
                          className="inline-block w-3 h-3 rounded-full mr-2"
                          style={{ backgroundColor: processColors[type] }}
                        />
                        {type}
                      </div>
                      
                      {/* 工程ごとのガントチャート行 */}
                      <div className="flex-grow relative h-8">
                        {item.processes
                          .filter(p => p.type === type)
                          .map((process, processIdx) => {
                            const { startCol, endCol } = getProcessColumns(process);
                            if (startCol < 0 || endCol < 0) return null;
                            
                            // この工程の実際のインデックスを見つける
                            const actualProcessIdx = item.processes.findIndex(
                              p => p === process
                            );
                            
                            const width = (endCol - startCol + 1) * 32;
                            const left = startCol * 32;
                            
                            return (
                              <div
                                key={processIdx}
                                className="absolute h-6 rounded-md flex items-center justify-center text-xs font-medium cursor-pointer"
                                style={{
                                  left: `${left}px`,
                                  width: `${width}px`,
                                  top: '4px',
                                  backgroundColor: processColors[type] || '#ccc',
                                  opacity: selectedTask && selectedTask.episodeIdx === episodeIdx && selectedTask.processIdx === actualProcessIdx ? 1 : 0.8
                                }}
                                onClick={() => handleTaskSelect(episodeIdx, actualProcessIdx)}
                              >
                                <div className="truncate px-2">
                                  {process.startDate.split('-').slice(1).join('/')} - {process.endDate.split('-').slice(1).join('/')}
                                </div>
                                
                                {/* リサイズハンドル（左） */}
                                <div
                                  className="absolute left-0 top-0 w-2 h-full cursor-ew-resize"
                                  onMouseDown={(e) => handleDragStart(e, episodeIdx, actualProcessIdx, 'resize-left')}
                                />
                                
                                {/* 移動ハンドル（中央部分） */}
                                <div
                                  className="absolute left-2 right-2 top-0 h-full cursor-move"
                                  onMouseDown={(e) => handleDragStart(e, episodeIdx, actualProcessIdx, 'move')}
                                />
                                
                                {/* リサイズハンドル（右） */}
                                <div
                                  className="absolute right-0 top-0 w-2 h-full cursor-ew-resize"
                                  onMouseDown={(e) => handleDragStart(e, episodeIdx, actualProcessIdx, 'resize-right')}
                                />
                              </div>
                            );
                          })}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
      
      {/* タスク詳細モーダル */}
      {selectedTask && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50" onClick={handleTaskDeselect}>
          <div className="bg-white p-4 rounded-lg shadow-lg max-w-md w-full" onClick={e => e.stopPropagation()}>
            <h3 className="text-lg font-bold mb-2">
              エピソード {data[selectedTask.episodeIdx].episode} - {data[selectedTask.episodeIdx].processes[selectedTask.processIdx].type}
            </h3>
            <div className="mb-4">
              <p><span className="font-medium">開始日:</span> {data[selectedTask.episodeIdx].processes[selectedTask.processIdx].startDate}</p>
              <p><span className="font-medium">終了日:</span> {data[selectedTask.episodeIdx].processes[selectedTask.processIdx].endDate}</p>
            </div>
            <div className="flex justify-end">
              <button
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                onClick={handleTaskDeselect}
              >
                閉じる
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ScheduleGantt; 