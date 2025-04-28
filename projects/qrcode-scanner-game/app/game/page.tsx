'use client';

import { useState, useEffect, useRef } from 'react';
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useRouter } from 'next/navigation';
import { GameItem, QR_CODE_MAPPINGS, GAME_ITEMS, CORRECT_ORDER, GAME_COMMANDS } from '../types/game';
import Image from 'next/image';
import { CheckCircle2, XCircle, HelpCircle } from 'lucide-react';
import confetti from 'canvas-confetti';
import { Input } from "@/components/ui/input"

export default function GamePage() {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const [scannedItems, setScannedItems] = useState<GameItem[]>([]);

  const checkOrder = (items: GameItem[]) => {
    const itemIds = items.map(item => item.id);
    return JSON.stringify(itemIds) === JSON.stringify(CORRECT_ORDER);
  };

  const triggerConfetti = () => {
    confetti({
      particleCount: 200,
      spread: 190,
      startVelocity: 30,
      origin: { y: 0.6 }
    });
  };

  const handleInput = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const input = inputRef.current?.value.toLowerCase() || '';
    console.log(`Input received: ${input}`);

    // Check for commands first
    if (input in GAME_COMMANDS) {
      console.log(`Command entered: ${input}`);
      if (input === 'restart') {
        setScannedItems([]);
      } else if (input === 'down') {
        router.push('/');
      }
    }
    // Then check for item scans
    else if (input in QR_CODE_MAPPINGS) {
      const itemId = QR_CODE_MAPPINGS[input];
      const item = GAME_ITEMS[itemId];
      console.log(`Item scanned: ${item.title} (${input})`);
      
      // Only add if not already in the list
      setScannedItems(prev => {
        if (prev.some(i => i.id === item.id)) {
          console.log('Item already scanned');
          return prev;
        }
        return [...prev, item];
      });
    }

    // Clear input
    if (inputRef.current) {
      inputRef.current.value = '';
    }
  };

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  const isOrderCorrect = checkOrder(scannedItems);
  const allItemsScanned = scannedItems.length === CORRECT_ORDER.length;

  useEffect(() => {
    if (isOrderCorrect) {
      triggerConfetti();
    }
  }, [isOrderCorrect]);

  const StatusIcon = () => {
    if (!allItemsScanned) {
      return <HelpCircle className="w-8 h-8 text-yellow-500" />;
    }
    if (isOrderCorrect) {
      return <CheckCircle2 className="w-8 h-8 text-green-500" />;
    }
    return <XCircle className="w-8 h-8 text-red-500" />;
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="w-full max-w-4xl">
        <CardContent className="pt-6">
          <div className="flex items-center justify-center gap-4 mb-8">
            <h1 className="text-2xl font-bold text-center">Code Scanner</h1>
            <StatusIcon />
          </div>
          
          <div className="text-center mb-8">
            {isOrderCorrect ? (
              <div className="text-green-500 font-bold">Correct order! 🎉</div>
            ) : (
              <div>Scan items in order according to their size, starting with the smallest.</div>
            )}
          </div>
          
          <div className="grid grid-cols-3 gap-4 mb-8">
            {scannedItems.map((item, index) => (
              <div key={`${item.id}-${index}`} className="aspect-square relative">
                <Image
                  src={item.imageUrl}
                  alt={item.title}
                  fill
                  className="object-cover rounded-lg"
                />
              </div>
            ))}
          </div>

          <form onSubmit={handleInput} className="mb-8">
            <Input
              ref={inputRef}
              type="text"
              placeholder="Enter code..."
              className="text-center"
              autoComplete="off"
            />
          </form>

          <div className="flex gap-4">
            <Button 
              variant="outline" 
              className="flex-1"
              onClick={() => setScannedItems([])}
            >
              Reset
            </Button>
            <Button 
              variant="outline" 
              className="flex-1"
              onClick={() => router.push('/')}
            >
              Back to Menu
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 