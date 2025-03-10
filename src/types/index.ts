// 既存の型定義に追加
export interface ProcessData {
  process: string;
  staff: string;
  all: number;
  in: number;
  up: number;
  holding: number;
  remaining: number;
  r: number;
  control: number;
  upStatus: string;
  daily: number;
  isDelayed: boolean;
  delayDays: number;
  progress: number;
  expectedProgress: number;
}

export interface ProcessGroup {
  id: string;
  name: string;
  data: ProcessData[];
}