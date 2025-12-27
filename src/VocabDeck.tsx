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
    const filename = language === 'telugu' ? 'telugu_words.csv' : 'german_words.csv';
    const fullPath = `${import.meta.env.BASE_URL}${filename}`;

    fetch(fullPath)
      .then((response) => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.text();
      })
      .then((text) => {
        // CSV parsing that handles quoted fields with commas inside quotes
        // Strip out trailing newlines, if any
        const lines = text.replace(/\r/g, '').split('\n').filter(line => line.trim().length > 0);
        if (lines.length < 2) {
          setWords([]);
          setLoading(false);
          return;
        }

        // Helper to split CSV line by commas, handling quoted fields
        function parseCSVLine(line: string): string[] {
          const result = [];
          let cur = '';
          let inQuotes = false;
          for (let i = 0; i < line.length; i++) {
            const c = line[i];
            if (c === '"') {
              if (inQuotes && i + 1 < line.length && line[i + 1] === '"') {
                // Escaped quote ("")
                cur += '"';
                i++;
              } else {
                inQuotes = !inQuotes;
              }
            } else if (c === ',' && !inQuotes) {
              result.push(cur);
              cur = '';
            } else {
              cur += c;
            }
          }
          result.push(cur);
          return result;
        }

        // Read header and determine column indices
        const header = lines[0].trim();
        const headerColumns = parseCSVLine(header);
        let englishIdx = -1;
        let translationIdx = -1;

        // For Telugu CSV: "Word,Definition 1"
        // For German CSV: may have different headers
        if (language === 'telugu') {
          englishIdx = headerColumns.findIndex(col => col.trim().toLowerCase() === 'word');
          translationIdx = headerColumns.findIndex(col => col.trim().toLowerCase() === 'definition 1');
        } 
        else if (language === 'german') {
          // Try to smartly find columns for German; look for "Word" and "Definition 1"
          englishIdx = headerColumns.findIndex(col => col.trim().toLowerCase() === 'word');
          translationIdx = headerColumns.findIndex(col => col.trim().toLowerCase() === 'definition 1');
        }

        // If missing headers, show nothing
        if (englishIdx === -1 || translationIdx === -1) {
          setWords([]);
          setLoading(false);
          return;
        }

        const parsedWords: WordPair[] = [];
        for (let i = 1; i < lines.length; i++) {
          const line = lines[i].trim();
          if (line) {
            const cols = parseCSVLine(line);
            if (cols.length > Math.max(englishIdx, translationIdx)) {
              parsedWords.push({
                English: cols[translationIdx].trim() || '',
                Translation: cols[englishIdx].trim() || ''
              });
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
