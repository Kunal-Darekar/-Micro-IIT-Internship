import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';

type Player = {
  name: string;
  symbol: 'X' | 'O';
  wins: number;
  losses: number;
  draws: number;
};

type GameStats = {
  totalGames: number;
  xWins: number;
  oWins: number;
  draws: number;
  history: Array<{
    winner: string | null;
    date: string;
  }>;
};

type GameDifficulty = 'easy' | 'medium' | 'hard' | 'pvp';

type GameContextType = {
  player1: Player;
  player2: Player;
  gameStats: GameStats;
  difficulty: GameDifficulty;
  updatePlayerName: (playerSymbol: 'X' | 'O', name: string) => void;
  updateGameStats: (winner: string | null) => void;
  resetStats: () => void;
  setDifficulty: (difficulty: GameDifficulty) => void;
};

const GameContext = createContext<GameContextType | undefined>(undefined);

export const useGame = () => {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error('useGame must be used within a GameProvider');
  }
  return context;
};

type GameProviderProps = {
  children: ReactNode;
};

export const GameProvider: React.FC<GameProviderProps> = ({ children }) => {
  // Initialize players with default names and stats
  const [player1, setPlayer1] = useState<Player>(() => {
    const savedPlayer = localStorage.getItem('player1');
    return savedPlayer ? JSON.parse(savedPlayer) : {
      name: 'Player X',
      symbol: 'X',
      wins: 0,
      losses: 0,
      draws: 0
    };
  });

  const [player2, setPlayer2] = useState<Player>(() => {
    const savedPlayer = localStorage.getItem('player2');
    return savedPlayer ? JSON.parse(savedPlayer) : {
      name: 'Player O',
      symbol: 'O',
      wins: 0,
      losses: 0,
      draws: 0
    };
  });

  // Initialize game statistics
  const [gameStats, setGameStats] = useState<GameStats>(() => {
    const savedStats = localStorage.getItem('gameStats');
    return savedStats ? JSON.parse(savedStats) : {
      totalGames: 0,
      xWins: 0,
      oWins: 0,
      draws: 0,
      history: []
    };
  });

  // Initialize game difficulty
  const [difficulty, setDifficultyState] = useState<GameDifficulty>(() => {
    const savedDifficulty = localStorage.getItem('difficulty');
    return (savedDifficulty as GameDifficulty) || 'pvp';
  });

  // Save player data to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('player1', JSON.stringify(player1));
  }, [player1]);

  useEffect(() => {
    localStorage.setItem('player2', JSON.stringify(player2));
  }, [player2]);

  // Save game stats to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('gameStats', JSON.stringify(gameStats));
  }, [gameStats]);

  // Save difficulty to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('difficulty', difficulty);
  }, [difficulty]);

  // Update player name
  const updatePlayerName = (playerSymbol: 'X' | 'O', name: string) => {
    if (playerSymbol === 'X') {
      setPlayer1(prev => ({ ...prev, name }));
    } else {
      setPlayer2(prev => ({ ...prev, name }));
    }
  };

  // Update game statistics after a game ends
  const updateGameStats = (winner: string | null) => {
    setGameStats(prev => {
      const newStats = { ...prev };
      newStats.totalGames += 1;
      
      if (winner === 'X') {
        newStats.xWins += 1;
        setPlayer1(p => ({ ...p, wins: p.wins + 1 }));
        setPlayer2(p => ({ ...p, losses: p.losses + 1 }));
      } else if (winner === 'O') {
        newStats.oWins += 1;
        setPlayer2(p => ({ ...p, wins: p.wins + 1 }));
        setPlayer1(p => ({ ...p, losses: p.losses + 1 }));
      } else {
        newStats.draws += 1;
        setPlayer1(p => ({ ...p, draws: p.draws + 1 }));
        setPlayer2(p => ({ ...p, draws: p.draws + 1 }));
      }
      
      // Add game to history
      newStats.history.push({
        winner: winner,
        date: new Date().toISOString()
      });
      
      // Limit history to last 10 games
      if (newStats.history.length > 10) {
        newStats.history = newStats.history.slice(-10);
      }
      
      return newStats;
    });
  };

  // Reset all statistics
  const resetStats = () => {
    setPlayer1(prev => ({ ...prev, wins: 0, losses: 0, draws: 0 }));
    setPlayer2(prev => ({ ...prev, wins: 0, losses: 0, draws: 0 }));
    setGameStats({
      totalGames: 0,
      xWins: 0,
      oWins: 0,
      draws: 0,
      history: []
    });
  };

  // Set game difficulty
  const setDifficulty = (newDifficulty: GameDifficulty) => {
    setDifficultyState(newDifficulty);
  };

  return (
    <GameContext.Provider value={{
      player1,
      player2,
      gameStats,
      difficulty,
      updatePlayerName,
      updateGameStats,
      resetStats,
      setDifficulty
    }}>
      {children}
    </GameContext.Provider>
  );
};