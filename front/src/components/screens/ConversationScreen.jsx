import { useState, useEffect, useRef } from 'react';
import { sendMessage, endSession } from '../../api/conversationApi';
import { recognizeSpeech, synthesizeSpeech } from '../../api/speechApi';

export default function ConversationScreen({ scenarioName, onEnd }) {
  const [sessionId] = useState(() => crypto.randomUUID());
  const [currentAiMessage, setCurrentAiMessage] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [userResponseText, setUserResponseText] = useState('');
  const [isAvatarSpeaking, setIsAvatarSpeaking] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState(null);
  const [history, setHistory] = useState([]);
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const initializedRef = useRef(false);

  useEffect(() => {
    if (initializedRef.current) return;
    initializedRef.current = true;
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
          setUserResponseText('');
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

  const micLabel = isRecording ? '録音中...' : isProcessing ? '処理中...' : 'タップして話す';

  return (
    <div className="video-call-screen">
      {/* AI背景画像（プレースホルダー） */}
      <div className={`video-bg-image ${isAvatarSpeaking ? 'speaking' : ''}`} />

      {/* 上部オーバーレイ：ヘッダー＋プログレスバー */}
      <div className="video-header-overlay">
        <div className="video-progress-bar">
          <div className="video-progress-fill" style={{ width: `${progress}%` }} />
        </div>
        <div className="video-header-content">
          <span className="video-scenario-name">{scenarioName}</span>
        </div>
      </div>

      {/* AIの発話：字幕風オーバーレイ */}
      {(currentAiMessage || isProcessing) && (
        <div className="ai-subtitle">
          <p>{isProcessing && !currentAiMessage ? '考え中...' : currentAiMessage}</p>
        </div>
      )}

      {/* ユーザーの発話テキスト */}
      {userResponseText && (
        <div className="user-subtitle">
          <p>{userResponseText}</p>
        </div>
      )}

      {/* エラー表示 */}
      {error && (
        <div className="video-error">
          {error}
        </div>
      )}

      {/* ユーザーワイプ（右下・ダミー） */}
      <div className="user-wipe">
        <div className="user-wipe-inner">
          <span className="user-wipe-label">あなた</span>
        </div>
      </div>

      {/* 下部コントロールバー */}
      <div className="video-controls">
        <div className="video-controls-hint">{micLabel}</div>
        <div className="video-controls-buttons">
          {/* ミュートダミーボタン */}
          <button className="video-btn video-btn-mute" aria-label="音量">
            <svg viewBox="0 0 24 24" fill="currentColor" width="24" height="24">
              <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02z"/>
            </svg>
          </button>

          {/* マイクボタン（メイン） */}
          <button
            className={`video-btn video-btn-mic ${isRecording ? 'recording' : ''} ${isProcessing && !isRecording ? 'disabled' : ''}`}
            onClick={toggleRecording}
            disabled={isProcessing && !isRecording}
            aria-label={isRecording ? '録音停止' : '録音開始'}
          >
            {isRecording ? (
              <svg viewBox="0 0 24 24" fill="currentColor" width="30" height="30">
                <path d="M6 6h12v12H6z"/>
              </svg>
            ) : (
              <svg viewBox="0 0 24 24" fill="currentColor" width="30" height="30">
                <path d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3zm-1-9c0-.55.45-1 1-1s1 .45 1 1v6c0 .55-.45 1-1 1s-1-.45-1-1V5zm6 6c0 2.76-2.24 5-5 5s-5-2.24-5-5H5c0 3.53 2.61 6.43 6 6.92V21h2v-3.08c3.39-.49 6-3.39 6-6.92h-2z"/>
              </svg>
            )}
          </button>

          {/* 終了ボタン */}
          <button
            className="video-btn video-btn-end"
            onClick={handleEnd}
            aria-label="通話終了"
          >
            <svg viewBox="0 0 24 24" fill="currentColor" width="26" height="26">
              <path d="M20.01 15.38c-1.23 0-2.42-.2-3.53-.56-.35-.12-.74-.03-1.01.24l-1.57 1.97c-2.83-1.35-5.48-3.9-6.89-6.83l1.95-1.66c.27-.28.35-.67.24-1.02-.37-1.11-.56-2.3-.56-3.53 0-.54-.45-.99-.99-.99H4.19C3.65 3 3 3.24 3 3.99 3 13.28 10.73 21 20.01 21c.71 0 .99-.63.99-1.18v-3.45c0-.54-.45-.99-.99-.99z"/>
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
