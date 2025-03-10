import { StubDatabase } from '../types';

export const stubData: StubDatabase = {
  projects: [
    {
      id: '1',
      title: '夢幻学園物語',
      status: 'production',
      startDate: '2024-01-01',
      endDate: '2024-12-31',
      thumbnail:
        'https://images.unsplash.com/photo-1580477667995-2b94f01c9516?auto=format&fit=crop&q=80',
      description:
        '魔法と芸術が交差する学園で、若きクリエイターたちの成長を描く物語',
      progress: {
        storyboard: 85,
        animation: 60,
        background: 70,
        sound: 45,
        editing: 30,
      },
      episodes: [
        {
          id: '1',
          number: 1,
          title: '新しい仲間',
          cuts: [
            {
              id: 'cut1',
              number: 'A-1',
              status: 'completed',
              assignedTo: '1',
              duration: 3,
              dueDate: '2024-03-15',
            },
          ],
        },
        {
          id: '2',
          number: 2,
          title: '魔法の力',
          cuts: [
            {
              id: 'cut5',
              number: 'B-1',
              status: 'in_progress',
              assignedTo: '2',
              duration: 4,
              dueDate: '2024-03-20',
            },
          ],
        },
        {
          id: '3',
          number: 3,
          title: '秘密の約束',
          cuts: [
            {
              id: 'cut9',
              number: 'C-1',
              status: 'not_started',
              assignedTo: '1',
              duration: 5,
              dueDate: '2024-03-25',
            },
          ],
        },
      ],
    },
    {
      id: '2',
      title: 'サイバーサムライ',
      status: 'pre-production',
      startDate: '2024-04-01',
      endDate: '2024-12-31',
      thumbnail:
        'https://images.unsplash.com/photo-1555212697-194d092e3b8f?auto=format&fit=crop&q=80',
      description:
        '近未来の日本を舞台に、伝統と革新が融合する世界での戦いを描くSFアクション',
      progress: {
        storyboard: 40,
        animation: 20,
        background: 30,
        sound: 10,
        editing: 5,
      },
      episodes: [
        {
          id: '4',
          number: 1,
          title: '運命の出会い',
          cuts: [],
        },
        {
          id: '5',
          number: 2,
          title: '決意の時',
          cuts: [],
        },
      ],
    },
    {
      id: '3',
      title: '冒険者たちの旅路',
      status: 'production',
      startDate: '2024-02-01',
      endDate: '2024-10-31',
      thumbnail:
        'https://images.unsplash.com/photo-1502657877623-f66bf489d236?auto=format&fit=crop&q=80',
      description:
        'ファンタジー世界を旅する冒険者たちの絆と成長を描く心温まる物語',
      progress: {
        storyboard: 70,
        animation: 45,
        background: 50,
        sound: 30,
        editing: 20,
      },
      episodes: [
        {
          id: '6',
          number: 1,
          title: '旅立ちの朝',
          cuts: [],
        },
      ],
    },
  ],
  staff: [
    {
      id: '1',
      name: '田中 優希',
      role: 'アニメーションディレクター',
      department: 'アニメーション',
      avatar:
        'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80',
      workload: {
        totalCuts: 15,
        notStarted: 3,
        inProgress: 4,
        completed: 6,
        pendingReview: 2,
      },
    },
    {
      id: '2',
      name: '鈴木 健一',
      role: 'キャラクターデザイナー',
      department: 'アート',
      avatar:
        'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80',
      workload: {
        totalCuts: 12,
        notStarted: 4,
        inProgress: 3,
        completed: 4,
        pendingReview: 1,
      },
    },
  ],
  delays: [
    {
      id: '1',
      projectId: '1',
      phase: 'animation',
      delayDays: 5,
      impact: 'medium',
      reason: 'キャラクターの動きの修正が必要',
      affectedScenes: ['A-2', 'A-3', 'A-4'],
      assignedTo: '田中 優希',
      status: 'in-progress',
      details: [
        {
          scene: 'A-2',
          description: 'アクションシーンの動きが不自然',
          estimatedRecovery: '2024-03-20',
        },
        {
          scene: 'A-3',
          description: 'キャラクターの表情修正',
          estimatedRecovery: '2024-03-22',
        },
        {
          scene: 'A-4',
          description: '背景とのマッチング調整',
          estimatedRecovery: '2024-03-25',
        },
      ],
    },
  ],
  departmentProgress: {
    animation: 75,
    background: 60,
    sound: 85,
    editing: 45,
    planning: 90,
  },
};
