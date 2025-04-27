'use client';

import { useState, useEffect } from 'react';
import { Howl } from 'howler';
import dynamic from 'next/dynamic';
import { useSearchParams } from 'next/navigation';

const Confetti = dynamic(() => import('react-confetti'), { ssr: false });

const defaultWords = ['oskar', 'mamma', 'pappa'];
const basePath = process.env.NEXT_PUBLIC_BASE_PATH;
const incorrectSound = new Howl({ src: [`${basePath}/sounds/incorrect.aiff`] });
const correctSound = new Howl({ src: [`${basePath}/sounds/correct.mp3`] });
// const completeSound = new Howl({ src: [`${basePath}/sounds/applause.wav`] });

const playLetterSound = (letter: string) => {
  const sound = new Howl({ src: [`${basePath}/sounds/letters/${letter.toUpperCase()}.mp3`] });
  sound.play();
};

export default function TypingGame() {
  const searchParams = useSearchParams();
  const urlWords = searchParams.get('words')?.split(',').map(w => w.trim().toLowerCase()) || [];
  const words = urlWords.length > 0 ? urlWords : defaultWords;
  
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [typedLetters, setTypedLetters] = useState<string[]>([]);
  const [showConfetti, setShowConfetti] = useState(false);
  const [showStarConfetti, setShowStarConfetti] = useState(false);

  const currentWord = words[currentWordIndex];

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      console.log('Key pressed:', e.key, 'Event type:', e.type);
      const key = e.key.toLowerCase();
      if (!currentWord || typedLetters.length >= currentWord.length) {
        console.log('No current word or word complete:', { currentWord, typedLetters });
        return;
      }
      const currentLetter = currentWord[typedLetters.length].toLowerCase();
      console.log('Current state:', { key, currentLetter, typedLetters });

      if (key === currentLetter) {
        setTypedLetters([...typedLetters, key]);
        playLetterSound(currentLetter);

        if (typedLetters.length + 1 === currentWord.length) {
          correctSound.play();
          setShowConfetti(true);
          
          // Speak the completed word
          const synth = window.speechSynthesis;
          const utterance = new SpeechSynthesisUtterance(currentWord);
          utterance.lang = 'sv-SE';
          setTimeout(() => {
            synth.speak(utterance);
          }, 600);

          setTimeout(() => {
            setShowConfetti(false);
            if (currentWordIndex + 1 === words.length) {
              setShowStarConfetti(true);
              setTimeout(() => setShowStarConfetti(false), 5000);
              setCurrentWordIndex(0);
            } else {
              setCurrentWordIndex(currentWordIndex + 1);
            }
            setTypedLetters([]);
          }, 2000);
        }
      } else {
        incorrectSound.play();
      }
    };

    document.addEventListener('keydown', handleKeyPress);
    return () => document.removeEventListener('keydown', handleKeyPress);
  }, [currentWord, currentWordIndex, typedLetters, words.length]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      {showConfetti && <Confetti />}
      {showStarConfetti && <Confetti recycle={false} numberOfPieces={500} />}
      
      <div className="text-4xl font-bold mb-8 text-gray-700">SKRIV GÄRNA</div>
      
      <div className="text-8xl font-bold mb-8">
        {currentWord.split('').map((letter, index) => (
          <span
            key={index}
            className={`px-2 py-1 ${
              index < typedLetters.length
                ? 'bg-green-500 text-white'
                : 'text-gray-800'
            }`}
          >
            {letter.toUpperCase()}
          </span>
        ))}
      </div>

      <input
        type="text"
        className="opacity-0 absolute"
        autoFocus
        onFocus={(e) => e.target.select()}
      />
    </div>
  );
} 