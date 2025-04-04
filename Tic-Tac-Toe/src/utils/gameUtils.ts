export interface WinnerInfo {
  winner: string | null;
  winningLine: number[] | null;
}

export function calculateWinner(squares: (string | null)[]): string | null;
export function calculateWinner(squares: (string | null)[], returnLine?: boolean): string | null | WinnerInfo;
export function calculateWinner(squares: (string | null)[], returnLine: boolean = false) {
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
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return returnLine 
        ? { winner: squares[a], winningLine: lines[i] } 
        : squares[a];
    }
  }
  
  return returnLine ? { winner: null, winningLine: null } : null;
}