import { useState, useEffect } from 'react';
import RadarChart from './charts/RadarChart';
import { analyzeConversation } from '../../api/evaluationApi';
import { saveRecord } from '../../api/recordApi';

export default function EvaluationScreen({ navigate, conversationHistory, userId, scenarioName }) {
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    analyzeConversation(conversationHistory)
      .then(data => {
        setResult(data);
        saveRecord(userId, scenarioName, data.scores, data.feedback).catch(() => {});
      })
      .catch(e => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  function shareResult() {
    const score = result ? Math.round((result.scores.clarity + result.scores.keigo + result.scores.tempo + result.scores.empathy) / 4) : 0;
    if (navigator.share) {
      navigator.share({
        title: 'SpeakUp - 練習結果',
        text: `今日の会話練習で${score}点を獲得しました！🎉`,
        url: window.location.href,
      }).catch(() => {});
    } else {
      alert('この機能はモバイルデバイスで利用できます');
    }
  }

  if (loading) {
    return (
      <div className="screen active">
        <div className="evaluation-screen">
          <div className="loading">評価を分析中...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="screen active">
        <div className="evaluation-screen">
          <div className="error">エラー: {error}</div>
          <div className="action-buttons">
            <button className="action-button secondary" onClick={() => navigate('scenario')}>
              戻る
            </button>
          </div>
        </div>
      </div>
    );
  }

  const overallScore = result
    ? Math.round((result.scores.clarity + result.scores.keigo + result.scores.tempo + result.scores.empathy) / 4)
    : 0;

  return (
    <div className="screen active">
      <div className="evaluation-screen">
        <div className="evaluation-header">
          <h1>練習結果</h1>
          <div className="overall-score">
            <div className="score-circle">
              <div className="score-inner">
                <div className="score-number">{overallScore}</div>
                <div className="score-label">総合スコア</div>
              </div>
            </div>
          </div>
        </div>

        <div className="radar-chart-container">
          <h3>📊 詳細評価</h3>
          <div className="chart-wrapper">
            <RadarChart scores={result.scores} />
          </div>
        </div>

        {result.best_response && (
          <div className="best-response">
            <h3>🌟 今日のベスト返答</h3>
            <div className="best-response-text">{result.best_response}</div>
          </div>
        )}

        {result.feedback?.good?.length > 0 && (
          <div className="feedback-section">
            <h3>👍 良かった点</h3>
            <div className="feedback-list">
              {result.feedback.good.map((item, i) => (
                <div className="feedback-item" key={i}>
                  <div className="feedback-icon">✅</div>
                  <div>{item}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {result.feedback?.improve?.length > 0 && (
          <div className="feedback-section">
            <h3>💡 改善点</h3>
            <div className="feedback-list">
              {result.feedback.improve.map((item, i) => (
                <div className="feedback-item" key={i}>
                  <div className="feedback-icon">📝</div>
                  <div>{item}</div>
                </div>
              ))}
            </div>
          </div>
        )}

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
