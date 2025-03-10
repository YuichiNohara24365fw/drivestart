// src/data/scheduleData.ts

export interface ProcessInfo {
  type: string;
  startDate: string;  // 絶対日付 (YYYY-MM-DD など)
  endDate: string;    // 絶対日付
}

export interface EpisodeData {
  episode: number;
  processes: ProcessInfo[];
}

export const scheduleData: EpisodeData[] = [
  // ======== Episode 1 (例: 3月のみ) ========
  {
    episode: 1,
    processes: [
      {
        type: '絵コンテ',
        startDate: '2025-03-01',
        endDate: '2025-03-05'
      },
      {
        type: 'レイアウト',
        startDate: '2025-03-03',
        endDate: '2025-03-10'
      },
      {
        type: 'アニメーション',
        startDate: '2025-03-09',
        endDate: '2025-03-20'
      }
    ]
  },
  // ======== Episode 2 (例: 3月のみ) ========
  {
    episode: 2,
    processes: [
      {
        type: '絵コンテ',
        startDate: '2025-03-03',
        endDate: '2025-03-07'
      },
      {
        type: 'レイアウト',
        startDate: '2025-03-08',
        endDate: '2025-03-12'
      },
      {
        type: 'アニメーション',
        startDate: '2025-03-13',
        endDate: '2025-03-22'
      }
    ]
  },

  // ======== Episode 3 (2月のみ) ========
  {
    episode: 3,
    processes: [
      {
        type: '絵コンテ',
        startDate: '2025-02-01',
        endDate: '2025-02-03'
      },
      {
        type: 'レイアウト',
        startDate: '2025-02-04',
        endDate: '2025-02-06'
      },
      {
        type: 'アニメーション',
        startDate: '2025-02-07',
        endDate: '2025-02-10'
      }
    ]
  },
  // ======== Episode 4 (2月のみ) ========
  {
    episode: 4,
    processes: [
      {
        type: '絵コンテ',
        startDate: '2025-02-05',
        endDate: '2025-02-07'
      },
      {
        type: 'レイアウト',
        startDate: '2025-02-08',
        endDate: '2025-02-11'
      },
      {
        type: 'アニメーション',
        startDate: '2025-02-12',
        endDate: '2025-02-15'
      }
    ]
  },
  // ======== Episode 5 (2月のみ) ========
  {
    episode: 5,
    processes: [
      {
        type: '絵コンテ',
        startDate: '2025-02-10',
        endDate: '2025-02-12'
      },
      {
        type: 'レイアウト',
        startDate: '2025-02-13',
        endDate: '2025-02-15'
      },
      {
        type: 'アニメーション',
        startDate: '2025-02-16',
        endDate: '2025-02-18'
      }
    ]
  },
  // ======== Episode 6 (2月のみ) ========
  {
    episode: 6,
    processes: [
      {
        type: '絵コンテ',
        startDate: '2025-02-15',
        endDate: '2025-02-17'
      },
      {
        type: 'レイアウト',
        startDate: '2025-02-18',
        endDate: '2025-02-21'
      },
      {
        type: 'アニメーション',
        startDate: '2025-02-22',
        endDate: '2025-02-25'
      }
    ]
  },

  // ======== Episode 7 (2月下旬～3月頭) ========
  {
    episode: 7,
    processes: [
      {
        type: '絵コンテ',
        startDate: '2025-02-20',
        endDate: '2025-02-22'
      },
      {
        type: 'レイアウト',
        startDate: '2025-02-23',
        endDate: '2025-02-25'
      },
      {
        type: 'アニメーション',
        startDate: '2025-02-26',
        endDate: '2025-03-01'
      }
    ]
  },
  // ======== Episode 8 (3月上旬) ========
  {
    episode: 8,
    processes: [
      {
        type: '絵コンテ',
        startDate: '2025-03-02',
        endDate: '2025-03-04'
      },
      {
        type: 'レイアウト',
        startDate: '2025-03-05',
        endDate: '2025-03-08'
      },
      {
        type: 'アニメーション',
        startDate: '2025-03-09',
        endDate: '2025-03-13'
      }
    ]
  },
  // ======== Episode 9 (3月上旬～中旬) ========
  {
    episode: 9,
    processes: [
      {
        type: '絵コンテ',
        startDate: '2025-03-05',
        endDate: '2025-03-07'
      },
      {
        type: 'レイアウト',
        startDate: '2025-03-08',
        endDate: '2025-03-11'
      },
      {
        type: 'アニメーション',
        startDate: '2025-03-12',
        endDate: '2025-03-17'
      }
    ]
  },
  // ======== Episode 10 (3月中旬～下旬) ========
  {
    episode: 10,
    processes: [
      {
        type: '絵コンテ',
        startDate: '2025-03-10',
        endDate: '2025-03-12'
      },
      {
        type: 'レイアウト',
        startDate: '2025-03-13',
        endDate: '2025-03-16'
      },
      {
        type: 'アニメーション',
        startDate: '2025-03-17',
        endDate: '2025-03-23'
      }
    ]
  },
  // ======== Episode 11 (3月中旬～下旬) ========
  {
    episode: 11,
    processes: [
      {
        type: '絵コンテ',
        startDate: '2025-03-15',
        endDate: '2025-03-17'
      },
      {
        type: 'レイアウト',
        startDate: '2025-03-18',
        endDate: '2025-03-20'
      },
      {
        type: 'アニメーション',
        startDate: '2025-03-21',
        endDate: '2025-03-25'
      }
    ]
  },
  // ======== Episode 12 (3月下旬) ========
  {
    episode: 12,
    processes: [
      {
        type: '絵コンテ',
        startDate: '2025-03-20',
        endDate: '2025-03-22'
      },
      {
        type: 'レイアウト',
        startDate: '2025-03-23',
        endDate: '2025-03-26'
      },
      {
        type: 'アニメーション',
        startDate: '2025-03-27',
        endDate: '2025-03-29'
      }
    ]
  },
  // ======== Episode 13 (3月下旬) ========
  {
    episode: 13,
    processes: [
      {
        type: '絵コンテ',
        startDate: '2025-03-25',
        endDate: '2025-03-27'
      },
      {
        type: 'レイアウト',
        startDate: '2025-03-28',
        endDate: '2025-03-29'
      },
      {
        type: 'アニメーション',
        startDate: '2025-03-30',
        endDate: '2025-03-31'
      }
    ]
  }
];
