import { useEffect, useState } from 'react';
import './App.css';

interface WordPair {
  English: string;
  Translation: string; // Changed from 'Telugu' to generic 'Translation'
}

interface VocabDeckProps {
  language: 'telugu' | 'german';
  onBack: () => void;
}

export default function VocabDeck({ language, onBack }: VocabDeckProps) {
  const [words, setWords] = useState<WordPair[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showTranslation, setShowTranslation] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Determine file based on language
    const filename = language === 'telugu' ? 'words.csv' : 'german_words.csv';
    const fullPath = `${import.meta.env.BASE_URL}${filename}`;

    fetch(fullPath)
      .then((response) => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.text();
      })
      .then((text) => {
        const lines = text.split('\n');
        const parsedWords: WordPair[] = [];
        for (let i = 1; i < lines.length; i++) {
          const line = lines[i].trim();
          if (line) {
            const [english, translation] = line.split(',');
            if (english && translation) {
              parsedWords.push({ English: english.trim(), Translation: translation.trim() });
            }
          }
        }
        setWords(parsedWords);
        setLoading(false);
      });
  }, [language]);

  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowTranslation(false);
    setCurrentIndex((prev) => (prev + 1) % words.length);
  };

  const handlePrev = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowTranslation(false);
    setCurrentIndex((prev) => (prev - 1 + words.length) % words.length);
  };

  if (loading) return <div>Loading {language} vocab...</div>;
  if (words.length === 0) return <div>No words found.</div>;

  const currentWord = words[currentIndex];

  return (
    <div className="deck-container">
      <button className="back-button" onClick={onBack}>← Back</button>
      <h2>{language.charAt(0).toUpperCase() + language.slice(1)} Vocabulary</h2>
      
      <div 
        className={`card ${showTranslation ? 'flipped' : ''}`} 
        onClick={() => setShowTranslation(!showTranslation)}
      >
        <div className="card-content">
          {showTranslation ? (
            <div className="telugu-word">{currentWord.Translation}</div>
          ) : (
            <div className="english-word">{currentWord.English}</div>
          )}
          <div className="hint">(Click to flip)</div>
        </div>
      </div>

      <div className="controls">
        <button onClick={handlePrev}>Previous</button>
        <span className="counter">{currentIndex + 1} / {words.length}</span>
        <button onClick={handleNext}>Next</button>
      </div>
    </div>
  );
}
