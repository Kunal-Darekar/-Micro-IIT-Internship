import React, { useState } from 'react';
import { useGame } from '../context/GameContext';
import '../styles/PlayerSettings.css';

type PlayerSettingsProps = {
  onClose: () => void;
};

const PlayerSettings: React.FC<PlayerSettingsProps> = ({ onClose }) => {
  const { player1, player2, updatePlayerName, resetStats, difficulty, setDifficulty } = useGame();
  
  const [player1Name, setPlayer1Name] = useState(player1.name);
  const [player2Name, setPlayer2Name] = useState(player2.name);
  const [selectedDifficulty, setSelectedDifficulty] = useState(difficulty);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Update player names if they're not empty
    if (player1Name.trim()) {
      updatePlayerName('X', player1Name.trim());
    }
    
    if (player2Name.trim()) {
      updatePlayerName('O', player2Name.trim());
    }
    
    // Update difficulty
    setDifficulty(selectedDifficulty);
    
    // Close settings modal
    onClose();
  };

  return (
    <div className="settings-overlay">
      <div className="settings-modal">
        <h2>Player Settings</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="player1Name">Player X Name:</label>
            <input
              type="text"
              id="player1Name"
              value={player1Name}
              onChange={(e) => setPlayer1Name(e.target.value)}
              maxLength={15}
              placeholder="Enter name for Player X"
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="player2Name">
              {selectedDifficulty === 'pvp' ? 'Player O Name:' : 'AI Name:'}
            </label>
            <input
              type="text"
              id="player2Name"
              value={player2Name}
              onChange={(e) => setPlayer2Name(e.target.value)}
              maxLength={15}
              placeholder={selectedDifficulty === 'pvp' ? 'Enter name for Player O' : 'Enter name for AI'}
              disabled={selectedDifficulty !== 'pvp'}
            />
          </div>
          
          <div className="form-group">
            <label>Game Mode:</label>
            <div className="radio-group">
              <label className="radio-label">
                <input
                  type="radio"
                  name="difficulty"
                  value="pvp"
                  checked={selectedDifficulty === 'pvp'}
                  onChange={() => {
                    setSelectedDifficulty('pvp');
                    setPlayer2Name(player2.name);
                  }}
                />
                Player vs Player
              </label>
              
              <label className="radio-label">
                <input
                  type="radio"
                  name="difficulty"
                  value="easy"
                  checked={selectedDifficulty === 'easy'}
                  onChange={() => {
                    setSelectedDifficulty('easy');
                    setPlayer2Name('AI (Easy)');
                  }}
                />
                AI: Easy
              </label>
              
              <label className="radio-label">
                <input
                  type="radio"
                  name="difficulty"
                  value="medium"
                  checked={selectedDifficulty === 'medium'}
                  onChange={() => {
                    setSelectedDifficulty('medium');
                    setPlayer2Name('AI (Medium)');
                  }}
                />
                AI: Medium
              </label>
              
              <label className="radio-label">
                <input
                  type="radio"
                  name="difficulty"
                  value="hard"
                  checked={selectedDifficulty === 'hard'}
                  onChange={() => {
                    setSelectedDifficulty('hard');
                    setPlayer2Name('AI (Hard)');
                  }}
                />
                AI: Hard
              </label>
            </div>
          </div>
          
          <div className="button-group">
            <button type="submit" className="save-button">Save Settings</button>
            <button type="button" className="reset-stats-button" onClick={resetStats}>Reset Stats</button>
            <button type="button" className="cancel-button" onClick={onClose}>Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PlayerSettings;