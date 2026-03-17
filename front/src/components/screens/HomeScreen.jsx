import { recentHistory } from '../../data/mockData';

export default function HomeScreen({ navigate }) {
  return (
    <div className="screen active">
      <div className="home-header">
        <div className="logo">SpeakUp</div>
        <div className="tagline">AIと話して、人間関係を変えよう</div>
      </div>

      <div className="progress-summary">
        <div className="progress-card">
          <div className="progress-value">8</div>
          <div className="progress-label">レベル</div>
        </div>
        <div className="progress-card">
          <div className="progress-value">12h</div>
          <div className="progress-label">総練習時間</div>
        </div>
        <div className="progress-card">
          <div className="progress-value">7日</div>
          <div className="progress-label">連続日数</div>
        </div>
      </div>

      <div className="main-cta">
        <button className="cta-button" onClick={() => navigate('scenario')}>
          今日の練習を始める 🚀
        </button>
      </div>

      <div className="recent-section">
        <h2 className="section-title">最近の練習</h2>
        <div className="recent-cards">
          {recentHistory.map((item, i) => (
            <div className="recent-card" key={i}>
              <div className="recent-info">
                <h4>{item.title}</h4>
                <p>{item.meta}</p>
              </div>
              <div className="recent-score">{item.score}点</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
