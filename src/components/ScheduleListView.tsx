import React, { useState } from 'react';
import { Project } from '../types';
import { scheduleData } from '../data/scheduleData';

interface ScheduleGanttProps {
  project: Project;
  currentMonth: Date;
}

/** 当月の1日から月末日までの日付配列を返す関数 */
const getMonthDates = (targetMonth: Date): Date[] => {
  const year = targetMonth.getFullYear();
  const month = targetMonth.getMonth();

  // 当月1日
  const startDate = new Date(year, month, 1);
  // 当月末日 (翌月の0日目)
  const endDate = new Date(year, month + 1, 0);

  const result: Date[] = [];
  const temp = new Date(startDate);
  while (temp <= endDate) {
    result.push(new Date(temp));
    temp.setDate(temp.getDate() + 1);
  }
  return result;
};

const ScheduleGantt: React.FC<ScheduleGanttProps> = ({ project, currentMonth }) => {
  // ★ 1) 展開中の話数を複数管理 (Set)
  const [expandedEpisodes, setExpandedEpisodes] = useState<Set<number>>(new Set());

  // クリックで展開する
  const handleExpand = (episodeNumber: number) => {
    setExpandedEpisodes(prev => {
      const newSet = new Set(prev);
      newSet.add(episodeNumber);
      return newSet;
    });
  };

  // 折りたたむ
  const handleCollapse = (episodeNumber: number) => {
    setExpandedEpisodes(prev => {
      const newSet = new Set(prev);
      newSet.delete(episodeNumber);
      return newSet;
    });
  };

  // 当月1日～月末日までの日付を取得
  const monthDates = getMonthDates(currentMonth);
  const totalDaysInMonth = monthDates.length;

  // 現在の日付を取得
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // 色設定
  const processColors = {
    '絵コンテ':        'bg-purple-100 border-purple-300',
    'レイアウト':      'bg-blue-100 border-blue-300',
    'アニメーション':  'bg-indigo-100 border-indigo-300',
    '背景':            'bg-emerald-100 border-emerald-300',
    '彩色':            'bg-amber-100 border-amber-300',
    'コンポジット':     'bg-rose-100 border-rose-300',
    '編集':            'bg-gray-100 border-gray-300'
  };

  /**
   * 横並び表示: 略称「HorizontalEpisodeRow」
   * 展開していないときに1行で表示するガントバー
   */
  const HorizontalEpisodeRow: React.FC<{
    episodeNumber: number;
    processes: typeof scheduleData[0]['processes'];
    onExpand: () => void;
  }> = ({ episodeNumber, processes, onExpand }) => {
    return (
      <div
        className="relative grid border-b border-gray-200 overflow-hidden"
        style={{
          // 1列目(話数表記)が120px, 以降は月の日数だけ1fr
          gridTemplateColumns: `120px repeat(${totalDaysInMonth}, minmax(0,1fr))`,
          gridTemplateRows: '40px'
        }}
      >
        {/* 話数セル */}
        <div
          className="p-2 font-medium text-gray-700 flex items-center border-r border-gray-200 cursor-pointer"
          onClick={onExpand}
        >
          #{episodeNumber}
        </div>

        {/* 背景グリッド */}
        {Array.from({ length: totalDaysInMonth }).map((_, colIndex) => (
          <div key={colIndex} className="border-r border-gray-200 last:border-r-0" />
        ))}

        {/* ガントバー (process の start/duration を利用) */}
        {processes.map((process, index) => {
          const colorClass = processColors[process.type] ?? 'bg-gray-100 border-gray-300';
          return (
            <div
              key={index}
              className={`flex items-center justify-center border rounded-sm text-xs h-6 ${colorClass}`}
              style={{
                // gridColumnStart / End でカラムに沿わせる
                gridColumnStart: process.start + 2,
                gridColumnEnd: process.start + 2 + process.duration,
                gridRow: 1,
                marginTop: 'auto',
                marginBottom: 'auto'
              }}
            >
              {process.type}
            </div>
          );
        })}
      </div>
    );
  };

  /**
   * 縦並び表示: 略称「VerticalEpisodeRow」
   * 展開時に工程ごとに1行ずつ表示する
   */
  const VerticalEpisodeRow: React.FC<{
    episodeNumber: number;
    processes: typeof scheduleData[0]['processes'];
    onClose: () => void;
  }> = ({ episodeNumber, processes, onClose }) => {
    return (
      <div className="border-b border-gray-200">
        {/* タイトル部分 (開閉ボタン) */}
        <div
          className="p-2 font-medium text-gray-700 flex items-center cursor-pointer border-b border-gray-200"
          onClick={onClose}
        >
          ▼ #{episodeNumber}（クリックで閉じる）
        </div>

        {/* 工程ごとに1行 */}
        {processes.map((process, rowIndex) => {
          const colorClass = processColors[process.type] ?? 'bg-gray-100 border-gray-300';
          return (
            <div
              key={rowIndex}
              className="grid border-b border-gray-100"
              style={{
                gridTemplateColumns: `120px repeat(${totalDaysInMonth}, minmax(0,1fr))`,
                gridTemplateRows: '40px'
              }}
            >
              {/* 工程名セル */}
              <div className="p-2 text-sm font-medium text-gray-700 border-r border-gray-200 flex items-center">
                {process.type}
              </div>

              {/* 背景グリッド */}
              {Array.from({ length: totalDaysInMonth }).map((_, colIndex) => (
                <div key={colIndex} className="border-r border-gray-200 last:border-r-0" />
              ))}

              {/* ガントバー */}
              <div
                className={`flex items-center justify-center text-xs border rounded-sm ${colorClass}`}
                style={{
                  gridColumnStart: process.start + 2,
                  gridColumnEnd: process.start + 2 + process.duration,
                  gridRow: 1,
                  marginTop: 'auto',
                  marginBottom: 'auto',
                  height: '60%'
                }}
              >
                {process.type}
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div className="w-full min-w-[768px]">
      {/* ==================== ヘッダ: 日グリッドの上部固定 ==================== */}
      <div className="sticky top-0 bg-white z-20">
        {/* 2行のヘッダ */}
        <div
          className="border-b border-gray-200"
          style={{
            display: 'grid',
            gridTemplateRows: 'auto 40px',
            gridTemplateColumns: `120px repeat(${totalDaysInMonth}, minmax(0,1fr))`
          }}
        >
          {/* 左上セル(話数) -> 2行ぶち抜き */}
          <div
            className="p-2 font-medium text-gray-500 text-sm border-r border-gray-200 flex items-center justify-center"
            style={{ gridRow: '1 / span 2' }}
          >
            {/* ラベルや「話数」などを表示してもOK */}
          </div>

          {/* 上段: 年月をまとめて表示（例: 2025年2月） */}
          <div
            className="border-r border-gray-200 flex items-center justify-center text-sm font-medium text-gray-700"
            style={{ gridColumn: `span ${totalDaysInMonth}` }}
          >
            {currentMonth.getFullYear()}年 {currentMonth.getMonth() + 1}月
          </div>

          {/* 下段: 日付 */}
          {monthDates.map((date, i) => (
            <div
              key={i}
              className={`border-r border-gray-200 last:border-r-0 flex items-center justify-center text-xs text-gray-500 ${
                date.getTime() === today.getTime() ? 'bg-indigo-100 ring-2 ring-indigo-400 ring-inset' : ''
              }`}
            >
              {date.getDate()}日
            </div>
          ))}
        </div>
      </div>

      {/* ==================== ボディ（スクロール領域） ==================== */}
      <div className="max-h-[600px] overflow-y-auto overflow-x-hidden relative">
        {scheduleData.map((episode, epiIndex) => {
          const isExpanded = expandedEpisodes.has(episode.episode);

          return (
            <React.Fragment key={epiIndex}>
              {/* 横並び (折りたたみ状態) */}
              {!isExpanded && (
                <HorizontalEpisodeRow
                  episodeNumber={episode.episode}
                  processes={episode.processes}
                  onExpand={() => handleExpand(episode.episode)}
                />
              )}

              {/* 縦並び(展開状態) */}
              {isExpanded && (
                <VerticalEpisodeRow
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

export default ScheduleGantt;
