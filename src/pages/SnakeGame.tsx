import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import PageWrapper from '../components/PageWrapper';
import Card from '../components/ui/Card';
import { useHandTracking, HandDirection } from '../hooks/useHandTracking';
import { motion, AnimatePresence } from 'framer-motion';
import { Camera, Gamepad2, Keyboard } from 'lucide-react';

const GRID_SIZE = 20;
const CANVAS_SIZE = 400;
const TILE_SIZE = CANVAS_SIZE / GRID_SIZE;

type Snake = { x: number; y: number }[];
type Food = { x: number; y: number };
type Direction = 'UP' | 'DOWN' | 'LEFT' | 'RIGHT';

const SnakeGame = () => {
  const { t } = useTranslation();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { videoRef, direction: handDirection, isLoading: isHandTrackingLoading, error: handTrackingError, initializeHandTracking, shutdown: shutdownHandTracking } = useHandTracking();

  const [snake, setSnake] = useState<Snake>([{ x: 10, y: 10 }]);
  const [food, setFood] = useState<Food>({ x: 15, y: 15 });
  const [direction, setDirection] = useState<Direction>('RIGHT');
  const [score, setScore] = useState(0);
  const [isGameOver, setIsGameOver] = useState(false);
  const [isGameStarted, setIsGameStarted] = useState(false);
  const [isPaused, setIsPaused] = useState(true);
  const [inputMode, setInputMode] = useState<'keyboard' | 'hand'>('keyboard');
  const [handTrackingInitialized, setHandTrackingInitialized] = useState(false);

  const createFood = (currentSnake: Snake): Food => {
    let newFood: Food;
    do {
      newFood = {
        x: Math.floor(Math.random() * GRID_SIZE),
        y: Math.floor(Math.random() * GRID_SIZE),
      };
    } while (currentSnake.some(segment => segment.x === newFood.x && segment.y === newFood.y));
    return newFood;
  };

  const resetGame = useCallback(() => {
    const initialSnake = [{ x: 10, y: 10 }];
    setSnake(initialSnake);
    setFood(createFood(initialSnake));
    setDirection('RIGHT');
    setScore(0);
    setIsGameOver(false);
    setIsPaused(false);
  }, []);

  const handleKeyDown = (e: KeyboardEvent) => {
    switch (e.key) {
      case 'ArrowUp': if (direction !== 'DOWN') setDirection('UP'); break;
      case 'ArrowDown': if (direction !== 'UP') setDirection('DOWN'); break;
      case 'ArrowLeft': if (direction !== 'RIGHT') setDirection('LEFT'); break;
      case 'ArrowRight': if (direction !== 'LEFT') setDirection('RIGHT'); break;
    }
  };

  // Handle input mode changes
  const switchToHandMode = async () => {
    setInputMode('hand');
    if (!handTrackingInitialized) {
      setHandTrackingInitialized(true);
      await initializeHandTracking();
    }
  };

  const switchToKeyboardMode = () => {
    setInputMode('keyboard');
    if (handTrackingInitialized) {
      shutdownHandTracking();
      setHandTrackingInitialized(false);
    }
  };

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [direction]);

  useEffect(() => {
    if (inputMode === 'hand') {
      if (handDirection === 'up' && direction !== 'DOWN') setDirection('UP');
      if (handDirection === 'down' && direction !== 'UP') setDirection('DOWN');
      if (handDirection === 'left' && direction !== 'RIGHT') setDirection('LEFT');
      if (handDirection === 'right' && direction !== 'LEFT') setDirection('RIGHT');
    }
  }, [handDirection, direction, inputMode]);

  useEffect(() => {
    if (!isGameStarted || isPaused || isGameOver) return;

    const gameLoop = setInterval(() => {
      setSnake(prevSnake => {
        const newSnake = [...prevSnake];
        const head = { ...newSnake[0] };

        switch (direction) {
          case 'UP': head.y -= 1; break;
          case 'DOWN': head.y += 1; break;
          case 'LEFT': head.x -= 1; break;
          case 'RIGHT': head.x += 1; break;
        }

        // Wall collision
        if (head.x < 0 || head.x >= GRID_SIZE || head.y < 0 || head.y >= GRID_SIZE) {
          setIsGameOver(true);
          return newSnake;
        }

        // Self collision
        for (let i = 1; i < newSnake.length; i++) {
          if (head.x === newSnake[i].x && head.y === newSnake[i].y) {
            setIsGameOver(true);
            return newSnake;
          }
        }

        newSnake.unshift(head);

        // Food collision
        if (head.x === food.x && head.y === food.y) {
          setScore(s => s + 10);
          setFood(createFood(newSnake));
        } else {
          newSnake.pop();
        }

        return newSnake;
      });
    }, 250 - (score / 2)); // Speed increases slower with score

    return () => clearInterval(gameLoop);
  }, [isGameStarted, isPaused, isGameOver, direction, food, score]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);
    
    // Draw grid
    ctx.strokeStyle = 'hsl(var(--foreground) / 0.05)';
    for(let i = 0; i < GRID_SIZE; i++) {
        for(let j = 0; j < GRID_SIZE; j++) {
            ctx.strokeRect(i * TILE_SIZE, j * TILE_SIZE, TILE_SIZE, TILE_SIZE);
        }
    }

    // Draw snake
    ctx.fillStyle = '#00d9ff'; // Cyan color
    snake.forEach((segment, index) => {
      ctx.globalAlpha = 1 - (index / (snake.length + 5));
      ctx.fillRect(segment.x * TILE_SIZE, segment.y * TILE_SIZE, TILE_SIZE, TILE_SIZE);
      ctx.globalAlpha = 1;
    });

    // Draw food
    ctx.fillStyle = 'hsl(var(--accent))';
    ctx.shadowColor = 'hsl(var(--accent))';
    ctx.shadowBlur = 10;
    ctx.fillRect(food.x * TILE_SIZE, food.y * TILE_SIZE, TILE_SIZE, TILE_SIZE);
    ctx.shadowBlur = 0;

  }, [snake, food, isGameStarted]);

  const startGame = () => {
    setIsGameStarted(true);
    resetGame();
  };

  return (
    <PageWrapper>
      <div className="py-6 space-y-4 text-center">
        <h1 className="text-3xl font-bold text-foreground">{t('snake_game_page.title')}</h1>
        <div className="flex justify-center gap-4 items-center">
          <p className="text-lg text-secondary">{t('snake_game_page.score')}: {score}</p>
          <div className="flex gap-2">
            <button
              onClick={switchToHandMode}
              className={`px-3 py-1 rounded-full text-sm font-medium transition-all ${
                inputMode === 'hand'
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-card border border-white/10 text-secondary hover:text-foreground'
              }`}
            >
              <Camera className="inline w-4 h-4 mr-1" /> Hand
            </button>
            <button
              onClick={switchToKeyboardMode}
              className={`px-3 py-1 rounded-full text-sm font-medium transition-all ${
                inputMode === 'keyboard'
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-card border border-white/10 text-secondary hover:text-foreground'
              }`}
            >
              <Keyboard className="inline w-4 h-4 mr-1" /> Keyboard
            </button>
          </div>
        </div>
        
        <Card className="max-w-max mx-auto !p-2 relative">
          <canvas ref={canvasRef} width={CANVAS_SIZE} height={CANVAS_SIZE} className="rounded-lg" />
          {isGameStarted && (
            <div className="absolute top-2 right-2 bg-card/80 backdrop-blur px-3 py-1 rounded-full text-sm text-secondary">
              {inputMode === 'hand' ? `Direction: ${handDirection}` : 'Keyboard Mode'}
            </div>
          )}
          <AnimatePresence>
            {!isGameStarted && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-card/80 backdrop-blur-sm flex flex-col items-center justify-center rounded-lg p-4">
                {isHandTrackingLoading ? (
                  <>
                    <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mb-4"></div>
                    <p className="font-semibold text-foreground">{t('snake_game_page.loading_model')}</p>
                  </>
                ) : (
                  <>
                    <h2 className="text-xl font-bold mb-4">{t('snake_game_page.instructions_title')}</h2>
                    <div className="space-y-3 text-left">
                      <div className="flex items-center space-x-3"><Camera className="text-primary w-6 h-6 shrink-0"/><span>{t('snake_game_page.instructions_cam')}</span></div>
                      <div className="flex items-center space-x-3"><Keyboard className="text-primary w-6 h-6 shrink-0"/><span>{t('snake_game_page.instructions_keys')}</span></div>
                    </div>
                    {handTrackingError && (
                      <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-3 mt-4">
                        <p className="text-red-400 text-sm mb-2 font-semibold">⚠️ Hand Detection Issue:</p>
                        <p className="text-red-300 text-xs whitespace-pre-wrap">{handTrackingError}</p>
                        <p className="text-red-300 text-xs mt-2">💡 Tip: Use Keyboard Mode (arrow keys) instead!</p>
                      </div>
                    )}
                    <button onClick={startGame} className="mt-6 bg-primary text-primary-foreground font-bold py-3 px-8 rounded-full hover:bg-primary/90 transition-colors transform hover:scale-105">
                      {t('snake_game_page.start_game')}
                    </button>
                  </>
                )}
              </motion.div>
            )}
          </AnimatePresence>
          <AnimatePresence>
            {isGameOver && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-card/80 backdrop-blur-sm flex flex-col items-center justify-center rounded-lg">
                <h2 className="text-4xl font-bold text-red-500">{t('snake_game_page.game_over')}</h2>
                <p className="text-xl mt-2">{t('snake_game_page.score')}: {score}</p>
                <button onClick={resetGame} className="mt-6 bg-primary text-primary-foreground font-bold py-2 px-6 rounded-full hover:bg-primary/90 transition-colors">
                  {t('snake_game_page.play_again')}
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </Card>
        <video ref={videoRef} className="absolute -z-10 w-32 h-24 top-0 left-0 opacity-20" muted playsInline />
      </div>
    </PageWrapper>
  );
};

export default SnakeGame;
