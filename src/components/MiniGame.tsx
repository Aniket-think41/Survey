import { useState, useEffect, useCallback, useRef } from 'react';
import { Gamepad2, Trophy, RefreshCw, Zap } from 'lucide-react';

const EMOJIS = ['⚡', '🔥', '💫', '⭐', '✨', '🌟', '💥', '🎯'];
const GAME_DURATION = 15;

type Target = {
  id: number;
  x: number;
  y: number;
  emoji: string;
  visible: boolean;
};

export default function MiniGame() {
  const [playing, setPlaying] = useState(false);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(GAME_DURATION);
  const [targets, setTargets] = useState<Target[]>([]);
  const [bestScore, setBestScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const targetIdRef = useRef(0);

  const startGame = () => {
    setPlaying(true);
    setScore(0);
    setTimeLeft(GAME_DURATION);
    setGameOver(false);
    setTargets([]);
  };

  const spawnTarget = useCallback(() => {
    const id = targetIdRef.current++;
    const newTarget: Target = {
      id,
      x: 10 + Math.random() * 80,
      y: 10 + Math.random() * 70,
      emoji: EMOJIS[Math.floor(Math.random() * EMOJIS.length)],
      visible: true,
    };
    setTargets((prev) => [...prev, newTarget]);
    setTimeout(() => {
      setTargets((prev) => prev.filter((t) => t.id !== id));
    }, 1500);
  }, []);

  useEffect(() => {
    if (!playing) return;
    const spawnInterval = setInterval(spawnTarget, 700);
    const timer = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) {
          setPlaying(false);
          setGameOver(true);
          setTargets([]);
          return 0;
        }
        return t - 1;
      });
    }, 1000);
    return () => {
      clearInterval(spawnInterval);
      clearInterval(timer);
    };
  }, [playing, spawnTarget]);

  const hitTarget = (id: number) => {
    setTargets((prev) => prev.filter((t) => t.id !== id));
    setScore((s) => {
      const newScore = s + 1;
      if (newScore > bestScore) setBestScore(newScore);
      return newScore;
    });
  };

  return (
    <section id="game" className="relative py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-orange-50/30 to-white">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-orange-100 border border-orange-200 mb-4">
            <Gamepad2 className="w-4 h-4 text-orange-500" />
            <span className="text-orange-600 text-sm font-medium">Mini Game</span>
          </div>
          <h2 className="text-4xl sm:text-5xl font-bold text-slate-900 mb-4">
            Catch the{' '}
            <span className="bg-gradient-to-r from-orange-500 to-rose-500 bg-clip-text text-transparent">
              Anime Sparks
            </span>
          </h2>
          <p className="text-slate-500">
            Tap as many sparks as you can in {GAME_DURATION} seconds!
          </p>
        </div>

        <div className="bg-white border border-slate-200 rounded-3xl shadow-xl shadow-orange-500/5 overflow-hidden">
          {/* Game header */}
          <div className="flex items-center justify-between p-4 bg-slate-50 border-b border-slate-200">
            <div className="flex items-center gap-2">
              <Trophy className="w-5 h-5 text-amber-500" />
              <span className="text-sm font-bold text-slate-700">Score: {score}</span>
            </div>
            <div className="flex items-center gap-2">
              <Zap className="w-5 h-5 text-orange-500" />
              <span className={`text-sm font-bold ${timeLeft <= 5 ? 'text-red-500' : 'text-slate-700'}`}>
                {timeLeft}s
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Trophy className="w-5 h-5 text-amber-400 fill-amber-400" />
              <span className="text-sm font-bold text-slate-700">Best: {bestScore}</span>
            </div>
          </div>

          {/* Game area */}
          <div className="relative h-80 sm:h-96 bg-gradient-to-br from-rose-50 via-orange-50 to-amber-50 overflow-hidden">
            {!playing && !gameOver && (
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <div className="text-6xl mb-4 animate-float">⚡</div>
                <button onClick={startGame}
                  className="px-8 py-4 bg-gradient-to-r from-orange-500 to-rose-500 text-white font-bold rounded-2xl shadow-lg shadow-orange-500/30 hover:scale-105 transition-all duration-300 flex items-center gap-2 text-lg">
                  <Gamepad2 className="w-6 h-6" />
                  Start Game
                </button>
              </div>
            )}

            {gameOver && (
              <div className="absolute inset-0 flex flex-col items-center justify-center animate-pop">
                <div className="text-5xl mb-2">{score >= 15 ? '🎉' : score >= 8 ? '⭐' : '💪'}</div>
                <h3 className="text-2xl font-bold text-slate-900 mb-1">Game Over!</h3>
                <p className="text-slate-500 mb-4">You caught <span className="font-bold text-orange-500">{score}</span> sparks!</p>
                <button onClick={startGame}
                  className="px-6 py-3 bg-gradient-to-r from-orange-500 to-rose-500 text-white font-semibold rounded-xl hover:scale-105 transition-transform flex items-center gap-2">
                  <RefreshCw className="w-5 h-5" />
                  Play Again
                </button>
              </div>
            )}

            {playing && targets.map((target) => (
              <button
                key={target.id}
                onClick={() => hitTarget(target.id)}
                className="absolute text-3xl animate-pop hover:scale-125 transition-transform"
                style={{
                  left: `${target.x}%`,
                  top: `${target.y}%`,
                  animation: 'pop 0.2s ease-out, float 2s ease-in-out infinite',
                }}
              >
                {target.emoji}
              </button>
            ))}
          </div>
        </div>

        {bestScore > 0 && (
          <p className="text-center text-sm text-slate-400 mt-4">
            Your best score: {bestScore} sparks caught!
          </p>
        )}
      </div>
    </section>
  );
}
