import { useEffect, useState } from 'react';
import './App.css'; 

interface SentencePair {
  English: string;
  Translation: string;
}

interface SpeakDeckProps {
  language: 'telugu' | 'german';
  onBack: () => void;
}

export default function SpeakDeck({ language, onBack }: SpeakDeckProps) {
  const [sentences, setSentences] = useState<SentencePair[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showTranslation, setShowTranslation] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const filename = language === 'telugu' ? '/sentences.csv' : '/german_sentences.csv';

    fetch(filename)
      .then((response) => response.text())
      .then((text) => {
        const lines = text.split('\n');
        const parsedData: SentencePair[] = [];
        for (let i = 1; i < lines.length; i++) {
          const line = lines[i].trim();
          if (line) {
            const firstComma = line.indexOf(',');
            if (firstComma !== -1) {
              const english = line.substring(0, firstComma).trim();
              const translation = line.substring(firstComma + 1).trim();
              parsedData.push({ English: english, Translation: translation });
            }
          }
        }
        setSentences(parsedData);
        setLoading(false);
      });
  }, [language]);

  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowTranslation(false);
    setCurrentIndex((prev) => (prev + 1) % sentences.length);
  };

  const handlePrev = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowTranslation(false);
    setCurrentIndex((prev) => (prev - 1 + sentences.length) % sentences.length);
  };

  if (loading) return <div>Loading {language} sentences...</div>;
  if (sentences.length === 0) return <div>No sentences found.</div>;

  const currentItem = sentences[currentIndex];

  return (
    <div className="deck-container">
      <button className="back-button" onClick={onBack}>← Back</button>
      <h2>{language.charAt(0).toUpperCase() + language.slice(1)} Speak Mode</h2>
      
      <div 
        className={`card ${showTranslation ? 'flipped' : ''}`} 
        onClick={() => setShowTranslation(!showTranslation)}
      >
        <div className="card-content">
          {showTranslation ? (
            <div className="telugu-word" style={{ fontSize: '1.8rem' }}>
              {currentItem.Translation}
            </div>
          ) : (
            <div className="english-word" style={{ fontSize: '1.5rem' }}>
              {currentItem.English}
            </div>
          )}
          <div className="hint">(Click to flip)</div>
        </div>
      </div>

      <div className="controls">
        <button onClick={handlePrev}>Previous</button>
        <span className="counter">{currentIndex + 1} / {sentences.length}</span>
        <button onClick={handleNext}>Next</button>
      </div>
    </div>
  );
}
