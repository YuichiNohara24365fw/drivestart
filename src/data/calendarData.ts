import { CalendarEvent } from '../types/schedule';

export const calendarData: Record<string, CalendarEvent[]> = {
  '2025-02-01': [
    { title: '第1話絵コンテ提出', type: 'storyboard', time: '10:00', project: '1' },
    { title: '背景設定会議', type: 'background', time: '14:00', project: '1' }
  ],
  '2025-02-05': [
    { title: 'キャラクターデザインチェック', type: 'animation', time: '13:00', project: '1' }
  ],
  '2025-02-08': [
    { title: '第2話アフレコ', type: 'sound', time: '10:00', project: '1' },
    { title: '作画進捗MTG', type: 'animation', time: '15:00', project: '1' }
  ],
  '2025-02-12': [
    { title: '第3話絵コンテ打ち合わせ', type: 'storyboard', time: '11:00', project: '1' }
  ],
  '2025-02-15': [
    { title: 'アニメーションチェック', type: 'animation', time: '10:00', project: '1' },
    { title: '背景レビュー', type: 'background', time: '14:00', project: '1' }
  ],
  '2025-02-18': [
    { title: 'キャラクターデザイン会議', type: 'design', time: '14:00', project: '2' }
  ],
  '2025-02-20': [
    { title: '第1話絵コンテ確認', type: 'storyboard', time: '10:00', project: '2' },
    { title: 'プロップデザインレビュー', type: 'design', time: '15:00', project: '2' }
  ],
  '2025-02-22': [
    { title: '絵コンテ締切', type: 'storyboard', time: '終日', project: '1' }
  ],
  '2025-02-25': [
    { title: '音響収録', type: 'sound', time: '13:00', project: '1' }
  ],
  '2025-02-28': [
    { title: '背景設定会議', type: 'background', time: '13:00', project: '2' }
  ]
};