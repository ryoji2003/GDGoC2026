import { useState } from 'react';
import { PracticeChart, ScoreChart } from './charts/RecordCharts';
import { badges, weaknessData } from '../../data/mockData';

export default function RecordScreen() {
  const [activePeriod, setActivePeriod] = useState('week');

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
            <PracticeChart period={activePeriod} />
          </div>
        </div>

        <div className="chart-card">
          <h3>📊 スコアの推移</h3>
          <div className="chart-container">
            <ScoreChart period={activePeriod} />
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
