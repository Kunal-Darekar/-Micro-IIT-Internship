import React, { useEffect, useState, useCallback } from 'react';
import '../styles/Celebration.css';

type CelebrationProps = {
  winner: string | null;
};



const Celebration: React.FC<CelebrationProps> = ({ winner }) => {
  const [confetti, setConfetti] = useState<React.ReactElement[]>([]);
  
  const createConfetti = useCallback(() => {
    if (!winner) return [];
    
    const confettiElements = [];
    const confettiCount = 100; // Increased confetti count
    
    for (let i = 0; i < confettiCount; i++) {
      const left = `${Math.random() * 100}%`;
      const animationDuration = `${2 + Math.random() * 3}s`;
      const delay = `${Math.random() * 0.5}s`;
      const rotation = Math.random() * 360;
      
      // Determine confetti type based on index for variety
      const confettiClass = i % 7 === 0 ? 'confetti confetti-star' : 'confetti';
      
      confettiElements.push(
        <div 
          key={i}
          className={confettiClass}
          style={{
            left,
            animationDuration,
            transform: `rotate(${rotation}deg)`,
            animationDelay: delay
          }}
        />
      );
    }
    return confettiElements;
  }, [winner]);

  useEffect(() => {
    if (winner) {
      // Create initial confetti burst
      setConfetti(createConfetti());
      
      // Add more confetti after a short delay for a continuous effect
      const secondBurstTimer = setTimeout(() => {
        setConfetti(prev => [...prev, ...createConfetti()]);
      }, 500);
      
      // Clean up confetti after animation completes
      const cleanupTimer = setTimeout(() => {
        setConfetti([]);
      }, 6000);

      return () => {
        clearTimeout(secondBurstTimer);
        clearTimeout(cleanupTimer);
      };
    }
  }, [winner, createConfetti]);

  if (!winner) return null;

  return (
    <div className="celebration">
      {confetti}
      <div className="winner-text">
        <span className={`winner-text-${winner.toLowerCase()}`}>{winner}</span> Wins!
      </div>
      <div className="celebration-emoji">
        {winner === 'X' ? '🏆' : '🎉'}
      </div>
    </div>
  );
};

export default Celebration;