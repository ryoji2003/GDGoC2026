import { useState } from 'react';
import { scenarios, scenarioCategoryLabels, scenarioDescriptions } from '../../data/mockData';

const categories = [
  { id: 'all', label: 'すべて' },
  { id: 'work', label: '職場' },
  { id: 'daily', label: '日常' },
  { id: 'romance', label: '恋愛' },
  { id: 'friend', label: '友人' },
  { id: 'first', label: '初対面' },
];

export default function ScenarioScreen({ navigate }) {
  const [activeCategory, setActiveCategory] = useState('all');

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
        {filtered.map(scenario => (
          <div
            key={scenario.id}
            className="scenario-card"
            onClick={() => navigate('conversation', scenario.title)}
          >
            <div className="scenario-card-header">
              <div>
                <div className="scenario-title">{scenario.title}</div>
                <div className="scenario-category">{scenarioCategoryLabels[scenario.category]}</div>
              </div>
              <div className="scenario-difficulty">{scenario.difficulty}</div>
            </div>
            <div className="scenario-description">{scenarioDescriptions[scenario.id]}</div>
            <div className="scenario-meta">
              <span>⏱️ {scenario.duration}</span>
              <span>💬 難易度: {scenario.level}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
