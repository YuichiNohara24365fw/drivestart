import { DaySchedule } from '../types/schedule';

// 祝日データ
const holidays = [
  '2025-01-01', // 元日
  '2025-01-13', // 成人の日
  '2025-02-11', // 建国記念の日
  '2025-02-23', // 天皇誕生日
  '2025-03-21', // 春分の日
  '2025-04-29', // 昭和の日
  '2025-05-03', // 憲法記念日
  '2025-05-04', // みどりの日
  '2025-05-05', // こどもの日
];

// イベントの色設定
export const eventColors = {
  storyboard: '#9333ea',   // 紫
  animation: '#4f46e5',    // インディゴ
  background: '#059669',   // エメラルド
  sound: '#d97706',        // アンバー
  design: '#e11d48',       // ローズ
  meeting: '#6b7280',      // グレー
};

// 日付が祝日かどうかをチェック
const isHoliday = (dateStr: string) => holidays.includes(dateStr);

// 日曜日かどうかをチェック
const isSunday = (dateStr: string) => {
  const date = new Date(dateStr);
  return date.getDay() === 0;
};

// 月の日程データを生成
export const generateMonthSchedule = (year: number, month: number): DaySchedule[] => {
  const daysInMonth = new Date(year, month, 0).getDate();
  const schedule: DaySchedule[] = [];

  for (let day = 1; day <= daysInMonth; day++) {
    const dateStr = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    schedule.push({
      date: dateStr,
      isHoliday: isHoliday(dateStr) || isSunday(dateStr),
      events: []
    });
  }

  // サンプルイベントを追加
  schedule[4].events.push({
    id: '1',
    title: '第1話絵コンテ提出',
    type: 'storyboard',
    start: '10:00',
    end: '12:00',
    color: eventColors.storyboard
  });

  schedule[7].events.push({
    id: '2',
    title: 'アニメーション進捗MTG',
    type: 'animation',
    start: '14:00',
    end: '16:00',
    color: eventColors.animation
  });

  schedule[12].events.push({
    id: '3',
    title: '背景レビュー',
    type: 'background',
    start: '13:00',
    end: '15:00',
    color: eventColors.background
  });

  return schedule;
};