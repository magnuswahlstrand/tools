import { Suspense } from 'react';
import TypingGame from './components/TypingGame';

export default function Home() {
  return (
    <main className="min-h-screen">
      <Suspense fallback={<div>Loading...</div>}>
        <TypingGame />
      </Suspense>
    </main>
  );
}
