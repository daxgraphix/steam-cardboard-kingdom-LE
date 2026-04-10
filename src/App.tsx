import React, { lazy, Suspense, useCallback, useEffect, useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowLeft } from 'lucide-react';
import { SplashScreen } from './components/SplashScreen';
import { Dashboard } from './components/Dashboard';
import { LevelMap } from './components/LevelMap';
import { MissionBriefing } from './components/MissionBriefing';
import { WinModal } from './components/WinModal';
import { ParticleEffect } from './components/ui/ParticleEffect';
import { GlobalErrorBoundary } from './components/GlobalErrorBoundary';
import { LoadingFallback } from './components/LoadingFallback';
import { useAudio } from './hooks/useAudio';
import { useLocalStorageState } from './hooks/useLocalStorageState';
import { useParticles } from './hooks/useParticles';
import { Game, UserProfile, Difficulty } from './types';

const CircuitLogic = lazy(() => import('./games/CircuitLogic').then((module) => ({ default: module.CircuitLogic })));
const ShadowLab = lazy(() => import('./games/ShadowLab').then((module) => ({ default: module.ShadowLab })));
const PatternFactory = lazy(() => import('./games/PatternFactory').then((module) => ({ default: module.PatternFactory })));
const EcoSorter = lazy(() => import('./games/EcoSorter').then((module) => ({ default: module.EcoSorter })));
const GearEngineer = lazy(() => import('./games/GearEngineer').then((module) => ({ default: module.GearEngineer })));
const BlueprintBuild = lazy(() => import('./games/BlueprintBuild').then((module) => ({ default: module.BlueprintBuild })));
const WindPower = lazy(() => import('./games/WindPower').then((module) => ({ default: module.WindPower })));
const BinaryBits = lazy(() => import('./games/BinaryBits').then((module) => ({ default: module.BinaryBits })));

type Screen = 'splash' | 'dashboard' | 'map' | 'briefing' | 'play';

const defaultProfile: UserProfile = {
  points: 0,
  progress: {},
  settings: { volume: 0.5, haptics: true, difficulty: 'MEDIUM' },
};

const isValidDifficulty = (value: unknown): value is Difficulty =>
  value === 'EASY' || value === 'MEDIUM' || value === 'HARD';

const validateProfile = (value: unknown): UserProfile => {
  if (!value || typeof value !== 'object') return defaultProfile;

  const raw = value as {
    points?: unknown;
    progress?: unknown;
    settings?: { volume?: unknown; haptics?: unknown; difficulty?: unknown };
  };

  return {
    points: typeof raw.points === 'number' ? raw.points : defaultProfile.points,
    progress: raw.progress && typeof raw.progress === 'object' ? (raw.progress as Record<string, any>) : defaultProfile.progress,
    settings: {
      volume:
        typeof raw.settings?.volume === 'number'
          ? Math.min(1, Math.max(0, raw.settings.volume))
          : defaultProfile.settings.volume,
      haptics: typeof raw.settings?.haptics === 'boolean' ? raw.settings.haptics : defaultProfile.settings.haptics,
      difficulty: isValidDifficulty(raw.settings?.difficulty) ? raw.settings?.difficulty : defaultProfile.settings.difficulty,
    },
  };
};

const validateTheme = (value: unknown): boolean => value === 'dark';

export default function App() {
  const [screen, setScreen] = useState<Screen>('splash');
  const [game, setGame] = useState<Game | null>(null);
  const [level, setLevel] = useState(1);
  const [winData, setWinData] = useState<{ stars: number; xp: number } | null>(null);
  const [profile, setProfile] = useLocalStorageState<UserProfile>('steam_profile', defaultProfile, validateProfile);
  const [isDark, setIsDark] = useLocalStorageState<boolean>('theme', false, validateTheme);
  const [isChallengeMode, setIsChallengeMode] = useState(false);
  const audio = useAudio();
  const { triggers, spawnParticles } = useParticles();

  useEffect(() => {
    document.documentElement.classList.toggle('dark', isDark);
  }, [isDark]);

  useEffect(() => {
    if (audio.isOn) {
      audio.setVolume(profile.settings.volume);
    }
  }, [audio, profile.settings.volume]);

  const handleEnterLab = useCallback(
    async (e?: React.MouseEvent) => {
      if (e) spawnParticles(e.clientX, e.clientY, '#3b82f6');
      await audio.init();
      audio.play('pop');
      setScreen('dashboard');
    },
    [audio, spawnParticles]
  );

  const handleSelectGame = useCallback((selectedGame: Game) => {
    audio.play('click');
    setGame(selectedGame);
    setScreen('map');
  }, [audio]);

  const handleToBriefing = useCallback(
    (lvl: number) => {
      audio.play('click');
      setLevel(lvl);
      setScreen('briefing');
    },
    [audio]
  );

  const handleStartGame = useCallback(() => {
    audio.play('pop');
    setScreen('play');
  }, [audio]);

  const handleWin = useCallback(
    (stars: number, xp: number) => {
      audio.play('win');
      spawnParticles(window.innerWidth / 2, window.innerHeight / 2, '#22c55e');
      setWinData({ stars, xp });
    },
    [audio, spawnParticles]
  );

  const handleFailure = useCallback(() => {
    audio.play('incorrect');
    setScreen('map');
  }, [audio]);

  const handleNextLevel = useCallback(() => {
    if (!game || !winData) return;

    if (!isChallengeMode) {
      setProfile((current) => {
        const currentLvl = current.progress[game.id]?.level || 1;
        const nextLvl = Math.max(currentLvl, level + 1);

        return {
          ...current,
          points: current.points + winData.xp,
          progress: { ...current.progress, [game.id]: { level: nextLvl } },
        };
      });
    } else {
      setProfile((current) => ({ ...current, points: current.points + winData.xp }));
    }

    setWinData(null);

    if (level < 8 && !isChallengeMode) {
      setLevel((current) => current + 1);
      setScreen('briefing');
    } else {
      setScreen('map');
    }
  }, [game, isChallengeMode, level, setProfile, winData]);

  const handleExit = useCallback(() => {
    if (!game) return;

    if (winData) {
      setProfile((current) => {
        const currentLvl = current.progress[game.id]?.level || 1;
        const nextLvl = !isChallengeMode ? Math.max(currentLvl, level + 1) : currentLvl;

        return {
          ...current,
          points: current.points + winData.xp,
          progress: { ...current.progress, [game.id]: { level: nextLvl } },
        };
      });
    }

    setWinData(null);
    setScreen('map');
  }, [game, isChallengeMode, level, setProfile, winData]);

  const handleReset = useCallback(() => {
    setProfile(defaultProfile);
    setIsDark(false);
    setScreen('splash');
    window.localStorage.removeItem('steam_profile');
    window.localStorage.removeItem('theme');
  }, [setProfile, setIsDark]);

  const setVolume = useCallback(
    (value: number) => {
      setProfile((current) => ({
        ...current,
        settings: { ...current.settings, volume: Math.min(1, Math.max(0, value)) },
      }));
      audio.setVolume(value);
    },
    [audio, setProfile]
  );

  const setDifficulty = useCallback(
    (difficulty: Difficulty) => {
      setProfile((current) => ({
        ...current,
        settings: { ...current.settings, difficulty },
      }));
    },
    [setProfile]
  );

  const toggleHaptics = useCallback(() => {
    setProfile((current) => ({
      ...current,
      settings: { ...current.settings, haptics: !current.settings.haptics },
    }));
  }, [setProfile]);

  const gameElement = useMemo(() => {
    if (!game) return null;

    const props = {
      level,
      isChallenge: isChallengeMode,
      difficulty: profile.settings.difficulty,
      onComplete: handleWin,
      playSound: audio.play,
      onFailure: handleFailure,
    };

    switch (game.id) {
      case 'pipecleaner':
        return <CircuitLogic {...props} />;
      case 'shadows':
        return <ShadowLab {...props} />;
      case 'patterns':
        return <PatternFactory {...props} />;
      case 'sorting':
        return <EcoSorter {...props} />;
      case 'gears':
        return <GearEngineer {...props} />;
      case 'builder':
        return <BlueprintBuild {...props} />;
      case 'turbine':
        return <WindPower {...props} />;
      case 'binary':
        return <BinaryBits {...props} />;
      default:
        return null;
    }
  }, [audio.play, game, handleFailure, handleWin, isChallengeMode, level, profile.settings.difficulty]);

  return (
    <GlobalErrorBoundary>
      <div
        className="h-full min-h-screen w-full bg-slate-50 dark:bg-slate-950 text-slate-700 dark:text-slate-200 overflow-hidden font-sans"
        onClick={(e) => {
          if ((e.target as HTMLElement).tagName === 'BUTTON') {
            spawnParticles(e.clientX, e.clientY);
          }
        }}
      >
        {triggers.map(t => (
          <ParticleEffect key={t.id} x={t.x} y={t.y} color={t.color} />
        ))}
        <div className="fixed inset-0 pointer-events-none opacity-40 z-50 bg-[url('data:image/svg+xml,%3Csvg width=\'100\' height=\'100\' viewBox=\'0 0 100 100\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noise\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.8\' numOctaves=\'3\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noise)\' opacity=\'0.1\'/%3E%3C/svg%3E')]" />
        
        <AnimatePresence mode="wait">
          {screen === 'splash' && (
            <motion.div key="splash" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="h-full">
              <SplashScreen onEnter={handleEnterLab} />
            </motion.div>
          )}

          {screen === 'dashboard' && (
            <motion.div key="dashboard" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="h-full">
              <Dashboard 
                profile={profile}
                onSelectGame={handleSelectGame}
                toggleSound={audio.toggle}
                isSoundOn={audio.isOn}
                volume={profile.settings.volume}
                setVolume={setVolume}
                haptics={profile.settings.haptics}
                toggleHaptics={toggleHaptics}
                difficulty={profile.settings.difficulty}
                setDifficulty={setDifficulty}
                toggleTheme={() => setIsDark((prev) => !prev)}
                isDark={isDark}
                onReset={handleReset}
              />
            </motion.div>
          )}

        {screen === 'map' && game && (
          <motion.div key="map" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="h-full">
            <LevelMap 
              game={game}
              unlocked={profile.progress[game.id]?.level || 1}
              onSelect={handleToBriefing}
              onBack={() => setScreen('dashboard')}
              isChallengeMode={isChallengeMode}
              toggleChallenge={() => setIsChallengeMode(!isChallengeMode)}
            />
          </motion.div>
        )}

        {screen === 'briefing' && game && (
          <motion.div key="briefing" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="h-full">
            <MissionBriefing 
              game={game}
              level={level}
              isChallenge={isChallengeMode}
              onStart={handleStartGame}
              onBack={() => setScreen('map')}
            />
          </motion.div>
        )}

        {screen === 'play' && game && (
          <motion.div key="play" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="h-full flex flex-col">
            {winData && (
              <WinModal 
                xp={winData.xp}
                onNext={handleNextLevel}
                onMenu={handleExit}
                isChallenge={isChallengeMode}
              />
            )}
            <div className="h-16 px-4 flex items-center justify-between relative z-10 bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm border-b border-slate-200 dark:border-slate-800">
              <button 
                onClick={() => setScreen('map')} 
                className="p-2 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-full transition-colors"
              >
                <ArrowLeft className="w-6 h-6" />
              </button>
              <span className="font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest text-sm">
                {game.title} • {isChallengeMode ? 'CHALLENGE' : `MISSION ${level}`}
              </span>
              <div className="w-10" />
            </div>
            <div className="flex-grow overflow-hidden relative">
              <Suspense fallback={<LoadingFallback />}>
                {gameElement}
              </Suspense>
            </div>
          </motion.div>
        )}
        </AnimatePresence>
      </div>
    </GlobalErrorBoundary>
  );
}
