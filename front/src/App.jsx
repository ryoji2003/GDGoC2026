import { useState, useEffect } from 'react';
import ThemeToggle from './components/ThemeToggle';
import BottomNav from './components/BottomNav';
import HomeScreen from './components/screens/HomeScreen';
import ScenarioScreen from './components/screens/ScenarioScreen';
import ConversationScreen from './components/screens/ConversationScreen';
import EvaluationScreen from './components/screens/EvaluationScreen';
import RecordScreen from './components/screens/RecordScreen';

function getOrCreateUserId() {
  let id = localStorage.getItem('speakup_user_id');
  if (!id) {
    id = crypto.randomUUID();
    localStorage.setItem('speakup_user_id', id);
  }
  return id;
}

function App() {
  const [currentScreen, setCurrentScreen] = useState('home');
  const [activeScenario, setActiveScenario] = useState('');
  const [theme, setTheme] = useState('light');
  const [userId] = useState(() => getOrCreateUserId());
  const [conversationHistory, setConversationHistory] = useState([]);

  useEffect(() => {
    if (theme === 'dark') {
      document.body.setAttribute('data-theme', 'dark');
    } else {
      document.body.removeAttribute('data-theme');
    }
  }, [theme]);

  function navigate(screen, scenarioName) {
    if (scenarioName) setActiveScenario(scenarioName);
    setCurrentScreen(screen);
  }

  function handleConversationEnd(history) {
    setConversationHistory(history);
    navigate('evaluation');
  }

  function toggleTheme() {
    setTheme(t => t === 'light' ? 'dark' : 'light');
  }

  return (
    <>
      {currentScreen !== 'conversation' && <ThemeToggle theme={theme} onToggle={toggleTheme} />}
      {currentScreen === 'home' && <HomeScreen navigate={navigate} userId={userId} />}
      {currentScreen === 'scenario' && <ScenarioScreen navigate={navigate} />}
      {currentScreen === 'conversation' && (
        <ConversationScreen
          scenarioName={activeScenario}
          onEnd={handleConversationEnd}
        />
      )}
      {currentScreen === 'evaluation' && (
        <EvaluationScreen
          navigate={navigate}
          conversationHistory={conversationHistory}
          userId={userId}
          scenarioName={activeScenario}
        />
      )}
      {currentScreen === 'record' && <RecordScreen userId={userId} />}
      {currentScreen !== 'conversation' && <BottomNav currentScreen={currentScreen} navigate={navigate} />}
    </>
  );
}

export default App;
