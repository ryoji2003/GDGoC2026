import { useState, useEffect, useRef } from 'react';
import { sendMessage, endSession } from '../../api/conversationApi';
import { recognizeSpeech, synthesizeSpeech } from '../../api/speechApi';

export default function ConversationScreen({ scenarioName, onEnd }) {
  const [sessionId] = useState(() => crypto.randomUUID());
  const [currentAiMessage, setCurrentAiMessage] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [userResponseText, setUserResponseText] = useState('タップして話す');
  const [isAvatarSpeaking, setIsAvatarSpeaking] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState(null);
  const [history, setHistory] = useState([]);
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);

  useEffect(() => {
    sendToAI('こんにちは。よろしくお願いします。');
  }, []);

  async function sendToAI(userText) {
    setIsProcessing(true);
    setError(null);
    try {
      const { reply, history: updatedHistory } = await sendMessage(sessionId, scenarioName, userText);
      if (updatedHistory) setHistory(updatedHistory);
      setCurrentAiMessage(reply);
      setProgress(p => Math.min(p + 20, 90));
      setIsAvatarSpeaking(true);
      const { audio_base64 } = await synthesizeSpeech(reply);
      await playAudio(audio_base64);
      setIsAvatarSpeaking(false);
    } catch (e) {
      setError(e.message);
    } finally {
      setIsProcessing(false);
    }
  }

  function playAudio(base64) {
    return new Promise(resolve => {
      const audio = new Audio(`data:audio/mp3;base64,${base64}`);
      audio.onended = resolve;
      audio.onerror = resolve;
      audio.play().catch(resolve);
    });
  }

  async function toggleRecording() {
    if (isProcessing) return;

    if (isRecording) {
      mediaRecorderRef.current?.stop();
      return;
    }

    setError(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      audioChunksRef.current = [];
      const recorder = new MediaRecorder(stream);
      mediaRecorderRef.current = recorder;

      recorder.ondataavailable = e => {
        if (e.data.size > 0) audioChunksRef.current.push(e.data);
      };

      recorder.onstop = async () => {
        stream.getTracks().forEach(t => t.stop());
        setIsRecording(false);
        setIsProcessing(true);
        setUserResponseText('認識中...');
        try {
          const blob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
          const { text } = await recognizeSpeech(blob);
          setUserResponseText(text);
          await sendToAI(text);
        } catch (e) {
          setError(e.message);
          setUserResponseText('タップして話す');
        } finally {
          setIsProcessing(false);
        }
      };

      recorder.start();
      setIsRecording(true);
      setUserResponseText('録音中...');
    } catch (e) {
      setError('マイクへのアクセスが拒否されました');
    }
  }

  async function handleEnd() {
    if (mediaRecorderRef.current?.state === 'recording') {
      mediaRecorderRef.current.stop();
    }
    try {
      const { history: finalHistory } = await endSession(sessionId);
      onEnd(finalHistory || history);
    } catch {
      onEnd(history);
    }
  }

  return (
    <div className="screen active">
      <div className="conversation-screen">
        <div className="conversation-header">
          <div className="scenario-info">{scenarioName}</div>
          <button className="end-button" onClick={handleEnd} disabled={isProcessing}>終了する</button>
        </div>
        <div className="progress-bar">
          <div className="progress-fill" style={{ width: `${progress}%` }}></div>
        </div>

        {error && <div className="error" style={{ padding: '8px 16px', color: 'red', fontSize: '14px' }}>{error}</div>}

        <div className="ai-section">
          <div className={`ai-avatar ${isAvatarSpeaking ? 'speaking' : ''}`}>
            <div className="ai-avatar-icon">🤖</div>
          </div>
          <div className="speech-bubble">
            <div className="speech-text">
              {isProcessing && !currentAiMessage ? '考え中...' : currentAiMessage}
            </div>
          </div>
        </div>

        <div className="user-section">
          <button
            className={`mic-button ${isRecording ? 'recording' : ''}`}
            onClick={toggleRecording}
            disabled={isProcessing && !isRecording}
          >
            🎤
          </button>
          <div className="user-response">{userResponseText}</div>
        </div>
      </div>
    </div>
  );
}
