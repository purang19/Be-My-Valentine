import React, { useEffect, useState } from 'react';
import { FallingItem } from '../types';

const FallingLove: React.FC = () => {
  const [items, setItems] = useState<FallingItem[]>([]);

  useEffect(() => {
    const emojis = ['🌹', '❤️', '🌹', '❤️', '💕'];
    const newItems: FallingItem[] = Array.from({ length: 25 }).map((_, i) => ({
      id: i,
      left: Math.random() * 100,
      animationDuration: 5 + Math.random() * 10, // 5-15 seconds
      delay: Math.random() * 10, // Stagger starts
      content: emojis[Math.floor(Math.random() * emojis.length)],
      size: 1.5 + Math.random() * 1.5, // 1.5rem to 3rem
    }));
    setItems(newItems);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {items.map((item) => (
        <div
          key={item.id}
          className="absolute animate-fall"
          style={{
            left: `${item.left}%`,
            top: '-50px', // Start above screen
            fontSize: `${item.size}rem`,
            animationDuration: `${item.animationDuration}s`,
            animationDelay: `-${item.delay}s`, // Negative delay to start mid-animation
          }}
        >
          {item.content}
        </div>
      ))}
    </div>
  );
};

export default FallingLove;