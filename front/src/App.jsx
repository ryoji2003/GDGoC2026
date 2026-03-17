import { useState, useEffect } from 'react';
import ThemeToggle from './components/ThemeToggle';
import BottomNav from './components/BottomNav';
import HomeScreen from './components/screens/HomeScreen';
import ScenarioScreen from './components/screens/ScenarioScreen';
import ConversationScreen from './components/screens/ConversationScreen';
import EvaluationScreen from './components/screens/EvaluationScreen';
import RecordScreen from './components/screens/RecordScreen';

function App() {
  const [currentScreen, setCurrentScreen] = useState('home');
  const [activeScenario, setActiveScenario] = useState('');
  const [theme, setTheme] = useState('light');

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

  function toggleTheme() {
    setTheme(t => t === 'light' ? 'dark' : 'light');
  }

  return (
    <>
      <ThemeToggle theme={theme} onToggle={toggleTheme} />
      {currentScreen === 'home' && <HomeScreen navigate={navigate} />}
      {currentScreen === 'scenario' && <ScenarioScreen navigate={navigate} />}
      {currentScreen === 'conversation' && (
        <ConversationScreen
          scenarioName={activeScenario}
          onEnd={() => navigate('evaluation')}
        />
      )}
      {currentScreen === 'evaluation' && <EvaluationScreen navigate={navigate} />}
      {currentScreen === 'record' && <RecordScreen />}
      <BottomNav currentScreen={currentScreen} navigate={navigate} />
    </>
  );
}

export default App;
