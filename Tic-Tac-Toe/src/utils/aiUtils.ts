/**
 * AI Opponent Utilities for Tic-Tac-Toe
 * Provides different difficulty levels for AI opponent
 */

type Board = (string | null)[];

// Get all empty squares on the board
const getEmptySquares = (squares: Board): number[] => {
  return squares
    .map((square, index) => (square === null ? index : null))
    .filter((index): index is number => index !== null);
};

// Check if a move would result in a win
const isWinningMove = (squares: Board, index: number, symbol: string): boolean => {
  const boardCopy = [...squares];
  boardCopy[index] = symbol;
  
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (boardCopy[a] && boardCopy[a] === boardCopy[b] && boardCopy[a] === boardCopy[c]) {
      return true;
    }
  }
  
  return false;
};

// Easy difficulty: Random moves
export const makeEasyMove = (squares: Board, symbol: string): number => {
  const emptySquares = getEmptySquares(squares);
  if (emptySquares.length === 0) return -1;
  
  // Choose a random empty square
  const randomIndex = Math.floor(Math.random() * emptySquares.length);
  return emptySquares[randomIndex];
};

// Medium difficulty: Block opponent's winning moves or make winning moves when possible, otherwise random
export const makeMediumMove = (squares: Board, symbol: string): number => {
  const emptySquares = getEmptySquares(squares);
  if (emptySquares.length === 0) return -1;
  
  const opponentSymbol = symbol === 'X' ? 'O' : 'X';
  
  // Check if AI can win in the next move
  for (const square of emptySquares) {
    if (isWinningMove(squares, square, symbol)) {
      return square;
    }
  }
  
  // Check if opponent can win in the next move and block
  for (const square of emptySquares) {
    if (isWinningMove(squares, square, opponentSymbol)) {
      return square;
    }
  }
  
  // Take center if available
  if (emptySquares.includes(4)) {
    return 4;
  }
  
  // Choose a random move
  const randomIndex = Math.floor(Math.random() * emptySquares.length);
  return emptySquares[randomIndex];
};

// Hard difficulty: Minimax algorithm for optimal play
export const makeHardMove = (squares: Board, symbol: string): number => {
  const emptySquares = getEmptySquares(squares);
  if (emptySquares.length === 0) return -1;
  
  const opponentSymbol = symbol === 'X' ? 'O' : 'X';
  
  // If board is empty or nearly empty, use some strategy to vary gameplay
  if (emptySquares.length >= 8) {
    // On first move, prefer corners or center
    const preferredMoves = [0, 2, 4, 6, 8];
    const availablePreferred = preferredMoves.filter(move => emptySquares.includes(move));
    if (availablePreferred.length > 0) {
      return availablePreferred[Math.floor(Math.random() * availablePreferred.length)];
    }
  }
  
  // Use minimax for optimal play
  let bestScore = -Infinity;
  let bestMove = -1;
  
  for (const square of emptySquares) {
    const boardCopy = [...squares];
    boardCopy[square] = symbol;
    
    const score = minimax(boardCopy, 0, false, symbol, opponentSymbol);
    
    if (score > bestScore) {
      bestScore = score;
      bestMove = square;
    }
  }
  
  return bestMove;
};

// Minimax algorithm for finding optimal move
const minimax = (
  board: Board, 
  depth: number, 
  isMaximizing: boolean, 
  aiSymbol: string, 
  playerSymbol: string
): number => {
  // Check terminal states
  const winner = checkWinner(board);
  
  if (winner === aiSymbol) return 10 - depth;
  if (winner === playerSymbol) return depth - 10;
  if (getEmptySquares(board).length === 0) return 0;
  
  if (isMaximizing) {
    let bestScore = -Infinity;
    for (const square of getEmptySquares(board)) {
      const boardCopy = [...board];
      boardCopy[square] = aiSymbol;
      const score = minimax(boardCopy, depth + 1, false, aiSymbol, playerSymbol);
      bestScore = Math.max(score, bestScore);
    }
    return bestScore;
  } else {
    let bestScore = Infinity;
    for (const square of getEmptySquares(board)) {
      const boardCopy = [...board];
      boardCopy[square] = playerSymbol;
      const score = minimax(boardCopy, depth + 1, true, aiSymbol, playerSymbol);
      bestScore = Math.min(score, bestScore);
    }
    return bestScore;
  }
};

// Helper function to check winner for minimax
const checkWinner = (board: Board): string | null => {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      return board[a];
    }
  }
  
  return null;
};

// Make a move based on the selected difficulty
export const makeAIMove = (
  squares: Board, 
  symbol: string, 
  difficulty: 'easy' | 'medium' | 'hard'
): number => {
  switch (difficulty) {
    case 'easy':
      return makeEasyMove(squares, symbol);
    case 'medium':
      return makeMediumMove(squares, symbol);
    case 'hard':
      return makeHardMove(squares, symbol);
    default:
      return makeEasyMove(squares, symbol);
  }
};