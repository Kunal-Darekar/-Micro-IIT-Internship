import React, { useState } from 'react';
import Board from './Board';
import { calculateWinner } from '../utils/gameUtils';
import '../styles/Game.css';

const Game: React.FC = () => {
  const [history, setHistory] = useState<{squares: (string | null)[]}[]>([{
    squares: Array(9).fill(null),
  }]);
  const [stepNumber, setStepNumber] = useState<number>(0);
  const [xIsNext, setXIsNext] = useState<boolean>(true);

  const handleClick = (i: number) => {
    const currentHistory = history.slice(0, stepNumber + 1);
    const current = currentHistory[currentHistory.length - 1];
    const squares = [...current.squares];

    // Return if the game is won or the square is already filled
    if (calculateWinner(squares) || squares[i]) {
      return;
    }

    squares[i] = xIsNext ? 'X' : 'O';
    
    setHistory([...currentHistory, { squares }]);
    setStepNumber(currentHistory.length);
    setXIsNext(!xIsNext);
  };

  const jumpTo = (step: number) => {
    setStepNumber(step);
    setXIsNext((step % 2) === 0);
  };

  const resetGame = () => {
    setHistory([{
      squares: Array(9).fill(null),
    }]);
    setStepNumber(0);
    setXIsNext(true);
  };

  const current = history[stepNumber];
  const winner = calculateWinner(current.squares);

  let status;
  if (winner) {
    status = `Winner: ${winner}`;
  } else if (stepNumber === 9) {
    status = 'Game ended in a draw!';
  } else {
    status = `Next player: ${xIsNext ? 'X' : 'O'}`;
  }

  const moves = history.map((_, move) => {
    const desc = move ?
      `Go to move #${move}` :
      'Go to game start';
    return (
      <li key={move}>
        <button 
          className={`history-button ${stepNumber === move ? 'active' : ''}`}
          onClick={() => jumpTo(move)}
        >
          {desc}
        </button>
      </li>
    );
  });

  return (
    <div className="game">
      <div className="game-board">
        <Board
          squares={current.squares}
          onClick={handleClick}
        />
      </div>
      <div className="game-info">
        <div className="status">{status}</div>
        <button className="reset-button" onClick={resetGame}>Reset Game</button>
        <ol>{moves}</ol>
      </div>
    </div>
  );
};

export default Game;