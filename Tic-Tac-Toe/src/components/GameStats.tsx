import React from 'react';
import { useGame } from '../context/GameContext';
import '../styles/GameStats.css';

type GameStatsProps = {
  onClose: () => void;
};

const GameStats: React.FC<GameStatsProps> = ({ onClose }) => {
  const { player1, player2, gameStats } = useGame();

  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="stats-overlay">
      <div className="stats-modal">
        <h2>Game Statistics</h2>
        
        <div className="stats-summary">
          <div className="stats-card">
            <h3>Overall Stats</h3>
            <div className="stat-item">
              <span>Total Games:</span>
              <span>{gameStats.totalGames}</span>
            </div>
            <div className="stat-item">
              <span>X Wins:</span>
              <span>{gameStats.xWins}</span>
            </div>
            <div className="stat-item">
              <span>O Wins:</span>
              <span>{gameStats.oWins}</span>
            </div>
            <div className="stat-item">
              <span>Draws:</span>
              <span>{gameStats.draws}</span>
            </div>
          </div>
          
          <div className="stats-card">
            <h3>{player1.name}</h3>
            <div className="stat-item">
              <span>Wins:</span>
              <span>{player1.wins}</span>
            </div>
            <div className="stat-item">
              <span>Losses:</span>
              <span>{player1.losses}</span>
            </div>
            <div className="stat-item">
              <span>Draws:</span>
              <span>{player1.draws}</span>
            </div>
            <div className="stat-item">
              <span>Win Rate:</span>
              <span>
                {player1.wins + player1.losses + player1.draws > 0
                  ? Math.round((player1.wins / (player1.wins + player1.losses + player1.draws)) * 100) + '%'
                  : '0%'}
              </span>
            </div>
          </div>
          
          <div className="stats-card">
            <h3>{player2.name}</h3>
            <div className="stat-item">
              <span>Wins:</span>
              <span>{player2.wins}</span>
            </div>
            <div className="stat-item">
              <span>Losses:</span>
              <span>{player2.losses}</span>
            </div>
            <div className="stat-item">
              <span>Draws:</span>
              <span>{player2.draws}</span>
            </div>
            <div className="stat-item">
              <span>Win Rate:</span>
              <span>
                {player2.wins + player2.losses + player2.draws > 0
                  ? Math.round((player2.wins / (player2.wins + player2.losses + player2.draws)) * 100) + '%'
                  : '0%'}
              </span>
            </div>
          </div>
        </div>
        
        <div className="game-history">
          <h3>Recent Games</h3>
          {gameStats.history.length > 0 ? (
            <div className="history-list">
              {gameStats.history.slice().reverse().map((game, index) => (
                <div key={index} className="history-item">
                  <div className="history-result">
                    {game.winner ? `${game.winner === 'X' ? player1.name : player2.name} won` : 'Draw'}
                  </div>
                  <div className="history-date">{formatDate(game.date)}</div>
                </div>
              ))}
            </div>
          ) : (
            <p className="no-history">No games played yet</p>
          )}
        </div>
        
        <button className="close-button" onClick={onClose}>Close</button>
      </div>
    </div>
  );
};

export default GameStats;