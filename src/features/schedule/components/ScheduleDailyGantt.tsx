import React, { useState, useRef, useCallback, useEffect } from 'react';
import { CalendarEvent } from '../types/schedule';

interface ScheduleDailyGanttProps {
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

// プロセスの型定義
interface Process {
  id: string;
  title: string;
  type: string;
  startDate: string;
  endDate: string;
  color: string;
  description?: string;
}

// エピソードの型定義
interface Episode {
  id: string;
  number: number;
  title: string;
  processes: Process[];
}

const ScheduleDailyGantt: React.FC<ScheduleDailyGanttProps> = ({ currentMonth }) => {
  // サンプルデータ
  const [episodes, setEpisodes] = useState<Episode[]>(() => {
    // 現在の月の最初の日
    const firstDay = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1);
    // 現在の月の最後の日
    const lastDay = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0);
    
    // サンプルエピソードデータを生成
    return [
      {
        id: '1',
        number: 1,
        title: 'エピソード1',
        processes: [
          {
            id: '1-1',
            title: '絵コンテ',
            type: 'storyboard',
            startDate: formatDate(new Date(firstDay.getTime() + 2 * 24 * 60 * 60 * 1000)),
            endDate: formatDate(new Date(firstDay.getTime() + 8 * 24 * 60 * 60 * 1000)),
            color: '#FFD700',
            description: 'エピソード1の絵コンテ作成'
          },
          {
            id: '1-2',
            title: '原画',
            type: 'keyframe',
            startDate: formatDate(new Date(firstDay.getTime() + 9 * 24 * 60 * 60 * 1000)),
            endDate: formatDate(new Date(firstDay.getTime() + 15 * 24 * 60 * 60 * 1000)),
            color: '#FF6347',
            description: 'エピソード1の原画作成'
          }
        ]
      },
      {
        id: '2',
        number: 2,
        title: 'エピソード2',
        processes: [
          {
            id: '2-1',
            title: '絵コンテ',
            type: 'storyboard',
            startDate: formatDate(new Date(firstDay.getTime() + 10 * 24 * 60 * 60 * 1000)),
            endDate: formatDate(new Date(firstDay.getTime() + 16 * 24 * 60 * 60 * 1000)),
            color: '#FFD700',
            description: 'エピソード2の絵コンテ作成'
          },
          {
            id: '2-2',
            title: '背景',
            type: 'background',
            startDate: formatDate(new Date(firstDay.getTime() + 17 * 24 * 60 * 60 * 1000)),
            endDate: formatDate(new Date(firstDay.getTime() + 23 * 24 * 60 * 60 * 1000)),
            color: '#F4A460',
            description: 'エピソード2の背景作成'
          }
        ]
      }
    ];
  });
  
  const [expandedEpisodes, setExpandedEpisodes] = useState<Set<string>>(new Set());
  const [daysInMonth, setDaysInMonth] = useState<Date[]>([]);
  
  // 月の日付を生成
  useEffect(() => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    
    // 月の最初の日
    const firstDay = new Date(year, month, 1);
    // 月の最後の日
    const lastDay = new Date(year, month + 1, 0);
    
    const days: Date[] = [];
    for (let d = new Date(firstDay); d <= lastDay; d.setDate(d.getDate() + 1)) {
      days.push(new Date(d));
    }
    
    setDaysInMonth(days);
  }, [currentMonth]);
  
  // エピソードの展開/折りたたみを切り替える
  const toggleEpisode = (episodeId: string) => {
    setExpandedEpisodes(prev => {
      const newSet = new Set(prev);
      if (newSet.has(episodeId)) {
        newSet.delete(episodeId);
      } else {
        newSet.add(episodeId);
      }
      return newSet;
    });
  };
  
  // 日付が週末かどうかをチェック
  const isWeekend = (date: Date): boolean => {
    const day = date.getDay();
    return day === 0 || day === 6; // 0: 日曜日, 6: 土曜日
  };
  
  // プロセスの位置とサイズを計算
  const getProcessStyle = (process: Process) => {
    const startDate = new Date(process.startDate);
    const endDate = new Date(process.endDate);
    
    // 月の最初の日
    const firstDayOfMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1);
    
    // 開始位置（日数）を計算
    const startDiff = Math.max(0, Math.floor((startDate.getTime() - firstDayOfMonth.getTime()) / (24 * 60 * 60 * 1000)));
    
    // 終了位置（日数）を計算
    const endDiff = Math.floor((endDate.getTime() - firstDayOfMonth.getTime()) / (24 * 60 * 60 * 1000));
    
    // 幅（日数）を計算
    const width = endDiff - startDiff + 1;
    
    return {
      gridColumnStart: startDiff + 1,
      gridColumnEnd: startDiff + width + 1,
      backgroundColor: process.color
    };
  };
  
  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <div className="p-4 border-b">
        <h2 className="text-xl font-bold">
          {currentMonth.getFullYear()}年{currentMonth.getMonth() + 1}月 デイリーガントチャート
        </h2>
      </div>
      
      <div className="overflow-x-auto">
        <div className="min-w-max">
          {/* ヘッダー（日付） */}
          <div className="grid grid-cols-[150px_repeat(auto-fill,minmax(30px,1fr))] border-b">
            <div className="p-2 font-medium border-r">エピソード</div>
            {daysInMonth.map((day, index) => (
              <div
                key={index}
                className={`p-1 text-center text-xs font-medium border-r ${
                  isWeekend(day) ? 'bg-gray-100' : ''
                }`}
              >
                {day.getDate()}
              </div>
            ))}
          </div>
          
          {/* エピソード行 */}
          {episodes.map((episode) => (
            <div key={episode.id} className="border-b">
              {/* エピソードヘッダー */}
              <div
                className="grid grid-cols-[150px_repeat(auto-fill,minmax(30px,1fr))]"
              >
                <div
                  className="p-2 font-medium border-r flex items-center cursor-pointer hover:bg-gray-50"
                  onClick={() => toggleEpisode(episode.id)}
                >
                  <span className="mr-2">
                    {expandedEpisodes.has(episode.id) ? '▼' : '▶'}
                  </span>
                  <span>エピソード {episode.number}</span>
                </div>
                
                {/* エピソード行のガントチャート部分 */}
                <div
                  className="col-span-full col-start-2 grid"
                  style={{
                    gridTemplateColumns: `repeat(${daysInMonth.length}, minmax(30px, 1fr))`
                  }}
                >
                  {episode.processes.map((process) => (
                    <div
                      key={process.id}
                      className="h-8 m-1 rounded-md flex items-center justify-center text-xs font-medium cursor-pointer"
                      style={getProcessStyle(process)}
                      title={`${process.title} (${process.startDate} - ${process.endDate})`}
                    >
                      <div className="truncate px-2">{process.title}</div>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* 展開時の詳細表示 */}
              {expandedEpisodes.has(episode.id) && (
                <div className="pl-8 bg-gray-50">
                  {episode.processes.map((process) => (
                    <div key={process.id} className="grid grid-cols-[150px_repeat(auto-fill,minmax(30px,1fr))] border-t">
                      <div className="p-2 text-sm border-r flex items-center">
                        <span
                          className="inline-block w-3 h-3 rounded-full mr-2"
                          style={{ backgroundColor: process.color }}
                        />
                        {process.title}
                      </div>
                      
                      {/* プロセス行のガントチャート部分 */}
                      <div
                        className="col-span-full col-start-2 grid"
                        style={{
                          gridTemplateColumns: `repeat(${daysInMonth.length}, minmax(30px, 1fr))`
                        }}
                      >
                        <div
                          className="h-6 m-1 rounded-md flex items-center justify-center text-xs font-medium"
                          style={getProcessStyle(process)}
                        >
                          {process.startDate.split('-').slice(1).join('/')} - {process.endDate.split('-').slice(1).join('/')}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ScheduleDailyGantt; 