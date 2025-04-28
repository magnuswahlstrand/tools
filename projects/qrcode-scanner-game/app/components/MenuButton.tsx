'use client';

import { Button } from "@/components/ui/button"
import { ChevronRight } from 'lucide-react';

interface MenuButtonProps {
  label: string;
  isSelected: boolean;
  onClick: () => void;
}

export default function MenuButton({ label, isSelected, onClick }: MenuButtonProps) {
  return (
    <div className="relative flex items-center gap-4">
      <Button
        variant={isSelected ? "default" : "outline"}
        className="w-full text-xl font-bold py-6"
        onClick={onClick}
      >
      {isSelected && (
        <ChevronRight 
          className="w-16 h-16 text-primary-foreground animate-[bounce-horizontal_1s_ease-in-out_infinite] stroke-[3] mr-4"
        />
      )}
        
        {label}

      </Button>
    </div>
  );
} 