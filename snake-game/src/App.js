import React, { useState, useEffect } from 'react';
import './App.css';

const BOARD_SIZE = 10;
const DIRECTIONS = {
  UP: { x: 0, y: -1 },
  DOWN: { x: 0, y: 1 },
  LEFT: { x: -1, y: 0 },
  RIGHT: { x: 1, y: 0 },
};

function App() {
  const [snake, setSnake] = useState([{ x: 2, y: 2 }]);
  const [food, setFood] = useState({ x: 5, y: 5 });
  const [direction, setDirection] = useState(DIRECTIONS.RIGHT);
  const [gameOver, setGameOver] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e) => {
      switch (e.key) {
        case 'ArrowUp':
          setDirection(DIRECTIONS.UP);
          break;
        case 'ArrowDown':
          setDirection(DIRECTIONS.DOWN);
          break;
        case 'ArrowLeft':
          setDirection(DIRECTIONS.LEFT);
          break;
        case 'ArrowRight':
          setDirection(DIRECTIONS.RIGHT);
          break;
        default:
          break;
      }
    };
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  useEffect(() => {
    if (gameOver) return;

    const interval = setInterval(() => {
      setSnake((prevSnake) => {
        const newSnake = [...prevSnake];
        const head = newSnake[newSnake.length - 1];
        const newHead = {
          x: head.x + direction.x,
          y: head.y + direction.y,
        };

        // Check for collisions
        if (
          newHead.x < 0 ||
          newHead.x >= BOARD_SIZE ||
          newHead.y < 0 ||
          newHead.y >= BOARD_SIZE ||
          newSnake.some((segment) => segment.x === newHead.x && segment.y === newHead.y)
        ) {
          setGameOver(true);
          return prevSnake;
        }

        newSnake.push(newHead);

        // Check if food is eaten
        if (newHead.x === food.x && newHead.y === food.y) {
          setFood({
            x: Math.floor(Math.random() * BOARD_SIZE),
            y: Math.floor(Math.random() * BOARD_SIZE),
          });
        } else {
          newSnake.shift();
        }

        return newSnake;
      });
    }, 200);

    return () => clearInterval(interval);
  }, [direction, food, gameOver]);

  return (
    <div className="App">
      <h1>Snake Game</h1>
      {gameOver ? <h2>Game Over</h2> : null}
      <div className="board">
        {[...Array(BOARD_SIZE)].map((_, row) => (
          <div key={row} className="row">
            {[...Array(BOARD_SIZE)].map((_, col) => (
              <div
                key={col}
                className={`cell ${
                  snake.some((segment) => segment.x === col && segment.y === row)
                    ? 'snake'
                    : food.x === col && food.y === row
                    ? 'food'
                    : ''
                }`}
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
