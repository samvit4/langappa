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
        
        <div className="menu-buttons">
          <button className="menu-btn" onClick={() => setMode('vocab')}>
            Vocabulary
          </button>
          
          <button className="menu-btn" onClick={() => setMode('speak')}>
            Speaking
          </button>
        </div>
      </div>
    );
  }

  // Default: Show Language Selection
  return (
    <div className="container">
      
      <div className="menu-buttons">
        <button className="menu-btn" onClick={() => setLanguage('telugu')}>
           Telugu
        </button>
        
        <button className="menu-btn" onClick={() => setLanguage('german')}>
          German
        </button>
      </div>

      <div className="about-section">
        <h2>About</h2>
        <p>
          There was a point in time where I was set on learning German through my own ways. I have reached a point where I am reasonably comfortable with the language but want to get better at it. 
          Unable to find an app that suits my style, I decided to build my own website. 
        </p>
      </div>
    </div>
  );
}

export default App;
