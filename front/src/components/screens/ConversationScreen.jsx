import { useState, useEffect, useRef } from 'react';
import { aiMessages, userResponses } from '../../data/mockData';

export default function ConversationScreen({ scenarioName, onEnd }) {
  const [currentMessageIndex, setCurrentMessageIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const [isRecording, setIsRecording] = useState(false);
  const [userResponseText, setUserResponseText] = useState('タップして話す');
  const [isAvatarSpeaking, setIsAvatarSpeaking] = useState(true);
  const timerRef = useRef(null);

  useEffect(() => {
    setCurrentMessageIndex(0);
    setProgress(0);
    setIsAvatarSpeaking(true);
    timerRef.current = setTimeout(() => scheduleNext(0), 3000);
    return () => clearTimeout(timerRef.current);
  }, []);

  function scheduleNext(index) {
    const next = index + 1;
    if (next < aiMessages.length) {
      setCurrentMessageIndex(next);
      setProgress((next / aiMessages.length) * 100);
      timerRef.current = setTimeout(() => scheduleNext(next), 5000);
    } else {
      timerRef.current = setTimeout(onEnd, 3000);
    }
  }

  function toggleRecording() {
    if (isRecording) return;
    setIsRecording(true);
    setUserResponseText('録音中...');
    setIsAvatarSpeaking(false);

    setTimeout(() => {
      setIsRecording(false);
      setUserResponseText(userResponses[currentMessageIndex] || 'ありがとうございました。');
      setIsAvatarSpeaking(true);
    }, 2000);
  }

  function handleEnd() {
    clearTimeout(timerRef.current);
    onEnd();
  }

  return (
    <div className="screen active">
      <div className="conversation-screen">
        <div className="conversation-header">
          <div className="scenario-info">{scenarioName}</div>
          <button className="end-button" onClick={handleEnd}>終了する</button>
        </div>
        <div className="progress-bar">
          <div className="progress-fill" style={{ width: `${progress}%` }}></div>
        </div>

        <div className="ai-section">
          <div className={`ai-avatar ${isAvatarSpeaking ? 'speaking' : ''}`}>
            <div className="ai-avatar-icon">🤖</div>
          </div>
          <div className="speech-bubble">
            <div className="speech-text">{aiMessages[currentMessageIndex]}</div>
          </div>
        </div>

        <div className="user-section">
          <button
            className={`mic-button ${isRecording ? 'recording' : ''}`}
            onClick={toggleRecording}
          >
            🎤
          </button>
          <div className="user-response">{userResponseText}</div>
        </div>
      </div>
    </div>
  );
}
