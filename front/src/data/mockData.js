export const scenarios = [
  { id: 1, title: '上司への報告', category: 'work', difficulty: '★★★', duration: '5分', level: '中' },
  { id: 2, title: '初対面の人との雑談', category: 'first', difficulty: '★★', duration: '4分', level: '易' },
  { id: 3, title: '友達への誘い断り方', category: 'friend', difficulty: '★★', duration: '3分', level: '易' },
  { id: 4, title: 'デートの誘い方', category: 'romance', difficulty: '★★★★', duration: '6分', level: '高' },
  { id: 5, title: 'コンビニ店員との会話', category: 'daily', difficulty: '★', duration: '2分', level: '超易' },
  { id: 6, title: 'グループでの自己紹介', category: 'first', difficulty: '★★★', duration: '4分', level: '中' },
];

export const scenarioCategoryLabels = {
  work: '職場',
  first: '初対面',
  friend: '友人',
  romance: '恋愛',
  daily: '日常',
};

export const scenarioDescriptions = {
  1: 'プロジェクトの進捗を上司に簡潔に報告する練習',
  2: '社交的な場で初めて会った人と会話を続ける',
  3: '友達からの誘いを上手に断る練習',
  4: '気になる人を自然にデートに誘う',
  5: '日常的な買い物での基本的なやり取り',
  6: '複数人の前で自己紹介をする練習',
};

export const aiMessages = [
  'こんにちは。今日はプロジェクトの進捗について聞かせてください。',
  'なるほど、それで今週の目標達成率はどのくらいですか？',
  '分かりました。次週に向けて何か懸念事項はありますか？',
  'ありがとうございます。では、その対策について詳しく教えてください。',
];

export const userResponses = [
  'はい、プロジェクトは順調に進んでおります。',
  'えーっと、約85%ほど達成できております。',
  'はい、少しリソース不足が懸念されます。',
  '追加のメンバーを配置する予定です。',
];

export const chartData = {
  week: {
    labels: ['月', '火', '水', '木', '金', '土', '日'],
    practice: [3, 2, 4, 3, 5, 2, 4],
    score: [65, 68, 70, 72, 75, 71, 78],
  },
  month: {
    labels: ['1週', '2週', '3週', '4週'],
    practice: [15, 18, 20, 23],
    score: [65, 70, 73, 78],
  },
};

export const radarData = {
  labels: ['話の明確さ', '敬語の正確さ', 'テンポ・間', '共感表現'],
  scores: [78, 85, 60, 65],
};

export const recentHistory = [
  { title: '上司への報告', meta: '2時間前・職場', score: 72 },
  { title: '初対面の人との雑談', meta: '昨日・初対面', score: 68 },
  { title: 'コンビニ店員との会話', meta: '2日前・日常', score: 85 },
];

export const badges = [
  { icon: '🎯', name: '初回練習' },
  { icon: '🔥', name: '7日連続' },
  { icon: '⭐', name: 'スコア80超' },
  { icon: '💯', name: '完璧な会話' },
  { icon: '📚', name: '50回練習' },
  { icon: '🎓', name: '達人レベル' },
];

export const weaknessData = [
  { label: 'テンポ・間', score: 60 },
  { label: '共感表現', score: 65 },
  { label: '話の明確さ', score: 78 },
  { label: '敬語の正確さ', score: 85 },
];
