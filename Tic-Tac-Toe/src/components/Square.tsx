import React from 'react';
import '../styles/Square.css';

type SquareProps = {
  value: string | null;
  onClick: () => void;
  isCenter?: boolean;
  isWinning?: boolean;
};

const Square: React.FC<SquareProps> = ({ value, onClick, isCenter = false, isWinning = false }) => {
  return (
    <button 
      className={`square ${value ? `square-${value.toLowerCase()}` : ''} ${isCenter ? 'center-square' : ''} ${isWinning ? 'winning-square' : ''}`} 
      onClick={onClick}
      aria-label={value ? `Square with ${value}` : 'Empty square'}
    >
      {value}
    </button>
  );
};

export default Square;