import RadarChart from './charts/RadarChart';

export default function EvaluationScreen({ navigate }) {
  function shareResult() {
    if (navigator.share) {
      navigator.share({
        title: 'SpeakUp - 練習結果',
        text: '今日の会話練習で72点を獲得しました！🎉',
        url: window.location.href,
      }).catch(() => {});
    } else {
      alert('この機能はモバイルデバイスで利用できます');
    }
  }

  return (
    <div className="screen active">
      <div className="evaluation-screen">
        <div className="evaluation-header">
          <h1>練習結果</h1>
          <div className="overall-score">
            <div className="score-circle">
              <div className="score-inner">
                <div className="score-number">72</div>
                <div className="score-label">総合スコア</div>
              </div>
            </div>
          </div>
        </div>

        <div className="radar-chart-container">
          <h3>📊 詳細評価</h3>
          <div className="chart-wrapper">
            <RadarChart />
          </div>
        </div>

        <div className="best-response">
          <h3>🌟 今日のベスト返答</h3>
          <div className="best-response-text">
            「その件につきましては、昨日までに資料をまとめ終えております。明日の会議で詳しくご報告させていただきます。」
          </div>
        </div>

        <div className="feedback-section">
          <h3>👍 良かった点</h3>
          <div className="feedback-list">
            <div className="feedback-item">
              <div className="feedback-icon">✅</div>
              <div>敬語の使い方が正確で、ビジネスシーンに適した表現ができていました。</div>
            </div>
            <div className="feedback-item">
              <div className="feedback-icon">✅</div>
              <div>結論から先に述べる報告スタイルで、要点が明確に伝わりました。</div>
            </div>
            <div className="feedback-item">
              <div className="feedback-icon">✅</div>
              <div>相手の質問に対して具体的な情報を提示できていました。</div>
            </div>
          </div>
        </div>

        <div className="feedback-section">
          <h3>💡 改善点</h3>
          <div className="feedback-list">
            <div className="feedback-item">
              <div className="feedback-icon">📝</div>
              <div>話と話の間に「えーっと」などのフィラーワードが多く見られました。一呼吸置いてから話すことを意識しましょう。</div>
            </div>
            <div className="feedback-item">
              <div className="feedback-icon">📝</div>
              <div>もう少し共感の表現を入れると、コミュニケーションが円滑になります。「ご心配おかけして申し訳ございません」などの配慮の言葉を追加してみましょう。</div>
            </div>
            <div className="feedback-item">
              <div className="feedback-icon">📝</div>
              <div>話すスピードが少し速いです。相手が理解しやすいよう、もう少しゆっくり話すことを心がけましょう。</div>
            </div>
          </div>
        </div>

        <div className="action-buttons">
          <button className="action-button secondary" onClick={() => navigate('scenario')}>
            もう一度練習
          </button>
          <button className="action-button primary" onClick={() => navigate('scenario')}>
            次のシナリオへ
          </button>
        </div>

        <button className="share-button" onClick={shareResult}>
          📤 結果をシェア
        </button>
      </div>
    </div>
  );
}
