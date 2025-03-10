import { CharacterSettings } from '../types/character';

export const characterData: CharacterSettings[] = [
  {
    id: 'MISAKI',
    name: '佐藤 美咲',
    description: '主人公。高校2年生。明るく前向きな性格で、アニメーション制作部の部長を務める。',
    mainImage: {
      id: 'main1',
      name: '美咲 立ち絵 基本',
      description: '基本立ち絵',
      imageUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80',
      category: 'character',
      tags: ['立ち絵', '基本', '制服'],
      createdAt: '2024-03-10',
      updatedAt: '2024-03-10',
      metadata: {
        size: '2.4MB',
        dimensions: '2000x3000',
        colorScheme: 'Warm',
        notes: '基本ポーズ、制服着用'
      }
    },
    locations: [
      {
        id: 'loc1',
        name: '教室',
        description: '美咲の座席周辺',
        imageUrl: 'https://images.unsplash.com/photo-1580582932707-520aed937b7b?auto=format&fit=crop&q=80',
        category: 'location',
        tags: ['学校', '教室', '窓際'],
        createdAt: '2024-03-10',
        updatedAt: '2024-03-10'
      },
      {
        id: 'loc2',
        name: '部室',
        description: 'アニメーション制作部の部室',
        imageUrl: 'https://images.unsplash.com/photo-1497366811353-6870744d04b2?auto=format&fit=crop&q=80',
        category: 'location',
        tags: ['学校', '部室', '室内'],
        createdAt: '2024-03-10',
        updatedAt: '2024-03-10'
      }
    ],
    costumes: [
      {
        id: 'cos1',
        name: '制服',
        description: '夏服バージョンの制服',
        imageUrl: 'https://images.unsplash.com/photo-1603189343302-e603f7add05a?auto=format&fit=crop&q=80',
        category: 'costume',
        tags: ['制服', '夏服'],
        createdAt: '2024-03-10',
        updatedAt: '2024-03-10'
      },
      {
        id: 'cos2',
        name: '体操服',
        description: '体育の授業用の体操服',
        imageUrl: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&q=80',
        category: 'costume',
        tags: ['体操服', 'スポーツ'],
        createdAt: '2024-03-10',
        updatedAt: '2024-03-10'
      }
    ],
    props: [
      {
        id: 'prop1',
        name: 'スケッチブック',
        description: 'いつも持ち歩いているスケッチブック',
        imageUrl: 'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&q=80',
        category: 'prop',
        tags: ['文具', '趣味'],
        createdAt: '2024-03-10',
        updatedAt: '2024-03-10'
      },
      {
        id: 'prop2',
        name: 'タブレット',
        description: 'デジタルイラスト用のタブレット',
        imageUrl: 'https://images.unsplash.com/photo-1561154464-82e9adf32764?auto=format&fit=crop&q=80',
        category: 'prop',
        tags: ['電子機器', '制作道具'],
        createdAt: '2024-03-10',
        updatedAt: '2024-03-10'
      }
    ],
    profile: {
      age: '16',
      height: '158cm',
      weight: '45kg',
      birthday: '7月7日',
      bloodType: 'O型',
      personality: '明るく活発で、創作意欲が高い。リーダーシップがある。',
      background: '幼い頃からアニメーションに興味を持ち、高校でアニメーション制作部を設立。'
    }
  },
  {
    id: 'SHOTA',
    name: '田中 翔太',
    description: 'アニメーション制作部の副部長。冷静沈着な性格で、技術面でのリーダー。',
    mainImage: {
      id: 'main2',
      name: '翔太 立ち絵 基本',
      description: '基本立ち絵',
      imageUrl: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80',
      category: 'character',
      tags: ['立ち絵', '基本', '制服'],
      createdAt: '2024-03-10',
      updatedAt: '2024-03-10',
      metadata: {
        size: '2.2MB',
        dimensions: '2000x3000',
        colorScheme: 'Cool',
        notes: '基本ポーズ、制服着用'
      }
    },
    locations: [
      {
        id: 'loc3',
        name: '図書室',
        description: 'よく勉強している図書室',
        imageUrl: 'https://images.unsplash.com/photo-1521587760476-6c12a4b040da?auto=format&fit=crop&q=80',
        category: 'location',
        tags: ['学校', '図書室', '室内'],
        createdAt: '2024-03-10',
        updatedAt: '2024-03-10'
      },
      {
        id: 'loc4',
        name: '公園',
        description: '放課後によく立ち寄る公園',
        imageUrl: 'https://images.unsplash.com/photo-1596140096558-9f52a3a8005f?auto=format&fit=crop&q=80',
        category: 'location',
        tags: ['公園', '屋外', '夕方'],
        createdAt: '2024-03-10',
        updatedAt: '2024-03-10'
      }
    ],
    costumes: [
      {
        id: 'cos3',
        name: '制服',
        description: '標準的な制服姿',
        imageUrl: 'https://images.unsplash.com/photo-1593030761757-71fae45fa0e7?auto=format&fit=crop&q=80',
        category: 'costume',
        tags: ['制服', '基本'],
        createdAt: '2024-03-10',
        updatedAt: '2024-03-10'
      },
      {
        id: 'cos4',
        name: '私服',
        description: '休日の私服姿',
        imageUrl: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80',
        category: 'costume',
        tags: ['私服', '休日'],
        createdAt: '2024-03-10',
        updatedAt: '2024-03-10'
      }
    ],
    props: [
      {
        id: 'prop3',
        name: 'ノートPC',
        description: 'プログラミング用のノートPC',
        imageUrl: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&q=80',
        category: 'prop',
        tags: ['電子機器', '仕事道具'],
        createdAt: '2024-03-10',
        updatedAt: '2024-03-10'
      },
      {
        id: 'prop4',
        name: 'ヘッドフォン',
        description: '音楽を聴くときに使用するヘッドフォン',
        imageUrl: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&q=80',
        category: 'prop',
        tags: ['電子機器', '音楽'],
        createdAt: '2024-03-10',
        updatedAt: '2024-03-10'
      }
    ],
    profile: {
      age: '16',
      height: '172cm',
      weight: '63kg',
      birthday: '11月3日',
      bloodType: 'A型',
      personality: '冷静で論理的。技術に詳しく、部の技術面をサポート。',
      background: '中学時代からプログラミングを学び、CGアニメーションに興味を持つ。'
    }
  },
  {
    id: 'HANAKO',
    name: '山本 花子',
    description: 'アニメーション制作部の新入部員。絵を描くのが得意で、独特な感性を持つ。',
    mainImage: {
      id: 'main3',
      name: '花子 立ち絵 基本',
      description: '基本立ち絵',
      imageUrl: 'https://images.unsplash.com/photo-1517365830460-955ce3ccd263?auto=format&fit=crop&q=80',
      category: 'character',
      tags: ['立ち絵', '基本', '制服'],
      createdAt: '2024-03-10',
      updatedAt: '2024-03-10',
      metadata: {
        size: '2.3MB',
        dimensions: '2000x3000',
        colorScheme: 'Warm',
        notes: '基本ポーズ、制服着用'
      }
    },
    locations: [
      {
        id: 'loc5',
        name: '美術室',
        description: '放課後によく利用する美術室',
        imageUrl: 'https://images.unsplash.com/photo-1499781350541-7783f6c6a0c8?auto=format&fit=crop&q=80',
        category: 'location',
        tags: ['学校', '美術室', '室内'],
        createdAt: '2024-03-10',
        updatedAt: '2024-03-10'
      }
    ],
    costumes: [
      {
        id: 'cos5',
        name: '制服',
        description: '標準的な制服姿',
        imageUrl: 'https://images.unsplash.com/photo-1603189343302-e603f7add05a?auto=format&fit=crop&q=80',
        category: 'costume',
        tags: ['制服', '基本'],
        createdAt: '2024-03-10',
        updatedAt: '2024-03-10'
      },
      {
        id: 'cos6',
        name: '私服',
        description: '休日の私服姿',
        imageUrl: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&q=80',
        category: 'costume',
        tags: ['私服', '休日'],
        createdAt: '2024-03-10',
        updatedAt: '2024-03-10'
      }
    ],
    props: [
      {
        id: 'prop5',
        name: 'スケッチブック',
        description: 'お気に入りのスケッチブック',
        imageUrl: 'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&q=80',
        category: 'prop',
        tags: ['文具', '趣味'],
        createdAt: '2024-03-10',
        updatedAt: '2024-03-10'
      },
      {
        id: 'prop6',
        name: '絵の具セット',
        description: '水彩画用の絵の具セット',
        imageUrl: 'https://images.unsplash.com/photo-1513364776144-60967b0f800f?auto=format&fit=crop&q=80',
        category: 'prop',
        tags: ['文具', '画材'],
        createdAt: '2024-03-10',
        updatedAt: '2024-03-10'
      }
    ],
    profile: {
      age: '15',
      height: '155cm',
      weight: '42kg',
      birthday: '4月15日',
      bloodType: 'B型',
      personality: '独創的で芸術的。マイペースな性格。',
      background: '美術部から転部してきた新入部員。'
    }
  },
  {
    id: 'YUKO',
    name: '高橋 優子',
    description: 'アニメーション制作部の先輩。細かい作業が得意で、後輩の指導も担当。',
    mainImage: {
      id: 'main4',
      name: '優子 立ち絵 基本',
      description: '基本立ち絵',
      imageUrl: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80',
      category: 'character',
      tags: ['立ち絵', '基本', '制服'],
      createdAt: '2024-03-10',
      updatedAt: '2024-03-10',
      metadata: {
        size: '2.1MB',
        dimensions: '2000x3000',
        colorScheme: 'Cool',
        notes: '基本ポーズ、制服着用'
      }
    },
    locations: [
      {
        id: 'loc6',
        name: '部室',
        description: 'アニメーション制作部の部室',
        imageUrl: 'https://images.unsplash.com/photo-1497366811353-6870744d04b2?auto=format&fit=crop&q=80',
        category: 'location',
        tags: ['学校', '部室', '室内'],
        createdAt: '2024-03-10',
        updatedAt: '2024-03-10'
      },
      {
        id: 'loc7',
        name: 'カフェ',
        description: 'よく利用する駅前のカフェ',
        imageUrl: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&q=80',
        category: 'location',
        tags: ['カフェ', '店内', '放課後'],
        createdAt: '2024-03-10',
        updatedAt: '2024-03-10'
      }
    ],
    costumes: [
      {
        id: 'cos7',
        name: '制服',
        description: '標準的な制服姿',
        imageUrl: 'https://images.unsplash.com/photo-1603189343302-e603f7add05a?auto=format&fit=crop&q=80',
        category: 'costume',
        tags: ['制服', '基本'],
        createdAt: '2024-03-10',
        updatedAt: '2024-03-10'
      },
      {
        id: 'cos8',
        name: '私服',
        description: '休日の私服姿',
        imageUrl: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&q=80',
        category: 'costume',
        tags: ['私服', '休日'],
        createdAt: '2024-03-10',
        updatedAt: '2024-03-10'
      }
    ],
    props: [
      {
        id: 'prop7',
        name: 'ノート',
        description: '作画指導用のノート',
        imageUrl: 'https://images.unsplash.com/photo-1517842645767-c639042777db?auto=format&fit=crop&q=80',
        category: 'prop',
        tags: ['文具', '仕事道具'],
        createdAt: '2024-03-10',
        updatedAt: '2024-03-10'
      },
      {
        id: 'prop8',
        name: 'タブレット',
        description: 'デジタル作画用のタブレット',
        imageUrl: 'https://images.unsplash.com/photo-1561154464-82e9adf32764?auto=format&fit=crop&q=80',
        category: 'prop',
        tags: ['電子機器', '制作道具'],
        createdAt: '2024-03-10',
        updatedAt: '2024-03-10'
      }
    ],
    profile: {
      age: '17',
      height: '162cm',
      weight: '48kg',
      birthday: '9月21日',
      bloodType: 'AB型',
      personality: '几帳面で責任感が強い。後輩の面倒見が良い。',
      background: '中学時代から美術部で活動し、アニメーション制作に興味を持つ。'
    }
  }
];