import { useState } from 'react';
import VocabDeck from './VocabDeck';
import SpeakDeck from './SpeakDeck';
import './App.css';

type Language = 'telugu' | 'german' | null;
type Mode = 'vocab' | 'speak' | null;

function App() {
  const [language, setLanguage] = useState<Language>(null);
  const [mode, setMode] = useState<Mode>(null);

  // If both language and mode are selected, show the deck
  if (language && mode === 'vocab') {
    return <VocabDeck language={language} onBack={() => setMode(null)} />;
  }

  if (language && mode === 'speak') {
    return <SpeakDeck language={language} onBack={() => setMode(null)} />;
  }

  // If language is selected but mode is NOT, show Mode Selection
  if (language) {
    return (
      <div className="container">
        <button className="back-button" onClick={() => setLanguage(null)}>← Back to Languages</button>
        <h1> učen: {language.charAt(0).toUpperCase() + language.slice(1)}</h1>
        <p>Choose your learning path:</p>
        
        <div className="menu-buttons">
          <button className="menu-btn" onClick={() => setMode('vocab')}>
            📚 Vocabulary
            <span>Words & Flashcards</span>
          </button>
          
          <button className="menu-btn" onClick={() => setMode('speak')}>
            🗣️ Speak
            <span>Phrases & Sentences</span>
          </button>
        </div>
      </div>
    );
  }

  // Default: Show Language Selection
  return (
    <div className="container">
      <h1>LangAppa</h1>
      <p>Select a language to learn:</p>
      
      <div className="menu-buttons">
        <button className="menu-btn" onClick={() => setLanguage('telugu')}>
          🕉️ Telugu
          <span>Dravidian Language</span>
        </button>
        
        <button className="menu-btn" onClick={() => setLanguage('german')}>
          🇩🇪 German
          <span>Deutsch</span>
        </button>
      </div>
    </div>
  );
}

export default App;
