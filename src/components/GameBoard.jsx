import { useState, useEffect } from "react";
import "../App.css";

const GameBoard = () => {
  const [tiles, setTiles] = useState([]);
  const size = 4;

  function radomizeArr() {
    let arr = Array.from({ length: 16 }).map((_, i) => (i < 15 ? i + 1 : 0));
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  }

  function isSolvable(gameArr) {
    const tempGameArr = JSON.parse(JSON.stringify(gameArr));
    let inversion = 0;
    for (let i = 0; i < tempGameArr.length; i++) {
      for (let j = i + 1; j < tempGameArr.length; j++) {
        if (
          tempGameArr[i] &&
          tempGameArr[j] &&
          tempGameArr[i] > tempGameArr[j]
        ) {
          inversion++;
        }
      }
    }
    return inversion % 2 === 0;
  }

  const canSolve = isSolvable(tiles);

  function handleSwitch(index) {
    const tempArr = [...tiles];
    const emptyId = tiles.indexOf(0);
    let adjacent = [
      emptyId - 4 >= 0 ? emptyId - 4 : -1, //up
      emptyId + 4 < 16 ? emptyId + 4 : -1, // down
      emptyId % 4 !== 0 ? emptyId - 1 : -1, // left;
      (emptyId + 1) % 4 !== 0 ? emptyId + 1 : -1, // right
    ];

    if (!adjacent.includes(index)) {
      return;
    }
    [tempArr[emptyId], tempArr[index]] = [tempArr[index], tempArr[emptyId]];
    setTiles(tempArr);
  }

  // Manhattan distance heuristic calculation
  const manhattan = (index, value) => {
    const targetX = (value - 1) % size;
    const targetY = Math.floor((value - 1) / size);
    const x = index % size;
    const y = Math.floor(index / size);
    return Math.abs(x - targetX) + Math.abs(y - targetY);
  };

  // Get all possible moves from the current state
  const getNeighbors = (board) => {
    const emptyIndex = board.indexOf(0);
    const neighbors = [];
    const moves = {
      up: emptyIndex - size >= 0 ? emptyIndex - size : -1,
      down: emptyIndex + size < 16 ? emptyIndex + size : -1,
      left: emptyIndex % size !== 0 ? emptyIndex - 1 : -1,
      right: (emptyIndex + 1) % size !== 0 ? emptyIndex + 1 : -1,
    };

    Object.entries(moves)
      .filter(([, index]) => index !== -1)
      .forEach(([direction, newIndex]) => {
        const newBoard = [...board];
        [newBoard[emptyIndex], newBoard[newIndex]] = [
          newBoard[newIndex],
          newBoard[emptyIndex],
        ];
        const moveCost = calculateCost(newBoard); // Function to calculate total cost based on heuristic
        neighbors.push({ board: newBoard, move: direction, cost: moveCost });
      });

    return neighbors;
  };

  // Function to calculate total cost for a board state
  const calculateCost = (board) => {
    return board.reduce(
      (total, num, idx) => total + (num ? manhattan(idx, num) : 0),
      0
    );
  };

  // Find the best move considering the cost
  const findBestMove = (neighbors) => {
    return neighbors.reduce((best, current) => {
      return current.cost < best.cost ? current : best;
    });
  };

  // Solve step with improved logic
  const solveStep = () => {
    const neighbors = getNeighbors(tiles);
    if (neighbors.length > 0) {
      const bestMove = findBestMove(neighbors);
      setTiles(bestMove.board);
    }
  };

  useEffect(() => {
    setTiles(radomizeArr());
  }, []);

  return (
    <div className="game_board_container">
      <div>
        <h1 className="heading">15 Puzzle Game</h1>
      </div>
      <div className="action_btns">
        <button onClick={() => setTiles(radomizeArr())}>Shuffle</button>
        <button onClick={() => setTiles(radomizeArr())}>Reset</button>
        <button onClick={solveStep}>
          {canSolve ? "Solve" : "Not solvable"}
        </button>
      </div>
      <div className="board">
        {tiles.map((value, i) => (
          <button
            onClick={() => handleSwitch(i)}
            className={`${value === 0 ? "empty_num_box" : "num_box"} tiles`}
            key={value}
          >
            {value === 0 ? null : value}
          </button>
        ))}
      </div>
    </div>
  );
};

export default GameBoard;
