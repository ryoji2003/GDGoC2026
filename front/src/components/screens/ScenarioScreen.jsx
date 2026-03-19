import { useState, useEffect } from 'react';
import { getScenarios } from '../../api/scenarioApi';

const categories = [
  { id: 'all', label: 'すべて' },
  { id: 'work', label: '職場' },
  { id: 'daily', label: '日常' },
  { id: 'romance', label: '恋愛' },
  { id: 'friend', label: '友人' },
  { id: 'first', label: '初対面' },
];

const categoryLabels = {
  work: '職場',
  first: '初対面',
  friend: '友人',
  romance: '恋愛',
  daily: '日常',
};

export default function ScenarioScreen({ navigate }) {
  const [activeCategory, setActiveCategory] = useState('all');
  const [scenarios, setScenarios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    getScenarios()
      .then(setScenarios)
      .catch(e => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  const filtered = scenarios.filter(
    s => activeCategory === 'all' || s.category === activeCategory
  );

  return (
    <div className="screen active">
      <div className="scenario-header">
        <h1>シナリオを選ぶ</h1>
        <div className="category-filters">
          {categories.map(cat => (
            <div
              key={cat.id}
              className={`category-filter ${activeCategory === cat.id ? 'active' : ''}`}
              onClick={() => setActiveCategory(cat.id)}
            >
              {cat.label}
            </div>
          ))}
        </div>
      </div>

      <div className="scenario-list">
        {loading && <div className="loading">読み込み中...</div>}
        {error && <div className="error">エラー: {error}</div>}
        {!loading && !error && filtered.map(scenario => (
          <div
            key={scenario.name}
            className="scenario-card"
            onClick={() => navigate('conversation', scenario.name)}
          >
            <div className="scenario-card-header">
              <div>
                <div className="scenario-title">{scenario.name}</div>
                <div className="scenario-category">{categoryLabels[scenario.category] || scenario.category}</div>
              </div>
              <div className="scenario-difficulty">{scenario.difficulty}</div>
            </div>
            <div className="scenario-description">{scenario.description}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
