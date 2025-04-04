import { useState, useEffect } from 'react';
import Board from './components/Board';
import Celebration from './components/Celebration';
import Header from './components/Header';
import PlayerSettings from './components/PlayerSettings';
import GameStats from './components/GameStats';
import { ThemeProvider } from './context/ThemeContext';
import { GameProvider, useGame } from './context/GameContext';
import { calculateWinner, WinnerInfo } from './utils/gameUtils';
import { makeAIMove } from './utils/aiUtils';
import './styles/Game.css';

function AppContent() {
  const { player1, player2, gameStats, difficulty, updateGameStats } = useGame();
  
  const [history, setHistory] = useState([Array(9).fill(null)]);
  const [currentMove, setCurrentMove] = useState(0);
  const [sortAscending, setSortAscending] = useState(true);
  const [showSettings, setShowSettings] = useState(false);
  const [showStats, setShowStats] = useState(false);
  const [gameEnded, setGameEnded] = useState(false);
  
  const xIsNext = currentMove % 2 === 0;
  const currentSquares = history[currentMove];
  
  // Reset game state when difficulty changes
  useEffect(() => {
    handleReset();
  }, [difficulty]);

  function handlePlay(nextSquares: (string | null)[]) {
    const nextHistory = [...history.slice(0, currentMove + 1), nextSquares];
    setHistory(nextHistory);
    setCurrentMove(nextHistory.length - 1);
    
    // Check if game ended after this move
    const winnerInfo = calculateWinner(nextSquares, true) as WinnerInfo;
    const isDraw = nextSquares.every(square => square !== null);
    
    if (winnerInfo.winner || isDraw) {
      setGameEnded(true);
      // Update game statistics
      updateGameStats(winnerInfo.winner);
    } else if (difficulty !== 'pvp' && !xIsNext) {
      // If playing against AI and it's O's turn, make AI move
      setTimeout(() => {
        const aiMove = makeAIMove(nextSquares, 'O', difficulty);
        if (aiMove !== -1) {
          const aiNextSquares = [...nextSquares];
          aiNextSquares[aiMove] = 'O';
          handlePlay(aiNextSquares);
        }
      }, 500); // Small delay for better UX
    }
  }

  function jumpTo(nextMove: number) {
    setCurrentMove(nextMove);
    setGameEnded(false);
  }
  
  function handleReset() {
    setHistory([Array(9).fill(null)]);
    setCurrentMove(0);
    setGameEnded(false);
  }

  const winnerInfo = calculateWinner(currentSquares, true) as WinnerInfo;
  const winner = winnerInfo.winner;
  const winningLine = winnerInfo.winningLine;
  
  let status;
  if (winner) {
    status = `Winner: ${winner === 'X' ? player1.name : player2.name}`;
  } else if (currentSquares.every(square => square !== null)) {
    status = 'Draw!';
  } else {
    status = `Next player: ${xIsNext ? player1.name : player2.name} (${xIsNext ? 'X' : 'O'})`;
  }

  const moves = history.map((squares, move) => {
    let description;
    if (move > 0) {
      const prevSquares = history[move - 1];
      const changedIndex = squares.findIndex((square, i) => square !== prevSquares[i]);
      const row = Math.floor(changedIndex / 3) + 1;
      const col = (changedIndex % 3) + 1;
      description = `Go to move #${move} (${row},${col})`;
    } else {
      description = 'Go to game start';
    }
    return (
      <li key={move}>
        {move === currentMove ? (
          <span>You are at move #{move}</span>
        ) : (
          <button onClick={() => jumpTo(move)}>{description}</button>
        )}
      </li>
    );
  });

  const sortedMoves = sortAscending ? moves : [...moves].reverse();

  return (
    <>
      <Header 
        onOpenSettings={() => setShowSettings(true)} 
        onOpenStats={() => setShowStats(true)} 
      />
      
      <div className="game">
        <Celebration winner={winner} />
        
        <div className="game-board">
          <Board 
            squares={currentSquares} 
            winningLine={winningLine}
            onClick={(i) => {
              // Prevent clicks if game ended or if it's AI's turn
              if (calculateWinner(currentSquares) || currentSquares[i] || 
                  (difficulty !== 'pvp' && !xIsNext)) {
                return;
              }
              const nextSquares = currentSquares.slice();
              nextSquares[i] = xIsNext ? 'X' : 'O';
              handlePlay(nextSquares);
            }} 
          />
        </div>
        
        <div className="game-info">
          <div className="status">{status}</div>
          <button 
            className="reset-button" 
            onClick={handleReset}
          >
            Reset Game
          </button>
          <button 
            className="sort-button" 
            onClick={() => setSortAscending(!sortAscending)}
          >
            {sortAscending ? 'Sort Descending' : 'Sort Ascending'}
          </button>
          <ol>{sortedMoves}</ol>
        </div>
      </div>
      
      {showSettings && <PlayerSettings onClose={() => setShowSettings(false)} />}
      {showStats && <GameStats onClose={() => setShowStats(false)} />}
    </>
  );
}

function App() {
  return (
    <ThemeProvider>
      <GameProvider>
        <AppContent />
      </GameProvider>
    </ThemeProvider>
  );
}

export default App;