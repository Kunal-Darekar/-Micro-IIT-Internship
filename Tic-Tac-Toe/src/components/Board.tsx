import React from 'react';
import Square from './Square';
import '../styles/Board.css';

type BoardProps = {
  squares: (string | null)[];
  onClick: (i: number) => void;
  winningLine: number[] | null;
};

const Board: React.FC<BoardProps> = ({ squares, onClick, winningLine }) => {
  const renderSquare = (i: number) => {
    return (
      <Square 
        value={squares[i]} 
        onClick={() => onClick(i)}
        isCenter={i === 4}
        isWinning={winningLine ? winningLine.includes(i) : false}
      />
    );
  };

  return (
    <div className="board">
      <div className="board-row">
        {renderSquare(0)}
        {renderSquare(1)}
        {renderSquare(2)}
      </div>
      <div className="board-row">
        {renderSquare(3)}
        {renderSquare(4)}
        {renderSquare(5)}
      </div>
      <div className="board-row">
        {renderSquare(6)}
        {renderSquare(7)}
        {renderSquare(8)}
      </div>
    </div>
  );
};

export default Board;