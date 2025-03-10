export interface Process {
  type: string;
  start: number;
  duration: number;
}

export interface ScheduleData {
  episode: number;
  processes: {
    type: '絵コンテ' | 'レイアウト' | 'アニメーション' | '背景' | '彩色' | 'コンポジット' | '編集';
    start: number;
    duration: number;
  }[];
}

export interface DaySchedule {
  date: string;
  isHoliday: boolean;
  events: {
    id: string;
    title: string;
    type: string;
    start: string;
    end: string;
    color: string;
  }[];
}

export interface CalendarEvent {
  id?: string;
  title: string;
  type: string;
  startTime: string;
  endTime: string;
  project?: string;
  description?: string;
  location?: string;
  color?: string;
}

export interface WeeklyEvent {
  title: string;
  type: string;
  time: string;
  project: string;
} 