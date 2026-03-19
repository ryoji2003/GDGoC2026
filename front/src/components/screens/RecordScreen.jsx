import { useState, useEffect } from 'react';
import { PracticeChart, ScoreChart } from './charts/RecordCharts';
import { getRecords } from '../../api/recordApi';
import { badges } from '../../data/mockData';

function buildChartData(records, period) {
  if (period === 'week') {
    const days = ['月', '火', '水', '木', '金', '土', '日'];
    const practice = Array(7).fill(0);
    const score = Array(7).fill(null);
    const counts = Array(7).fill(0);
    const now = new Date();
    records.forEach(r => {
      const d = new Date(r.created_at);
      const diff = Math.floor((now - d) / 86400000);
      if (diff < 7) {
        const idx = (d.getDay() + 6) % 7;
        practice[idx]++;
        const avg = Math.round((r.scores.clarity + r.scores.keigo + r.scores.tempo + r.scores.empathy) / 4);
        score[idx] = score[idx] === null ? avg : Math.round((score[idx] * counts[idx] + avg) / (counts[idx] + 1));
        counts[idx]++;
      }
    });
    return { labels: days, practice, score: score.map(s => s ?? 0) };
  } else {
    const labels = ['1週', '2週', '3週', '4週'];
    const practice = Array(4).fill(0);
    const score = Array(4).fill(null);
    const counts = Array(4).fill(0);
    const now = new Date();
    records.forEach(r => {
      const d = new Date(r.created_at);
      const diff = Math.floor((now - d) / 86400000);
      if (diff < 28) {
        const idx = Math.min(3, Math.floor(diff / 7));
        const weekIdx = 3 - idx;
        practice[weekIdx]++;
        const avg = Math.round((r.scores.clarity + r.scores.keigo + r.scores.tempo + r.scores.empathy) / 4);
        score[weekIdx] = score[weekIdx] === null ? avg : Math.round((score[weekIdx] * counts[weekIdx] + avg) / (counts[weekIdx] + 1));
        counts[weekIdx]++;
      }
    });
    return { labels, practice, score: score.map(s => s ?? 0) };
  }
}

function buildWeaknessData(records) {
  if (!records.length) return [
    { label: 'テンポ・間', score: 0 },
    { label: '共感表現', score: 0 },
    { label: '話の明確さ', score: 0 },
    { label: '敬語の正確さ', score: 0 },
  ];
  const totals = { clarity: 0, keigo: 0, tempo: 0, empathy: 0 };
  records.forEach(r => {
    totals.clarity += r.scores.clarity;
    totals.keigo += r.scores.keigo;
    totals.tempo += r.scores.tempo;
    totals.empathy += r.scores.empathy;
  });
  const n = records.length;
  return [
    { label: 'テンポ・間', score: Math.round(totals.tempo / n) },
    { label: '共感表現', score: Math.round(totals.empathy / n) },
    { label: '話の明確さ', score: Math.round(totals.clarity / n) },
    { label: '敬語の正確さ', score: Math.round(totals.keigo / n) },
  ].sort((a, b) => a.score - b.score);
}

export default function RecordScreen({ userId }) {
  const [activePeriod, setActivePeriod] = useState('week');
  const [records, setRecords] = useState([]);

  useEffect(() => {
    getRecords(userId).then(setRecords).catch(() => {});
  }, [userId]);

  const chartData = buildChartData(records, activePeriod);
  const weaknessData = buildWeaknessData(records);

  return (
    <div className="screen active">
      <div className="record-screen">
        <div className="record-header">
          <h1>学習記録</h1>
          <div className="period-selector">
            <button
              className={`period-button ${activePeriod === 'week' ? 'active' : ''}`}
              onClick={() => setActivePeriod('week')}
            >
              週間
            </button>
            <button
              className={`period-button ${activePeriod === 'month' ? 'active' : ''}`}
              onClick={() => setActivePeriod('month')}
            >
              月間
            </button>
          </div>
        </div>

        <div className="chart-card">
          <h3>📈 練習回数の推移</h3>
          <div className="chart-container">
            <PracticeChart data={chartData} />
          </div>
        </div>

        <div className="chart-card">
          <h3>📊 スコアの推移</h3>
          <div className="chart-container">
            <ScoreChart data={chartData} />
          </div>
        </div>

        <div className="badges-section">
          <h3>🏆 獲得バッジ</h3>
          <div className="badges-grid">
            {badges.map((badge, i) => (
              <div className="badge-item" key={i}>
                <div className="badge-icon">{badge.icon}</div>
                <div className="badge-name">{badge.name}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="weakness-section">
          <h3>🎯 強化ポイント</h3>
          <div className="weakness-bars">
            {weaknessData.map((item, i) => (
              <div className="weakness-item" key={i}>
                <div className="weakness-header">
                  <span>{item.label}</span>
                  <span>{item.score}点</span>
                </div>
                <div className="weakness-bar">
                  <div className="weakness-fill" style={{ width: `${item.score}%` }}></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
