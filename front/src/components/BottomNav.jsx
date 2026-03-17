export default function BottomNav({ currentScreen, navigate }) {
  return (
    <div className="bottom-nav">
      <div
        className={`nav-item ${currentScreen === 'home' ? 'active' : ''}`}
        onClick={() => navigate('home')}
      >
        <div className="nav-icon">🏠</div>
        <div className="nav-label">ホーム</div>
      </div>
      <div
        className={`nav-item ${currentScreen === 'scenario' ? 'active' : ''}`}
        onClick={() => navigate('scenario')}
      >
        <div className="nav-icon">📝</div>
        <div className="nav-label">シナリオ</div>
      </div>
      <div
        className={`nav-item ${currentScreen === 'record' ? 'active' : ''}`}
        onClick={() => navigate('record')}
      >
        <div className="nav-icon">📊</div>
        <div className="nav-label">記録</div>
      </div>
      <div
        className="nav-item"
        onClick={() => alert('プロフィール機能は開発中です')}
      >
        <div className="nav-icon">👤</div>
        <div className="nav-label">プロフィール</div>
      </div>
    </div>
  );
}
