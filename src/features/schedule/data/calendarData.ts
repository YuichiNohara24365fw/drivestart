import { CalendarEvent } from '../types/schedule';

// 現在の日付を基準にサンプルデータを生成
const today = new Date();
const year = today.getFullYear();
const month = today.getMonth();

// 今月の最初の日
const firstDayOfMonth = new Date(year, month, 1);
// 今月の最後の日
const lastDayOfMonth = new Date(year, month + 1, 0);

// サンプルイベントデータを生成
export const calendarData: CalendarEvent[] = [
  {
    id: '1',
    title: '第1話絵コンテ提出',
    type: 'meeting',
    startTime: new Date(year, month, 5, 10, 0).toISOString(),
    endTime: new Date(year, month, 5, 12, 0).toISOString(),
    project: 'プロジェクトA',
    description: '第1話の絵コンテを提出し、ディレクターとの打ち合わせを行う'
  },
  {
    id: '2',
    title: '背景設定会議',
    type: 'meeting',
    startTime: new Date(year, month, 5, 14, 0).toISOString(),
    endTime: new Date(year, month, 5, 16, 0).toISOString(),
    project: 'プロジェクトA',
    location: '会議室B'
  },
  {
    id: '3',
    title: 'キャラクターデザインチェック',
    type: 'work',
    startTime: new Date(year, month, 8, 13, 0).toISOString(),
    endTime: new Date(year, month, 8, 15, 0).toISOString(),
    project: 'プロジェクトA'
  },
  {
    id: '4',
    title: '第2話アフレコ',
    type: 'work',
    startTime: new Date(year, month, 10, 10, 0).toISOString(),
    endTime: new Date(year, month, 10, 13, 0).toISOString(),
    project: 'プロジェクトA',
    location: 'スタジオC'
  },
  {
    id: '5',
    title: '作画進捗MTG',
    type: 'meeting',
    startTime: new Date(year, month, 10, 15, 0).toISOString(),
    endTime: new Date(year, month, 10, 16, 30).toISOString(),
    project: 'プロジェクトA',
    location: '会議室A'
  },
  {
    id: '6',
    title: '第3話絵コンテ打ち合わせ',
    type: 'meeting',
    startTime: new Date(year, month, 12, 11, 0).toISOString(),
    endTime: new Date(year, month, 12, 13, 0).toISOString(),
    project: 'プロジェクトA',
    description: '第3話の絵コンテについて、監督とシナリオライターと打ち合わせ'
  },
  {
    id: '7',
    title: 'アニメーションチェック',
    type: 'work',
    startTime: new Date(year, month, 15, 10, 0).toISOString(),
    endTime: new Date(year, month, 15, 12, 0).toISOString(),
    project: 'プロジェクトA'
  },
  {
    id: '8',
    title: '背景レビュー',
    type: 'meeting',
    startTime: new Date(year, month, 15, 14, 0).toISOString(),
    endTime: new Date(year, month, 15, 16, 0).toISOString(),
    project: 'プロジェクトA'
  },
  {
    id: '9',
    title: 'キャラクターデザイン会議',
    type: 'meeting',
    startTime: new Date(year, month, 18, 14, 0).toISOString(),
    endTime: new Date(year, month, 18, 16, 0).toISOString(),
    project: 'プロジェクトB',
    location: '会議室C'
  },
  {
    id: '10',
    title: '第1話絵コンテ確認',
    type: 'work',
    startTime: new Date(year, month, 20, 10, 0).toISOString(),
    endTime: new Date(year, month, 20, 12, 0).toISOString(),
    project: 'プロジェクトB'
  },
  {
    id: '11',
    title: 'プロップデザインレビュー',
    type: 'meeting',
    startTime: new Date(year, month, 20, 15, 0).toISOString(),
    endTime: new Date(year, month, 20, 17, 0).toISOString(),
    project: 'プロジェクトB'
  },
  {
    id: '12',
    title: '絵コンテ締切',
    type: 'deadline',
    startTime: new Date(year, month, 22, 9, 0).toISOString(),
    endTime: new Date(year, month, 22, 9, 0).toISOString(),
    project: 'プロジェクトA',
    description: '第1話の絵コンテ提出締切'
  },
  {
    id: '13',
    title: '音響収録',
    type: 'work',
    startTime: new Date(year, month, 25, 13, 0).toISOString(),
    endTime: new Date(year, month, 25, 17, 0).toISOString(),
    project: 'プロジェクトA',
    location: 'スタジオA'
  },
  {
    id: '14',
    title: '背景設定会議',
    type: 'meeting',
    startTime: new Date(year, month, 28, 13, 0).toISOString(),
    endTime: new Date(year, month, 28, 15, 0).toISOString(),
    project: 'プロジェクトB',
    location: '会議室B'
  }
]; 