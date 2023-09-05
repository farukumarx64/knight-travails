// Define chessboard dimensions
const boardSize = 8;

// Initialize the chessboard
const board = document.getElementById('board');
const squares = [];

for (let i = 0; i < boardSize; i++) {
    for (let j = 0; j < boardSize; j++) {
        const square = document.createElement('div');
        square.className = 'square';
        square.id = `${i}-${j}`;
        square.style.backgroundColor = (i + j) % 2 === 0 ? '#CD853F' : '#D2B48C'; // Checkered pattern
        board.appendChild(square);
        squares.push([i, j]);
    }
}

// Define knight's possible moves
const knightMoves = [
    [-2, -1], [-2, 1], [-1, -2], [-1, 2],
    [1, -2], [1, 2], [2, -1], [2, 1]
];

// Function to check if a move is valid
function isValidMove(x, y) {
    return x >= 0 && x < boardSize && y >= 0 && y < boardSize;
}

// Function to generate a random color
function getRandomColor() {
  const letters = '0123456789ABCDEF';
  let color = '#';
  for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}

// Function to update the move display with detailed information and color
function updateMoveDisplay(move, moveNumber, color) {
  const moveDisplay = document.getElementById('move-display');
  const moveItem = document.createElement('li');
  moveItem.textContent = `Move ${moveNumber}: Knight moved from [${move[0]}, ${move[1]}] to [${move[2]}, ${move[3]}]`;
  moveItem.style.color = color;
  moveDisplay.appendChild(moveItem);
}

// Function to highlight the knight's position
function highlightKnight(square) {
  const squareElement = document.getElementById(square[0] + '-' + square[1]);
  squareElement.classList.add('knight');
}

// Function to highlight a square on the path
function highlightPathSquare(square) {
  const squareElement = document.getElementById(square[0] + '-' + square[1]);
  squareElement.classList.add('path');
}

// BFS Algorithm to find the shortest path
function findShortestPath(start, end) {
  const queue = [];
  const visited = new Set();
  const parent = {};

  queue.push([...start, 0]);
  visited.add(JSON.stringify(start));

  while (queue.length > 0) {
      const current = queue.shift();

      if (JSON.stringify(current.slice(0, 2)) === JSON.stringify(end)) {
          // Build and return the path
          const path = [end];
          let node = end; 
          let moveNumber = 1;
          while (JSON.stringify(node) !== JSON.stringify(start)) {
              const parentKey = JSON.stringify(node);
              node = parent[parentKey][0];
              path.unshift(node);
              const source = JSON.parse(parentKey);
              const destination = node;
              const color = getRandomColor();
              updateMoveDisplay([...source, ...destination], moveNumber, color);
              moveNumber++;
          }

          // Highlight the path with a unique color
          path.forEach((square, index) => {
              highlightPathSquare(square);
          });

          return path;
      }

      for (const move of knightMoves) {
          const x = current[0] + move[0];
          const y = current[1] + move[1];
          const next = [x, y];
          const moveNumber = current[2] + 1;

          if (isValidMove(x, y) && !visited.has(JSON.stringify(next))) {
              queue.push([...next, moveNumber]);
              visited.add(JSON.stringify(next));
              parent[JSON.stringify(next)] = [current.slice(0, 2), moveNumber];
          }
      }
  }

  // If no path is found, return an empty array
  return [];
}

// Example usage
const startSquare = [3, 3];
const endSquare = [4, 3];
const path = findShortestPath(startSquare, endSquare);

console.log(`You made it in ${path.length - 1} moves! Here's your path:`);
console.log(path);

// Highlight the knight's starting position
highlightKnight(startSquare);

